import { useEffect } from 'react'
import * as React from 'react'
import { buildClassName, type StylableComponentProps } from '../../application/NoCSS'

/*
*
* DropDown
*
* */

interface DropDownProps extends StylableComponentProps {
  isOpened: boolean
  onClose?: (() => void) | undefined
}

export const DropDownContainer = (props: DropDownProps) => {
  useEffect(() => {
    const close = () => {
      props.onClose?.()
      window.removeEventListener('mousedown', close)
    }

    setTimeout(() => {
      if (props.isOpened) {
        window.addEventListener('mousedown', close)
      }
    }, 10)

    return () => {
      window.removeEventListener('mousedown', close)
    }
  }, [props.isOpened])

  if (props.isOpened) {
    const p = {
      absolute: 'true',
      top: '50px',
      ...props
    }
    const className = 'className' in p ? p.className + ' ' + buildClassName(p) : buildClassName(p)
    return (
      <div className={className}
           onMouseDown={e => {
             e.stopPropagation()
           }}>
        {props.children}
      </div>
    )
  } else {
    return <></>
  }
}
