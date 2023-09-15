import { buildClassName, type StylableComponentProps } from '../../application/NoCSS'
import { useDocsContext } from '../../../App'
import * as React from 'react'
import { StylableContainer } from './Container'

/*
*
* BUTTON
*
* */

export interface ButtonProps extends StylableComponentProps {
  title?: string
  popUp?: string
  visible?: boolean
  disabled?: boolean
  isSelected?: boolean
  selectedState?: (state: StylableComponentProps) => void
  disabledState?: (state: StylableComponentProps) => void
}

const BaseButton = (props: ButtonProps) => {
  if ('visible' in props && !props.visible) return <></>
  let className = buildClassName(props)
  if ('className' in props) className += ' ' + props.className

  return <button id='NoCSSBtn'
                 className={className}
                 title={props.popUp}
                 onClick={(e) => {
                   if (!props.disabled) {
                     e.stopPropagation()
                     props.onClick?.()
                   }
                 }}>{props.title ?? props.children}</button>
}

const defBtnProps = {
  textColor: '#eeEEee',
  bgColor: '#3a4448',
  selectedBgColor: '#212628',
  paddingHorizontal: '10px',
  hoverState: (state: StylableComponentProps) => {
    state.bgColor = '#212628'
  }
}

export const Button = (props: ButtonProps) => {
  const isDisabled = 'disabled' in props && props.disabled
  if (isDisabled) {
    const style = { ...props }
    if (props.disabledState) props.disabledState(style)
    return <BaseButton textColor={defBtnProps.textColor}
                       bgColor={defBtnProps.bgColor}
                       paddingHorizontal={defBtnProps.paddingHorizontal}
                       opacity='0.5'
                       {...style}
                       hoverState={_ => {
                       }}/>
  }

  const isSelected = 'isSelected' in props && props.isSelected
  if (isSelected) {
    const style = { ...props }
    if (props.selectedState) props.selectedState(style)
    return <BaseButton textColor={defBtnProps.textColor}
                       bgColor={defBtnProps.selectedBgColor}
                       paddingHorizontal={defBtnProps.paddingHorizontal}
                       {...style}/>
  }

  return <BaseButton textColor={defBtnProps.textColor}
                     bgColor={defBtnProps.bgColor}
                     paddingHorizontal={defBtnProps.paddingHorizontal}
                     hoverState={defBtnProps.hoverState}
                     {...props}/>
}

export const RedButton = (props: ButtonProps) => {
  if ('visible' in props && !props.visible) return <></>
  const theme = useDocsContext().theme

  return <Button textColor={theme.red}
                 bgColor={undefined}
                 hoverState={state => {
                   state.textColor = theme.white
                   state.bgColor = theme.isDark ? theme.transparent : theme.red
                 }}
                 selectedState={state => {
                   state.textColor = theme.white
                   state.bgColor = theme.isDark ? theme.red : '0'
                 }}
                 disabledState={state => {
                   state.textColor = theme.text75
                 }}
                 {...props}/>
}

export const LargeButton = (props: ButtonProps) => {
  if ('visible' in props && !props.visible) return <></>
  const theme = useDocsContext().theme

  return <Button textColor={theme.white}
                 bgColor='#a23f4b'
                 paddingHorizontal="20px"
                 hoverState={state => {
                   state.bgColor = '#bd404d'
                 }}
                 disabledState={state => {
                   state.opacity = '1'
                   state.bgColor = '#a23f4b50'
                   state.textColor = theme.text75
                 }}
                 onClick={props.onClick}
                 {...props}/>
}

export const TextButton = (props: ButtonProps) => {
  if ('visible' in props && !props.visible) return <></>
  const theme = useDocsContext().theme

  return <Button title={props.title}
                 bgColor={undefined}
                 textColor={theme.red}
                 hoverState={state => {
                   state.textDecoration = 'underline'
                 }}
                 {...props}/>
}

/*
*
* Switcher
*
* */

export interface SwitcherProps {
  width?: number
  height?: number
  borderWidth?: number
  thumbColor?: string
  selectedThumbColor?: string
  bgColor?: string
  selectedBgColor?: string
  visible?: boolean
  disabled?: boolean
  isSelected?: boolean
  onClick?: () => void
}

export const BaseSwitcher = (props: SwitcherProps) => {
  const width = props.width ?? 34
  const height = props.height ?? 22
  const borderWidth = props.borderWidth ?? 3
  const thumbDiameter = height - 2 * borderWidth

  const click = () => {
    if (!props.disabled) props.onClick?.()
  }
  return <StylableContainer disabled={props.disabled}
                            width={width + 'px'}
                            height={height + 'px'}
                            bgColor={props.isSelected ? props.selectedBgColor ?? props.bgColor : props.bgColor}
                            cornerRadius={height + 'px'}
                            animate='background-color 300ms'
                            btnCursor
                            onClick={click}>

    <StylableContainer width={thumbDiameter + 'px'}
                       height={thumbDiameter + 'px'}
                       cornerRadius={thumbDiameter + 'px'}
                       bgColor={props.isSelected ? props.selectedThumbColor ?? props.thumbColor : props.thumbColor}
                       top='3px'
                       left={(props.isSelected ? width - thumbDiameter - borderWidth : borderWidth) + 'px'}
                       animate='left 300ms'
                       relative/>
  </StylableContainer>
}

export const Switcher = (props: SwitcherProps) => {
  const { theme } = useDocsContext()
  return <BaseSwitcher bgColor='#727a8690'
                       selectedBgColor={theme.red}
                       thumbColor={theme.appBg}
                       {...props}/>
}

/*
*
* IconButton
*
* */

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

  return <Button className={'icon-' + props.icon}
                 bgColor={undefined}
                 textColor={theme.red}
                 hoverState={state => {
                   state.textColor = theme.white
                   state.bgColor = theme.isDark ? theme.transparent : theme.red
                 }}
                 disabledState={state => {
                   state.opacity = '1'
                   state.textColor = theme.text75
                 }}
                 onClick={props.onClick}
                 {...props}/>
}
