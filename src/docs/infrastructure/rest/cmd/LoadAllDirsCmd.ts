import { Directory, type DirectoryList, LoadStatus } from '../../../domain/DomainModel'
import { type RestApiCmd } from './RestApiCmd'
import { type RestApi } from '../RestApi'
import { type DirDto } from '../Dto'

export class LoadAllDirsCmd implements RestApiCmd {
  private readonly api: RestApi
  private readonly dirList: DirectoryList

  constructor(api: RestApi, dirList: DirectoryList) {
    this.api = api
    this.dirList = dirList
  }

  run() {
    if (this.dirList.loadStatus === LoadStatus.PENDING) {
      this.dirList.loadStatus = LoadStatus.LOADING
      console.log('LoadAllDirsCmd running')
      this.loadDirs()
    }
  }

  private async loadDirs() {
    const [response, body] = await this.api.sendRequest('GET', '/dirs')
    if (response?.ok) {
      const dirsDto = body as DirDto[]
      if (dirsDto) {
        this.api.context.dirList.dirs = dirsDto.map(dto => new Directory(dto.id.toString(), dto.title))
      } else {
        this.api.context.dirList.dirs = []
      }

      this.dirList.loadStatus = LoadStatus.LOADED
    } else {
      this.dirList.loadStatus = LoadStatus.ERROR
    }
  }
}
