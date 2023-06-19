import {LayoutLayer} from "./Application";
import * as React from "react";

const abbreviations:{[prop: string]:string} = {
  "align-items": "A",
  "bottom": "B",
  "box-sizing": "S",
  "display" : "D",
  "flex-direction" : "F",
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
  "overflow": "O",
  "padding-left": "PL",
  "padding-right": "PR",
  "padding-top": "PT",
  "padding-bottom": "PB",
  "position": "P",
  "right": "R",
  "top": "T",
  "transition": "TR",
  "width": "W",
  "z-index": "Z",
}

const RuleBuilder = ():[()=>void, { [key: string]: (value:any)=>void }, ()=>string] =>  {
  let hashSum:string = ""
  let style = ""
  const notAllowedSymbolsInClassName = /[%. ]+/g;
  const classNameHash = new Map<string,string>()

  //const styleSheet = new CSSStyleSheet();
  //document.adoptedStyleSheets = [styleSheet];
  const styleSheet = window.document.styleSheets[0];

  const operator: { [key: string]: (value:any)=>void } = Object.create(null)

  const className = ():string => {
    if(!hashSum) return ""

    if(classNameHash.has(hashSum))
      return classNameHash.get(hashSum) as string

    const className = hashSum.replace(notAllowedSymbolsInClassName, 'x')

    console.log("  --new selectorName: ", className)
    console.log("  --selectorsCount: ", ++selectorsCount)

    const rule = '.' + className + style + '}';
    classNameHash.set(hashSum, className)
    styleSheet.insertRule(rule)

    return className
  }

  const clear = ():void => {
    hashSum = ""
    style = "{box-sizing:border-box;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;"
  }

  const setValue = (key:string, value:string, appendToClassName:boolean = true) => {
    style += key + ':' + value + ';'

    if(appendToClassName) {
      if(!abbreviations.hasOwnProperty(key))
        throw new Error("SelectorRuleBuilder:: No abbreviation for tag: " + key)
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
  operator["fixed"] = (value:boolean) => {setValue("position", "fixed")}
  operator["absolute"] = (value:boolean) => {setValue("position", "absolute")}
  operator["relative"] = (value:boolean) => {setValue("position", "relative")}
  operator["enableOwnScroller"] = (value:boolean) => {setValue("overflow", "auto")}

  operator["boxSizing"] = (value:string) => {
    setValue("box-sizing", value)
    setValue("-webkit-box-sizing", value, false);
    setValue("-moz-box-sizing", value, false);
  }

  operator["display"] = (value:string) => {setValue("display", value)}
  operator["gap"] = (value:string) => {setValue("gap", value)}
  operator["flexDirection"] = (value:string) => {setValue("flex-direction", value)}
  operator["alignItems"] = (value:string) => {setValue("align-items", value)}
  operator["justifyContent"] = (value:string) => {setValue("justify-content", value)}
  operator["marginLeft"] = (value:string) => {setValue("margin-left", value)}
  operator["marginRight"] = (value:string) => {setValue("margin-right", value)}
  operator["marginTop"] = (value:string) => {setValue("margin-top", value)}
  operator["marginBottom"] = (value:string) => {setValue("margin-bottom", value)}

  operator["animate"] = (value:string) => {setValue("transition", value)}

  return [clear, operator, className]
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

export interface StylableComponentProps {
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
  layer?: LayoutLayer,
  animate?: string,
  className?: string,
  children?: any,
}

export const stylable = <T,X extends T & StylableComponentProps>(component: (componentProps:T) => JSX.Element): ((props: X) => JSX.Element) => {
  return ( props: X ) => {
    const className = buildClassName(props)
    return <div className={props.className ? props.className + " " + className : className}>{component(props)}</div>
  }
}

export const StylableContainer = stylable((props:any)=> {
  return props.className ? <div className={props.className}>{props.children}</div> : <div>{props.children}</div>
})

interface StackProps extends StylableComponentProps{
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
    return <div className={props.className + " " + buildClassName(style)}>{props.children}</div>
  else
    return <div className={buildClassName(style)}>{props.children}</div>
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
    return <div className={props.className + " " + buildClassName(style)}>{props.children}</div>
  else
    return <div className={buildClassName(style)}>{props.children}</div>
}

const defStackProps = {
  "boxSizing": "border-box",
}

export const Stack = (props: StylableComponentProps) => {
  const style = {...defStackProps, ...props}
  if (props.hasOwnProperty("className"))
    return <div className={props.className + " " + buildClassName(style)}>{props.children}</div>
  else
    return <div className={buildClassName(style)}>{props.children}</div>
}