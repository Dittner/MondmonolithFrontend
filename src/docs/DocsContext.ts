import { AuthStatus, DirectoryList, EditTools, User } from './domain/DomainModel'
import { DomainService } from './domain/DomainService'
import { uid } from './infrastructure/UIDGenerator'
import { DemoDocsRepo, type DocsLoader } from './infrastructure/loader/DocsLoader'
import { type DocsParser, DocsParserV1 } from './infrastructure/parser/DocsParser'
import { Application } from './application/Application'
import { useDocsContext } from '../App'
import { observe } from './infrastructure/Observer'
import { type Theme, ThemeManager } from './application/ThemeManager'

export class DocsContext {
  readonly uid = uid()
  readonly themeManager: ThemeManager
  readonly user: User
  readonly editTools: EditTools
  readonly directoryList: DirectoryList
  readonly app: Application
  readonly docsParser: DocsParser
  readonly docsLoader: DocsLoader
  readonly domainService: DomainService

  static self: DocsContext

  static init() {
    if (DocsContext.self === undefined) {
      DocsContext.self = new DocsContext()
    }
    return DocsContext.self
  }

  private _theme: Theme
  get theme(): Theme { return this._theme }

  private constructor() {
    this.themeManager = new ThemeManager()
    this._theme = this.themeManager.theme
    this.user = new User()
    this.editTools = new EditTools()
    this.docsParser = new DocsParserV1()
    this.docsLoader = new DemoDocsRepo(this)
    this.domainService = new DomainService(this)
    this.app = new Application()
    this.app.subscribeToWindowResize()
    this.directoryList = new DirectoryList()

    this.user.subscribe(() => {
      if (this.user.authStatus === AuthStatus.SIGNED_OUT) {
        this.editTools.editMode = false
        this.editTools.select(undefined)
      }
    })

    this.themeManager.subscribe(() => {
      this._theme = this.themeManager.theme
    })
  }
}

export function observeApp(): Application {
  return observe(useDocsContext().app)
}

export function observeEditTools(): EditTools {
  return observe(useDocsContext().editTools)
}

export function observeDirList(): DirectoryList {
  return observe(useDocsContext().directoryList)
}
