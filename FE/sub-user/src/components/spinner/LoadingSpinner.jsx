import "./Spinner.css";

// import cat from "../../assets/spinner/cat_spinner.gif";
import nana from "../../assets/spinner/nana_spinner.gif";
export default function LoadingSpinner() {
  return (
    // <div className="loading-overlay">
    //   <div className="spinner"></div>
    // </div>
    <div className="loading-overlay">
      <img src={nana} alt="Loading..." className="spinner-img" />
    </div>
  );
}
