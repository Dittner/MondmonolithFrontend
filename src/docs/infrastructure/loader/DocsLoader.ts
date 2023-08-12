import { type DocsContext } from '../../DocsContext'
import { Dialog } from '../../application/Application'
import { type Directory, Doc, Page, PageBlock } from '../../domain/DomainModel'

export class DocsLoader {
  private readonly context: DocsContext

  constructor(context: DocsContext) {
    this.context = context
  }

  loadDocFromDisc(doc: File, toDir: Directory) {
    const onError = (title: string, msg: string): void => {
      this.context.app.dialog = new Dialog(title, msg)
      console.log(msg)
    }

    const onComplete = (text: any) => {
      try {
        const data = JSON.parse(text)
        try {
          const parser = new DocsParser()
          const [doc, pages] = parser.parseDoc(data)
          this.context.restApi.storeDocWithPages(doc, pages, toDir)
        } catch (e: any) {
          onError('The file is damaged', `An error has occurred while reading a file.\n${e}`)
        }
      } catch (e: any) {
        onError('The file is damaged', `An error has occurred while parsing the json-file to object.\n${e}`)
      }
    }

    if (doc.type !== 'application/json') {
      onError('Invalid file', 'The extension of the selected file should be json')
    } else {
      doc.text()
        .then(text => { onComplete(text) })
        .catch(err => { onError('The Loading a file is failed', `Details: ${err}`) })
    }
  }
}

export class DocsParseError extends Error {
  readonly msg: string
  constructor(msg: string) {
    super(msg)
    this.msg = msg
  }

  toString() {
    return `DocsParseError: ${this.msg}`
  }
}

class DocsParser {
  private validate(data: any, requiredProps: string[], entityName: string): void {
    requiredProps.forEach(p => {
      if (!(p in data)) { throw new DocsParseError(`The required property «${p}» of the «${entityName}» not found in file.`) }
    })
  }

  parseDoc(data: any): [Doc, Page[]] {
    this.validate(data, ['title', 'pages'], 'Doc')
    const doc = new Doc('', data.title)
    const pages = data.pages.map((raw: any) => this.parsePage(raw))
    return [doc, pages]
  }

  parsePage(data: any): Page {
    this.validate(data, ['title', 'blocks'], 'Page')
    const page = new Page('', data.title)
    page.blocks = data.blocks.map((raw: any) => this.parsePageBlock(raw))
    return page
  }

  parsePageBlock(data: any): PageBlock {
    this.validate(data, ['text'], "Page's Block")
    return new PageBlock(data.text)
  }
}
