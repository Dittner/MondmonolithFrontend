import {useEffect, useState} from "react";
import './authPanel.css';
import {useDocsContext} from "../../../App";
import {AuthStatus} from "../../domain/DomainModel";
import {observer} from "mobx-react";
import {HAlign, VAlign, VStack} from "../common/Stack";
import {Input} from "../common/Input";
import {Route, Routes, useParams} from "react-router-dom";
import {SmallSpinner} from "../common/Loading";

export const AuthPanel = () => {
  return <Routes>
    <Route path="/" element={<AuthPanelView/>}/>
    <Route path=":docUID" element={<AuthPanelView/>}/>
  </Routes>
}

export const AuthPanelView = observer(() => {
  console.log("new AuthPanel")
  const params = useParams()
  const docsContext = useDocsContext()
  const {user, editTools} = docsContext

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

  return (
    <div className="menu">
      <button className="btn showDocList"
              onClick={showDocList}>Show docs
      </button>

      {user.authStatus === AuthStatus.AUTHORIZED &&
        <>
          {docsContext.editTools.editMode &&
            <>
              <button className="btn"
                      onClick={createPage}>New Page
              </button>

              <p className="separator">{' | '}</p>
            </>
          }

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
        <DropDown className='login' title='Sign in'>
          <VStack halign={HAlign.CENTER} valign={VAlign.TOP}>
            <Input type="text"
                   defaultValue={name}
                   placeholder="Login"
                   onChange={(e: any) => setName(e.target.value)}
                   onSubmitted={handleSignIn}
                   autoFocus/>
            <Input type="password"
                   defaultValue={pwd}
                   placeholder="Password"
                   onChange={(e: any) => setPwd(e.target.value)}
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
      }
    </div>
  )
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
    <div className={props.className + ' dropDownContainer'}>
      <p className={props.className + (isOpened ? ' dropDownLbl-opened' : ' dropDownLbl')}
         onMouseDown={handleChange}>
        {props.title}
      </p>
      {
        isOpened &&
        <div id='dropDownList'
             className={props.className + ' dropDownList'}
             onMouseDown={(e) => {
               e.stopPropagation()
             }}>
          {props.children}
        </div>
      }
    </div>
  )
}
