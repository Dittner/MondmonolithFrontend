import { AuthStatus, type User } from '../../../domain/DomainModel'
import { type RestApiCmd } from './RestApiCmd'
import { type RestApi } from '../RestApi'
import { SignupRequest } from '../Dto'

export class RequestVerificationCodeCmd implements RestApiCmd {
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
      user.authStatus = AuthStatus.REQUESTING_VERIFICATION_CODE
      console.log('RequestVerificationCodeCmd:: user:', this.email, '*****')

      this.api.headers = {}
      this.api.headers['Content-Type'] = 'application/json'
      this.send()
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

  private async send() {
    const path = '/signup/code'
    const method = 'POST'
    const request = new SignupRequest(this.email, this.pwd, '')
    const [response, _] = await this.api.sendRequest(method, path, request, false)
    const user = this.api.context.user

    if (response?.ok) {
      console.log('RequestVerificationCodeCmd:: verification code is generated und sent successfully')
      user.email = this.email
      user.pwd = this.pwd
      user.authStatus = AuthStatus.VERIFICATION_CODE_GENERATED
    } else {
      user.authStatus = AuthStatus.SIGNED_OUT
      window.localStorage.removeItem(this.api.SIGNED_IN_USER_ID)
      window.localStorage.removeItem(this.api.SIGNED_IN_USER_EMAIL)
      if (response) {
        const errDetails = await response.text()
        console.log('RequestVerificationCodeCmd:: errDetails:', errDetails)
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
