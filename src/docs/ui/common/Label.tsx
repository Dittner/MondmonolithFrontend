import { buildClassName, type StylableComponentProps } from '../../application/NoCSS'
import * as React from 'react'

/*
*
* LABEL
*
* */

export interface LabelProps extends StylableComponentProps {
  text?: string
}

const LabelId = 'Lbl'
export const Label = (props: LabelProps) => {
  if ('visible' in props && !props.visible) return <></>

  if ('className' in props) {
    return <p id={LabelId} className={props.className + ' ' + buildClassName(props, LabelId)}>{props.text ?? props.children}</p>
  }
  return <p id={LabelId} className={buildClassName(props, LabelId)}>{props.text ?? props.children}</p>
}
