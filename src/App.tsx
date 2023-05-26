import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {DocsView} from "./docs/ui/DocsView";
import {DocsContext} from "./docs/DocsContext";
import React from "react";
import {MainView} from "./main/MainView";

const docsContext = React.createContext(new DocsContext())
export const useDocsContext = () => React.useContext(docsContext);

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/docs/*" element={<DocsView/>}/>
        <Route path="/" element={<MainView/>}/>
        <Route path="*" element={<NotFound/>}/>
      </Routes>
    </Router>
  )
}

function NotFound() {
  return <p>There's nothing here: 404!</p>;
}
