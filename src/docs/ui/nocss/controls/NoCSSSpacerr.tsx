import React, { useState } from 'react'
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
import { Label } from '../../common/Label'
import { type NoCSSPageTheme } from '../NoCSSPage'
import { loremIpsum } from '../../common/String++'
import { MarkdownBlock, NoCSSControlView } from './NoCSSControlView'
import { Button, type ButtonProps } from '../../common/Button'
import { buildClassName, type StylableComponentProps } from '../../../application/NoCSS'
import { useDocsContext } from '../../../../App'
import { Spacer } from '../../common/Spacer'
import { HStack, type StackHAlign, type StackVAlign, StylableContainer, VStack } from '../../common/Container'
import { Rectangle } from '../../common/Rectangle'

export const NoCSSSpacer = ({ theme }: { theme: NoCSSPageTheme }) => {
  console.log('new NoCSSSpacer')
  return <NoCSSControlView controlLink='spacer'
                           theme={theme}
                           title='Spacer'
                           subTitle='<div>'>

    <MarkdownBlock title="1. Precise alignment"
                   cssText={block1CSSTxt}
                   noCSSText={block1NoCSSTxt}
                   theme={theme}>
      <VStack halign='center'
              valign='center'
              gap='0'
              bgColor='#3a7c7b'
              width='500px'
              height='250px'>
        <BlackBox title='1'/>

        <HStack halign='center'
                valign='center'
                gap='0'
                width='100%'>
          <BlackBox title='1'/>
          <Spacer width='40px'/>
          <BlackBox title='1'/>
        </HStack>

        <HStack halign='center'
                valign='center'
                gap='0'
                width='100%'>
          <Spacer width='40px'/>
          <BlackBox title='1'/>
          <Spacer width='40px'/>
          <BlackBox title='2'/>
          <Spacer width='40px'/>
          <BlackBox title='1'/>
          <Spacer width='40px'/>
        </HStack>

        <HStack halign='center'
                valign='center'
                gap='0'
                width='100%'>
          <BlackBox title='1'/>
          <Spacer width='40px'/>
          <BlackBox title='3'/>
          <Spacer width='40px'/>
          <BlackBox title='3'/>
          <Spacer width='40px'/>
          <BlackBox title='1'/>
        </HStack>
      </VStack>
    </MarkdownBlock>

    <MarkdownBlock title="2. Flexible alignment"
                   cssText={block2CSSTxt}
                   noCSSText={block2NoCSSTxt}
                   theme={theme}>
      <VStack valign='center'
              bgColor='#3a7c7b'
              width='500px'
              height='250px'
              padding='20px'>
        <HStack width='100%'>
          <BlackBox title='1'/>
          <BlackBox title='2'/>
          <BlackBox title='3'/>
          <BlackBox title='4'/>
          <Spacer/>
          <BlackBox title='5'/>
        </HStack>

        <HStack width='100%'>
          <BlackBox title='1'/>
          <BlackBox title='2'/>
          <Spacer/>
          <BlackBox title='3'/>
          <Spacer/>
          <BlackBox title='4'/>
          <BlackBox title='5'/>
        </HStack>

        <HStack width='100%'>
          <BlackBox title='1'/>
          <Spacer/>
          <BlackBox title='2'/>
          <Spacer/>
          <BlackBox title='3'/>
          <Spacer/>
          <BlackBox title='4'/>
          <Spacer/>
          <BlackBox title='5'/>
        </HStack>
      </VStack>
    </MarkdownBlock>
  </NoCSSControlView>
}

const BlackBox = ({ title }: { title: string }) => {
  return (
    <Label text={title}
           width='40px'
           paddingVertical='10px'
           textAlign='center'
           textColor='#809da9'
           bgColor='#212628'/>
  )
}

/*
==============================
Block 1
==============================
*/
const block1CSSTxt = `###### css-modules
\`\`\`css
.vstack {
  background-color: #3a7c7b;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0px;
  width: 500px;
  height: 250px;
}

.hstack {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 0px;
  width: 100%;
}

.blackbox {
  background-color: #212628;
  padding-top: 10px;
  padding-bottom: 10px;
  text-align: center;
  color: #809da9;
  width: 40px;
}

.spacer {
  flex-grow: 1;
  width: 40px;
}
\`\`\`
###### jsx-module
\`\`\`tsx
const App = () => {
  return (
    <div className='vstack'>
      <p className='blackbox'>1</p>

      <div className='hstack'>
        <p className='blackbox'>1</p>
        <div className='spacer'/>
        <p className='blackbox'>1</p>
      </div>

      <div className='hstack'>
        <div className='spacer'/>
        <p className='blackbox'>1</p>
        <div className='spacer'/>
        <p className='blackbox'>2</p>
        <div className='spacer'/>
        <p className='blackbox'>1</p>
        <div className='spacer'/>
      </div>

      <div className='hstack'>
        <p className='blackbox'>1</p>
        <div className='spacer'/>
        <p className='blackbox'>3</p>
        <div className='spacer'/>
        <p className='blackbox'>3</p>
        <div className='spacer'/>
        <p className='blackbox'>1</p>
      </div>
    </div>
  )
}
\`\`\``

const block1NoCSSTxt = `###### jsx-module
\`\`\`tsx
const App = () => {
  return (
    <VStack halign='center'
            valign='center'
            gap='0'
            bgColor='#3a7c7b'
            width='500px'
            height='250px'>
      <BlackBox title='1'/>

      <HStack halign='center'
              valign='center'
              gap='0'
              width='100%'>
        <BlackBox title='1'/>
        <Spacer width='40px'/>
        <BlackBox title='1'/>
      </HStack>

      <HStack halign='center'
              valign='center'
              gap='0'
              width='100%'>
        <Spacer width='40px'/>
        <BlackBox title='1'/>
        <Spacer width='40px'/>
        <BlackBox title='2'/>
        <Spacer width='40px'/>
        <BlackBox title='1'/>
        <Spacer width='40px'/>
      </HStack>

      <HStack halign='center'
              valign='center'
              gap='0'
              width='100%'>
        <BlackBox title='1'/>
        <Spacer width='40px'/>
        <BlackBox title='3'/>
        <Spacer width='40px'/>
        <BlackBox title='3'/>
        <Spacer width='40px'/>
        <BlackBox title='1'/>
      </HStack>
    </VStack>
  )
}

const BlackBox = ({ title }: { title: string }) => {
  return (
    <Label text={title}
           width='40px'
           paddingVertical='10px'
           textAlign='center'
           textColor='#809da9'
           bgColor='#212628'/>
  )
}
\`\`\``

/*
==============================
Block 2
==============================
*/
const block2CSSTxt = `###### css-modules
\`\`\`css
.vstack {
  background-color: #3a7c7b;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  box-sizing: border-box;
  gap: 10px;
  height: 250px;
  padding: 20px;
  width: 500px;
}

.hstack {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  box-sizing: border-box;
  gap: 10px;
  width: 100%;
}

.blackbox {
  background-color: #212628;
  padding-top: 10px;
  padding-bottom: 10px;
  text-align: center;
  color: #809da9;
  width: 40px;
}

.spacer {
  flex-grow: 1;
}
\`\`\`
###### jsx-module
\`\`\`tsx
const App = () => {
  return (
    <div className='vstack'>
      <div className='hstack'>
        <p className='blackbox'>1</p>
        <p className='blackbox'>2</p>
        <p className='blackbox'>3</p>
        <p className='blackbox'>4</p>
        <div className='spacer'/>
        <p className='blackbox'>5</p>
      </div>

      <div className='hstack'>
        <p className='blackbox'>1</p>
        <p className='blackbox'>2</p>
        <div className='spacer'/>
        <p className='blackbox'>3</p>
        <div className='spacer'/>
        <p className='blackbox'>4</p>
        <p className='blackbox'>5</p>
      </div>

      <div className='hstack'>
        <p className='blackbox'>1</p>
        <div className='spacer'/>
        <p className='blackbox'>2</p>
        <div className='spacer'/>
        <p className='blackbox'>3</p>
        <div className='spacer'/>
        <p className='blackbox'>4</p>
        <div className='spacer'/>
        <p className='blackbox'>5</p>
      </div>
    </div>
  )
}
\`\`\``

const block2NoCSSTxt = `###### jsx-module
\`\`\`tsx
const App = () => {
  return (
    <VStack valign='center'
            bgColor='#3a7c7b'
            width='500px'
            height='250px'
            padding='20px'>
      <HStack width='100%'>
        <BlackBox title='1'/>
        <BlackBox title='2'/>
        <BlackBox title='3'/>
        <BlackBox title='4'/>
        <Spacer/>
        <BlackBox title='5'/>
      </HStack>

      <HStack width='100%'>
        <BlackBox title='1'/>
        <BlackBox title='2'/>
        <Spacer/>
        <BlackBox title='3'/>
        <Spacer/>
        <BlackBox title='4'/>
        <BlackBox title='5'/>
      </HStack>

      <HStack width='100%'>
        <BlackBox title='1'/>
        <Spacer/>
        <BlackBox title='2'/>
        <Spacer/>
        <BlackBox title='3'/>
        <Spacer/>
        <BlackBox title='4'/>
        <Spacer/>
        <BlackBox title='5'/>
      </HStack>
    </VStack>
  )
}

const BlackBox = ({ title }: { title: string }) => {
  return (
    <Label text={title}
           width='40px'
           paddingVertical='10px'
           textAlign='center'
           textColor='#809da9'
           bgColor='#212628'/>
  )
}
\`\`\``
