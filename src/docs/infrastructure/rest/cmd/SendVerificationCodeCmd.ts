import { AuthStatus, LoadStatus, type User } from '../../../domain/DomainModel'
import { type RestApiCmd } from './RestApiCmd'
import { type RestApi } from '../RestApi'
import { SignUpRequest, type UserDto } from '../Dto'

export class SendVerificationCodeCmd implements RestApiCmd {
  private readonly api: RestApi
  private readonly user: User
  private readonly verificationCode: string

  constructor(api: RestApi, user: User, verificationCode: string) {
    this.api = api
    this.user = user
    this.verificationCode = verificationCode
  }

  run() {
    const user = this.api.context.user
    if (user.authStatus === AuthStatus.VERIFICATION_CODE_GENERATED) {
      if (!this.validate(user)) return
      user.authStatus = AuthStatus.CHECKING_CODE
      console.log('SendVerificationCodeCmd, user:', this.user.email)

      this.api.headers = {}
      this.api.headers['Content-Type'] = 'application/json'
      this.send()
    }
  }

  private validate(user: User): boolean {
    if (!this.user.email) {
      user.authWithError = 'Email is required'
      return false
    }
    if (!this.user.pwd) {
      user.authWithError = 'Password is required'
      return false
    }
    user.authWithError = ''
    return true
  }

  private async send() {
    const path = '/signup'
    const method = 'POST'
    const request = new SignUpRequest(this.user.email, this.user.pwd, this.verificationCode)
    const [response, body] = await this.api.sendRequest(method, path, request, false)
    const user = this.api.context.user
    const dto = body as UserDto
    console.log('SendVerificationCodeCmd:: response body:', body)

    if (response?.ok && dto) {
      user.authStatus = AuthStatus.AUTHORIZED
      user.id = dto.id.toString()
      user.role = dto.role

      window.localStorage.setItem(this.api.TOKEN, dto.token)

      this.api.headers['Authorization'] = 'Bearer ' + dto.token

      if (this.api.context.dirList.loadStatus === LoadStatus.ERROR) {
        this.api.context.dirList.loadStatus = LoadStatus.PENDING
      }
    } else {
      user.authStatus = AuthStatus.VERIFICATION_CODE_GENERATED
      if (response) {
        const errDetails = await response.text()
        console.log('SignUpCmd, errDetails:', errDetails)
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
