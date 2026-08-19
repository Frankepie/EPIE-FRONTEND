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
  getInstructorCourses,
  getCourseModules
} from "../../services/api";

import "./InstructorLessons.css";


const InstructorLessons = () => {

  const {
    token
  } = useAuth();


  const [courses, setCourses] =
    useState([]);

  const [modules, setModules] =
    useState({});

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {

    const loadData = async () => {

      try {

        setLoading(true);
        setError("");


        // =====================================
        // LOAD INSTRUCTOR COURSES
        // =====================================

        const courseData =
          await getInstructorCourses(
            token
          );


        const instructorCourses =
          courseData.courses ||
          courseData.data ||
          [];


        setCourses(
          instructorCourses
        );


        // =====================================
        // LOAD MODULES FOR EACH COURSE
        // =====================================

        const moduleResults = {};


        for (
          const course
          of instructorCourses
        ) {

          try {

            const moduleData =
              await getCourseModules(
                course._id,
                token
              );


            moduleResults[
              course._id
            ] =
              moduleData.modules || [];


          } catch (moduleError) {

            console.error(
              `Failed to load modules for ${course.title}:`,
              moduleError
            );


            moduleResults[
              course._id
            ] = [];

          }

        }


        setModules(
          moduleResults
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

      loadData();

    }

  }, [token]);


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="instructor-lessons-page">

        <div className="instructor-lessons-loading">

          Loading your lessons...

        </div>

      </div>

    );

  }


  // ==========================================
  // PAGE
  // ==========================================

  return (

    <div className="instructor-lessons-page">


      {/* HEADER */}

      <div className="instructor-lessons-header">

        <div>

          <p className="lessons-eyebrow">
            Instructor Area
          </p>

          <h1>
            Lessons
          </h1>

          <p>
            Select a course and module
            to manage its lessons.
          </p>

        </div>

      </div>


      {/* ERROR */}

      {error && (

        <div className="instructor-lessons-error">

          {error}

        </div>

      )}


      {/* NO COURSES */}

      {courses.length === 0 ? (

        <div className="instructor-lessons-empty">

          <h2>
            No courses yet
          </h2>

          <p>
            Create a course first before
            adding lessons.
          </p>

          <Link
            to="/instructor/courses"
            className="lessons-create-course-button"
          >
            Go to My Courses
          </Link>

        </div>

      ) : (

        <div className="instructor-course-list">

          {courses.map(
            (course) => {

              const courseModules =
                modules[course._id] || [];


              return (

                <section
                  className="instructor-course-lessons-card"
                  key={course._id}
                >

                  {/* COURSE HEADER */}

                  <div className="instructor-course-lessons-header">

                    <div>

                      <span>
                        COURSE
                      </span>

                      <h2>
                        {course.title}
                      </h2>

                    </div>


                    <Link
                      to={`/instructor/courses/${course._id}/modules`}
                      className="view-modules-button"
                    >
                      Manage Modules
                    </Link>

                  </div>


                  {/* MODULES */}

                  {courseModules.length === 0 ? (

                    <div className="course-no-modules">

                      <p>
                        This course has no
                        modules yet.
                      </p>

                      <Link
                        to={`/instructor/courses/${course._id}/modules`}
                      >
                        Create Module
                      </Link>

                    </div>

                  ) : (

                    <div className="instructor-module-list">

                      {courseModules.map(
                        (module, index) => (

                          <div
                            className="instructor-module-item"
                            key={module._id}
                          >

                            <div className="module-item-number">

                              {index + 1}

                            </div>


                            <div className="module-item-info">

                              <h3>
                                {module.title}
                              </h3>

                              <p>
                                {module.description ||
                                  "No description provided."}
                              </p>

                            </div>


                            <Link
                              to={`/instructor/modules/${module._id}/lessons`}
                              className="manage-module-lessons-button"
                            >
                              Manage Lessons →
                            </Link>

                          </div>

                        )
                      )}

                    </div>

                  )}

                </section>

              );

            }
          )}

        </div>

      )}

    </div>

  );

};


export default InstructorLessons;