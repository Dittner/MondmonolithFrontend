import {buildAndGetClassName} from "../../application/NoCSS";
import {LayoutLayer} from "../../application/Application";

export enum VAlign {
  TOP = "TOP",
  CENTER = "CENTER",
  BASE = "BASE",
  BOTTOM = "BOTTOM",
  STRETCH = "STRETCH",
}

export enum HAlign {
  LEFT = "LEFT",
  CENTER = "CENTER",
  RIGHT = "RIGHT",
  STRETCH = "STRETCH",
}

interface StackProps {
  halign: HAlign,
  valign: VAlign,
  width?: string,
  height?: string,
  minWidth?: string,
  minHeight?: string,
  maxWidth?: string,
  maxHeight?: string,
  gap?: string,
  padding?: string,
  paddingLeft?: string,
  paddingRight?: string,
  paddingHorizontal?: string,
  paddingVertical?: string,
  paddingTop?: string,
  paddingBottom?: string,
  fixed?: boolean,
  enableOwnScroller?: boolean,
  layer?: LayoutLayer,
  className?: string,
  children: any,
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
    case HAlign.LEFT:
      style["alignItems"] = "flex-start";
      break;
    case HAlign.CENTER:
      style["alignItems"] = "center";
      break;
    case HAlign.RIGHT:
      style["alignItems"] = "flex-end";
      break;
    case HAlign.STRETCH:
      style["alignItems"] = "stretch";
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

  if (props.hasOwnProperty("className"))
    return <div className={props.className + " " + buildAndGetClassName(style)}>{props.children}</div>
  else
    return <div className={buildAndGetClassName(style)}>{props.children}</div>
}

const defHStackProps = {
  "display": "flex",
  "flexDirection": "row",
  "alignItems": "flex-start",
  "justifyContent": "center",
  "height": "100%",
  "gap": "10px",
  "boxSizing": "border-box",
}

export const HStack = (props: StackProps) => {
  const style = {...defHStackProps, ...props}

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
    case VAlign.STRETCH:
      style["alignItems"] = "stretch";
      break;
  }

  if (props.hasOwnProperty("className"))
    return <div className={props.className + " " + buildAndGetClassName(style)}>{props.children}</div>
  else
    return <div className={buildAndGetClassName(style)}>{props.children}</div>
}