import "./docTopics.css"
import {NavLink, Route, Routes, useParams} from "react-router-dom";
import {useDocsContext} from "../../../App";
import {DocLoadStatus} from "../../domain/DomainModel";
import {observer} from "mobx-react";

export const DocTopics = () => {
  return <Routes>
    <Route path="/" element={<EmptyDocTopicsView/>}/>
    <Route path=":docUID" element={<DocTopicsView/>}/>
  </Routes>
}

const EmptyDocTopicsView = () => {
  return <></>
}

const DocTopicsView = observer(() => {
  console.log("new DocTopicsView")
  const docsContext = useDocsContext()
  const params = useParams();
  console.log("new DocTopicsView, ", params.docUID)
  const doc = docsContext.findDoc(d => params.docUID === d.uid)
  if (!doc || doc.loadStatus === DocLoadStatus.LOADING) {
    return <></>
  }
  return (
    <div className="docTopicsLinks">
      {doc.pages.map(page => {
        return <NavLink key={page.uid} className="topicLink" to={'#' + page.id}>{page.title}</NavLink>
      })}
    </div>
  );
})
