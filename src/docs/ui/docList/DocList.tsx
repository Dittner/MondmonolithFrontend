import './docList.css';
import {NavLink} from "react-router-dom";
import {useState} from "react";
import {useDocsContext} from "../../../App";
import {LoadStatus} from "../../DocsContext";
import {observer} from "mobx-react";
import {Directory, Doc} from "../../domain/DomainModel";

export const DocList = observer(() => {
  console.log("new DocList")
  const [isNewDocCreating, setIsNewDocCreating] = useState(false)

  const onCancel = () => {
    setIsNewDocCreating(false)
  }

  const onApply = (docTitle: string, dirTitle: string) => {
    if (docTitle && dirTitle) {
      docsContext.domainService.createDoc(docTitle, dirTitle)
      setIsNewDocCreating(false)
    }
  }

  const docsContext = useDocsContext()
  console.log("DocList, dirs: ", docsContext.dirs)
  if (docsContext.dirsLoadStatus === LoadStatus.LOADING) {
    return <></>
  }
  return (
    <div className='docListContainer'>
      <button className="btn createDoc"
              style={{visibility: docsContext.editTools.editMode ? "visible" : "hidden"}}
              onClick={() => {
                setIsNewDocCreating(true)
              }}>+ New doc
      </button>

      {isNewDocCreating &&
        <DocEditForm doc={null}
                     onCancel={onCancel}
                     onApply={onApply}/>
      }


      {docsContext.dirs.map(dir => {
        return <ul key={dir.uid}>
          <DirectoryView dir={dir}/>
          {dir.docs.map(doc => {
            return <DocLink key={doc.uid} doc={doc}/>
          })}
        </ul>
      })}
    </div>
  )
})

const DirectoryView = observer(({dir}: { dir: Directory }) => {
  const docsContext = useDocsContext()

  const onApply = (title: string) => {
    docsContext.domainService.updateDirTitle(dir, title)
  }

  const onCancel = () => {
    dir.isEditing = false
  }

  const startEditing = () => {
    dir.isEditing = true
  }

  if (docsContext.editTools.editMode && dir.isEditing) {
    return (
      <DirEditForm dir={dir}
                   onCancel={onCancel}
                   onApply={onApply}/>
    )
  }
  return (
    <div className="dirContent">
      {/*<span className="icon-folder"/>*/}
      <p className="dirTitle">{dir.title}</p>
      {dir.isStoring &&
        <div className="smallSpinner"></div>
      }
      {!dir.isStoring && docsContext.editTools.editMode &&
        <button className="edit icon-edit"
                onClick={startEditing}></button>
      }
    </div>
  )
})

const DocLink = observer((props: any) => {
  const doc = props.doc as Doc
  const docsContext = useDocsContext()

  const onApply = (newDocTitle: string, newDirTitle: string) => {
    docsContext.domainService.updateDocHeader(doc, newDocTitle, newDirTitle)
  }

  const onCancel = () => {
    doc.isEditing = false
  }

  const startEditing = () => {
    doc.isEditing = true
  }

  if (docsContext.editTools.editMode && doc.isEditing) {
    return (
      <DocEditForm doc={doc}
                   onCancel={onCancel}
                   onApply={onApply}/>
    )
  }
  return (
    <div className="docLinkContent">
      <NavLink className={({isActive}) => isActive ? "docLinkActive" : "docLink"}
               to={`./${doc.uid}`}>{doc.title}
      </NavLink>
      {doc.isStoring &&
        <div className="smallSpinner"></div>
      }
      {!doc.isStoring && docsContext.editTools.editMode &&
        <button className="edit icon-edit"
                onClick={startEditing}></button>
      }
    </div>
  )
})

const DocEditForm = (props: any) => {
  const doc = props.doc as Doc | undefined
  const onCancel = props.onCancel as () => {}
  const onApply = props.onApply as (docTitle: string, dirTitle: string) => {}
  console.log("new DocEditForm")

  const [newDocTitle, setNewDocTitle] = useState(doc?.title ?? '');
  const [newDirTitle, setNewDirTitle] = useState(doc?.dir?.title ?? '');

  const apply = () => {
    onApply(newDocTitle, newDirTitle)
  }
  const cancel = () => {
    onCancel()
  }

  return (
    <div className='editForm'>
      <input className="editFormInput"
             placeholder="Doc's title"
             autoCorrect="off"
             autoComplete="off"
             type="text"
             value={newDocTitle}
             onChange={e => setNewDocTitle(e.target.value)}
             autoFocus/>

      <input className="editFormInput"
             placeholder="Directory"
             autoCorrect="off"
             autoComplete="off"
             type="text"
             value={newDirTitle}
             onChange={e => setNewDirTitle(e.target.value)}/>

      <div className="hstack valignCenter halignCenter">
        <button onClick={cancel}
                className="btn">Cancel
        </button>
        <button className="btn"
                onClick={apply}>Store
        </button>
      </div>

      {doc?.storeWithError &&
        <p className="errMsg">{doc.storeWithError}</p>
      }
    </div>
  )
}

const DirEditForm = (props: any) => {
  console.log("new DirEditForm")
  const dir = props.dir as Directory
  const onCancel = props.onCancel as () => {}
  const onApply = props.onApply as (title: string) => {}


  const [title, setTitle] = useState(dir.title ?? '');

  const apply = () => {
    onApply(title)
  }
  const cancel = () => {
    onCancel()
  }

  return (
    <div className='editForm'>
      <input className="editFormInput"
             placeholder="Title"
             autoCorrect="off"
             autoComplete="off"
             type="text"
             value={title}
             onChange={e => setTitle(e.target.value)}
             autoFocus/>

      <div className="hstack valignCenter halignCenter">
        <button onClick={cancel}
                className="btn">Cancel
        </button>
        <button className="btn"
                onClick={apply}>Store
        </button>
      </div>

      {dir.storeWithError &&
        <p className="errMsg">{dir.storeWithError}</p>
      }
    </div>
  )
}