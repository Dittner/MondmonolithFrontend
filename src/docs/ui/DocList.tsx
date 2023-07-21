import { useLocation, useNavigate } from 'react-router-dom'
import * as React from 'react'
import { type ChangeEvent, useRef, useState } from 'react'
import { useDocsContext } from '../../App'
import { AppSize } from '../application/Application'
import { type Directory, type Doc, LoadStatus } from '../domain/DomainModel'
import { stylable } from '../application/NoCSS'
import { observeApp, observeDirList, observeEditTools } from '../DocsContext'
import { HeaderVerSep } from './Header'
import { observe, observer } from '../infrastructure/Observer'
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
  const app = observeApp()
  const editTools = observeEditTools()
  const dirList = observeDirList()
  const { domainService, theme, themeManager } = useDocsContext()

  const [isNewDocCreating, setIsNewDocCreating] = useState(false)

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
              paddingLeft="10px"
              paddingRight="10px">

        <IconButton icon={theme.isDark ? 'moon' : 'sun'}
                    hideBg
                    popUp="Switch a theme"
                    theme={theme}
                    onClick={() => {
                      themeManager.switchTheme()
                    }}/>

        {editTools.editMode &&
          <>

            <RedButton title="New doc"
                       theme={theme}
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
                    theme={theme}
                    popUp="Close Doc's List"
                    onClick={hideDocList}/>
      </HStack>

      {isNewDocCreating &&
        <DocEditForm doc={null}
                     onCancel={onCancel}
                     onApply={onApply}/>
      }

      {dirList.dirs.map(dir => {
        return <DirectoryView key={dir.uid} dir={dir}/>
      })}
    </VStack>
  )
}))

const DocPicker = () => {
  const [value, setValue] = useState('')
  const { docsLoader, theme } = useDocsContext()

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
               theme={theme}
               hideBg
               onClick={importDoc}/>

    <input ref={inputRef} className="btn" type="file" onChange={handleFileChange} value={value}
           style={{ display: 'none' }}
    />
  </>
}

const DirectoryView = observer(({ dir }: { dir: Directory }) => {
  const editTools = observeEditTools()
  observe(dir)
  const { domainService, theme } = useDocsContext()

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
    <VStack width="100%"
            gap='0'
            halign="left"
            valign="center"
            textColor={theme.text75}
            paddingBottom='30px'
            onDoubleClick={startEditing}>

      <Label className="notSelectable"
             height="30px"
             paddingLeft="20px"
             paddingRight="5px"
             text={dir.title}
             textAlign="left"
             width="100%"/>
      {
        dir.docs.map(doc => {
          return <DocLink key={doc.uid} doc={doc}/>
        })
      }
    </VStack>

  </>
})

const DocLink = observer(({ doc }: { doc: Doc }) => {
  observe(doc)
  const { domainService, editTools, theme } = useDocsContext()

  const navigate = useNavigate()
  const location = useLocation()
  const isDocSelected = location.pathname === '/docs/' + doc.uid

  const onApply = (newDocTitle: string, newDirTitle: string) => {
    domainService.updateDocHeader(doc, newDocTitle, newDirTitle)
  }

  const onCancel = () => {
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
    if (!isDocSelected) navigate(`./${doc.uid}`)
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
            height="30px"
            halign="left"
            valign="center"
            textColor={isDocSelected ? theme.text : theme.text75}
            paddingLeft="20px"
            paddingRight="5px"
            gap="8px"
            bgColor = {isDocSelected ? theme.docSelection : theme.docListBg}
            hoverState={state => {
              state.textColor = theme.text
              state.bgColor = theme.docSelection
            }}
            onClick={openDoc}
            onDoubleClick={startEditing}>

      <Label className='icon-doc' paddingBottom='5px'/>

      <Label className="notSelectable"
             text={isDocSelected ? doc.title + ' ' : doc.title}
             textAlign="left"
             width="100%"/>
    </HStack>
  )
})

const DocEditForm = (props: any) => {
  console.log('new DocEditForm')
  const { theme } = useDocsContext()

  const doc = props.doc as Doc
  const onCancel = props.onCancel as () => void
  const onApply = props.onApply as (docTitle: string, dirTitle: string) => void
  const [newDocTitleProtocol, _] = useState({ value: doc?.title ?? '' })
  const [newDirTitleProtocol, __] = useState({ value: doc?.dir?.title ?? '' })

  const apply = () => {
    onApply(newDocTitleProtocol.value, newDirTitleProtocol.value)
  }
  const cancel = () => {
    onCancel()
  }

  return (
    <VStack className="editForm"
            halign="stretch"
            valign="center"
            padding="20px"
            bgColor={theme.white25}
            borderBottom={['1px', 'solid', theme.appBg]}>
      <HStack halign="center" valign="center">
        <Input type="text"
               protocol={newDocTitleProtocol}
               theme={theme}
               title="Doc's title"
               onSubmitted={apply}
               autoFocus/>

        <Input type="text"
               protocol={newDirTitleProtocol}
               title="Directory"
               theme={theme}
               onSubmitted={apply}/>
      </HStack>

      <HStack halign="center" valign="center" gap="50px">
        <RedButton title="Cancel"
                   theme={theme}
                   hideBg
                   onClick={cancel}/>

        <RedButton title="Save"
                   theme={theme}
                   hideBg
                   onClick={apply}/>
      </HStack>

      <Label visible={doc?.storeWithError !== ''}
             text={doc?.storeWithError}
             textColor={theme.error}/>
    </VStack>
  )
}

const DirEditForm = (props: any) => {
  console.log('new DirEditForm')
  const { theme } = useDocsContext()

  const dir = props.dir as Directory
  const onCancel = props.onCancel as () => void
  const onApply = props.onApply as (title: string) => void

  const [titleProtocol, _] = useState({ value: dir.title })

  const apply = () => {
    if (!dir.isStoring && titleProtocol.value) {
      onApply(titleProtocol.value)
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
            bgColor={theme.white25}
            borderBottom={['1px', 'solid', theme.appBg]}>

      <Input type="text"
             protocol={titleProtocol}
             theme={theme}
             title="Directory"
             onSubmitted={apply}
             autoFocus
      />

      <HStack halign="center" valign="center" gap="50px">
        <RedButton title="Cancel"
                   theme={theme}
                   hideBg
                   onClick={cancel}/>

        <RedButton title="Save"
                   theme={theme}
                   hideBg
                   onClick={apply}/>
      </HStack>

      <Label visible={dir?.storeWithError !== ''}
             text={dir?.storeWithError}
             textColor={theme.error}/>
    </VStack>
  )
}
