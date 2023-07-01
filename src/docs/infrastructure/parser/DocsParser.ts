import { Doc, Page, PageBlock } from '../../domain/DomainModel'

export interface DocsParser {
  parseDoc: (data: any) => Doc

  parsePage: (data: any) => Page

  parsePageBlock: (data: any) => PageBlock
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

export class DocsParserV1 implements DocsParser {
  private validate(data: any, requiredProps: string[], entityName: string): void {
    requiredProps.forEach(p => {
      if (!(p in data)) { throw new DocsParseError(`The required property «${p}» of the «${entityName}» not found in file.`) }
    })
  }

  parseDoc(data: any): Doc {
    this.validate(data, ['uid', 'title', 'directory', 'pages'], 'Doc')

    const res = new Doc(data.uid, data.title)
    const pages = new Array<Page>()
    data.pages.forEach((raw: any) => {
      pages.push(this.parsePage(raw))
    })
    res.init(pages)

    return res
  }

  parsePage(data: any): Page {
    this.validate(data, ['uid', 'title', 'blocks'], 'Page')

    const res = new Page(data.uid, data.title)
    const blocks = new Array<PageBlock>()
    data.blocks.forEach((raw: any) => {
      blocks.push(this.parsePageBlock(raw))
    })
    res.init(blocks)

    return res
  }

  parsePageBlock(data: any): PageBlock {
    this.validate(data, ['uid', 'text'], "Page's Block")
    return new PageBlock(data.uid, data.text)
  }
}
