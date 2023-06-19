import './docList.css';
import {NavLink} from "react-router-dom";
import {ChangeEvent, useRef, useState} from "react";
import {useDocsContext} from "../../../App";
import {AppSize} from "../../application/Application";
import {observer} from "mobx-react";
import {Directory, Doc} from "../../domain/DomainModel";
import {SmallSpinner} from "../common/Loading";
import {HStack, stylable, VStack} from "../../../docs/application/NoCSS";
import {Input} from "../common/Input";
import {Spacer} from "../common/Spacer";
import {LoadStatus} from "../../DocsContext";
import {HeaderVerSep} from "../header/Header";

export const DocList = observer(stylable((props: any) => {
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
    return <VStack className='docListContainer'
                   valign="top"
                   halign="center"
                   width="100%"
                   height="100%"/>
  }
  return (
    <VStack className='docListContainer'
            valign="top"
            halign="center"
            width="100%"
            height="100%">
      <HStack halign="center"
              valign="center"
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

          <HeaderVerSep/>

          <DocPicker/>
        </>
        }

        <Spacer/>

        {docsContext.app.isDocListShown && (docsContext.app.size === AppSize.S || docsContext.app.size === AppSize.XS) &&
        <button className="icon-close withoutBg"
                onClick={hideDocList}/>
        }
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
    </VStack>
  )
}))

const DocPicker = observer(() => {
  const [value, setValue] = useState("")
  const docsContext = useDocsContext()
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const f = e.target.files[0]
      docsContext.docsLoader.loadDocFromDisc(f)
      setValue("")
    }
  }

  const importDoc = () => {
    inputRef.current?.click();
  }

  return <>
    <button className="btn"
            onClick={importDoc}>Import
    </button>

    <input ref={inputRef} className="btn" type="file" onChange={handleFileChange} value={value}
           style={{display: 'none'}}
    />
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
      <button className="edit icon-edit withoutBg"
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
      <button className="edit icon-edit withoutBg"
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

  const apply = (e:any) => {
    onApply(newDocTitle, newDirTitle)
  }
  const cancel = () => {
    onCancel()
  }

  return (
    <VStack className="editForm"
            halign="stretch"
            valign="center"
            padding="20px">
      <HStack halign="center" valign="center">
        <Input type="text"
               defaultValue={newDocTitle}
               titel="Doc's title"
               onChange={setNewDocTitle}
               onSubmitted={apply}
               autoFocus/>

        <Input type="text"
               defaultValue={newDirTitle}
               titel="Directory"
               onChange={setNewDirTitle}
               onSubmitted={apply}/>
      </HStack>


      <HStack halign="center" valign="center" gap="50px">
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
    </VStack>

  )
}

const DirEditForm = (props: any) => {
  console.log("new DirEditForm")
  const dir = props.dir as Directory
  const onCancel = props.onCancel as () => void
  const onApply = props.onApply as (title: string) => void


  const [title, setTitle] = useState(dir.title || '');

  const apply = (e:any) => {
    if (!dir.isStoring && title) onApply(title)
  }
  const cancel = () => {
    onCancel()
  }

  return (
    <VStack className="editForm"
            halign="stretch"
            valign="center"
            padding="20px">

      <Input type="text"
             defaultValue={title}
             titel="Directory"
             onChange={setTitle}
             onSubmitted={apply}
             autoFocus/>

      <HStack halign="center" valign="center" gap="50px">
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
    </VStack>
  )
}