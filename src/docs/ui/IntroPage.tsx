import React, { useEffect, useLayoutEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import Prism from 'prismjs'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-c'
import 'prismjs/components/prism-cpp'
import 'prismjs/components/prism-csharp'
import 'prismjs/components/prism-swift'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-markup'
import { Header } from './Header'
import { stylable } from '../application/NoCSS'
import { AppSize, LayoutLayer } from '../application/Application'
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
} from '../application/NoCSSComponents'
import { observeApp } from '../DocsContext'
import { observer } from '../infrastructure/Observer'
import { useDocsContext } from '../../App'

function useWindowPosition(limit: number = -1): number {
  const [scrollPosition, setPosition] = useState(window.scrollY)
  useLayoutEffect(() => {
    const handler = () => {
      let updatePosition = limit === -1
      updatePosition = updatePosition || (scrollPosition < limit && window.scrollY > limit && scrollPosition !== window.scrollY)
      updatePosition = updatePosition || (scrollPosition > limit && window.scrollY < limit && scrollPosition !== window.scrollY)
      if (updatePosition) setPosition(window.scrollY)
    }
    window.addEventListener('scroll', handler)
    return () => {
      window.removeEventListener('scroll', handler)
    }
  }, [scrollPosition, limit])
  return scrollPosition
}

export const IntroPage = observer(() => {
  const app = observeApp()
  const { theme, themeManager } = useDocsContext()

  const SCROLL_POS_LIMIT = 600
  const scrollPosition = useWindowPosition(SCROLL_POS_LIMIT)
  console.log('new IntroPage, scrollPosition: ', scrollPosition)

  let headerFontSize = ''
  switch (app.size) {
    case AppSize.XS: headerFontSize = '45px'; break
    case AppSize.S: headerFontSize = '60px'; break
    case AppSize.M: headerFontSize = '65px'; break
    case AppSize.L: headerFontSize = '70px'; break
  }

  const funcColor = theme.isDark ? '#7a5196' : '#a06a9d'
  const highlightColor = theme.isDark ? '#4e95cb' : '#416fb3'
  const stringColor = theme.isDark ? '#61b1b2' : '#5e929d'
  const yourNotesColor = theme.isDark ? '#bccbd7' : '#5b6269'
  const symbolsColor = theme.isDark ? '#6b888e' : '#5b6269'

  return <VStack maxWidth="100%"
                 width="100%"
                 height="100%"
                 halign="center"
                 valign="center"
                 gap="0"
                 paddingBottom="20px"
                 disableHorizontalScroll>

    {app.size === AppSize.XS &&
      <Image src={theme.isDark ? '/headerBg.jpg' : '/headerBg-light.jpg'}
             preview={theme.isDark ? '/headerBg-preview.jpg' : '/headerBg-light-preview.jpg'}
             alt="header's background"
             top="0"
             width='900px'
             height='auto'
             disableScroll
             fixed
             halign="center" valign="top"/>

    }

    {app.size !== AppSize.XS &&
      <Image src={theme.isDark ? '/headerBg.jpg' : '/headerBg-light.jpg'}
             preview={theme.isDark ? '/headerBg-preview.jpg' : '/headerBg-light-preview.jpg'}
             alt="header's background"
             width='2000px'
             height='auto'
             disableHorizontalScroll
             halign="center" valign="top"
             top="0"
             opacity={scrollPosition > SCROLL_POS_LIMIT ? theme.isDark ? '0.6' : '0.2' : '1'}
             animate='opacity 700ms'
             fixed/>
    }

    <Header width="100%"
            height="50px"
            top="0"
            layer={LayoutLayer.HEADER}
            fixed/>

    <StylableContainer left="10px" top="5px" fixed
                       layer={LayoutLayer.HEADER}>
      <IconButton icon={theme.isDark ? 'moon' : 'sun'}
                  hideBg
                  popUp="Switch a theme"
                  theme={theme}
                  onClick={() => {
                    themeManager.switchTheme()
                  }}/>
    </StylableContainer>

    <Label className={theme.isDark ? 'title' : 'title light'}
           fontSize={headerFontSize}
           whiteSpace="pre"
           opacity='0.85'
           textAlign='left'
           paddingTop="70px"
           paddingBottom='60px'
           layer={LayoutLayer.ONE}>
      <span style={{ color: funcColor }}>{'              func\n'}</span>
      <span style={{ color: highlightColor }}>{'      highlight\n'}</span>
      <span style={{ color: symbolsColor }}>{'('}</span>
      <span style={{ color: yourNotesColor }}>yourNotes</span>
      <span style={{ color: symbolsColor }}>{':\n           ['}</span>
      <span style={{ color: stringColor }}>String</span>
      <span style={{ color: symbolsColor }}>{'])'}</span>
    </Label>

    <Label className="ibm"
           whiteSpace="pre"
           padding="30px"
           text={app.size === AppSize.XS ? aboutTxtXS : aboutTxt}
           textColor={theme.green}
           layer={LayoutLayer.ONE}/>

    <VStack halign="stretch"
            valign="top"
            maxWidth="1700px"
            bgColor={theme.appBg}
            padding="40px"
            layer={LayoutLayer.ONE}>

      <Label className="ibm h4"
             text="Examples of Markdown formatting"
             textColor={theme.text}
             paddingLeft="25px"
             paddingBottom="25px"
             layer={LayoutLayer.ONE}/>

      <MarkdownEditor text={headings} title="0.Headings, font style"/>
      <MarkdownEditor text={blockquote} title="1.Blockquote"/>
      <MarkdownEditor text={code} title="2.Code"/>
      <MarkdownEditor text={lists} title="3.Lists"/>
      <MarkdownEditor text={links} title="4.Links"/>
      <MarkdownEditor text={shortcuts} secondMarkdownText={languages} title="5. Editor"/>
    </VStack>

    <Label className="mono"
           text={(app.isMobileDevice ? 'Mobile ' : 'Desktop ') + app.size}
           fontSize="10px"
           textColor={theme.text75}
           layer={LayoutLayer.ONE}/>

  </VStack>
})

const aboutTxt = `
*                                                       *                           
*   Designed by developers for developers               *   ========================
*   This is a web-solution, that enables you to make    *   MODE  |  VER   |  YEAR  
*   notes using a markdown-editor. Markdown helps       *   ––––––––––––––––––––––––
*   to format notes and code fragments easily without   *   demo  |  2.41  |  2023  
*   having to write a plane text or HTML tags.          *   ========================
*                                                       *                           `

const aboutTxtXS = `
*                                               
*  Designed by developers for developers        
*  This is a web-solution, that enables you to  
*  helps to format notes and code fragments     
*  make notes using a markdown-editor. Markdown 
*  easily without having to write a plane text  
*  or HTML tags.                                
*                                               
*  –––––––––––––––––––––––––––––––––––––––––    
*  MODE: demo  |  VER: 2.41  |  YEAR: 2023      
*  –––––––––––––––––––––––––––––––––––––––––    
*                                               
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

const languages = `## Supported languages\n
+ C: \`c\`\n
+ C++: \`cpp\`\n
+ C#: \`csharp, cs, dotnet\`\n
+ CSS: \`css\`\n
+ HTML: \`html\`\n
+ Java: \`java\`\n
+ JavaScript: \`js, jsx\`\n
+ JSON: \`json\`\n
+ Python: \`py\`\n
+ Swift: \`swift\`\n
+ TypeScript: \`ts, tsx\`\n
+ XML: \`xml\``

const shortcuts = `## Shortcuts\n
+ Apply code changes: \`Shift + Enter\`\n
+ Format code: \`Ctrl + Shift + L\``

const code = `## Memoization
Memoization is an optimisation technique base on remembering results returned by a function called with same arguments.
 
\`\`\`js
const memoize = (fn) => {
  const argKey = (x) => x.toString() + ':' + typeof x
  const generateKey = (args) => args.map(argKey).join('|')
  const cache = Object.create(null)

  return (...args) => {
    const key = generateKey(args)
    if (!cache[key]) cache[key] = fn(...args)
    return cache[key]
  }
}

const calc = (x, y, op) => { return x + y }
const exc = memoize(calc);
exc(2, 1, '+') //3, calculated
exc(2, 1, '+') //3, returned from cache
\`\`\``

const links = `## Much more info:
* [React-Markdown](https://remarkjs.github.io/react-markdown/)
* [Markdown basic syntax](https://www.markdownguide.org/basic-syntax/)
* [Source Code (GitHub)](https://github.com/dittner/mondmonolith/tree/master)`

interface MarkdownEditorProps {
  text: string
  title: string
  autoFocus?: boolean
  secondMarkdownText?: string
}

const MarkdownEditor = (props: MarkdownEditorProps) => {
  const { app, theme } = useDocsContext()

  console.log('new MarkdownEditor')
  const [value, setValue] = useState(props.text)
  const apply = (newValue: string) => {
    if (value !== newValue) {
      setValue(newValue)
    }
  }

  const cancel = () => {
    console.log('cancel')
  }

  if (app.size === AppSize.S || app.size === AppSize.XS) {
    return (
      <VStack halign="stretch"
              valign="top"
              gap="10px"
              width="100%"
              layer={LayoutLayer.ONE}>

        <Label className="ibm h4"
               text={props.title}
               textColor={theme.text75}
               whiteSpace="pre"
               paddingLeft="25px"
               minWidth="150px"/>

        {props.secondMarkdownText &&
          <MarkdownText value={props.secondMarkdownText}
                        paddingLeft="25px"
                        width="100%"/>
        }

        {!props.secondMarkdownText &&
          <TextArea className="mono"
                    text={value}
                    theme={theme}
                    paddingHorizontal="25px"
                    paddingVertical="20px"
                    onApply={apply}
                    onCancel={cancel}
                    autoFocus={props.autoFocus}/>
        }

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
             text={props.title}
             textColor={theme.text75}
             whiteSpace="pre"
             paddingLeft="25px"
             minWidth="150px"/>

      <HStack halign="stretch"
              valign="stretch"
              gap="50px">
        {props.secondMarkdownText &&
          <MarkdownText value={props.secondMarkdownText}
                        width="50%"/>
        }

        {!props.secondMarkdownText &&
          <TextArea className="mono"
                    text={value}
                    theme={theme}
                    paddingHorizontal="25px"
                    paddingVertical="20px"
                    onApply={apply}
                    onCancel={cancel}
                    autoFocus={props.autoFocus}
                    width="50%"/>
        }

        <VSeparator theme={theme}/>

        <MarkdownText value={value}
                      width="50%"/>
      </HStack>

      <Spacer height="50px"/>
    </>
  )
}

const MarkdownText = stylable(({ value }: { value: string }) => {
  const { theme } = useDocsContext()

  useEffect(() => {
    console.log('--Prism.highlightAll')
    Prism.highlightAll()
  }, [value])
  return <div className={theme.id}>
    <ReactMarkdown className={theme.isDark ? 'dark' : 'light'} key={value}>{value}</ReactMarkdown>
  </div>
})
