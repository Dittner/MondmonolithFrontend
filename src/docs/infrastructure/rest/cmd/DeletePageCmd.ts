import { type Page } from '../../../domain/DomainModel'
import { type RestApiCmd } from './RestApiCmd'
import { type RestApi } from '../RestApi'

export class DeletePageCmd implements RestApiCmd {
  private readonly api: RestApi
  private readonly page: Page

  constructor(api: RestApi, page: Page) {
    this.api = api
    this.page = page
  }

  run() {
    if (!this.page.isStoring && !this.page.isNew && this.page.doc) {
      this.page.isStoring = true
      this.deletePage()
    }
  }

  private async deletePage() {
    const url = '/dirs/' + this.page.doc?.dir?.id + '/docs/' + this.page.doc?.id + '/pages/' + this.page.id
    const [response, _] = await this.api.sendRequest('DELETE', url)

    if (response?.ok) {
      this.page.doc?.remove(this.page)
      this.page.dispose()
    }
  }
}
