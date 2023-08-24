import { AuthCmd } from './cmd/AuthCmd'
import { type DocsContext } from '../../DocsContext'
import { LoadAllDirsCmd } from './cmd/LoadAllDirsCmd'
import { AuthStatus, type Directory, type Doc, type Page, type User } from '../../domain/DomainModel'
import { StoreDirCmd } from './cmd/StoreDirCmd'
import { type RequestBody } from './Dto'
import { StoreDocCmd } from './cmd/StoreDocCmd'
import { LoadDocsCmd } from './cmd/LoadDocsCmd'
import { DeleteDocCmd } from './cmd/DeleteDocCmd'
import { DeleteDirCmd } from './cmd/DeleteDirCmd'
import { LoadPagesCmd } from './cmd/LoadPagesCmd'
import { StorePageCmd } from './cmd/StorePageCmd'
import { DeletePageCmd } from './cmd/DeletePageCmd'
import { StoreDocWithPagesCmd } from './cmd/StoreDocWithPagesCmd'
import { SendVerificationCodeCmd } from './cmd/SendVerificationCodeCmd'
import { RequestVerificationCodeCmd } from './cmd/RequestVerificationCodeCmd'
import { RefreshTokenCmd } from './cmd/RefreshTokenCmd'

export class RestApi {
  readonly TOKEN = 'MM_TOKEN'
  readonly baseUrl: string
  readonly context: DocsContext
  headers: any = { 'Content-Type': 'application/json' }

  constructor(context: DocsContext) {
    this.baseUrl = process.env.REACT_APP_API_URL ?? 'http://localhost:3000'
    this.context = context

    const token = window.localStorage.getItem(this.TOKEN)
    if (token) this.parseToken(token)
  }

  parseToken(token: string) {
    try {
      const payload = token.split('.')[1]
      const tokenClaims = JSON.parse(atob(payload))
      this.context.user.id = tokenClaims.userId
      this.context.user.email = tokenClaims.sub
      this.context.user.authStatus = AuthStatus.AUTHORIZED
      this.headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
      const expiredAt = tokenClaims.exp
      const now = Math.floor(new Date().getTime() / 1000)
      const tokenExpiresAfterHours = (expiredAt - now) / 60 / 60
      console.log('Token expired after (hours): ', tokenExpiresAfterHours)
      if (tokenExpiresAfterHours < 3 * 24) this.refreshToken()
    } catch (_) {}
  }

  //--------------------------------------
  //  auth
  //--------------------------------------

  requestVerificationCode(email: string, pwd: string) {
    const cmd = new RequestVerificationCodeCmd(this, email, pwd)
    cmd.run()
  }

  sendVerificationCode(user: User, verificationCode: string) {
    const cmd = new SendVerificationCodeCmd(this, user, verificationCode)
    cmd.run()
  }

  auth(email: string, pwd: string) {
    const cmd = new AuthCmd(this, email, pwd)
    cmd.run()
  }

  private refreshToken() {
    const cmd = new RefreshTokenCmd(this)
    cmd.run()
  }

  logOut() {
    window.localStorage.removeItem(this.TOKEN)
    const user = this.context.user
    user.pwd = ''
    user.authStatus = AuthStatus.SIGNED_OUT
    this.context.dirList.removeAll()
  }

  //--------------------------------------
  //  dir
  //--------------------------------------

  loadAllDirs() {
    const cmd = new LoadAllDirsCmd(this, this.context.dirList)
    cmd.run()
  }

  storeDir(dir: Directory) {
    const cmd = new StoreDirCmd(this, dir)
    cmd.run()
  }

  deleteDir(dir: Directory) {
    const cmd = new DeleteDirCmd(this, dir)
    cmd.run()
  }

  //--------------------------------------
  //  doc
  //--------------------------------------

  storeDoc(doc: Doc, dir: Directory) {
    const cmd = new StoreDocCmd(this, doc, dir)
    cmd.run()
  }

  storeDocWithPages(doc: Doc, pages: Page[], dir: Directory) {
    const cmd = new StoreDocWithPagesCmd(this, doc, pages, dir)
    cmd.run()
  }

  deleteDoc(doc: Doc) {
    const cmd = new DeleteDocCmd(this, doc)
    cmd.run()
  }

  loadDocs(dir: Directory) {
    const cmd = new LoadDocsCmd(this, dir)
    cmd.run()
  }

  //--------------------------------------
  //  page
  //--------------------------------------

  loadPages(doc: Doc) {
    const cmd = new LoadPagesCmd(this, doc)
    cmd.run()
  }

  storePage(page: Page, doc: Doc) {
    const cmd = new StorePageCmd(this, page, doc)
    cmd.run()
  }

  deletePage(page: Page) {
    const cmd = new DeletePageCmd(this, page)
    cmd.run()
  }

  //--------------------------------------
  //  sendRequest
  //--------------------------------------

  async sendRequest(method: HttpMethod, path: string, body: RequestBody | null = null, handleErrors: boolean = true): Promise<[Response | null, any | null]> {
    try {
      console.log('===>', method, ':', path)
      const response = await fetch(this.baseUrl + path, {
        method,
        headers: this.headers,
        credentials: 'same-origin',
        body: body?.serialize()
      })

      console.log('<===', response.status, method, path)

      if (response.ok) {
        if (response.status === 204) {
          return [response, null]
        } else {
          try {
            const body = await response.json()
            return [response, body]
          } catch (_) {
          }
        }
      } else if (handleErrors) {
        if (response.status === 401 || response.status === 403) {
          this.logOut()
        } else if (response.status >= 500) {
          this.context.app.errorMsg = response.status + ': Internal server error'
        } else {
          this.context.app.errorMsg = response.status + ': Bad Request'
        }

        try {
          const details = await response.text()

          console.log('Details:', details)
        } catch (_) {}
      }
      return [response, null]
    } catch (e: any) {
      const msg = 'Unable to ' + method + ' resource: ' + this.baseUrl + path
      this.context.app.errorMsg = msg
      console.log(msg, '. Details:', e)
      return [null, null]
    }
  }
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'
