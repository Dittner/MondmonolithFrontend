import {useEffect, useState} from "react";
import './authPanel.css';
import {Input} from "../common/Input";
import {useDocsContext} from "../../../App";
import {AuthStatus} from "../../domain/DomainModel";
import {observer} from "mobx-react";

export const AuthPanel = observer(() => {
  console.log("new AuthPanel")
  const {user, editTools} = useDocsContext()

  const [name, setName] = useState("demo");
  const [pwd, setPwd] = useState("pwd");

  const handleSignIn = (e: any) => {
    e.preventDefault()
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

  return (
    <div className='authPanel'>
      {user.authStatus === AuthStatus.AUTHORIZED &&
        <>
          <p className="userName">{editTools.editMode ? "Edit mode: " : "Read mode: "}</p>
          <label className="switch">
            <input type="checkbox"
                   checked={editTools.editMode}
                   onChange={() => editTools.toggleEditMode()}/>
            <span className="roundBtn"></span>
          </label>
          <p className="userName">{' | '}</p>
        </>
      }

      {user.authStatus === AuthStatus.AUTHORIZING &&
        <div className="smallSpinner"></div>
      }

      {user.authStatus === AuthStatus.AUTHORIZED &&
        <p className="userName">{user.login + ' | '}</p>
      }

      {user.authStatus === AuthStatus.AUTHORIZED &&
        <button className="signOutBtn"
                onClick={handleSignOut}>Sign out</button>
      }

      {user.authStatus !== AuthStatus.AUTHORIZED &&
        <DropDown className='login' title='Sign in'>
          <form onSubmit={handleSignIn}>
            <fieldset>
              <Input type="text"
                     defaultValue={name}
                     placeholder="Name"
                     onChange={(e: any) => setName(e.target.value)}
                     autoFocus/>
              <Input type="password"
                     defaultValue={pwd}
                     placeholder="Password"
                     onChange={(e: any) => setPwd(e.target.value)}/>

              <input disabled={user.authStatus === AuthStatus.AUTHORIZING} type="submit" value="Submit"/>

              {user.authWithError &&
                <p className="authWithError">{user.authWithError}</p>
              }
            </fieldset>
          </form>
        </DropDown>
      }
    </div>
  )
})


const DropDown = (props: any) => {
  const [isOpened, setOpen] = useState(false);

  const handleChange = () => {
    setOpen(!isOpened);
  };

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
               e.stopPropagation();
             }}>
          {props.children}
        </div>
      }
    </div>
  )
}
