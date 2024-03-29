import { AuthStatus, Page, PageBlock } from '../../domain/DomainModel'
import { stylable } from '../../application/NoCSS'
import { Route, Routes, useParams } from 'react-router-dom'
import { AppSize, Dialog, LayoutLayer } from '../../application/Application'
import { observeApp, observeDirList, observeEditTools } from '../../DocsContext'
import { HStack } from '../common/Container'
import { IconButton, RedButton, Switcher } from '../common/Button'
import { Label } from '../common/Label'
import { Spacer } from '../common/Spacer'
import { observer } from '../../infrastructure/Observer'
import { useDocsContext } from '../../../App'
import { VSeparator } from '../common/Separator'
import * as React from 'react'
import { useState } from 'react'
import { type InputFormProps, TextInput } from '../common/Input'

export const Header = stylable(() => {
  return <Routes>
    <Route path="/" element={<HeaderView/>}/>
    <Route path=":docId" element={<HeaderView/>}/>
  </Routes>
})

export const HeaderVerSep = ({
  visible = true,
  marginHorizontal = '10px'
}: { visible?: boolean, marginHorizontal?: string }) => {
  if (!visible) return <></>

  return <VSeparator marginHorizontal={marginHorizontal}
                     height="20px"/>
}

export const HeaderView = observer(() => {
  console.log('new AuthPanel')
  const [filterProtocol] = useState({ value: '' })
  const editTools = observeEditTools()
  const app = observeApp()
  const dirList = observeDirList()
  const { theme, user, restApi } = useDocsContext()

  const params = useParams()

  const doc = dirList.findDoc(d => params.docId === d.id)

  const showDocList = () => {
    app.showDocList()
  }

  const handleSignOut = () => {
    if (user.authStatus === AuthStatus.AUTHORIZED) {
      restApi.logOut()
      window.scrollTo(0, 0)
    }
  }

  const createPage = () => {
    if (doc && !doc.isNew) {
      const page = doc.createPage()
      page.isEditing = true
      restApi.storePage(page, doc)
    }
  }

  const startSearching = () => {
    app.searchFilter = filterProtocol.value
  }

  const ampInd = user.email.indexOf('@')
  let email = ampInd !== -1 ? user.email.substring(0, ampInd) : user.email
  email = email.length > 30 ? email.substring(0, 27) + '...' : email

  return (
    <HStack halign="right"
            valign="center"
            width="100%"
            height="50px"
            gap="0"
            bgColor={theme.appBg}
            borderBottom={user.authStatus === AuthStatus.AUTHORIZED ? ['1px', 'solid', theme.border] : 'none'}
            paddingHorizontal="10px">

      {user.authStatus === AuthStatus.AUTHORIZED &&
        <>

          {(app.size === AppSize.S || app.size === AppSize.XS) &&
            <>

              <IconButton icon="menu"
                          popUp="Open Doc's List"
                          onClick={showDocList}/>

              <HeaderVerSep/>
            </>
          }

          {doc && editTools.editMode &&
            <>
              <Spacer width='40px' visible={app.size !== AppSize.S && app.size !== AppSize.XS}/>

              <RedButton title="Add Page"
                         onClick={createPage}/>

              <Spacer width="10px"/>

              <ToolsPanel/>
            </>
          }

          {doc && !editTools.editMode &&
            <SearchInput protocol={filterProtocol} onSubmitted={startSearching}/>
          }

          <Spacer/>

          <Label className="mono"
                 whiteSpace="pre"
                 visible={app.size !== AppSize.XS}
                 text={editTools.editMode ? 'Edit mode: ' : 'Read mode: '}
                 textColor={theme.text75}/>

          <Switcher isSelected={editTools.editMode}
                    onClick={() => {
                      editTools.toggleEditMode()
                    }}/>

          <HeaderVerSep/>

          {app.size !== AppSize.S &&
            <>
              <Label className="mono"
                     visible={app.size !== AppSize.XS}
                     text={email}
                     textColor={theme.text75}/>

              <HeaderVerSep visible={app.size !== AppSize.XS}/>
            </>
          }

          <RedButton title="Sign out"
                     onClick={handleSignOut}/>
        </>
      }
    </HStack>
  )
})

const ToolsPanel = observer(() => {
  const editTools = observeEditTools()
  const app = observeApp()
  const { restApi } = useDocsContext()

  const selectedPage = editTools.selectedItem instanceof Page && editTools.selectedItem
  const selectedPageBlock = editTools.selectedItem instanceof PageBlock && editTools.selectedItem
  const createBlock = () => {
    if (editTools.editMode && selectedPage) {
      editTools.selectedItem = selectedPage.createAndAddBlock()
    } else if (editTools.editMode && selectedPageBlock && selectedPageBlock.page) {
      const curBlockIndex = selectedPageBlock.page.blocks.findIndex(b => b.uid === selectedPageBlock.uid)
      editTools.selectedItem = selectedPageBlock.page.createAndAddBlock(curBlockIndex + 1)
    }
  }

  const moveBlockUp = () => {
    if (editTools.editMode && selectedPageBlock && selectedPageBlock.page && selectedPageBlock.page.doc) {
      if (selectedPageBlock.page.moveBlockUp(selectedPageBlock)) {
        restApi.storePage(selectedPageBlock.page, selectedPageBlock.page.doc)
      }
    }
  }

  const moveBlockDown = () => {
    if (editTools.editMode && selectedPageBlock && selectedPageBlock.page && selectedPageBlock.page.doc) {
      if (selectedPageBlock.page?.moveBlockDown(selectedPageBlock)) {
        restApi.storePage(selectedPageBlock.page, selectedPageBlock.page.doc)
      }
    }
  }

  const deleteBlock = () => {
    if (editTools.editMode && selectedPage) {
      app.dialog = new Dialog(
        'Delete?',
        `Are you sure you want to remove the page «${selectedPage.title}» with its content?`,
        () => {
          selectedPage.isEditing = false
          if (selectedPage === editTools.selectedItem) {
            editTools.select(undefined)
          }
          restApi.deletePage(selectedPage)
        },
        () => {
        }
      )
    } else if (editTools.editMode && selectedPageBlock) {
      app.dialog = new Dialog(
        'Delete?',
        "Are you sure you want to remove the selected page's block?",
        () => {
          selectedPageBlock.isEditing = false
          if (selectedPageBlock === editTools.selectedItem) {
            editTools.select(undefined)
          }

          const page = selectedPageBlock.page
          if (page?.doc && page.remove(selectedPageBlock)) {
            restApi.storePage(page, page.doc)
          }
        },
        () => {
        }
      )
    }
  }

  if (editTools.editMode) {
    return (
      <HStack className="tools"
              valign="center"
              halign="left"
              height="50px" gap="4px">

        <IconButton icon="plus"
                    popUp="New Block (Ctrl + Shift + B)"
                    onClick={createBlock}
                    disabled={!selectedPage && !selectedPageBlock}/>

        <IconButton icon="up"
                    popUp="Move Block up"
                    onClick={moveBlockUp}
                    disabled={!selectedPageBlock}/>

        <IconButton icon="down"
                    popUp="Move Block down"
                    onClick={moveBlockDown}
                    disabled={!selectedPageBlock}/>

        <IconButton icon="delete"
                    popUp="Delete Block"
                    onClick={deleteBlock}
                    disabled={!selectedPage && !selectedPageBlock}/>

      </HStack>
    )
  }
  return <></>
})

export const SearchInput = (props: InputFormProps) => {
  console.log('new SearchInput')
  const theme = useDocsContext().theme

  return (
    <HStack halign="left" valign="bottom" gap="10px" paddingLeft='35px'
            width={props.width}>

      <Label textColor={theme.text75} layer={LayoutLayer.ONE}>
        <span className="icon icon-search"/>
      </Label>

      <TextInput className='mono'
                 whiteSpace="pre"
                 fontWeight='500'
                 width='300px' height='35px'
                 marginLeft='-35px'
                 paddingLeft='35px'
                 placeholder='Search'
                 textColor={theme.search}
                 caretColor={theme.caretColor}
                 borderColor={theme.transparent}
                 bgColor={theme.transparent}
                 focusState={state => {
                   state.borderColor = theme.border
                   state.bgColor = theme.inputBg
                 }}
                 hoverState={state => {
                   state.borderColor = theme.border
                   state.bgColor = theme.inputBg
                 }}
                 placeholderState={state => {
                   state.opacity = '1'
                 }}
                 {...props}/>
    </HStack>
  )
}
