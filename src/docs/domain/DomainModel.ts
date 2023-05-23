import {action, computed, makeObservable, observable} from 'mobx';
import {UUID} from "../infrastructure/UIDGenerator";

export enum AuthStatus {
  SIGNED_OUT = "SIGNED_OUT",
  AUTHORIZING = "AUTHORIZING",
  AUTHORIZED = "AUTHORIZED",
}

export class User {
  readonly uid: string
  @observable login: string = ""
  @observable pwd: string = ""
  @observable authStatus: AuthStatus = AuthStatus.SIGNED_OUT
  @observable authWithError: string = ""

  constructor() {
    this.uid = UUID()
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
    setTimeout(() => {
      if (login === 'demo' && pwd === 'pwd') {
        this.authStatus = AuthStatus.AUTHORIZED
        this.login = login
        this.pwd = pwd
      } else {
        this.authWithError = "Invalid login or password!"
        this.authStatus = AuthStatus.SIGNED_OUT
      }
    }, 1000)
  }

  @action signOut() {
    console.log("signOut()")
    if (this.authStatus === AuthStatus.AUTHORIZED) {
      this.authStatus = AuthStatus.SIGNED_OUT
    }
  }
}

export class EditTools {
  readonly uid: string
  @observable editMode: boolean = false
  @observable selectedItem: Page | PageBlock | undefined = undefined
  constructor() {
    this.uid = UUID()
    makeObservable(this)
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

  @action remove(doc: Doc):Doc | undefined {
    const docInd = this.docs.findIndex(d => d.uid === doc.uid)
    if (docInd !== -1) {
      this.docs.splice(docInd,1)
      doc.dir = undefined
      return doc
    }
    return undefined
  }
}

export enum DocLoadStatus {
  HEADER_LOADED = "HEADER_LOADED",
  LOADING = "LOADING",
  LOADED = "LOADED",
}

export class Doc {
  readonly uid: string
  @observable isEditing: boolean = false
  @observable isStoring: boolean = false
  @observable title: string
  @observable storeWithError: string = ""
  @observable loadStatus: DocLoadStatus = DocLoadStatus.HEADER_LOADED
  @observable pages: Page[] = []
  @observable dir: Directory | undefined

  constructor(uid: string, title: string) {
    this.uid = uid
    this.title = title
    makeObservable(this)
  }

  @computed get id(): string {
    return strToHashId(this.title)
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
    const res = key.toLowerCase().replace(/ |\./, '-').replace(notAllowedSymbols, '');
    cache.set(key, res)
    return res
  }
}

export class Page {
  readonly uid: string
  @observable isStoring: boolean = false
  @observable title: string
  @observable storeWithError: string = ""
  @observable doc: Doc | undefined
  @observable isEditing: boolean = false
  @observable readonly blocks: PageBlock[] = [];

  constructor(uid: string, title: string, blocks: PageBlock[]) {
    this.uid = uid
    this.title = title
    this.blocks = blocks
    makeObservable(this)
  }

  @computed get id(): string {
    return strToHashId(this.title)
  }
}

export class PageBlock {
  readonly uid: string
  @observable data: string
  @observable isEditing: boolean = false
  @observable page: Page | undefined

  constructor(uid: string, data: string) {
    this.uid = uid
    this.data = data
    makeObservable(this)
  }
}