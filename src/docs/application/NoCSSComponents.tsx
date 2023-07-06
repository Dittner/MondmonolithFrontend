import * as React from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useWindowSize } from '../../App'
import { buildClassName, type StylableComponentProps } from './NoCSS'
import { type Theme } from './ThemeManager'
import { observer } from 'mobx-react'
import { calcSpaceBefore, formatCode, reformat } from '../ui/common/String++'

/*
*
* STACK
*
* */

interface ClickableComponentProps extends StylableComponentProps {
  onClick?: (e: any) => void
  onMouseDown?: (e: any) => void
  onDoubleClick?: (e: any) => void
}

interface StackProps extends ClickableComponentProps {
  halign: 'left' | 'right' | 'center' | 'stretch'
  valign: 'top' | 'center' | 'base' | 'bottom' | 'stretch'
}

const defVStackProps = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
  width: '100%',
  gap: '10px',
  boxSizing: 'border-box'
}

export const VStack = (props: StackProps) => {
  const style = { ...defVStackProps, ...props }

  switch (props.halign) {
    case 'left':
      style.alignItems = 'flex-start'
      break
    case 'center':
      style.alignItems = 'center'
      break
    case 'right':
      style.alignItems = 'flex-end'
      break
    case 'stretch':
      style.alignItems = 'stretch'
      break
  }

  switch (props.valign) {
    case 'top':
      style.justifyContent = 'flex-start'
      break
    case 'center':
      style.justifyContent = 'center'
      break
    case 'base':
      style.alignItems = 'baseline'
      break
    case 'bottom':
      style.justifyContent = 'flex-end'
      break
  }

  if ('className' in props) {
    return <div id={props.id}
                className={props.className + ' ' + buildClassName(style)}
                onMouseDown={props.onMouseDown}
                onClick={props.onClick}
                onDoubleClick={props.onDoubleClick}>
      {props.children}</div>
  } else {
    return <div id={props.id}
                className={buildClassName(style)}
                onMouseDown={props.onMouseDown}
                onClick={props.onClick}
                onDoubleClick={props.onDoubleClick}>
      {props.children}</div>
  }
}

const defHStackProps = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  justifyContent: 'center',
  gap: '10px',
  boxSizing: 'border-box'
}

export const HStack = (props: StackProps) => {
  const style = { ...defHStackProps, ...props }

  switch (props.halign) {
    case 'left':
      style.justifyContent = 'flex-start'
      break
    case 'center':
      style.justifyContent = 'center'
      break
    case 'right':
      style.justifyContent = 'flex-end'
      break
  }

  switch (props.valign) {
    case 'top':
      style.alignItems = 'flex-start'
      break
    case 'center':
      style.alignItems = 'center'
      break
    case 'base':
      style.alignItems = 'baseline'
      break
    case 'bottom':
      style.alignItems = 'flex-end'
      break
    case 'stretch':
      style.alignItems = 'stretch'
      break
  }

  if ('className' in props) {
    return <div id={props.id}
                className={props.className + ' ' + buildClassName(style)}
                onClick={props.onClick}
                onMouseDown={props.onMouseDown}
                onDoubleClick={props.onDoubleClick}>
      {props.children}
    </div>
  } else {
    return <div id={props.id}
                className={buildClassName(style)}
                onClick={props.onClick}
                onMouseDown={props.onMouseDown}
                onDoubleClick={props.onDoubleClick}>
      {props.children}</div>
  }
}

export const StylableContainer = (props: ClickableComponentProps) => {
  const style = { boxSizing: 'border-box', ...props }
  const className = 'className' in props ? props.className + ' ' + buildClassName(style) : buildClassName(style)
  return <div id={props.id}
              key={props.key}
              className={className}
              onClick={props.onClick}
              onMouseDown={props.onMouseDown}
              onDoubleClick={props.onDoubleClick}>
    {props.children}
  </div>
}

/*
*
* LABEL
*
* */

export interface LabelProps extends StylableComponentProps {
  fontFamily?: string
  fontSize?: string
  fontWeight?: string
  text?: string
  textAlign?: 'left' | 'right' | 'center'
  textDecoration?: 'none' | 'underline'
  whiteSpace?: 'normal' | 'pre' | 'pre-wrap' | 'nowrap'
  textTransform?: 'none' | 'uppercase' | 'capitalize' | 'lowercase'
}

export const Label = (props: LabelProps) => {
  if ('visible' in props && !props.visible) return <></>

  if ('className' in props) {
    return <p className={props.className + ' ' + buildClassName(props)}>{props.text ?? props.children}</p>
  }
  return <p className={buildClassName(props)}>{props.text ?? props.children}</p>
}

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
  theme: Theme
  protocol?: InputProtocol
  text?: string
  title?: string
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
    textColor: theme.text75,
    bgColor: theme.inputBg,
    padding: '5px',
    border: ['1px', 'solid', theme.inputBorder],
    focusState: (state: StylableComponentProps) => {
      state.textColor = theme.text
      state.border = ['1px', 'solid', theme.border]
    }
  }
}

export const Input = (props: InputProps) => {
  console.log('new Input')
  const customProps = { ...defInputProps(props.theme), ...props }

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
      <Label fontSize="9px"
             text={customProps.title || 'TITLE'}
             width="100%"
             textTransform="uppercase"
             textColor="#888888"/>

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

interface TextAreaProps extends StylableComponentProps {
  theme: Theme
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
    bgColor: theme.codeBg,
    border: ['1px', 'solid', theme.inputBorder],
    outline: ['10px', 'solid', theme.inputBorder],
    focusState: (state: StylableComponentProps) => {
      state.outline = ['10px', 'solid', theme.inputBorderFocused]
      state.border = ['1px', 'solid', theme.border]
      state.bgColor = theme.inputBg
    }
  }
}

class TextAreaController {
  static format(ta: HTMLTextAreaElement) {
    const value = ta.value
    const selectionStart = ta.selectionStart
    ta.setSelectionRange(0, ta?.value.length)

    try {
      const formattedCode = reformat(value)
      const scrollY = window.scrollY
      document.execCommand('insertText', false, formattedCode)
      ta.setSelectionRange(selectionStart, selectionStart)
      window.scrollTo(0, scrollY)
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
      return true
    }
    return false
  }

  static deleteAllSpacesBeforeCursor(ta: HTMLTextAreaElement): boolean {
    const value = ta.value
    const selectionStart = ta.selectionStart

    const deleteAllSpaces = (/\n {2,}$/.test(value.slice(0, selectionStart)))
    console.log('deleteAllSpaces: ', deleteAllSpaces)
    if (deleteAllSpaces) {
      const firstSpaceIndex = value.lastIndexOf('\n', selectionStart - 1)
      if (firstSpaceIndex !== -1 && firstSpaceIndex + 1 < selectionStart) {
        ta.setSelectionRange(firstSpaceIndex + 1, selectionStart)
        document.execCommand('insertText', false, '')
        return true
      }
    }
    return false
  }

  static adjustScroller(ta: HTMLTextAreaElement | undefined | null) {
    if (ta) {
      ta.style.height = 'inherit'
      ta.style.height = `${ta.scrollHeight + 2}px`
    }
  }

  static moveCursorToEndLine(ta: HTMLTextAreaElement | undefined | null) {
    if (ta) {
      const endOfTheLineIndex = ta.value.indexOf('\n', ta.selectionStart)
      if (endOfTheLineIndex !== -1) ta.setSelectionRange(endOfTheLineIndex, endOfTheLineIndex)
      else ta.setSelectionRange(ta.value.length, ta.value.length)
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
      } else ta.setSelectionRange(0, 0)
    }
  }
}

export const TextArea = (props: TextAreaProps) => {
  const customProps = { ...defTextAreaProps(props.theme), ...props }
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
      props.onApply?.(value)
      TextAreaController.adjustScroller(ta?.current)
    }
    // PageUp key
    else if (e.keyCode === 33) {
      e.preventDefault()
      e.stopPropagation()
      ta?.current?.setSelectionRange(0, 0)
    }
    // PageDown key
    else if (e.keyCode === 34) {
      e.preventDefault()
      e.stopPropagation()
      const length = ta?.current?.value.length ?? 0
      ta?.current?.setSelectionRange(length, length)
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
    } else if (ta?.current && e.keyCode === 13 && !e.shiftKey) {
      if (TextAreaController.newLine(ta.current)) {
        e.stopPropagation()
        e.preventDefault()
        TextAreaController.adjustScroller(ta?.current)
      }
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

  return <textarea className={className}
                   value={value}
                   autoFocus={customProps.autoFocus}
                   ref={ta}
                   rows={value.split(/\r\n|\r|\n/).length}
                   spellCheck="false"
                   onChange={onChange}
                   onKeyDown={onKeyDown}/>
}

/*
*
* BUTTON
*
* */

interface ButtonProps extends StylableComponentProps {
  title?: string
  popUp?: string
  onClick?: () => void
}

export const Button = (props: ButtonProps) => {
  if ('visible' in props && !props.visible) return <></>

  const className = 'className' in props ? props.className + ' ' + buildClassName(props) : buildClassName(props)

  return <button className={className}
                 title={props.popUp}
                 onClick={(e) => {
                   if (!props.disabled) {
                     e.stopPropagation()
                     props.onClick?.()
                   }
                 }}>{props.title ?? props.children}</button>
}

interface RedButtonProps {
  title: string
  theme: Theme
  visible?: boolean
  disabled?: boolean
  isSelected?: boolean
  hideBg?: boolean
  onClick?: () => void
}

export const RedButton = (props: RedButtonProps) => {
  if ('visible' in props && !props.visible) return <></>

  if (props.disabled) {
    return <Button title={props.title}
                   textColor={props.theme.text75}
                   paddingHorizontal="10px"
                   disabled/>
  }

  const isSelected = 'isSelected' in props && props.isSelected
  if (props.theme.isDark) {
    if (props.hideBg) {
      return <Button title={props.title}
                     textColor={isSelected ? props.theme.white : props.theme.red}
                     paddingHorizontal="10px"
                     hoverState={state => {
                       state.textColor = props.theme.white
                     }
                     }
                     onClick={props.onClick}/>
    }
    return <Button title={props.title}
                   textColor={isSelected ? props.theme.white : props.theme.red}
                   bgColor={props.theme.border}
                   paddingHorizontal="10px"
                   hoverState={state => {
                     state.textColor = props.theme.white
                   }
                   }
                   onClick={props.onClick}/>
  }
  if (props.hideBg) {
    return <Button title={props.title}
                   textColor={isSelected ? props.theme.white : props.theme.red}
                   bgColor={isSelected ? props.theme.red : '0'}
                   paddingHorizontal="10px"
                   hoverState={state => {
                     state.textColor = props.theme.white
                     state.bgColor = props.theme.red
                   }
                   }
                   onClick={props.onClick}/>
  }
  return <Button title={props.title}
                 textColor={props.theme.white}
                 bgColor={props.theme.red}
                 paddingHorizontal="10px"
                 opacity={isSelected ? '100%' : '85%'}
                 hoverState={state => {
                   state.opacity = '100%'
                 }
                 }
                 onClick={props.onClick}/>
}

export const Switch = ({
  theme,
  isSelected,
  onClick
}: { theme: Theme, isSelected: boolean, onClick: () => void }) => {
  const btnWidth = '34px'
  const btnHeight = '22px'
  const thumbDiameter = '16px'
  return <StylableContainer width={btnWidth}
                            height={btnHeight}
                            bgColor={isSelected ? theme.red : '#727a86'}
                            cornerRadius={btnHeight}
                            animate="background-color 300ms"
                            btnCursor
                            onClick={onClick}>

    <StylableContainer width={thumbDiameter}
                       height={thumbDiameter}
                       cornerRadius={thumbDiameter}
                       bgColor={theme.appBg}
                       top="3px"
                       left={isSelected ? '15px' : '3px'}
                       animate="left 300ms"
                       relative/>
  </StylableContainer>
}

type IconType =
  'sun'
  | 'moon'
  | 'down'
  | 'up'
  | 'scrollBack'
  | 'nextPage'
  | 'prevPage'
  | 'close'
  | 'menu'
  | 'plus'
  | 'delete'
  | 'edit'

interface IconButtonProps {
  icon: IconType
  theme: Theme
  popUp: string
  visible?: boolean
  disabled?: boolean
  hideBg?: boolean
  onClick?: () => void
}

export const IconButton = observer((props: IconButtonProps) => {
  if ('visible' in props && !props.visible) return <></>

  if (props.disabled) {
    return <Button className={'icon-' + props.icon}
                   popUp={props.popUp}
                   textColor={props.theme.text75}
                   disabled/>
  }

  if (props.theme.isDark) {
    if (props.hideBg) {
      return <Button className={'icon-' + props.icon}
                     popUp={props.popUp}
                     textColor={props.theme.red}
                     hoverState={state => {
                       state.textColor = props.theme.white
                     }}
                     onClick={props.onClick}/>
    }

    return <Button className={'icon-' + props.icon}
                   popUp={props.popUp}
                   textColor={props.theme.red}
                   bgColor={props.theme.border}
                   hoverState={state => {
                     state.textColor = props.theme.white
                   }}
                   onClick={props.onClick}/>
  }

  if (props.hideBg) {
    return <Button className={'icon-' + props.icon}
                   popUp={props.popUp}
                   textColor={props.theme.red}
                   hoverState={state => {
                     state.textColor = props.theme.white
                     state.bgColor = props.theme.red
                   }
                   }
                   onClick={props.onClick}/>
  }

  return <Button className={'icon-' + props.icon}
                 popUp={props.popUp}
                 textColor={props.theme.white}
                 bgColor={props.theme.red}
                 opacity="85%"
                 hoverState={state => {
                   state.opacity = '100%'
                 }}
                 onClick={props.onClick}/>
})

/*
*
* DropDown
*
* */

interface DropDownProps extends StylableComponentProps {
  isOpened: boolean
  onClose?: (() => void) | undefined
}

export const DropDownContainer = (props: DropDownProps) => {
  useEffect(() => {
    const close = () => {
      props.onClose?.()
      window.removeEventListener('mousedown', close)
    }

    setTimeout(() => {
      if (props.isOpened) {
        window.addEventListener('mousedown', close)
      }
    }, 10)

    return () => {
      window.removeEventListener('mousedown', close)
    }
  }, [props.isOpened])

  if (props.isOpened) {
    const p = {
      absolute: 'true',
      top: '50px',
      ...props
    }
    const className = 'className' in p ? p.className + ' ' + buildClassName(p) : buildClassName(p)
    return (
      <div className={className}
           onMouseDown={e => {
             e.stopPropagation()
           }}>
        {props.children}
      </div>
    )
  } else {
    return <></>
  }
}

/*
*
* Image
*
* */

interface ImageProps extends StackProps {
  src: string
  alt: string
}

export const Image = (props: ImageProps) => {
  if ('visible' in props && !props.visible) return <></>
  const className = 'className' in props ? props.className + ' ' + buildClassName(props) : buildClassName(props)

  let imgClassName
  if ('width' in props || 'height' in props) {
    const style: StylableComponentProps = {}
    if ('width' in props) style.width = props.width
    if ('height' in props) style.height = props.height
    if ('opacity' in props) style.opacity = props.opacity
    if ('animate' in props) style.animate = props.animate
    imgClassName = buildClassName(style)
  }

  return (
    <HStack className={className} valign={props.valign} halign={props.halign}>
      <img className={imgClassName} src={props.src} alt={props.alt}/>
    </HStack>
  )
}

/*
*
* Separator
*
* */

interface HSeparatorProps {
  theme: Theme
  visible?: boolean
  width?: string
  marginHorizontal?: string
  marginVertical?: string
}

export const HSeparator = (props: HSeparatorProps) => {
  if (props.visible === false) return <></>

  const style: any = {}
  if (props.width !== undefined) style.width = props.width
  if (props.marginHorizontal !== undefined) {
    style.marginLeft = props.marginHorizontal
    style.marginRight = props.marginHorizontal
  }
  if (props.marginVertical !== undefined) {
    style.marginTop = props.marginVertical
    style.marginBottom = props.marginVertical
  }
  style.bgColor = props.theme.border
  style.height = '1px'
  style.maxHeight = '1px'

  return <div className={buildClassName(style)}/>
}

interface VSeparatorProps {
  theme: Theme
  visible?: boolean
  height?: string
  marginHorizontal?: string
  marginVertical?: string
}

export const VSeparator = (props: VSeparatorProps) => {
  if (props.visible === false) return <></>

  const style: any = {}
  if (props.height !== undefined) style.height = props.height
  if (props.marginHorizontal !== undefined) {
    style.marginLeft = props.marginHorizontal
    style.marginRight = props.marginHorizontal
  }
  if (props.marginVertical !== undefined) {
    style.marginTop = props.marginVertical
    style.marginBottom = props.marginVertical
  }
  style.bgColor = props.theme.border
  style.width = '1px'
  style.maxWidth = '1px'

  return <div className={buildClassName(style)}/>
}

/*
*
* Spacer
*
* */

interface SpacerProps {
  width?: string
  height?: string
  visible?: boolean
}

export const Spacer = ({
  width,
  height,
  visible = true
}: SpacerProps) => {
  if (!visible) return <></>

  const style: any = {}
  style.flexGrow = 1

  if (width !== undefined) {
    style.width = width
    style.minWidth = width
    style.maxWidth = width
  }

  if (height !== undefined) {
    style.height = height
    style.minHeight = height
    style.maxHeight = height
  }

  return <div className={'spacer ' + buildClassName(style)}/>
}
