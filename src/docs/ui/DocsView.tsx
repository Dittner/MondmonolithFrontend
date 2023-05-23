import {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {DocList} from "./docList/DocList";
import {observer} from "mobx-react";
import {useDocsContext} from "../../App";
import {DocBody} from "./docBody/DocBody";
import {DocTopics} from "./docTopics/DocTopics";
import "./style/code.css";
import {AuthPanel} from "./auth/AuthPanel";
import {ToolsPanel} from "./tools/ToolsPanel";

export const DocsView = observer(() => {
  console.log("DocsView init");
  const docsContext = useDocsContext()
  useEffect(() => {
    docsContext.repo.fetchDirectories()
  })

  const {pathname, hash, key} = useLocation()

  const showDocList = ()=> {
    docsContext.app.isDocListShown = true
  }

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
      }, 0);
    }
  }, [pathname, hash, key]); // do this on route change

  return (
    <div className="docsView">
      <div className="toolsPanel">
        <button className="btn showDocList"
                onClick={showDocList}>Show docs
        </button>
        <ToolsPanel/>
      </div>
      <div className="authPanel">
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
  )
})


