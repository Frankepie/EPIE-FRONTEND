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

import "../styles/PopularCourses.css";


const PopularCourses = () => {

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

        const data =
          await getCourses();

        setCourses(
          data.courses || []
        );

      } catch (error) {

        console.error(
          "Homepage courses error:",
          error
        );

        setError(
          error.message ||
          "Unable to load courses"
        );

      } finally {

        setLoading(false);

      }
    };


    loadCourses();

  }, []);


  return (

    <section
      className="popular-courses-section"
    >

      <div
        className="popular-courses-container"
      >

        {/* HEADER */}

        <div
          className="popular-courses-header"
        >

          <div>

            <span
              className="popular-courses-label"
            >
              EXPLORE COURSES
            </span>

            <h2>
              Popular Courses
            </h2>

            <p>
              Learn from courses created by
              our instructors and build skills
              for your future.
            </p>

          </div>


          <Link
            to="/courses"
            className="view-all-courses"
          >
            View All Courses
          </Link>

        </div>


        {/* LOADING */}

        {loading && (

          <div
            className="courses-loading"
          >
            Loading courses...
          </div>

        )}


        {/* ERROR */}

        {!loading && error && (

          <div
            className="courses-error"
          >
            {error}
          </div>

        )}


        {/* EMPTY */}

        {!loading &&
          !error &&
          courses.length === 0 && (

            <div
              className="courses-empty"
            >

              <h3>
                No courses available yet
              </h3>

              <p>
                Our instructors are preparing
                exciting courses for you.
              </p>

            </div>

          )}


        {/* COURSES */}

        {!loading &&
          !error &&
          courses.length > 0 && (

            <div
              className="popular-courses-grid"
            >

              {courses
                .slice(0, 6)
                .map((course) => (

                  <article
                    className="popular-course-card"
                    key={course._id}
                  >

                    {/* IMAGE */}

                    <div
                      className="popular-course-image"
                    >

                      {course.image ? (

                        <img
                          src={course.image}
                          alt={course.title}
                        />

                      ) : (

                        <div
                          className="course-image-placeholder"
                        >
                          {course.category ||
                            "Course"}
                        </div>

                      )}

                    </div>


                    {/* CONTENT */}

                    <div
                      className="popular-course-content"
                    >

                      <div
                        className="popular-course-meta"
                      >

                        <span>
                          {course.category ||
                            "General"}
                        </span>

                        {course.level && (

                          <span>
                            {course.level}
                          </span>

                        )}

                      </div>


                      <h3>
                        {course.title}
                      </h3>


                      <p>
                        {course.description}
                      </p>


                      {/* INSTRUCTOR */}

                      <div
                        className="popular-course-instructor"
                      >

                        <span>
                          Instructor
                        </span>

                        <strong>
                          {course.instructor?.name ||
                            "EduLearn Instructor"}
                        </strong>

                      </div>


                      {/* FOOTER */}

                      <div
                        className="popular-course-footer"
                      >

                        {course.price !== undefined && (

                          <strong>
                            {course.price === 0
                              ? "Free"
                              : `${course.price}`}
                          </strong>

                        )}


                        <Link
                          to={`/courses/${course._id}`}
                          className="course-view-button"
                        >
                          View Course
                        </Link>

                      </div>

                    </div>

                  </article>

                ))}

            </div>

          )}

      </div>

    </section>

  );
};


export default PopularCourses;