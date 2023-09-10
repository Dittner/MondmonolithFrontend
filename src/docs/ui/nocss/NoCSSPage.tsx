import React from 'react'
import { stylable } from '../../application/NoCSS'
import { LayoutLayer } from '../../application/Application'
import { observer } from '../../infrastructure/Observer'
import { useDocsContext } from '../../../App'
import { useNavigate, useParams } from 'react-router-dom'
import { HStack, VStack } from '../common/Container'
import { RedButton } from '../common/Button'
import { Label } from '../common/Label'
import { NoCSSIntro } from './NoCSSIntro'
import { NoCSSLabel } from './controls/NoCSSLabel'
import { NoCSSButton } from './controls/NoCSSButton'

export type ControlLink = 'intro' | 'label' | 'button' | 'container' | 'spacer' | 'separator'
export const noCSSControlLinks = Array.of<ControlLink>('intro', 'label', 'button', 'container', 'spacer', 'separator')

export interface NoCSSPageTheme {
  contentWidth: string
  headerFontSize: string
  headerBgColor: string
  bg: string
  darkTextColor: string
  controlLinkColor: string
  controlLinkSelectedColor: string
  white: string
  orange: string
  red: string
  olive: string
  redDark: string
}

const theme: NoCSSPageTheme = {
  contentWidth: '860px',
  headerFontSize: '60px',
  headerBgColor: '#292f32',
  bg: '#292f32',
  darkTextColor: '#111314',
  controlLinkColor: '#c5781f',
  controlLinkSelectedColor: '#ffFFff',
  white: '#c7d7e5',
  orange: '#c5781f',
  red: '#e2777a',
  redDark: '#7f4045',
  olive: '#ab9b4d'
}

export const NoCSSPage = observer(() => {
  console.log('new NoCSSPage')

  const { themeManager } = useDocsContext()
  const navigate = useNavigate()
  const params = useParams()

  themeManager.setUpDarkTheme()

  let ControlView
  switch (params.controlId as ControlLink) {
    case 'label': ControlView = <NoCSSLabel theme={theme}/>; break
    case 'button': ControlView = <NoCSSButton theme={theme}/>; break
    case 'container': ControlView = <EmptyView theme={theme}/>; break
    case 'spacer': ControlView = <EmptyView theme={theme}/>; break
    case 'separator': ControlView = <EmptyView theme={theme}/>; break
    default: ControlView = <NoCSSIntro theme={theme}/>; break
  }

  return <VStack maxWidth="100%"
                 width="100%"
                 height="100%"
                 halign="center"
                 valign="center"
                 bgColor='#ffFFff'
                 gap="20px"
                 disableHorizontalScroll>

    <ControlLinkList theme={theme} left='0' top='0' height='100%' fixed/>

    <RedButton title='Home'
               top="0" right='10px' fixed
               layer={LayoutLayer.HEADER}
               onClick={() => {
                 navigate('/')
               }}/>

    {ControlView}
  </VStack>
})

const EmptyView = ({ theme }: { theme: NoCSSPageTheme }) => {
  return <HStack halign="center"
                 valign="center"
                 bgColor={theme.bg}
                 width="100%" height="100vh">
    <Label text='The control is being developed' textColor={theme.white}/>
  </HStack>
}

const ControlLinkList = stylable(({ theme }: { theme: NoCSSPageTheme }) => {
  const navigate = useNavigate()
  const params = useParams()

  return <VStack halign='left' valign='bottom' gap='0'
                 paddingVertical='50px'
                 height='100%'>
    {noCSSControlLinks.map(link => {
      const isSelected = params.controlId === link || (link === 'intro' && params.controlId === undefined)
      return <Label key={link}
                    className="notSelectable"
                    textColor={isSelected ? theme.controlLinkSelectedColor : theme.controlLinkColor}
                    bgColor={isSelected ? theme.headerBgColor : '0'}
                    text={link}
                    textAlign="right"
                    textTransform='capitalize'
                    width="100%"
                    paddingHorizontal='20px'
                    onClick={() => {
                      console.log('navigated to', link)
                      navigate('/nocss/' + link)
                    }}
                    hoverState={state => {
                      if (!isSelected) {
                        state.textColor = '#ffFFff'
                        state.bgColor = theme.headerBgColor
                      }
                    }}/>
    })}
  </VStack>
})
