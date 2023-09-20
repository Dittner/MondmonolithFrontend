import { AuthStatus, DirectoryList, EditTools, LoadStatus, User } from './domain/DomainModel'
import { uid } from './infrastructure/UIDGenerator'
import { DocsLoader } from './infrastructure/loader/DocsLoader'
import { Application } from './application/Application'
import { useDocsContext } from '../App'
import { observe } from './infrastructure/Observer'
import { type Theme, ThemeManager } from './application/ThemeManager'
import { RestApi } from './infrastructure/rest/RestApi'

export class DocsContext {
  readonly uid = uid()
  readonly themeManager: ThemeManager
  readonly user: User
  readonly editTools: EditTools
  readonly dirList: DirectoryList
  readonly app: Application
  readonly docsLoader: DocsLoader
  readonly restApi: RestApi

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
    this.restApi = new RestApi(this)
    this.editTools = new EditTools(this.user)
    this.docsLoader = new DocsLoader(this)
    this.app = new Application()
    this.app.subscribeToWindowResize()
    this.dirList = new DirectoryList()

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
  return observe(useDocsContext().dirList)
}
