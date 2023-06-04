import "./docTopics.css"
import {NavLink, Route, Routes, useParams} from "react-router-dom";
import {useDocsContext} from "../../../App";
import {DocLoadStatus} from "../../domain/DomainModel";
import {observer} from "mobx-react";
import {SelectorRuleBuilder} from "../../application/NoCSS";

export const DocTopics = ({builder}:{builder?:SelectorRuleBuilder}) => {
  return <Routes>
    <Route path="/" element={<EmptyDocTopicsView builder={builder}/>}/>
    <Route path=":docUID" element={<DocTopicsView builder={builder}/>}/>
  </Routes>
}

const EmptyDocTopicsView = ({builder}:{builder?:SelectorRuleBuilder}) => {
  return <div className={"docTopics " + builder?.className()}/>
}

const DocTopicsView = observer(({builder}:{builder?:SelectorRuleBuilder}) => {
  console.log("new DocTopicsView")
  const docsContext = useDocsContext()
  const params = useParams();
  console.log("new DocTopicsView, params: ", params)
  const doc = docsContext.findDoc(d => params.docUID === d.uid)
  if (!doc || doc.loadStatus === DocLoadStatus.LOADING) {
    return <></>
  }
  return (
    <div className={"docTopics " + builder?.className()}>
      <div className="docTopicsLinks">
        {doc.pages.map(page => {
          return <NavLink key={page.uid} className="topicLink" to={'#' + page.id}>{page.title}</NavLink>
        })}
      </div>
    </div>
  )
})
