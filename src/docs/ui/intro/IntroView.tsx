import "./introView.css"
import {observer} from "mobx-react";
import {TextArea} from "../common/Input";
import React, {useEffect, useState} from "react";
import ReactMarkdown from "react-markdown";
import parse from 'html-react-parser';
import Prism from "prismjs";
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import {Header} from "../header/Header";

export const IntroView = observer(() => {
  console.log("new IntroView")

  return <div className="introView">
    <Header/>
    <div className="aboutContainer">
      <div className="about">
        <span>{parse(aboutTxt)}</span>
      </div>
      <div className="highlightFunc">
        <span className="token keyword">func </span>
        <span className="token function">highlight</span>
        <span className="token symbol">(</span>
        <span>your_notes</span>
        <span className="token symbol">: [</span>
        <span className="token class">String</span>
        <span className="token symbol">{"]) {...}     "}</span>
      </div>
    </div>

    <div className="markdownExamples">
      <p className="markdownSyntax">Examples of Markdown formatting</p>
      <MarkdownEditor text={headings} title="0.Headings, font style" autoFocus/>
      <MarkdownEditor text={blockquote} title="1.Blockquote"/>
      <MarkdownEditor text={code} title="2.Code"/>
      <MarkdownEditor text={lists} title="3.Lists"/>
      <MarkdownEditor text={links} title="4.Links"/>
    </div>
  </div>
})

const aboutTxt = `/***
*                                                       *
*   <b>Designed by developers for developers</b>               *   =========================
*   This is a web-solution, that enables you to make    *   MODE   |   VER   |   DATE
*   notes using a markdown-editor. Markdown helps       *   –––––––––––––––––––––––––
*   to format notes and code fragments easily without   *   demo   |   1.0   |   2023
*   having to write a plane text or HTML tags.          *   =========================
*                                                       *
***/
`

const headings = `# HAL 9000
## Created by Dr. Chandra
__HAL 9000__ is an acronym for a Heuristically programmed ALgorithmic computer.
HAL’s main job is to control the systems in spacecraft _Discovery One_ while interacting with the crew.`

const blockquote = `> «Sorry to interrupt the festivities, Dave, but I think we’ve got a problem.»
>
>__HAL 9000__`

const lists = `## Daisy Bell
+ Daisy...
+ Daisy...
+ Daisy... 
    + Give me your answer, do...
    + I'm.. half... crazy...
    + All for the love... of you...`

const code = `## Memoization
Memoization is an optimisation technique base on remembering results returned by
 a function called with same arguments, that uses a cache and a \`generateKey\` function.
 
~~~javascript
const memoize = (fn) => {
  const argKey = (x) => x.toString() + ':' + typeof x
  const generateKey = (args) => args.map(argKey).join('|')
  const cache = Object.create(null)

  return (...args) => {
    const key = generateKey(args)
    const value = cache[key]
    if (value) return value
    const res = fn(...args)
    cache[key] = res
    return res
  }
}

//calc(2, 1, '+') => 3
const calc = (x, y, op) => {...}

const exc = memoize(calc);
exc(2, 1, '+') //3, calculated
exc(2, 1, '+') //3, returned from cache
~~~`

const links = `## Much more info:
* [React-Markdown](https://remarkjs.github.io/react-markdown/)
* [Markdown basic syntax](https://www.markdownguide.org/basic-syntax/)`

const MarkdownEditor = ({text, title, autoFocus}: { text: string, title: string, autoFocus?: boolean }) => {
  console.log("new MarkdownEditor")
  const [value, setValue] = useState(text)
  const apply = (newValue: string) => {
    if (value !== newValue) {
      setValue(newValue)
    }
  }

  const cancel = () => {
    console.log("cancel")
  }

  return (
    <div className="markdownEditor">
      <p className="markdownTitle">{title}</p>
      <div className="markdownArea">
        <TextArea text={value}
                  onApply={apply}
                  onCancel={cancel}
                  autoFocus={autoFocus}/>
      </div>
      <div className="markdownResult">
        {value &&
        <MarkdownText value={value}/>
        }
      </div>
      <div className="vgap"/>
    </div>
  )
}

const MarkdownText = ({value}: { value: string }) => {
  console.log("new MarkdownText")
  //Use random key to force a new rendering of the code fragment in ReactMarkdown
  const key = Math.random()
  useEffect(() => {
    console.log("--Prism.highlightAll")
    Prism.highlightAll()
  })
  return <ReactMarkdown key={key}>{value}</ReactMarkdown>
}