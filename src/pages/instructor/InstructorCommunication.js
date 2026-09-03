
import {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  FaComments,
  FaUserGraduate,
  FaBook,
  FaArrowLeft,
  FaSearch,
  FaCircle
} from "react-icons/fa";

import {
  useAuth
} from "../../context/AuthContext";

import {
  getInstructorCourses
} from "../../services/api";

import "../../styles/InstructorCommunication.css";


const API_URL =
  process.env.REACT_APP_API_URL ||
  "http://localhost:5000";


const InstructorCommunication = () => {

  const navigate =
    useNavigate();

  const {
    token,
    user
  } = useAuth();


  // ==========================================
  // STATE
  // ==========================================

  const [
    courses,
    setCourses
  ] = useState([]);

  const [
    selectedCourse,
    setSelectedCourse
  ] = useState(null);

  const [
    students,
    setStudents
  ] = useState([]);

  const [
    selectedStudent,
    setSelectedStudent
  ] = useState(null);

  const [
    loadingCourses,
    setLoadingCourses
  ] = useState(true);

  const [
    loadingStudents,
    setLoadingStudents
  ] = useState(false);

  const [
    search,
    setSearch
  ] = useState("");

  const [
    error,
    setError
  ] = useState("");


  // ==========================================
  // LOAD INSTRUCTOR COURSES
  // ==========================================

  useEffect(() => {

    const loadCourses =
      async () => {

        try {

          setLoadingCourses(true);

          setError("");


          const response =
            await getInstructorCourses(
              token
            );


          const instructorCourses =
            response?.courses ||
            response?.data ||
            [];


          setCourses(
            instructorCourses
          );


        } catch (err) {

          console.error(
            "Load instructor courses error:",
            err
          );

          setError(
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


  // ==========================================
  // LOAD STUDENTS FOR COURSE
  // ==========================================

  const handleCourseSelect =
    async (course) => {

      try {

        setSelectedCourse(course);

        setSelectedStudent(null);

        setStudents([]);

        setLoadingStudents(true);

        setError("");


        const response =
          await fetch(
            `${API_URL}/api/communication/course/${course._id}/students`,
            {
              method: "GET",

              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          );


        const data =
          await response.json();


        if (!response.ok) {

          throw new Error(
            data.message ||
            "Failed to load students"
          );

        }


        setStudents(
          data.students || []
        );


      } catch (err) {

        console.error(
          "Load course students error:",
          err
        );

        setError(
          err.message ||
          "Failed to load students."
        );

      } finally {

        setLoadingStudents(false);

      }

    };


  // ==========================================
  // OPEN CONVERSATION
  // ==========================================

  const handleStudentSelect =
    async (student) => {

      if (
        !selectedCourse ||
        !student
      ) {
        return;
      }


      try {

        setSelectedStudent(student);

        setError("");


        const response =
          await fetch(
            `${API_URL}/api/communication/conversation`,
            {
              method: "POST",

              headers: {

                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`

              },

              body: JSON.stringify({

                courseId:
                  selectedCourse._id,

                participantId:
                  student._id

              })

            }
          );


        const data =
          await response.json();


        if (!response.ok) {

          throw new Error(
            data.message ||
            "Failed to open conversation"
          );

        }


        const conversation =
          data.conversation;


        if (
          conversation?._id
        ) {

          navigate(
            `/instructor/communication/${conversation._id}`
          );

        }


      } catch (err) {

        console.error(
          "Open conversation error:",
          err
        );

        setError(
          err.message ||
          "Failed to open conversation."
        );

      }

    };


  // ==========================================
  // FILTER STUDENTS
  // ==========================================

  const filteredStudents =
    students.filter(
      student => {

        const name =
          student.name ||
          "";

        const email =
          student.email ||
          "";

        const searchValue =
          search.toLowerCase();


        return (
          name
            .toLowerCase()
            .includes(searchValue) ||

          email
            .toLowerCase()
            .includes(searchValue)
        );

      }
    );


  // ==========================================
  // LOADING COURSES
  // ==========================================

  if (loadingCourses) {

    return (

      <div className="instructor-communication-page">

        <div className="communication-loading">

          <FaComments />

          <p>
            Loading your communication forums...
          </p>

        </div>

      </div>

    );

  }


  // ==========================================
  // PAGE
  // ==========================================

  return (

    <div className="instructor-communication-page">


      {/* ======================================
          HEADER
      ====================================== */}

      <div className="instructor-communication-header">

        <div>

          <div className="communication-title-row">

            <FaComments />

            <h1>
              Communication
            </h1>

          </div>

          <p>
            Communicate privately with students
            enrolled in your courses.
          </p>

        </div>

      </div>


      {/* ======================================
          ERROR
      ====================================== */}

      {error && (

        <div className="communication-error">

          {error}

        </div>

      )}


      {/* ======================================
          MAIN CONTENT
      ====================================== */}

      <div className="instructor-communication-content">


        {/* ====================================
            COURSES
        ==================================== */}

        <section className="communication-courses-panel">

          <div className="communication-panel-header">

            <div>

              <h2>
                My Course Forums
              </h2>

              <span>
                {courses.length} course
                {courses.length !== 1
                  ? "s"
                  : ""}
              </span>

            </div>

          </div>


          {courses.length === 0 ? (

            <div className="communication-empty">

              <FaBook />

              <h3>
                No courses yet
              </h3>

              <p>
                Create a course before
                communicating with students.
              </p>

            </div>

          ) : (

            <div className="communication-course-list">

              {courses.map(
                course => (

                  <button
                    key={course._id}
                    type="button"
                    className={
                      selectedCourse?._id ===
                      course._id
                        ? "communication-course active"
                        : "communication-course"
                    }
                    onClick={() =>
                      handleCourseSelect(
                        course
                      )
                    }
                  >

                    <div className="communication-course-icon">

                      {course.image ? (

                        <img
                          src={
                            course.image
                          }
                          alt={
                            course.title
                          }
                        />

                      ) : (

                        <FaBook />

                      )}

                    </div>


                    <div className="communication-course-info">

                      <strong>
                        {course.title}
                      </strong>

                      <span>
                        {course.category ||
                          "Course"}
                      </span>

                    </div>

                  </button>

                )
              )}

            </div>

          )}

        </section>


        {/* ====================================
            STUDENTS
        ==================================== */}

        <section className="communication-students-panel">

          {!selectedCourse ? (

            <div className="communication-select-state">

              <FaUserGraduate />

              <h2>
                Select a course
              </h2>

              <p>
                Select one of your courses
                to see its enrolled students.
              </p>

            </div>

          ) : (

            <>

              <div className="communication-panel-header">

                <div>

                  <div className="communication-back-row">

                    <button
                      type="button"
                      className="communication-back-button"
                      onClick={() => {

                        setSelectedCourse(
                          null
                        );

                        setStudents([]);

                        setSelectedStudent(
                          null
                        );

                        setSearch("");

                      }}
                    >

                      <FaArrowLeft />

                    </button>

                    <h2>
                      {selectedCourse.title}
                    </h2>

                  </div>

                  <span>
                    Enrolled students
                  </span>

                </div>

              </div>


              {/* SEARCH */}

              <div className="communication-search">

                <FaSearch />

                <input
                  type="text"
                  placeholder="Search students..."
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                />

              </div>


              {/* STUDENT LIST */}

              {loadingStudents ? (

                <div className="communication-loading-small">

                  <FaComments />

                  <p>
                    Loading students...
                  </p>

                </div>

              ) : filteredStudents.length === 0 ? (

                <div className="communication-empty">

                  <FaUserGraduate />

                  <h3>
                    No students found
                  </h3>

                  <p>
                    There are currently no
                    enrolled students in this
                    course.
                  </p>

                </div>

              ) : (

                <div className="communication-student-list">

                  {filteredStudents.map(
                    student => (

                      <button
                        key={
                          student._id
                        }
                        type="button"
                        className="communication-student"
                        onClick={() =>
                          handleStudentSelect(
                            student
                          )
                        }
                      >

                        <div className="communication-student-avatar">

                          {student.profileImage ? (

                            <img
                              src={
                                student.profileImage
                              }
                              alt={
                                student.name
                              }
                            />

                          ) : (

                            <span>
                              {(
                                student.name ||
                                "S"
                              )
                                .charAt(0)
                                .toUpperCase()}
                            </span>

                          )}

                          <FaCircle className="student-online-indicator" />

                        </div>


                        <div className="communication-student-info">

                          <strong>
                            {student.name}
                          </strong>

                          <span>
                            {student.email}
                          </span>

                        </div>


                        <FaComments
                          className="communication-student-chat-icon"
                        />

                      </button>

                    )
                  )}

                </div>

              )}

            </>

          )}

        </section>


      </div>


      {/* ======================================
          CURRENT USER
      ====================================== */}

      {user && (

        <div className="communication-current-user">

          <div className="communication-current-avatar">

            {user.profileImage ? (

              <img
                src={
                  user.profileImage
                }
                alt={
                  user.name
                }
              />

            ) : (

              <span>
                {(user.name || "I")
                  .charAt(0)
                  .toUpperCase()}
              </span>

            )}

          </div>

          <div>

            <strong>
              {user.name}
            </strong>

            <span>
              Instructor
            </span>

          </div>

        </div>

      )}

    </div>

  );

};


export default InstructorCommunication;

