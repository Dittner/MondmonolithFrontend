import {buildClassName} from "../../application/NoCSS";

export const HSeparator = ({width, marginHorizontal, marginVertical}: { width?: string, marginHorizontal?: string, marginVertical?: string }) => {
  const style = {
    width: width,
    height: "1px",
    maxHeight: "1px",
    marginLeft: marginHorizontal,
    marginRight: marginHorizontal,
    marginTop: marginVertical,
    marginBottom: marginVertical
  }
  return <div className={"horSeparator " + buildClassName(style)}/>
}

export const VSeparator = ({height, marginHorizontal, marginVertical}: { height?: string, marginHorizontal?: string, marginVertical?: string }) => {
  const style = {
    height: height,
    width: "1px",
    maxWidth: "1px",
    marginLeft: marginHorizontal,
    marginRight: marginHorizontal,
    marginTop: marginVertical,
    marginBottom: marginVertical
  }
  return <div className={"verSeparator " + buildClassName(style)}/>
}
