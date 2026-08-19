import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const IntroRedirect = () => {

  const navigate = useNavigate();

  useEffect(() => {

    const introCompleted =
      localStorage.getItem("introCompleted");

    if (introCompleted === "true") {

      navigate("/login", {
        replace: true
      });

    } else {

      navigate("/greeting-one", {
        replace: true
      });

    }

  }, [navigate]);

  return null;
};

export default IntroRedirect;