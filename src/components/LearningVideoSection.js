import { Link } from "react-router-dom";

import "../styles/LearningVideoSection.css";

const LearningVideoSection = () => {

  return (
    <section className="learning-video-section">

      <div className="learning-video-container">

        {/* VIDEO */}

        <div className="learning-video-box">

          <div className="learning-video-placeholder">

            <div className="learning-video-content">

              <span className="learning-video-small-title">
                EDULEARN
              </span>

              <h3>
                Learn something
                new every day.
              </h3>

              <button
                type="button"
                className="learning-video-play"
                aria-label="Play learning video"
              >
                ▶
              </button>

            </div>

            <div className="learning-video-shape shape-one"></div>

            <div className="learning-video-shape shape-two"></div>

          </div>


          <div className="learning-video-caption">

            <span>
              Featured Learning
            </span>

            <strong>
              Your journey starts here
            </strong>

          </div>

        </div>


        {/* TEXT */}

        <div className="learning-video-text">

          <span className="section-label">
            HOW EDULEARN WORKS
          </span>

          <h2>
            Learn at your own pace,
            from anywhere.
          </h2>

          <p>
            EduLearn gives students access
            to structured courses created by
            instructors who understand the
            skills learners need today.
          </p>

          <p>
            Watch lessons, complete
            assignments, track your progress
            and earn certificates as you
            develop your skills.
          </p>


          <div className="learning-benefits">

            <div>
              <span className="benefit-number">
                01
              </span>

              <div>
                <strong>
                  Learn
                </strong>

                <p>
                  Follow structured lessons
                  and learning materials.
                </p>
              </div>
            </div>


            <div>
              <span className="benefit-number">
                02
              </span>

              <div>
                <strong>
                  Practice
                </strong>

                <p>
                  Complete assignments and
                  test your knowledge.
                </p>
              </div>
            </div>


            <div>
              <span className="benefit-number">
                03
              </span>

              <div>
                <strong>
                  Achieve
                </strong>

                <p>
                  Track your progress and
                  earn certificates.
                </p>
              </div>
            </div>

          </div>


          <Link
            to="/register"
            className="learning-start-button"
          >
            Start Learning
          </Link>

        </div>

      </div>

    </section>
  );
};

export default LearningVideoSection;