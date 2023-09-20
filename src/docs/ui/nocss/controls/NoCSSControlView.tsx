import { type ControlLink, noCSSControlLinks, type NoCSSPageTheme } from '../NoCSSPage'
import { useDocsContext } from '../../../../App'
import { HStack, VStack } from '../../common/Container'
import { AppSize } from '../../../application/Application'
import { Label } from '../../common/Label'
import { Spacer } from '../../common/Spacer'
import { HSeparator, VSeparator } from '../../common/Separator'
import { stylable } from '../../../application/NoCSS'
import { useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import Prism from 'prismjs'
import { observe, observer } from '../../../infrastructure/Observer'
import { Button } from '../../common/Button'
import * as React from 'react'
import { useNavigate } from 'react-router-dom'

export interface NoCSSControlViewProps {
  title: string
  subTitle: string
  controlLink: ControlLink
  theme: NoCSSPageTheme
  children: any
}

export const NoCSSControlView = observer((props: NoCSSControlViewProps) => {
  console.log('new NoCSSControlView')
  const { app } = useDocsContext()
  const navigate = useNavigate()
  observe(app)
  const theme = props.theme
  const controlIndex = noCSSControlLinks.findIndex(link => link === props.controlLink)
  const prevLink = controlIndex > 0 ? noCSSControlLinks.at(controlIndex - 1) : undefined
  const nextLink = controlIndex < noCSSControlLinks.length - 1 ? noCSSControlLinks.at(controlIndex + 1) : undefined

  const navigateTo = (link: string) => {
    navigate('/nocss/' + link)
    window.scrollTo(0, 0)
  }

  return (
    <VStack className={theme.id}
            width="100%" height="100%" minHeight='100vh'
            bgColor={theme.bg}
            halign="center"
            paddingLeft={app.size !== AppSize.XS ? '200px' : '40px'}
            paddingRight='40px'
            valign="top"
            gap="20px"
            disableHorizontalScroll>

      <VStack halign='stretch' valign='top'
              width="100%" maxWidth={theme.contentWidth} gap='0'
              paddingTop='40px'>

        <Label className='h2'
               text={props.title}
               width='100%'
               fontSize={theme.headerFontSize}
               textColor={theme.orange}/>

        <Label className='p'
               text={props.subTitle}
               width='100%'
               marginTop='-10px'
               paddingBottom='30px'
               textColor={theme.gray}/>

        {props.children}

        <HStack halign='stretch' valign='center' marginHorizontal='-20px'>
          {prevLink &&
            <Button onClick={() => { navigateTo(prevLink) }}
                    height='45px'
                    bgColor={undefined}
                    textColor={theme.orange}
                    hoverState={state => {
                      state.textColor = theme.white
                    }}>
              <span className="icon icon-prev"/>
              <span>  {prevLink.toUpperCase()}</span>
            </Button>
          }

          <Spacer/>

          {nextLink &&
            <Button onClick={() => { navigateTo(nextLink) }}
                    height='45px'
                    bgColor={undefined}
                    textColor={theme.orange}
                    hoverState={state => {
                      state.textColor = theme.white
                    }}>
              <span>{nextLink.toUpperCase()}  </span>
              <span className="icon icon-next"/>
            </Button>
          }
        </HStack>

        <HSeparator height='50px' marginHorizontal='-20px' color={theme.orange + '88'}/>

      </VStack>
    </VStack>
  )
})

interface MarkdownBlockProps {
  title: string
  cssText: string
  noCSSText: string
  theme: NoCSSPageTheme
  children: any
}

export const MarkdownBlock = observer((props: MarkdownBlockProps) => {
  console.log('new MarkdownBlock')
  const { app } = useDocsContext()
  observe(app)

  if (app.size === AppSize.S || app.size === AppSize.XS) {
    return (
      <VStack halign="stretch"
              valign="top"
              gap="10px"
              paddingVertical='40px'
              width="100%">

        <Label type="h2"
               text={props.title}
               textColor={props.theme.white}
               bgColor={props.theme.redDark}
               marginHorizontal='-20px'
               padding='20px'
               whiteSpace="pre"/>

        <HStack halign='left' valign='center'
                padding='20px' marginHorizontal='-20px'
                bgColor='#33414850'
                wrap>
          {props.children}
        </HStack>

        <Label text='CSS'
               fontSize='14px'
               textAlign='center'
               height='30px'
               width='100%'
               padding='5px'
               textColor='#c70091'/>

        <MarkdownText value={props.cssText}
                      width="100%"/>

        <Label text='NoCSS'
               textAlign='center'
               height='30px'
               fontSize='14px'
               width='100%'
               padding='5px'
               textColor='#8300d5'/>

        <MarkdownText value={props.noCSSText}
                      width="100%"/>

        <Spacer height="50px"/>
      </VStack>
    )
  }

  return (
    <VStack halign="stretch"
            paddingVertical='40px'
            valign="top" gap='0'
            width="100%">
      <Label type="h2"
             text={props.title}
             textColor={props.theme.white}
             bgColor={props.theme.redDark}
             marginHorizontal='-20px'
             padding='20px'
             whiteSpace="pre"
             minWidth="150px"/>

      <Spacer height="40px"/>

      <HStack className='markdown dark' halign='left' valign='center'
              padding='20px' marginHorizontal='-20px'
              bgColor='#33414850'>
        {props.children}
      </HStack>

      <HStack halign="stretch"
              valign="bottom"
              marginHorizontal='-20px'
              paddingTop='10px'
              gap="0">
        <Label text='CSS'
               textAlign='center'
               width='50%'
               height='30px'
               fontSize='14px'
               padding='5px'
               marginRight='40px'
               textColor='#c70091'/>

        <Label text='NoCSS'
               textAlign='center'
               height='30px'
               fontSize='14px'
               width='50%'
               padding='5px'
               textColor='#8300d5'/>
      </HStack>

      <HSeparator color='#334148' marginHorizontal='-20px'/>

      <HStack halign="stretch"
              valign="stretch"
              width='100%'
              gap="50px">
        <MarkdownText value={props.cssText}
                      width="50%"/>

        <VSeparator color='#334148'/>

        <MarkdownText value={props.noCSSText}
                      width="50%"/>
      </HStack>

      <Spacer height="50px"/>
    </VStack>
  )
})

const MarkdownText = stylable(({ value }: { value: string }) => {
  useEffect(() => {
    console.log('--Prism.highlightAll')
    Prism.highlightAll()
  }, [value])
  return <ReactMarkdown className='markdown dark' key={value}>{value}</ReactMarkdown>
})
