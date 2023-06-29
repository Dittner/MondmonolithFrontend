import {LayoutLayer} from "./Application";
import * as React from "react";

const abbreviations:{[prop: string]:string} = {
  "align-items": "A",
  "background-color": "BG",
  "border": "BO",
  "border-left": "BL",
  "border-right": "BR",
  "border-top": "BT",
  "border-bottom": "BB",
  "border-radius": "BRA",
  "bottom": "B",
  "box-sizing": "S",
  "box-shadow": "BS",
  "caret-color": "CC",
  "color": "C",
  "cursor": "CU",
  "display" : "D",
  "flex-direction" : "F",
  "flex-grow" : "FG",
  "font-family" : "FF",
  "font-size" : "FS",
  "font-weight" : "FW",
  "gap" : "G",
  "height": "H",
  "justify-content": "J",
  "left": "L",
  "margin-left": "ML",
  "margin-right": "MR",
  "margin-top": "MT",
  "margin-bottom": "MB",
  "max-height": "MAH",
  "max-width": "MAW",
  "min-height": "MIH",
  "min-width": "MIW",
  "opacity": "OP",
  "overflow": "O",
  "overflow-x": "OX",
  "padding-left": "PL",
  "padding-right": "PR",
  "padding-top": "PT",
  "padding-bottom": "PB",
  "position": "P",
  "right": "R",
  "text-align": "TA",
  "text-decoration": "TD",
  "text-transform": "TR",
  "top": "T",
  "transition": "TN",
  "white-space": "WS",
  "width": "W",
  "z-index": "Z",
}

const RuleBuilder = ():[()=>void, { [key: string]: (value:any)=>void }, ()=>string, (parentSelector:string, childSelector:string)=>void] =>  {
  let hashSum:string = ""
  let style = ""
  let state:"normal"|"hover"|"focus" = "normal"
  let focusStyle = ""
  let hoverStyle = ""
  const notAllowedSymbolsInClassName = /[%. #]+/g;
  const classNameHash = new Map<string,string>()
  const isMobileDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

  //Creating of dynamic stylesheets are enabled only in Chrome (23.06.2023)
  //const styleSheet = new CSSStyleSheet();
  //document.adoptedStyleSheets = [styleSheet];
  const styleSheet = window.document.styleSheets[0];

  const operator: { [key: string]: (value:any)=>void } = Object.create(null)

  const getClassName = ():string => {
    if(!hashSum) return ""

    if(classNameHash.has(hashSum))
      return classNameHash.get(hashSum) as string

    const className = hashSum.replace(notAllowedSymbolsInClassName, 'x')

    console.log("--new selector #" + (++selectorsCount) + ": ", className)

    const rule = '.' + className + style + '}';
    classNameHash.set(hashSum, className)
    styleSheet.insertRule(rule)

    if(hoverStyle) {
      const rule = '.' + className + (isMobileDevice ? ":active{" : ":hover{") + hoverStyle + '}';
      styleSheet.insertRule(rule)
    }

    if(focusStyle) {
      const rule = '.' + className + ":focus{" + focusStyle + '}';
      styleSheet.insertRule(rule)
    }

    return className
  }

  const addRule = (parentSelector:string, childSelector:string):void => {
    if(!hashSum) return

    const selector = parentSelector + ' ' + childSelector
    if(classNameHash.has(selector)) return

    console.log("--new selector #" + (++selectorsCount) + ": ", selector)

    const rule = '.' + selector + style + '}';
    classNameHash.set(selector, parentSelector)
    styleSheet.insertRule(rule)

    if(hoverStyle) {
      const rule = '.' + selector + (isMobileDevice ? ":active{" : ":hover{") + hoverStyle + '}';
      styleSheet.insertRule(rule)
    }

    if(focusStyle) {
      const rule = '.' + selector + ":focus{" + focusStyle + '}';
      styleSheet.insertRule(rule)
    }
  }

  const clear = ():void => {
    hashSum = ""
    focusStyle = ""
    hoverStyle = ""
    state = "normal"
    style = "{box-sizing:border-box;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;"
  }

  const setValue = (key:string, value:string, appendToClassName:boolean = true) => {
    if(value === undefined) {
      console.warn("NoCSS::setValue: undefined value was found for key: ", key)
    }

    if(state === "focus") focusStyle += key + ':' + value + ';'
    else if(state === "hover") hoverStyle += key + ':' + value + ';'
    else style += key + ':' + value + ';'

    if(appendToClassName) {
      if(!abbreviations.hasOwnProperty(key))
        throw new Error("SelectorRuleBuilder.setValue:: No abbreviation for tag: " + key)
      hashSum += abbreviations[key] + value
    }
  }

  operator["width"] = (value:string) => {setValue("width", value)}
  operator["height"] = (value:string) => {setValue("height", value)}
  operator["minHeight"] = (value:string) => {setValue("min-height", value)}
  operator["maxHeight"] = (value:string) => {setValue("max-height", value)}
  operator["minWidth"] = (value:string) => {setValue("min-width", value)}
  operator["maxWidth"] = (value:string) => {setValue("max-width", value)}
  operator["left"] = (value:string) => {setValue("left", value)}
  operator["right"] = (value:string) => {setValue("right", value)}
  operator["top"] = (value:string) => {setValue("top", value)}
  operator["bottom"] = (value:string) => {setValue("bottom", value)}

  operator["paddingLeft"] = (value:string) => {setValue("padding-left", value)}
  operator["paddingRight"] = (value:string) => {setValue("padding-right", value)}
  operator["paddingHorizontal"] = (value:string) => {
    setValue("padding-left", value)
    setValue("padding-right", value)
  }
  operator["paddingTop"] = (value:string) => {setValue("padding-top", value)}
  operator["paddingBottom"] = (value:string) => {setValue("padding-bottom", value)}
  operator["paddingVertical"] = (value:string) => {
    setValue("padding-top", value)
    setValue("padding-bottom", value)
  }
  operator["padding"] = (value:string) => {
    setValue("padding-left", value)
    setValue("padding-right", value)
    setValue("padding-top", value)
    setValue("padding-bottom", value)
  }

  operator["layer"] = (value:LayoutLayer) => {setValue("z-index", value)}
  operator["fixed"] = (value:boolean) => {value && setValue("position", "fixed")}
  operator["absolute"] = (value:boolean) => {value && setValue("position", "absolute")}
  operator["relative"] = (value:boolean) => {value && setValue("position", "relative")}
  operator["enableOwnScroller"] = (value:boolean) => {value && setValue("overflow", "auto")}
  operator["disableScroll"] = (value:boolean) => {value && setValue("overflow", "hidden")}
  operator["disableHorizontalScroll"] = (value:boolean) => {value && setValue("overflow-x", "hidden")}
  operator["disabled"] = (value:boolean) => {value && setValue("cursor", "not-allowed")}

  operator["boxSizing"] = (value:string) => {
    setValue("box-sizing", value)
    setValue("-webkit-box-sizing", value, false);
    setValue("-moz-box-sizing", value, false);
  }

  operator["display"] = (value:string) => {setValue("display", value)}
  operator["gap"] = (value:string) => {setValue("gap", value)}
  operator["flexDirection"] = (value:string) => {setValue("flex-direction", value)}
  operator["flexGrow"] = (value:string) => {setValue("flex-grow", value)}
  operator["alignItems"] = (value:string) => {setValue("align-items", value)}
  operator["justifyContent"] = (value:string) => {setValue("justify-content", value)}
  operator["marginLeft"] = (value:string) => {setValue("margin-left", value)}
  operator["marginRight"] = (value:string) => {setValue("margin-right", value)}
  operator["marginTop"] = (value:string) => {setValue("margin-top", value)}
  operator["marginBottom"] = (value:string) => {setValue("margin-bottom", value)}

  operator["bgColor"] = (value:string) => {setValue("background-color", value)}
  operator["border"] = (value:string | [string, string, string]) => {setValue("border", Array.isArray(value) ? value.join(' ') : value)}
  operator["borderLeft"] = (value:string | [string, string, string]) => {setValue("border-left", Array.isArray(value) ? value.join(' ') : value)}
  operator["borderRight"] = (value:string | [string, string, string]) => {setValue("border-right", Array.isArray(value) ? value.join(' ') : value)}
  operator["borderTop"] = (value:string | [string, string, string]) => {setValue("border-top", Array.isArray(value) ? value.join(' ') : value)}
  operator["borderBottom"] = (value:string | [string, string, string]) => {setValue("border-bottom", Array.isArray(value) ? value.join(' ') : value)}
  operator["cornerRadius"] = (value:string) => {setValue("border-radius", value)}
  operator["opacity"] = (value:string) => {setValue("opacity", value)}
  operator["shadow"] = (value:string) => {setValue("box-shadow", value)}

  operator["fontFamily"] = (value:string) => {setValue("font-family", value)}
  operator["fontSize"] = (value:string) => {setValue("font-size", value)}
  operator["fontWeight"] = (value:string) => {setValue("font-weight", value)}
  operator["textColor"] = (value:string) => {setValue("color", value)}
  operator["textAlign"] = (value:string) => {setValue("text-align", value)}
  operator["textDecoration"] = (value:string) => {setValue("text-decoration", value)}
  operator["textTransform"] = (value:string) => {setValue("text-transform", value)}
  operator["whiteSpace"] = (value:string) => {setValue("white-space", value)}
  operator["caretColor"] = (value:string) => {setValue("caret-color", value)}

  operator["animate"] = (value:string) => {setValue("transition", value)}

  //HOVER
  operator["hoverState"] = (fillPropsFunc:(state:StylableComponentProps)=>void) => {
    const hoverStateProps:any = {}
    fillPropsFunc(hoverStateProps)
    state = "hover"
    hashSum += "HOVER"
    for (let k of [...Object.keys(hoverStateProps)].sort(sortKeys)) {
      if(operator[k]) {
        operator[k](hoverStateProps[k])
      }
    }
    state = "normal"
  }

  //FOCUS
  operator["focusState"] = (fillPropsFunc:(state:StylableComponentProps)=>void) => {
    const focusStateProps:any = {}
    fillPropsFunc(focusStateProps)
    state = "focus"
    hashSum += "FOCUS"
    for (let k of [...Object.keys(focusStateProps)].sort(sortKeys)) {
      if(operator[k]) {
        operator[k](focusStateProps[k])
      }
    }
    state = "normal"
  }

  return [clear, operator, getClassName, addRule]
}

let selectorsCount = 0

const ruleBuilder = RuleBuilder()

const sortKeys = (a: string, b: string) => {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0
}

export const buildClassName = (props:any):string => {
  const [clear, operator, className] = ruleBuilder
  clear()

  for (let k of [...Object.keys(props)].sort(sortKeys)) {
    if(operator[k]) {
      operator[k](props[k])
    }
    // else {
    //   console.warn("  --NoCSS: Operator «" + k + "» not found!")
    // }
  }
  return className()
}

export const buildRule = (props:any, parentSelector:string, childSelector:string):void => {
  const [clear, operator, _, addRule] = ruleBuilder
  clear()

  for (let k of [...Object.keys(props)].sort(sortKeys)) {
    if(operator[k]) {
      operator[k](props[k])
    }
  }
  addRule(parentSelector, childSelector)
}

export interface StylableComponentProps {
  id?: string,
  key?: string,
  width?: string,
  height?: string,
  minWidth?: string,
  minHeight?: string,
  maxWidth?: string,
  maxHeight?: string,
  gap?: string,
  top?: string,
  left?: string,
  right?: string,
  bottom?: string,
  padding?: string,
  paddingLeft?: string,
  paddingRight?: string,
  paddingHorizontal?: string,
  paddingVertical?: string,
  paddingTop?: string,
  paddingBottom?: string,
  fixed?: boolean,
  absolute?: boolean,
  relative?: boolean,
  enableOwnScroller?: boolean,
  disableScroll?: boolean,
  disableHorizontalScroll?: boolean,
  disabled?: boolean,
  layer?: LayoutLayer,
  animate?: string,
  textColor?: string,
  bgColor?: string,
  border?: string | [string, string, string],
  borderLeft?: string | [string, string, string],
  borderRight?: string | [string, string, string],
  borderTop?: string | [string, string, string],
  borderBottom?: string | [string, string, string],
  cornerRadius?: string,
  opacity?: string,
  shadow?: string,
  visible?: boolean,
  className?: string,
  children?: any,
  hoverState?: (state:StylableComponentProps) => void,
}

export const stylable = <T,X extends T & StylableComponentProps>(component: (componentProps:T) => JSX.Element): ((props: X) => JSX.Element) => {
  return ( props: X ) => {
    const className = buildClassName(props)
    return <div key={props.key} id={props.id} className={props.className ? props.className + " " + className : className}>{component(props)}</div>
  }
}