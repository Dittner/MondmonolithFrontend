import {DocsContext, LoadStatus} from "../DocsContext";
import {Directory, Doc, DocLoadStatus, Page, PageBlock} from "../domain/DomainModel";
import {generateDocs, generateJavaDoc, generateJSDoc, generateReactDoc} from "./DemoDocs";
import {runInAction} from "mobx";

export interface DocsRepo {
  fetchDirectories: () => void
  fetchDoc: (docUID: string) => void
}

export class DemoDocsRepo implements DocsRepo {
  private context: DocsContext

  constructor(context: DocsContext) {
    this.context = context
  }

  public fetchDirectories() {
    console.log("fetchDirectories")
    if (this.context.dirsLoadStatus !== LoadStatus.PENDING) {
      return
    }
    runInAction(() => {
      this.context.dirsLoadStatus = LoadStatus.LOADING
    })

    console.log("--fetchDirectories, start fetching...")

    setTimeout(() => {
      const rawDocs = generateDocs()
      this.context.send(this.parseRawDocs(rawDocs), LoadStatus.LOADED)
      console.log("fetchDirectories complete")
    }, 1000)
  }

  private parseRawDocs(rawDocs: any): Directory[] {
    const res: { [dirUID: string]: Directory } = {}
    const sortedDocs = rawDocs ? [...rawDocs].sort(this.sortByKey("title")) : []
    sortedDocs.forEach(d => {
      if (!res[d.directory]) {
        res[d.directory] = new Directory(d.directory, d.directory)
      }
      res[d.directory].add(new Doc(d.uid, d.title))
    })
    return Object.values(res)
  }

  sortByKey(key: string) {
    return (a: any, b: any) => {
      if (a[key] < b[key]) return -1;
      if (a[key] > b[key]) return 1;
      return 0
    }
  }

  public fetchDoc(docUID: string) {
    console.log("fetchDoc, id =", docUID)
    const doc = this.context.findDoc(d => d.uid === docUID)

    if (doc?.loadStatus === DocLoadStatus.HEADER_LOADED) {
      doc.loadStatus = DocLoadStatus.LOADING
      console.log("fetchDoc, start fetching...")
      setTimeout(() => {
        switch (docUID) {
          case 'java':
            doc.pages = this.parseRawPages(generateJavaDoc().pages)
            doc.loadStatus = DocLoadStatus.LOADED
            break
          case 'js':
            doc.pages = this.parseRawPages(generateJSDoc().pages)
            doc.loadStatus = DocLoadStatus.LOADED
            break
          case 'react':
            doc.pages = this.parseRawPages(generateReactDoc().pages)
            doc.loadStatus = DocLoadStatus.LOADED
            break
          default:
            doc.pages = []
            doc.loadStatus = DocLoadStatus.LOADED
        }
      }, 1000)
    }
  }

  private parseRawPages(rawPages: any): Page[] {
    const res: Page[] = []
    const sortedPages = rawPages ? [...rawPages].sort(this.sortByKey("title")) : []
    sortedPages.forEach(p => {
      const pageBlocks: PageBlock[] = []
      p.blocks.forEach((b: any) => {
        pageBlocks.push(new PageBlock(b.uid, b.data))
      })
      res.push(new Page(p.uid, p.title, pageBlocks))
    })
    return res
  }
}