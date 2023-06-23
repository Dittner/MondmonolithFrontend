import {useState} from "react";
import {useDocsContext} from "../../App";
import {AuthStatus, Page, PageBlock} from "../domain/DomainModel";
import {observer} from "mobx-react";
import {stylable} from "../application/NoCSS";
import {Route, Routes, useParams} from "react-router-dom";
import {SmallSpinner} from "./common/Loading";
import {AppSize, YesNoDialog} from "../application/Application";
import {Spacer} from "./common/Spacer";
import {VSeparator} from "./common/Separator";
import {
  DropDownContainer,
  HStack,
  IconButton,
  Input,
  Label,
  RedButton,
  Switch,
  VStack
} from "../application/NoCSSComponents";

export const Header = stylable(() => {
  return <Routes>
    <Route path="/" element={<HeaderView/>}/>
    <Route path=":docUID" element={<HeaderView/>}/>
  </Routes>
})

export const HeaderVerSep = ({visible = true}: { visible?: boolean }) => {
  const {app} = useDocsContext()

  if (!visible) return <></>

  return <VSeparator theme={app.theme}
                     marginHorizontal="10px"
                     height="20px"/>
}

export const HeaderView = observer(() => {
  console.log("new AuthPanel")
  const [isDropDownOpened, setIsDropDown] = useState(false)
  const params = useParams()
  const docsContext = useDocsContext()
  const {user, editTools, app} = docsContext

  const doc = docsContext.findDoc(d => params.docUID === d.uid)

  const [name, setName] = useState(user.login)
  const [pwd, setPwd] = useState(user.pwd)

  const showDocList = () => {
    app.isDocListShown = true
  }

  const handleSignIn = () => {
    if (user.authStatus === AuthStatus.SIGNED_OUT) {
      user.signIn(name, pwd)
    }
  }

  const handleSignOut = () => {
    if (user.authStatus === AuthStatus.AUTHORIZED) {
      setName("demo")
      setPwd("pwd")
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
            bgColor={editTools.editMode ? app.theme.appBg : "0"}
            borderBottom={user.authStatus === AuthStatus.AUTHORIZED ? ["1px", "solid", app.theme.border] : "none"}
            paddingHorizontal="10px">

      {user.authStatus === AuthStatus.AUTHORIZED &&
      <>

        {(app.size === AppSize.S || app.size === AppSize.XS) &&
        <>

          <IconButton icon="menu"
                      popUp="Open Doc's List"
                      theme={app.theme}
                      onClick={showDocList}/>

          <HeaderVerSep/>
        </>
        }

        {editTools.editMode &&
        <>
          <RedButton title="New Page"
                     theme={app.theme}
                     onClick={createPage}
                     hideBg/>

          <Spacer width="10px"/>

          <ToolsPanel/>
        </>}

        <Spacer/>

        <Label className="mono"
               whiteSpace="pre"
               visible={app.size !== AppSize.XS}
               title={editTools.editMode ? "Edit mode: " : "Read mode: "}
               textColor={app.theme.text75}/>

        <Switch theme={app.theme} isSelected={editTools.editMode} onClick={() =>
          editTools.toggleEditMode()}/>

        <HeaderVerSep/>

        <Label className="mono"
               visible={app.size !== AppSize.XS}
               title={user.login}
               textColor={app.theme.text75}/>

        <HeaderVerSep visible={app.size !== AppSize.XS}/>


        <RedButton title="Sign out"
                   hideBg
                   theme={app.theme}
                   onClick={handleSignOut}/>
      </>
      }


      {user.authStatus !== AuthStatus.AUTHORIZED &&
      <>

        <Spacer/>

        <RedButton title="Sign in"
                   theme={app.theme}
                   isSelected={isDropDownOpened}
                   hideBg
                   onClick={() => {
                     setIsDropDown(!isDropDownOpened)
                   }}/>

        <DropDownContainer isOpened={isDropDownOpened} onClose={() =>
          setIsDropDown(false)}
                           bgColor={app.theme.panelBg}
                           minWidth="250px"
                           top="50px"
                           absolute>
          <VStack halign="center" valign="top" gap="10px"
                  padding="20px"
                  shadow="0 5px 5px #00000020">
            <Input type="text"
                   text={name}
                   theme={app.theme}
                   title="Login"
                   placeHolder="Enter your name"
                   onChange={(value: string) => setName(value)}
                   onSubmitted={handleSignIn}/>

            <Input type="password"
                   text={pwd}
                   theme={app.theme}
                   title="Password"
                   placeHolder="Enter your password"
                   onChange={(value: string) => setPwd(value)}
                   onSubmitted={handleSignIn}/>

            {user.authStatus !== AuthStatus.AUTHORIZING &&

            <RedButton title="Submit"
                       hideBg
                       theme={app.theme}
                       onClick={handleSignIn}/>

            }

            {user.authStatus === AuthStatus.AUTHORIZING &&
            <SmallSpinner/>
            }

            {user.authWithError &&
            <Label fontSize="14px"
                   title={user.authWithError}
                   textColor={app.theme.error}/>
            }
          </VStack>

        </DropDownContainer>
      </>
      }
    </HStack>
  )
})

const ToolsPanel = observer(() => {
  const {editTools, app} = useDocsContext()
  const selectedPage = editTools.selectedItem instanceof Page && editTools.selectedItem as Page
  const selectedPageBlock = editTools.selectedItem instanceof PageBlock && editTools.selectedItem as PageBlock
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
          if (selectedPage === editTools.selectedItem)
            editTools.selectedItem = undefined

          selectedPage.doc?.deletePage(selectedPage)
        }
      )
    } else if (editTools.editMode && selectedPageBlock) {
      app.yesNoDialog = new YesNoDialog(
        "Are you sure you want to remove the selected page's block?",
        () => {
          selectedPageBlock.isEditing = false
          if (selectedPageBlock === editTools.selectedItem)
            editTools.selectedItem = undefined

          selectedPageBlock.page?.deleteBlock(selectedPageBlock)
        }
      )
    }
  }

  if (editTools.editMode)
    return (
      <HStack className="tools"
              valign="center"
              halign="left"
              height="50px" gap="4px">

        <IconButton icon="plus"
                    popUp="Add new Block"
                    theme={app.theme}
                    onClick={createBlock}
                    disabled={!selectedPage && !selectedPageBlock}/>

        <IconButton icon="up"
                    popUp="Move Block up"
                    theme={app.theme}
                    onClick={moveBlockUp}
                    disabled={!selectedPageBlock}/>

        <IconButton icon="down"
                    popUp="Move Block down"
                    theme={app.theme}
                    onClick={moveBlockDown}
                    disabled={!selectedPageBlock}/>

        <IconButton icon="delete"
                    popUp="Delete Block"
                    theme={app.theme}
                    onClick={deleteBlock}
                    disabled={!selectedPage && !selectedPageBlock}/>

      </HStack>
    )
  return <></>
})

