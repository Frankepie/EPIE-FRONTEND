import "../styles/LearningStats.css";

const LearningStats = () => {
  return (
    <section className="learning-stats-section">

      <div className="learning-stats-container">

        <div className="learning-stat">
          <strong>1,000+</strong>
          <span>Active Students</span>
        </div>

        <div className="learning-stat">
          <strong>100+</strong>
          <span>Quality Courses</span>
        </div>

        <div className="learning-stat">
          <strong>50+</strong>
          <span>Expert Instructors</span>
        </div>

        <div className="learning-stat">
          <strong>500+</strong>
          <span>Certificates Earned</span>
        </div>

      </div>

    </section>
  );
};

export default LearningStats;