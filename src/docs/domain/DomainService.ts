import {DocsContext} from "../DocsContext";
import {Directory, Doc} from "./DomainModel";
import {UUID} from "../infrastructure/UIDGenerator";
import {action} from "mobx";

export class DomainService {
  private context: DocsContext

  constructor(context: DocsContext) {
    this.context = context
  }

  @action updateDocHeader(doc: Doc, newDocTitle: string, newDirTitle: string) {
    doc.title = newDocTitle
    doc.isEditing = false
    if (doc.dir?.title !== newDirTitle) {
      doc.dir?.remove(doc)

      const dir = this.context.dirs.find(d => d.title === newDirTitle)
      if (dir) {
        dir.add(doc)
      } else {
        const newDir = new Directory(UUID(), newDirTitle)
        newDir.add(doc)
        this.context.dirs.push(newDir)
      }
    }
  }

  @action updateDirTitle(dir: Directory, newDirTitle: string) {
    if (dir.title === newDirTitle) return


    const destDir = this.context.dirs.find(d => d.title === newDirTitle)
    if (destDir) {
      while (dir.docs.length > 0) {
        const removingDoc = dir.docs[0]
        const doc = dir.remove(removingDoc)
        if (doc)
          destDir.add(doc)
      }
    } else {
      dir.title = newDirTitle
    }

    dir.isEditing = false
  }

  @action createDoc(docTitle: string, dirTitle: string) {
    const doc = new Doc(UUID(), docTitle)
    const dir = this.context.dirs.find(d => d.title === dirTitle)
    if (dir) {
      dir.add(doc)
    } else {
      const newDir = new Directory(UUID(), dirTitle)
      newDir.add(doc)
      this.context.dirs.push(newDir)
    }
  }
}