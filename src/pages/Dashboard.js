import { Link } from "react-router-dom";
import "../styles/Dashboard.css";

const Dashboard = () => {

  return (
    <div className="dashboard-page">

      <header className="dashboard-header">

        <div>
          <p className="dashboard-label">
            Welcome back
          </p>

          <h1>
            EduLearn Dashboard
          </h1>
        </div>

        <Link
          to="/profile"
          className="profile-button"
        >
          Profile
        </Link>

      </header>

      <section className="dashboard-grid">

        <div className="dashboard-card">

          <span className="dashboard-icon">
            📚
          </span>

          <h3>
            My Courses
          </h3>

          <p>
            View and continue your courses.
          </p>

        </div>

        <div className="dashboard-card">

          <span className="dashboard-icon">
            📝
          </span>

          <h3>
            Assignments
          </h3>

          <p>
            Check your assignments and tasks.
          </p>

        </div>

        <div className="dashboard-card">

          <span className="dashboard-icon">
            📊
          </span>

          <h3>
            Progress
          </h3>

          <p>
            Track your learning progress.
          </p>

        </div>

        <div className="dashboard-card">

          <span className="dashboard-icon">
            🎥
          </span>

          <h3>
            Video Sessions
          </h3>

          <p>
            Connect with your instructor.
          </p>

        </div>

      </section>

    </div>
  );
};

export default Dashboard;