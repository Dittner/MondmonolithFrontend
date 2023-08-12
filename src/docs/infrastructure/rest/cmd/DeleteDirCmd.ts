import { type Directory } from '../../../domain/DomainModel'
import { type RestApiCmd } from './RestApiCmd'
import { type RestApi } from '../RestApi'

export class DeleteDirCmd implements RestApiCmd {
  private readonly api: RestApi
  private readonly dir: Directory

  constructor(api: RestApi, dir: Directory) {
    this.api = api
    this.dir = dir
  }

  run() {
    if (!this.dir.isStoring && !this.dir.isNew) {
      this.dir.isStoring = true
      this.deleteDoc()
    }
  }

  private async deleteDoc() {
    const url = '/dirs/' + this.dir.id
    const [response, _] = await this.api.sendRequest('DELETE', url)

    if (response?.ok) {
      this.api.context.dirList.remove(this.dir)
      this.dir.dispose()
    }
  }
}
