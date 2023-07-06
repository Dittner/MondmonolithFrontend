import { useLocation, useNavigate } from 'react-router-dom'
import * as React from 'react'
import { type ChangeEvent, useRef, useState } from 'react'
import { useDocsContext } from '../../App'
import { AppSize } from '../application/Application'
import { observer } from 'mobx-react'
import { type Directory, type Doc } from '../domain/DomainModel'
import { stylable } from '../application/NoCSS'
import { LoadStatus } from '../DocsContext'
import { HeaderVerSep } from './Header'
import {
  HStack,
  IconButton,
  Input,
  Label,
  RedButton,
  Spacer,
  StylableContainer,
  VStack
} from '../application/NoCSSComponents'

export const DocList = observer(stylable(() => {
  console.log('new DocList')
  const [isNewDocCreating, setIsNewDocCreating] = useState(false)
  const docsContext = useDocsContext()
  const { app, domainService } = docsContext

  const onCancel = () => {
    setIsNewDocCreating(false)
  }

  const onApply = (docTitle: string, dirTitle: string) => {
    if (docTitle && dirTitle) {
      domainService.createDoc(docTitle, dirTitle)
      setIsNewDocCreating(false)
    }
  }

  const hideDocList = () => {
    app.hideDocList()
  }

  if (docsContext.dirsLoadStatus === LoadStatus.LOADING) {
    return <StylableContainer width="100%"
                              height="100%"
                              bgColor={app.theme.docListBg}/>
  }
  return (
    <VStack valign="top"
            halign="center"
            gap="0"
            width="100%"
            height="100%"
            bgColor={app.theme.docListBg}>

      <HStack halign="center"
              valign="center"
              gap="0"
              width="100%"
              minHeight="50px"
              paddingLeft="10px"
              paddingRight="10px">

        <IconButton icon={app.theme.isDark ? 'moon' : 'sun'}
                    hideBg
                    popUp="Switch a theme"
                    theme={app.theme}
                    onClick={() => {
                      app.switchTheme()
                    }}/>

        {docsContext.editTools.editMode &&
          <>

            <RedButton title="New doc"
                       theme={app.theme}
                       hideBg
                       onClick={() => {
                         setIsNewDocCreating(true)
                       }}/>

            <HeaderVerSep/>

            <DocPicker/>
          </>
        }

        <Spacer/>

        <IconButton icon="close"
                    hideBg
                    visible={app.isDocListShown && (app.size === AppSize.S || app.size === AppSize.XS)}
                    theme={app.theme}
                    popUp="Close Doc's List"
                    onClick={hideDocList}/>
      </HStack>

      {isNewDocCreating &&
        <DocEditForm doc={null}
                     onCancel={onCancel}
                     onApply={onApply}/>
      }

      {docsContext.dirs.map(dir => {
        return <DirectoryView key={dir.uid} dir={dir}/>
      })}
    </VStack>
  )
}))

const DocPicker = observer(() => {
  const [value, setValue] = useState('')
  const { docsLoader, app } = useDocsContext()
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const f = e.target.files[0]
      docsLoader.loadDocFromDisc(f)
      setValue('')
    }
  }

  const importDoc = () => {
    inputRef.current?.click()
  }

  return <>
    <RedButton title="Import"
               theme={app.theme}
               hideBg
               onClick={importDoc}/>

    <input ref={inputRef} className="btn" type="file" onChange={handleFileChange} value={value}
           style={{ display: 'none' }}
    />
  </>
})

const DirectoryView = observer(({ dir }: { dir: Directory }) => {
  const { domainService, app, editTools } = useDocsContext()

  const onApply = (title: string) => {
    domainService.updateDirTitle(dir, title)
  }

  const onCancel = () => {
    dir.isEditing = false
  }

  const startEditing = () => {
    if (!dir.isStoring && editTools.editMode) {
      dir.isEditing = true
    }
  }

  if (editTools.editMode && dir.isEditing) {
    return <>
      <DirEditForm dir={dir}
                   onCancel={onCancel}
                   onApply={onApply}/>
      {
        dir.docs.map(doc => {
          return <DocLink key={doc.uid} doc={doc}/>
        })
      }
    </>
  }
  return <>
    <HStack width="100%"
            height="35px"
            halign="left"
            valign="center"
            textColor={app.theme.text75}
            paddingLeft="20px"
            paddingRight="5px"
            onDoubleClick={startEditing}>

      <Label className="notSelectable"
             text={dir.title}
             textTransform="uppercase"
             textAlign="left"
             width="100%"/>
    </HStack>

    {
      dir.docs.map(doc => {
        return <DocLink key={doc.uid} doc={doc}/>
      })
    }
  </>
})

const DocLink = observer((props: any) => {
  const doc = props.doc as Doc
  const { app, domainService, editTools } = useDocsContext()
  const navigate = useNavigate()
  const location = useLocation()
  const isDocSelected = location.pathname === '/docs/' + doc.uid

  const onApply = (newDocTitle: string, newDirTitle: string) => {
    domainService.updateDocHeader(doc, newDocTitle, newDirTitle)
  }

  const onCancel = () => {
    doc.isEditing = false
  }

  const startEditing = () => {
    if (!doc.isStoring && editTools.editMode && isDocSelected) {
      doc.isEditing = true
    }
  }

  const openDoc = () => {
    navigate(`./${doc.uid}`)
  }

  if (editTools.editMode && doc.isEditing) {
    return (
      <DocEditForm doc={doc}
                   onCancel={onCancel}
                   onApply={onApply}/>
    )
  }

  return (
    <HStack width="100%"
            height="35px"
            halign="left"
            valign="center"
            textColor={isDocSelected ? app.theme.text : app.theme.text75}
            paddingLeft="40px"
            paddingRight="5px"
            hoverState={state => {
              state.textColor = app.theme.text
              state.bgColor = app.theme.docSelection
            }}
            onClick={openDoc}
            onDoubleClick={startEditing}>

      <Label className="notSelectable"
             text={isDocSelected ? doc.title + ' ' : doc.title}
             textAlign="left"
             width="100%"/>
    </HStack>
  )
})

const DocEditForm = observer((props: any) => {
  const { app } = useDocsContext()
  const doc = props.doc as Doc | undefined
  const onCancel = props.onCancel as () => void
  const onApply = props.onApply as (docTitle: string, dirTitle: string) => void
  console.log('new DocEditForm')

  const [newDocTitle, setNewDocTitle] = useState(doc?.title ?? '')
  const [newDirTitle, setNewDirTitle] = useState(doc?.dir?.title ?? '')

  const apply = () => {
    onApply(newDocTitle, newDirTitle)
  }
  const cancel = () => {
    onCancel()
  }

  return (
    <VStack className="editForm"
            halign="stretch"
            valign="center"
            padding="20px"
            bgColor={app.theme.white25}
            borderBottom={['1px', 'solid', app.theme.appBg]}>
      <HStack halign="center" valign="center">
        <Input type="text"
               text={newDocTitle}
               theme={app.theme}
               title="Doc's title"
               onSubmitted={apply}
               onChange={setNewDocTitle}
               autoFocus/>

        <Input type="text"
               text={newDirTitle}
               title="Directory"
               theme={app.theme}
               onSubmitted={apply}
               onChange={setNewDirTitle}/>
      </HStack>

      <HStack halign="center" valign="center" gap="50px">
        <RedButton title="Cancel"
                   theme={app.theme}
                   hideBg
                   onClick={cancel}/>

        <RedButton title="Save"
                   theme={app.theme}
                   hideBg
                   onClick={apply}/>
      </HStack>

      <Label visible={doc?.storeWithError !== ''}
             text={doc?.storeWithError}
             textColor={app.theme.error}/>
    </VStack>

  )
})

const DirEditForm = observer((props: any) => {
  console.log('new DirEditForm')
  const { app } = useDocsContext()
  const dir = props.dir as Directory
  const onCancel = props.onCancel as () => void
  const onApply = props.onApply as (title: string) => void

  const [title, setTitle] = useState(dir.title || '')

  const apply = () => {
    if (!dir.isStoring && title) {
      onApply(title)
    }
  }
  const cancel = () => {
    onCancel()
  }

  return (
    <VStack className="editForm"
            halign="stretch"
            valign="center"
            padding="20px"
            bgColor={app.theme.white25}
            borderBottom={['1px', 'solid', app.theme.appBg]}>

      <Input type="text"
             text={title}
             theme={app.theme}
             title="Directory"
             onSubmitted={apply}
             onChange={setTitle}
             autoFocus
      />

      <HStack halign="center" valign="center" gap="50px">
        <RedButton title="Cancel"
                   theme={app.theme}
                   hideBg
                   onClick={cancel}/>

        <RedButton title="Save"
                   theme={app.theme}
                   hideBg
                   onClick={apply}/>
      </HStack>

      <Label visible={dir?.storeWithError !== ''}
             text={dir?.storeWithError}
             textColor={app.theme.error}/>
    </VStack>
  )
})
