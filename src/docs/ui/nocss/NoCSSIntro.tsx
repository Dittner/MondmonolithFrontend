import React, { useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import Prism from 'prismjs'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-markup'
import { buildClassName } from '../../application/NoCSS'
import { AppSize, LayoutLayer } from '../../application/Application'
import { VStack } from '../common/Container'
import { Label, type LabelProps } from '../common/Label'
import { Spacer } from '../common/Spacer'
import { noCSSControlLinks, type NoCSSPageTheme } from './NoCSSPage'
import { Button } from '../common/Button'
import { useNavigate } from 'react-router-dom'
import { useDocsContext } from '../../../App'
import { observe } from '../../infrastructure/Observer'

export const NoCSSIntro = ({ theme }: { theme: NoCSSPageTheme }) => {
  console.log('new NoCSSIntro')
  const navigate = useNavigate()
  const { app } = useDocsContext()
  observe(app)

  return <VStack width="100%"
                 height="100%"
                 halign="center"
                 valign="center"
                 gap="20px"
                 disableHorizontalScroll>

    <VStack halign='center' valign='top'
            width="100%"
            paddingHorizontal={app.size !== AppSize.XS ? '150px' : '40px'}
            paddingVertical='40px'
            bgColor={theme.headerBgColor}>
      <Label className='def'
             fontSize={theme.headerFontSize}
             fontWeight='500'
             text='NoCSS'
             width='100%' maxWidth={theme.introContentWidth}
             whiteSpace="pre"
             textColor={theme.white}
             layer={LayoutLayer.ONE}/>

      <MarkdownText className='def'
                    width="100%" maxWidth={theme.introContentWidth}
                    text={introTxt}
                    fontSize='1.1rem'
                    fontWeight='400'
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

    <Button title="Let's look at examples"
            height='45px'
            fontSize='1.2rem'
            bgColor={undefined}
            textColor={theme.orange}
            hoverState={state => {
              state.textDecoration = 'underline'
            }}
            onClick={() => {
              navigate('/nocss/' + noCSSControlLinks[1])
              window.scrollTo(0, 0)
            }}/>

    <Spacer height='50px'/>
  </VStack>
}

const introTxt = `+ __NoCSS__ is a CSS-in-JSX-lib, that enables us to implement UI in a JSX/TSX-module without using CSS, SASS and BEM convention;
+ Unlike popular CSS-frameworks or CSS-libraries (e.g. _Teilwind_, _Ant Design_), __NoCSS__ does not provide ready-made components. Nevertheless, it offers a lightweight, flexible and powerful toolkit that helps us to build original UI more quickly and safely;
+ __NoCSS__ has built-in templates: _Button_, _Label_, _VStack_, _HStack_ etc, that can be customized programmatically;
+ Three elements are lying behind __NoCSS__: react _higher-order components_ (HOC), dynamic CSS rules and CSS selectors caching. __NoCSS__ does not generate Inline Styles;
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
9. Mistakes should not be hidden, they must be detected as early as possible;
10. Mistakes should be fixed only at the place where they were caused.`

const disadvantagesTxt = `0. CSS does not have a monopoly on the representation of data. We often see UI logic leakage between CSS selectors, JS objects and JSX components.
1. CSS is not OOP friendly. CSS manipulates data structures, not objects. As a result, the isolation and security of modules is ignored. Changing the representation of one object may unexpectedly affect the representation of another.
2. If two modules are responsible for representing the same data, have similar or identical names, depend on each other or a common state, and when writing code we regularly switch between these modules, then we are actually dealing with one module that suffers from a split personality (split module). These modules can be a CSS rule and a JSX component, which actually perform the same task and share the same responsibility. Breaking module isolation like this or duplicating modules will make it harder to maintain old code and write new code.
3. Now we can declare variables and functions in CSS/SASS. These new possibilities demonstrate a trend in which CSS tries to mimic a programming language. This means actually duplicating JS functionality. In this case, Martin Fowler would say that CSS is jealous of JS.`

const conclusionTxt = `Direct interaction with CSS inevitably produces a lot of duplications and style conflicts.
  Converting CSS rules into a JS object, as happens in [JSS library](https://cssinjs.org/), allows us to get rid of redundant CSS files.
  However, styles declared in a JS object remain isolated from JSX components. Thus, the problem with the split module remains in JSS unresolved. In addition, declaring CSS properties in a JS object has a negative impact on readability.
  Therefore, the main goal of NoCSS is to completely abandon CSS modules and CSS syntax by adding an abstract layer between CSS and JSX. When building a UI-component, we can now use only JSX syntax and only one module.`

const Fragment = ({ title, text, theme }: { title: string, text: string, theme: NoCSSPageTheme }) => {
  const { app } = useDocsContext()
  observe(app)
  return <VStack halign='center' valign='top'
                 width="100%" paddingHorizontal={app.size !== AppSize.XS ? '150px' : '40px'}
                 paddingVertical='20px'>

    <Label className='def'
           fontSize='2rem'
           fontWeight='400'
           text={title}
           width="100%" maxWidth={theme.introContentWidth}
           textColor={theme.darkTextColor}
           layer={LayoutLayer.ONE}/>

    <MarkdownText className='def'
                  text={text}
                  textColor={theme.darkTextColor}
                  fontSize='1.1rem'
                  width="100%" maxWidth={theme.introContentWidth}/>
  </VStack>
}

const MarkdownText = (props: LabelProps) => {
  let className = 'className' in props ? props.className + ' ' : ''
  className += buildClassName(props)
  return <ReactMarkdown className={className} key={props.key}>{props.text ?? ''}</ReactMarkdown>
}
