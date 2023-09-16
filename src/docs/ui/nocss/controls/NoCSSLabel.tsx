import React from 'react'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-markup'
import { Label } from '../../common/Label'
import { type NoCSSPageTheme } from '../NoCSSPage'
import { loremIpsum } from '../../common/String++'
import { MarkdownBlock, NoCSSControlView } from './NoCSSControlView'

export const NoCSSLabel = ({ theme }: { theme: NoCSSPageTheme }) => {
  console.log('new NoCSSLabel')

  return <NoCSSControlView controlLink='label'
                           theme={theme}
                           title='Label'
                           subTitle='<p> | <h1> | <h2> | <h3> | <h4> | <h5> | <h6>'>

    <MarkdownBlock title="1. Basic properties"
                   cssText={colorsCSSTxt}
                   noCSSText={colorsNoCSSTxt}
                   theme={theme}>
      <Label className='def'
             fontSize='18px'
             text='Abyssus abyssum invocat'
             padding='20px'
             textColor='#ffFFff'
             bgColor='#3a7c7b'
             cornerRadius='5px'
             borderColor='#57bfbe'/>
    </MarkdownBlock>

    <MarkdownBlock title="2. Multiline text"
                   cssText={multilineCSSTxt}
                   noCSSText={multilineNoCSSTxt}
                   theme={theme}>
      <Label className='def'
             text={loremIpsum}
             width='500px'
             fontSize='14px'
             textAlign='left'
             padding='20px'
             textColor='#57bfbe'
             borderLeft='5px solid #57bfbe'/>
    </MarkdownBlock>

    <MarkdownBlock title="3. Headers"
                   cssText={headersCSSTxt}
                   noCSSText={headersNoCSSTxt}
                   theme={theme}>
      <Label type='h1' text='h1'/>
      <Label type='h2' text='h2'/>
      <Label type='h3' text='h3'/>
      <Label type='h4' text='h4'/>
      <Label type='h5' text='h5'/>
      <Label type='h6' text='h6'/>
      <Label type='p' text='p'/>
    </MarkdownBlock>

  </NoCSSControlView>
}

/*
==============================
Colors
==============================
*/
const multilineCSSTxt = `###### css-module
\`\`\`css
.label {
  width: 500px;
  font-size: 14px;
  text-align: left;
  padding: 20px;
  color: #57bfbe;
  border-left: 5px solid #57bfbe;
}
\`\`\`
###### jsx-module
\`\`\`tsx
const App = () => {
  return (
    <p className='label'>{loremIpsum}</p>
  )
}
\`\`\``

const multilineNoCSSTxt = `###### jsx-module
\`\`\`tsx
const App = () => {
  return (
    <Label text={loremIpsum}
           width='500px'
           fontSize='14px'
           textAlign='left'
           padding='20px'
           textColor='#57bfbe'
           borderLeft='5px solid #57bfbe'/>
  )
}
\`\`\``

/*
==============================
Colors
==============================
*/
const colorsCSSTxt = `###### css-module
\`\`\`css
.label {
  font-size: 18px;
  padding: 20px;
  color: #ffFFff;
  background-color: #3a7c7b;
  border-color: #57bfbe;
  border-radius: 5px;
}
\`\`\`
###### jsx-module
\`\`\`tsx
const App = () => {
  return (
    <p className='label'>
      Abyssus abyssum invocat
    </p>
  )
}
\`\`\``

const colorsNoCSSTxt = `###### jsx-module
\`\`\`tsx
const App = () => {
  return (
    <Label text='Abyssus abyssum invocat'
           fontSize='18px'
           padding='20px'
           textColor='#ffFFff'
           bgColor='#3a7c7b'
           borderColor='#57bfbe'
           cornerRadius='5px'/>
  )
}
\`\`\``

/*
==============================
Headers
==============================
*/
const headersCSSTxt = `###### css-module
\`\`\`css
h1 { color: #c7d7e5; }
h2 { color: #c2b99f; }
h3 { color: #a4887e; }
h4 { color: #ab9b4d; }
h5 { color: #8064c7; }
h6 { color: #626b75; }
p { color: #86b3c7; }
\`\`\`
###### jsx-module
\`\`\`tsx
const App = () => {
  return (
    <h1>h1</h1>
    <h2>h2</h2>
    <h3>h3</h3>
    <h4>h4</h4>
    <h5>h5</h5>
    <h6>h6</h6>
    <p>p</p>
  )
}
\`\`\``

const headersNoCSSTxt = `###### jsx-module
\`\`\`tsx
const App = () => {
  return (
    <Label type='h1' text='h1' textColor='#c7d7e5'/>
    <Label type='h2' text='h2' textColor='#c2b99f'/>
    <Label type='h3' text='h3' textColor='#a4887e'/>
    <Label type='h4' text='h4' textColor='#ab9b4d'/>
    <Label type='h5' text='h5' textColor='#8064c7'/>
    <Label type='h6' text='h6' textColor='#626b75'/>
    <Label type='p'  text='p'  textColor='#86b3c7'/>
  )
}
\`\`\``
