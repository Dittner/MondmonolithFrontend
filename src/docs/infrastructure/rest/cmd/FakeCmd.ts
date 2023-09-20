import { type RestApiCmd } from './RestApiCmd'
import { type RestApi } from '../RestApi'
import { type Directory, type Doc, type Page } from '../../../domain/DomainModel'
import { Dialog } from '../../../application/Application'

export class FakeStoreDirCmd implements RestApiCmd {
  private readonly api: RestApi
  private readonly dir: Directory

  constructor(api: RestApi, dir: Directory) {
    this.api = api
    this.dir = dir
  }

  run() {
    if (this.dir.isNew) {
      this.dir.id = this.api.generateFakeId()
      this.dir.isNew = false
      this.api.context.dirList.add(this.dir)
    }
  }
}

export class FakeDeleteDirCmd implements RestApiCmd {
  private readonly api: RestApi
  private readonly dir: Directory

  constructor(api: RestApi, dir: Directory) {
    this.api = api
    this.dir = dir
  }

  run() {
    this.api.context.dirList.remove(this.dir)
    this.dir.dispose()
  }
}

export class FakeStoreDocCmd implements RestApiCmd {
  private readonly api: RestApi
  private readonly doc: Doc
  private readonly dir: Directory

  constructor(api: RestApi, doc: Doc, dir: Directory) {
    this.api = api
    this.doc = doc
    this.dir = dir
  }

  run() {
    if (this.doc.isNew) {
      this.doc.id = this.api.generateFakeId()
      this.doc.isNew = false
      this.dir.add(this.doc)
    }
  }
}

export class FakeStoreDocWithPagesCmd implements RestApiCmd {
  private readonly api: RestApi
  private readonly doc: Doc
  private readonly pages: Page[]
  private readonly dir: Directory
  private removeDuplicateDoc: Doc | undefined

  constructor(api: RestApi, doc: Doc, pages: Page[], dir: Directory) {
    this.api = api
    this.doc = doc
    this.pages = pages
    this.dir = dir
  }

  run() {
    if (!this.doc.isStoring) {
      this.doc.isStoring = true

      const duplicate = this.dir.docs.find(d => d.title === this.doc.title)
      if (duplicate) {
        const msg = `The directory «${this.dir.title}» already has the doc «${this.doc.title}». Do you want to overwrite it?`
        const overwriteDoc = () => {
          this.removeDuplicateDoc = duplicate
          this.store()
        }
        this.api.context.app.dialog = new Dialog('', msg, overwriteDoc, () => {
        })
      } else {
        this.store()
      }
    }
  }

  private async store() {
    this.doc.id = this.api.generateFakeId()
    this.doc.isNew = false

    for (const page of this.pages) {
      page.id = this.api.generateFakeId()
      page.isNew = false
    }

    if (this.removeDuplicateDoc) {
      this.api.deleteDoc(this.removeDuplicateDoc)
    }
    this.doc.pages = this.pages
    this.dir.add(this.doc)

    this.doc.isStoring = false
  }
}

export class FakeDeleteDocCmd implements RestApiCmd {
  private readonly api: RestApi
  private readonly doc: Doc

  constructor(api: RestApi, doc: Doc) {
    this.api = api
    this.doc = doc
  }

  run() {
    if (!this.doc.isStoring && !this.doc.isNew && this.doc.dir) {
      this.doc.dir?.remove(this.doc)
      this.doc.dispose()
    }
  }
}

export class FakeStorePageCmd implements RestApiCmd {
  private readonly api: RestApi
  private readonly page: Page
  private readonly doc: Doc

  constructor(api: RestApi, page: Page, doc: Doc) {
    this.api = api
    this.page = page
    this.doc = doc
  }

  run() {
    if (!this.page.isStoring && this.page.isNew && !this.doc.isNew) {
      this.page.id = this.api.generateFakeId()
      this.page.isNew = false
      this.doc.add(this.page)
    }
  }
}

export class FakeDeletePageCmd implements RestApiCmd {
  private readonly api: RestApi
  private readonly page: Page

  constructor(api: RestApi, page: Page) {
    this.api = api
    this.page = page
  }

  run() {
    if (!this.page.isStoring && !this.page.isNew && this.page.doc) {
      this.page.doc?.remove(this.page)
      this.page.dispose()
    }
  }
}
