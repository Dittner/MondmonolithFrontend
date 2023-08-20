import { type RestApiCmd } from './RestApiCmd'
import { type RestApi } from '../RestApi'
import { type UserDto } from '../Dto'

export class RefreshTokenCmd implements RestApiCmd {
  private readonly api: RestApi

  constructor(api: RestApi) {
    this.api = api
  }

  run() {
    console.log('RefreshTokenCmd, run')
    this.refresh()
  }

  private async refresh() {
    const path = '/auth/token'
    const method = 'GET'
    const [response, body] = await this.api.sendRequest(method, path, null, false)
    const user = this.api.context.user
    const dto = body as UserDto

    if (response?.ok && dto) {
      console.log('Token successful refreshed')
      window.localStorage.setItem(this.api.TOKEN, dto.token)
      this.api.headers['Authorization'] = 'Bearer ' + dto.token
    } else {
      console.warn('Refreshing token is failed')
    }
  }
}
