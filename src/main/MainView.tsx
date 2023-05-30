import "./mainView.css"
import {observer} from "mobx-react";
import React from "react";
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import {NavLink} from "react-router-dom";

export const MainView = observer(() => {
  console.log("new MainView")

  return <div className="asciiCanvas">
    <img className="primates"
         src={require('../resources/primates.png')}
         alt="Primates"/>
    <NavLink className="btn" to="./docs">
      Docs
    </NavLink>
  </div>
})
