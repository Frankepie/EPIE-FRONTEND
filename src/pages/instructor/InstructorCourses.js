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
  getInstructorCourses,
  deleteCourse
} from "../../services/api";

import "../../styles/InstructorCourses.css";


const InstructorCourses = () => {

  const {
    user,
    token,
    logout
  } = useAuth();

  const navigate = useNavigate();


  const [courses, setCourses] =
    useState([]);

  const [deletingId, setDeletingId] =
    useState(null);

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

        } catch (error) {

          setError(
            error.message ||
            "Failed to load courses."
          );

        } finally {

          setLoading(false);

        }

      };


    if (token) {
      loadCourses();
    }

  }, [token]);


  const getInstructorName = () => {

    return (
      user?.fullName ||
      user?.name ||
      "Instructor"
    );

  };


  const handleLogout = () => {

    logout();

    navigate("/login");

  };


  const handleDelete =
    async (courseId) => {

      const confirmed =
        window.confirm(
          "Are you sure you want to delete this course?"
        );

      if (!confirmed) {
        return;
      }


      try {

        setDeletingId(courseId);

        setError("");


        await deleteCourse(
          courseId,
          token
        );


        setCourses(
          previousCourses =>
            previousCourses.filter(
              course =>
                course._id !== courseId
            )
        );

      } catch (error) {

        setError(
          error.message ||
          "Failed to delete course."
        );

      } finally {

        setDeletingId(null);

      }

    };


  const publishedCourses =
    courses.filter(
      course =>
        course.published === true
    ).length;


  const draftCourses =
    courses.filter(
      course =>
        course.published !== true
    ).length;


  return (

    <div className="instructor-dashboard">


      {/* =================================
          SIDEBAR
      ================================== */}

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
            to="/instructor/lessons"
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



      {/* =================================
          MAIN CONTENT
      ================================== */}

      <main className="instructor-main">


        {/* TOP BAR */}

        <header className="instructor-topbar">


          <div className="instructor-welcome">

            <p>
              Instructor Area
            </p>

            <h1>
              My Courses
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



        {/* PAGE ACTION */}

        <div className="courses-page-action">

          <div>

            <p>
              Manage your teaching content
            </p>

            <h2>
              All Courses
            </h2>

          </div>


          <NavLink
            to="/instructor/courses/create"
            className="dashboard-create-course-button"
          >
            + Create Course
          </NavLink>

        </div>



        {/* COURSE STATISTICS */}

        <div className="courses-mini-stats">


          <div className="courses-mini-stat">

            <span className="mini-stat-icon">
              ▤
            </span>

            <div>

              <strong>
                {courses.length}
              </strong>

              <span>
                Total Courses
              </span>

            </div>

          </div>


          <div className="courses-mini-stat">

            <span className="mini-stat-icon published-icon">
              ✓
            </span>

            <div>

              <strong>
                {publishedCourses}
              </strong>

              <span>
                Published
              </span>

            </div>

          </div>


          <div className="courses-mini-stat">

            <span className="mini-stat-icon draft-icon">
              ◷
            </span>

            <div>

              <strong>
                {draftCourses}
              </strong>

              <span>
                Drafts
              </span>

            </div>

          </div>


        </div>



        {/* ERROR */}

        {error && (

          <div className="instructor-courses-error">
            {error}
          </div>

        )}



        {/* LOADING */}

        {loading ? (

          <div className="instructor-courses-message">
            Loading your courses...
          </div>

        ) : courses.length === 0 ? (

          /* EMPTY STATE */

          <div className="instructor-courses-empty">

            <div className="empty-course-icon">
              +
            </div>

            <h2>
              You haven't created any courses yet
            </h2>

            <p>
              Create your first course and
              start teaching your students.
            </p>

            <NavLink
              to="/instructor/courses/create"
              className="dashboard-create-course-button"
            >
              Create Your First Course
            </NavLink>

          </div>

        ) : (

          /* COURSE GRID */

          <div className="instructor-course-grid">

            {courses.map(
              (course) => (

                <article
                  className="instructor-course-card"
                  key={course._id}
                >


                  {/* IMAGE */}

                  <div className="course-card-image">

                    {course.image ? (

                      <img
                        src={course.image}
                        alt={course.title}
                      />

                    ) : (

                      <span>
                        {course.title
                          ?.charAt(0)
                          .toUpperCase() ||
                          "C"}
                      </span>

                    )}


                    <span
                      className={
                        course.published
                          ? "course-status published"
                          : "course-status draft"
                      }
                    >
                      {course.published
                        ? "Published"
                        : "Draft"}
                    </span>

                  </div>



                  {/* CONTENT */}

                  <div className="course-card-content">


                    <span className="course-category">
                      {course.category ||
                        "General"}
                    </span>


                    <h2>
                      {course.title ||
                        "Untitled Course"}
                    </h2>


                    <p>
                      {course.description ||
                        "No course description available."}
                    </p>



                    {/* META */}

                    <div className="course-card-meta">

                      <span>
                        {course.level ||
                          "Beginner"}
                      </span>

                      <span>
                        {course.duration ||
                          "0 hours"}
                      </span>

                      <span>
                        $
                        {Number(
                          course.price || 0
                        ).toFixed(2)}
                      </span>

                    </div>



                    {/* ACTIONS */}

                    <div className="course-card-actions">


                      <NavLink
                        to={`/instructor/courses/${course._id}/modules`}
                        className="content-button"
                      >
                        Content
                      </NavLink>


                      <NavLink
                        to={`/instructor/courses/edit/${course._id}`}
                        className="edit-button"
                      >
                        Edit
                      </NavLink>


                      <button
                        type="button"
                        className="delete-button"
                        onClick={() =>
                          handleDelete(
                            course._id
                          )
                        }
                        disabled={
                          deletingId ===
                          course._id
                        }
                      >

                        {deletingId ===
                        course._id
                          ? "..."
                          : "Delete"}

                      </button>


                    </div>


                  </div>

                </article>

              )
            )}

          </div>

        )}


      </main>

    </div>

  );

};


export default InstructorCourses;