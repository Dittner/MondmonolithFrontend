import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {DocsView} from "./docs/ui/DocsView";
import {DocsContext} from "./docs/DocsContext";
import React from "react";
import {IntroView} from "./docs/ui/intro/IntroView";
import {observer} from "mobx-react";
import {AuthStatus} from "./docs/domain/DomainModel";

const docsContext = React.createContext(DocsContext.init())
export const useDocsContext = () => React.useContext(docsContext);

export const App = observer(() => {
  const docsContext = useDocsContext()
  const StartView = docsContext.user.authStatus === AuthStatus.AUTHORIZED ? <DocsView/> : <IntroView/>
  return (
    <Router>
      <Routes>
        <Route path="/docs/*" element={StartView}/>
        <Route path="/" element={<IntroView/>}/>
        <Route path="*" element={<NotFound/>}/>
      </Routes>
    </Router>
  )
})

function NotFound() {
  return <p>There's nothing here: 404!</p>;
}
