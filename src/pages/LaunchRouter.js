import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LaunchRouter = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isMobile = window.matchMedia(
      "(max-width: 767px)"
    ).matches;

    if (isMobile) {
      navigate("/splash", {
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

export default LaunchRouter;