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
  FaArrowLeft
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

  const {
    user,
    token
  } = useAuth();

  const navigate =
    useNavigate();


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
    conversations,
    setConversations
  ] = useState([]);

  const [
    loadingCourses,
    setLoadingCourses
  ] = useState(true);

  const [
    loadingConversations,
    setLoadingConversations
  ] = useState(false);

  const [
    error,
    setError
  ] = useState("");


  // ==========================================
  // LOAD STUDENT COURSES
  // ==========================================

  useEffect(() => {

    const loadCourses =
      async () => {

        try {

          setLoadingCourses(true);
          setError("");

          const data =
            await getMyCourses(token);

          const enrolledCourses =
            data?.enrollments || [];

          setCourses(
            enrolledCourses
          );

        } catch (err) {

          console.error(
            "Load communication courses error:",
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

  }, [
    token
  ]);


  // ==========================================
  // GET COURSE OBJECT
  // ==========================================

  const getCourseObject =
    (enrollment) => {

      return (
        enrollment?.course ||
        enrollment
      );

    };


  // ==========================================
  // LOAD COURSE COMMUNICATION
  // ==========================================

  const handleCourseSelect =
    async (enrollment) => {

      const course =
        getCourseObject(
          enrollment
        );


      if (!course?._id) {
        return;
      }


      try {

        setSelectedCourse(
          course
        );

        setConversations([]);

        setLoadingConversations(
          true
        );

        setError("");


        const data =
          await getCourseCommunication(
            course._id,
            token
          );


        setConversations(
          data?.conversations || []
        );


      } catch (err) {

        console.error(
          "Load course communication error:",
          err
        );

        setError(
          err.message ||
          "Failed to load communication."
        );

      } finally {

        setLoadingConversations(
          false
        );

      }

    };


  // ==========================================
  // GET OTHER PARTICIPANT
  // ==========================================

  const getOtherParticipant =
    (conversation) => {

      if (
        !conversation ||
        !Array.isArray(
          conversation.participants
        )
      ) {

        return null;

      }


      return conversation.participants.find(
        participant => {

          const participantId =
            participant?._id ||
            participant;

          return (
            participantId?.toString() !==
            user?._id?.toString()
          );

        }
      );

    };


  // ==========================================
  // OPEN CHAT
  // ==========================================

  const openConversation =
    (conversation) => {

      if (!conversation?._id) {
        return;
      }


      navigate(
        `/student/chat/${conversation._id}`
      );

    };


  // ==========================================
  // START NEW CONVERSATION
  // ==========================================

  const startConversation =
    async () => {

      if (
        !selectedCourse ||
        !selectedCourse.instructor
      ) {

        setError(
          "Course instructor could not be found."
        );

        return;

      }


      try {

        setError("");


        const instructor =
          selectedCourse.instructor;


        const instructorId =
          instructor?._id ||
          instructor;


        const data =
          await createConversation(
            selectedCourse._id,
            instructorId,
            token
          );


        const conversation =
          data?.conversation;


        if (!conversation?._id) {

          throw new Error(
            "Conversation was not created."
          );

        }


        setConversations(
          previous => {

            const exists =
              previous.some(
                item =>
                  item._id ===
                  conversation._id
              );


            if (exists) {

              return previous;

            }


            return [
              conversation,
              ...previous
            ];

          }
        );


        // ====================================
        // OPEN STUDENT CHAT PAGE
        // ====================================

        navigate(
          `/student/chat/${conversation._id}`
        );


      } catch (err) {

        console.error(
          "Create conversation error:",
          err
        );

        setError(
          err.message ||
          "Failed to start conversation."
        );

      }

    };


  // ==========================================
  // BACK TO DASHBOARD
  // ==========================================

  const handleBack =
    () => {

      navigate(
        "/student/dashboard"
      );

    };


  // ==========================================
  // RENDER
  // ==========================================

  return (

    <div className="student-communication">


      {/* ======================================
          HEADER
      ====================================== */}

      <div className="communication-header">

        <button
          type="button"
          className="communication-back-button"
          onClick={
            handleBack
          }
        >

          <FaArrowLeft />

          <span>
            Back
          </span>

        </button>


        <div>

          <h1>
            Communication
          </h1>

          <p>
            Connect with your course instructors.
          </p>

        </div>


        <FaComments />

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
          MAIN CONTAINER
      ====================================== */}

      <div className="communication-container">


        {/* ====================================
            COURSE PANEL
        ==================================== */}

        <aside className="course-panel">

          <div className="panel-title">

            <h2>
              My Courses
            </h2>

            <span>
              {courses.length}
            </span>

          </div>


          {loadingCourses ? (

            <div className="communication-loading">

              Loading courses...

            </div>

          ) : courses.length === 0 ? (

            <div className="communication-empty">

              <FaComments />

              <p>
                You are not enrolled in any courses yet.
              </p>

            </div>

          ) : (

            <div className="course-list">

              {courses.map(
                enrollment => {

                  const course =
                    getCourseObject(
                      enrollment
                    );


                  if (!course?._id) {
                    return null;
                  }


                  const isSelected =
                    selectedCourse?._id ===
                    course._id;


                  return (

                    <button
                      type="button"
                      key={course._id}
                      className={
                        `course-item ${
                          isSelected
                            ? "active"
                            : ""
                        }`
                      }
                      onClick={() =>
                        handleCourseSelect(
                          enrollment
                        )
                      }
                    >

                      <div className="course-icon">

                        <FaComments />

                      </div>


                      <div>

                        <strong>
                          {
                            course.title ||
                            "Untitled Course"
                          }
                        </strong>

                        <span>
                          Course communication
                        </span>

                      </div>

                    </button>

                  );

                }
              )}

            </div>

          )}

        </aside>


        {/* ====================================
            CONVERSATIONS PANEL
        ==================================== */}

        <section className="conversation-panel">

          {!selectedCourse ? (

            <div className="select-course-message">

              <FaComments />

              <h2>
                Select a course
              </h2>

              <p>
                Choose one of your enrolled courses
                to view its communication.
              </p>

            </div>

          ) : (

            <>

              {/* COURSE HEADER */}

              <div className="panel-title">

                <div>

                  <h2>
                    {selectedCourse.title}
                  </h2>

                  <span>
                    Instructor conversations
                  </span>

                </div>

              </div>


              {/* CONVERSATIONS */}

              {loadingConversations ? (

                <div className="communication-loading">

                  Loading conversations...

                </div>

              ) : conversations.length === 0 ? (

                <div className="communication-empty">

                  <FaUser />

                  <p>
                    You haven't started a conversation
                    with your instructor yet.
                  </p>


                  <button
                    type="button"
                    className="start-conversation-button"
                    onClick={
                      startConversation
                    }
                  >

                    Start Conversation

                  </button>

                </div>

              ) : (

                <div className="conversation-list">

                  {conversations.map(
                    conversation => {

                      const instructor =
                        getOtherParticipant(
                          conversation
                        );


                      return (

                        <button
                          type="button"
                          key={
                            conversation._id
                          }
                          className="conversation-item"
                          onClick={() =>
                            openConversation(
                              conversation
                            )
                          }
                        >

                          {/* AVATAR */}

                          <div className="avatar">

                            {instructor?.profileImage ? (

                              <img
                                src={
                                  instructor.profileImage
                                }
                                alt={
                                  instructor.name ||
                                  "Instructor"
                                }
                              />

                            ) : (

                              <FaUser />

                            )}

                          </div>


                          {/* INFO */}

                          <div className="conversation-info">

                            <strong>

                              {
                                instructor?.name ||
                                "Instructor"
                              }

                            </strong>

                            <span>

                              Instructor

                            </span>

                          </div>


                          {/* ARROW */}

                          <div className="conversation-arrow">

                            →

                          </div>

                        </button>

                      );

                    }
                  )}

                </div>

              )}

            </>

          )}

        </section>


      </div>

    </div>

  );

};


export default StudentCommunication;