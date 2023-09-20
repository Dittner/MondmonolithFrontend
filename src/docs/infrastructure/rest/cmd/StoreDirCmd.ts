import { type Directory } from '../../../domain/DomainModel'
import { type RestApiCmd } from './RestApiCmd'
import { type RestApi } from '../RestApi'
import { DirDto } from '../Dto'

export class StoreDirCmd implements RestApiCmd {
  private readonly api: RestApi
  private readonly dir: Directory

  constructor(api: RestApi, dir: Directory) {
    this.api = api
    this.dir = dir
  }

  run() {
    if (!this.dir.isStoring) {
      this.dir.isStoring = true
      this.store()
    }
  }

  private async store() {
    const method = this.dir.isNew ? 'POST' : 'PUT'
    const url = this.dir.isNew ? '/dirs/create' : '/dirs/update'
    const requestBody = new DirDto(+this.dir.id, this.dir.title)
    const [response, responseBody] = await this.api.sendRequest(method, url, requestBody)

    if (response?.ok) {
      if (this.dir.isNew) {
        const dto = responseBody as DirDto
        this.dir.id = dto.id.toString()
        this.dir.isNew = false
        this.api.context.dirList.add(this.dir)
      }
    }

    this.dir.isStoring = false
  }
}
