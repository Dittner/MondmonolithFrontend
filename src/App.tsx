import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import {DocsView} from "./docs/ui/DocsView";
import {DocsContext} from "./docs/DocsContext";
import React, {useLayoutEffect, useState} from 'react';
import {IntroView} from "./docs/ui/IntroView";
import {observer} from "mobx-react";
import {AuthStatus} from "./docs/domain/DomainModel";

const docsContext = React.createContext(DocsContext.init())
export const useDocsContext = () => React.useContext(docsContext);



export const App = observer(() => {
  const docsContext = useDocsContext()
  const isUserAuthorized = docsContext.user.authStatus === AuthStatus.AUTHORIZED
  return (
    <Router>
      <Routes>
        <Route path="/docs/*" element={ isUserAuthorized ? <DocsView/> : <IntroView/> }/>
        <Route path="*" element={isUserAuthorized ? (<Navigate replace to="/docs"/>) : (<IntroView/>)}/>
      </Routes>
    </Router>
  )
})

function NotFound() {
  return <p>There's nothing here: 404!</p>;
}

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