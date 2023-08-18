import { useLocation, useNavigate } from 'react-router-dom'
import * as React from 'react'
import { type ChangeEvent, useRef, useState } from 'react'
import { useDocsContext } from '../../App'
import { AppSize } from '../application/Application'
import { type Directory, type Doc, LoadStatus } from '../domain/DomainModel'
import { stylable } from '../application/NoCSS'
import { observeApp, observeDirList, observeEditTools } from '../DocsContext'
import { observe, observer } from '../infrastructure/Observer'
import { HStack, StylableContainer, VStack } from './common/Container'
import { IconButton, RedButton } from './common/Button'
import { Label } from './common/Label'
import { Spacer } from './common/Spacer'
import { sortByKey } from './common/Utils'
import { HeaderVerSep } from './Header'
import { Input } from './common/Input'

export const DocList = observer(stylable(() => {
  console.log('new DocList')
  const app = observeApp()
  const editTools = observeEditTools()
  const dirList = observeDirList()
  const {
    restApi,
    theme,
    themeManager
  } = useDocsContext()

  const [newDir, setNewDir] = useState<Directory | null>(null)

  const createDir = () => {
    setNewDir(dirList.createDir())
  }

  const onCancel = () => {
    setNewDir(null)
  }

  const onApply = (title: string) => {
    if (newDir && title) {
      if (newDir.title !== title) {
        newDir.title = title
        restApi.storeDir(newDir)
      }
      setNewDir(null)
    }
  }

  const hideDocList = () => {
    app.hideDocList()
  }

  if (dirList.loadStatus === LoadStatus.LOADING) {
    return <StylableContainer width="100%"
                              height="100%"
                              bgColor={theme.docListBg}/>
  }
  return (
    <VStack valign="top"
            halign="center"
            gap="0"
            width="100%"
            height="100%"
            bgColor={theme.docListBg}>

      <HStack halign="center"
              valign="center"
              gap="0"
              width="100%"
              minHeight="50px"
              paddingHorizontal="10px">

        <IconButton icon={theme.isDark ? 'moon' : 'sun'}
                    popUp="Switch a theme"
                    onClick={() => {
                      themeManager.switchTheme()
                    }}/>

        {editTools.editMode &&
            <RedButton title="Add Dir"
                       onClick={createDir}/>
        }

        <Spacer/>

        <IconButton icon="close"
                    visible={app.isDocListShown && (app.size === AppSize.S || app.size === AppSize.XS)}
                    popUp="Close Doc's List"
                    onClick={hideDocList}/>
      </HStack>

      {newDir &&
        <DirForm dir={newDir}
                 padding='10px'
                 width='100%'
                 onCancel={onCancel}
                 onApply={onApply}/>
      }

      {dirList.dirs.sort(sortByKey('title')).map(dir => {
        return <DirectoryView key={dir.uid} dir={dir}/>
      })}
    </VStack>
  )
}))

const DirectoryView = observer(({ dir }: { dir: Directory }) => {
  observe(dir)
  const editTools = observeEditTools()
  const { restApi, theme, docsLoader } = useDocsContext()

  const [newDoc, setNewDoc] = useState<Doc | null>(null)

  if (dir.loadStatus === LoadStatus.PENDING) { restApi.loadDocs(dir) }

  const createDoc = () => {
    setNewDoc(dir.createDoc())
  }
  const onApplyDocCreating = (title: string) => {
    if (newDoc && title) {
      newDoc.title = title
      restApi.storeDoc(newDoc, dir)
      newDoc.isEditing = false
      setNewDoc(null)
    }
  }

  const onCancelDocCreating = () => {
    setNewDoc(null)
  }

  const onApplyDirEditing = (title: string) => {
    if (dir && title && dir.title !== title) {
      dir.title = title
      restApi.storeDir(dir)
      dir.isEditing = false
    }
  }

  const onDeleteDir = () => {
    restApi.deleteDir(dir)
    dir.isEditing = false
  }

  const onCancelDirEditing = () => {
    dir.isEditing = false
  }

  const startEditing = () => {
    if (!dir.isStoring && editTools.editMode) {
      dir.isEditing = true
    }
  }

  const onFileSelected = (f: File) => {
    docsLoader.loadDocFromDisc(f, dir)
  }

  if (editTools.editMode && dir.isEditing) {
    return <>
      <DirForm dir={dir}
               padding='10px'
               width='100%'
               onCancel={onCancelDirEditing}
               onApply={onApplyDirEditing}
               onDelete={onDeleteDir}/>
      {
        dir.docs.map(doc => {
          return <DocLink key={doc.uid} doc={doc}/>
        })
      }
    </>
  }
  return <>
    <VStack width="100%"
            gap='0'
            halign="left"
            valign="center"
            paddingBottom='30px'
            onDoubleClick={startEditing}>

      <HStack halign='left' valign='center'
              height="35px"
              width="100%" gap='0'>
        <Label className="notSelectable"
               width='100%'
               whiteSpace='nowrap'
               overflow='clip'
               textOverflow='ellipsis'
               textColor={theme.text75}
               paddingHorizontal="20px"
               text={dir.title}
               textAlign="left"/>

        {editTools.editMode &&
          <HStack halign='left' valign='center' gap='0'>

            <RedButton title="New Doc"
                       onClick={createDoc}/>
            <HeaderVerSep marginHorizontal='0'/>
            <DocPicker onFileSelected={onFileSelected}/>
          </HStack>
        }
      </HStack>

      {newDoc &&
        <DocForm doc={newDoc}
                 padding='10px'
                 width='100%'
                 onCancel={onCancelDocCreating}
                 onApply={onApplyDocCreating}/>
      }

      {
        dir.docs.map(doc => {
          return <DocLink key={doc.uid} doc={doc}/>
        })
      }
    </VStack>

  </>
})

const DocPicker = ({ onFileSelected }: { onFileSelected: (doc: File) => void }) => {
  const [value, setValue] = useState('')
  const { theme } = useDocsContext()

  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const f = e.target.files[0]
      onFileSelected(f)
      setValue('')
    }
  }

  const importDoc = () => {
    inputRef.current?.click()
  }

  return <>
    <RedButton title="Import"
               onClick={importDoc}/>

    <input ref={inputRef} className="btn" type="file" onChange={handleFileChange} value={value}
           style={{ display: 'none' }}
    />
  </>
}

const DocLink = observer(({ doc }: { doc: Doc }) => {
  observe(doc)
  const {
    restApi,
    editTools,
    theme
  } = useDocsContext()

  const navigate = useNavigate()
  const location = useLocation()
  const isDocSelected = location.pathname === '/docs/' + doc.id

  const onApply = (title: string) => {
    if (doc && title && doc.title !== title && doc.dir) {
      doc.title = title
      restApi.storeDoc(doc, doc.dir)
      doc.isEditing = false
    }
  }

  const onCancel = () => {
    doc.isEditing = false
  }
  const onDelete = () => {
    restApi.deleteDoc(doc)
    doc.isEditing = false
  }

  const startEditing = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
    if (!doc.isStoring && editTools.editMode && isDocSelected) {
      doc.isEditing = true
    }
  }

  const openDoc = () => {
    if (!isDocSelected) navigate(`./${doc.id}`)
  }

  if (editTools.editMode && doc.isEditing) {
    return (
      <DocForm doc={doc}
               padding='10px'
               width='100%'
               onCancel={onCancel}
               onApply={onApply}
               onDelete={onDelete}/>
    )
  }

  return (
    <HStack width="100%"
            halign="left"
            valign="center"
            textColor={isDocSelected ? theme.selectedDocLink : theme.text75}
            paddingLeft="20px"
            paddingRight="5px"
            gap="8px"
            hoverState={state => {
              state.textColor = theme.text
              state.bgColor = theme.docSelection
            }}
            onClick={openDoc}
            onDoubleClick={startEditing}>

      <Label className='icon-doc' paddingBottom='5px' opacity='0.75'/>

      <Label className="notSelectable"
             text={isDocSelected ? doc.title + ' ' : doc.title}
             textAlign="left"
             width="100%"/>
    </HStack>
  )
})

interface DocFormProps {
  doc: Doc
  onCancel: () => void
  onApply: (title: string) => void
  onDelete?: (() => void) | undefined
}

const DocForm = stylable((props: DocFormProps) => {
  console.log('new DocEditForm')
  const { theme } = useDocsContext()

  const doc = props.doc
  const [newDocTitleProtocol, _] = useState({ value: doc?.title ?? '' })

  const apply = () => {
    props.onApply(newDocTitleProtocol.value)
  }
  const cancel = () => {
    props.onCancel()
  }

  const deleteDoc = () => {
    props.onDelete?.()
  }

  return (
    <HStack halign="stretch" valign="center" gap="5px"
            paddingHorizontal="10px"
            borderColor={theme.border}>
    <VStack halign="stretch"
            valign="center"
            paddingTop='11px'
            gap="0">

        <Input type="text"
               protocol={newDocTitleProtocol}
               title="Doc's title"
               onSubmitted={apply}
               autoFocus/>

      <HStack halign="center" valign="center" gap="50px">
        <RedButton title="Cancel"
                   onClick={cancel}/>

        <RedButton title="Save"
                   onClick={apply}/>
      </HStack>
    </VStack>

      <IconButton icon="delete"
                  visible={!props.doc.isNew}
                  popUp="Delete"
                  onClick={deleteDoc}/>
    </HStack>
  )
})

interface DirFormProps {
  dir: Directory
  onCancel: () => void
  onApply: (title: string) => void
  onDelete?: (() => void) | undefined
}

const DirForm = stylable((props: DirFormProps) => {
  console.log('new DirEditForm')
  const { theme } = useDocsContext()

  const [titleProtocol, _] = useState({ value: props.dir?.title ?? '' })

  const apply = () => {
    if (!props.dir.isStoring && titleProtocol.value) {
      props.onApply(titleProtocol.value)
    }
  }

  const cancel = () => {
    props.onCancel()
  }

  const deleteDir = () => {
    props.onDelete?.()
  }

  return (
    <HStack halign="stretch" valign="center" gap="5px"
            paddingHorizontal="10px"
            borderColor={theme.border}>
      <VStack halign="stretch"
              valign="center"
              paddingTop='11px'
              gap="0">

        <Input type="text"
               protocol={titleProtocol}
               title="Directory"
               onSubmitted={apply}
               autoFocus
        />

      <HStack halign="center" valign="center" gap="50px">
        <RedButton title="Cancel"
                   onClick={cancel}/>

        <RedButton title="Save"
                   onClick={apply}/>
      </HStack>
    </VStack>
      <IconButton icon="delete"
                  visible={!props.dir.isNew}
                  popUp="Delete"
                  onClick={deleteDir}/>
</HStack>
  )
})
