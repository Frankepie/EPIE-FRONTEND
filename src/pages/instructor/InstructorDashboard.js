import {
  useEffect,
  useState
} from "react";

import {
  NavLink,
  useNavigate
} from "react-router-dom";

import {
  useAuth
} from "../../context/AuthContext";

import {
  getInstructorCourses
} from "../../services/api";

import "./InstructorDashboard.css";


const InstructorDashboard = () => {

  const {
    user,
    token,
    logout
  } = useAuth();

  const navigate =
    useNavigate();


  const [courses, setCourses] =
    useState([]);
   const [totalStudents, setTotalStudents] =
  useState(0);
  const [totalLessons, setTotalLessons] =
  useState(0);
  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {

    const loadCourses =
      async () => {

        try {

          setLoading(true);
          setError("");

          const data =
            await getInstructorCourses(
              token
            );

         setCourses(
  data.courses ||
  data.data ||
  []
);

setTotalStudents(
  data.totalStudents || 0
);

        } catch (error) {

          setError(
            error.message
          );

        } finally {

          setLoading(false);

        }

      };


    if (token) {
      loadCourses();
    }

  }, [token]);


  const handleLogout = () => {

    logout();

    navigate("/login");

  };


  const getInstructorName = () => {

    return (
      user?.fullName ||
      user?.name ||
      "Instructor"
    );

  };


  return (

    <div className="instructor-dashboard">


      {/* =====================================
          SIDEBAR
      ====================================== */}

      <aside className="instructor-sidebar">


        <div className="instructor-brand">

          <div className="brand-logo">
            E
          </div>

          <span>
            EduLearn
          </span>

        </div>


        <nav className="instructor-navigation">


          <NavLink
            to="/instructor/dashboard"
            className="instructor-nav-item"
          >

            <span className="nav-icon">
              ▣
            </span>

            <span>
              Dashboard
            </span>

          </NavLink>


          <NavLink
            to="/instructor/courses"
            className="instructor-nav-item"
          >

            <span className="nav-icon">
              ▤
            </span>

            <span>
              My Courses
            </span>

          </NavLink>


          <NavLink
            to="/instructor/students"
            className="instructor-nav-item"
          >

            <span className="nav-icon">
              ♧
            </span>

            <span>
              Students
            </span>

          </NavLink>


          <NavLink
            to="/instructor/assignments"
            className="instructor-nav-item"
          >

            <span className="nav-icon">
              ☑
            </span>

            <span>
              Assignments
            </span>

          </NavLink>

<NavLink
  to="/instructor/courses"
  className="instructor-nav-item"
>
  <span className="nav-icon">
    ▧
  </span>

  <span>
    Lessons
  </span>
</NavLink>


          <NavLink
            to="/instructor/discussions"
            className="instructor-nav-item"
          >

            <span className="nav-icon">
              ▢
            </span>

            <span>
              Discussions
            </span>

          </NavLink>


          <NavLink
            to="/instructor/earnings"
            className="instructor-nav-item"
          >

            <span className="nav-icon">
              ◉
            </span>

            <span>
              Earnings
            </span>

          </NavLink>


          <NavLink
            to="/instructor/profile"
            className="instructor-nav-item"
          >

            <span className="nav-icon">
              ○
            </span>

            <span>
              Profile
            </span>

          </NavLink>


          <NavLink
            to="/instructor/settings"
            className="instructor-nav-item"
          >

            <span className="nav-icon">
              ⚙
            </span>

            <span>
              Settings
            </span>

          </NavLink>


        </nav>


        <div className="instructor-sidebar-divider" />


        <button
          type="button"
          className="instructor-logout"
          onClick={handleLogout}
        >

          <span className="nav-icon">
            ↪
          </span>

          <span>
            Logout
          </span>

        </button>


      </aside>



      {/* =====================================
          MAIN CONTENT
      ====================================== */}

      <main className="instructor-main">


        {/* HEADER */}

        <header className="instructor-topbar">


          <div className="instructor-welcome">

            <p>
              Instructor Dashboard
            </p>

            <h1>
              Welcome back,{" "}
              {getInstructorName()}! 👋
            </h1>

          </div>


          <div className="instructor-topbar-actions">


            <button
              type="button"
              className="topbar-icon-button"
              title="Notifications"
            >
              ♧
            </button>


            <button
              type="button"
              className="topbar-icon-button"
              title="Search"
            >
              ⌕
            </button>


            <button
              type="button"
              className="topbar-icon-button"
              title="Calendar"
            >
              ▣
            </button>


            <div className="instructor-avatar">

              {getInstructorName()
                .charAt(0)
                .toUpperCase()}

            </div>


          </div>

        </header>



        {/* OVERVIEW */}

      <section className="instructor-overview">

  <div className="section-heading">

    <h2>
      Overview
    </h2>

  </div>


  <div className="instructor-stats">


    {/* TOTAL COURSES */}

    <div className="instructor-stat-card">

      <div className="stat-card-title">

        <span className="stat-dot purple" />

        <span>
          My Courses
        </span>

      </div>

      <strong>
        {courses.length}
      </strong>

      <p className="stat-description">
        Total courses created
      </p>

    </div>



    {/* PUBLISHED COURSES */}

    <div className="instructor-stat-card">

      <div className="stat-card-title">

        <span className="stat-dot violet" />

        <span>
          Published Courses
        </span>

      </div>

      <strong>
        {
          courses.filter(
            (course) =>
              course.published === true
          ).length
        }
      </strong>

      <p className="stat-description">
        Courses available to students
      </p>

    </div>



    {/* ENROLLED STUDENTS */}

<div className="instructor-stat-card">

  <div className="stat-card-title">

    <span className="stat-dot green" />

    <span>
      Enrolled Students
    </span>

  </div>

  <strong>
    {totalStudents}
  </strong>

  <p className="stat-description">
    Students enrolled in your courses
  </p>

</div>


{/* TOTAL LESSONS */}

<div className="instructor-stat-card">

  <div className="stat-card-title">

    <span className="stat-star">
      ★
    </span>

    <span>
      Total Lessons
    </span>

  </div>

  <strong>
    {totalLessons}
  </strong>

  <p className="stat-description">
    Lessons across your courses
  </p>

</div>

  </div>

</section>


        {/* LOWER DASHBOARD */}

        <div className="instructor-dashboard-grid">


          {/* RECENT COURSES */}

          <section className="recent-courses-section">


            <div className="section-heading">

              <h2>
                Recent Courses
              </h2>

              <NavLink
                to="/instructor/courses"
                className="view-all-link"
              >
                View all
              </NavLink>

            </div>


            {loading ? (

              <div className="dashboard-message">
                Loading courses...
              </div>

            ) : error ? (

              <div className="dashboard-error">
                {error}
              </div>

            ) : courses.length === 0 ? (

              <div className="dashboard-empty">

                <h3>
                  No courses yet
                </h3>

                <p>
                  Create your first course
                  to start teaching.
                </p>

                <NavLink
                  to="/instructor/courses"
                  className="create-course-link"
                >
                  Create Course
                </NavLink>

              </div>

            ) : (

              <div className="recent-course-list">

                {courses
                  .slice(0, 3)
                  .map((course) => (

                    <div
                      className="recent-course-item"
                      key={course._id}
                    >


                      <div className="recent-course-image">

                        {course.image ? (

                          <img
                            src={course.image}
                            alt={course.title}
                          />

                        ) : (

                          <span>
                            {course.title
                              ?.charAt(0)
                              .toUpperCase()}
                          </span>

                        )}

                      </div>


          <div className="recent-course-info">

  <h3>
    {course.title || "Untitled Course"}
  </h3>

  <p>
    {course.category || "Course"}
  </p>

  <div className="recent-course-meta">

    <span
      className={
        course.published
          ? "course-status published-status"
          : "course-status draft-status"
      }
    >
      {course.published
        ? "Published"
        : "Draft"}
    </span>

    <span>
      {course.level || "Beginner"}
    </span>

    <span>
      {course.duration || "0 hours"}
    </span>

    <span>
      ${Number(course.price || 0).toFixed(2)}
    </span>

  </div>

</div>

                      <div className="recent-course-arrow">

                        <NavLink
                          to={`/instructor/courses/${course._id}`}
                          title="Manage course"
                        >
                          →
                        </NavLink>

                      </div>


                    </div>

                  ))}

              </div>

            )}

          </section>



          {/* QUICK ACTIONS */}

          <section className="quick-actions-section">


            <div className="section-heading">

              <h2>
                Quick Actions
              </h2>

            </div>


           <button
  type="button"
  className="quick-action"
  onClick={() =>
    navigate("/instructor/courses")
  }
>

  <span className="quick-action-icon">
    +
  </span>

  <span>
    Create a New Course
  </span>

</button>

<button
  type="button"
  className="quick-action"
  onClick={() =>
    navigate("/instructor/courses")
  }
>

  <span className="quick-action-icon">
    ↑
  </span>

  <span>
    Add a New Lesson
  </span>

</button>
            <button
              type="button"
              className="quick-action"
              onClick={() =>
                navigate(
                  "/instructor/students"
                )
              }
            >

              <span className="quick-action-icon">
                ✉
              </span>

              <span>
                Student Messages
              </span>

            </button>


            <button
              type="button"
              className="quick-action"
              onClick={() =>
                navigate(
                  "/instructor/meetings"
                )
              }
            >

              <span className="quick-action-icon">
                ▣
              </span>

              <span>
                Schedule Meeting
              </span>

            </button>


          </section>


        </div>


      </main>

    </div>

  );

};


export default InstructorDashboard;