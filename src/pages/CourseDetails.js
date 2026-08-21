import {
  useEffect,
  useState
} from "react";

import {
  useParams,
  Link,
  useNavigate
} from "react-router-dom";

import {
  getCourseById,
  enrollInCourse,
  getCourseModules,
  getMyCourses
} from "../services/api";

import {
  useAuth
} from "../context/AuthContext";

import "../styles/CourseDetails.css";


const CourseDetails = () => {

  const {
    id
  } = useParams();


  const navigate =
    useNavigate();


  const {
    user,
    token
  } = useAuth();


  const [course, setCourse] =
    useState(null);

  const [modules, setModules] =
    useState([]);

  const [isEnrolled, setIsEnrolled] =
    useState(false);

  const [enrolling, setEnrolling] =
    useState(false);

  const [enrollMessage, setEnrollMessage] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {

    const loadCourse =
      async () => {

        try {

          setLoading(true);
          setError("");

          /*
           * Load course
           */

          const courseData =
            await getCourseById(id);

          setCourse(
            courseData.course
          );


          /*
           * Load modules
           *
           * This is only needed when
           * the student is logged in.
           */

          if (token) {

            const moduleData =
              await getCourseModules(
                id,
                token
              );

            setModules(
              moduleData.modules || []
            );


            /*
             * Check enrollment
             */

            const enrollmentData =
              await getMyCourses(
                token
              );


            const enrolled =
              (
                enrollmentData.enrollments ||
                []
              ).some(
                (enrollment) =>
                  enrollment.course?._id === id
              );


            setIsEnrolled(
              enrolled
            );

          }

        } catch (error) {

          setError(
            error.message ||
            "Unable to load this course."
          );

        } finally {

          setLoading(false);

        }

      };


    loadCourse();

  }, [
    id,
    token
  ]);


  /*
   * ENROLL
   */

  const handleEnroll =
    async () => {

      if (!user) {

        navigate("/login");

        return;

      }


      try {

        setEnrolling(true);

        setEnrollMessage("");


        await enrollInCourse(
          course._id,
          token
        );


        setIsEnrolled(true);


        setEnrollMessage(
          "You have successfully enrolled in this course."
        );


        /*
         * Reload modules after enrollment
         */

        const moduleData =
          await getCourseModules(
            id,
            token
          );


        setModules(
          moduleData.modules || []
        );

      } catch (error) {

        setEnrollMessage(
          error.message ||
          "Unable to enroll in this course."
        );

      } finally {

        setEnrolling(false);

      }

    };


  /*
   * SELECT MODULE
   */

  const handleModuleClick =
    (moduleId) => {

      navigate(
        `/student/modules/${moduleId}/lessons`
      );

    };


  /*
   * LOADING
   */

  if (loading) {

    return (

      <div className="course-details-page">

        <div className="course-details-message">

          Loading course...

        </div>

      </div>

    );

  }


  /*
   * ERROR
   */

  if (error || !course) {

    return (

      <div className="course-details-page">

        <div className="course-details-message">

          <h2>
            Course not found
          </h2>

          <p>
            {error}
          </p>

          <Link to="/courses">
            Back to Courses
          </Link>

        </div>

      </div>

    );

  }


  /*
   * PAGE
   */

  return (

    <div className="course-details-page">

      <div className="course-details-container">


        {/* COURSE IMAGE */}

        <div className="course-details-image">

          {course.image ? (

            <img
              src={course.image}
              alt={course.title}
            />

          ) : (

            <span>

              {course.category
                ?.charAt(0)
                .toUpperCase() || "C"}

            </span>

          )}

        </div>


        {/* COURSE INFORMATION */}

        <div className="course-details-content">

          <span className="course-details-category">

            {course.category ||
              "General Course"}

          </span>


          <h1>
            {course.title}
          </h1>


          <p className="course-details-description">

            {course.description}

          </p>


          {/* COURSE INFORMATION */}

          <div className="course-details-info">

            <div>

              <span>
                Level
              </span>

              <strong>
                {course.level ||
                  "All Levels"}
              </strong>

            </div>


            <div>

              <span>
                Duration
              </span>

              <strong>
                {course.duration ||
                  "Not specified"}
              </strong>

            </div>


            <div>

              <span>
                Instructor
              </span>

              <strong>
                {course.instructor?.name ||
                  "Instructor"}
              </strong>

            </div>

          </div>


          {/* ENROLLMENT ACTION */}

          <div className="course-details-bottom">

            <strong className="course-price">

              {course.price === 0
                ? "Free"
                : `$${course.price}`}

            </strong>


            {!isEnrolled ? (

              <button
                className="enroll-button"
                type="button"
                onClick={handleEnroll}
                disabled={enrolling}
              >

                {enrolling
                  ? "Enrolling..."
                  : "Enroll Now"}

              </button>

            ) : (

              <span className="enrolled-label">
                Enrolled
              </span>

            )}

          </div>


          {enrollMessage && (

            <p className="enroll-message">

              {enrollMessage}

            </p>

          )}

        </div>

      </div>


      {/* MODULE SECTION */}

      {isEnrolled && (

        <section className="course-modules-section">

          <div className="course-modules-header">

            <div>

              <span>
                COURSE CONTENT
              </span>

              <h2>
                Modules
              </h2>

              <p>
                Select a module to view its
                lessons and continue learning.
              </p>

            </div>


            <div className="course-module-count">

              <strong>
                {modules.length}
              </strong>

              <span>
                {modules.length === 1
                  ? "Module"
                  : "Modules"}
              </span>

            </div>

          </div>


          {modules.length === 0 ? (

            <div className="course-modules-empty">

              <h3>
                No modules available
              </h3>

              <p>
                Modules for this course
                have not been added yet.
              </p>

            </div>

          ) : (

            <div className="course-modules-list">

              {modules.map(
                (module, index) => (

                  <article
                    className="course-module-card"
                    key={module._id}
                  >

                    <div className="module-number">

                      {String(
                        index + 1
                      ).padStart(2, "0")}

                    </div>


                    <div className="module-content">

                      <span className="module-label">

                        MODULE {index + 1}

                      </span>


                      <h3>

                        {module.title ||
                          module.name ||
                          "Untitled Module"}

                      </h3>


                      {module.description && (

                        <p>

                          {module.description}

                        </p>

                      )}


                      <div className="module-meta">

                        <span>
                          Module content
                        </span>

                      </div>

                    </div>


                    <div className="module-action">

                      <button
                        type="button"
                        onClick={() =>
                          handleModuleClick(
                            module._id
                          )
                        }
                      >

                        View Module

                      </button>

                    </div>

                  </article>

                )
              )}

            </div>

          )}

        </section>

      )}

    </div>

  );

};


export default CourseDetails;