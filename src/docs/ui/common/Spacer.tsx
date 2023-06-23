import {buildClassName} from "../../application/NoCSS";

export const Spacer = ({width, height, visible=true}:{width?:string, height?:string, visible?:boolean})=> {
  const style = {
    width: width,
    maxWidth: width,
    minWidth: width,
    height: height,
    maxHeight: height,
    minHeight: height,
  }

  if(!visible) return <></>

  return <div className={"spacer " + buildClassName(style)}/>
}