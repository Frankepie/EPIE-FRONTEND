import { Link } from "react-router-dom";

import "../styles/HeroSection.css";

const HeroSection = () => {

  return (
    <section className="hero-section">

      <div className="hero-container">

        {/* LEFT SIDE */}

        <div className="hero-content">

          <div className="hero-badge">
            Learn. Grow. Achieve.
          </div>

          <h1>
            Build Your Future
            <span>
              With EduLearn
            </span>
          </h1>

          <p className="hero-description">
            Learn practical skills through
            structured online courses,
            experienced instructors and
            interactive learning.
          </p>


          <div className="hero-buttons">

            <Link
              to="/courses"
              className="hero-primary-button"
            >
              Explore Courses
            </Link>

            <Link
              to="/register"
              className="hero-secondary-button"
            >
              Get Started
            </Link>

          </div>


          <div className="hero-features">

            <div>
              <strong>
                100+
              </strong>

              <span>
                Courses
              </span>
            </div>

            <div>
              <strong>
                20+
              </strong>

              <span>
                Instructors
              </span>
            </div>

            <div>
              <strong>
                1K+
              </strong>

              <span>
                Students
              </span>
            </div>

          </div>

        </div>


        {/* RIGHT SIDE — LEARNING VIDEO */}

        <div className="hero-video-wrapper">

          <div className="hero-video-card">

            <div className="hero-video">

              <div className="hero-video-overlay">

                <button
                  type="button"
                  className="hero-play-button"
                  aria-label="Play learning video"
                >
                  ▶
                </button>

              </div>

              <div className="hero-video-label">
                <span>
                  Featured Learning
                </span>

                <strong>
                  Learn Anywhere,
                  Anytime
                </strong>
              </div>

            </div>


            <div className="hero-video-text">

              <span>
                EDULEARN
              </span>

              <h3>
                Start learning
                something new today.
              </h3>

              <p>
                Access lessons,
                assignments and
                learning resources
                from one place.
              </p>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
};

export default HeroSection;