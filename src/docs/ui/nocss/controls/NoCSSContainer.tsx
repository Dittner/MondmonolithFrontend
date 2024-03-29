import React, { useState } from 'react'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-markup'
import { Label } from '../../common/Label'
import { type NoCSSPageTheme } from '../NoCSSPage'
import { MarkdownBlock, NoCSSControlView } from './NoCSSControlView'
import { Button } from '../../common/Button'
import { HStack, type StackHAlign, type StackProps, type StackVAlign, VStack } from '../../common/Container'
import { Rectangle } from '../../common/Rectangle'

export const NoCSSContainer = ({ theme }: { theme: NoCSSPageTheme }) => {
  console.log('new NoCSSContainer')
  const [valign, setValign] = useState<StackVAlign>('center')
  const [halign, setHalign] = useState<StackHAlign>('center')
  const valignValues = Array.of<StackVAlign>('top', 'center', 'bottom', 'stretch')
  const halignValues = Array.of<StackHAlign>('left', 'center', 'right', 'stretch')
  const [layout, setLayout] = useState<StackLayout>('horizontal')

  const switchLayout = () => {
    if (layout === 'horizontal') { setLayout('vertical') } else { setLayout('horizontal') }
  }

  return <NoCSSControlView controlLink='container'
                           theme={theme}
                           title='Container'
                           subTitle='<div>'>

    <MarkdownBlock title="1. VStack"
                   cssText={block1CSSTxt}
                   noCSSText={block1NoCSSTxt}
                   theme={theme}>
      <VStack halign='stretch'
              valign='top'
              gap='10px'
              width='150px'>
        <Label text='Horizontal alignment:'
               textColor={theme.gray}/>

        {halignValues.map(align => {
          return <Button key={align}
                         title={align}
                         isSelected={halign === align}
                         onClick={() => {
                           setHalign(align)
                         }}/>
        })}
      </VStack>

      <VStack halign='stretch'
              valign='top'
              gap='10px'
              width='150px'>
        <Label text='Vertical alignment:'
               textColor={theme.gray}/>

        {valignValues.map(align => {
          return <Button key={align}
                         title={align}
                         isSelected={valign === align}
                         onClick={() => {
                           setValign(align)
                         }}/>
        })}
      </VStack>

      <VStack halign={halign}
              valign={valign}
              gap='10px'
              width='300px'
              height='250px'
              marginHorizontal='20px'
              bgColor='#3a7c7b'>
        <BlackBox/>
        <BlackBox/>
        <BlackBox/>
      </VStack>

    </MarkdownBlock>

    <MarkdownBlock title="2. HStack"
                   cssText={block2CSSTxt}
                   noCSSText={block2NoCSSTxt}
                   theme={theme}>
      <VStack halign='stretch'
              valign='top'
              gap='10px'
              width='150px'>
        <Label text='Horizontal alignment:'
               textColor={theme.gray}/>

        {halignValues.map(align => {
          return <Button key={align}
                         title={align}
                         isSelected={halign === align}
                         onClick={() => {
                           setHalign(align)
                         }}/>
        })}
      </VStack>

      <VStack halign='stretch'
              valign='top'
              gap='10px'
              width='150px'>
        <Label text='Vertical alignment:'
               textColor={theme.gray}/>

        {valignValues.map(align => {
          return <Button key={align}
                         title={align}
                         isSelected={valign === align}
                         onClick={() => {
                           setValign(align)
                         }}/>
        })}
      </VStack>

      <HStack halign={halign}
              valign={valign}
              gap='10px'
              width='300px'
              height='250px'
              marginHorizontal='20px'
              bgColor='#3a7c7b'>
        <BlackBox/>
        <BlackBox/>
        <BlackBox/>
      </HStack>

    </MarkdownBlock>

    <MarkdownBlock title="3. How can we change a stack alignment at runtime?"
                   cssText={block3CSSTxt}
                   noCSSText={block3NoCSSTxt}
                   theme={theme}>

      <VStack width='300px'>
        <Stack layout={layout}
               halign='center'
               valign='center'
               width='100%'
               height='250px'
               bgColor='#3a7c7b'>
          <BlackBox/>
          <BlackBox/>
          <BlackBox/>
        </Stack>

        <Button title='Switch alignment'
                width='100%'
                onClick={switchLayout}/>
      </VStack>
    </MarkdownBlock>

  </NoCSSControlView>
}

const BlackBox = () => {
  return (
    <Rectangle bgColor='#212628' padding='25px'/>
  )
}

type StackLayout = 'horizontal' | 'vertical'

interface LayoutProps extends StackProps {
  layout: StackLayout
}

const Stack = (props: LayoutProps) => {
  if (props.layout === 'horizontal') {
    return <HStack {...props}>{props.children}</HStack>
  } else {
    return <VStack {...props}>{props.children}</VStack>
  }
}

/*
==============================
Block 1
==============================
*/
const block1CSSTxt = `###### css-modules
\`\`\`css
.btn_template {
  background-color: #3a4448;
  padding-left: 10px;
  padding-right: 10px;
  color: #eeEEee;
}
.btn_template:hover {
  background-color: #212628;
}
.btn_template_selected {
  background-color: #212628;
  padding-left: 10px;
  padding-right: 10px;
  color: #eeEEee;
}

.lbl {
  color: #626b75;
}

.vstack_align_settings {
  align-items: stretch;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: flex-start;
  width: 150px;
}

.vstack_demo {
  align-items: center;
  background-color: #3a7c7b;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 250px;
  justify-content: center;
  margin-left: 20px;
  margin-right: 20px;
  width: 300px;
}
\`\`\`
###### tsx-module
\`\`\`tsx
const App = () => {
  const [valign, setValign] = useState<StackVAlign>('center')
  const [halign, setHalign] = useState<StackHAlign>('center')
  const valignValues = Array.of<StackVAlign>('top', 'center', 'bottom', 'stretch')
  const halignValues = Array.of<StackHAlign>('left', 'center', 'right', 'stretch')
  
  return (
    <div className='vstack_align_settings'>
      <p className='lbl'>Horizontal alignment</p>
      {halignValues.map(align => {
        return (
          <button key={align} 
            className={halign === align ? 'btn_template_selected' : 'btn_template'}
            onClick={() => { setHalign(align) }}>{align}
          </button>
      })})
    </div>

    <div className='vstack_align_settings'>
      <p className='lbl'>Vertical alignment</p>
      {valignValues.map(align => {
        return (
          <button key={align} 
            className={valign === align ? 'btn_template_selected' : 'btn_template'}
            onClick={() => { setHalign(align) }}>{align}
          </button>
      })})
    </div>

    <div className='vstack_demo'>
      <BlackBox/>
      <BlackBox/>
      <BlackBox/>
    </div>
  )
}
\`\`\``

const block1NoCSSTxt = `###### tsx-module
\`\`\`tsx
const App = () => {
  const [valign, setValign] = useState<StackVAlign>('center')
  const [halign, setHalign] = useState<StackHAlign>('center')
  const valignValues = Array.of<StackVAlign>('top', 'center', 'bottom', 'stretch')
  const halignValues = Array.of<StackHAlign>('left', 'center', 'right', 'stretch')
  
  return (
    <VStack halign='stretch' 
            valign='top' 
            gap='10px'
            width='150px'>
      <Label text='Horizontal alignment:'
             textColor='#626b75'/>

      {halignValues.map(align => {
        return <Button key={align}
                       title={align}
                       isSelected={halign === align}
                       onClick={() => {setHalign(align)}}/>
      })}
    </VStack>

    <VStack halign='stretch' 
            valign='top' 
            gap='10px'
            width='150px'>
      <Label text='Vertical alignment:'
             textColor='#626b75'/>

      {valignValues.map(align => {
        return <Button key={align}
                       title={align}
                       isSelected={valign === align}
                       onClick={() => {setValign(align)}}/>
      })}
    </VStack>

    <VStack halign={halign} 
            valign={valign} 
            gap='10px'
            width='300px' 
            height='250px' 
            marginHorizontal='20px'
            bgColor='#3a7c7b'>
      <BlackBox/>
      <BlackBox/>
      <BlackBox/>
    </VStack>
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
.btn_template {
  background-color: #3a4448;
  padding-left: 10px;
  padding-right: 10px;
  color: #eeEEee;
}
.btn_template:hover {
  background-color: #212628;
}
.btn_template_selected {
  background-color: #212628;
  padding-left: 10px;
  padding-right: 10px;
  color: #eeEEee;
}

.lbl {
  color: #626b75;
}

.vstack_align_settings {
  align-items: stretch;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: flex-start;
  width: 150px;
}

.hstack_demo {
  align-items: center;
  background-color: #3a7c7b;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  gap: 10px;
  height: 250px;
  justify-content: center;
  margin-left: 20px;
  margin-right: 20px;
  width: 300px;
}
\`\`\`
###### tsx-module
\`\`\`tsx
const App = () => {
  const [valign, setValign] = useState<StackVAlign>('center')
  const [halign, setHalign] = useState<StackHAlign>('center')
  const valignValues = Array.of<StackVAlign>('top', 'center', 'bottom', 'stretch')
  const halignValues = Array.of<StackHAlign>('left', 'center', 'right', 'stretch')
  
  return (
    <div className='vstack_align_settings'>
      <p className='lbl'>Horizontal alignment</p>
      {halignValues.map(align => {
        return (
          <button key={align} 
            className={halign === align ? 'btn_template_selected' : 'btn_template'}
            onClick={() => { setHalign(align) }}>{align}
          </button>
      })})
    </div>

    <div className='vstack_align_settings'>
      <p className='lbl'>Vertical alignment</p>
      {valignValues.map(align => {
        return (
          <button key={align} 
            className={valign === align ? 'btn_template_selected' : 'btn_template'}
            onClick={() => { setHalign(align) }}>{align}
          </button>
      })})
    </div>

    <div className='hstack_demo'>
      <BlackBox/>
      <BlackBox/>
      <BlackBox/>
    </div>
  )
}
\`\`\``

const block2NoCSSTxt = `###### tsx-module
\`\`\`tsx
const App = () => {
  const [valign, setValign] = useState<StackVAlign>('center')
  const [halign, setHalign] = useState<StackHAlign>('center')
  const valignValues = Array.of<StackVAlign>('top', 'center', 'bottom', 'stretch')
  const halignValues = Array.of<StackHAlign>('left', 'center', 'right', 'stretch')
  
  return (
    <VStack halign='stretch' 
            valign='top' 
            gap='10px'
            width='150px'>
      <Label text='Horizontal alignment:'
             textColor='#626b75'/>

      {halignValues.map(align => {
        return <Button key={align}
                       title={align}
                       isSelected={halign === align}
                       onClick={() => {setHalign(align)}}/>
      })}
    </VStack>

    <VStack halign='stretch' 
            valign='top' 
            gap='10px'
            width='150px'>
      <Label text='Vertical alignment:'
             textColor='#626b75'/>

      {valignValues.map(align => {
        return <Button key={align}
                       title={align}
                       isSelected={valign === align}
                       onClick={() => {setValign(align)}}/>
      })}
    </VStack>

    <HStack halign={halign} 
            valign={valign} 
            gap='10px'
            width='300px' 
            height='250px' 
            marginHorizontal='20px'
            bgColor='#3a7c7b'>
      <BlackBox/>
      <BlackBox/>
      <BlackBox/>
    </HStack>
  )
}
\`\`\``

/*
==============================
Block 3
==============================
*/
const block3CSSTxt = `###### css-modules
\`\`\`css
.vstack_cont {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  box-sizing: border-box;
  gap: 10px;
  width: 300px;
}

.btn_template {
  width: 100%;
  background-color: #3a4448;
  padding-left: 10px;
  padding-right: 10px;
  color: #eeEEee;
}
.btn_template:hover {
  background-color: #212628;
}
.btn_template_selected {
  background-color: #212628;
  padding-left: 10px;
  padding-right: 10px;
  color: #eeEEee;
}

.stack {
  align-items: center;
  background-color: #3a7c7b;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 250px;
  justify-content: center;
  margin-left: 20px;
  margin-right: 20px;
  width: 100%;
}

.stack_vertical {
  flex-direction: column;
}

.stack_horizontal {
  flex-direction: row;
}
\`\`\`
###### tsx-module
\`\`\`tsx
const App = () => {
  const [layout, setLayout] = useState<StackLayout>('horizontal')
  
  const switchLayout = () => {
    if (layout === 'horizontal') 
      setLayout('vertical')
    else 
      setLayout('horizontal')
  }
  
  let stackClassName = 'stack '
  stackClassName += layout === 'horizontal' ? 'stack_horizontal' : 'stack_vertical'
  
  return (
    <div className='vstack_cont'>
      <div className={stackClassName}>
        <BlackBox/>
        <BlackBox/>
        <BlackBox/>
      </div>
      <button className='btn_template'
              onClick={switchLayout}>
        Switch alignment
      </button>
    </div>
  )
}
\`\`\``

const block3NoCSSTxt = `###### tsx-modules
\`\`\`tsx
type StackLayout = 'horizontal' | 'vertical'
interface LayoutProps extends StackProps {
  layout: StackLayout
}

const Stack = (props: LayoutProps) => {
  if (props.layout === 'horizontal') {
    return <HStack {...props}>{props.children}</HStack>
  } else {
    return <VStack {...props}>{props.children}</VStack>
  }
}

const App = () => {
  const [layout, setLayout] = useState<StackLayout>('horizontal')
  
  const switchLayout = () => {
    if (layout === 'horizontal') 
      setLayout('vertical')
    else 
      setLayout('horizontal')
  }
  
  return (
    <VStack width='300px'>
      <Stack layout={layout}
             halign='center'
             valign='center'
             width='100%'
             height='250px'
             bgColor='#3a7c7b'>
        <BlackBox/>
        <BlackBox/>
        <BlackBox/>
      </Stack>

      <Button title='Switch alignment'
              width='100%'
              onClick={switchLayout}/>
    </VStack>
  )
}
\`\`\``
