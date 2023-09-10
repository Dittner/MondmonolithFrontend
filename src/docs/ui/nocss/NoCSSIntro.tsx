import React, { useEffect } from 'react'
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
import { stylable } from '../../application/NoCSS'
import { LayoutLayer } from '../../application/Application'
import { VStack } from '../common/Container'
import { Label } from '../common/Label'
import { Spacer } from '../common/Spacer'
import { type NoCSSPageTheme } from './NoCSSPage'

export const NoCSSIntro = ({ theme }: { theme: NoCSSPageTheme }) => {
  console.log('new NoCSSIntro')

  return <VStack width="100%"
                 height="100%"
                 halign="center"
                 valign="center"
                 gap="20px"
                 disableHorizontalScroll>

    <VStack halign='center' valign='top'
            width="100%"
            paddingVertical='40px'
            bgColor={theme.headerBgColor}>
      <Label className='def'
             fontSize={theme.headerFontSize}
             text='NoCSS'
             padding='10px'
             width='100%' maxWidth={theme.contentWidth}
             whiteSpace="pre"
             textColor={theme.white}
             layer={LayoutLayer.ONE}/>

      <MarkdownText className='def'
                    padding='10px'
                    width="100%" maxWidth={theme.contentWidth}
                    value={introTxt}
                    textColor={theme.white}/>
    </VStack>

    <Fragment title='The 11 principles of NoCSS'
              text={principlesTxt}
              theme={theme}/>

    <Fragment title='Disadvantages of Style Sheets'
              text={disadvantagesTxt}
              theme={theme}/>

    <Fragment title='Disadvantages of CSS-in-JS approach'
              text={conclusionTxt}
              theme={theme}/>

    <Spacer height='50px'/>
  </VStack>
}

const introTxt = `+ __NoCSS__ is a CSS-in-JS-lib, that enables us to implement UI in a JSX/TSX-file without using CSS, CSS-preprocessors and BEM convention;
+ Unlike popular CSS-frameworks or CSS-libraries (e.g. _Teilwind_, _Ant Design_), __NoCSS__ does not provide ready-made components. Nevertheless, it offers a lightweight, flexible and powerful toolkit that helps us to build original UI more quickly and safely;
+ __NoCSS__ has built-in templates: buttons, labels, containers, lists, etc, that can be customized;
+ Three elements are lying behind __NoCSS__: react _higher-order components_ (HOC), dynamic CSS rules and CSS selectors caching;
+ __NoCSS__ is developed with respect for the values of _OOP_ and _Clean Code_.`

const principlesTxt = `0. Software module boundaries, its isolation and privacy have the highest priority;
1. Modularization and decomposition over number of files and size of files;
2. Each software module should have only one responsibility and only one reason to change (SRP);
3. One responsibility should be expressed in only one module;
4. Responsibilities should not overlap;
5. Code, logic, user and developer actions should not be duplicated;
6. Avoiding duplication should not lead to excessive complexity of the code, unjustified waste of resources or module isolation failure;
7. Readability of the high-level code should not be sacrificed for poorly designed tools;
8. Limitation of functionality over verbal agreement;
9. Mistakes cannot be hidden, they must be detected as early as possible;
10. Mistakes should be fixed only at the place where they were caused.`

const disadvantagesTxt = `0. CSS does not have a monopoly on the representation of data. We often see UI logic leakage between CSS selectors, JS objects, and JSX components.
1. CSS is not OOP friendly. CSS manipulates data structures, not objects. As a result, the isolation and security of modules is ignored. Changing the presentation of one object may unexpectedly affect the presentation of another.
2. If two modules are responsible for representing the same data, have similar or identical names, depend on each other or a common state, and when writing code we regularly switch between these modules, then we are actually dealing with one module that suffers from a split personality (split module). These modules can be a CSS selector and a JSX component, which actually perform the same task and share the same responsibility. Breaking module isolation like this or duplicating modules will make it harder to maintain old code and write new code.
3. After it became possible to declare variables and then functions in CSS/SASS, we can see a trend in which CSS tries to mimic a programming language. This means actually duplicating JS functionality. In this case, Martin Fowler would say that CSS is jealous of JS.`

const conclusionTxt = `Direct interaction with CSS inevitably produces a lot of duplications and style conflicts.
  Converting CSS selectors into a JS object, as happens in [JSS library](https://cssinjs.org/), allows us to get rid of redundant CSS files.
  However, styles declared in a JS object remain isolated from JSX components. Thus, the problem with the splitting of the module remains in JSS unresolved. In addition, declaring CSS properties in a JS object has a negative impact on readability.
  Therefore, the main goal of NoCSS is to completely abandon CSS modules and CSS syntax by adding an abstract layer between CSS and JSX. When building UI, we can now use only JSX syntax and only one module.`

const Fragment = ({
  title,
  text,
  theme
}: { title: string, text: string, theme: NoCSSPageTheme }) => {
  return <VStack halign='left' valign='top'
                 width="100%" maxWidth={theme.contentWidth}
                 paddingVertical='20px' paddingHorizontal='10px'>

    <Label className='def'
           fontSize='30px'
           text={title}
           textColor={theme.darkTextColor}
           layer={LayoutLayer.ONE}/>

    <MarkdownText className='def light'
                  textColor={theme.darkTextColor}
                  value={text}
                  width="100%"/>
  </VStack>
}

const MarkdownText = stylable(({ value }: { value: string }) => {
  useEffect(() => {
    console.log('--Prism.highlightAll')
    Prism.highlightAll()
  }, [value])
  return <ReactMarkdown className='markdown' key={value}>{value}</ReactMarkdown>
})
