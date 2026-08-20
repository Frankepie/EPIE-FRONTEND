import { useNavigate } from "react-router-dom";
import "../styles/SplashScreen.css";

const SplashScreen = () => {

  const navigate = useNavigate();

  const handleGetStarted = () => {

    // Remember that the introduction
    // has been completed
    localStorage.setItem(
      "introCompleted",
      "true"
    );

    // Go to login
    navigate("/home");
  };

  return (
    <div className="splash-screen">

      <div className="splash-content">

        <div className="logo-container">

          <div className="logo-icon">
            E
          </div>

          <h1>
            EduLearn
          </h1>

        </div>


        <h2>
          Your Learning Journey Starts Here
        </h2>


        <p>
          Learn new skills, connect with instructors,
          and achieve your goals.
        </p>


        <button
          className="primary-button"
          onClick={handleGetStarted}
        >
          Get Started
        </button>

      </div>

    </div>
  );
};

export default SplashScreen;