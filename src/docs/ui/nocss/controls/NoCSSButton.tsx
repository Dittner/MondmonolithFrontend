import React, { useState } from 'react'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-markup'
import { Label } from '../../common/Label'
import { type NoCSSPageTheme } from '../NoCSSPage'
import { MarkdownBlock, NoCSSControlView } from './NoCSSControlView'
import { Button, type ButtonProps } from '../../common/Button'

export const NoCSSButton = ({ theme }: { theme: NoCSSPageTheme }) => {
  console.log('new NoCSSButton')
  const [isSelected, setSelected] = useState(true)

  return <NoCSSControlView controlLink='button'
                           theme={theme}
                           title='Button'
                           subTitle='<button>'>

    <MarkdownBlock title="1. Default and custom button"
                   cssText={block1CSSTxt}
                   noCSSText={block1NoCSSTxt}
                   theme={theme}>
      <Button title='Template'/>

      <Button title='Template Disabled'
              disabled/>

      <Button title='Custom Btn'
              textColor='#ebcdef'
              bgColor='#8851ae'
              paddingHorizontal='12px'
              cornerRadius='5px'
              borderColor='#8851ae'
              hoverState={state => {
                state.bgColor = '#673e83'
              }}/>

      <Button title='Custom Btn Disabled'
              textColor='#ff0000'
              bgColor='#ff0000'
              paddingHorizontal='12px'
              cornerRadius='5px'
              borderColor='#ff0000'
              hoverState={state => {
                state.bgColor = '#ff0000'
              }}
              disabledState={state => {
                state.opacity = '1'
                state.bgColor = '0'
                state.textColor = '#888888'
                state.borderColor = '#888888'
              }}
              disabled/>

    </MarkdownBlock>

    <MarkdownBlock title="2. Selectable button"
                   cssText={block2CSSTxt}
                   noCSSText={block2NoCSSTxt}
                   theme={theme}>
      <Button title='Selectable Template Btn'
              isSelected={isSelected}
              onClick={() => {
                setSelected(!isSelected)
              }}/>

      <Button title='Selectable Custom Btn'
              isSelected={isSelected}
              textColor='#ebcdef'
              bgColor='#8851ae'
              paddingHorizontal='12px'
              cornerRadius='5px'
              borderColor='#8851ae'
              hoverState={state => {
                state.bgColor = '#673e83'
              }}
              selectedState={state => {
                state.borderColor = '#ebcdef'
                state.bgColor = '#673e83'
              }}
              onClick={() => {
                setSelected(!isSelected)
              }}/>

      <Label width='100%'
             textAlign='right'
             text={isSelected ? 'Selected' : 'Not selected'}
             textColor={isSelected ? '#dca83a' : '#888888'}/>

    </MarkdownBlock>

    <MarkdownBlock title="3. Title with icon"
                   cssText={block3CSSTxt}
                   noCSSText={block3NoCSSTxt}
                   theme={theme}>

      <Button textColor='#ebcdef'
              bgColor='#8851ae'
              paddingHorizontal='12px'
              cornerRadius='5px'
              borderColor='#8851ae'
              hoverState={state => {
                state.bgColor = '#673e83'
              }}>
        <span className="icon-download"/>
        <span>  Download</span>
      </Button>

    </MarkdownBlock>

    <MarkdownBlock title="4. Inheritance"
                   cssText={block4CSSTxt}
                   noCSSText={block4NoCSSTxt}
                   theme={theme}>
      <Btn title='Btn'/>
      <SBtn title='S-Btn'/>
      <MBtn title='M-Btn'/>
      <LBtn title='L-Btn'/>
      <XLBtn title='XL-Btn'/>
    </MarkdownBlock>
  </NoCSSControlView>
}

const Btn = (props: ButtonProps) => {
  return (
    <Button textColor='#ebcdef'
            bgColor='0'
            fontSize='14px'
            paddingHorizontal='none'
            padding='8px'
            hoverState={state => {
              state.textDecoration = 'underline'
            }}
            {...props}/>
  )
}

const SBtn = (props: ButtonProps) => {
  return (
    <Btn textColor='#ebcdef'
         bgColor='#8851ae'
         cornerRadius='5px'
         borderColor='#8851ae'
         hoverState={state => {
           state.bgColor = '#673e83'
         }}
         {...props}/>
  )
}

const MBtn = (props: ButtonProps) => {
  return (
    <SBtn fontSize='18px'
          padding='12px'
          {...props}/>
  )
}

const LBtn = (props: ButtonProps) => {
  return (
    <MBtn textColor='#ffFFff'
          fontSize='24px'
          padding='20px'
          {...props}/>
  )
}

const XLBtn = (props: ButtonProps) => {
  return (
    <LBtn fontSize='32px'
          padding='32px'
          bgColor='#ae51a9'
          hoverState={state => {
            state.bgColor = '#874083'
          }}
          {...props}/>
  )
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
.btn_template_disabled {
  background-color: #3a4448;
  cursor: not-allowed;
  opacity: 0.5;
  padding-left: 10px;
  padding-right: 10px;
  color: #eeEEee;
}

.btn_custom {
  color: #ebcdef;
  background-color: #8851ae;
  padding-left: 12px;
  padding-right: 12px;
  border-radius: 5px;
  border: 1px solid #8851ae;
}
.btn_custom:hover {
  background-color: #673e83;
}
.btn_custom_disabled {
  background-color: 0;
  border: 1px solid #888888;
  border-radius: 5px;
  cursor: not-allowed;
  padding-left: 12px;
  padding-right: 12px;
  color:#888888;
}
\`\`\`
###### jsx-module
\`\`\`tsx
const App = () => {
  return (
    <button className='btn_template'>
      Template
    </button>
    <button className='btn_template_disabled'>
      Template Disabled
    </button>
    <button className='btn_custom'>
      Custom Btn
    </button>
    <button className='btn_custom_disabled'>
      Custom Btn Disabled
    </button>
  )
}
\`\`\``

const block1NoCSSTxt = `###### tsx-module
\`\`\`tsx
const App = () => {
  return (
    <Button title='Template'/>

    <Button title='Template Disabled'
            disabled/>

    <Button title='Custom Btn'
            textColor='#ebcdef'
            bgColor='#8851ae'
            paddingHorizontal='12px'
            cornerRadius='5px'
            borderColor='#8851ae'
            hoverState={state => {
              state.bgColor = '#673e83'
            }}/>

    <Button title='Custom Btn Disabled'
            textColor='#ff0000'
            bgColor='#ff0000'
            paddingHorizontal='12px'
            cornerRadius='5px'
            borderColor='#ff0000'
            hoverState={state => {
              state.bgColor = '#ff0000'
            }}
            disabledState={state => {
              state.opacity = '1'
              state.bgColor = '0'
              state.textColor = '#888888'
              state.borderColor = '#888888'
            }}
            disabled/>
  )
}
\`\`\``

/*
==============================
Block 2
==============================
*/
const block2CSSTxt = `###### css-module
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

.btn_custom {
  color: #ebcdef;
  background-color: #8851ae;
  padding-left: 12px;
  padding-right: 12px;
  border-radius: 5px;
  border: 1px solid #8851ae;
}
.btn_custom:hover {
  background-color: #673e83;
}
.btn_custom_selected {
  background-color: #673e83;
  border: 1px solid #ebcdef;
  border-radius: 5px;
  padding-left: 12px;
  padding-right: 12px;
  color:#ebcdef;
}
.lbl_status {
  width: 100%;  
  text-align: right;
  color: #888888;
}
.lbl_status_selected {
  width: 100%;  
  text-align: right;
  color: #dca83a;
}
\`\`\`
###### jsx-module
\`\`\`tsx
const App = () => {
  const [isSelected, setSelected] = useState(true)
  return (
    <button 
      className={isSelected ? 'btn_template_selected' : 'btn_template'}
      onClick={() => { setSelected(!isSelected) }}>
      Selectable Template Btn
    </button>
    <button 
      className={isSelected ? 'btn_custom_selected' : 'btn_custom'}
      onClick={() => { setSelected(!isSelected) }}>
      Selectable Custom Btn
    </button>
    <p 
      className={isSelected ? 'lbl_status_selected' : 'lbl_status'}>
      Selectable Custom Btn
    </p>
  )
}
\`\`\``

const block2NoCSSTxt = `###### tsx-module
\`\`\`tsx
const App = () => {
  const [isSelected, setSelected] = useState(true)
  return (
    <Button title='Selectable Template Btn'
            isSelected={isSelected}
            onClick={() => {
              setSelected(!isSelected)
            }}/>

    <Button title='Selectable Custom Btn'
            isSelected={isSelected}
            textColor='#ebcdef'
            bgColor='#8851ae'
            paddingHorizontal='12px'
            cornerRadius='5px'
            borderColor='#8851ae'
            hoverState={state => {
              state.bgColor = '#673e83'
            }}
            selectedState={state => {
              state.borderColor = '#ebcdef'
              state.bgColor = '#673e83'
            }}
            onClick={() => {
              setSelected(!isSelected)
            }}/>

    <Label width='100%'
           textAlign='right'
           text={isSelected ? 'Selected' : 'Not selected'}
           textColor={isSelected ? '#dca83a' : '#888888'}/>
  )
}
\`\`\``
/*
==============================
Block 3
==============================
*/
const block3CSSTxt = `###### css-module
\`\`\`css
.btn_custom {
  color: #ebcdef;
  background-color: #8851ae;
  padding-left: 12px;
  padding-right: 12px;
  border-radius: 5px;
  border: 1px solid #8851ae;
}
.btn_custom:hover {
  background-color: #673e83;
}
\`\`\`
###### jsx-module
\`\`\`tsx
const App = () => {
  return (
    <button className='btn_custom'>
      <span className="icon-download"/>
      <span>  Download</span>
    </button>
  )
}
\`\`\``

const block3NoCSSTxt = `###### tsx-module
\`\`\`tsx
const App = () => {
  return (
    <Button textColor='#ebcdef'
            bgColor='#8851ae'
            paddingHorizontal='12px'
            cornerRadius='5px'
            borderColor='#8851ae'
            hoverState={state => {
              state.bgColor = '#673e83'
            }}>
      <span className="icon-download"/>
      <span>  Download</span>
    </Button>
  )
}
\`\`\``

/*
==============================
Block 4
==============================
*/
const block4CSSTxt = `###### css-modules
\`\`\`css
.btn {
  font-size: 14px;
  color: #ebcdef;
  padding: 8px;
  textDecoration = none
}
.btn:hover {
  textDecoration = underline
}

.btn_s {
  background-color: #8851ae;
  border-radius: 5px;
  border: 1px solid #8851ae;
}
.btn_s:hover {
  background-color: #673e83;
}

.btn_m {
  font-size: 18px;
  padding: 12px;
}

.btn_l {
  color: #ffFFff;
  font-size: 24px;
  padding: 20px;
}

.btn_xl {
  font-size: 32px;
  padding: 32px;
  background-color: #ae51a9;
}
.btn_xl:hover {
  background-color: #874083;
}
\`\`\`
###### jsx-module
\`\`\`tsx
const App = () => {
  return (
    <button className='btn'>
      Btn
    </button>
    <button className='btn btn_s'>
      S-Btn
    </button>
    <button className='btn btn_s btn_m'>
      M-Btn
    </button>
    <button className='btn btn_s btn_m btn_l'>
      L-Btn
    </button>
    <button className='btn btn_s btn_m btn_l btn_xl'>
      XL-Btn
    </button>
  )
}
\`\`\``

const block4NoCSSTxt = `###### tsx-modules
\`\`\`tsx
const Btn = (props: ButtonProps) => {
  return (
    <Button textColor='#ebcdef'
            bgColor='0'
            paddingHorizontal='none'
            padding='8px'
            fontSize='14px'
            hoverState={state => {
              state.textDecoration = 'underline'
            }}
            {...props}/>
  )
}

const SBtn = (props: ButtonProps) => {
  return (
    <Btn bgColor='#8851ae'
         cornerRadius='5px'
         borderColor='#8851ae'
         hoverState={state => {
           state.bgColor = '#673e83'
         }}
         {...props}/>
  )
}

const MBtn = (props: ButtonProps) => {
  return (
    <SBtn fontSize='18px'
          padding='12px'
          {...props}/>
  )
}

const LBtn = (props: ButtonProps) => {
  return (
    <MBtn textColor='#ffFFff'
          fontSize='24px'
          padding='20px'
          {...props}/>
  )
}

const XLBtn = (props: ButtonProps) => {
  return (
    <LBtn fontSize='32px'
          padding='32px'
          bgColor='#ae51a9'
          hoverState={state => {
            state.bgColor = '#874083'
          }}
          {...props}/>
  )
}

const App = () => {
  return (
    <Btn title='Btn'/>
    <SBtn title='S-Btn'/>
    <MBtn title='M-Btn'/>
    <LBtn title='L-Btn'/>
    <XLBtn title='XL-Btn'/>
  )
}
\`\`\``
