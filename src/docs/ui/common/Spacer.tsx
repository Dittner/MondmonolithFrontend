import {buildAndGetClassName} from "../../application/NoCSS";

export const Spacer = ({width, height}:{width?:string, height?:string})=> {
  const style = {
    width: width,
    maxWidth: width,
    minWidth: width,
    height: height,
    maxHeight: height,
    minHeight: height,
  }

  return <div className={"spacer " + buildAndGetClassName(style)}/>
}