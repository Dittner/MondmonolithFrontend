import './docBody.css';
import {Route, Routes, useParams} from "react-router-dom";
import {LoadingSpinner} from "../common/Loading";
import {observer} from "mobx-react";
import {useDocsContext} from "../../../App";
import * as React from "react";
import {useEffect} from "react";
import Prism from "prismjs";
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import {DocLoadStatus, Page, PageBlock} from "../../domain/DomainModel";
import {LoadStatus} from "../../DocsContext";
import {TextArea} from "../common/Input"
import ReactMarkdown from "react-markdown";
import {HAlign, HStack, stylable, VAlign} from "../../application/NoCSS";


export const DocBody = stylable(() => {
  return <Routes>
    <Route path="/" element={<EmptyDoc/>}/>
    <Route path=":docUID" element={<PageList/>}/>
  </Routes>
})

const EmptyDoc = () => {
  return <HStack halign={HAlign.CENTER}
                 valign={VAlign.CENTER}
                 width="100%" height="100%">
    <p className="textDark">No doc is selected</p>
  </HStack>
}

const PageList = observer(() => {
  console.log("new PageList")
  const params = useParams()

  const docsContext = useDocsContext()

  const doc = docsContext.findDoc(d => params.docUID === d.uid)
  console.log("PageList, doc = ", doc)

  useEffect(() => {
    if (doc?.loadStatus === DocLoadStatus.HEADER_LOADED) {
      docsContext.docsLoader.fetchDoc(doc.uid)
    }
  })

  const exportDocAsJSON = () => {
    if (doc) {
      const docJSON = JSON.stringify(doc.serialize())
      const blob = new Blob([docJSON], {type: "text/plain"});
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = doc.uid + ".json";
      link.href = url;
      link.click();
    }
  }

  if (doc?.loadStatus === DocLoadStatus.LOADING || docsContext.dirsLoadStatus === LoadStatus.LOADING) {
    return <LoadingSpinner/>
  }

  if (!doc) {
    return <p className="docNotFoundMsg">Doc not found</p>
  }

  return (
    <>
      {doc.pages.map(page => {
        return <PageView key={page.uid} page={page}/>
      })}

      <button id="exportBtn"
              className="btn"
              onClick={exportDocAsJSON}>Export as JSON
      </button>
    </>
  )
})

const PageView = observer(({page}: { page: Page }) => {
  return (
    <div id={'#' + page.id} className="docPage">
      <PageTitle page={page}/>
      {page.blocks.map(block => {
        return <PageBlockView key={block.uid} block={block}/>
      })}
    </div>
  )
})

const PageTitle = observer(({page}: { page: Page }) => {
  const {editTools} = useDocsContext()
  const isSelected = editTools.selectedItem === page

  const selectTitle = () => {
    if (editTools.editMode && !isSelected) {
      editTools.selectedItem = page
    }
  }

  const editPage = (e: any) => {
    e.stopPropagation()
    if (editTools.editMode && isSelected) {
      page.isEditing = true
    }
  }

  let bgClassName: string = ""
  if (editTools.editMode && isSelected) {
    bgClassName = "blockBgSelected"
  } else if (editTools.editMode) {
    bgClassName = "blockBg"
  }

  if (editTools.editMode && page.isEditing) {
    return <PageTitleEditor page={page}/>
  }

  return (
    <div className="blockContainer"
         onClick={selectTitle}
         onDoubleClick={editPage}>
      <h1 className="docPageTitle">{page.title}</h1>
      <div className={bgClassName}/>
    </div>
  )
})

const PageTitleEditor = observer(({page}: { page: Page }) => {
  const apply = (value: string) => {
    if (value) {
      page.title = value
      page.isEditing = false
    }
  }

  const cancel = () => {
    page.isEditing = false
  }

  return (
    <TextArea text={page.title} onApply={apply} onCancel={cancel} autoFocus/>
  )
})

const PageBlockView = observer(({block}: { block: PageBlock }) => {
  const {editTools} = useDocsContext()
  const isSelected = editTools.selectedItem === block

  useEffect(() => {
    Prism.highlightAll()
  })

  const selectBlock = (e: any) => {
    if (editTools.editMode && !isSelected) {
      editTools.selectedItem = block
    }
  }

  const editPage = (e: any) => {
    e.stopPropagation()
    if (editTools.editMode && isSelected) {
      block.isEditing = true
    }
  }

  let bgClassName: string = ""
  if (editTools.editMode && isSelected) {
    bgClassName = "blockBgSelected"
  } else if (editTools.editMode) {
    bgClassName = "blockBg"
  }

  if (editTools.editMode && block.isEditing) {
    return (<>
        <PageBlockEditor block={block}/>
      </>
    )
  }

  return (
    <div className="blockContainer"
         onClick={selectBlock}
         onDoubleClick={editPage}>
      <ReactMarkdown>{block.text}</ReactMarkdown>
      <div className={bgClassName}/>
    </div>
  )
})

const PageBlockEditor = observer(({block}: { block: PageBlock }) => {
  const apply = (value: string) => {
    if (value) {
      block.text = value
      block.isEditing = false
    }
  }

  const cancel = () => {
    block.isEditing = false
  }

  return (
    <TextArea text={block.text} onApply={apply} onCancel={cancel} autoFocus/>
  )
})
