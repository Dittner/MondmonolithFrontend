import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { DocsContext, observeApp } from './docs/DocsContext'
import React, { lazy, Suspense, useLayoutEffect, useState } from 'react'
import { AuthStatus } from './docs/domain/DomainModel'
import { LoadingSpinner } from './docs/ui/common/Loading'
import { observe, observer } from './docs/infrastructure/Observer'
import { AuthPage } from './docs/ui/AuthPage'
import { LayoutLayer } from './docs/application/Application'
import { HStack, VStack } from './docs/ui/common/Container'
import { Label } from './docs/ui/common/Label'
import { IconButton, RedButton } from './docs/ui/common/Button'

export const API_URL = process.env.REACT_APP_API_URL
export const IS_DEV_MODE = process.env.REACT_APP_MODE === 'development'

console.log('React v.' + React.version)
console.log('API_URL:', API_URL)
console.log('DEV_MODE:', IS_DEV_MODE)

const docsContext = React.createContext(DocsContext.init())
export const useDocsContext = () => React.useContext(docsContext)

export const LazyDocsPage = lazy(async() => await import('./docs/ui/DocsPage').then((module) => ({ default: module.DocsPage })))
export const LazyIntroPage = lazy(async() => await import('./docs/ui/IntroPage').then((module) => ({ default: module.IntroPage })))

export const App = observer(() => {
  console.log('new App')
  const user = observe(useDocsContext().user)
  observe(useDocsContext().themeManager)
  console.log('user.authStatus:', user.authStatus)

  const isUserAuthorized = user.authStatus === AuthStatus.AUTHORIZED
  return <>
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner/>}>
        <Routes>
          <Route path="/auth" element={isUserAuthorized ? (<Navigate replace to="/docs"/>) : <AuthPage/>}/>
          <Route path="/docs/*" element={isUserAuthorized ? <LazyDocsPage/> : (<Navigate replace to="/auth"/>)}/>
          <Route path="*" element={<LazyIntroPage/>}/>
        </Routes>
      </Suspense>
    </BrowserRouter>

    <ErrorMsgView/>
    <ModalView/>
  </>
})

export function useWindowSize() {
  const [size, setSize] = useState([0, 0])
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight])
    }

    window.addEventListener('resize', updateSize)
    updateSize()
    return () => { window.removeEventListener('resize', updateSize) }
  }, [])
  return size
}

export const ModalView = observer(() => {
  console.log('new ModalView')

  const app = observeApp()
  const { theme } = useDocsContext()

  const apply = () => {
    if (app.dialog) {
      app.dialog.onApply?.()
      app.dialog = undefined
    }
  }

  const cancel = () => {
    if (app.dialog) {
      app.dialog.onCancel?.()
      app.dialog = undefined
    }
  }

  const ok = () => {
    if (app.dialog) {
      app.dialog = undefined
    }
  }

  if (!app.dialog) {
    return <></>
  }

  const hasApplyBtn = app.dialog.onApply !== undefined
  const hasCancelBtn = app.dialog.onCancel !== undefined
  const hasOkBtn = !hasApplyBtn && !hasCancelBtn

  return <VStack halign="center"
                 valign="center"
                 width="100%"
                 height="100%"
                 bgColor="#00000050"
                 layer={LayoutLayer.MODAL}
                 fixed>

    <VStack halign="stretch"
            valign="center"
            shadow="0 10px 20px #00000020"
            bgColor={theme.panelBg}
            borderColor={theme.border}
            padding='40px'
            gap="30px" width='100%' maxWidth='400px'>
      {app.dialog &&
        <>
          <Label className="ibm h4"
                 width='100%'
                 textAlign='center'
                 text={app.dialog?.title}
                 textColor={theme.green}
                 layer={LayoutLayer.ONE}/>

          <Label className='ibm'
                 width='100%'
                 text={app.dialog?.text}
                 textColor={theme.text}/>

          <HStack halign="center" valign="top" gap="50px">
            {app.dialog.onCancel &&
              <RedButton title="No"
                         onClick={cancel}/>
            }

            {hasOkBtn &&
              <RedButton title="Ok"
                         onClick={ok}/>
            }

            {hasApplyBtn &&
              <RedButton title="Yes"
                         onClick={apply}/>
            }

          </HStack>
        </>
      }
    </VStack>
  </VStack>
})

export const ErrorMsgView = observer(() => {
  console.log('new ErrorMsgView')

  const app = observeApp()
  const { theme } = useDocsContext()

  const close = () => {
    if (app.errorMsg) {
      app.errorMsg = ''
    }
  }

  if (!app.errorMsg) {
    return <></>
  }

  return <HStack halign="stretch"
                 valign="center"
                 width="100%"
                 bottom='0'
                 minHeight="50px"
                 bgColor={theme.errorMsgBg}
                 layer={LayoutLayer.ERR_MSG}
                 fixed>

    <Label className='ibm'
           width='100%'
           textAlign='center'
           text={app.errorMsg}
           textColor={theme.text}/>

    <IconButton icon="close"
                popUp="Close"
                onClick={close}/>
  </HStack>
})
