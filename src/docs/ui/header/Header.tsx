import {useEffect, useState} from "react";
import './header.css';
import {useDocsContext} from "../../../App";
import {AuthStatus, Page, PageBlock} from "../../domain/DomainModel";
import {observer} from "mobx-react";
import {HAlign, VAlign, VStack} from "../common/Stack";
import {Input} from "../common/Input";
import {Route, Routes, useParams} from "react-router-dom";
import {SmallSpinner} from "../common/Loading";
import {YesNoDialog} from "../../DocsContext";
import {Spacer} from "../common/Spacer";

export const Header = () => {
  return <Routes>
    <Route path="/" element={<HeaderView/>}/>
    <Route path=":docUID" element={<HeaderView/>}/>
  </Routes>
}

export const HeaderView = observer(() => {
  console.log("new AuthPanel")
  const params = useParams()
  const docsContext = useDocsContext()
  const {user, editTools, app} = docsContext

  const doc = docsContext.findDoc(d => params.docUID === d.uid)

  const [name, setName] = useState("demo")
  const [pwd, setPwd] = useState("pwd")

  const showDocList = () => {
    docsContext.app.isDocListShown = true
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

  //showDocList
  return (
    <div
      className={editTools.editMode ? "header withBg" : user.authStatus === AuthStatus.AUTHORIZED ? "header withBottomBorder" : "header"}>
      {user.authStatus === AuthStatus.AUTHORIZED &&
      <>
        <button className="icon-menu withoutBg showDocList"
                onClick={showDocList}/>
        {editTools.editMode &&
        <>
          <p className="separator">{'  '}</p>

          <button className="btn"
                  onClick={createPage}>New Page
          </button>

          <p className="separator">{' | '}</p>

          <ToolsPanel/>
        </>
        }

        <Spacer/>

        <p className="separator">{' | '}</p>

        <p className="userName">{editTools.editMode ? "Edit mode: " : "Read mode: "}</p>
        <label className="switch">
          <input type="checkbox"
                 checked={editTools.editMode}
                 onChange={() => editTools.toggleEditMode()}/>
          <span className="roundBtn"></span>
        </label>
        <p className="separator">{' | '}</p>

        <p className="userName">{user.login}</p>

        <p className="separator">{' | '}</p>

        <button className="btn"
                onClick={handleSignOut}>Sign out
        </button>
      </>
      }

      {user.authStatus !== AuthStatus.AUTHORIZED &&
      <>
        <Spacer/>
        <DropDown className='loginDropDown' title='Sign in'>
          <VStack halign={HAlign.CENTER} valign={VAlign.TOP}>
            <Input type="text"
                   defaultValue={name}
                   placeholder="Login"
                   onChange={(value: string) => setName(value)}
                   onSubmitted={handleSignIn}
                   autoFocus/>
            <Input type="password"
                   defaultValue={pwd}
                   placeholder="Password"
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
            <p className="authWithError">{user.authWithError}</p>
            }

          </VStack>

        </DropDown>
      </>
      }
    </div>
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

  const deleteBlock = (e: any) => {
    e.stopPropagation()
    if (editTools.editMode && selectedPage) {
      app.yesNoDialog = new YesNoDialog(
        "Are you sure you want to remove this page with its content?",
        () => {
          selectedPage.isEditing = false
          if (selectedPage === editTools.selectedItem)
            editTools.selectedItem = undefined

          selectedPage.doc?.deletePage(selectedPage)
        }
      )
    } else if (editTools.editMode && selectedPageBlock) {
      app.yesNoDialog = new YesNoDialog(
        "Are you sure you want to remove this page's block?",
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
      <div className="tools">
        <button className="icon-plus"
                disabled={!editTools.selectedItem}
                title="Add new Block"
                onClick={createBlock}/>
        <button className="icon-up"
                disabled={!selectedPageBlock}
                title="Move Block up"
                onClick={moveBlockUp}/>
        <button className="icon-down"
                disabled={!selectedPageBlock}
                title="Move Block down"
                onClick={moveBlockDown}/>
        <button className="icon-delete"
                disabled={!editTools.selectedItem}
                title="Delete Block"
                onClick={deleteBlock}/>
      </div>
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
        <div id='dropDownList'
             className={'dropDownList'}
             onMouseDown={(e) => {
               e.stopPropagation()
             }}>
          {props.children}
        </div>
      }
    </div>
  )
}
