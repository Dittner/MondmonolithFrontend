import { buildClassName, type StylableComponentProps } from '../../application/NoCSS'
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

interface InputProps extends StylableComponentProps {
  type: 'text' | 'number' | 'password' | 'email'
  protocol?: InputProtocol
  text?: string
  fontSize?: string
  title?: string
  titleSize?: string
  caretColor?: string
  placeHolder?: string
  onChange?: ((value: string) => void) | undefined
  onSubmitted?: (() => void) | undefined
  autoFocus?: boolean
  focusState?: (state: StylableComponentProps) => void
}

const defInputProps = (theme: Theme): any => {
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
    border: ['1px', 'solid', theme.inputBorder],
    focusState: (state: StylableComponentProps) => {
      state.border = ['1px', 'solid', theme.inputBorderFocused]
    }
  }
}

export const Input = (props: InputProps) => {
  console.log('new Input')
  const theme = useDocsContext().theme
  const customProps = { ...defInputProps(theme), ...props }

  const onKeyDown = (e: any) => {
    // Enter key
    if (e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault()
      e.stopPropagation()
      customProps.onSubmitted?.()
    }
  }

  const inputRef = useCallback((input: HTMLInputElement) => {
    if (input && customProps.autoFocus) {
      setTimeout(() => {
        input.focus()
      }, 0)
    }
  }, [customProps.autoFocus])

  const className = 'className' in customProps ? customProps.className + ' ' + buildClassName(customProps) : buildClassName(customProps)

  return (
    <VStack halign="left" valign="top" gap="0"
            width="100%">

      {customProps.title &&
        <Label className="ibm"
               fontSize={customProps.titleSize}
               width='100%'
               text={customProps.title}
               textColor={customProps.titleColor}
               paddingLeft="10px"/>
      }

      <input ref={inputRef}
             className={className}
             placeholder={customProps.placeHolder}
             autoCorrect="off"
             autoComplete="off"
             type={customProps.type}
             defaultValue={customProps.text || customProps.protocol.value}
             onChange={e => {
               if (customProps.protocol) customProps.protocol.value = e.currentTarget.value
               customProps.onChange?.(e.currentTarget.value)
             }}
             onKeyDown={onKeyDown}/>
    </VStack>
  )
}

class TextAreaController {
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
      TextAreaController.scrollToCursor(ta)
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
      TextAreaController.scrollToCursor(ta)
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

interface TextAreaProps extends StylableComponentProps {
  text?: string
  caretColor?: string
  onApply?: ((value: string) => void) | undefined
  onCancel?: (() => void) | undefined
  autoFocus?: boolean
  selectAll?: boolean
  focusState?: (state: StylableComponentProps) => void
}

const defTextAreaProps = (theme: Theme): any => {
  return {
    width: '100%',
    caretColor: theme.caretColor,
    textColor: theme.green,
    bgColor: theme.inputBg,
    border: ['1px', 'solid', theme.inputBorder],
    outline: ['10px', 'solid', theme.transparent],
    focusState: (state: StylableComponentProps) => {
      state.outline = ['10px', 'solid', theme.textAreaBorderFocused]
    }
  }
}

export const TextArea = (props: TextAreaProps) => {
  const theme = useDocsContext().theme
  const customProps = { ...defTextAreaProps(theme), ...props }
  const [value, setValue] = useState(props.text ?? '')
  const [width, height] = useWindowSize()

  const ta = useRef<HTMLTextAreaElement>(null)

  const onChange = (event: any) => {
    setValue(event.target.value)
    TextAreaController.adjustScroller(ta?.current)
  }

  useEffect(() => {
    TextAreaController.adjustScroller(ta?.current)
  }, [width, height])

  const onKeyDown = (e: any) => {
    // Ctrl + Alt + L
    if (e.keyCode === 76 && e.ctrlKey && e.shiftKey && ta?.current) {
      e.preventDefault()
      e.stopPropagation()
      TextAreaController.format(ta.current)
      TextAreaController.moveCursorToBeginLine(ta?.current)
    }
    // Enter key
    else if (e.keyCode === 13 && e.shiftKey) {
      e.preventDefault()
      e.stopPropagation()
      TextAreaController.adjustScroller(ta?.current)
      props.onApply?.(value)
    } else if (ta?.current && e.keyCode === 13 && !e.shiftKey) {
      if (TextAreaController.newLine(ta.current)) {
        e.stopPropagation()
        e.preventDefault()
        TextAreaController.adjustScroller(ta?.current)
      }
    }
    // PageUp key
    else if (e.keyCode === 33 && ta?.current) {
      e.preventDefault()
      e.stopPropagation()
      ta.current.setSelectionRange(0, 0)
      TextAreaController.scrollToCursor(ta.current)
    }
    // PageDown key
    else if (e.keyCode === 34 && ta?.current) {
      e.preventDefault()
      e.stopPropagation()
      const length = ta?.current?.value.length ?? 0
      ta.current.setSelectionRange(length, length)
      TextAreaController.scrollToCursor(ta.current)
    }
    // Home key
    else if (e.keyCode === 36) {
      e.preventDefault()
      e.stopPropagation()
      TextAreaController.moveCursorToBeginLine(ta?.current)
    }
    // End key
    else if (e.keyCode === 35) {
      e.preventDefault()
      e.stopPropagation()
      TextAreaController.moveCursorToEndLine(ta?.current)
    }
    // Delete key
    else if (e.keyCode === 8 && ta?.current && ta.current.selectionStart === ta.current.selectionEnd) {
      if (TextAreaController.deleteAllSpacesBeforeCursor(ta.current)) {
        e.preventDefault()
        e.stopPropagation()
      }
    }
  }

  const className = 'className' in props ? props.className + ' ' + buildClassName(customProps) : buildClassName(customProps)

  return <textarea className={className + ' listScrollbar'}
                   value={value}
                   autoFocus={customProps.autoFocus}
                   ref={ta}
                   rows={value.split(/\r\n|\r|\n/).length}
                   spellCheck="false"
                   onChange={onChange}
                   onKeyDown={onKeyDown}/>
}
