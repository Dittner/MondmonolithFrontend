import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { DocsContext } from './docs/DocsContext'
import React, { lazy, Suspense, useLayoutEffect, useState } from 'react'
import { AuthStatus } from './docs/domain/DomainModel'
import { LoadingSpinner } from './docs/ui/common/Loading'
import { observe, observer } from './docs/infrastructure/Observer'

const docsContext = React.createContext(DocsContext.init())
export const useDocsContext = () => React.useContext(docsContext)

export const LazyDocsPage = lazy(async() => await import('./docs/ui/DocsPage').then((module) => ({ default: module.DocsPage })))
export const LazyIntroPage = lazy(async() => await import('./docs/ui/IntroPage').then((module) => ({ default: module.IntroPage })))

export const App = observer(() => {
  const user = observe(useDocsContext().user)
  observe(useDocsContext().themeManager)

  const isUserAuthorized = user.authStatus === AuthStatus.AUTHORIZED
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner/>}>
        <Routes>
          <Route path="/docs/*" element={isUserAuthorized ? <LazyDocsPage/> : <LazyIntroPage/>}/>
          <Route path="*" element={isUserAuthorized ? (<Navigate replace to="/docs"/>) : (<LazyIntroPage/>)}/>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
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
