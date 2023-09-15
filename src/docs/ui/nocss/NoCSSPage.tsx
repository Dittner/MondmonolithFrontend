import React, { useState } from 'react'
import { stylable } from '../../application/NoCSS'
import { AppSize, LayoutLayer } from '../../application/Application'
import { observe, observer } from '../../infrastructure/Observer'
import { useDocsContext } from '../../../App'
import { useNavigate, useParams } from 'react-router-dom'
import { HStack, VStack } from '../common/Container'
import { IconButton, RedButton } from '../common/Button'
import { Label } from '../common/Label'
import { NoCSSIntro } from './NoCSSIntro'
import { NoCSSLabel } from './controls/NoCSSLabel'
import { NoCSSButton } from './controls/NoCSSButton'
import { NoCSSContainer } from './controls/NoCSSContainer'
import { NoCSSSpacer } from './controls/NoCSSSpacerr'
import { Spacer } from '../common/Spacer'
import { NoCSSInput } from './controls/NoCSSInput'

export type ControlLink = 'intro' | 'label' | 'button' | 'container' | 'spacer' | 'input' | 'animation'
export const noCSSControlLinks = Array.of<ControlLink>('intro', 'label', 'button', 'container', 'spacer', 'input', 'animation')

export interface NoCSSPageTheme {
  introContentWidth: string
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
  gray: string
}

const theme: NoCSSPageTheme = {
  introContentWidth: '860px',
  contentWidth: '1800px',
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
  olive: '#ab9b4d',
  gray: '#626b75'
}

export const NoCSSPage = observer(() => {
  console.log('new NoCSSPage')
  const [isNavShown, setIsNavShown] = useState(true)

  const {
    themeManager,
    app
  } = useDocsContext()

  observe(app)

  const navigate = useNavigate()
  const params = useParams()

  themeManager.setUpDarkTheme()

  let ControlView
  switch (params.controlId as ControlLink) {
    case 'label':
      ControlView = <NoCSSLabel theme={theme}/>
      break
    case 'button':
      ControlView = <NoCSSButton theme={theme}/>
      break
    case 'container':
      ControlView = <NoCSSContainer theme={theme}/>
      break
    case 'spacer':
      ControlView = <NoCSSSpacer theme={theme}/>
      break
    case 'input':
      ControlView = <NoCSSInput theme={theme}/>
      break
    case 'animation':
      ControlView = <EmptyView theme={theme}/>
      break
    default:
      ControlView = <NoCSSIntro theme={theme}/>
      break
  }

  const linkSelected = (link: ControlLink) => {
    navigate('/nocss/' + link)
    window.scrollTo(0, 0)
    setIsNavShown(false)
  }

  return <VStack maxWidth="100%"
                 width="100%"
                 height="100%"
                 halign="center"
                 valign="center"
                 bgColor='#eeEEee'
                 gap="20px"
                 disableHorizontalScroll>

    <HStack width='100%' height='50px' valign='center' paddingHorizontal='10px'
            top="0" gap='0' fixed
            layer={LayoutLayer.HEADER}>
      <IconButton icon="menu"
                  visible={!isNavShown && app.size === AppSize.XS}
                  popUp="Open Link's List"
                  onClick={() => { setIsNavShown(true) }}/>

      <Spacer/>

      <RedButton title='Home'
                 visible={!isNavShown || app.size !== AppSize.XS}
                 onClick={() => {
                   navigate('/')
                 }}/>

      <IconButton icon="close"
                  visible={isNavShown && app.size === AppSize.XS}
                  popUp="Close Link's List"
                  onClick={() => { setIsNavShown(false) }}/>
    </HStack>

    {app.size === AppSize.XS &&
      <>
        {isNavShown &&
          <ControlLinkList theme={theme}
                           select={linkSelected}
                           width='100%' height='100vh'
                           fontSize='2rem'/>
        }
        {!isNavShown && ControlView }
      </>
    }

    {app.size !== AppSize.XS &&
      <>
        <ControlLinkList theme={theme}
                         select={linkSelected}
                         left='0' top='0' height='100%' fixed/>
        {ControlView}
      </>
    }
  </VStack>
})

const EmptyView = ({ theme }: { theme: NoCSSPageTheme }) => {
  return <HStack halign="center"
                 valign="center"
                 bgColor={theme.bg}
                 width="100%" height="100vh">
    <Label text='In development' textColor={theme.white}/>
  </HStack>
}

const ControlLinkList = stylable(({
  theme,
  select
}:
{ theme: NoCSSPageTheme, select: (link: ControlLink) => void }) => {
  const params = useParams()
  const { app } = useDocsContext()

  return <VStack halign='left'
                 valign={app.size === AppSize.XS ? 'center' : 'bottom'}
                 gap='0'
                 paddingVertical='50px'
                 bgColor={app.size === AppSize.XS ? theme.bg : '0'}
                 height='100%'>
    {noCSSControlLinks.map(link => {
      const isSelected = params.controlId === link || (link === 'intro' && params.controlId === undefined)
      return <Label key={link}
                    fontSize={app.size === AppSize.XS ? '1.5rem' : '1rem'}
                    className="notSelectable"
                    paddingHorizontal='20px'
                    textColor={isSelected ? theme.controlLinkSelectedColor : theme.controlLinkColor}
                    bgColor={isSelected ? theme.headerBgColor : '0'}
                    text={link}
                    textAlign={app.size === AppSize.XS ? 'center' : 'left'}
                    textTransform='capitalize'
                    width="100%"
                    onClick={() => {
                      select(link)
                    }}
                    hoverState={state => {
                      if (!isSelected) {
                        state.textColor = '#ffFFff'
                        state.bgColor = theme.olive
                        state.btnCursor = true
                      }
                    }}/>
    })}
  </VStack>
})
