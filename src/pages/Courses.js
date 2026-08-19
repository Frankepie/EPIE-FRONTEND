import {
  useEffect,
  useState
} from "react";

import {
  Link
} from "react-router-dom";

import {
  getCourses
} from "../services/api";

import "../styles/Courses.css";


const Courses = () => {

  const [courses, setCourses] =
    useState([]);

  const [loading, setLoading] =
    useState(true);
  const [error, setError] =
    useState("");
  useEffect(() => {
    const loadCourses =
      async () => {
        try {
          const data =
            await getCourses();
          setCourses(
            data.courses
          );
        } catch (error) {
          setError(
            error.message
          );
        } finally {
          setLoading(false);
        }
      };
    loadCourses();
  }, []);
  if (loading) {
    return (
      <div className="courses-page">

        <div className="courses-loading">
          Loading courses...
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="courses-page">
        <div className="courses-error">
          {error}
        </div>
      </div>
    );
  }
  return (
    <div className="courses-page">
      <div className="courses-header">
        <p>
          Explore Learning
        </p>
        <h1>
          Discover Courses
        </h1>
        <span>
          Find courses that help you
          build your skills and achieve
          your goals.
        </span>
      </div>
      {courses.length === 0 ? (
        <div className="empty-courses">
          <h2>
            No courses available yet
          </h2>
          <p>
            Courses will appear here
            once instructors create them.
          </p>
        </div>
      ) : (
        <div className="courses-grid">
          {courses.map(
            (course) => (
              <div
                className="course-card"
                key={course._id}
              >
                <div className="course-image">
                  {course.image ? (
                    <img
                      src={course.image}
                      alt={course.title}
                    />
                  ) : (
                    <span>
                      {course.category
                        ?.charAt(0)
                        .toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="course-card-body">
                  <span className="course-category">
                    {course.category}
                  </span>
                  <h2>
                    {course.title}
                  </h2>
                  <p>
                    {course.description}
                  </p>
                  <div className="course-meta">
                    <span>
                      {course.level}
                    </span>
                    <span>
                      {course.duration}
                    </span>
                  </div>
                  <div className="course-footer">
                    <strong>
                      {course.price === 0
                        ? "Free"
                        : `$${course.price}`}
                    </strong>
                    <Link
                      to={`/courses/${course._id}`}
                    >
                      View Course
                    </Link>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};
export default Courses;