import {observer} from "mobx-react";
import React, {useEffect, useLayoutEffect, useState} from "react";
import ReactMarkdown from "react-markdown";
import Prism from "prismjs";
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import {Header} from "./Header";
import {stylable} from "../application/NoCSS";
import {useDocsContext} from "../../App";
import {AppSize, LayoutLayer} from "../application/Application";
import {
  HStack,
  IconButton,
  Image,
  Label,
  Spacer,
  StylableContainer,
  TextArea,
  VSeparator,
  VStack
} from "../application/NoCSSComponents";

function useWindowPosition(limit: number = -1): number {
  const [scrollPosition, setPosition] = useState(window.scrollY)
  useLayoutEffect(() => {
    const handler = () => {
      let updatePosition = limit === -1
      updatePosition = updatePosition || (scrollPosition < limit && window.scrollY > limit && scrollPosition !== window.scrollY)
      updatePosition = updatePosition || (scrollPosition > limit && window.scrollY < limit && scrollPosition !== window.scrollY)
      if (updatePosition) setPosition(window.scrollY)
    }
    window.addEventListener('scroll', handler);
    return () => {
      window.removeEventListener('scroll', handler);
    }
  }, [scrollPosition, limit]);
  return scrollPosition;
}

export const IntroView = observer(() => {
  const SCROLL_POS_LIMIT = 400
  const {app} = useDocsContext()
  const scrollPosition = useWindowPosition(SCROLL_POS_LIMIT)
  console.log("new IntroView, scrollPosition: ", scrollPosition)

  const bgColor = app.theme.appBg + "99"

  return <VStack maxWidth="100%"
                 width="100%"
                 height="100%"
                 halign="center"
                 valign="center"
                 gap="30px"
                 paddingBottom="20px"
                 disableHorizontalScroll>

    {(app.size === AppSize.L || app.size === AppSize.M) &&
      <Image
        src={app.theme.isDark ? "/headerBg.jpg" : "/headerBg-light.jpg"}
        maxWidth="100%"
        disableHorizontalScroll
        halign="center" valign="top"
        top={scrollPosition > SCROLL_POS_LIMIT ? SCROLL_POS_LIMIT + "px" : "0"}
        absolute={scrollPosition > SCROLL_POS_LIMIT}
        fixed={scrollPosition <= SCROLL_POS_LIMIT}/>
    }

    <Header width="100%"
            height="50px"
            top="0"
            layer={LayoutLayer.HEADER}
            fixed/>

    <StylableContainer left="10px" top="5px" fixed
                       layer={LayoutLayer.HEADER}>
      <IconButton icon={app.theme.isDark ? "moon" : "sun"}
                  hideBg
                  popUp="Switch a theme"
                  theme={app.theme}
                  onClick={() => app.switchTheme()}/>
    </StylableContainer>
    {(app.size === AppSize.XS || app.size === AppSize.S) &&
      <Image
        src={app.theme.isDark ? "/headerBg.jpg" : "/headerBg-light.jpg"}
        maxWidth="100%"
        width="100%"
        disableScroll
        halign="center" valign="top"/>
    }

    <Label className="mono"
           whiteSpace="pre"
           padding="30px"
           title={app.size === AppSize.XS ? aboutTxtXS : aboutTxt}
           textColor={app.theme.text75}
           bgColor={bgColor}
           layer={LayoutLayer.ONE}/>

    <Label
      className={app.theme.isDark ? app.size === AppSize.XS ? "ibm h3" : "ibm h2" : app.size === AppSize.XS ? "ibm h3 light" : "ibm h2 light"}
      whiteSpace="pre"
      paddingVertical="30px"
      layer={LayoutLayer.ONE}>
      <span className="token keyword">func </span>
      <span className="token function">highlight</span>
      <span className="token symbol">(</span>
      <span className="token def">yourNotes</span>
      <span className="token symbol">: [</span>
      <span className="token class">String</span>
      <span className="token symbol">{"])"}</span>
      {app.size !== AppSize.XS &&
        <span className="token symbol">{" {...}"}</span>
      }
    </Label>

    <Spacer visible={app.size === AppSize.L || app.size === AppSize.M} height="250px"/>

    <VStack halign="stretch"
            valign="top"
            maxWidth="1700px"
            bgColor={bgColor}
            padding="30px"
            layer={LayoutLayer.ONE}>
      <Label className="ibm h4"
             title="Examples of Markdown formatting"
             textColor={app.theme.text}
             paddingLeft="25px"
             paddingBottom="25px"
             layer={LayoutLayer.ONE}/>
      <MarkdownEditor text={headings} title="0.Headings, font style"/>
      <MarkdownEditor text={blockquote} title="1.Blockquote"/>
      <MarkdownEditor text={code} title="2.Code"/>
      <MarkdownEditor text={lists} title="3.Lists"/>
      <MarkdownEditor text={links} title="4.Links"/>
    </VStack>

    <Label className="mono"
           title={(app.isMobileDevice ? 'Mobile ' : 'Desktop ') + app.size}
           fontSize="10px"
           textColor={app.theme.text75}
           layer={LayoutLayer.ONE}/>
  </VStack>
})

const aboutTxt = `/***
*                                                       *
*   Designed by developers for developers               *   ======================== 
*   This is a web-solution, that enables you to make    *   MODE  |  VER   |  DATE
*   notes using a markdown-editor. Markdown helps       *   –––––––––––––––––––––––– 
*   to format notes and code fragments easily without   *   demo  |  2.17  |  2023  
*   having to write a plane text or HTML tags.          *   ======================== 
*                                                       *
***/
`

const aboutTxtXS = `/***
*
*  Designed by developers for developers
*  This is a web-solution, that enables you to 
*  make notes using a markdown-editor. Markdown
*  helps to format notes and code fragments 
*  easily without having to write a plane text
*  or HTML tags.
*
*  –––––––––––––––––––––––––––––––––––––––––
*  MODE: demo  |  VER: 2.17  |  DATE: 2023  
*  –––––––––––––––––––––––––––––––––––––––––
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
 
~~~js
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
      <VStack halign="stretch"
              valign="top"
              gap="5px"
              width="100%"
              layer={LayoutLayer.ONE}>

        <Label className="ibm h4"
               title={title}
               textColor={app.theme.text75}
               whiteSpace="pre"
               paddingLeft="25px"
               minWidth="150px"/>

        <TextArea className="mono"
                  text={value}
                  theme={app.theme}
                  paddingHorizontal="20px"
                  paddingVertical="10px"
                  onApply={apply}
                  onCancel={cancel}
                  autoFocus={autoFocus}/>

        <HStack halign="left"
                valign="stretch"
                paddingLeft="25px"
                paddingRight="20px">

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
      <Label className="ibm h4"
             title={title}
             textColor={app.theme.text75}
             whiteSpace="pre"
             paddingLeft="25px"
             minWidth="150px"/>

      <HStack halign="stretch"
              valign="stretch"
              gap="50px">
        <TextArea className="mono"
                  text={value}
                  theme={app.theme}
                  paddingHorizontal="20px"
                  paddingVertical="10px"
                  onApply={apply}
                  onCancel={cancel}
                  autoFocus={autoFocus}
                  width="50%"/>

        <VSeparator theme={app.theme}/>

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
  const {app} = useDocsContext()
  console.log("new MarkdownText")
  useEffect(() => {
    console.log("--Prism.highlightAll")
    Prism.highlightAll()
  }, [value])
  return <div className={app.theme.id}>
    <ReactMarkdown className={app.theme.isDark ? "dark" : "light"} key={value}>{value}</ReactMarkdown>
  </div>
})