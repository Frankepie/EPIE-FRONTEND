import {
  useNavigate
} from "react-router-dom";

import {
  FaArrowLeft
} from "react-icons/fa";

import "./BackButton.css";


const BackButton = () => {

  const navigate = useNavigate();


  const handleBack = () => {

    navigate(-1);

  };


  return (

    <button
      type="button"
      className="global-back-button"
      onClick={handleBack}
      aria-label="Go back"
    >

      <FaArrowLeft />

      <span>
        Back
      </span>

    </button>

  );

};


export default BackButton;