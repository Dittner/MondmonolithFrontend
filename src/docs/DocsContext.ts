import {action, computed, makeObservable, observable} from 'mobx';
import {Directory, Doc, EditTools, User} from "./domain/DomainModel";
import {DemoDocsRepo, DocsRepo} from "./repo/Repository";
import {DomainService} from "./domain/DomainService";
import {UUID} from "./infrastructure/UIDGenerator";

export enum LoadStatus {
  PENDING = "PENDING",
  LOADING = "LOADING",
  LOADED = "LOADED",
}

export class DocsContext {
  readonly uid = UUID()
  @observable readonly user: User;
  @observable readonly editTools: EditTools;
  @observable dirs: Directory[] = [];
  @observable dirsLoadStatus: LoadStatus = LoadStatus.PENDING

  repo: DocsRepo
  domainService: DomainService

  constructor() {
    this.user = new User()
    this.editTools = new EditTools()
    this.repo = new DemoDocsRepo(this)
    this.domainService = new DomainService(this)
    makeObservable(this)
  }

  findDoc(predicate: (doc: Doc) => boolean): Doc | undefined {
    for (let dir of Object.values(this.dirs)) {
      for (let doc of Object.values(dir.docs)) {
        if (predicate(doc))
          return doc
      }
    }
    return undefined
  }

  @action send(dirs?: Directory[], dirsLoadStatus?: LoadStatus) {
    if (dirs) {
      this.dirs = dirs
    }
    if (dirsLoadStatus) {
      this.dirsLoadStatus = dirsLoadStatus
    }
  }
}

