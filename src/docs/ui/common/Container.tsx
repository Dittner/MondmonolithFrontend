import { buildClassName, type StylableComponentProps } from '../../application/NoCSS'
import * as React from 'react'

/*
*
* STACK
*
* */

interface ClickableComponentProps extends StylableComponentProps {
  onClick?: (e: any) => void
  onMouseDown?: (e: any) => void
  onDoubleClick?: (e: any) => void
}

export interface StackProps extends ClickableComponentProps {
  halign: 'left' | 'right' | 'center' | 'stretch'
  valign: 'top' | 'center' | 'base' | 'bottom' | 'stretch'
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
  }

  if ('className' in props) {
    return <div id={props.id}
                className={props.className + ' ' + buildClassName(style)}
                onMouseDown={props.onMouseDown}
                onClick={props.onClick}
                onDoubleClick={props.onDoubleClick}>
      {props.children}</div>
  } else {
    return <div id={props.id}
                className={buildClassName(style)}
                onMouseDown={props.onMouseDown}
                onClick={props.onClick}
                onDoubleClick={props.onDoubleClick}>
      {props.children}</div>
  }
}

const defHStackProps = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  justifyContent: 'center',
  gap: '10px',
  boxSizing: 'border-box'
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
  }

  if ('className' in props) {
    return <div id={props.id}
                className={props.className + ' ' + buildClassName(style)}
                onClick={props.onClick}
                onMouseDown={props.onMouseDown}
                onDoubleClick={props.onDoubleClick}>
      {props.children}
    </div>
  } else {
    return <div id={props.id}
                className={buildClassName(style)}
                onClick={props.onClick}
                onMouseDown={props.onMouseDown}
                onDoubleClick={props.onDoubleClick}>
      {props.children}</div>
  }
}

export const StylableContainer = (props: ClickableComponentProps) => {
  const style = { boxSizing: 'border-box', ...props }
  const className = 'className' in props ? props.className + ' ' + buildClassName(style) : buildClassName(style)
  return <div id={props.id}
              key={props.key}
              className={className}
              onClick={props.onClick}
              onMouseDown={props.onMouseDown}
              onDoubleClick={props.onDoubleClick}>
    {props.children}
  </div>
}
