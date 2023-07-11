import { useState } from 'react'
import { AuthStatus, Page, PageBlock } from '../domain/DomainModel'
import { stylable } from '../application/NoCSS'
import { Route, Routes, useParams } from 'react-router-dom'
import { SmallSpinner } from './common/Loading'
import { AppSize, YesNoDialog } from '../application/Application'
import { observeApp, observeDirList, observeEditTools } from '../DocsContext'
import {
  DropDownContainer,
  HStack,
  IconButton,
  Input,
  Label,
  RedButton,
  Spacer,
  Switcher,
  VSeparator,
  VStack
} from '../application/NoCSSComponents'
import { observer } from '../infrastructure/Observer'
import { useDocsContext } from '../../App'

export const Header = stylable(() => {
  return <Routes>
    <Route path="/" element={<HeaderView/>}/>
    <Route path=":docUID" element={<HeaderView/>}/>
  </Routes>
})

export const HeaderVerSep = ({ visible = true }: { visible?: boolean }) => {
  const { theme } = useDocsContext()

  if (!visible) return <></>

  return <VSeparator theme={theme}
                     marginHorizontal="10px"
                     height="20px"/>
}

export const HeaderView = observer(() => {
  console.log('new AuthPanel')
  const editTools = observeEditTools()
  const app = observeApp()
  const dirList = observeDirList()
  const { theme, user } = useDocsContext()

  const [isDropDownOpened, setIsDropDown] = useState(false)
  const params = useParams()

  const doc = dirList.findDoc(d => params.docUID === d.uid)

  const showDocList = () => {
    app.showDocList()
  }

  const handleSignOut = () => {
    if (user.authStatus === AuthStatus.AUTHORIZED) {
      user.signOut()
      window.scrollTo(0, 0)
    }
  }

  const createPage = () => {
    doc?.createPage()
  }

  return (
    <HStack halign="right"
            valign="center"
            width="100%"
            height="50px"
            gap="0"
            bgColor={editTools.editMode ? theme.appBg : '0'}
            borderBottom={user.authStatus === AuthStatus.AUTHORIZED ? ['1px', 'solid', theme.border] : 'none'}
            paddingHorizontal="10px">

      {user.authStatus === AuthStatus.AUTHORIZED &&
        <>

          {(app.size === AppSize.S || app.size === AppSize.XS) &&
            <>

              <IconButton icon="menu"
                          popUp="Open Doc's List"
                          theme={theme}
                          onClick={showDocList}/>

              <HeaderVerSep/>
            </>
          }

          {editTools.editMode &&
            <>
              <RedButton title="New Page"
                         theme={theme}
                         onClick={createPage}
                         hideBg/>

              <Spacer width="10px"/>

              <ToolsPanel/>
            </>}

          <Spacer/>

          <Label className="mono"
                 whiteSpace="pre"
                 visible={app.size !== AppSize.XS}
                 text={editTools.editMode ? 'Edit mode: ' : 'Read mode: '}
                 textColor={theme.text75}/>

          <Switcher color={theme.appBg}
                    selectionColor={theme.red}
                    isSelected={editTools.editMode}
                    onClick={() => { editTools.toggleEditMode() }}/>

          <HeaderVerSep/>

          <Label className="mono"
                 visible={app.size !== AppSize.XS}
                 text={user.login}
                 textColor={theme.text75}/>

          <HeaderVerSep visible={app.size !== AppSize.XS}/>

          <RedButton title="Sign out"
                     hideBg
                     theme={theme}
                     onClick={handleSignOut}/>
        </>
      }

      {user.authStatus !== AuthStatus.AUTHORIZED &&
        <>

          <Spacer/>

          <RedButton title="Sign in"
                     theme={theme}
                     isSelected={isDropDownOpened}
                     hideBg
                     onClick={() => {
                       setIsDropDown(!isDropDownOpened)
                     }}/>

          <AuthDropDown isDropDownOpened={isDropDownOpened}
                        onClose={() => { setIsDropDown(false) }}/>
        </>
      }
    </HStack>
  )
})

const AuthDropDown = ({ isDropDownOpened, onClose }: { isDropDownOpened: boolean, onClose: () => void }) => {
  const { theme, user } = useDocsContext()

  const [nameProtocol, _] = useState({ value: user.login })
  const [pwdProtocol, __] = useState({ value: user.pwd })

  const handleSignIn = () => {
    if (user.authStatus === AuthStatus.SIGNED_OUT) {
      user.signIn(nameProtocol.value, pwdProtocol.value)
    }
  }

  return <DropDownContainer isOpened={isDropDownOpened} onClose={onClose}
                            bgColor={theme.panelBg}
                            minWidth="250px"
                            top="50px"
                            absolute>
    <VStack halign="center" valign="top" gap="10px"
            padding="20px"
            shadow="0 5px 5px #00000020">
      <Input type="text"
             protocol={nameProtocol}
             theme={theme}
             title="Login"
             placeHolder="Enter your name"
             onSubmitted={handleSignIn}/>

      <Input type="password"
             protocol={pwdProtocol}
             theme={theme}
             title="Password"
             placeHolder="Enter your password"
             onSubmitted={handleSignIn}/>

      {user.authStatus !== AuthStatus.AUTHORIZING &&

        <RedButton title="Submit"
                   hideBg
                   theme={theme}
                   onClick={handleSignIn}/>
      }

      {user.authStatus === AuthStatus.AUTHORIZING &&
        <SmallSpinner/>
      }

      {user.authWithError &&
        <Label fontSize="14px"
               text={user.authWithError}
               textColor={theme.error}/>
      }
    </VStack>

  </DropDownContainer>
}

const ToolsPanel = observer(() => {
  const editTools = observeEditTools()
  const app = observeApp()
  const { theme } = useDocsContext()

  const selectedPage = editTools.selectedItem instanceof Page && editTools.selectedItem
  const selectedPageBlock = editTools.selectedItem instanceof PageBlock && editTools.selectedItem
  const createBlock = () => {
    if (editTools.editMode && selectedPage) {
      selectedPage.createAndAddBlock()
    } else if (editTools.editMode && selectedPageBlock && selectedPageBlock.page) {
      const curBlockIndex = selectedPageBlock.page.blocks.findIndex(b => b.uid === selectedPageBlock.uid)
      selectedPageBlock.page.createAndAddBlock(curBlockIndex + 1)
    }
  }

  const moveBlockUp = () => {
    if (editTools.editMode && selectedPageBlock) {
      selectedPageBlock.page?.moveBlockUp(selectedPageBlock)
    }
  }

  const moveBlockDown = () => {
    if (editTools.editMode && selectedPageBlock) {
      selectedPageBlock.page?.moveBlockDown(selectedPageBlock)
    }
  }

  const deleteBlock = () => {
    if (editTools.editMode && selectedPage) {
      app.yesNoDialog = new YesNoDialog(
        `Are you sure you want to remove the page «${selectedPage.title}» with its content?`,
        () => {
          selectedPage.isEditing = false
          if (selectedPage === editTools.selectedItem) { editTools.select(undefined) }

          selectedPage.doc?.deletePage(selectedPage)
        }
      )
    } else if (editTools.editMode && selectedPageBlock) {
      app.yesNoDialog = new YesNoDialog(
        "Are you sure you want to remove the selected page's block?",
        () => {
          selectedPageBlock.isEditing = false
          if (selectedPageBlock === editTools.selectedItem) { editTools.select(undefined) }

          selectedPageBlock.page?.deleteBlock(selectedPageBlock)
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
                    popUp="Add new Block"
                    theme={theme}
                    onClick={createBlock}
                    disabled={!selectedPage && !selectedPageBlock}/>

        <IconButton icon="up"
                    popUp="Move Block up"
                    theme={theme}
                    onClick={moveBlockUp}
                    disabled={!selectedPageBlock}/>

        <IconButton icon="down"
                    popUp="Move Block down"
                    theme={theme}
                    onClick={moveBlockDown}
                    disabled={!selectedPageBlock}/>

        <IconButton icon="delete"
                    popUp="Delete Block"
                    theme={theme}
                    onClick={deleteBlock}
                    disabled={!selectedPage && !selectedPageBlock}/>

      </HStack>
    )
  }
  return <></>
})
