import { useNavigate } from "react-router-dom";
import "../styles/Greeting.css";

const GreetingOne = () => {

  const navigate = useNavigate();

 const handleNext = () => {
  navigate("/greeting-two");
};

  return (
    <div className="greeting-page greeting-one">

      <div className="greeting-container">

        <div className="greeting-logo">

  {/* Desktop logo */}
  <div className="greeting-logo-desktop">
    <div className="greeting-logo-icon">
      E
    </div>

    <span>
      EduLearn
    </span>
  </div>

  {/* Mobile logo */}
  <img
    src="/logo192.png"
    alt="EduLearn"
    className="greeting-logo-mobile"
  />

</div>


        <div className="greeting-visual">

          <div className="visual-circle">
            📚
          </div>

        </div>


        <div className="greeting-content">

          <span className="greeting-label">
            WELCOME TO EDULEARN
          </span>

          <h1>
            Your learning journey
            <br />
            starts here.
          </h1>

          <p>
            Discover new knowledge, build valuable
            skills, and learn at your own pace with
            EduLearn.
          </p>

        </div>


        <button
          className="greeting-button"
          onClick={handleNext}
        >
          Next
          <span>→</span>
        </button>


        <div className="greeting-dots">

          <span className="active"></span>

          <span></span>

        </div>

      </div>

    </div>
  );
};

export default GreetingOne;