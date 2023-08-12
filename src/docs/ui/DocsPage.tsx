import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { DocList } from './DocList'
import { useDocsContext } from '../../App'
import { DocBody } from './DocBody'
import { DocTopics } from './DocTopics'
import { Header } from './Header'
import { AppSize, LayoutLayer } from '../application/Application'
import { StylableContainer } from '../application/NoCSSComponents'
import { observeApp } from '../DocsContext'
import { observer } from '../infrastructure/Observer'

export const DocsPage = observer(() => {
  console.log('new DocsPage')
  const app = observeApp()
  const {
    theme,
    restApi
  } = useDocsContext()
  const drawLayoutLines = false

  useEffect(() => {
    restApi.loadAllDirs()
  }, [])

  const {
    pathname,
    hash,
    key
  } = useLocation()

  useEffect(() => {
    app.hideDocList()
  }, [pathname])

  useEffect(() => {
    if (hash === '') {
      window.scrollTo(0, 0)
    } else {
      setTimeout(() => {
        const element = document.getElementById(hash)
        if (element) {
          const elementPos = Math.round(element.getBoundingClientRect().top + document.documentElement.scrollTop)
          // element.scrollIntoView();
          console.log('elementPos=', elementPos)
          window.scrollTo(0, elementPos < 100 ? 0 : elementPos - 50)
        }
      }, 0)
    }
  }, [pathname, hash, key]) // do this on route change

  const headerHeight = '50px'

  if (app.size === AppSize.L) {
    return (
      <>
        <Header width="80%"
                height={headerHeight}
                left="20%"
                top="0"
                layer={LayoutLayer.HEADER}
                fixed/>

        <DocList width="20%"
                 height="100%"
                 left="0"
                 layer={LayoutLayer.DOC_LIST}
                 enableOwnScroller
                 fixed/>

        <DocBody width="60%"
                 top={headerHeight}
                 bottom="0"
                 left="20%"
                 absolute/>

        <DocTopics width="20%"
                   left="80%"
                   top={headerHeight}
                   bottom="0"
                   enableOwnScroller
                   borderLeft={['1px', 'solid', theme.border]}
                   fixed/>

        {drawLayoutLines &&
          <>
            <StylableContainer className="appLayout L"
                               width="100vw"
                               height="1px"
                               top={headerHeight}
                               fixed/>

            <StylableContainer className="appLayout L"
                               width="1px"
                               height="100vh"
                               left="20vw"
                               fixed/>

            <StylableContainer className="appLayout L"
                               width="1px"
                               height="100vh"
                               left="80vw"
                               fixed/>
          </>
        }
      </>
    )
  }

  if (app.size === AppSize.M) {
    return (
      <>
        <Header width="70%"
                height={headerHeight}
                left="30%"
                top="0"
                layer={LayoutLayer.HEADER}
                fixed/>

        <DocList width="30%"
                 height="100vh"
                 layer={LayoutLayer.DOC_LIST}
                 enableOwnScroller
                 disableHorizontalScroll
                 fixed/>

        <DocBody width="70%"
                 top={headerHeight}
                 bottom="0"
                 left="30%"
                 absolute/>

        {drawLayoutLines &&
          <>
            <StylableContainer className="appLayout M"
                               width="100vw"
                               height="1px"
                               top={headerHeight}
                               fixed/>

            <StylableContainer className="appLayout M"
                               width="1px"
                               height="100vh"
                               left="30vw"
                               fixed/>
          </>
        }

      </>
    )
  }

  return (
    <>
      <Header width="100%"
              height={headerHeight}
              top="0"
              left="0"
              layer={LayoutLayer.HEADER} // z-Index
              fixed/>

      <DocList left={app.isDocListShown ? '0' : '-300px'}
               width="300px"
               height="100vh"
               layer={LayoutLayer.DOC_LIST}
               animate="left 0.5s"
               shadow="0 0 4px #00000020"
               enableOwnScroller
               disableHorizontalScroll
               fixed/>

      <DocBody width="100%"
               top={headerHeight}
               bottom="0"
               absolute/>

      {drawLayoutLines &&
        <>
          <StylableContainer className="appLayout S"
                             width="100vw"
                             height="1px"
                             top={headerHeight}
                             fixed/>

          <StylableContainer className="appLayout S"
                             width="1px"
                             height="100vh"
                             left="350px"
                             fixed/>
        </>
      }
    </>
  )
})
