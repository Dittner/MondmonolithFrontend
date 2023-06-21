import {Route, Routes, useLocation, useParams} from "react-router-dom";
import {LoadingSpinner} from "./common/Loading";
import {observer} from "mobx-react";
import {useDocsContext} from "../../App";
import * as React from "react";
import {useEffect, useState} from "react";
import Prism from "prismjs";
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import {DocLoadStatus, Page, PageBlock} from "../domain/DomainModel";
import {LoadStatus} from "../DocsContext";
import ReactMarkdown from "react-markdown";
import {stylable} from "../application/NoCSS";
import {Spacer} from "./common/Spacer";
import {AppSize} from "../application/Application";
import {
  Button,
  HStack,
  IconButton,
  Label,
  RedButton,
  StylableContainer,
  TextArea,
  VStack
} from "../application/NoCSSComponents";


export const DocBody = stylable(() => {
  return <Routes>
    <Route path="/" element={<EmptyDoc msg="No doc is selected"/>}/>
    <Route path=":docUID" element={<PageList/>}/>
  </Routes>
})

const EmptyDoc = ({msg}: { msg: string }) => {
  const {app} = useDocsContext()
  return <HStack halign="center"
                 valign="center"
                 width="100%" height="100%">
    <Label title={msg} textColor={app.theme.text75}/>
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
  const theme = docsContext.app.theme

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
      if (doc.pages.length > 0 && !doc.pages[0].isEditing && location.hash) {
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
    <VStack valign="top" halign="center" gap="0"
            width="100%"
            paddingHorizontal={docsContext.app.size === AppSize.XS ? "2px" : "40px"}
            paddingVertical="20px">

      {!pagesSlice.isFirstPageShown &&
      <Button onClick={showPrevPage}
              textColor={theme.textGreen75}
              paddingHorizontal="100px"
              paddingVertical="10px"
              border={["1px", "solid", theme.textGreen75]}
              hoverState={state => {
                state.textColor = theme.textGreen
                state.border = ["1px", "solid", theme.textGreen]
              }}>
        <p className="icon icon-prevPage"/>
        <p>Previous Page</p>
      </Button>
      }

      {doc.pages.length > 0 &&
      doc.pages.slice(pagesSlice.start, pagesSlice.end + 1).map(page => {
        return <PageView key={page.uid} page={page}/>
      })
      }

      {doc.pages.length > 0 && !pagesSlice.isLastPageShown &&
      <Button onClick={showNextPage}
              textColor={theme.textGreen75}
              paddingHorizontal="100px"
              paddingVertical="10px"
              border={["1px", "solid", theme.textGreen75]}
              hoverState={state => {
                state.textColor = theme.textGreen
                state.border = ["1px", "solid", theme.textGreen]
              }}>
        <p>Next Page</p>
        <p className="icon icon-nextPage"/>
      </Button>
      }

      {doc.pages.length > 0 && pagesSlice.isLastPageShown &&
      <HStack halign="stretch"
              valign="center"
              padding="8px"
              width="100%">

        <RedButton title="Export as JSON"
                   hideBg
                   theme={theme}
                   onClick={exportDocAsJSON}/>

        <Spacer/>

        <IconButton theme={theme}
                    hideBg
                    icon="scrollBack"
                    popUp="Scroll back"
                    onClick={() => window.scrollTo(0, 0)}/>

      </HStack>
      }
    </VStack>
  )
})

const PageView = observer(({page}: { page: Page }) => {
  console.log("new PageView")
  return (
    <VStack id={page.id}
            width="100%"
            halign="stretch"
            valign="top">
      <PageTitle page={page}/>
      {page.blocks.map(block => {
        return <PageBlockView key={block.uid} block={block}/>
      })}
    </VStack>
  )
})

const PageTitle = observer(({page}: { page: Page }) => {
  const {editTools, app} = useDocsContext()
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

  if (editTools.editMode && page.isEditing) {
    return <PageTitleEditor page={page}/>
  }

  if (editTools.editMode && isSelected) {
    return (<>
        <StylableContainer minHeight="50px"
                           paddingRight="10px"
                           paddingLeft="24px"
                           width="100%"
                           bgColor={app.theme.pageSelection}
                           borderLeft={["6px", "solid", app.theme.yellow]}
                           cornerRadius="10px"
                           onClick={selectTitle}
                           onDoubleClick={editPage}>
          <Label className="h1"
                 textColor={app.theme.pageTitle}
                 title={page.title}/>
        </StylableContainer>
      </>
    )
  }

  if (editTools.editMode) {
    return <StylableContainer minHeight="50px"
                              paddingRight="10px"
                              paddingLeft="30px"
                              width="100%"
                              onClick={selectTitle}
                              onDoubleClick={editPage}
                              hoverState={state => {
                    state.bgColor = app.theme.pageSelection
                    state.cornerRadius = "10px"
                  }}>
      <Label className="h1"
             textColor={app.theme.pageTitle}
             title={page.title}/>
    </StylableContainer>
  }

  return (
    <StylableContainer minHeight="50px"
                       paddingRight="10px"
                       paddingLeft="30px"
                       width="100%">
      <Label className="h1"
             textColor={app.theme.pageTitle}
             title={page.title}/>
    </StylableContainer>
  )
})

const PageTitleEditor = observer(({page}: { page: Page }) => {
  const {app} = useDocsContext()
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
    <TextArea key={page.uid}
              className="mono"
              text={page.title}
              width="100%"
              textColor={app.theme.textGreen}
              paddingHorizontal="26px"
              paddingTop="12px"
              border="none"
              borderLeft={["6px", "solid", app.theme.inputBorder]}
              cornerRadius="10px"
              bgColor={app.theme.inputBg}
              caretColor={app.theme.caretColor}
              animate="border-left 300ms"
              onApply={apply}
              onCancel={cancel}
              autoFocus
              focusState={state => {
                state.borderLeft = ["6px", "solid", app.theme.inputBorderFocused]
              }}/>
  )
})

const PageBlockView = observer(({block}: { block: PageBlock }) => {
  const {editTools, app} = useDocsContext()
  const isSelected = editTools.selectedItem === block

  useEffect(() => {
    if (!block.isEditing) {
      console.log("new PageBlockView: Prism.highlightAll")
      setTimeout(Prism.highlightAll, Math.random() * 500)
    }
  }, [block, block.text, block.isEditing])

  const selectBlock = (e: any) => {
    e.stopPropagation()
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

  if (editTools.editMode && block.isEditing) {
    return (<>
        <PageBlockEditor block={block}/>
      </>
    )
  }

  if (editTools.editMode && isSelected) {
    return (<>
        <StylableContainer className={app.theme.id}
                           minHeight="50px"
                           paddingRight="30px"
                           paddingLeft="24px"
                           paddingVertical="5px"
                           width="100%"
                           bgColor={app.theme.pageSelection}
                           borderLeft={["6px", "solid", app.theme.yellow]}
                           cornerRadius="10px"
                           onDoubleClick={editPage}>
          <ReactMarkdown className={app.theme.isDark ? "dark" : "light"}>{block.text}</ReactMarkdown>
        </StylableContainer>
      </>
    )
  }

  if (editTools.editMode) {
    return <StylableContainer className={app.theme.id}
                              minHeight="50px"
                              paddingHorizontal="30px"
                              paddingVertical="5px"
                              width="100%"
                              onClick={selectBlock}
                              onDoubleClick={editPage}
                              hoverState={state => {
                    state.bgColor = app.theme.pageSelection
                    state.cornerRadius = "10px"
                  }}>
      <ReactMarkdown className={app.theme.isDark ? "dark" : "light"}>{block.text}</ReactMarkdown>
    </StylableContainer>
  }

  return (
    <StylableContainer className={app.theme.id}
                       minHeight="50px"
                       paddingVertical="5px"
                       paddingHorizontal="30px"
                       width="100%">
      <ReactMarkdown className={app.theme.isDark ? "dark" : "light"}>{block.text}</ReactMarkdown>
    </StylableContainer>
  )
})

const PageBlockEditor = observer(({block}: { block: PageBlock }) => {
  const {app} = useDocsContext()
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
    <TextArea key={block.uid}
              text={block.text}
              className="mono"
              width="100%"
              textColor={app.theme.textGreen}
              paddingHorizontal="26px"
              paddingTop="12px"
              border="none"
              borderLeft={["6px", "solid", app.theme.inputBorder]}
              cornerRadius="10px"
              bgColor={app.theme.inputBg}
              caretColor={app.theme.caretColor}
              animate="border-left 300ms"
              onApply={apply}
              onCancel={cancel}
              autoFocus
              focusState={state => {
                state.borderLeft = ["6px", "solid", app.theme.inputBorderFocused]
              }}/>
  )
})