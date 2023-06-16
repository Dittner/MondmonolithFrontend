import React, {useEffect, useRef, useState} from "react";
import {stylable} from "../../application/NoCSS";
import {useWindowSize} from "../../../App";

// @ts-ignore
export const Input = ({type, defaultValue, titel, placeHolder = "", autoFocus = false, onChange, onSubmitted}) => {
  console.log("new Input")
  const onKeyDown = (e: any) => {
    //Enter key
    if (e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault()
      e.stopPropagation()
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
  selectAll?: boolean,
}

export const TextArea = stylable(({text, onApply, onCancel, autoFocus, selectAll}: TextAreaProps) => {
  const [value, setValue] = useState(text);
  const [width, height] = useWindowSize();

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
    // const textArea = ta?.current
    // if (autoFocus && textArea) {
    //   textArea.focus()
    //   if (!selectAll && text.length > 0) textArea.setSelectionRange(text.length, text.length);
    // }
    //
    // if (selectAll && textArea) textArea.select()
    adjustScroller()
  })

  const onKeyDown = (e: any) => {
    //Enter key
    if (e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault()
      e.stopPropagation()
      onApply(value)
    }
    //ESC key
    if (e.keyCode === 27) {
      e.preventDefault()
      e.stopPropagation()
      onCancel()
    }
  }

  return <textarea value={value}
                   ref={ta}
                   rows={value.split(/\r\n|\r|\n/).length}
                   spellCheck="false"
                   onChange={onChange}
                   onKeyDown={onKeyDown}
                   autoFocus={autoFocus}/>
})
