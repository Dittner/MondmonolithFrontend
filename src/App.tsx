import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import {DocsContext} from "./docs/DocsContext";
import React, {lazy, Suspense, useLayoutEffect, useState} from 'react';
import {observer} from "mobx-react";
import {AuthStatus} from "./docs/domain/DomainModel";
import {LoadingSpinner} from "./docs/ui/common/Loading";

const docsContext = React.createContext(DocsContext.init())
export const useDocsContext = () => React.useContext(docsContext);

export const DocsViewAsync = lazy(() => import('./docs/ui/DocsView').then((module) => ({default: module.DocsView})))
export const IntroViewAsync = lazy(() => import('./docs/ui/IntroView').then((module) => ({default: module.IntroView})))

export const App = observer(() => {
  const docsContext = useDocsContext()
  const isUserAuthorized = docsContext.user.authStatus === AuthStatus.AUTHORIZED
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner/>}>
        <Routes>
          <Route path="/docs/*" element={isUserAuthorized ? <DocsViewAsync/> : <IntroViewAsync/>}/>
          <Route path="*" element={isUserAuthorized ? (<Navigate replace to="/docs"/>) : (<IntroViewAsync/>)}/>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
})

export function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }

    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}