import {action, makeObservable, observable} from 'mobx';
import {Directory, Doc, EditTools, User} from "./domain/DomainModel";
import {DomainService} from "./domain/DomainService";
import {UUID} from "./infrastructure/UIDGenerator";
import {DemoDocsRepo, DocsLoader} from "./infrastructure/loader/DocsLoader";
import {DocsParser, DocsParserV1} from "./infrastructure/parser/DocsParser";
import {Application} from "./application/Application";

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
  @observable readonly app: Application
  readonly docsParser: DocsParser
  readonly docsLoader: DocsLoader
  readonly domainService: DomainService

  static self: DocsContext

  static init() {
    if (!DocsContext.self) {
      DocsContext.self = new DocsContext()
    }
    return DocsContext.self
  }

  private constructor() {
    this.user = new User()
    this.editTools = new EditTools()
    this.docsParser = new DocsParserV1()
    this.docsLoader = new DemoDocsRepo(this)
    this.domainService = new DomainService(this)
    this.app = new Application()
    this.app.subscribeToWindowResize()
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