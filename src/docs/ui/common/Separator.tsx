import {buildClassName} from "../../application/NoCSS";
import {Theme} from "../../application/ThemeManager";

export const HSeparator = ({theme, width, marginHorizontal, marginVertical}: { theme:Theme, width?: string, marginHorizontal?: string, marginVertical?: string }) => {
  const style = {
    width: width,
    height: "1px",
    maxHeight: "1px",
    marginLeft: marginHorizontal,
    marginRight: marginHorizontal,
    marginTop: marginVertical,
    marginBottom: marginVertical,
    bgColor: theme.border,
  }
  return <div className={buildClassName(style)}/>
}

export const VSeparator = ({theme, height, marginHorizontal, marginVertical}: { theme:Theme, height?: string, marginHorizontal?: string, marginVertical?: string }) => {
  const style = {
    height: height,
    width: "1px",
    maxWidth: "1px",
    marginLeft: marginHorizontal,
    marginRight: marginHorizontal,
    marginTop: marginVertical,
    marginBottom: marginVertical,
    bgColor: theme.border,
  }
  return <div className={buildClassName(style)}/>
}
