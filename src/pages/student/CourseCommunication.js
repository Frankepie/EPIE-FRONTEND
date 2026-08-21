import {
  useEffect,
  useState
} from "react";

import {
  useParams
} from "react-router-dom";

import {
  useAuth
} from "../../context/AuthContext";

import {
  getCourseCommunication,
  getCourseStudents,
  createConversation
} from "../../services/api";

import "../../styles/CourseCommunication.css";


const CourseCommunication = () => {

  const {
    courseId
  } = useParams();

  const {
    token
  } = useAuth();


  const [
    communication,
    setCommunication
  ] = useState(null);


  const [
    students,
    setStudents
  ] = useState([]);


  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    error,
    setError
  ] = useState("");


  const [
    selectedPerson,
    setSelectedPerson
  ] = useState(null);


  // ========================================
  // LOAD COMMUNICATION
  // ========================================

  useEffect(() => {

    const loadCommunication =
      async () => {

        try {

          setLoading(true);
          setError("");

          const result =
            await getCourseCommunication(
              courseId,
              token
            );

          setCommunication(
            result
          );


          // Instructor gets enrolled students

          if (
            result.isForumAdmin
          ) {

            const studentResult =
              await getCourseStudents(
                courseId,
                token
              );

            setStudents(
              studentResult.students || []
            );

          }

        } catch (err) {

          console.error(err);

          setError(
            err.message ||
            "Unable to load communication"
          );

        } finally {

          setLoading(false);

        }

      };


    if (
      courseId &&
      token
    ) {

      loadCommunication();

    }

  }, [
    courseId,
    token
  ]);


  // ========================================
  // START CONVERSATION
  // ========================================

  const handleStartConversation =
    async (person) => {

      try {

        const result =
          await createConversation(
            courseId,
            person._id,
            token
          );

        setSelectedPerson(
          person
        );

        console.log(
          "Conversation:",
          result.conversation
        );

      } catch (err) {

        alert(
          err.message
        );

      }

    };


  // ========================================
  // LOADING
  // ========================================

  if (loading) {

    return (
      <div className="communication-page">

        <div className="communication-loading">

          Loading course communication...

        </div>

      </div>
    );

  }


  // ========================================
  // ERROR
  // ========================================

  if (error) {

    return (
      <div className="communication-page">

        <div className="communication-error">

          <h3>
            Communication unavailable
          </h3>

          <p>
            {error}
          </p>

        </div>

      </div>
    );

  }


  return (

    <div className="communication-page">

      {/* ==================================
          HEADER
      ================================== */}

      <div className="communication-header">

        <div>

          <span className="communication-label">
            COURSE COMMUNICATION
          </span>

          <h1>
            {communication?.course?.title}
          </h1>

          <p>
            Connect, discuss and learn
            with your course community.
          </p>

        </div>


        {communication?.isForumAdmin && (

          <div className="forum-admin-badge">

            Forum Administrator

          </div>

        )}

      </div>


      {/* ==================================
          MAIN CONTENT
      ================================== */}

      <div className="communication-layout">


        {/* ==================================
            DISCUSSIONS
        ================================== */}

        <section className="communication-panel">

          <div className="panel-header">

            <div>

              <span>
                DISCUSSIONS
              </span>

              <h2>
                Course Discussions
              </h2>

            </div>


            <button
              type="button"
              className="discussion-create-button"
            >
              + New Discussion
            </button>

          </div>


          <div className="discussion-empty">

            <div className="discussion-empty-icon">
              +
            </div>

            <h3>
              Start a conversation
            </h3>

            <p>
              Ask questions, share ideas,
              and help other learners.
            </p>

            <button
              type="button"
              className="discussion-create-button"
            >
              Create Discussion
            </button>

          </div>

        </section>


        {/* ==================================
            PEOPLE
        ================================== */}

        <aside className="communication-panel people-panel">

          <div className="panel-header">

            <div>

              <span>
                COMMUNITY
              </span>

              <h2>
                People
              </h2>

            </div>

          </div>


          {/* COURSE INSTRUCTOR */}

          <div className="person-section">

            <h4>
              Instructor
            </h4>


            <div className="person-card">

              <div className="person-avatar">

                {communication?.course?.instructor
                  ?.name
                  ?.charAt(0)
                  ?.toUpperCase() || "I"}

              </div>


              <div className="person-details">

                <strong>
                  {communication?.course?.instructor
                    ?.name ||
                    "Course Instructor"}
                </strong>

                <span>
                  Instructor
                </span>

              </div>

            </div>

          </div>


          {/* STUDENTS */}

          {communication?.isForumAdmin && (

            <div className="person-section">

              <h4>
                Enrolled Students
              </h4>


              {students.length === 0 ? (

                <p className="no-people">
                  No students enrolled yet.
                </p>

              ) : (

                <div className="people-list">

                  {students.map(
                    (student) => (

                      <div
                        className="person-card"
                        key={student._id}
                      >

                        <div className="person-avatar">

                          {student.name
                            ?.charAt(0)
                            ?.toUpperCase()}

                        </div>


                        <div className="person-details">

                          <strong>
                            {student.name}
                          </strong>

                          <span>
                            Student
                          </span>

                        </div>


                        <button
                          type="button"
                          className="message-person-button"
                          onClick={() =>
                            handleStartConversation(
                              student
                            )
                          }
                        >
                          Message
                        </button>

                      </div>

                    )
                  )}

                </div>

              )}

            </div>

          )}


          {/* STUDENT VIEW */}

          {!communication?.isForumAdmin && (

            <div className="person-section">

              <h4>
                Course Instructor
              </h4>

              <button
                type="button"
                className="contact-instructor-button"
                onClick={() => {

                  const instructor =
                    communication?.course
                      ?.instructor;

                  if (instructor) {

                    handleStartConversation(
                      instructor
                    );

                  }

                }}
              >

                Message Instructor

              </button>

            </div>

          )}

        </aside>

      </div>


      {/* ==================================
          MESSAGE AREA
      ================================== */}

      {selectedPerson && (

        <section className="message-panel">

          <div className="message-panel-header">

            <div className="person-avatar">

              {selectedPerson.name
                ?.charAt(0)
                ?.toUpperCase()}

            </div>

            <div>

              <strong>
                {selectedPerson.name}
              </strong>

              <span>
                {selectedPerson.role}
              </span>

            </div>

          </div>


          <div className="message-coming-soon">

            <h3>
              Messaging is ready for the next stage
            </h3>

            <p>
              Real-time messages, voice notes and
              video calls will be connected here
              with Socket.IO and WebRTC.
            </p>

          </div>

        </section>

      )}

    </div>

  );

};


export default CourseCommunication;