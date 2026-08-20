import "../styles/WhyChooseUs.css";

const WhyChooseUs = () => {
  return (
    <section className="why-choose-section">

      <div className="why-choose-container">

        {/* HEADER */}

        <div className="why-choose-header">

          <span className="why-choose-label">
            WHY EDULEARN?
          </span>

          <h2>
            Everything You Need
            <span> To Learn Better</span>
          </h2>

          <p>
            EduLearn combines quality learning content,
            practical activities, and useful tools to make
            your learning experience simple and effective.
          </p>

        </div>


        {/* FEATURES */}

        <div className="why-choose-grid">

          <div className="why-card">

            <div className="why-icon">
              ✓
            </div>

            <h3>
              Quality Courses
            </h3>

            <p>
              Access carefully structured courses designed
              to help you understand concepts and develop
              practical skills.
            </p>

          </div>


          <div className="why-card">

            <div className="why-icon">
              ★
            </div>

            <h3>
              Expert Instructors
            </h3>

            <p>
              Learn from instructors who bring knowledge,
              experience, and practical insights into every
              lesson.
            </p>

          </div>


          <div className="why-card">

            <div className="why-icon">
              ▶
            </div>

            <h3>
              Flexible Learning
            </h3>

            <p>
              Learn at a time and pace that works for you
              using accessible lessons and learning
              resources.
            </p>

          </div>


          <div className="why-card">

            <div className="why-icon">
              ↗
            </div>

            <h3>
              Track Your Progress
            </h3>

            <p>
              Keep track of completed lessons, course
              progress, assignments, and your learning
              achievements.
            </p>

          </div>


          <div className="why-card">

            <div className="why-icon">
              ✓
            </div>

            <h3>
              Assignments & Assessments
            </h3>

            <p>
              Reinforce your knowledge through assignments
              and assessments that support active learning.
            </p>

          </div>


          <div className="why-card">

            <div className="why-icon">
              C
            </div>

            <h3>
              Earn Certificates
            </h3>

            <p>
              Complete your courses and receive certificates
              that recognize your learning achievements.
            </p>

          </div>

        </div>

      </div>

    </section>
  );
};

export default WhyChooseUs;