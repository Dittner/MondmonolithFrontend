import spinner from '../../../resources/images/spinner.svg'
import smallSpinner from '../../../resources/images/smallSpinner.svg'
import { stylable } from '../../application/NoCSS'
import { VStack } from './Container'

export const LoadingSpinner = () => {
  return (
    <VStack halign="center" valign="center" width="100%" height="90vh">
      <img src={spinner} className="spinner" alt="spinner"/>
    </VStack>
  )
}

export const SmallSpinner = stylable(() => {
  return (
    <VStack halign="center" valign="center">
      <img src={smallSpinner} className="smallSpinner" alt="spinner"/>
    </VStack>
  )
})

export const LargeSpinner = stylable(() => {
  return (
    <VStack halign="center" valign="center">
      <img src={spinner} className="spinner" alt="spinner"/>
    </VStack>
  )
})
