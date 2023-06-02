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
  if (props.hasOwnProperty("minWidth")) style["minWidth"] = props.minWidth
  if (props.hasOwnProperty("minHeight")) style["minHeight"] = props.minHeight
  if (props.hasOwnProperty("gap")) style["gap"] = props.gap
  if (props.hasOwnProperty("paddingLeft")) style["paddingLeft"] = props.paddingLeft
  if (props.hasOwnProperty("paddingRight")) style["paddingRight"] = props.paddingRight
  if (props.hasOwnProperty("paddingTop")) style["paddingTop"] = props.paddingTop
  if (props.hasOwnProperty("paddingBottom")) style["paddingBottom"] = props.paddingBottom
  return style
}

export const VStack = (props: StackProps) => {
  const defStyle = {
    "display": "flex",
    "flexDirection": "column",
    "alignItems": "flex-start",
    "justifyContent": "center",
    "width": "100%",
    "gap": "10px",
  }

  const style = buildStackStyle(defStyle, props)

  switch (props.halign) {
    case HAlign.LEFT:
      style["alignItems"] = "flex-start";
      break;
    case HAlign.CENTER:
      style["alignItems"] = "center";
      break;
    case HAlign.RIGHT:
      style["alignItems"] = "flex-end";
      break;
  }


  switch (props.valign) {
    case VAlign.TOP:
      style["justifyContent"] = "flex-start";
      break;
    case VAlign.CENTER:
      style["justifyContent"] = "center";
      break;
    case VAlign.BASE:
      style["alignItems"] = "baseline";
      break;
    case VAlign.BOTTOM:
      style["justifyContent"] = "flex-end";
      break;
  }

  return <div style={style}>{props.children}</div>
}

export const HStack = (props: StackProps) => {
  const defStyle = {
    "display": "flex",
    "flexDirection": "row",
    "alignItems": "flex-start",
    "justifyContent": "center",
    "height": "100%",
    "gap": "10px",
    "boxSizing": "border-box",
  }

  const style = buildStackStyle(defStyle, props)

  switch (props.halign) {
    case HAlign.LEFT:
      style["justifyContent"] = "flex-start";
      break;
    case HAlign.CENTER:
      style["justifyContent"] = "center";
      break;
    case HAlign.RIGHT:
      style["justifyContent"] = "flex-end";
      break;
  }

  switch (props.valign) {
    case VAlign.TOP:
      style["alignItems"] = "flex-start";
      break;
    case VAlign.CENTER:
      style["alignItems"] = "center";
      break;
    case VAlign.BASE:
      style["alignItems"] = "baseline";
      break;
    case VAlign.BOTTOM:
      style["alignItems"] = "flex-end";
      break;
  }

  return <div style={style}>{props.children}</div>
}