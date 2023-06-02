export enum VAlign {
  TOP = "TOP",
  CENTER = "CENTER",
  BASE = "BASE",
  BOTTOM = "BOTTOM",
}

export enum HAlign {
  LEFT = "LEFT",
  CENTER = "CENTER",
  RIGHT = "RIGHT",
}


interface StackProps {
  halign: HAlign,
  valign: VAlign,
  width?: string,
  height?: string,
  minWidth?: string,
  minHeight?: string,
  gap?: string,
  paddingLeft?: string,
  paddingRight?: string,
  paddingTop?: string,
  paddingBottom?: string,
  children: any
}

const buildStackStyle = (style: any, props: StackProps) => {
  if (props.hasOwnProperty("width")) style["width"] = props.width
  if (props.hasOwnProperty("height")) style["height"] = props.height
  if (props.hasOwnProperty("minWidth")) style["min-width"] = props.minWidth
  if (props.hasOwnProperty("minHeight")) style["min-height"] = props.minHeight
  if (props.hasOwnProperty("gap")) style["gap"] = props.gap
  if (props.hasOwnProperty("paddingLeft")) style["padding-left"] = props.paddingLeft
  if (props.hasOwnProperty("paddingRight")) style["padding-right"] = props.paddingRight
  if (props.hasOwnProperty("paddingTop")) style["padding-top"] = props.paddingTop
  if (props.hasOwnProperty("paddingBottom")) style["padding-bottom"] = props.paddingBottom
  return style
}

export const VStack = (props: StackProps) => {
  const defStyle = {
    "display": "flex",
    "flex-direction": "column",
    "align-items": "flex-start",
    "justify-content": "center",
    "width": "100%",
    "gap": "10px",
  }

  const style = buildStackStyle(defStyle, props)

  switch (props.halign) {
    case HAlign.LEFT:
      style["align-items"] = "flex-start";
      break;
    case HAlign.CENTER:
      style["align-items"] = "center";
      break;
    case HAlign.RIGHT:
      style["align-items"] = "flex-end";
      break;
  }


  switch (props.valign) {
    case VAlign.TOP:
      style["justify-content"] = "flex-start";
      break;
    case VAlign.CENTER:
      style["justify-content"] = "center";
      break;
    case VAlign.BASE:
      style["align-items"] = "baseline";
      break;
    case VAlign.BOTTOM:
      style["justify-content"] = "flex-end";
      break;
  }

  return <div style={style}>{props.children}</div>
}

export const HStack = (props: StackProps) => {
  const defStyle = {
    "display": "flex",
    "flex-direction": "row",
    "align-items": "flex-start",
    "justify-content": "center",
    "height": "100%",
    "gap": "10px",
    "box-sizing": "border-box",
  }

  const style = buildStackStyle(defStyle, props)

  switch (props.halign) {
    case HAlign.LEFT:
      style["justify-content"] = "flex-start";
      break;
    case HAlign.CENTER:
      style["justify-content"] = "center";
      break;
    case HAlign.RIGHT:
      style["justify-content"] = "flex-end";
      break;
  }

  switch (props.valign) {
    case VAlign.TOP:
      style["align-items"] = "flex-start";
      break;
    case VAlign.CENTER:
      style["align-items"] = "center";
      break;
    case VAlign.BASE:
      style["align-items"] = "baseline";
      break;
    case VAlign.BOTTOM:
      style["align-items"] = "flex-end";
      break;
  }

  return <div style={style}>{props.children}</div>
}