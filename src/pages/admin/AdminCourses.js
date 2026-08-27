import {
  useEffect,
  useState
} from "react";

import {
  FaBook,
  FaUsers,
  FaUserTie,
  FaEye,
  FaCheckCircle,
  FaClock
} from "react-icons/fa";

import {
  useAuth
} from "../../context/AuthContext";

import {
  getAdminCourses
} from "../../services/api";

import "../../styles/AdminCourses.css";


const AdminCourses = () => {

  const { token } = useAuth();

  const [courses, setCourses] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {

    const loadCourses = async () => {

      try {

        setLoading(true);
        setError("");

        const data =
          await getAdminCourses(token);

        setCourses(
          data.courses || []
        );

      } catch (error) {

        console.error(
          "Admin courses error:",
          error
        );

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


  if (loading) {

    return (
      <div className="admin-page-loading">
        Loading courses...
      </div>
    );

  }


  return (

    <div className="admin-courses-page">

      <div className="admin-page-header">

        <div>

          <h1>
            Courses
          </h1>

          <p>
            Manage and monitor all courses
            available on EduLearn.
          </p>

        </div>

        <div className="admin-page-stat">

          <FaBook />

          <span>
            {courses.length} Courses
          </span>

        </div>

      </div>


      {error && (

        <div className="admin-page-error">
          {error}
        </div>

      )}


      {!error &&
        courses.length === 0 && (

          <div className="admin-empty-state">

            <FaBook />

            <h3>
              No courses found
            </h3>

            <p>
              Courses created by instructors
              will appear here.
            </p>

          </div>

        )}


      {courses.length > 0 && (

        <div className="admin-courses-grid">

          {courses.map(course => (

            <div
              className="admin-course-card"
              key={course._id}
            >

              <div className="admin-course-image">

                {course.image ? (

                  <img
                    src={course.image}
                    alt={course.title}
                  />

                ) : (

                  <FaBook />

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


              <div className="admin-course-content">

                <span className="course-category">
                  {course.category}
                </span>

                <h3>
                  {course.title}
                </h3>

                <p className="course-description">
                  {course.description}
                </p>


                <div className="course-instructor">

                  <FaUserTie />

                  <div>

                    <strong>
                      {course.instructor?.name ||
                        "Unknown instructor"}
                    </strong>

                    <small>
                      {course.instructor?.email ||
                        ""}
                    </small>

                  </div>

                </div>


                <div className="course-meta">

                  <span>
                    <FaUsers />
                    {course.enrollmentCount || 0}
                    {" "}
                    students
                  </span>

                  <span>
                    {course.level}
                  </span>

                  <span>
                    {course.duration || "0 hours"}
                  </span>

                </div>


                <div className="course-footer">

                  <span>
                    {course.price > 0
                      ? `${course.price}`
                      : "Free"}
                  </span>

                  <span>
                    <FaClock />
                    {new Date(
                      course.createdAt
                    ).toLocaleDateString()}
                  </span>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  );

};


export default AdminCourses;