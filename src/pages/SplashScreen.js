import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SplashScreen.css";

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login", { replace: true });
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-screen">
      <div className="splash-content">

        <div className="logo-container">

  {/* Desktop logo */}
  <div className="splash-logo-desktop">
    <div className="logo-icon">
      E
    </div>

    <h1>
      EduLearn
    </h1>
  </div>

  {/* Mobile logo */}
  <img
    src="/logo192.png"
    alt="EduLearn"
    className="splash-logo-mobile"
  />

</div>

        <h2>
          Welcome to EduLearn
        </h2>

        <p>
          Your learning journey starts here.
        </p>

      </div>
    </div>
  );
};

export default SplashScreen;