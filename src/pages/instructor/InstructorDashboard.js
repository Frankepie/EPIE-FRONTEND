import {
  useEffect,
  useState
} from "react";

import {
  NavLink,
  useNavigate
} from "react-router-dom";

import {
  FaBell,
  FaSearch,
  FaCalendarAlt,
  FaPlus,
  FaUpload,
  FaEnvelope,
  FaVideo
} from "react-icons/fa";

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
    token
  } = useAuth();

  const navigate =
    useNavigate();


  const [courses, setCourses] =
    useState([]);

  const [totalStudents, setTotalStudents] =
    useState(0);

  const [totalLessons] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  /*
  =====================================
  LOAD INSTRUCTOR COURSES
  =====================================
  */

  useEffect(() => {

    const loadCourses = async () => {

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

        console.error(
          "Instructor dashboard error:",
          error
        );


        setError(
          error.message ||
          "Unable to load instructor dashboard."
        );


      } finally {

        setLoading(false);

      }

    };


    if (token) {

      loadCourses();

    }

  }, [token]);


  /*
  =====================================
  INSTRUCTOR NAME
  =====================================
  */

  const getInstructorName = () => {

    return (
      user?.fullName ||
      user?.name ||
      "Instructor"
    );

  };


  /*
  =====================================
  RENDER
  =====================================
  */

  return (

    <div className="instructor-dashboard-content">


      {/* =====================================
          TOP HEADER
      ===================================== */}

      <header className="instructor-topbar">


        <div className="instructor-welcome">

          <p>
            Instructor Dashboard
          </p>

          <h1>
            Welcome back,{" "}
            {getInstructorName()}!
          </h1>

        </div>


        {/* ===================================
            HEADER ACTIONS
        =================================== */}

        <div className="instructor-topbar-actions">


          <button
            type="button"
            className="topbar-icon-button"
            title="Notifications"
            onClick={() =>
              navigate(
                "/instructor/notifications"
              )
            }
          >

            <FaBell />

          </button>


          <button
            type="button"
            className="topbar-icon-button"
            title="Search"
          >

            <FaSearch />

          </button>


          <button
            type="button"
            className="topbar-icon-button"
            title="Calendar"
            onClick={() =>
              navigate(
                "/instructor/meetings"
              )
            }
          >

            <FaCalendarAlt />

          </button>


          <button
            type="button"
            className="instructor-avatar"
            title="Profile"
            onClick={() =>
              navigate(
                "/instructor/profile"
              )
            }
          >

            {getInstructorName()
              .charAt(0)
              .toUpperCase()}

          </button>


        </div>


      </header>



      {/* =====================================
          OVERVIEW
      ===================================== */}

      <section className="instructor-overview">


        <div className="section-heading">

          <h2>
            Overview
          </h2>

        </div>


        <div className="instructor-stats">


          {/* =================================
              TOTAL COURSES
          ================================= */}

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



          {/* =================================
              PUBLISHED COURSES
          ================================= */}

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
                  course =>
                    course.published === true
                ).length
              }

            </strong>


            <p className="stat-description">
              Courses available to students
            </p>

          </div>



          {/* =================================
              ENROLLED STUDENTS
          ================================= */}

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



          {/* =================================
              TOTAL LESSONS
          ================================= */}

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



      {/* =====================================
          LOWER DASHBOARD
      ===================================== */}

      <div className="instructor-dashboard-grid">


        {/* ===================================
            RECENT COURSES
        =================================== */}

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



          {/* =================================
              LOADING
          ================================= */}

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
                .map(course => (

                  <div
                    className="recent-course-item"
                    key={course._id}
                  >


                    {/* COURSE IMAGE */}

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



                    {/* COURSE INFORMATION */}

                    <div className="recent-course-info">

                      <h3>
                        {
                          course.title ||
                          "Untitled Course"
                        }
                      </h3>


                      <p>
                        {
                          course.category ||
                          "Course"
                        }
                      </p>


                      <div className="recent-course-meta">


                        <span
                          className={
                            course.published
                              ? "course-status published-status"
                              : "course-status draft-status"
                          }
                        >

                          {
                            course.published
                              ? "Published"
                              : "Draft"
                          }

                        </span>


                        <span>
                          {
                            course.level ||
                            "Beginner"
                          }
                        </span>


                        <span>
                          {
                            course.duration ||
                            "0 hours"
                          }
                        </span>


                        <span>
                          $
                          {Number(
                            course.price || 0
                          ).toFixed(2)}
                        </span>


                      </div>


                    </div>



                    {/* COURSE ARROW */}

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



        {/* ===================================
            QUICK ACTIONS
        =================================== */}

        <section className="quick-actions-section">


          <div className="section-heading">

            <h2>
              Quick Actions
            </h2>

          </div>



          {/* CREATE COURSE */}

          <button
            type="button"
            className="quick-action"
            onClick={() =>
              navigate(
                "/instructor/courses"
              )
            }
          >

            <span className="quick-action-icon">

              <FaPlus />

            </span>


            <span>
              Create a New Course
            </span>

          </button>



          {/* ADD LESSON */}

          <button
            type="button"
            className="quick-action"
            onClick={() =>
              navigate(
                "/instructor/courses"
              )
            }
          >

            <span className="quick-action-icon">

              <FaUpload />

            </span>


            <span>
              Add a New Lesson
            </span>

          </button>



          {/* STUDENT MESSAGES */}

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

              <FaEnvelope />

            </span>


            <span>
              Student Messages
            </span>

          </button>



          {/* SCHEDULE MEETING */}

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

              <FaVideo />

            </span>


            <span>
              Schedule Meeting
            </span>

          </button>


        </section>


      </div>


    </div>

  );

};


export default InstructorDashboard;