import { buildClassName, type StylableComponentProps } from '../../application/NoCSS'
import * as React from 'react'

/*
*
* LABEL
*
* */

type LabelType = 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
export interface LabelProps extends StylableComponentProps {
  text?: string
  type?: LabelType | undefined
}

const LabelId = 'NoCSSLbl'
export const Label = (props: LabelProps) => {
  if ('visible' in props && !props.visible) return <></>

  let className = 'className' in props ? props.className + ' ' : ''
  className += buildClassName(props, LabelId) + ' '
  className += props.type ? props.type : 'p'

  switch (props.type) {
    case 'p': return <p id={LabelId} className={className} onClick={props.onClick}>{props.text ?? props.children}</p>
    case 'h1': return <h1 id={LabelId} className={className} onClick={props.onClick}>{props.text ?? props.children}</h1>
    case 'h2': return <h2 id={LabelId} className={className} onClick={props.onClick}>{props.text ?? props.children}</h2>
    case 'h3': return <h3 id={LabelId} className={className} onClick={props.onClick}>{props.text ?? props.children}</h3>
    case 'h4': return <h4 id={LabelId} className={className} onClick={props.onClick}>{props.text ?? props.children}</h4>
    case 'h5': return <h5 id={LabelId} className={className} onClick={props.onClick}>{props.text ?? props.children}</h5>
    case 'h6': return <h6 id={LabelId} className={className} onClick={props.onClick}>{props.text ?? props.children}</h6>
    default: return <p id={LabelId} className={className} onClick={props.onClick}>{props.text ?? props.children}</p>
  }
}
