import { Route, Routes, useLocation, useParams } from 'react-router-dom'
import { LoadingSpinner } from '../common/Loading'
import { useDocsContext } from '../../../App'
import * as React from 'react'
import { useEffect, useState } from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-kotlin'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-c'
import 'prismjs/components/prism-cpp'
import 'prismjs/components/prism-csharp'
import 'prismjs/components/prism-swift'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-markup'
import { DocLoadStatus, LoadStatus, type Page, type PageBlock } from '../../domain/DomainModel'
import ReactMarkdown from 'react-markdown'
import { stylable } from '../../application/NoCSS'
import { AppSize } from '../../application/Application'
import { observeApp, observeDirList, observeEditTools } from '../../DocsContext'
import { HStack, StylableContainer, VStack } from '../common/Container'
import { Button, IconButton, RedButton } from '../common/Button'
import { Label } from '../common/Label'
import { TextEditor } from '../common/Input'
import { Spacer } from '../common/Spacer'
import { observe, observer } from '../../infrastructure/Observer'

export const DocBody = stylable(() => {
  return <Routes>
    <Route path="/" element={<EmptyDoc msg="No document selected"/>}/>
    <Route path=":docId" element={<PageList/>}/>
  </Routes>
})

const EmptyDoc = ({ msg }: { msg: string }) => {
  const { theme } = useDocsContext()

  return <HStack halign="center"
                 valign="center"
                 width="100%" height="100%">
    <Label text={msg} textColor={theme.text75}/>
  </HStack>
}

const PageList = observer(() => {
  console.log('new PageList')

  const app = observeApp()
  const dirList = observeDirList()
  const {
    restApi,
    theme
  } = useDocsContext()

  //console.log('  dirList = ', dirList)
  const params = useParams()
  const location = useLocation()
  const [pagesSlice, setPagesSlice] = useState(
    {
      start: 0,
      end: 0,
      isFirstPageShown: true,
      isLastPageShown: true
    })

  const doc = dirList.findDoc(d => params.docId === d.id)
  observe(doc)
  //console.log('  PageList, doc = ', doc)

  useEffect(() => {
    if (doc && doc.loadStatus === DocLoadStatus.HEADER_LOADED && !doc.isNew) {
      restApi.loadPages(doc)
    }
  }, [doc])

  useEffect(() => {
    if (doc) {
      let start = 0
      if (doc.pages.length > 0 && !doc.pages[0].isEditing && location.hash) {
        const isFirstLaunch = pagesSlice.end === 0
        const pageIndex = doc.pages.findIndex(p => p.key === location.hash)
        start = Math.max(isFirstLaunch ? pageIndex : pageIndex - 1, 0)
      }

      let end = 0
      let rowsTotal = 0
      for (let i = start; i < doc.pages.length; i++) {
        end = i
        const p = doc.pages[i]
        rowsTotal += p.blocks.reduce((sum, block) => sum + block.estimatedRowNum, 0)

        if (rowsTotal > 100) {
          if (!location.hash) {
            break
          } else if (location.hash && i > start) break
        }
      }
      const isFirstPageShown = start === 0
      const isLastPageShown = doc && end === (doc.pages.length - 1)
      //console.log('Slice: rowsTotal=', rowsTotal, ', start=', start, ', end=', end, 'isFirstPageShown=', isFirstPageShown, ', isLastPageShown=', isLastPageShown)
      setPagesSlice({
        start,
        end,
        isFirstPageShown,
        isLastPageShown
      })
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
        setPagesSlice({
          start,
          end,
          isFirstPageShown,
          isLastPageShown
        })
      }, 2)

      setTimeout(() => {
        const isFirstPageShown = start === 0
        setPagesSlice({
          start,
          end,
          isFirstPageShown,
          isLastPageShown
        })
      }, 4)
    }
  }

  const showNextPage = () => {
    if (doc && pagesSlice.end < (doc.pages.length - 1)) {
      const end = pagesSlice.end + 1
      const start = end - pagesSlice.start > 3 ? pagesSlice.start + 1 : pagesSlice.start
      const isFirstPageShown = start === 0
      const isLastPageShown = end === (doc.pages.length - 1)
      setPagesSlice({
        start,
        end,
        isFirstPageShown,
        isLastPageShown
      })
    }
  }

  const exportDocAsJSON = () => {
    if (doc) {
      const docJSON = JSON.stringify(doc.serialize())
      const blob = new Blob([docJSON], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.download = doc.title + '.json'
      link.href = url
      link.click()
    }
  }

  const scrollBack = () => {
    setPagesSlice({
      start: 0,
      end: 2,
      isFirstPageShown: true,
      isLastPageShown: (doc?.pages.length ?? 0) <= 3
    })
    window.scrollTo(0, 0)
  }

  if (doc?.loadStatus === DocLoadStatus.LOADING || dirList.loadStatus === LoadStatus.LOADING) {
    return <LoadingSpinner/>
  }

  if (!doc) {
    return <EmptyDoc msg="Doc not found"/>
  }

  app.lastShownPage = doc.pages.length > 0 ? doc.pages.at(pagesSlice.end) : undefined

  return (
    <VStack valign="top" halign="center" gap="10px"
            width="100%" maxWidth='1000px'
            paddingHorizontal={app.size === AppSize.XS ? '2px' : '40px'}
            paddingVertical="20px">

      {!pagesSlice.isFirstPageShown &&
        <Button onClick={showPrevPage}
                width='100%'
                height='45px'
                bgColor={theme.prevNextPageBtnBg + '88'}
                textColor={theme.white}
                hoverState={state => {
                  state.bgColor = theme.prevNextPageBtnBg
                }}>
          <span className="icon icon-prevPage"/>
          <span>  Previous Page</span>
        </Button>

      }

      {doc.pages.length > 0 &&
        doc.pages.slice(pagesSlice.start, pagesSlice.end + 1).map(page => {
          return <PageView key={page.uid} page={page}/>
        })
      }

      {doc.pages.length > 0 && !pagesSlice.isLastPageShown &&
        <Button onClick={showNextPage}
                width='100%'
                height='45px'
                bgColor={theme.prevNextPageBtnBg + 'AA'}
                textColor={theme.white}
                hoverState={state => {
                  state.bgColor = theme.prevNextPageBtnBg
                }}>
          <span className="icon icon-nextPage"/>
          <span>  Next Page</span>
        </Button>
      }

      {doc.pages.length > 0 && pagesSlice.isLastPageShown &&
        <HStack halign="stretch"
                valign="center"
                padding="8px"
                width="100%">

          <RedButton title="Export as JSON"
                     onClick={exportDocAsJSON}/>

          <Spacer/>

          <IconButton icon="scrollBack"
                      popUp="Scroll back"
                      onClick={scrollBack}/>
        </HStack>
      }
    </VStack>
  )
})

const PageView = observer(({ page }: { page: Page }) => {
  console.log('new PageView')
  observe(page)

  return (
    <VStack id={page.key}
            width="100%"
            halign="stretch"
            paddingBottom='50px'
            valign="top">
      <PageTitle page={page}/>
      {page.blocks.map(block => {
        return <PageBlockView key={block.uid} block={block}/>
      })}
    </VStack>
  )
})

const PageTitle = observer(({ page }: { page: Page }) => {
  const editTools = observeEditTools()
  const { theme } = useDocsContext()

  const isSelected = editTools.selectedItem === page

  const selectTitle = () => {
    if (editTools.editMode && !isSelected) {
      editTools.select(page)
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
        <StylableContainer width="100%"
                           bgColor={theme.selectedBlockBg}
                           borderLeft={['6px', 'solid', theme.red]}
                           onDoubleClick={editPage}>
          <Label className="h1"
                 paddingVertical='5px'
                 textColor={theme.h1}
                 paddingHorizontal='14px'
                 bgColor={theme.pageTitleBg}
                 text={page.title}/>
        </StylableContainer>
      </>
    )
  }

  if (editTools.editMode) {
    return <StylableContainer width="100%"
                              onMouseDown={selectTitle}
                              hoverState={state => {
                                state.bgColor = theme.selectedBlockBg
                              }}>
      <Label className="h1"
             paddingVertical='5px'
             textColor={theme.h1}
             paddingHorizontal='20px'
             bgColor={theme.pageTitleBg}
             text={page.title}/>
    </StylableContainer>
  }

  return (
    <StylableContainer width="100%">
      <Label className="h1"
             paddingVertical='5px'
             textColor={theme.h1}
             paddingHorizontal='20px'
             bgColor={theme.pageTitleBg}
             text={page.title}/>
    </StylableContainer>
  )
})

const PageTitleEditor = observer(({ page }: { page: Page }) => {
  const {
    restApi,
    editTools
  } = useDocsContext()

  const apply = (value: string) => {
    if (page.doc && page.title !== value) {
      page.title = value
      page.isEditing = false
      restApi.storePage(page, page.doc)
    } else {
      cancel()
    }
    editTools.selectedItem = page
  }

  const cancel = () => {
    page.isEditing = false
  }

  return (
    <TextEditor key={page.uid}
                className="mono"
                text={page.title}
                paddingHorizontal="20px"
                paddingTop="10px"
                onApply={apply}
                onCancel={cancel}
                autoFocus/>
  )
})

const PageBlockView = observer(({ block }: { block: PageBlock }) => {
  const editTools = observeEditTools()
  observe(block)
  const { theme } = useDocsContext()

  const isSelected = editTools.selectedItem === block

  useEffect(() => {
    if (!block.isEditing) {
      console.log('new PageBlockView: Prism.highlightAll')
      setTimeout(Prism.highlightAll, Math.random() * 10)
    }
  }, [block, block.text, block.isEditing])

  const selectBlock = (e: any) => {
    e.stopPropagation()
    if (editTools.editMode && !isSelected) {
      editTools.select(block)
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

  const markdownClassName = theme.isDark ? 'markdown dark' : 'markdown light'

  if (editTools.editMode && isSelected) {
    return (<>
        <StylableContainer className={theme.id}
                           minHeight="30px"
                           paddingRight="20px"
                           paddingLeft="14px"
                           width="100%"
                           bgColor={theme.selectedBlockBg}
                           borderLeft={['6px', 'solid', theme.red]}
                           onDoubleClick={editPage}>
          <ReactMarkdown className={markdownClassName}>{block.text}</ReactMarkdown>
        </StylableContainer>
      </>
    )
  }

  if (editTools.editMode) {
    return <StylableContainer className={theme.id}
                              minHeight="30px"
                              paddingHorizontal="20px"
                              width="100%"
                              onMouseDown={selectBlock}
                              hoverState={state => {
                                state.bgColor = theme.selectedBlockBg
                              }}>
      <ReactMarkdown className={markdownClassName}>{block.text}</ReactMarkdown>
    </StylableContainer>
  }

  return (
    <StylableContainer className={theme.id}
                       minHeight="30px"
                       paddingHorizontal="20px"
                       width="100%">
      <ReactMarkdown className={markdownClassName}>{block.text}</ReactMarkdown>
    </StylableContainer>
  )
})

const PageBlockEditor = ({ block }: { block: PageBlock }) => {
  const {
    restApi,
    editTools
  } = useDocsContext()

  const apply = (value: string) => {
    if (block.text !== value) {
      block.text = value
      block.isEditing = false
      if (block.page?.doc) {
        restApi.storePage(block.page, block.page.doc)
      }
    } else {
      cancel()
    }
    editTools.selectedItem = block
  }

  const cancel = () => {
    block.isEditing = false
  }

  return (
    <TextEditor key={block.uid}
                text={block.text}
                className="mono"
                paddingHorizontal="20px"
                paddingTop="10px"
                onApply={apply}
                onCancel={cancel}
                autoFocus/>
  )
}
