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
                onClick={props.onClick}
                onDoubleClick={props.onDoubleClick}>
      {props.children}</div>
  else
    return <div id={props.id}
                className={buildClassName(style)}
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
                onDoubleClick={props.onDoubleClick}>
      {props.children}
    </div>
  else
    return <div id={props.id}
                className={buildClassName(style)}
                onClick={props.onClick}
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
  text?: string,
  title?: string,
  caretColor?: string,
  placeHolder?: string,
  onChange?: (value: string) => void | undefined,
  onSubmitted?: () => void | undefined
  autoFocus?: boolean,
  focusState?: (state: StylableComponentProps) => void,
}

export const Input = (props: InputProps) => {
  console.log("new Input")

  const onKeyDown = (e: any) => {
    //Enter key
    if (e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault()
      e.stopPropagation()
      props.onSubmitted && props.onSubmitted()
    }
  }

  const inputRef = useCallback((input: HTMLInputElement) => {
    if (input && props.autoFocus) {
      const timeout = setTimeout(() => {
        input.focus()
      }, 0)
      return () => clearTimeout(timeout);
    }
  }, []);

  const className = props.hasOwnProperty("className") ? props.className + " " + buildClassName(props) : buildClassName(props)

  return (
    <VStack halign="left" valign="top" gap="0"
            width="100%">
      <Label fontSize="9px"
             title={props.title || "TITLE"}
             width="100%"
             textTransform="uppercase"
             textColor="#888888"/>

      <input ref={inputRef}
             className={className}
             placeholder={props.placeHolder}
             autoCorrect="off"
             autoComplete="off"
             type={props.type}
             defaultValue={props.text}
             onChange={e => {
               props.onChange && props.onChange(e.currentTarget.value)
             }}
             onKeyDown={onKeyDown}/>
    </VStack>
  )
}

interface TextAreaProps extends StylableComponentProps {
  text?: string,
  caretColor?: string,
  onApply?: (value: string) => void | undefined,
  onCancel?: () => void | undefined
  autoFocus?: boolean,
  selectAll?: boolean,
  focusState?: (state: StylableComponentProps) => void,
}

export const TextArea = (props: TextAreaProps) => {
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

  const className = props.hasOwnProperty("className") ? props.className + " " + buildClassName(props) : buildClassName(props)

  return <textarea className={className}
                   value={value}
                   autoFocus={props.autoFocus}
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
                   e.stopPropagation()
                   props.onClick && props.onClick()
                 }}>{props.title || props.children}</button>
}

interface RedButtonProps {
  title: string,
  theme: Theme,
  visible?: boolean,
  isSelected?: boolean,
  hideBg?: boolean,
  onClick?: () => void,
}

export const RedButton = (props: RedButtonProps) => {
  if (props.hasOwnProperty("visible") && !props.visible) return <></>

  const isSelected = props.hasOwnProperty("isSelected") && props.isSelected
  if(props.theme.isDark) {
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
  hideBg?: boolean,
  onClick?: () => void,
}

export const IconButton = observer((props: IconButtonProps) => {
  if (props.hasOwnProperty("visible") && !props.visible) return <></>

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

    const className = p.hasOwnProperty("className") ? p.className + " " + buildClassName(p) : buildClassName(props)
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