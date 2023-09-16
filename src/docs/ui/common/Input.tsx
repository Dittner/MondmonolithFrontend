import { type BorderStyle, buildClassName, type StylableComponentProps } from '../../application/NoCSS'
import { type Theme } from '../../application/ThemeManager'
import { useCallback, useEffect, useRef, useState } from 'react'
import { calcSpaceBefore, formatCode, formatIfTextIsCode } from './String++'
import { useDocsContext, useWindowSize } from '../../../App'
import * as React from 'react'
import { VStack } from './Container'
import { Label } from './Label'

/*
*
* INPUT
*
* */

export interface InputProtocol {
  value: string
}

type InputType = 'text' | 'number' | 'password' | 'email'
type TurnType = 'on' | 'off'

export interface TextInputProps extends StylableComponentProps {
  type?: InputType
  protocol?: InputProtocol
  text?: string
  fontSize?: string
  placeholder?: string
  caretColor?: string
  onChange?: ((value: string) => void) | undefined
  onSubmitted?: (() => void) | undefined
  autoFocus?: boolean
  autoCorrect?: TurnType
  autoComplete?: TurnType
  focusState?: (state: StylableComponentProps) => void
  placeholderState?: (state: StylableComponentProps) => void
}

const BaseInput = (props: TextInputProps) => {
  let className = buildClassName(props)
  if ('className' in props) className += ' ' + props.className

  const onKeyDown = (e: any) => {
    // Enter key
    if (props.onSubmitted && e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault()
      e.stopPropagation()
      props.onSubmitted()
    }
  }

  const inputRef = useCallback((input: HTMLInputElement) => {
    if (input && props.autoFocus) {
      setTimeout(() => {
        input.focus()
      }, 0)
    }
  }, [props.autoFocus])

  return (
    <input ref={inputRef}
           className={className}
           placeholder={props.placeholder}
           autoCorrect={props.autoCorrect}
           autoComplete={props.autoComplete}
           type={props.type}
           defaultValue={props.text ?? props.protocol?.value}
           onChange={e => {
             if (props.protocol) props.protocol.value = e.currentTarget.value
             props.onChange?.(e.currentTarget.value)
           }}
           onKeyDown={onKeyDown}/>
  )
}

const defInputProps = {
  type: 'text' as InputType,
  width: '150px',
  minHeight: '35px',
  caretColor: '#ffFFff',
  textColor: '#eeEEee',
  fontSize: '1rem',
  padding: '10px',
  autoCorrect: 'off' as TurnType,
  autoComplete: 'off' as TurnType,
  border: ['1px', 'solid', '#3a4448'] as [string, BorderStyle, string],
  focusState: (state: StylableComponentProps) => {
    state.border = ['1px', 'solid', '#eeEEee'] as [string, BorderStyle, string]
  }
}

export const TextInput = (props: TextInputProps) => {
  if ('visible' in props && !props.visible) return <></>

  console.log('new Input')
  return (
    <BaseInput type={defInputProps.type}
               width={defInputProps.width}
               minHeight={defInputProps.minHeight}
               padding={defInputProps.padding}
               caretColor={defInputProps.caretColor}
               fontSize={defInputProps.fontSize}
               border={defInputProps.border}
               autoCorrect={defInputProps.autoCorrect}
               autoComplete={defInputProps.autoComplete}
               focusState={defInputProps.focusState}
               {...props}/>
  )
}

/*
*
* InputForm
*
* */

export interface InputFormProps extends TextInputProps {
  title?: string
  titleSize?: string
  titleColor?: string
}

const defInputFormProps = (theme: Theme): any => {
  return {
    width: '100%',
    height: '35px',
    caretColor: theme.caretColor,
    textColor: theme.text,
    bgColor: theme.inputBg,
    titleSize: '0.9rem',
    titleColor: theme.green,
    fontSize: '1rem',
    padding: '10px',
    autoCorrect: 'off',
    autoComplete: 'off',
    border: ['1px', 'solid', theme.inputBorder],
    focusState: (state: StylableComponentProps) => {
      state.border = ['1px', 'solid', theme.inputBorderFocused]
    }
  }
}

export const InputForm = (props: InputFormProps) => {
  console.log('new InputForm')
  const theme = useDocsContext().theme
  const style = { ...defInputFormProps(theme), ...props }

  return (
    <VStack halign="left" valign="top" gap="0"
            width={style.width}>

      {style.title &&
        <Label className="ibm"
               fontSize={style.titleSize}
               width='100%'
               text={style.title}
               textColor={style.titleColor}
               paddingLeft="10px"/>
      }

      <BaseInput {...style}/>
    </VStack>
  )
}

/*
*
* TextArea
*
* */

interface TextAreaProps extends StylableComponentProps {
  text?: string
  rows?: number
  lineHeight?: string
  protocol?: InputProtocol
  placeholder?: string
  caretColor?: string
  autoFocus?: boolean
  autoCorrect?: TurnType
  autoComplete?: TurnType
  onChange?: ((value: string) => void) | undefined
  focusState?: (state: StylableComponentProps) => void
  placeholderState?: (state: StylableComponentProps) => void
}

const BaseTextArea = (props: TextAreaProps) => {
  const className = 'className' in props ? props.className + ' ' + buildClassName(props) : buildClassName(props)

  return <textarea className={className}
                   placeholder={props.placeholder}
                   value={props.text ?? props.protocol?.value}
                   autoFocus={props.autoFocus}
                   spellCheck="false"
                   rows={props.rows}
                   onChange={e => {
                     if (props.protocol) props.protocol.value = e.currentTarget.value
                     props.onChange?.(e.currentTarget.value)
                   }}/>
}

const defTextAreaProps = {
  type: 'text' as InputType,
  width: '150px',
  rows: 10,
  lineHeight: '1.5rem',
  caretColor: '#ffFFff',
  textColor: '#eeEEee',
  fontSize: '1rem',
  padding: '10px',
  autoCorrect: 'off' as TurnType,
  autoComplete: 'off' as TurnType,
  border: ['1px', 'solid', '#3a4448'] as [string, BorderStyle, string],
  focusState: (state: StylableComponentProps) => {
    state.border = ['1px', 'solid', '#eeEEee'] as [string, BorderStyle, string]
  }
}

export const TextArea = (props: TextAreaProps) => {
  if ('visible' in props && !props.visible) return <></>

  console.log('new TextArea')
  return (
    <BaseTextArea width={defTextAreaProps.width}
                  rows={defTextAreaProps.rows}
                  lineHeight={defTextAreaProps.lineHeight}
                  padding={defTextAreaProps.padding}
                  caretColor={defTextAreaProps.caretColor}
                  fontSize={defTextAreaProps.fontSize}
                  border={defTextAreaProps.border}
                  autoCorrect={defTextAreaProps.autoCorrect}
                  autoComplete={defTextAreaProps.autoComplete}
                  focusState={defTextAreaProps.focusState}
                  {...props}/>
  )
}

/*
*
* TextEditor
*
* */

class TextEditorController {
  static scrollToCursor(ta: HTMLTextAreaElement) {
    ta.blur()
    ta.focus()
  }

  static format(ta: HTMLTextAreaElement) {
    const value = ta.value

    try {
      const formattedCode = formatIfTextIsCode(value)
      if (formattedCode === value) return

      const scrollY = window.scrollY
      let selectionRow = value.slice(0, ta.selectionStart).split('\n').length
      let selectionStart = ta.selectionStart
      if (selectionRow > 0) {
        for (let i = 0; i < formattedCode.length; i++) {
          if (formattedCode.at(i) === '\n') {
            selectionRow--
            if (selectionRow === 0) {
              selectionStart = i
            }
          }
        }
      }

      ta.setSelectionRange(0, value.length)
      document.execCommand('insertText', false, formattedCode)
      ta.setSelectionRange(selectionStart, selectionStart)
      window.scrollTo(0, scrollY)
      TextEditorController.scrollToCursor(ta)
    } catch (e) {
      console.log('Error, while formatting code: ', e)
    }
  }

  static newLine(ta: HTMLTextAreaElement): boolean {
    const value = ta.value
    const selectionStart = ta.selectionStart

    const codeStartInd = value.lastIndexOf('```', selectionStart)
    const isCodeFragment = codeStartInd !== -1 && (/^```[a-zA-Z]+/.test(value.slice(codeStartInd, codeStartInd + 4)))
    const codeEndInd = value.indexOf('```', selectionStart)
    if (isCodeFragment && selectionStart > codeStartInd && selectionStart < codeEndInd) {
      let beginRowIndex = value.lastIndexOf('\n', selectionStart - 1)
      beginRowIndex = beginRowIndex !== -1 ? beginRowIndex : codeStartInd

      const row = value.slice(beginRowIndex + 1, selectionStart + 1) + '.\n'
      const beginRowSpaces = calcSpaceBefore(row)
      const formattedText = formatCode(row)
      let endRowSpaces = 0
      for (let i = formattedText.length - 3; i >= 0; i--) {
        const char = formattedText.charAt(i)
        if (char === ' ') {
          endRowSpaces++
        } else {
          break
        }
      }

      const spaces = '\n' + ' '.repeat(beginRowSpaces + endRowSpaces)
      // func setRangeText unfortunately clears browser history
      // ta.current.setRangeText(spaces, selectionStart, selectionStart, 'end')
      document.execCommand('insertText', false, spaces)
      TextEditorController.scrollToCursor(ta)
      return true
    }
    return false
  }

  static deleteAllSpacesBeforeCursor(ta: HTMLTextAreaElement): boolean {
    const value = ta.value
    const selectionStart = ta.selectionStart

    const deleteAllSpaces = (/\n {2,}$/.test(value.slice(0, selectionStart)))
    //console.log('deleteAllSpaces: ', deleteAllSpaces)
    if (deleteAllSpaces) {
      const firstSpaceIndex = value.lastIndexOf('\n', selectionStart - 1)
      if (firstSpaceIndex !== -1 && firstSpaceIndex + 1 < selectionStart) {
        ta.setSelectionRange(firstSpaceIndex + 1, selectionStart)
        document.execCommand('insertText', false, '')
        if (selectionStart === value.length) ta.setSelectionRange(ta.value.length - 1, ta.value.length - 1)
        return true
      }
    }
    return false
  }

  static adjustScroller(ta: HTMLTextAreaElement | undefined | null) {
    if (ta) {
      ta.style.height = 'inherit'
      ta.style.height = `${ta.scrollHeight + 5}px`
    }
  }

  static moveCursorToEndLine(ta: HTMLTextAreaElement | undefined | null) {
    if (ta) {
      const endOfTheLineIndex = ta.value.indexOf('\n', ta.selectionStart)
      if (endOfTheLineIndex !== -1) {
        ta.setSelectionRange(endOfTheLineIndex, endOfTheLineIndex)
      } else {
        ta.setSelectionRange(ta.value.length, ta.value.length)
      }
    }
  }

  static moveCursorToBeginLine(ta: HTMLTextAreaElement | undefined | null) {
    if (ta) {
      let beginOfTheLineIndex = ta.value.lastIndexOf('\n', ta.selectionStart - 1)
      if (beginOfTheLineIndex !== -1) {
        for (let i = beginOfTheLineIndex + 1; i < ta.value.length; i++) {
          if (ta.value.at(i) !== ' ') {
            beginOfTheLineIndex = i
            break
          }
        }
        ta.setSelectionRange(beginOfTheLineIndex, beginOfTheLineIndex)
      } else {
        ta.setSelectionRange(0, 0)
      }
    }
  }
}

interface TextEditorProps extends TextAreaProps {
  onApply?: ((value: string) => void) | undefined
  onCancel?: (() => void) | undefined
}

const defTextEditorProps = (theme: Theme): any => {
  return {
    width: '100%',
    caretColor: theme.caretColor,
    textColor: theme.green,
    bgColor: theme.inputBg,
    border: ['1px', 'solid', theme.inputBorder],
    focusState: (state: StylableComponentProps) => {
      state.outline = ['10px', 'solid', theme.textAreaBorderFocused]
    }
  }
}

export const TextEditor = (props: TextEditorProps) => {
  const theme = useDocsContext().theme
  const customProps = { ...defTextEditorProps(theme), ...props }
  const [value, setValue] = useState(props.text ?? '')
  const [width, height] = useWindowSize()

  const ta = useRef<HTMLTextAreaElement>(null)

  const onChange = (event: any) => {
    setValue(event.target.value)
    TextEditorController.adjustScroller(ta?.current)
  }

  useEffect(() => {
    TextEditorController.adjustScroller(ta?.current)
  }, [width, height])

  const onKeyDown = (e: any) => {
    //console.log('e.keyCode = ', e.keyCode)
    // ESC
    if (e.keyCode === 27) {
      e.preventDefault()
      e.stopPropagation()
      customProps.onCancel()
    }
    // Ctrl + Alt + L
    else if (e.keyCode === 76 && e.ctrlKey && e.shiftKey && ta?.current) {
      e.preventDefault()
      e.stopPropagation()
      TextEditorController.format(ta.current)
      TextEditorController.moveCursorToBeginLine(ta?.current)
    }
    // Enter key
    else if (e.keyCode === 13 && e.shiftKey) {
      e.preventDefault()
      e.stopPropagation()
      TextEditorController.adjustScroller(ta?.current)
      props.onApply?.(value)
    } else if (ta?.current && e.keyCode === 13 && !e.shiftKey) {
      if (TextEditorController.newLine(ta.current)) {
        e.stopPropagation()
        e.preventDefault()
        TextEditorController.adjustScroller(ta?.current)
      } else {
        e.stopPropagation()
      }
    }
    // PageUp key
    else if (e.keyCode === 33 && ta?.current) {
      e.preventDefault()
      e.stopPropagation()
      ta.current.setSelectionRange(0, 0)
      TextEditorController.scrollToCursor(ta.current)
    }
    // PageDown key
    else if (e.keyCode === 34 && ta?.current) {
      e.preventDefault()
      e.stopPropagation()
      const length = ta?.current?.value.length ?? 0
      ta.current.setSelectionRange(length, length)
      TextEditorController.scrollToCursor(ta.current)
    }
    // Home key
    else if (e.keyCode === 36) {
      e.preventDefault()
      e.stopPropagation()
      TextEditorController.moveCursorToBeginLine(ta?.current)
    }
    // End key
    else if (e.keyCode === 35) {
      e.preventDefault()
      e.stopPropagation()
      TextEditorController.moveCursorToEndLine(ta?.current)
    }
    // Delete key
    else if (e.keyCode === 8 && ta?.current && ta.current.selectionStart === ta.current.selectionEnd) {
      if (TextEditorController.deleteAllSpacesBeforeCursor(ta.current)) {
        e.preventDefault()
        e.stopPropagation()
      }
    }
  }

  const className = 'className' in props ? props.className + ' ' + buildClassName(customProps) : buildClassName(customProps)

  return <textarea className={className + ' ' + theme.id + ' listScrollbar'}
                   value={value}
                   autoFocus={customProps.autoFocus}
                   ref={ta}
                   rows={value.split(/\r\n|\r|\n/).length}
                   spellCheck="false"
                   onChange={onChange}
                   onKeyDown={onKeyDown}/>
}
