import spinner from '../../../resources/SVG/spinner.svg';
import smallSpinner from '../../../resources/SVG/smallSpinner.svg';

export const LoadingSpinner = () => {
  return (
    <div className="spinnerContainer">
      <img src={spinner} className="spinner" alt="spinner"/>
    </div>
  )
}

export const SmallSpinner = () => {
  return (
    <img src={smallSpinner} className="smallSpinner" alt="spinner"/>
  );
}