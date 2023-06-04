import React, {useEffect, useRef, useState} from "react";
import {SelectorRuleBuilder} from "../../application/NoCSS";

// @ts-ignore
export const Input = ({type, defaultValue, titel, placeHolder = "", autoFocus = false, onChange, onSubmitted}) => {
  console.log("new Input")
  const onKeyDown = (e: any) => {
    //Enter key
    if (e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault()
      onSubmitted()
    }
  }

  return (
    <div className="input_container">
      <p className='input_title'>{titel}</p>

      <input className="input_field"
             placeholder={placeHolder}
             autoCorrect="off"
             autoComplete="off"
             autoFocus={autoFocus}
             type={type}
             defaultValue={defaultValue}
             onChange={e => onChange(e.currentTarget.value)}
             onKeyDown={onKeyDown}/>
    </div>
  )
}

interface TextAreaProps {
  text: string,
  onApply: (value: string) => void | undefined,
  onCancel: () => void | undefined
  autoFocus?: boolean,
  builder?: SelectorRuleBuilder,
}

export const TextArea = ({text, onApply, onCancel, autoFocus, builder}: TextAreaProps) => {
  const [value, setValue] = useState(text);
  const ta = useRef<HTMLTextAreaElement>(null);

  const adjustScroller = () => {
    if (ta && ta.current) {
      ta.current.style.height = "inherit";
      ta.current.style.height = `${ta.current.scrollHeight + 5}px`;
    }
  }
  const onChange = (event: any) => {
    setValue(event.target.value)
    adjustScroller()
  }

  useEffect(() => {
    adjustScroller()
  })

  const onKeyDown = (e: any) => {
    //Enter key
    if (e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault()
      onApply(value)
    }
    //ESC key
    if (e.keyCode === 27) {
      e.preventDefault()
      onCancel()
    }
  }

  return <textarea className={builder?.className()}
                   value={value}
                   ref={ta}
                   rows={1}
                   spellCheck="false"
                   onChange={onChange}
                   onKeyDown={onKeyDown}
                   autoFocus={autoFocus}/>
}
