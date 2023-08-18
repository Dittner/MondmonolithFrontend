import { buildClassName, type StylableComponentProps } from '../../application/NoCSS'
import { useDocsContext } from '../../../App'
import * as React from 'react'
import { StylableContainer } from './Container'

interface ButtonProps extends StylableComponentProps {
  title?: string
  popUp?: string
  visible?: boolean
  disabled?: boolean
  isSelected?: boolean
}

/*
*
* BUTTON
*
* */

export const Button = (props: ButtonProps) => {
  if ('visible' in props && !props.visible) return <></>

  const className = 'className' in props ? props.className + ' ' + buildClassName(props) : buildClassName(props)

  return <button className={className}
                 title={props.popUp}
                 onClick={(e) => {
                   if (!props.disabled) {
                     e.stopPropagation()
                     props.onClick?.()
                   }
                 }}>{props.title ?? props.children}</button>
}

export const RedButton = (props: ButtonProps) => {
  if ('visible' in props && !props.visible) return <></>
  const theme = useDocsContext().theme
  const className = 'className' in props ? props.className + ' ' + buildClassName(props) : buildClassName(props)

  if (props.disabled) {
    return <Button className={className}
                   title={props.title}
                   textColor={theme.text75}
                   paddingHorizontal="10px"
                   disabled/>
  }

  const isSelected = 'isSelected' in props && props.isSelected
  return <Button className={className}
                 title={props.title}
                 textColor={isSelected ? theme.white : theme.red}
                 bgColor={theme.isDark && isSelected ? theme.red : '0'}
                 paddingHorizontal="10px"
                 hoverState={state => {
                   state.textColor = theme.white
                   state.bgColor = theme.isDark ? theme.transparent : theme.red
                 }}
                 onClick={props.onClick}/>
}

export const LargeButton = (props: ButtonProps) => {
  if ('visible' in props && !props.visible) return <></>
  const theme = useDocsContext().theme
  const className = 'className' in props ? props.className + ' ' + buildClassName(props) : buildClassName(props)

  if (props.disabled) {
    return <Button className={className}
                   title={props.title}
                   bgColor='#a23f4b50'
                   textColor={theme.text75}
                   paddingHorizontal="20px"
                   disabled/>
  }

  return <Button className={className}
                 title={props.title}
                 textColor={theme.white}
                 bgColor='#a23f4b'
                 paddingHorizontal="20px"
                 hoverState={state => {
                   state.bgColor = '#bd404d'
                 }}
                 onClick={props.onClick}/>
}

export const TextButton = (props: ButtonProps) => {
  if ('visible' in props && !props.visible) return <></>
  const theme = useDocsContext().theme
  const className = 'className' in props ? props.className + ' ' + buildClassName(props) : buildClassName(props)

  return <Button className={className}
                 title={props.title}
                 textColor={theme.red}
                 disabled={props.disabled}
                 hoverState={state => {
                   state.textDecoration = 'underline'
                 }}
                 onClick={props.onClick}/>
}

export const Switcher = ({
  color,
  selectionColor,
  isSelected,
  disabled,
  onClick
}: { color: string, selectionColor: string, isSelected: boolean, disabled: boolean, onClick: () => void }) => {
  const btnWidth = '34px'
  const btnHeight = '22px'
  const thumbDiameter = '16px'
  const click = () => {
    if (!disabled) onClick()
  }
  return <StylableContainer disabled={disabled}
                            width={btnWidth}
                            height={btnHeight}
                            bgColor={isSelected ? selectionColor : '#727a8690'}
                            cornerRadius={btnHeight}
                            animate="background-color 300ms"
                            btnCursor
                            onClick={click}>

    <StylableContainer width={thumbDiameter}
                       height={thumbDiameter}
                       cornerRadius={thumbDiameter}
                       bgColor={color}
                       top="3px"
                       left={isSelected ? '15px' : '3px'}
                       animate="left 300ms"
                       relative/>
  </StylableContainer>
}

type IconType =
  'sun'
  | 'moon'
  | 'down'
  | 'up'
  | 'scrollBack'
  | 'nextPage'
  | 'prevPage'
  | 'close'
  | 'menu'
  | 'plus'
  | 'delete'
  | 'edit'

interface IconButtonProps extends ButtonProps {
  icon: IconType
}

export const IconButton = (props: IconButtonProps) => {
  if ('visible' in props && !props.visible) return <></>
  const theme = useDocsContext().theme
  const className = 'className' in props ? props.className + ' ' + buildClassName(props) : buildClassName(props)

  if (props.disabled) {
    return <Button className={className + ' icon-' + props.icon}
                   paddingHorizontal='10px'
                   popUp={props.popUp}
                   textColor={theme.text75}
                   disabled/>
  }

  return <Button className={className + ' icon-' + props.icon}
                 paddingHorizontal='10px'
                 popUp={props.popUp}
                 textColor={theme.red}
                 hoverState={state => {
                   state.textColor = theme.white
                   state.bgColor = theme.isDark ? theme.transparent : theme.red
                 }}
                 onClick={props.onClick}/>
}
