import { buildClassName, type StylableComponentProps } from '../../application/NoCSS'
import * as React from 'react'

/*
*
* LABEL
*
* */

export interface LabelProps extends StylableComponentProps {
  text?: string
  textAlign?: 'left' | 'right' | 'center'
  textDecoration?: 'none' | 'underline'
  whiteSpace?: 'normal' | 'pre' | 'pre-wrap' | 'nowrap'
  overflow?: 'auto' | 'hidden' | 'clip'
  textOverflow?: 'auto' | 'ellipsis' | 'clip' | 'fade'
  textTransform?: 'none' | 'uppercase' | 'capitalize' | 'lowercase'
}

export const Label = (props: LabelProps) => {
  if ('visible' in props && !props.visible) return <></>

  if ('className' in props) {
    return <p className={props.className + ' ' + buildClassName(props)}>{props.text ?? props.children}</p>
  }
  return <p className={buildClassName(props)}>{props.text ?? props.children}</p>
}
