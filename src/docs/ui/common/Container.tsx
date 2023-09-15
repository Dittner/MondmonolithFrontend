import { buildClassName, type StylableComponentProps } from '../../application/NoCSS'
import * as React from 'react'

/*
*
* STACK
*
* */

export type StackHAlign = 'left' | 'right' | 'center' | 'stretch'
export type StackVAlign = 'top' | 'center' | 'base' | 'bottom' | 'stretch'

export interface StackProps extends StylableComponentProps {
  halign?: StackHAlign
  valign?: StackVAlign
}

const defVStackProps = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
  width: '100%',
  gap: '10px',
  boxSizing: 'border-box'
}

export const VStack = (props: StackProps) => {
  const style = { ...defVStackProps, ...props }

  switch (props.halign) {
    case 'left':
      style.alignItems = 'flex-start'
      break
    case 'center':
      style.alignItems = 'center'
      break
    case 'right':
      style.alignItems = 'flex-end'
      break
    case 'stretch':
      style.alignItems = 'stretch'
      break
    default:
      style.alignItems = 'flex-start'
  }

  switch (props.valign) {
    case 'top':
      style.justifyContent = 'flex-start'
      break
    case 'center':
      style.justifyContent = 'center'
      break
    case 'base':
      style.alignItems = 'baseline'
      break
    case 'bottom':
      style.justifyContent = 'flex-end'
      break
    case 'stretch':
      style.justifyContent = 'space-between'
      break
    default:
      style.alignItems = 'flex-start'
  }

  let className = buildClassName(style)
  if ('className' in props) className += ' ' + props.className

  return <div id={props.id}
              key={props.key}
              className={className}
              onMouseDown={props.onMouseDown}
              onClick={props.onClick}
              onDoubleClick={props.onDoubleClick}>
    {props.children}</div>
}

const defHStackProps = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  justifyContent: 'center',
  gap: '10px',
  boxSizing: 'border-box',
  wrap: false
}

export const HStack = (props: StackProps) => {
  const style = { ...defHStackProps, ...props }

  switch (props.halign) {
    case 'left':
      style.justifyContent = 'flex-start'
      break
    case 'center':
      style.justifyContent = 'center'
      break
    case 'right':
      style.justifyContent = 'flex-end'
      break
    case 'stretch':
      style.justifyContent = 'space-between'
      break
    default:
      style.alignItems = 'flex-start'
  }

  switch (props.valign) {
    case 'top':
      style.alignItems = 'flex-start'
      break
    case 'center':
      style.alignItems = 'center'
      break
    case 'base':
      style.alignItems = 'baseline'
      break
    case 'bottom':
      style.alignItems = 'flex-end'
      break
    case 'stretch':
      style.alignItems = 'stretch'
      break
    default:
      style.alignItems = 'flex-start'
  }

  let className = buildClassName(style)
  if ('className' in props) className += ' ' + props.className

  return <div id={props.id}
              key={props.key}
              className={className}
              onClick={props.onClick}
              onMouseDown={props.onMouseDown}
              onDoubleClick={props.onDoubleClick}>
    {props.children}
  </div>
}

export const StylableContainer = (props: StylableComponentProps) => {
  const style = { boxSizing: 'border-box', ...props }
  let className = buildClassName(style)
  if ('className' in props) className += ' ' + props.className

  return <div id={props.id}
              key={props.key}
              className={className}
              onClick={props.onClick}
              onMouseDown={props.onMouseDown}
              onDoubleClick={props.onDoubleClick}>
    {props.children}
  </div>
}
