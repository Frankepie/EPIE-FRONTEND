import "../styles/AboutSection.css";

const AboutSection = () => {
  return (
    <section className="about-section">

      <div className="about-container">

        {/* LEFT CONTENT */}

        <div className="about-content">

          <span className="about-label">
            ABOUT EDULEARN
          </span>

          <h2>
            Learn Without Limits.
            <span> Grow With Confidence.</span>
          </h2>

          <p className="about-intro">
            EduLearn is a modern learning platform designed
            to make quality education accessible, engaging,
            and convenient for everyone.
          </p>

          <p>
            Whether you are learning a new skill, improving
            your professional knowledge, or preparing for
            your next career opportunity, EduLearn gives you
            the tools and resources you need to learn at your
            own pace.
          </p>

          <p>
            Our platform brings students and instructors
            together through structured courses, practical
            lessons, assignments, progress tracking, and
            certificates.
          </p>

          <div className="about-features">

            <div className="about-feature">

              <div className="about-feature-icon">
                ✓
              </div>

              <div>
                <h3>Learn at Your Own Pace</h3>

                <p>
                  Study whenever and wherever it is
                  convenient for you.
                </p>
              </div>

            </div>


            <div className="about-feature">

              <div className="about-feature-icon">
                ✓
              </div>

              <div>
                <h3>Practical Learning</h3>

                <p>
                  Gain useful knowledge through
                  structured and practical lessons.
                </p>
              </div>

            </div>


            <div className="about-feature">

              <div className="about-feature-icon">
                ✓
              </div>

              <div>
                <h3>Track Your Progress</h3>

                <p>
                  Monitor your learning journey and
                  celebrate your achievements.
                </p>
              </div>

            </div>

          </div>

        </div>


        {/* RIGHT VISUAL */}

        <div className="about-visual">

          <div className="about-main-card">

            <div className="about-card-icon">
              E
            </div>

            <h3>
              Empowering Learners
            </h3>

            <p>
              Education should be simple,
              accessible, and inspiring.
            </p>

          </div>


          <div className="about-stat-card about-stat-one">

            <strong>
              100+
            </strong>

            <span>
              Learning Resources
            </span>

          </div>


          <div className="about-stat-card about-stat-two">

            <strong>
              50+
            </strong>

            <span>
              Expert Lessons
            </span>

          </div>

        </div>

      </div>

    </section>
  );
};

export default AboutSection;