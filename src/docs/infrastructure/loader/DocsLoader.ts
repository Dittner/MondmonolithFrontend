import {DocsContext, LoadStatus} from "../../DocsContext";
import {InfoDialog, YesNoDialog} from "../../application/Application";
import {Directory, Doc, DocLoadStatus} from "../../domain/DomainModel";
import {action} from "mobx";

export interface DocsLoader {
  fetchDirectories(): void

  fetchDoc(docUID: string): void

  loadDocFromDisc(doc: File): void
}

export class DemoDocsRepo implements DocsLoader {
  private context: DocsContext

  constructor(context: DocsContext) {
    this.context = context
  }

  private loadJsonFile = async (url: string) => {
    const response = await fetch(url);

    if (response.ok) {
      return await response.json()
    } else {
      const message = `An error has occurred: ${response.status}`;
      throw new Error(message)
    }
  }


  public fetchDirectories() {
    console.log("fetchDirectories")
    if (this.context.dirsLoadStatus !== LoadStatus.PENDING) {
      return
    }

    this.context.dirsLoadStatus = LoadStatus.LOADING

    const rawDocs: any[] = []
    this.loadJsonFile("/demo/java.json")
      .then(value => {
        rawDocs.push(value)
      })
    this.loadJsonFile("/demo/js.json")
      .then(value => {
        rawDocs.push(value)
      })
    this.loadJsonFile("/demo/react.json")
      .then(value => {
        rawDocs.push(value)
      })

    console.log("--fetchDirectories, start fetching...")

    setTimeout(() => {
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

    if (doc && doc?.loadStatus === DocLoadStatus.HEADER_LOADED) {
      doc.loadStatus = DocLoadStatus.LOADING
      console.log("fetchDoc, start fetching...")
      let d: Doc
      let docUrl = ""
      switch (docUID) {
        case 'java':
          docUrl = "/demo/java.json"
          break
        case 'js':
          docUrl = "/demo/js.json"
          break
        case 'react':
          docUrl = "/demo/react.json"
          break
      }

      if (docUrl) {
        this.loadJsonFile(docUrl)
          .then(value => {
            d = this.context.docsParser.parseDoc(value)
            d.loadStatus = DocLoadStatus.LOADED
            doc.dir?.replaceWith(d)
          }, err => {
            doc.loadWithError = "Loading of the file is failed. Details: " + err
            doc.loadStatus = DocLoadStatus.HEADER_LOADED
          })
          .catch(err => {
            doc.loadWithError = "Loading of the file is failed. Details: " + err
            doc.loadStatus = DocLoadStatus.HEADER_LOADED
          })
      } else {
        doc.loadStatus = DocLoadStatus.LOADED
      }
    }
  }

  @action loadDocFromDisc(doc: File) {
    const onError = (title: string, msg: string): void => {
      this.context.app.infoDialog = new InfoDialog(title, msg)
      console.log(msg)
    }

    const onComplete = (text: any) => {
      try {
        const data = JSON.parse(text)
        try {
          const doc = this.context.docsParser.parseDoc(data)
          const dir = this.context.dirs.find(d => d.uid === data.directory)
          if (dir) {
            const duplicate = dir.docs.find(d => d.uid === doc.uid)
            if (duplicate) {
              const msg = `The directory «${dir.title}» already has the doc «${doc.title}». Do you want to overwrite it?`
              const overwriteDoc = () => {
                doc.loadStatus = DocLoadStatus.LOADED
                dir.replaceWith(doc)
              }
              this.context.app.yesNoDialog = new YesNoDialog(msg, overwriteDoc)
            } else {
              dir.add(doc)
            }
          } else {
            const dir = new Directory(data.directory, data.directory)
            dir.add(doc)
            this.context.dirs.push(dir)
          }
        } catch (e) {
          onError("The file is damaged", `An error has occurred while reading a file.\n${e}`)
        }

      } catch (e) {
        onError("The file is damaged", `An error has occurred while parsing the json-file to object.\n${e}`)
      }
    }

    if (doc.type !== "application/json") {
      onError("Invalid file", "The extension of the selected file should be json")

    } else {
      doc.text()
        .then(text => onComplete(text))
        .catch(err => onError("The Loading a file is failed", `Details: ${err}`))
    }
  }
}