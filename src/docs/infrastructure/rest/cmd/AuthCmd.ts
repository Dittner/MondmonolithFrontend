import { AuthStatus, type User } from '../../../domain/DomainModel'
import { type RestApiCmd } from './RestApiCmd'
import { type RestApi } from '../RestApi'
import { Base64 } from '../Base64'
import { type UserDto } from '../Dto'

export class AuthCmd implements RestApiCmd {
  private readonly api: RestApi
  private readonly email: string
  private readonly pwd: string

  constructor(api: RestApi, email: string, pwd: string) {
    this.api = api
    this.email = email
    this.pwd = pwd
  }

  run() {
    const user = this.api.context.user
    if (user.authStatus === AuthStatus.SIGNED_OUT) {
      if (!this.validate(user)) return
      user.authStatus = AuthStatus.AUTHORIZING
      console.log('AuthCmd, user:', this.email, '*****')

      this.api.headers = {
        'Content-Type': 'application/json',
        'Authorization': 'basic ' + Base64.encode(this.email + ':' + this.pwd)
      }
      this.logIn()
    }
  }

  private validate(user: User): boolean {
    if (!this.email) {
      user.authWithError = 'Email is required'
      return false
    }
    if (!this.pwd) {
      user.authWithError = 'Password is required'
      return false
    }
    user.authWithError = ''
    return true
  }

  private async logIn() {
    const [response, body] = await this.api.sendRequest('GET', '/auth', null, false)
    const user = this.api.context.user
    const dto = body as UserDto

    if (response?.ok && dto) {
      user.authStatus = AuthStatus.AUTHORIZED
      user.id = dto.id.toString()
      user.role = dto.role
      user.email = this.email
      user.pwd = this.pwd

      window.localStorage.setItem(this.api.SIGNED_IN_USER_ID, user.id)
      window.localStorage.setItem(this.api.SIGNED_IN_USER_EMAIL, user.email)
      console.log('AuthCmd.logIn, body:', body)
    } else {
      user.authStatus = AuthStatus.SIGNED_OUT
      window.localStorage.removeItem(this.api.SIGNED_IN_USER_ID)
      window.localStorage.removeItem(this.api.SIGNED_IN_USER_EMAIL)
      if (response) {
        user.authWithError = response.status === 401 || response.status === 403
          ? 'Incorrect email or password'
          : response.status + ': Internal server error'
      }
    }
  }
}
