import { useNavigate } from "react-router-dom";
import "../styles/Greeting.css";

const GreetingTwo = () => {

  const navigate = useNavigate();

  const handleGetStarted = () => {

  sessionStorage.setItem(
    "greetingTwoSeen",
    "true"
  );

  navigate("/splash");
};

  return (
    <div className="greeting-page greeting-two">

      <div className="greeting-container">

        <div className="greeting-logo">

          <div className="greeting-logo-icon">
            E
          </div>

          <span>
            EduLearn
          </span>

        </div>


        <div className="greeting-visual">

          <div className="visual-circle">
            🎓
          </div>

        </div>


        <div className="greeting-content">

          <span className="greeting-label">
            LEARN • CONNECT • ACHIEVE
          </span>

          <h1>
            Everything you need
            <br />
            to keep growing.
          </h1>

          <p>
            Learn from instructors, track your
            progress, complete courses, and celebrate
            your achievements.
          </p>

        </div>


        <div className="greeting-features">

          <div className="feature-item">
            <span>📖</span>
            <strong>Learn</strong>
          </div>

          <div className="feature-item">
            <span>👨‍🏫</span>
            <strong>Connect</strong>
          </div>

          <div className="feature-item">
            <span>🏆</span>
            <strong>Achieve</strong>
          </div>

        </div>


        <button
          className="greeting-button"
          onClick={handleGetStarted}
        >
          Get Started
          <span>→</span>
        </button>


        <div className="greeting-dots">

          <span></span>

          <span className="active"></span>

        </div>

      </div>

    </div>
  );
};

export default GreetingTwo;