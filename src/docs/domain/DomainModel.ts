import {action, computed, makeObservable, observable, runInAction} from 'mobx';
import {UUID} from "../infrastructure/UIDGenerator";

export enum AuthStatus {
  SIGNED_OUT = "SIGNED_OUT",
  AUTHORIZING = "AUTHORIZING",
  AUTHORIZED = "AUTHORIZED",
}

interface Serializable {
  serialize(): Object
}

export class User {
  readonly uid: string
  @observable login: string = "demo"
  @observable pwd: string = "pwd"
  @observable authStatus: AuthStatus = AuthStatus.SIGNED_OUT
  @observable authWithError: string = ""

  constructor() {
    this.uid = UUID()
    if (window.localStorage.getItem("authStatus") === "authorized")
      this.authStatus = AuthStatus.AUTHORIZED
    makeObservable(this)
  }

  @action signIn(login: string, pwd: string) {
    console.log("signIn()")
    if (!login) {
      this.authWithError = "Login is not filled!"
      return
    }
    if (!pwd) {
      this.authWithError = "Password is not filled!"
      return
    }

    this.authStatus = AuthStatus.AUTHORIZING
    this.authWithError = ""
    setTimeout(()=> runInAction(() => {
        if (login === 'demo' && pwd === 'pwd') {
          this.authStatus = AuthStatus.AUTHORIZED
          window.localStorage.setItem("authStatus", "authorized")
          this.login = login
          this.pwd = pwd
        } else {
          this.authWithError = "Invalid login or password!"
          this.authStatus = AuthStatus.SIGNED_OUT
        }
      }), 1000)
  }

  @action signOut() {
    console.log("signOut()")
    if (this.authStatus === AuthStatus.AUTHORIZED) {
      this.authStatus = AuthStatus.SIGNED_OUT
      window.localStorage.setItem("authStatus", "signedOut")
    }
  }
}

export class EditTools {
  readonly uid: string
  @observable editMode: boolean = false
  @observable selectedItem: Page | PageBlock | undefined

  constructor() {
    this.uid = UUID()
    makeObservable(this)
    document.addEventListener("keydown", this.onKeyDown.bind(this))
  }

  private onKeyDown(e: any) {
    //Enter key
    if (this.editMode && e.keyCode === 13 && this.selectedItem && !this.selectedItem.isEditing) {
      e.preventDefault()
      e.stopPropagation()
      this.selectedItem.isEditing = true
    }
  }

  @action toggleEditMode() {
    this.editMode = !this.editMode
  }
}

export class Directory {
  readonly uid: string
  @observable title: string
  @observable isEditing: boolean = false
  @observable isStoring: boolean = false
  @observable storeWithError: string = ""
  @observable readonly docs: Doc[] = [];

  constructor(uid: string, title: string) {
    this.uid = uid
    this.title = title
    makeObservable(this)
  }

  @action add(doc: Doc) {
    if (doc.dir) {
      doc.dir.remove(doc)
    }
    this.docs.push(doc)
    doc.dir = this
  }

  @action remove(doc: Doc): Doc | undefined {
    const docInd = this.docs.findIndex(d => d.uid === doc.uid)
    if (docInd !== -1) {
      this.docs.splice(docInd, 1)
      doc.destroy()
      return doc
    }
    return undefined
  }

  @action replaceWith(doc: Doc): void {
    const docInd = this.docs.findIndex(d => d.uid === doc.uid)
    if (docInd !== -1) {
      const oldDoc = this.docs[docInd]
      this.docs[docInd] = doc
      doc.dir = this
      oldDoc.destroy()
    }
  }
}

export enum DocLoadStatus {
  HEADER_LOADED = "HEADER_LOADED",
  LOADING = "LOADING",
  LOADED = "LOADED",
}

export class Doc implements Serializable {
  readonly uid: string
  @observable isEditing: boolean = false
  @observable isStoring: boolean = false
  @observable title: string
  @observable storeWithError: string = ""
  @observable loadWithError: string = ""
  @observable loadStatus: DocLoadStatus = DocLoadStatus.HEADER_LOADED
  @observable dir: Directory | undefined

  @observable private _pages: Page[] = []
  @computed get pages(): Page[] {
    return this._pages
  }

  constructor(uid: string, title: string) {
    this.uid = uid
    this.title = title
    makeObservable(this)
  }

  init(pages: Page[]): void {
    if (this.pages.length === 0) {
      this._pages = pages.sort(sortByKey("title"))
      this._pages.forEach(p => p.doc = this)
    }
  }

  serialize(): Object {
    return {
      uid: this.uid,
      title: this.title,
      directory: this.dir?.title,
      pages: this.pages.map(p => p.serialize())
    }
  }

  @action add(page: Page): void {
    page.doc = this
    this.pages.unshift(page)
  }

  @computed get id(): string {
    return strToHashId(this.title)
  }

  @action createPage(): void {
    const p = new Page(UUID(), "TITLE")
    p.doc = this
    p.isEditing = true
    this.pages.unshift(p)
  }

  @action deletePage(page: Page): void {
    const pageInd = this.pages.findIndex(p => p.uid === page.uid)
    if (pageInd !== -1) {
      this.pages.splice(pageInd, 1)
      page.destroy()
    }
  }

  @action destroy(): void {
    this.dir = undefined
    this.pages.forEach(p => p.destroy())
  }

  @action send(storeWithError:string, loadStatus:DocLoadStatus): void {
    this.storeWithError = storeWithError
    this.loadStatus = loadStatus
  }
}

const strToHashId = filterCharacters()

function filterCharacters() {
  const cache = new Map<string, string>()
  const notAllowedSymbols = /[^a-z0-9а-я\-_]+/g;
  return (str: string) => {
    const key = str
    const value = cache.get(key)
    if (value) return value
    const res = key.toLowerCase().replaceAll(/ |\./g, '-').replace(notAllowedSymbols, '');
    cache.set(key, '#' + res)
    return '#' + res
  }
}

export class Page implements Serializable {
  readonly uid: string
  @observable isStoring: boolean = false
  @observable title: string
  @observable storeWithError: string = ""
  @observable doc: Doc | undefined
  @observable isEditing: boolean = false

  @observable private _blocks: PageBlock[] = []
  @computed get blocks(): PageBlock[] {
    return this._blocks
  }

  constructor(uid: string, title: string) {
    this.uid = uid
    this.title = title
    makeObservable(this)


  }

  init(blocks: PageBlock[]): void {
    if (this.blocks.length === 0) {
      this._blocks = blocks
      this._blocks.forEach(b => b.page = this)
    }
  }

  serialize(): Object {
    return {
      uid: this.uid,
      title: this.title,
      blocks: this.blocks.map(b => b.serialize())
    }
  }

  @computed get id(): string {
    return strToHashId(this.title)
  }

  @action add(block: PageBlock): void {
    block.page = this
    this.blocks.unshift(block)
  }

  @action createAndAddBlock(atIndex: number = 0): void {
    const block = new PageBlock(UUID(), "_New Block_")
    block.page = this
    if (atIndex === 0) {
      this.blocks.unshift(block)
    } else if (atIndex === this.blocks.length) {
      this.blocks.push(block)
    } else {
      this._blocks = [...this._blocks.slice(0, atIndex), block, ...this._blocks.slice(atIndex)]
    }
  }

  @action moveBlockUp(block: PageBlock): void {
    const blockInd = this.blocks.findIndex(b => b.uid === block.uid)
    if (blockInd !== -1 && blockInd !== 0) {
      this.blocks[blockInd] = this.blocks[blockInd - 1]
      this.blocks[blockInd - 1] = block
    }
  }

  @action moveBlockDown(block: PageBlock): void {
    const blockInd = this.blocks.findIndex(b => b.uid === block.uid)
    if (blockInd !== -1 && blockInd < this.blocks.length - 1) {
      this.blocks[blockInd] = this.blocks[blockInd + 1]
      this.blocks[blockInd + 1] = block
    }
  }

  @action deleteBlock(block: PageBlock): void {
    const blockInd = this.blocks.findIndex(b => b.uid === block.uid)
    if (blockInd !== -1) {
      this.blocks.splice(blockInd, 1)
      block.destroy()
    }
  }

  @action destroy(): void {
    this.doc = undefined
    this.blocks.forEach(b => b.destroy())
  }
}

export class PageBlock implements Serializable {
  readonly uid: string

  @observable _text: string = ""
  get text():string {return this._text}
  set text(value:string) {
    if(value !== this._text) {
      this._text = value
      this._estimatedRowNum = Math.max(value.length / 100, value.split(/\r\n|\r|\n/).length)
    }
  }

  @observable isEditing: boolean = false
  @observable page: Page | undefined
  private _estimatedRowNum:number = 0
  get estimatedRowNum():number {return this._estimatedRowNum}

  constructor(uid: string, text: string) {
    this.uid = uid
    this.text = text
    makeObservable(this)
  }

  serialize(): Object {
    return {uid: this.uid, text: this.text}
  }

  @action destroy(): void {
    this.page = undefined
  }
}

const sortByKey = (key: string) => {
  return (a: any, b: any) => {
    if (a[key] < b[key]) return -1;
    if (a[key] > b[key]) return 1;
    return 0
  }
}