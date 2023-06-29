import * as React from "react";
import {useCallback, useEffect, useRef, useState} from "react";
import {useWindowSize} from "../../App";
import {buildClassName, StylableComponentProps} from "./NoCSS";
import {Theme} from "./ThemeManager";
import {observer} from "mobx-react";

/*
*
* STACK
*
* */

interface ClickableComponentProps extends StylableComponentProps {
  onClick?: (e: any) => void,
  onMouseDown?: (e: any) => void,
  onDoubleClick?: (e: any) => void,
}

interface StackProps extends ClickableComponentProps {
  halign: 'left' | 'right' | "center" | 'stretch',
  valign: 'top' | "center" | 'base' | 'bottom' | 'stretch',
}

const defVStackProps = {
  "display": "flex",
  "flexDirection": "column",
  "alignItems": "flex-start",
  "justifyContent": "center",
  "width": "100%",
  "gap": "10px",
  "boxSizing": "border-box",
}

export const VStack = (props: StackProps) => {
  const style = {...defVStackProps, ...props}

  switch (props.halign) {
    case 'left':
      style["alignItems"] = "flex-start";
      break;
    case "center":
      style["alignItems"] = "center";
      break;
    case 'right':
      style["alignItems"] = "flex-end";
      break;
    case 'stretch':
      style["alignItems"] = "stretch";
      break;
  }

  switch (props.valign) {
    case 'top':
      style["justifyContent"] = "flex-start";
      break;
    case "center":
      style["justifyContent"] = "center";
      break;
    case 'base':
      style["alignItems"] = "baseline";
      break;
    case 'bottom':
      style["justifyContent"] = "flex-end";
      break;
  }

  if (props.hasOwnProperty("className"))
    return <div id={props.id}
                className={props.className + " " + buildClassName(style)}
                onMouseDown={props.onMouseDown}
                onClick={props.onClick}
                onDoubleClick={props.onDoubleClick}>
      {props.children}</div>
  else
    return <div id={props.id}
                className={buildClassName(style)}
                onMouseDown={props.onMouseDown}
                onClick={props.onClick}
                onDoubleClick={props.onDoubleClick}>
      {props.children}</div>
}

const defHStackProps = {
  "display": "flex",
  "flexDirection": "row",
  "alignItems": "flex-start",
  "justifyContent": "center",
  "gap": "10px",
  "boxSizing": "border-box",
}

export const HStack = (props: StackProps) => {
  const style = {...defHStackProps, ...props}

  switch (props.halign) {
    case 'left':
      style["justifyContent"] = "flex-start";
      break;
    case "center":
      style["justifyContent"] = "center";
      break;
    case 'right':
      style["justifyContent"] = "flex-end";
      break;
  }

  switch (props.valign) {
    case 'top':
      style["alignItems"] = "flex-start";
      break;
    case "center":
      style["alignItems"] = "center";
      break;
    case 'base':
      style["alignItems"] = "baseline";
      break;
    case 'bottom':
      style["alignItems"] = "flex-end";
      break;
    case 'stretch':
      style["alignItems"] = "stretch";
      break;
  }

  if (props.hasOwnProperty("className"))
    return <div id={props.id}
                className={props.className + " " + buildClassName(style)}
                onClick={props.onClick}
                onMouseDown={props.onMouseDown}
                onDoubleClick={props.onDoubleClick}>
      {props.children}
    </div>
  else
    return <div id={props.id}
                className={buildClassName(style)}
                onClick={props.onClick}
                onMouseDown={props.onMouseDown}
                onDoubleClick={props.onDoubleClick}>
      {props.children}</div>
}

export const StylableContainer = (props: ClickableComponentProps) => {
  const style = {"boxSizing": "border-box", ...props}
  const className = props.hasOwnProperty("className") ? props.className + " " + buildClassName(style) : buildClassName(style)
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
  fontFamily?: string,
  fontSize?: string,
  fontWeight?: string,
  title?: string,
  textAlign?: "left" | "right" | "center",
  textDecoration?: "none" | "underline",
  whiteSpace?: "normal" | "pre" | "pre-wrap" | "nowrap"
  textTransform?: "none" | "uppercase" | "capitalize" | "lowercase"
}

export const Label = (props: LabelProps) => {
  if (props.hasOwnProperty("visible") && !props.visible) return <></>

  if (props.hasOwnProperty("className"))
    return <p className={props.className + " " + buildClassName(props)}>{props.title || props.children}</p>
  return <p className={buildClassName(props)}>{props.title || props.children}</p>
}

/*
*
* INPUT
*
* */

interface InputProps extends StylableComponentProps {
  type: "text" | "number" | "password" | "email",
  theme: Theme,
  text?: string,
  title?: string,
  caretColor?: string,
  placeHolder?: string,
  onChange?: (value: string) => void | undefined,
  onSubmitted?: () => void | undefined
  autoFocus?: boolean,
  focusState?: (state: StylableComponentProps) => void,
}

const defInputProps = (theme: Theme): any => {
  return {
    "width": "100%",
    "height": "35px",
    "caretColor": theme.caretColor,
    "textColor": theme.text75,
    "bgColor": theme.inputBg,
    "padding": "5px",
    "border": ["1px", "solid", theme.inputBorder],
    "focusState": (state: StylableComponentProps) => {
      state.textColor = theme.text
      state.border = ["1px", "solid", theme.inputBorderFocused]
    },
  }
}

export const Input = (props: InputProps) => {
  console.log("new Input")
  const customProps = {...defInputProps(props.theme), ...props}

  const onKeyDown = (e: any) => {
    //Enter key
    if (e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault()
      e.stopPropagation()
      customProps.onSubmitted && customProps.onSubmitted()
    }
  }

  const inputRef = useCallback((input: HTMLInputElement) => {
    if (input && customProps.autoFocus) {
      const timeout = setTimeout(() => {
        input.focus()
      }, 0)
      return () => clearTimeout(timeout);
    }
  }, [customProps.autoFocus]);

  const className = customProps.hasOwnProperty("className") ? customProps.className + " " + buildClassName(customProps) : buildClassName(customProps)

  return (
    <VStack halign="left" valign="top" gap="0"
            width="100%">
      <Label fontSize="9px"
             title={customProps.title || "TITLE"}
             width="100%"
             textTransform="uppercase"
             textColor="#888888"/>

      <input ref={inputRef}
             className={className}
             placeholder={customProps.placeHolder}
             autoCorrect="off"
             autoComplete="off"
             type={customProps.type}
             defaultValue={customProps.text}
             onChange={e => {
               customProps.onChange && customProps.onChange(e.currentTarget.value)
             }}
             onKeyDown={onKeyDown}/>
    </VStack>
  )
}

interface TextAreaProps extends StylableComponentProps {
  theme: Theme,
  text?: string,
  caretColor?: string,
  onApply?: (value: string) => void | undefined,
  onCancel?: () => void | undefined
  autoFocus?: boolean,
  selectAll?: boolean,
  focusState?: (state: StylableComponentProps) => void,
}

const defTextAreaProps = (theme: Theme): any => {
  return {
    "width": "100%",
    "caretColor": theme.caretColor,
    "textColor": theme.textGreen,
    "border": ["1px", "solid", theme.border],
    "cornerRadius": "10px",
    "animate": "border-left 300ms",
    "borderLeft": ["6px", "solid", theme.inputBorder],
    "focusState": (state: StylableComponentProps) => {
      state.borderLeft = ["6px", "solid", theme.red]
      state.bgColor = theme.inputBg
    }
  }
}

export const TextArea = (props: TextAreaProps) => {
  const customProps = {...defTextAreaProps(props.theme), ...props}
  const [value, setValue] = useState(props.text || "");
  const [width, height] = useWindowSize();

  const ta = useRef<HTMLTextAreaElement>(null);

  const adjustScroller = () => {
    if (ta && ta.current) {
      ta.current.style.height = "inherit";
      ta.current.style.height = `${ta.current.scrollHeight + 5}px`;
    }
  }

  const onChange = (event: any) => {
    setValue(event.target.value)
    adjustScroller()
  }

  useEffect(() => {
    adjustScroller()
  }, [width, height])

  const onKeyDown = (e: any) => {
    //Enter key
    if (e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault()
      e.stopPropagation()
      props.onApply && props.onApply(value)
    }
    //ESC key
    if (e.keyCode === 27) {
      e.preventDefault()
      e.stopPropagation()
      props.onCancel && props.onCancel()
    }
  }

  const className = props.hasOwnProperty("className") ? props.className + " " + buildClassName(customProps) : buildClassName(customProps)

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
  title?: string,
  popUp?: string,
  onClick?: () => void,
}

export const Button = (props: ButtonProps) => {
  if (props.hasOwnProperty("visible") && !props.visible) return <></>

  const className = props.hasOwnProperty("className") ? props.className + " " + buildClassName(props) : buildClassName(props)

  return <button className={className}
                 title={props.popUp}
                 onClick={(e) => {
                   if (!props.disabled) {
                     e.stopPropagation()
                     props.onClick && props.onClick()
                   }
                 }}>{props.title || props.children}</button>
}

interface RedButtonProps {
  title: string,
  theme: Theme,
  visible?: boolean,
  disabled?: boolean,
  isSelected?: boolean,
  hideBg?: boolean,
  onClick?: () => void,
}

export const RedButton = (props: RedButtonProps) => {
  if (props.hasOwnProperty("visible") && !props.visible) return <></>

  if (props.disabled) {
    return <Button title={props.title}
                   textColor={props.theme.text75}
                   paddingHorizontal="10px"
                   disabled/>
  }

  const isSelected = props.hasOwnProperty("isSelected") && props.isSelected
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
                   bgColor={isSelected ? props.theme.red : "0"}
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
                 opacity={isSelected ? "100%" : "85%"}
                 hoverState={state => {
                   state.opacity = "100%"
                 }
                 }
                 onClick={props.onClick}/>
}

export const Switch = ({theme, isSelected, onClick}: { theme: Theme, isSelected: boolean, onClick: () => void }) => {
  return <StylableContainer width="40px"
                            height="24px">
    <Button title=""
            border="none"
            bgColor={isSelected ? theme.red : "#727a86"}
            width="40px"
            height="24px"
            minHeight="24px"
            cornerRadius="24px"
            absolute
            animate="background-color 300ms"
            onClick={onClick}/>

    <Button title=""
            width="20px"
            height="20px"
            minWidth="20px"
            minHeight="20px"
            cornerRadius="20px"
            bgColor={theme.appBg}
            top="2px"
            left={isSelected ? "18px" : "2px"}
            animate="left 300ms"
            relative
            onClick={onClick}/>
  </StylableContainer>
}


type IconType =
  "sun"
  | "moon"
  | "down"
  | "up"
  | "scrollBack"
  | "nextPage"
  | "prevPage"
  | "close"
  | "menu"
  | "plus"
  | "delete"
  | "edit"

interface IconButtonProps {
  icon: IconType,
  theme: Theme,
  popUp: string,
  visible?: boolean,
  disabled?: boolean,
  hideBg?: boolean,
  onClick?: () => void,
}

export const IconButton = observer((props: IconButtonProps) => {
  if (props.hasOwnProperty("visible") && !props.visible) return <></>

  if (props.disabled) {
    return <Button className={"icon-" + props.icon}
                   popUp={props.popUp}
                   textColor={props.theme.text75}
                   disabled/>
  }

  if (props.theme.isDark) {
    if (props.hideBg) {
      return <Button className={"icon-" + props.icon}
                     popUp={props.popUp}
                     textColor={props.theme.red}
                     hoverState={state => {
                       state.textColor = props.theme.white
                     }}
                     onClick={props.onClick}/>
    }

    return <Button className={"icon-" + props.icon}
                   popUp={props.popUp}
                   textColor={props.theme.red}
                   bgColor={props.theme.border}
                   hoverState={state => {
                     state.textColor = props.theme.white
                   }}
                   onClick={props.onClick}/>
  }

  if (props.hideBg) {
    return <Button className={"icon-" + props.icon}
                   popUp={props.popUp}
                   textColor={props.theme.red}
                   hoverState={state => {
                     state.textColor = props.theme.white
                     state.bgColor = props.theme.red
                   }
                   }
                   onClick={props.onClick}/>
  }

  return <Button className={"icon-" + props.icon}
                 popUp={props.popUp}
                 textColor={props.theme.white}
                 bgColor={props.theme.red}
                 opacity="85%"
                 hoverState={state => {
                   state.opacity = "100%"
                 }}
                 onClick={props.onClick}/>
})


/*
*
* DropDown
*
* */

interface DropDownProps extends StylableComponentProps {
  isOpened: boolean,
  onClose: () => void | undefined
}

export const DropDownContainer = (props: DropDownProps) => {
  useEffect(() => {
    const close = () => {
      props.onClose && props.onClose()
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
    const p = {"absolute": "true", "top": "50px", ...props}
    const className = p.hasOwnProperty("className") ? p.className + " " + buildClassName(p) : buildClassName(p)
    return (
      <div className={className}
           onMouseDown={e => e.stopPropagation()}>
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
  src: string,
}

export const Image = (props: ImageProps) => {
  if (props.hasOwnProperty("visible") && !props.visible) return <></>
  const className = props.hasOwnProperty("className") ? props.className + " " + buildClassName(props) : buildClassName(props)

  let imgClassName = undefined
  if (props.hasOwnProperty("width") || props.hasOwnProperty("height")) {
    const style: StylableComponentProps = {}
    if (props.hasOwnProperty("width")) style.width = props.width
    if (props.hasOwnProperty("height")) style.height = props.height
    imgClassName = buildClassName(style)
  }

  return (
    <HStack className={className} valign={props.valign} halign={props.halign}>
      <img className={imgClassName} src={props.src}/>
    </HStack>
  )
}

/*
*
* Separator
*
* */

interface HSeparatorProps {
  theme: Theme,
  visible?: boolean,
  width?: string,
  marginHorizontal?: string,
  marginVertical?: string,
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
  style.height = "1px"
  style.maxHeight = "1px"

  return <div className={buildClassName(style)}/>
}

interface VSeparatorProps {
  theme: Theme,
  visible?: boolean,
  height?: string,
  marginHorizontal?: string,
  marginVertical?: string,
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
  style.width = "1px"
  style.maxWidth = "1px"

  return <div className={buildClassName(style)}/>
}

/*
*
* Spacer
*
* */

interface SpacerProps {
  width?: string,
  height?: string,
  visible?: boolean,
}

export const Spacer = ({width, height, visible = true}: SpacerProps) => {
  if (visible === false) return <></>

  const style: any = {}
  style.flexGrow = 1;

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

  return <div className={"spacer " + buildClassName(style)}/>
}