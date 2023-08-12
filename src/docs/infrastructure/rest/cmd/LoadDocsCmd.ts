import { type Directory, Doc, LoadStatus } from '../../../domain/DomainModel'
import { type RestApiCmd } from './RestApiCmd'
import { type RestApi } from '../RestApi'
import { type DocDto } from '../Dto'

export class LoadDocsCmd implements RestApiCmd {
  private readonly api: RestApi
  private readonly dir: Directory

  constructor(api: RestApi, dir: Directory) {
    this.api = api
    this.dir = dir
  }

  run() {
    if (this.dir.loadStatus === LoadStatus.PENDING && !this.dir.isNew) {
      this.dir.loadStatus = LoadStatus.LOADING
      console.log('LoadDocsCmd running')
      this.loadDocs()
    }
  }

  private async loadDocs() {
    const path = '/dirs/' + this.dir.id + '/docs'
    const [response, body] = await this.api.sendRequest('GET', path)
    if (response?.ok) {
      const docsDto = body as DocDto[]
      if (docsDto) {
        this.dir.docs = docsDto.map(dto => new Doc(dto.id.toString(), dto.title))
      } else {
        this.dir.docs = []
      }

      this.dir.loadStatus = LoadStatus.LOADED
    } else {
      this.dir.loadStatus = LoadStatus.ERROR
    }
  }
}
