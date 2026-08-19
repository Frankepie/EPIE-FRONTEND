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
  getInstructorStudents
} from "../../services/api";

import "../../styles/InstructorStudents.css";


const InstructorStudents = () => {

  const {
    user,
    token,
    logout
  } = useAuth();

  const navigate =
    useNavigate();


  const [students, setStudents] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {

    const loadStudents =
      async () => {

        try {

          setLoading(true);

          setError("");

          const data =
            await getInstructorStudents(
              token
            );

          setStudents(
            data.students || []
          );

        } catch (error) {

          setError(
            error.message ||
            "Failed to load students."
          );

        } finally {

          setLoading(false);

        }

      };


    if (token) {
      loadStudents();
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


  /*
   * Remove duplicate students.
   *
   * A student can be enrolled
   * in more than one course.
   */

  const uniqueStudents =
    Array.from(
      new Map(
        students
          .filter(
            enrollment =>
              enrollment.student
          )
          .map(
            enrollment => [
              enrollment.student._id,
              enrollment
            ]
          )
      ).values()
    );


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
          MAIN
      ================================== */}

      <main className="instructor-main">


        {/* TOP BAR */}

        <header className="instructor-topbar">

          <div className="instructor-welcome">

            <p>
              Instructor Area
            </p>

            <h1>
              Students
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



        {/* INTRO */}

        <div className="students-page-heading">

          <div>

            <p>
              Manage your learners
            </p>

            <h2>
              My Students
            </h2>

          </div>


          <div className="students-count">

            <strong>
              {uniqueStudents.length}
            </strong>

            <span>
              Students
            </span>

          </div>

        </div>



        {/* CONTENT */}

        {loading ? (

          <div className="students-message">
            Loading students...
          </div>

        ) : error ? (

          <div className="students-error">
            {error}
          </div>

        ) : uniqueStudents.length === 0 ? (

          <div className="students-empty">

            <div className="students-empty-icon">
              ♧
            </div>

            <h2>
              No students yet
            </h2>

            <p>
              Students who enroll in your
              courses will appear here.
            </p>

            <NavLink
              to="/instructor/courses"
            >
              View My Courses
            </NavLink>

          </div>

        ) : (

          <div className="students-table-wrapper">

            <table className="students-table">

              <thead>

                <tr>

                  <th>
                    Student
                  </th>

                  <th>
                    Email
                  </th>

                  <th>
                    Course
                  </th>

                  <th>
                    Progress
                  </th>

                  <th>
                    Status
                  </th>

                </tr>

              </thead>


              <tbody>

                {uniqueStudents.map(
                  enrollment => {

                    const student =
                      enrollment.student;

                    const course =
                      enrollment.course;


                    return (

                      <tr
                        key={
                          student._id
                        }
                      >

                        <td>

                          <div className="student-name-cell">

                            <div className="student-avatar">

                              {(
                                student.fullName ||
                                student.name ||
                                "S"
                              )
                                .charAt(0)
                                .toUpperCase()}

                            </div>


                            <div>

                              <strong>
                                {
                                  student.fullName ||
                                  student.name ||
                                  "Student"
                                }
                              </strong>

                            </div>

                          </div>

                        </td>


                        <td>
                          {student.email ||
                            "No email"}
                        </td>


                        <td>

                          <span className="student-course">

                            {course?.title ||
                              "Course"}

                          </span>

                        </td>


                        <td>

                          <div className="student-progress">

                            <div className="progress-bar">

                              <span
                                style={{
                                  width:
                                    `${enrollment.progress || 0}%`
                                }}
                              />

                            </div>

                            <small>
                              {
                                enrollment.progress ||
                                0
                              }%
                            </small>

                          </div>

                        </td>


                        <td>

                          <span
                            className={
                              enrollment.completed
                                ? "student-status completed"
                                : "student-status learning"
                            }
                          >

                            {enrollment.completed
                              ? "Completed"
                              : "Learning"}

                          </span>

                        </td>

                      </tr>

                    );

                  }
                )}

              </tbody>

            </table>

          </div>

        )}

      </main>

    </div>

  );

};


export default InstructorStudents;