import { AuthStatus, LoadStatus, type User } from '../../../domain/DomainModel'
import { type RestApiCmd } from './RestApiCmd'
import { type RestApi } from '../RestApi'
import { SignupRequest, type UserDto } from '../Dto'
import { Base64 } from '../Base64'

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

      this.api.headers = {}
      this.api.headers['Content-Type'] = 'application/json'
      this.api.headers['Authorization'] = 'basic ' + Base64.encode(this.email + ':' + this.pwd)

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
    const path = '/auth'
    const method = 'GET'
    const [response, body] = await this.api.sendRequest(method, path, null, false)
    const user = this.api.context.user
    const dto = body as UserDto
    console.log('AuthCmd.logIn, body:', body)

    if (response?.ok && dto) {
      user.authStatus = AuthStatus.AUTHORIZED
      user.id = dto.id.toString()
      user.role = dto.role
      user.email = this.email
      user.pwd = this.pwd

      window.localStorage.setItem(this.api.SIGNED_IN_USER_ID, user.id)
      window.localStorage.setItem(this.api.SIGNED_IN_USER_EMAIL, user.email)

      if (this.api.context.dirList.loadStatus === LoadStatus.ERROR) {
        this.api.context.dirList.loadStatus = LoadStatus.PENDING
      }
    } else {
      user.authStatus = AuthStatus.SIGNED_OUT
      window.localStorage.removeItem(this.api.SIGNED_IN_USER_ID)
      window.localStorage.removeItem(this.api.SIGNED_IN_USER_EMAIL)
      if (response) {
        const errDetails = await response.text()
        console.log('logIn, errDetails:', errDetails)
        if (response.status === 401 || response.status === 403) {
          user.authWithError = 'Incorrect email or password'
        } else if ((response.status === 400 || response.status === 409) && errDetails) {
          user.authWithError = errDetails
        } else if (response.status >= 500) {
          user.authWithError = response.status + ': Internal server error'
        } else {
          user.authWithError = response.status + ': Authentication is failed'
        }
      }
    }
  }
}
