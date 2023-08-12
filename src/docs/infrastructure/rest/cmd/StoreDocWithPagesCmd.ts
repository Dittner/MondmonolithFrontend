import { type Directory, type Doc, type Page } from '../../../domain/DomainModel'
import { type RestApiCmd } from './RestApiCmd'
import { type RestApi } from '../RestApi'
import { DocDto, PageDto } from '../Dto'
import { Dialog } from '../../../application/Application'

export class StoreDocWithPagesCmd implements RestApiCmd {
  private readonly api: RestApi
  private readonly doc: Doc
  private readonly pages: Page[]
  private readonly dir: Directory
  private removeDuplicateDoc: Doc | undefined

  constructor(api: RestApi, doc: Doc, pages: Page[], dir: Directory) {
    this.api = api
    this.doc = doc
    this.pages = pages
    this.dir = dir
  }

  run() {
    if (!this.doc.isStoring) {
      this.doc.isStoring = true

      const duplicate = this.dir.docs.find(d => d.title === this.doc.title)
      if (duplicate) {
        const msg = `The directory «${this.dir.title}» already has the doc «${this.doc.title}». Do you want to overwrite it?`
        const overwriteDoc = () => {
          this.removeDuplicateDoc = duplicate
          this.store()
        }
        this.api.context.app.dialog = new Dialog('', msg, overwriteDoc, () => {})
      } else {
        this.store()
      }
    }
  }

  private async store() {
    const url = '/dirs/' + this.dir.id + '/docs/create'
    const requestBody = new DocDto(+this.doc.id, +this.dir.id, this.doc.title, this.doc.publicKey)
    const [response, responseBody] = await this.api.sendRequest('POST', url, requestBody)

    if (response?.ok) {
      const dto = responseBody as DocDto
      this.doc.id = dto.id.toString()
      this.doc.title = dto.title
      this.doc.isNew = false

      for (const page of this.pages) {
        const pageUrl = '/dirs/' + this.dir.id + '/docs/' + this.doc.id + '/pages/create'

        const pageRequestBody = new PageDto(-1, +this.doc.id, page.title, page.blocks.map(p => p.text))

        const [pageResponse, pageResponseBody] = await this.api.sendRequest('POST', pageUrl, pageRequestBody)
        const pageDto = pageResponseBody as PageDto
        if (pageResponse?.ok) {
          page.id = pageDto.id.toString()
        } else {
          return
        }
      }

      if (this.removeDuplicateDoc) {
        this.api.deleteDoc(this.removeDuplicateDoc)
      }
      this.doc.pages = this.pages
      this.dir.add(this.doc)
    }

    this.doc.isStoring = false
  }
}
