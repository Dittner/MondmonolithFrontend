import React, { useState } from 'react'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-markup'
import { Label } from '../../common/Label'
import { type NoCSSPageTheme } from '../NoCSSPage'
import { MarkdownBlock, NoCSSControlView } from './NoCSSControlView'
import { HStack, VStack } from '../../common/Container'
import { TextInput, type TextInputProps, TextArea } from '../../common/Input'

export const NoCSSInput = ({ theme }: { theme: NoCSSPageTheme }) => {
  console.log('new NoCSSInput')
  const [enteredName, setEnteredName] = useState('')
  const [enteredPwd, setEnteredPwd] = useState('')
  const [nameProtocol] = useState({ value: '' })
  const [pwdProtocol] = useState({ value: '' })

  const submit = () => {
    setEnteredName(nameProtocol.value)
    setEnteredPwd(pwdProtocol.value)
  }

  return <NoCSSControlView controlLink='input'
                           theme={theme}
                           title='Input'
                           subTitle='<input> | <textarea>'>

    <MarkdownBlock title="1. TextInput"
                   cssText={block1CSSTxt}
                   noCSSText={block1NoCSSTxt}
                   theme={theme}>
      <VStack>
        <HStack valign='base'>
          <Label text='Login:'
                 width='150px'
                 textColor='#626b75'/>

          <CustomInput placeholder='Enter your name'
                       protocol={nameProtocol}
                       onSubmitted={submit}/>

          <Label text={enteredName}
                 textColor='#dca83a'/>
        </HStack>

        <HStack valign='base'>
          <Label text='Password:'
                 width='150px'
                 textColor='#626b75'/>

          <CustomInput type='password'
                       protocol={pwdProtocol}
                       placeholder='Enter password'
                       onSubmitted={submit}/>

          <Label text={enteredPwd}
                 textColor='#dca83a'/>
        </HStack>
      </VStack>

    </MarkdownBlock>

    <MarkdownBlock title="2. TextArea"
                   cssText={block2CSSTxt}
                   noCSSText={block2NoCSSTxt}
                   theme={theme}>

      <CustomTextArea/>

    </MarkdownBlock>
  </NoCSSControlView>
}

export const CustomTextArea = (props: TextInputProps) => {
  const [numOfSymbols, setNumOfSymbols] = useState(0)
  const onTextAreaChanged = (value: string) => {
    setNumOfSymbols(value.length)
  }
  return (
    <HStack valign='bottom'>
      <TextArea width='400px'
                placeholder='Enter multiline text'
                textColor='#c3d2de'
                caretColor='#ffFFff'
                bgColor='#272c2f'
                rows={7}
                border='2px solid #35414a'
                cornerRadius='5px'
                focusState={state => {
                  state.border = '2px solid #5b9dcf'
                }}
                placeholderState={state => {
                  state.textColor = '#83a6b4'
                }}
                onChange={onTextAreaChanged}
                {...props}/>

      <Label text={numOfSymbols > 0 ? numOfSymbols + ' symbols' : ''}
             textColor='#dca83a'/>
    </HStack>
  )
}

export const CustomInput = (props: TextInputProps) => {
  return (
    <TextInput width='200px'
               textColor='#c3d2de'
               caretColor='#ffFFff'
               bgColor='#272c2f'
               border='2px solid #35414a'
               cornerRadius='5px'
               focusState={state => {
                 state.border = '2px solid #5b9dcf'
               }}
               placeholderState={state => {
                 state.textColor = '#83a6b4'
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
.vstack {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  box-sizing: border-box;
  gap: 10px;
  width: 100%;
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

.lbl {
  color: #626b75;
}

.lbl_result {
  color: #dca83a;
}

.text_input {
  font-size: 1rem;
  width: 200px;
  min-height: 35px;
  padding: 10px;
  color: #c3d2de;
  background-color: #272c2f;
  caret-color: #ffFFff;
  border: 2px solid #35414a;
  border-radius: 5px;
}
.text_input:focus {
  border: 2px solid #5b9dcf;
}
.text_input::placeholder {
  color: #83a6b4;
}
\`\`\`
###### jsx-module
\`\`\`tsx
const App = () => {
  const [enteredName, setEnteredName] = useState('')
  const [enteredPwd, setEnteredPwd] = useState('')
  const [nameProtocol] = useState({ value: '' })
  const [pwdProtocol] = useState({ value: '' })

  const submit = () => {
    setEnteredName(nameProtocol.value)
    setEnteredPwd(pwdProtocol.value)
  }
  
  return (
    <div className='vstack'>
      <div className='hstack'>
        <p className='lbl'>Login:</p>

        <input class="text_input" 
               type="text"
               placeholder="Enter your name" 
               autocorrect="off" 
               autocomplete="off"
               onChange={e => {
                 nameProtocol.value = e.currentTarget.value
               }}>

        <p className='result'>{enteredName.value}</p>
      </div>
      
      <div className='hstack'>
        <p className='lbl'>Password:</p>

        <input class="text_input" 
               type="password"
               placeholder="Enter password" 
               autocorrect="off" 
               autocomplete="off"
               onChange={e => {
                 pwdProtocol.value = e.currentTarget.value
               }}>

        <p className='result'>{enteredPwd.value}</p>
      </div>
    </div>
  )
}
\`\`\``

const block1NoCSSTxt = `###### tsx-modules
\`\`\`tsx
const App = () => {
  const [enteredName, setEnteredName] = useState('')
  const [enteredPwd, setEnteredPwd] = useState('')
  const [nameProtocol] = useState({ value: '' })
  const [pwdProtocol] = useState({ value: '' })

  const submit = () => {
    setEnteredName(nameProtocol.value)
    setEnteredPwd(pwdProtocol.value)
  }
  
  return (
    <VStack>
      <HStack valign='base'>
        <Label text='Login:'
               width='150px'
               textColor='#626b75'/>

        <CustomInput placeholder='Enter your name'
                     protocol={nameProtocol}
                     onSubmitted={submit}/>

        <Label text={enteredName}
               textColor='#dca83a'/>
      </HStack>

      <HStack valign='base'>
        <Label text='Password:'
               width='150px'
               textColor='#626b75'/>

        <CustomInput type='password'
                     protocol={pwdProtocol}
                     placeholder='Enter password'
                     onSubmitted={submit}/>

        <Label text={enteredPwd}
               textColor='#dca83a'/>
      </HStack>
    </VStack>
  )
}

export const CustomInput = (props: InputProps) => {
  return (
    <TextInput width='200px'
               textColor='#c3d2de'
               caretColor='#ffFFff'
               bgColor='#272c2f'
               border='2px solid #35414a'
               cornerRadius='5px'
               focusState={state => {
                 state.border = '2px solid #5b9dcf'
               }}
               placeholderState={state => {
                  state.textColor = '#83a6b4'
               }}
               {...props}/>
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
.multiline_input {
  font-size: 1rem;
  width: 400px;
  min-height: 35px;
  padding: 10px;
  color: #c3d2de;
  background-color: #272c2f;
  caret-color: #ffFFff;
  border: 2px solid #35414a;
  border-radius: 5px;
}
.multiline_input:focus {
  border: 2px solid #5b9dcf;
}
.multiline_input::placeholder {
  color: #83a6b4;
}

.hstack {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: center;
  box-sizing: border-box;
  gap: 10px;
}

.lbl {
  color: #626b75;
}
\`\`\`
###### jsx-module
\`\`\`tsx
const App = () => {
  const [numOfSymbols, setNumOfSymbols] = useState(0)
  const onTextAreaChanged = (value: string) => {
    setNumOfSymbols(value.length)
  }
  
  return (
    <div className='hstack'>
      <textarea class="multiline_input" 
                rows={7}
                placeholder="Enter multiline text" 
                autocorrect="off" 
                autocomplete="off"
                onChange={onTextAreaChanged}>

      <p className='lbl'>
        {numOfSymbols > 0 ? numOfSymbols + ' symbols' : ''}
      </p>
    </div>
  )
}
\`\`\``

const block2NoCSSTxt = `###### jsx-module
\`\`\`tsx
const App = () => {
  const [numOfSymbols, setNumOfSymbols] = useState(0)
  const onTextAreaChanged = (value: string) => {
    setNumOfSymbols(value.length)
  }
  
  return (
    <HStack valign='bottom'>
      <TextArea width='400px'
                placeholder='Enter multiline text'
                textColor='#c3d2de'
                caretColor='#ffFFff'
                bgColor='#272c2f'
                rows={7}
                border='2px solid #35414a'
                cornerRadius='5px'
                focusState={state => {
                  state.border = '2px solid #5b9dcf'
                }}
                placeholderState={state => {
                  state.textColor = '#83a6b4'
                }}
                onChange={onTextAreaChanged}/>

      <Label text={numOfSymbols > 0 ? numOfSymbols + ' symbols' : ''}
             textColor='#dca83a'/>
    </HStack>
  )
}
\`\`\``
