import {
  useEffect,
  useState
} from "react";

import {
  Link
} from "react-router-dom";

import {
  useAuth
} from "../../context/AuthContext";

import {
  getMyCourses
} from "../../services/api";

import "../../styles/MyCourses.css";


const MyCourses = () => {

  const {
    token
  } = useAuth();


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
            await getMyCourses(
              token
            );

          setCourses(
            data.enrollments
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


  if (loading) {

    return (
      <div className="my-courses-page">
        <div className="my-courses-message">
          Loading your courses...
        </div>
      </div>
    );

  }


  if (error) {

    return (
      <div className="my-courses-page">
        <div className="my-courses-error">
          {error}
        </div>
      </div>
    );

  }


  return (

    <div className="my-courses-page">

      <div className="my-courses-header">

        <p>
          Your Learning
        </p>

        <h1>
          My Courses
        </h1>

        <span>
          Continue learning and track
          your progress.
        </span>

      </div>


      {courses.length === 0 ? (

        <div className="my-courses-empty">

          <h2>
            You haven't enrolled in
            any courses yet.
          </h2>

          <p>
            Explore our courses and
            start learning today.
          </p>

          <Link to="/courses">
            Browse Courses
          </Link>

        </div>

      ) : (

        <div className="my-courses-grid">

          {courses.map(
            (enrollment) => {

              const course =
                enrollment.course;

              return (

                <div
                  className="my-course-card"
                  key={enrollment._id}
                >

                  <div className="my-course-image">

                    {course?.image ? (

                      <img
                        src={course.image}
                        alt={course.title}
                      />

                    ) : (

                      <span>
                        {course?.category
                          ?.charAt(0)
                          .toUpperCase()}
                      </span>

                    )}

                  </div>


                  <div className="my-course-body">

                    <span>
                      {course?.category}
                    </span>

                    <h2>
                      {course?.title}
                    </h2>


                    <div className="progress-section">

                      <div className="progress-header">

                        <span>
                          Progress
                        </span>

                        <strong>
                          {enrollment.progress}%
                        </strong>

                      </div>


                      <div className="progress-bar">

                        <div
                          className="progress-fill"
                          style={{
                            width:
                              `${enrollment.progress}%`
                          }}
                        />

                      </div>

                    </div>


                    <Link
                      to={`/courses/${course?._id}`}
                    >
                      Continue Learning
                    </Link>

                  </div>

                </div>

              );

            }
          )}

        </div>

      )}

    </div>

  );

};


export default MyCourses;