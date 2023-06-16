import './docBody.css';
import {Route, Routes, useLocation, useParams} from "react-router-dom";
import {LoadingSpinner} from "../common/Loading";
import {observer} from "mobx-react";
import {useDocsContext} from "../../../App";
import * as React from "react";
import {useEffect, useState} from "react";
import Prism from "prismjs";
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import {DocLoadStatus, Page, PageBlock} from "../../domain/DomainModel";
import {LoadStatus} from "../../DocsContext";
import {TextArea} from "../common/Input"
import ReactMarkdown from "react-markdown";
import {HAlign, HStack, stylable, VAlign, VStack} from "../../application/NoCSS";
import {Spacer} from "../common/Spacer";
import {AppSize} from "../../application/Application";


export const DocBody = stylable(() => {
  return <Routes>
    <Route path="/" element={<EmptyDoc msg="No doc is selected"/>}/>
    <Route path=":docUID" element={<PageList/>}/>
  </Routes>
})

const EmptyDoc = ({msg}: { msg: string }) => {
  return <HStack halign={HAlign.CENTER}
                 valign={VAlign.CENTER}
                 width="100%" height="100%">
    <p className="textDark">{msg}</p>
  </HStack>
}

const PageList = observer(() => {
  console.log("new PageList")
  const params = useParams()
  const location = useLocation()
  const [pagesSlice, setPagesSlice] = useState(
    {
      start: 0,
      end: 0,
      isFirstPageShown: true,
      isLastPageShown: true
    })
  const docsContext = useDocsContext()

  const doc = docsContext.findDoc(d => params.docUID === d.uid)
  console.log("PageList, doc = ", doc)

  useEffect(() => {
    if (doc?.loadStatus === DocLoadStatus.HEADER_LOADED && !doc?.loadWithError) {
      docsContext.docsLoader.fetchDoc(doc.uid)
    }
  })

  useEffect(() => {
    if (doc) {
      let start = 0
      if(doc.pages.length > 0 && !doc.pages[0].isEditing && location.hash) {
        const isFirstLaunch = pagesSlice.end === 0
        const pageIndex = doc.pages.findIndex(p => p.id === location.hash)
        start = Math.max(isFirstLaunch ? pageIndex : pageIndex - 1, 0)
      }

      let end = 0
      let rowsTotal = 0
      for (let i = start; i < doc.pages.length; i++) {
        end = i
        const p = doc.pages[i]
        rowsTotal += p.blocks.reduce((sum, block) => sum + block.estimatedRowNum, 0)

        if (rowsTotal > 100) {
          if (!location.hash) break
          else if (location.hash && i > start) break
        }
      }
      const isFirstPageShown = start === 0
      const isLastPageShown = doc && end === (doc.pages.length - 1)
      setPagesSlice({start, end, isFirstPageShown, isLastPageShown})
    }
  }, [doc?.uid, doc?.pages.length, location.key])

  const showPrevPage = () => {
    if (doc && pagesSlice.start > 0) {
      const start = pagesSlice.start - 1
      const end = pagesSlice.end - start > 3 ? pagesSlice.end - 1 : pagesSlice.end

      const isFirstPageShown = true
      const isLastPageShown = end === (doc.pages.length - 1)
      window.scrollTo(0, 1)

      setTimeout(() => {
        setPagesSlice({start, end, isFirstPageShown, isLastPageShown})
      }, 10)


        setTimeout(() => {
          const isFirstPageShown = start === 0
          setPagesSlice({start, end, isFirstPageShown, isLastPageShown})
        }, 50)
    }
  }

  const showNextPage = () => {
    if (doc && pagesSlice.end < (doc.pages.length - 1)) {
      const end = pagesSlice.end + 1
      const start = end - pagesSlice.start > 3 ? pagesSlice.start + 1 : pagesSlice.start
      const isFirstPageShown = start === 0
      const isLastPageShown = end === (doc.pages.length - 1)
      setPagesSlice({start, end, isFirstPageShown, isLastPageShown})
    }
  }


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
    return <EmptyDoc msg="Doc not found"/>
  }

  if (doc.loadWithError) {
    return <EmptyDoc msg={doc.loadWithError}/>
  }

  return (
    <VStack valign={VAlign.TOP} halign={HAlign.CENTER} gap="0"
            paddingHorizontal={docsContext.app.size === AppSize.XS ? "32px" : "70px"}
            paddingVertical="20px">

      {!pagesSlice.isFirstPageShown &&
      <button className="prevNextBtn"
              onClick={showPrevPage}>
        <p className="icon icon-prevPage"/>
        <p className="prevNextNtnTitle">Previous Page</p>
      </button>
      }

      {doc.pages.length > 0 &&
      doc.pages.slice(pagesSlice.start, pagesSlice.end + 1).map(page => {
        return <PageView key={page.uid} page={page}/>
      })
      }

      {doc.pages.length > 0 && !pagesSlice.isLastPageShown &&

      <button className="prevNextBtn"
              onClick={showNextPage}>
        <p className="prevNextNtnTitle">Next Page</p>
        <p className="icon icon-nextPage"/>
      </button>
      }

      {doc.pages.length > 0 && pagesSlice.isLastPageShown &&
      <HStack halign={HAlign.STRETCH}
              valign={VAlign.CENTER}
              width="100%">
        <button id="exportBtn"
                className="btn"
                onClick={exportDocAsJSON}>Export as JSON
        </button>

        <Spacer/>

        <button className="icon-scrollBack withoutBg big"
                title="Scroll back"
                onClick={e => {
                  window.scrollTo(0, 0)
                }}/>
      </HStack>
      }
    </VStack>
  )
})

const PageView = observer(({page}: { page: Page }) => {
  console.log("new PageView")
  return (
    <div id={page.id} className="docPage">
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
    e.preventDefault()
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
    if (page.title !== value) {
      page.title = value
      page.isEditing = false
    } else {
      cancel()
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
    if (!block.isEditing) {
      console.log("new PageBlockView: Prism.highlightAll")
      setTimeout(Prism.highlightAll, Math.random() * 500)
    }
  }, [block, block.text, block.isEditing])

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
      <ReactMarkdown className="reactMarkdown">{block.text}</ReactMarkdown>
      <div className={bgClassName}/>
    </div>
  )
})

const PageBlockEditor = observer(({block}: { block: PageBlock }) => {
  const apply = (value: string) => {
    if (block.text !== value) {
      block.text = value
      block.isEditing = false
    } else {
      cancel()
    }
  }

  const cancel = () => {
    block.isEditing = false
  }

  return (
    <TextArea text={block.text}
              onApply={apply}
              onCancel={cancel}
              autoFocus/>
  )
})
