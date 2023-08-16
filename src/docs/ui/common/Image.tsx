import { useEffect, useState } from 'react'
import { buildClassName, type StylableComponentProps } from '../../application/NoCSS'
import * as React from 'react'
import { HStack, type StackProps } from './Container'

/*
*
* Image
*
* */

interface ImageProps extends StackProps {
  src: string
  alt: string
  preview?: string
}

export const Image = (props: ImageProps) => {
  const [showPreview, setShowPreview] = useState(props.preview !== undefined)

  useEffect(() => {
    if (props.preview) {
      setShowPreview(true)
      setTimeout(() => {
        setShowPreview(false)
      }, 100)
    }
  }, [props.src])

  if ('visible' in props && !props.visible) return <></>

  const className = 'className' in props ? props.className + ' ' + buildClassName(props) : buildClassName(props)

  let imgClassName
  if ('width' in props || 'height' in props) {
    const style: StylableComponentProps = {}
    if ('width' in props) style.width = props.width
    if ('height' in props) style.height = props.height
    if ('opacity' in props) style.opacity = props.opacity
    if ('animate' in props) style.animate = props.animate
    imgClassName = buildClassName(style)
  }

  return (
    <HStack className={className} valign={props.valign} halign={props.halign}>
      <img className={imgClassName} src={showPreview ? props.preview : props.src} alt={props.alt}/>
    </HStack>
  )
}
