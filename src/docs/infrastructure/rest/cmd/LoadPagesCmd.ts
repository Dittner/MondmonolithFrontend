import { type Doc, DocLoadStatus, Page, PageBlock } from '../../../domain/DomainModel'
import { type RestApiCmd } from './RestApiCmd'
import { type RestApi } from '../RestApi'
import { type PageDto } from '../Dto'

export class LoadPagesCmd implements RestApiCmd {
  private readonly api: RestApi
  private readonly doc: Doc

  constructor(api: RestApi, doc: Doc) {
    this.api = api
    this.doc = doc
  }

  run() {
    if (this.doc.loadStatus === DocLoadStatus.HEADER_LOADED && !this.doc.isNew) {
      this.doc.loadStatus = DocLoadStatus.LOADING
      console.log('LoadPagesCmd running')
      this.loadPages()
    }
  }

  private async loadPages() {
    const path = '/dirs/' + this.doc.dir?.id + '/docs/' + this.doc.id + '/pages'
    const [response, body] = await this.api.sendRequest('GET', path)
    if (response?.ok) {
      const pagesDto = body as PageDto[]
      if (pagesDto) {
        this.doc.pages = pagesDto.map(dto => {
          const p = new Page(dto.id.toString(), dto.title)
          p.blocks = dto.blocks.map(b => new PageBlock(b))
          return p
        })
      } else {
        this.doc.pages = []
      }

      this.doc.loadStatus = DocLoadStatus.LOADED
    } else {
      this.doc.loadStatus = DocLoadStatus.ERROR
    }
  }
}
