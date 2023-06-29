import spinner from '../../../resources/images/spinner.svg';
import smallSpinner from '../../../resources/images/smallSpinner.svg';
import {VStack} from "../../application/NoCSSComponents";

export const LoadingSpinner = () => {
  return (
    <VStack halign="center" valign="center" width="100%" height="90vh">
      <img src={spinner} className="spinner" alt="spinner"/>
    </VStack>
  )
}

export const SmallSpinner = () => {
  return (
    <img src={smallSpinner} className="smallSpinner" alt="spinner"/>
  );
}