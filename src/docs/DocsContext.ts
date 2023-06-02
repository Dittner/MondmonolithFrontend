import {action, makeObservable, observable} from 'mobx';
import {Directory, Doc, EditTools, User} from "./domain/DomainModel";
import {DomainService} from "./domain/DomainService";
import {UUID} from "./infrastructure/UIDGenerator";
import {DemoDocsRepo, DocsLoader} from "./infrastructure/loader/DocsLoader";
import {DocsParser, DocsParserV1} from "./infrastructure/parser/DocsParser";

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
  @observable readonly app: App
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
    this.app = new App()
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

export class App {
  readonly uid
  @observable isDocListShown = false;
  @observable yesNoDialog: YesNoDialog | undefined = undefined;
  @observable infoDialog: InfoDialog | undefined = undefined;

  constructor() {
    this.uid = UUID()
    makeObservable(this)
  }
}

export class YesNoDialog {
  readonly text: string;
  readonly onApply: () => void;
  readonly onCancel: (() => void) | undefined;

  constructor(text: string, onApply: () => void, onCancel?: (() => void) | undefined) {
    this.text = text
    this.onApply = onApply
    this.onCancel = onCancel
  }
}

export class InfoDialog {
  readonly title: string;
  readonly text: string;

  constructor(title: string, text: string) {
    this.title = title
    this.text = text
  }
}
