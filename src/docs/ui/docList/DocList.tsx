import './docList.css';
import {NavLink} from "react-router-dom";
import {ChangeEvent, useRef, useState} from "react";
import {useDocsContext} from "../../../App";
import {LoadStatus} from "../../DocsContext";
import {observer} from "mobx-react";
import {Directory, Doc} from "../../domain/DomainModel";
import {SmallSpinner} from "../common/Loading";
import {HAlign, HStack, VAlign} from "../common/Stack";
import {Input} from "../common/Input";
import {Spacer} from "../common/Spacer";

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

  const hideDocList = () => {
    docsContext.app.isDocListShown = false
  }

  const docsContext = useDocsContext()
  console.log("DocList, dirs: ", docsContext.dirs)
  if (docsContext.dirsLoadStatus === LoadStatus.LOADING) {
    return <></>
  }
  return (
    <div className='docListContainer'>
      <HStack halign={HAlign.CENTER}
              valign={VAlign.CENTER}
              gap="0"
              width="100%"
              minHeight="50px"
              paddingLeft="20px"
              paddingRight="10px">
        {docsContext.editTools.editMode &&
        <>
          <button className="btn createDoc"
                  onClick={() => {
                    setIsNewDocCreating(true)
                  }}>New doc
          </button>

          <p className="separator">{' | '}</p>

          <DocPicker/>
        </>
        }

        <Spacer/>

        <button className="icon-close withoutBg hideDocListBtn"
                onClick={hideDocList}/>
      </HStack>

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

const DocPicker = observer(() => {
  const docsContext = useDocsContext()
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const f = e.target.files[0]
      docsContext.docsLoader.loadDocFromDisc(f)
    }
  }

  const importDoc = () => {
    inputRef.current?.click();
  }

  return <>
    <button className="btn"
            onClick={importDoc}>Import
    </button>

    <input ref={inputRef} className="btn" type="file" onChange={handleFileChange} style={{display: 'none'}}/>
  </>
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
      <p className="dirTitle">{dir.title}</p>
      {!dir.isStoring && docsContext.editTools.editMode &&
      <button className="edit icon-edit"
              onClick={startEditing}/>
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
      <SmallSpinner/>
      }
      {!doc.isStoring && docsContext.editTools.editMode &&
      <button className="edit icon-edit"
              onClick={startEditing}/>
      }
    </div>
  )
})

const DocEditForm = (props: any) => {
  const doc = props.doc as Doc | undefined
  const onCancel = props.onCancel as () => void
  const onApply = props.onApply as (docTitle: string, dirTitle: string) => void
  console.log("new DocEditForm")

  const [newDocTitle, setNewDocTitle] = useState(doc?.title || '')
  const [newDirTitle, setNewDirTitle] = useState(doc?.dir?.title || '')

  const apply = () => {
    onApply(newDocTitle, newDirTitle)
  }
  const cancel = () => {
    onCancel()
  }

  return (
    <div className='editForm'>
      <Input type="text"
             defaultValue={newDocTitle}
             placeholder="Doc's title"
             onChange={setNewDocTitle}
             onSubmitted={apply}
             autoFocus/>

      <Input type="text"
             defaultValue={newDirTitle}
             placeholder="Directory"
             onChange={setNewDirTitle}
             onSubmitted={apply}/>

      <HStack halign={HAlign.CENTER} valign={VAlign.CENTER}>
        <button onClick={cancel}
                className="btn">Cancel
        </button>
        <button className="btn"
                onClick={apply}>Save
        </button>
      </HStack>

      {doc?.storeWithError &&
      <p className="errMsg">{doc.storeWithError}</p>
      }
    </div>
  )
}

const DirEditForm = (props: any) => {
  console.log("new DirEditForm")
  const dir = props.dir as Directory
  const onCancel = props.onCancel as () => void
  const onApply = props.onApply as (title: string) => void


  const [title, setTitle] = useState(dir.title || '');

  const apply = () => {
    if (!dir.isStoring && title) onApply(title)
  }
  const cancel = () => {
    onCancel()
  }

  return (
    <div className='editForm'>
      <Input type="text"
             defaultValue={title}
             placeholder="Directory"
             onChange={setTitle}
             onSubmitted={apply}
             autoFocus/>

      <HStack halign={HAlign.CENTER} valign={VAlign.CENTER}>
        {dir.isStoring &&
        <SmallSpinner/>
        }
        <button onClick={cancel}
                className="btn">Cancel
        </button>
        <button className="btn"
                onClick={apply}>Save
        </button>
      </HStack>

      {dir.storeWithError &&
      <p className="errMsg">{dir.storeWithError}</p>
      }
    </div>
  )
}