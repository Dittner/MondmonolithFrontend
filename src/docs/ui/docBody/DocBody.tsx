import './docBody.css';
import {Route, Routes, useParams} from "react-router-dom";
import {LoadingSpinner} from "../common/Loading";
import {observer} from "mobx-react";
import {useDocsContext} from "../../../App";
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

export const DocBody = () => {
  return <Routes>
    <Route path="/" element={<EmptyDoc/>}/>
    <Route path=":docUID" element={<PageList/>}/>
  </Routes>
}

const EmptyDoc = () => {
  return <p>No doc is selected</p>
}

const PageList = observer(() => {
  console.log("new PageList")
  const params = useParams()

  const docsContext = useDocsContext()
  const doc = docsContext.findDoc(d => params.docUID === d.uid)
  console.log("PageList, doc = ", doc)

  useEffect(() => {
    if (doc?.loadStatus === DocLoadStatus.HEADER_LOADED) {
      docsContext.repo.fetchDoc(doc.uid)
    }
  })

  if (doc?.loadStatus === DocLoadStatus.LOADING || docsContext.dirsLoadStatus === LoadStatus.LOADING) {
    return <LoadingSpinner/>
  }

  if (!doc) {
    return <p className="docNotFoundMsg">Doc not found</p>
  }

  return (
    <div>
      {doc.pages.map(page => {
        return <PageView key={page.uid} page={page}/>
      })}
    </div>
  )
})

const PageView = ({page}: { page: Page }) => {
  return (
    <div id={'#' + page.id} className="docPage">
      <PageTitle page={page}/>
      {page.blocks.map(block => {
        return <PageBlockView key={block.uid} block={block}/>
      })}
    </div>
  )
}

const PageTitle = observer(({page}: { page: Page }) => {
  const {editTools} = useDocsContext()

  const startEdit = () => {
    if (editTools.editMode) {
      page.isEditing = true
    }
  }

  const selectTitle = () => {
    if (editTools.editMode) {
      editTools.selectedItem = editTools.selectedItem === page ? undefined : page
    }
  }

  let bgClassName: string = ""
  if (editTools.editMode && editTools.selectedItem === page) {
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
         onDoubleClick={startEdit}>
      <h1 className="docPageTitle">{page.title}</h1>
      <div className={bgClassName}></div>
    </div>
  )
})

const PageTitleEditor = observer(({page}: { page: Page }) => {
  const apply = (value: string) => {
    page.title = value
  }

  const cancel = () => {
    page.isEditing = false
  }

  return (
    <TextArea text={page.title} onApply={apply} onCancel={cancel}/>
  )
})


const PageBlockView = observer(({block}: { block: PageBlock }) => {
  const {editTools} = useDocsContext()

  useEffect(() => {
    Prism.highlightAll()
  })

  const selectBlock = () => {
    if (editTools.editMode) {
      editTools.selectedItem = editTools.selectedItem === block ? undefined : block
    }
  }

  const editBlock = () => {
    if (editTools.editMode) {
      block.isEditing = true
    }
  }

  let bgClassName: string = ""
  if (editTools.editMode && editTools.selectedItem === block) {
    bgClassName = "blockBgSelected"
  } else if (editTools.editMode) {
    bgClassName = "blockBg"
  }

  if (editTools.editMode && block.isEditing) {
    return (
      <PageBlockEditor block={block}/>
    )
  }

  return (
    <div className="blockContainer"
         onClick={selectBlock}
         onDoubleClick={editBlock}>
      <ReactMarkdown>{block.data}</ReactMarkdown>
      <div className={bgClassName}></div>
    </div>
  )
})

const PageBlockEditor = observer(({block}: { block: PageBlock }) => {
  const apply = (value: string) => {
    block.data = value
    block.isEditing = false
  }

  const cancel = () => {
    block.isEditing = false
  }

  return (
    <TextArea text={block.data} onApply={apply} onCancel={cancel}/>
  )
})
