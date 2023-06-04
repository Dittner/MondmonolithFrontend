import {buildAndGetClassName} from "../../application/NoCSS";

export const Spacer = ({width, height}:{width?:string, height?:string})=> {
  const style = {
    width: width,
    height: height,
  }

  return <div className={"spacer " + buildAndGetClassName(style)}/>
}