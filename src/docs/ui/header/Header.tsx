import {useEffect, useState} from "react";
import './header.css';
import {useDocsContext} from "../../../App";
import {AuthStatus, Page, PageBlock} from "../../domain/DomainModel";
import {observer} from "mobx-react";
import {HAlign, HStack, stylable, VAlign, VStack} from "../../../docs/application/NoCSS";
import {Input} from "../common/Input";
import {Route, Routes, useParams} from "react-router-dom";
import {SmallSpinner} from "../common/Loading";
import {AppSize, YesNoDialog} from "../../application/Application";
import {Spacer} from "../common/Spacer";
import {VSeparator} from "../common/Separator";

export const Header = stylable(() => {
  return <Routes>
    <Route path="/" element={<HeaderView/>}/>
    <Route path=":docUID" element={<HeaderView/>}/>
  </Routes>
})

export const HeaderVerSep = () => {
  const {app} = useDocsContext()
  return <VSeparator marginHorizontal={app.size === AppSize.XS ? "10px" : "15px"} height="20px"/>
}

export const HeaderView = observer(() => {
  console.log("new AuthPanel")
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
    }
  }

  const createPage = () => {
    doc?.createPage()
  }

  let rootContClassName = ""
  if (editTools.editMode) rootContClassName = "withBg "
  else if (user.authStatus === AuthStatus.AUTHORIZED) rootContClassName = "withBottomBorder "

  return (
    <HStack className={rootContClassName} halign={HAlign.RIGHT}
            valign={VAlign.CENTER}
            height="100%"
            gap="0"
            paddingHorizontal="20px">
      {user.authStatus === AuthStatus.AUTHORIZED &&
      <>

        {(app.size === AppSize.S || app.size === AppSize.XS) &&
        <>
          <button className="icon-menu long"
                  onClick={showDocList}/>

          <Spacer/>

          {editTools.editMode &&
          <>
            <button className="btn"
                    onClick={createPage}>New Page
            </button>

            <HeaderVerSep/>

            <ToolsPanel/>

            <HeaderVerSep/>
          </>
          }
        </>
        }

        {app.size === AppSize.M &&
        <>

          <Spacer/>

          {editTools.editMode &&
          <>
            <button className="btn"
                    onClick={createPage}>New Page
            </button>

            <HeaderVerSep/>

            <ToolsPanel/>

            <HeaderVerSep/>
          </>
          }
        </>
        }

        {app.size === AppSize.L &&
        <>

          <Spacer width="50px"/>

          {editTools.editMode &&
          <>
            <button className="btn"
                    onClick={createPage}>New Page
            </button>

            <HeaderVerSep/>

            <ToolsPanel/>

            <Spacer/>
          </>
          }
        </>
        }

        {app.size !== AppSize.XS &&
        <p className="textDark mono">{editTools.editMode ? "Edit mode: " : "Read mode: "}</p>
        }
        <label className="switch">
          <input type="checkbox"
                 checked={editTools.editMode}
                 onChange={() => editTools.toggleEditMode()}/>
          <span className="roundBtn"></span>
        </label>

        <HeaderVerSep/>

        {app.size !== AppSize.XS &&
        <>
          <p className="textDark mono">{user.login}</p>
          <HeaderVerSep/>
        </>
        }

        <button className="btn"
                onClick={handleSignOut}>Sign out
        </button>

        {/*<Spacer width="20px"/>*/}
      </>
      }

      {user.authStatus !== AuthStatus.AUTHORIZED &&
      <>
        <Spacer/>
        <DropDown className='loginDropDown' title='Sign in'>
          <VStack halign={HAlign.CENTER} valign={VAlign.TOP} gap="5px">
            <Input type="text"
                   defaultValue={name}
                   titel="Login"
                   placeHolder="Enter your name"
                   onChange={(value: string) => setName(value)}
                   onSubmitted={handleSignIn}
                   />
            <Input type="password"
                   defaultValue={pwd}
                   titel="Password"
                   placeHolder="Enter your password"
                   onChange={(value: string) => setPwd(value)}
                   onSubmitted={handleSignIn}/>

            {user.authStatus !== AuthStatus.AUTHORIZING &&
            <button className="btn"
                    value="Submit"
                    onClick={handleSignIn}>Submit
            </button>
            }

            {user.authStatus === AuthStatus.AUTHORIZING &&
            <SmallSpinner/>
            }

            {user.authWithError &&
            <p className="error">{user.authWithError}</p>
            }

          </VStack>

        </DropDown>
      </>
      }
    </HStack>
  )
})

const ToolsPanel = observer(() => {
  const {editTools, app} = useDocsContext()
  const selectedPage = editTools.selectedItem instanceof Page && editTools.selectedItem as Page
  const selectedPageBlock = editTools.selectedItem instanceof PageBlock && editTools.selectedItem as PageBlock
  const createBlock = (e: any) => {
    e.stopPropagation()
    if (editTools.editMode && selectedPage) {
      selectedPage.createAndAddBlock()
    } else if (editTools.editMode && selectedPageBlock && selectedPageBlock.page) {
      const curBlockIndex = selectedPageBlock.page.blocks.findIndex(b => b.uid === selectedPageBlock.uid)
      selectedPageBlock.page.createAndAddBlock(curBlockIndex + 1)
    }
  }

  const moveBlockUp = (e: any) => {
    e.stopPropagation()
    if (editTools.editMode && selectedPageBlock) {
      selectedPageBlock.page?.moveBlockUp(selectedPageBlock)
    }
  }

  const moveBlockDown = (e: any) => {
    e.stopPropagation()
    if (editTools.editMode && selectedPageBlock) {
      selectedPageBlock.page?.moveBlockDown(selectedPageBlock)
    }
  }

  const editBlockDown = (e: any) => {
    e.stopPropagation()
    if (editTools.editMode && selectedPageBlock) {
      selectedPageBlock.isEditing = true
    }
  }

  const deleteBlock = (e: any) => {
    e.stopPropagation()
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
              valign={VAlign.CENTER}
              halign={HAlign.LEFT}
              height="50px" gap="4px">
        <button className="icon-edit long"
                disabled={!editTools.selectedItem}
                title="Edit Block"
                onClick={editBlockDown}/>
        <button className="icon-plus long"
                disabled={!editTools.selectedItem}
                title="Add new Block"
                onClick={createBlock}/>
        <button className="icon-up long"
                disabled={!selectedPageBlock}
                title="Move Block up"
                onClick={moveBlockUp}/>
        <button className="icon-down long"
                disabled={!selectedPageBlock}
                title="Move Block down"
                onClick={moveBlockDown}/>
        <button className="icon-delete long"
                disabled={!editTools.selectedItem}
                title="Delete Block"
                onClick={deleteBlock}/>
      </HStack>
    )
  return <></>
})


const DropDown = (props: any) => {
  const [isOpened, setOpen] = useState(false);

  const handleChange = () => {
    setOpen(!isOpened)
  }

  useEffect(() => {
    const close = () => {
      setOpen(false)
      window.removeEventListener('mousedown', close)
    }

    setTimeout(() => {
      if (isOpened) {
        window.addEventListener('mousedown', close)
      }
    }, 10)
  }, [isOpened])

  return (
    <div className={props.className}>
      <p className={(isOpened ? 'dropDownLbl-opened' : ' dropDownLbl')}
         onMouseDown={handleChange}>
        {props.title}
      </p>
      {
        isOpened &&
        <div className="dropDownList"
             onMouseDown={(e) => {
               e.stopPropagation()
             }}>
          {props.children}
        </div>
      }
    </div>
  )
}
