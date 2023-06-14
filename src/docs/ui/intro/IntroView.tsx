import "./introView.css"
import {observer} from "mobx-react";
import {TextArea} from "../common/Input";
import React, {useEffect, useState} from "react";
import ReactMarkdown from "react-markdown";
import Prism from "prismjs";
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import {Header} from "../header/Header";
import {HAlign, HStack, stylable, VAlign, VStack} from "../../../docs/application/NoCSS";
import {VSeparator} from "../common/Separator";
import {Spacer} from "../common/Spacer";
import {useDocsContext} from "../../../App";
import {AppSize} from "../../application/Application";

export const IntroView = observer(() => {
  const {app} = useDocsContext()
  console.log("new IntroView")

  return <VStack halign={HAlign.CENTER}
                 valign={VAlign.CENTER}
                 gap="50px"
                 paddingTop="100px"
                 paddingBottom="20px">

    <Header width="100%"
            height="50px"
            top="0"
            fixed/>

    <img src="/headerBg.jpg" className="introHeaderImg"/>

    <div className="about">
      <span>{app.size === AppSize.XS ? aboutTxtXS : aboutTxt}</span>
    </div>
    <Spacer height="120px"/>

    <div className="highlightFunc">
      <span className="token keyword">func </span>
      <span className="token function">highlight</span>
      <span className="token symbol">(</span>
      <span>yourNotes</span>
      <span className="token symbol">: [</span>
      <span className="token class">String</span>
      <span className="token symbol">{"])"}</span>
      {app.size !== AppSize.XS &&
      <span className="token symbol">{"{...}"}</span>
      }
    </div>


    <VStack className="markdownContainer" halign={HAlign.STRETCH}
            valign={VAlign.TOP}
            maxWidth={"1700px"}>
      <p className="markdownSyntax">Examples of Markdown formatting</p>
      <MarkdownEditor text={headings} title="0.Headings, font style" autoFocus/>
      <MarkdownEditor text={blockquote} title="1.Blockquote"/>
      <MarkdownEditor text={code} title="2.Code"/>
      <MarkdownEditor text={lists} title="3.Lists"/>
      <MarkdownEditor text={links} title="4.Links"/>
    </VStack>
  </VStack>
})

const aboutTxt = `/***
*                                                       *
*   Designed by developers for developers               *   =========================
*   This is a web-solution, that enables you to make    *   MODE   |   VER   |   DATE
*   notes using a markdown-editor. Markdown helps       *   –––––––––––––––––––––––––
*   to format notes and code fragments easily without   *   demo   |   1.0   |   2023
*   having to write a plane text or HTML tags.          *   =========================
*                                                       *
***/
`

const aboutTxtXS = `/***
*
*  <b>Designed by developers for developers</b>
*  This is a web-solution, that enables you to 
*  make notes using a markdown-editor. Markdown
*  helps to format notes and code fragments 
*  easily without having to write a plane text
*  or HTML tags.
*                       
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

const MarkdownEditor = observer(({text, title, autoFocus}: { text: string, title: string, autoFocus?: boolean }) => {
  const {app} = useDocsContext()
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

  if (app.size === AppSize.S || app.size === AppSize.XS) {
    return (
      <VStack halign={HAlign.STRETCH}
              valign={VAlign.TOP}
              gap="5px"
              width="100%">

        <p className="markdownTitle">{title}</p>

        <TextArea text={value}
                  onApply={apply}
                  onCancel={cancel}
                  autoFocus={autoFocus}
                  width="100%"/>

        <HStack halign={HAlign.LEFT}
                valign={VAlign.STRETCH}
                paddingLeft="20px"
                paddingRight="20px"
                gap="50px">

          <VSeparator/>

          {value &&
          <MarkdownText value={value}
                        width="100%"/>
          }
        </HStack>

        <Spacer height="50px"/>
      </VStack>
    )
  }

  return (
    <>
      <p className="markdownTitle">{title}</p>
      <HStack halign={HAlign.STRETCH}
              valign={VAlign.STRETCH}
              gap="50px">
        {/*<Label text="Some Text"/>*/}

        <TextArea text={value}
                  onApply={apply}
                  onCancel={cancel}
                  autoFocus={autoFocus}
                  width="50%"/>

        <VSeparator/>

        {value &&
        <MarkdownText value={value}
                      width="50%"/>
        }
      </HStack>

      <Spacer height="50px"/>
    </>
  )

})

const MarkdownText = stylable(({value}: { value: string }) => {
  console.log("new MarkdownText")
  //Use random key to force a new rendering of the code fragment in ReactMarkdown
  useEffect(() => {
    console.log("--Prism.highlightAll")
    Prism.highlightAll()
  }, [value])
  return <div className="markdown">
    <ReactMarkdown key={value}>{value}</ReactMarkdown>
  </div>
})

const Label = stylable(({text}: { text: String }) => {
  return <p>{text}</p>
})