import { type Directory, type Doc } from '../../../domain/DomainModel'
import { type RestApiCmd } from './RestApiCmd'
import { type RestApi } from '../RestApi'
import { DocDto } from '../Dto'

export class StoreDocCmd implements RestApiCmd {
  private readonly api: RestApi
  private readonly doc: Doc
  private readonly dir: Directory

  constructor(api: RestApi, doc: Doc, dir: Directory) {
    this.api = api
    this.doc = doc
    this.dir = dir
  }

  run() {
    if (!this.doc.isStoring) {
      this.doc.isStoring = true
      this.store()
    }
  }

  private async store() {
    const method = this.doc.isNew ? 'POST' : 'PUT'
    const url = this.doc.isNew ? '/dirs/' + this.dir.id + '/docs/create' : '/dirs/' + this.doc.dir?.id + '/docs/update'
    const requestBody = new DocDto(+this.doc.id, +this.dir.id, this.doc.title, this.doc.publicKey)
    const [response, responseBody] = await this.api.sendRequest(method, url, requestBody)

    if (response?.ok) {
      if (this.doc.isNew) {
        const dto = responseBody as DocDto
        this.doc.id = dto.id.toString()
        this.doc.title = dto.title
        this.doc.isNew = false
        this.dir.add(this.doc)
      }
    }

    this.doc.isStoring = false
  }
}
