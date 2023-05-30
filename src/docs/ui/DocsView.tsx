import {useEffect} from "react";
import {useLocation} from "react-router-dom";
import {DocList} from "./docList/DocList";
import {observer} from "mobx-react";
import {useDocsContext} from "../../App";
import {DocBody} from "./docBody/DocBody";
import {DocTopics} from "./docTopics/DocTopics";
import "./style/code.css";
import {AuthPanel} from "./auth/AuthPanel";
import {AuthStatus} from "../domain/DomainModel";
import {IntroView} from "./intro/IntroView";
import {HAlign, HStack, VAlign} from "./common/Stack";

export const DocsView = observer(() => {
  console.log("DocsView init");
  const docsContext = useDocsContext()
  useEffect(() => {
    docsContext.repo.fetchDirectories()
  })

  const {pathname, hash, key} = useLocation()

  useEffect(() => {
    if (hash === '') {
      window.scrollTo(0, 0);
    } else {
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          const elementPos = Math.round(element.getBoundingClientRect().top + document.documentElement.scrollTop)
          //element.scrollIntoView();
          console.log("elementPos=", elementPos);
          window.scrollTo(0, elementPos < 100 ? 0 : elementPos - 50);
        }
      }, 0)
    }
  }, [pathname, hash, key]); // do this on route change

  if (docsContext.user.authStatus !== AuthStatus.AUTHORIZED) {
    return <IntroView/>
  }

  return (
    <>
      <ModalView/>
      <div className="docsView">
        <div className="menu">
          <AuthPanel/>
        </div>
        <div className={docsContext.app.isDocListShown ? "docList" : "docList hidden"}>
          <DocList/>
        </div>
        <div className="docBody">
          <DocBody/>
        </div>
        <div className="docTopics">
          <DocTopics/>
        </div>
      </div>

    </>
  )
})

export const ModalView = observer(() => {
  console.log("new ModalView")

  const {app} = useDocsContext()

  const apply = () => {
    if (app.yesNoDialog) {
      app.yesNoDialog.onApply()
      app.yesNoDialog = undefined
    }
  }

  const cancel = () => {
    if (app.yesNoDialog) {
      app.yesNoDialog.onCancel?.()
      app.yesNoDialog = undefined
    }
  }

  return <>
    {app.yesNoDialog &&
      <div className="modalView">
        <div className="yesNoDialog">
          <h3>{app.yesNoDialog.text}</h3>

          <HStack halign={HAlign.CENTER} valign={VAlign.TOP}>
            <button onClick={cancel}
                    className="btn">No
            </button>
            <button className="btn"
                    onClick={apply}>Yes
            </button>
          </HStack>
        </div>
      </div>
    }
  </>
})
