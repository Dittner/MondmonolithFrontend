import { buildClassName, type StylableComponentProps } from '../../application/NoCSS'

export const Rectangle = (props: StylableComponentProps) => {
  if (props.visible === false) return <></>
  return <div className={buildClassName(props)}/>
}
