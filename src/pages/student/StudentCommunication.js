import React, {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  FaComments,
  FaUser,
  FaArrowLeft,
  FaBook
} from "react-icons/fa";

import {
  useAuth
} from "../../context/AuthContext";

import {
  getMyCourses
} from "../../services/courseService";

import {
  getCourseCommunication,
  createConversation
} from "../../services/communicationService";

import "../../styles/StudentCommunication.css";


const StudentCommunication = () => {

  const navigate = useNavigate();

  const {
    token
  } = useAuth();


  // =====================================
  // STATE
  // =====================================

  const [
    courses,
    setCourses
  ] = useState([]);

  const [
    selectedCourse,
    setSelectedCourse
  ] = useState(null);

  const [
    forum,
    setForum
  ] = useState(null);

  const [
    loadingCourses,
    setLoadingCourses
  ] = useState(true);

  const [
    loadingForum,
    setLoadingForum
  ] = useState(false);

  const [
    error,
    setError
  ] = useState("");


  // =====================================
  // LOAD ENROLLED COURSES
  // =====================================

  useEffect(() => {

    const loadCourses = async () => {

      try {

        setLoadingCourses(true);
        setError("");

        const data =
          await getMyCourses(token);

        const enrollments =
          data?.enrollments || [];

        setCourses(enrollments);

      } catch (err) {

        console.error(
          "Load student courses error:",
          err
        );

        setError(
          err.message ||
          "Failed to load your courses."
        );

      } finally {

        setLoadingCourses(false);

      }
    };


    if (token) {
      loadCourses();
    }

  }, [token]);


  // =====================================
  // GET COURSE OBJECT
  // =====================================

  const getCourseObject = (
    enrollment
  ) => {

    return (
      enrollment?.course ||
      enrollment
    );

  };


  // =====================================
  // OPEN COURSE FORUM
  // =====================================

  const handleSelectCourse = async (
    enrollment
  ) => {

    const course =
      getCourseObject(enrollment);

    if (!course?._id) {
      return;
    }

    try {

      setSelectedCourse(course);

      setForum(null);

      setLoadingForum(true);

      setError("");


      // ---------------------------------
      // First check whether forum exists
      // ---------------------------------

      const communicationData =
        await getCourseCommunication(
          course._id,
          token
        );


      let conversations =
        communicationData?.conversations || [];


      // ---------------------------------
      // If no forum exists yet,
      // create/get the shared forum
      // ---------------------------------

      if (conversations.length === 0) {

        const forumData =
          await createConversation(
            course._id,
            token
          );

        if (forumData?.conversation) {

          setForum(
            forumData.conversation
          );

        } else {

          setForum(null);

        }

      } else {

        // ---------------------------------
        // Shared course forum
        // ---------------------------------

        setForum(
          conversations[0]
        );

      }

    } catch (err) {

      console.error(
        "Open course forum error:",
        err
      );

      setError(
        err.message ||
        "Failed to open course forum."
      );

    } finally {

      setLoadingForum(false);

    }

  };


  // =====================================
  // OPEN FORUM CHAT
  // =====================================

  const handleOpenForum = () => {

    if (!forum?._id) {
      return;
    }

    navigate(
      `/student/chat/${forum._id}`
    );

  };


  // =====================================
  // BACK TO COURSE LIST
  // =====================================

  const handleBack = () => {

    setSelectedCourse(null);

    setForum(null);

    setError("");

  };


  // =====================================
  // COURSE TITLE
  // =====================================

  const getCourseTitle = (
    course
  ) => {

    return (
      course?.title ||
      course?.name ||
      "Untitled Course"
    );

  };


  // =====================================
  // INSTRUCTOR NAME
  // =====================================

  const getInstructorName = (
    course
  ) => {

    const instructor =
      course?.instructor;

    if (!instructor) {
      return "Course Instructor";
    }

    if (
      typeof instructor === "string"
    ) {
      return "Course Instructor";
    }

    return (
      instructor.name ||
      instructor.email ||
      "Course Instructor"
    );

  };


  // =====================================
  // LOADING COURSES
  // =====================================

  if (loadingCourses) {

    return (
      <div className="student-communication-page">

        <div className="student-communication-loading">

          <FaComments />

          <p>
            Loading your forums...
          </p>

        </div>

      </div>
    );

  }


  // =====================================
  // SELECTED COURSE / FORUM
  // =====================================

  if (selectedCourse) {

    return (
      <div className="student-communication-page">

        {/* =================================
            HEADER
        ================================= */}

        <div className="student-communication-header">

          <button
            type="button"
            className="student-communication-back"
            onClick={handleBack}
          >
            <FaArrowLeft />
          </button>

          <div>

            <h2>
              Forum
            </h2>

            <p>
              Course discussion forum
            </p>

          </div>

        </div>


        {/* =================================
            ERROR
        ================================= */}

        {error && (

          <div className="student-communication-error">

            {error}

          </div>

        )}


        {/* =================================
            COURSE INFORMATION
        ================================= */}

        <div className="student-forum-course-card">

          <div className="student-forum-course-icon">

            {courseImage(selectedCourse) ? (

              <img
                src={courseImage(selectedCourse)}
                alt={getCourseTitle(selectedCourse)}
              />

            ) : (

              <FaBook />

            )}

          </div>


          <div className="student-forum-course-info">

            <h3>
              {getCourseTitle(selectedCourse)}
            </h3>

            <p>
              Enrolled course forum
            </p>

          </div>

        </div>


        {/* =================================
            INSTRUCTOR
        ================================= */}

        <div className="student-forum-instructor-card">

          <div className="student-forum-section-icon">

            <FaUser />

          </div>


          <div className="student-forum-instructor-info">

            <span>
              Instructor
            </span>

            <strong>
              {getInstructorName(
                selectedCourse
              )}
            </strong>

          </div>

        </div>


        {/* =================================
            FORUM
        ================================= */}

        <div className="student-forum-content">

          <div className="student-forum-title">

            <div className="student-forum-title-icon">

              <FaComments />

            </div>

            <div>

              <h3>
                {getCourseTitle(selectedCourse)} Forum
              </h3>

              <p>
                Discuss this course with your instructor
                and other enrolled students.
              </p>

            </div>

          </div>


          {loadingForum ? (

            <div className="student-forum-loading">

              <FaComments />

              <p>
                Opening forum...
              </p>

            </div>

          ) : forum ? (

            <div className="student-forum-open-card">

              <div className="student-forum-open-icon">

                <FaComments />

              </div>

              <div className="student-forum-open-info">

                <h4>
                  Course Forum
                </h4>

                <p>
                  Join the discussion with your
                  instructor and classmates.
                </p>

              </div>

              <button
                type="button"
                className="student-forum-open-button"
                onClick={handleOpenForum}
              >
                Open Forum
              </button>

            </div>

          ) : (

            <div className="student-forum-empty">

              <FaComments />

              <h4>
                Forum unavailable
              </h4>

              <p>
                This course forum could not be opened.
                Please try again.
              </p>

            </div>

          )}

        </div>

      </div>
    );

  }


  // =====================================
  // COURSE LIST
  // =====================================

  return (
    <div className="student-communication-page">

      {/* =================================
          HEADER
      ================================= */}

      <div className="student-communication-header">

        <div className="student-communication-header-icon">

          <FaComments />

        </div>

        <div>

          <h2>
            Forum
          </h2>

          <p>
            Discuss your enrolled courses.
          </p>

        </div>

      </div>


      {/* =================================
          ERROR
      ================================= */}

      {error && (

        <div className="student-communication-error">

          {error}

        </div>

      )}


      {/* =================================
          NO COURSES
      ================================= */}

      {courses.length === 0 ? (

        <div className="student-communication-empty">

          <FaBook />

          <h3>
            No enrolled courses
          </h3>

          <p>
            Enroll in a course to access its forum.
          </p>

        </div>

      ) : (

        <div className="student-communication-courses">

          <div className="student-communication-courses-title">

            <h3>
              My Course Forums
            </h3>

            <p>
              Select an enrolled course to open its forum.
            </p>

          </div>


          {courses.map(
            (
              enrollment,
              index
            ) => {

              const course =
                getCourseObject(
                  enrollment
                );

              if (!course?._id) {
                return null;
              }

              return (

                <button
                  type="button"
                  key={
                    course._id ||
                    enrollment._id ||
                    index
                  }
                  className="student-communication-course"
                  onClick={() =>
                    handleSelectCourse(
                      enrollment
                    )
                  }
                >

                  <div className="student-communication-course-icon">

                    {courseImage(course) ? (

                      <img
                        src={courseImage(course)}
                        alt={getCourseTitle(course)}
                      />

                    ) : (

                      <FaBook />

                    )}

                  </div>


                  <div className="student-communication-course-info">

                    <h4>
                      {getCourseTitle(course)}
                    </h4>

                    <p>
                      Course Forum
                    </p>

                  </div>


                  <FaComments
                    className="student-communication-course-arrow"
                  />

                </button>

              );

            }
          )}

        </div>

      )}

    </div>
  );

};


// =====================================
// COURSE IMAGE HELPER
// =====================================

const courseImage = (
  course
) => {

  return (
    course?.image ||
    course?.courseImage ||
    ""
  );

};


export default StudentCommunication;