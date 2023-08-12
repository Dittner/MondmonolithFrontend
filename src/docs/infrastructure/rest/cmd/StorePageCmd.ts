import { type Doc, type Page } from '../../../domain/DomainModel'
import { type RestApiCmd } from './RestApiCmd'
import { type RestApi } from '../RestApi'
import { PageDto } from '../Dto'

export class StorePageCmd implements RestApiCmd {
  private readonly api: RestApi
  private readonly page: Page
  private readonly doc: Doc

  constructor(api: RestApi, page: Page, doc: Doc) {
    this.api = api
    this.page = page
    this.doc = doc
  }

  run() {
    if (!this.page.isStoring && !this.doc.isNew) {
      this.page.isStoring = true
      this.store()
    }
  }

  private async store() {
    const method = this.page.isNew ? 'POST' : 'PUT'
    const url = this.page.isNew
      ? '/dirs/' + this.doc.dir?.id + '/docs/' + this.doc.id + '/pages/create'
      : '/dirs/' + this.doc.dir?.id + '/docs/' + this.doc.id + '/pages/update'

    const requestBody = new PageDto(+this.page.id, +this.doc.id, this.page.title, this.page.blocks.map(p => p.text))
    const [response, responseBody] = await this.api.sendRequest(method, url, requestBody)

    if (response?.ok) {
      if (this.page.isNew) {
        const dto = responseBody as PageDto
        this.page.id = dto.id.toString()
        this.page.isNew = false
        this.doc.add(this.page)
      }
    }

    this.page.isStoring = false
  }
}
