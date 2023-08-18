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

export const Label = (props: LabelProps) => {
  if ('visible' in props && !props.visible) return <></>

  if ('className' in props) {
    return <p className={props.className + ' ' + buildClassName(props)}>{props.text ?? props.children}</p>
  }
  return <p className={buildClassName(props)}>{props.text ?? props.children}</p>
}
