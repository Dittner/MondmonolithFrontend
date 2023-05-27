import "./mainView.css"
import {observer} from "mobx-react";
import React from "react";
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import ascii from './resource/ascii.txt';

export const MainView = observer(() => {
  console.log("new MainView")
  const [asciiText, setAsciiText] = React.useState("")

  if (!asciiText) {
    fetch(ascii)
      .then((response) => response.text())
      .then((data) => {
        setAsciiText(data)
      })
  }

  if (asciiText) {
    return <div className="mainView">
      <div className="asciiCanvas">
        <p>{asciiText}</p>
        <img src={require('./resource/primates.png')} alt="Primates"/>
      </div>
    </div>
  } else {
    return <div>"Loading..."</div>
  }
})