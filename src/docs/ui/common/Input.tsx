import {useState} from "react";

// @ts-ignore
export const Input = ({type, defaultValue, placeholder, autoFocus=false, onChange}) => {
  console.log("new Input")
  const [focused, setFocused] = useState(false);
  return (
    <div className="input_container">
      <input className="input_field"
             placeholder=" "
             autoCorrect="off"
             autoComplete="off"
             autoFocus={autoFocus}
             type={type}
             defaultValue={defaultValue}
             onChange={onChange}
             onFocus={() => setFocused(true)}
             onBlur={() => setFocused(false)}/>
      <p className={focused ? 'input_placeholder_focused' : 'input_placeholder'}>{placeholder}</p>
    </div>
  )
}