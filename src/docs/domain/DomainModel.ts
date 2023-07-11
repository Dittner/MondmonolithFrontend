import { type UID, uid } from '../infrastructure/UIDGenerator'
import { Observable } from '../infrastructure/Observer'

export enum AuthStatus {
  SIGNED_OUT = 'SIGNED_OUT',
  AUTHORIZING = 'AUTHORIZING',
  AUTHORIZED = 'AUTHORIZED',
}

interface Serializable {
  serialize: () => any
}

export class User extends Observable {
  readonly uid: UID

  //--------------------------------------
  //  login
  //--------------------------------------
  private _login: string = 'demo'
  get login(): string { return this._login }
  set login(value: string) {
    if (this._login !== value) {
      this._login = value
      this.mutated()
    }
  }

  //--------------------------------------
  //  pwd
  //--------------------------------------
  private _pwd: string = 'pwd'
  get pwd(): string { return this._pwd }
  set pwd(value: string) {
    if (this._pwd !== value) {
      this._pwd = value
      this.mutated()
    }
  }

  //--------------------------------------
  //  authStatus
  //--------------------------------------
  private _authStatus: AuthStatus = AuthStatus.SIGNED_OUT
  get authStatus(): AuthStatus { return this._authStatus }
  set authStatus(value: AuthStatus) {
    if (this._authStatus !== value) {
      this._authStatus = value
      this.mutated()
    }
  }

  //--------------------------------------
  //  authWithError
  //--------------------------------------
  private _authWithError: string = ''
  get authWithError(): string { return this._authWithError }
  set authWithError(value: string) {
    if (this._authWithError !== value) {
      this._authWithError = value
      this.mutated()
    }
  }

  constructor() {
    super('User')
    this.uid = uid()
    if (window.localStorage.getItem('authStatus') === 'authorized') { this.authStatus = AuthStatus.AUTHORIZED }
  }

  signIn(login: string, pwd: string) {
    console.log('signIn()')
    if (!login) {
      this.authWithError = 'Login is not filled!'
      return
    }
    if (!pwd) {
      this.authWithError = 'Password is not filled!'
      return
    }

    this.authStatus = AuthStatus.AUTHORIZING
    this.authWithError = ''
    setTimeout(() => {
      if (login === 'demo' && pwd === 'pwd') {
        this.authStatus = AuthStatus.AUTHORIZED
        window.localStorage.setItem('authStatus', 'authorized')
        this.login = login
        this.pwd = pwd
      } else {
        this.authWithError = 'Invalid login or password!'
        this.authStatus = AuthStatus.SIGNED_OUT
      }
    }, 1000)
  }

  signOut() {
    console.log('signOut()')
    if (this.authStatus === AuthStatus.AUTHORIZED) {
      this.authStatus = AuthStatus.SIGNED_OUT
      window.localStorage.setItem('authStatus', 'signedOut')
    }
  }
}

export class EditTools extends Observable {
  readonly uid: UID

  //--------------------------------------
  //  editMode
  //--------------------------------------
  private _editMode: boolean = false
  get editMode(): boolean { return this._editMode }
  set editMode(value: boolean) {
    if (this._editMode !== value) {
      this._editMode = value
      this.mutated()
    }
  }

  //--------------------------------------
  //  selectedItem
  //--------------------------------------
  private _selectedItem: Page | PageBlock | undefined = undefined
  get selectedItem(): Page | PageBlock | undefined { return this._selectedItem }
  set selectedItem(value: Page | PageBlock | undefined) {
    if (this._selectedItem !== value) {
      this._selectedItem = value
      this.mutated()
    }
  }

  constructor() {
    super('EditTools')
    this.uid = uid()
    document.addEventListener('keydown', this.onKeyDown.bind(this))
  }

  private onKeyDown(e: any) {
    // Enter key
    if (this.editMode && e.keyCode === 13 && this.selectedItem && !this.selectedItem.isEditing) {
      e.preventDefault()
      e.stopPropagation()
      this.selectedItem.isEditing = true
    }
  }

  toggleEditMode() {
    this.editMode = !this.editMode
  }

  select(item: Page | PageBlock | undefined) {
    this.selectedItem = item
  }
}

export enum LoadStatus {
  PENDING = 'PENDING',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
}

export class DirectoryList extends Observable {
  readonly uid: UID

  //--------------------------------------
  //  dirs
  //--------------------------------------
  private _dirs = Array<Directory>()
  get dirs(): Directory[] { return this._dirs }
  set dirs(value: Directory[]) {
    if (this._dirs !== value) {
      this._dirs.forEach(d => { d.dispose() })
      this._dirs = value
      this._dirs.forEach(d => { d.subscribe(() => { this.mutated() }) })
      this.mutated()
    }
  }

  //--------------------------------------
  //  loadStatus
  //--------------------------------------
  private _loadStatus: LoadStatus = LoadStatus.PENDING
  get loadStatus(): LoadStatus { return this._loadStatus }
  set loadStatus(value: LoadStatus) {
    if (this._loadStatus !== value) {
      this._loadStatus = value
      this.mutated()
    }
  }

  constructor() {
    super('DirList')
    this.uid = uid()
  }

  findDir(predicate: (dir: Directory) => boolean): Directory | undefined {
    return this.dirs.find(predicate)
  }

  findDoc(predicate: (doc: Doc) => boolean): Doc | undefined {
    for (const dir of Object.values(this.dirs)) {
      for (const doc of Object.values(dir.docs)) {
        if (predicate(doc)) { return doc }
      }
    }
    return undefined
  }

  add(dir: Directory) {
    this.dirs.push(dir)
    dir.subscribe(this.mutated)
    this.mutated()
  }
}

export class Directory extends Observable {
  readonly uid: UID

  //--------------------------------------
  //  title
  //--------------------------------------
  private _title: string = ''
  get title(): string { return this._title }
  set title(value: string) {
    if (this._title !== value) {
      this._title = value
      this.mutated()
    }
  }

  //--------------------------------------
  //  isEditing
  //--------------------------------------
  private _isEditing: boolean = false
  get isEditing(): boolean { return this._isEditing }
  set isEditing(value: boolean) {
    if (this._isEditing !== value) {
      this._isEditing = value
      this.mutated()
    }
  }

  //--------------------------------------
  //  isStoring
  //--------------------------------------
  private _isStoring: boolean = false
  get isStoring(): boolean { return this._isStoring }
  set isStoring(value: boolean) {
    if (this._isStoring !== value) {
      this._isStoring = value
      this.mutated()
    }
  }

  //--------------------------------------
  //  storeWithError
  //--------------------------------------
  private _storeWithError: string = ''
  get storeWithError(): string { return this._storeWithError }
  set storeWithError(value: string) {
    if (this._storeWithError !== value) {
      this._storeWithError = value
      this.mutated()
    }
  }

  readonly docs: Doc[] = []

  constructor(uid: UID, title: string) {
    super('Dir')
    this.uid = uid
    this._title = title
  }

  add(doc: Doc) {
    if (doc.dir) {
      doc.dir.remove(doc)
    }
    this.docs.push(doc)
    doc._dir = this
    this.mutated()
  }

  remove(doc: Doc): Doc | undefined {
    const docInd = this.docs.findIndex(d => d.uid === doc.uid)
    if (docInd !== -1) {
      this.docs.splice(docInd, 1)
      doc.dispose()
      this.mutated()
      return doc
    }
    return undefined
  }

  replaceWith(doc: Doc): void {
    const docInd = this.docs.findIndex(d => d.uid === doc.uid)
    if (docInd !== -1) {
      const oldDoc = this.docs[docInd]
      this.docs[docInd] = doc
      doc._dir = this
      oldDoc.dispose()
      this.mutated()
    }
  }

  dispose() {
    super.dispose()
    this.docs.forEach(d => { d.dispose() })
    this.docs.length = 0
  }
}

export enum DocLoadStatus {
  HEADER_LOADED = 'HEADER_LOADED',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
}

export class Doc extends Observable implements Serializable {
  readonly uid: UID

  //--------------------------------------
  //  isEditing
  //--------------------------------------
  private _isEditing: boolean = false
  get isEditing(): boolean { return this._isEditing }
  set isEditing(value: boolean) {
    if (this._isEditing !== value) {
      this._isEditing = value
      this.mutated()
    }
  }

  //--------------------------------------
  //  isStoring
  //--------------------------------------
  private _isStoring: boolean = false
  get isStoring(): boolean { return this._isStoring }
  set isStoring(value: boolean) {
    if (this._isStoring !== value) {
      this._isStoring = value
      this.mutated()
    }
  }

  //--------------------------------------
  //  title
  //--------------------------------------
  private _title: string = ''
  get title(): string { return this._title }
  set title(value: string) {
    if (this._title !== value) {
      this._title = value
      this.mutated()
    }
  }

  //--------------------------------------
  //  storeWithError
  //--------------------------------------
  private _storeWithError: string = ''
  get storeWithError(): string { return this._storeWithError }
  set storeWithError(value: string) {
    if (this._storeWithError !== value) {
      this._storeWithError = value
      this.mutated()
    }
  }

  //--------------------------------------
  //  loadWithError
  //--------------------------------------
  private _loadWithError: string = ''
  get loadWithError(): string { return this._loadWithError }
  set loadWithError(value: string) {
    if (this._loadWithError !== value) {
      this._loadWithError = value
      this.mutated()
    }
  }

  //--------------------------------------
  //  loadStatus
  //--------------------------------------
  private _loadStatus: DocLoadStatus = DocLoadStatus.HEADER_LOADED
  get loadStatus(): DocLoadStatus { return this._loadStatus }
  set loadStatus(value: DocLoadStatus) {
    if (this._loadStatus !== value) {
      this._loadStatus = value
      this.mutated()
    }
  }

  //--------------------------------------
  //  dir
  //--------------------------------------
  _dir: Directory | undefined = undefined
  get dir(): Directory | undefined { return this._dir }

  private _pages: Page[] = []
  get pages(): Page[] { return this._pages }

  constructor(uid: UID, title: string) {
    super('Doc')
    this.uid = uid
    this._title = title
  }

  init(pages: Page[]): void {
    this.pages.forEach(p => { p.dispose() })
    this._pages = pages.sort(sortByKey('title'))
    this._pages.forEach(p => p._doc = this)
    this.mutated()
  }

  serialize(): any {
    return {
      uid: this.uid,
      title: this.title,
      directory: this.dir?.title,
      pages: this.pages.map(p => p.serialize())
    }
  }

  add(page: Page): void {
    page._doc = this
    this.pages.unshift(page)
    this.mutated()
  }

  get id(): string {
    return strToHashId(this.title)
  }

  createPage(): void {
    const p = new Page(uid(), 'TITLE')
    p._doc = this
    p.isEditing = true
    this.pages.unshift(p)
    this.mutated()
  }

  deletePage(page: Page): void {
    const pageInd = this.pages.findIndex(p => p.uid === page.uid)
    if (pageInd !== -1) {
      this.pages.splice(pageInd, 1)
      page.dispose()
      this.mutated()
    }
  }

  dispose() {
    super.dispose()
    this.pages.forEach(p => { p.dispose() })
    this._dir = undefined
    this._pages = []
  }
}

const strToHashId = filterCharacters()

function filterCharacters() {
  const cache = new Map<string, string>()
  const notAllowedSymbols = /[^a-z0-9а-я\-_]+/g
  return (str: string) => {
    const key = str
    const value = cache.get(key)
    if (value) return value
    const res = key.toLowerCase().replaceAll(/ |\./g, '-').replace(notAllowedSymbols, '')
    cache.set(key, '#' + res)
    return '#' + res
  }
}

export class Page extends Observable implements Serializable {
  readonly uid: UID

  //--------------------------------------
  //  isStoring
  //--------------------------------------
  private _isStoring: boolean = false
  get isStoring(): boolean { return this._isStoring }
  set isStoring(value: boolean) {
    if (this._isStoring !== value) {
      this._isStoring = value
      this.mutated()
    }
  }

  //--------------------------------------
  //  isEditing
  //--------------------------------------
  private _isEditing: boolean = false
  get isEditing(): boolean { return this._isEditing }
  set isEditing(value: boolean) {
    if (this._isEditing !== value) {
      this._isEditing = value
      this.mutated()
    }
  }

  //--------------------------------------
  //  title
  //--------------------------------------
  private _title: string = ''
  get title(): string { return this._title }
  set title(value: string) {
    if (this._title !== value) {
      this._title = value
      this.mutated()
    }
  }

  //--------------------------------------
  //  storeWithError
  //--------------------------------------
  private _storeWithError: string = ''
  get storeWithError(): string { return this._storeWithError }
  set storeWithError(value: string) {
    if (this._storeWithError !== value) {
      this._storeWithError = value
      this.mutated()
    }
  }

  //--------------------------------------
  //  doc
  //--------------------------------------
  _doc: Doc | undefined = undefined
  get doc(): Doc | undefined { return this._doc }

  private _blocks: PageBlock[] = []
  get blocks(): PageBlock[] {
    return this._blocks
  }

  constructor(uid: UID, title: string) {
    super('Page')
    this.uid = uid
    this._title = title
  }

  init(blocks: PageBlock[]): void {
    this._blocks.forEach(b => { b.dispose() })
    this._blocks = blocks
    this._blocks.forEach(b => b._page = this)
  }

  serialize(): any {
    return {
      uid: this.uid,
      title: this.title,
      blocks: this.blocks.map(b => b.serialize())
    }
  }

  get id(): string {
    return strToHashId(this.title)
  }

  add(block: PageBlock): void {
    block._page = this
    this.blocks.unshift(block)
    this.mutated()
  }

  createAndAddBlock(atIndex: number = 0): void {
    const block = new PageBlock(uid(), '_New Block_')
    block._page = this
    if (atIndex === 0) {
      this.blocks.unshift(block)
    } else if (atIndex === this.blocks.length) {
      this.blocks.push(block)
    } else {
      this._blocks = [...this._blocks.slice(0, atIndex), block, ...this._blocks.slice(atIndex)]
    }
    this.mutated()
  }

  moveBlockUp(block: PageBlock): void {
    const blockInd = this.blocks.findIndex(b => b.uid === block.uid)
    if (blockInd !== -1 && blockInd !== 0) {
      this.blocks[blockInd] = this.blocks[blockInd - 1]
      this.blocks[blockInd - 1] = block
      this.mutated()
    }
  }

  moveBlockDown(block: PageBlock): void {
    const blockInd = this.blocks.findIndex(b => b.uid === block.uid)
    if (blockInd !== -1 && blockInd < this.blocks.length - 1) {
      this.blocks[blockInd] = this.blocks[blockInd + 1]
      this.blocks[blockInd + 1] = block
      this.mutated()
    }
  }

  deleteBlock(block: PageBlock): void {
    const blockInd = this.blocks.findIndex(b => b.uid === block.uid)
    if (blockInd !== -1) {
      this.blocks.splice(blockInd, 1)
      block.dispose()
      this.mutated()
    }
  }

  dispose() {
    super.dispose()
    this._doc = undefined
    this.blocks.forEach(b => { b.dispose() })
    this._blocks = []
  }
}

export class PageBlock extends Observable implements Serializable {
  readonly uid: UID

  //--------------------------------------
  //  estimatedRowNum
  //--------------------------------------
  private _estimatedRowNum: number = 0
  get estimatedRowNum(): number { return this._estimatedRowNum }

  //--------------------------------------
  //  text
  //--------------------------------------
  private _text: string = ''
  get text(): string { return this._text }
  set text(value: string) {
    if (this._text !== value) {
      this._text = value
      this._estimatedRowNum = Math.max(value.length / 100, value.split(/\r\n|\r|\n/).length)
      this.mutated()
    }
  }

  //--------------------------------------
  //  isEditing
  //--------------------------------------
  private _isEditing: boolean = false
  get isEditing(): boolean { return this._isEditing }
  set isEditing(value: boolean) {
    if (this._isEditing !== value) {
      this._isEditing = value
      this.mutated()
    }
  }

  //--------------------------------------
  //  page
  //--------------------------------------
  _page: Page | undefined = undefined
  get page(): Page | undefined { return this._page }

  constructor(uid: UID, text: string) {
    super('PageBlock')
    this.uid = uid
    this._text = text
  }

  serialize(): any {
    return { uid: this.uid, text: this.text }
  }

  dispose() {
    super.dispose()
    this._page = undefined
  }
}

const sortByKey = (key: string) => {
  return (a: any, b: any) => {
    if (a[key] < b[key]) return -1
    if (a[key] > b[key]) return 1
    return 0
  }
}
