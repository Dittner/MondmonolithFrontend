import { type DocsContext } from '../DocsContext'
import { Directory, Doc } from './DomainModel'
import { uid } from '../infrastructure/UIDGenerator'

export class DomainService {
  private readonly context: DocsContext

  constructor(context: DocsContext) {
    this.context = context
  }

  updateDocHeader(doc: Doc, newDocTitle: string, newDirTitle: string) {
    const dirList = this.context.directoryList
    doc.title = newDocTitle
    doc.isEditing = false
    if (doc.dir?.title !== newDirTitle) {
      doc.dir?.remove(doc)

      const dir = dirList.findDir(dir => dir.title === newDirTitle)
      if (dir) {
        dir.add(doc)
      } else {
        const newDir = new Directory(uid(), newDirTitle)
        newDir.add(doc)
        dirList.add(newDir)
      }
    }
  }

  updateDirTitle(dir: Directory, newDirTitle: string) {
    const dirList = this.context.directoryList
    if (dir.title === newDirTitle) return

    const destDir = dirList.findDir(dir => dir.title === newDirTitle)
    if (destDir) {
      while (dir.docs.length > 0) {
        const removingDoc = dir.docs[0]
        const doc = dir.remove(removingDoc)
        if (doc) { destDir.add(doc) }
      }
    } else {
      dir.title = newDirTitle
    }

    dir.isEditing = false
  }

  createDoc(docTitle: string, dirTitle: string) {
    const dirList = this.context.directoryList
    const doc = new Doc(uid(), docTitle)
    const dir = dirList.findDir(dir => dir.title === dirTitle)
    if (dir) {
      dir.add(doc)
    } else {
      const newDir = new Directory(uid(), dirTitle)
      newDir.add(doc)
      dirList.dirs.push(newDir)
    }
  }
}
