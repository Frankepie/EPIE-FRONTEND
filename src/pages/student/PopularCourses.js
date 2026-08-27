import {
  useEffect,
  useState
} from "react";

import {
  Link
} from "react-router-dom";

import {
  getCourses
} from "../../services/api";

import "../../styles/PopularCourse.css";


const PopularCourses = () => {

  const [courses, setCourses] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [searchTerm, setSearchTerm] =
    useState("");


  useEffect(() => {

    const loadCourses = async () => {

      try {

        setLoading(true);
        setError("");

        const data =
          await getCourses();

        /*
        =====================================
        HANDLE DIFFERENT API RESPONSE SHAPES
        =====================================
        */

        const courseList =
          Array.isArray(data)
            ? data
            : data?.courses ||
              data?.data ||
              [];

        setCourses(courseList);

      } catch (error) {

        console.error(
          "Popular courses error:",
          error
        );

        setError(
          error.message ||
          "Unable to load popular courses."
        );

      } finally {

        setLoading(false);

      }

    };


    loadCourses();

  }, []);


  /*
  ==========================================
  SEARCH COURSES
  ==========================================
  */

  const filteredCourses =
    courses.filter((course) => {

      const search =
        searchTerm
          .toLowerCase()
          .trim();

      if (!search) {
        return true;
      }

      const title =
        course?.title
          ?.toLowerCase() || "";

      const category =
        course?.category
          ?.toLowerCase() || "";

      const description =
        course?.description
          ?.toLowerCase() || "";

      return (
        title.includes(search) ||
        category.includes(search) ||
        description.includes(search)
      );

    });


  /*
  ==========================================
  LOADING
  ==========================================
  */

  if (loading) {

    return (

      <div className="popular-courses-page">

        <div className="popular-courses-message">

          Loading popular courses...

        </div>

      </div>

    );

  }


  /*
  ==========================================
  ERROR
  ==========================================
  */

  if (error) {

    return (

      <div className="popular-courses-page">

        <div className="popular-courses-error">

          {error}

        </div>

      </div>

    );

  }


  return (

    <div className="popular-courses-page">


      {/* =====================================
          PAGE HEADER
      ===================================== */}

      <div className="popular-courses-header">

        <div>

          <span className="popular-courses-eyebrow">
            EXPLORE & LEARN
          </span>

          <h1>
            Popular Courses
          </h1>

          <p>
            Discover courses created by our
            instructors and start learning today.
          </p>

        </div>

        <div className="popular-courses-count">

          <strong>
            {courses.length}
          </strong>

          <span>
            {courses.length === 1
              ? "Available Course"
              : "Available Courses"}
          </span>

        </div>

      </div>


      {/* =====================================
          SEARCH
      ===================================== */}

      {courses.length > 0 && (

        <div className="popular-courses-toolbar">

          <div className="popular-courses-search">

            <span>
              Search
            </span>

            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value
                )
              }
            />

          </div>

        </div>

      )}


      {/* =====================================
          NO COURSES
      ===================================== */}

      {courses.length === 0 ? (

        <div className="popular-courses-empty">

          <div className="popular-courses-empty-icon">
            C
          </div>

          <h2>
            No courses available yet
          </h2>

          <p>
            Instructors haven't posted any
            courses yet. Please check again later.
          </p>

        </div>

      ) : filteredCourses.length === 0 ? (

        <div className="popular-courses-empty">

          <h2>
            No courses found
          </h2>

          <p>
            Try searching for another course
            or category.
          </p>

          <button
            type="button"
            onClick={() =>
              setSearchTerm("")
            }
          >
            Show All Courses
          </button>

        </div>

      ) : (

        /* =====================================
            COURSE GRID
        ===================================== */

        <div className="popular-courses-grid">

          {filteredCourses.map((course) => (

            <article
              className="popular-course-card"
              key={course._id}
            >


              {/* COURSE IMAGE */}

              <div className="popular-course-image">

                {course?.image ? (

                  <img
                    src={course.image}
                    alt={
                      course.title ||
                      "Course"
                    }
                  />

                ) : (

                  <div className="popular-course-image-placeholder">

                    {course?.category
                      ?.charAt(0)
                      .toUpperCase() || "C"}

                  </div>

                )}

              </div>


              {/* COURSE BODY */}

              <div className="popular-course-body">

                <span className="popular-course-category">

                  {course?.category ||
                    "General Course"}

                </span>


                <h2>

                  {course?.title ||
                    "Untitled Course"}

                </h2>


                {course?.description && (

                  <p className="popular-course-description">

                    {course.description.length > 100
                      ? `${course.description.slice(
                          0,
                          100
                        )}...`
                      : course.description}

                  </p>

                )}


                {/* INSTRUCTOR */}

                {course?.instructor && (

                  <div className="popular-course-instructor">

                    <i className="fa-solid fa-user"></i>

                    <span>

                      {typeof course.instructor ===
                        "object"
                        ? course.instructor.name
                        : course.instructor}

                    </span>

                  </div>

                )}


                {/* ACTION */}

                <Link
                  to={`/courses/${course._id}`}
                  className="popular-course-action"
                >

                  View Course

                  <i className="fa-solid fa-arrow-right"></i>

                </Link>

              </div>

            </article>

          ))}

        </div>

      )}

    </div>

  );

};


export default PopularCourses;