import { type Theme } from '../../application/ThemeManager'
import { buildClassName } from '../../application/NoCSS'
import * as React from 'react'
import { useDocsContext } from '../../../App'

/*
*
* Separator
*
* */

interface HSeparatorProps {
  theme: Theme
  visible?: boolean
  width?: string
  marginHorizontal?: string
  marginVertical?: string
}

export const HSeparator = (props: HSeparatorProps) => {
  if (props.visible === false) return <></>

  const style: any = { ...props }
  if (props.width !== undefined) style.width = props.width
  if (props.marginHorizontal !== undefined) {
    style.marginLeft = props.marginHorizontal
    style.marginRight = props.marginHorizontal
  }
  if (props.marginVertical !== undefined) {
    style.marginTop = props.marginVertical
    style.marginBottom = props.marginVertical
  }
  style.bgColor = props.theme.border
  style.height = '1px'
  style.maxHeight = '1px'

  return <div className={buildClassName(style)}/>
}

interface VSeparatorProps {
  visible?: boolean
  height?: string
  marginHorizontal?: string
  marginVertical?: string
}

export const VSeparator = (props: VSeparatorProps) => {
  if (props.visible === false) return <></>
  const theme = useDocsContext().theme

  const style: any = {}
  style.flexGrow = 1

  if (props.marginHorizontal !== undefined) {
    style.marginLeft = props.marginHorizontal
    style.marginRight = props.marginHorizontal
  }
  if (props.marginVertical !== undefined) {
    style.marginTop = props.marginVertical
    style.marginBottom = props.marginVertical
  }
  style.bgColor = theme.border
  style.width = '1px'
  style.maxWidth = '1px'

  if (props.height !== undefined) {
    style.height = props.height
    style.minHeight = props.height
    style.maxHeight = props.height
  }

  return <div className={buildClassName(style)}/>
}
