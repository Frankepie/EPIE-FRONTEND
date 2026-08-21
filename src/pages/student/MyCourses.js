import {
  useEffect,
  useMemo,
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

  const [searchTerm, setSearchTerm] =
    useState("");

  const [filter, setFilter] =
    useState("all");


  useEffect(() => {

    const loadCourses =
      async () => {

        try {

          setLoading(true);
          setError("");

          const data =
            await getMyCourses(token);

          setCourses(
            data?.enrollments || []
          );

        } catch (error) {

          setError(
            error.message ||
            "Unable to load your courses."
          );

        } finally {

          setLoading(false);

        }

      };


    if (token) {
      loadCourses();
    }

  }, [token]);


  const filteredCourses =
    useMemo(() => {

      return courses.filter(
        (enrollment) => {

          const course =
            enrollment.course;

          const title =
            course?.title || "";

          const category =
            course?.category || "";

          const search =
            searchTerm
              .toLowerCase()
              .trim();

          const matchesSearch =
            title
              .toLowerCase()
              .includes(search) ||
            category
              .toLowerCase()
              .includes(search);


          const progress =
            Number(
              enrollment.progress || 0
            );


          let matchesFilter = true;


          if (filter === "in-progress") {

            matchesFilter =
              progress > 0 &&
              progress < 100;

          }


          if (filter === "completed") {

            matchesFilter =
              progress >= 100;

          }


          if (filter === "not-started") {

            matchesFilter =
              progress === 0;

          }


          return (
            matchesSearch &&
            matchesFilter
          );

        }
      );

    }, [
      courses,
      searchTerm,
      filter
    ]);


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

      {/* PAGE HEADER */}

      <div className="my-courses-header">

        <div>

          <span className="my-courses-eyebrow">
            STUDENT LEARNING
          </span>

          <h1>
            My Courses
          </h1>

          <p>
            Continue your learning journey
            and track your progress.
          </p>

        </div>

        <div className="my-courses-count">

          <strong>
            {courses.length}
          </strong>

          <span>
            {courses.length === 1
              ? "Enrolled Course"
              : "Enrolled Courses"}
          </span>

        </div>

      </div>


      {/* SEARCH AND FILTERS */}

      {courses.length > 0 && (

        <div className="my-courses-toolbar">

          <div className="my-courses-search">

            <span>
              Search
            </span>

            <input
              type="text"
              placeholder="Search your courses..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value
                )
              }
            />

          </div>


          <div className="my-courses-filters">

            <button
              type="button"
              className={
                filter === "all"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setFilter("all")
              }
            >
              All Courses
            </button>


            <button
              type="button"
              className={
                filter === "in-progress"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setFilter("in-progress")
              }
            >
              In Progress
            </button>


            <button
              type="button"
              className={
                filter === "completed"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setFilter("completed")
              }
            >
              Completed
            </button>


            <button
              type="button"
              className={
                filter === "not-started"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setFilter("not-started")
              }
            >
              Not Started
            </button>

          </div>

        </div>

      )}


      {/* EMPTY STATE */}

      {courses.length === 0 ? (

        <div className="my-courses-empty">

          <div className="my-courses-empty-icon">
            C
          </div>

          <h2>
            You haven't enrolled in
            any courses yet.
          </h2>

          <p>
            Explore our available courses
            and start your learning journey.
          </p>

          <Link to="/courses">
            Browse Courses
          </Link>

        </div>

      ) : filteredCourses.length === 0 ? (

        <div className="my-courses-empty">

          <h2>
            No courses found
          </h2>

          <p>
            Try changing your search or
            selecting another filter.
          </p>

          <button
            type="button"
            onClick={() => {
              setSearchTerm("");
              setFilter("all");
            }}
          >
            Show All Courses
          </button>

        </div>

      ) : (

        /* COURSE GRID */

        <div className="my-courses-grid">

          {filteredCourses.map(
            (enrollment) => {

              const course =
                enrollment.course;

              const progress =
                Math.min(
                  100,
                  Math.max(
                    0,
                    Number(
                      enrollment.progress || 0
                    )
                  )
                );


              const isCompleted =
                progress >= 100;


              const isStarted =
                progress > 0 &&
                progress < 100;


              let status =
                "NOT STARTED";


              if (isCompleted) {
                status = "COMPLETED";
              } else if (isStarted) {
                status = "IN PROGRESS";
              }


              return (

                <article
                  className="my-course-card"
                  key={enrollment._id}
                >

                  {/* COURSE IMAGE */}

                  <div className="my-course-image">

                    {course?.image ? (

                      <img
                        src={course.image}
                        alt={
                          course.title ||
                          "Course"
                        }
                      />

                    ) : (

                      <div className="my-course-image-placeholder">

                        {course?.category
                          ?.charAt(0)
                          .toUpperCase() || "C"}

                      </div>

                    )}


                    <span
                      className={
                        `course-status ${
                          isCompleted
                            ? "completed"
                            : isStarted
                              ? "in-progress"
                              : "not-started"
                        }`
                      }
                    >
                      {status}
                    </span>

                  </div>


                  {/* COURSE BODY */}

                  <div className="my-course-body">

                    <span className="course-category">
                      {course?.category ||
                        "General Course"}
                    </span>


                    <h2>
                      {course?.title ||
                        "Untitled Course"}
                    </h2>


                    {course?.description && (

                      <p className="course-description">

                        {course.description.length > 90
                          ? `${course.description.slice(
                              0,
                              90
                            )}...`
                          : course.description}

                      </p>

                    )}


                    {/* PROGRESS */}

                    <div className="progress-section">

                      <div className="progress-header">

                        <span>
                          Course Progress
                        </span>

                        <strong>
                          {progress}%
                        </strong>

                      </div>


                      <div
                        className="progress-bar"
                        aria-label={
                          `Course progress: ${progress}%`
                        }
                      >

                        <div
                          className="progress-fill"
                          style={{
                            width:
                              `${progress}%`
                          }}
                        />

                      </div>


                      <div className="progress-meta">

                        <span>
                          {isCompleted
                            ? "Course completed"
                            : progress === 0
                              ? "Not started yet"
                              : "Keep going — you're making progress"}
                        </span>

                      </div>

                    </div>


                    {/* ACTION */}

                    <Link
                      className={
                        isCompleted
                          ? "course-action completed-action"
                          : "course-action"
                      }
                      to={
                        `/student/courses/${course?._id}`
                      }
                    >

                      {isCompleted
                        ? "View Course"
                        : "Continue Learning"}

                    </Link>

                  </div>

                </article>

              );

            }
          )}

        </div>

      )}

    </div>

  );

};


export default MyCourses;