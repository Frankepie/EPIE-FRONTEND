import { Link } from "react-router-dom";

import "../styles/HomeCTA.css";

const HomeCTA = () => {
  return (
    <section className="home-cta-section">

      <div className="home-cta-container">

        <div className="home-cta-content">

          <span className="home-cta-label">
            START YOUR JOURNEY
          </span>

          <h2>
            Ready to Start
            <span> Learning?</span>
          </h2>

          <p>
            Join EduLearn today and take the next step
            toward developing your knowledge, skills,
            and confidence.
          </p>

          <div className="home-cta-actions">

            <Link
              to="/register"
              className="home-cta-primary"
            >
              Get Started
            </Link>

            <Link
              to="/courses"
              className="home-cta-secondary"
            >
              Browse Courses
            </Link>

          </div>

        </div>

      </div>

    </section>
  );
};

export default HomeCTA;