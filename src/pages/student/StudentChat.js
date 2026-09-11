import {
  useEffect,
  useState,
  useRef
} from "react";

import {
  useNavigate,
  useParams
} from "react-router-dom";

import {
  FaArrowLeft,
  FaPaperPlane,
  FaMicrophone,
  FaPhone,
  FaVideo,
  FaEllipsisV,
  FaComments,
  FaUserGraduate,
  FaChalkboardTeacher
} from "react-icons/fa";

import { io } from "socket.io-client";

import {
  useAuth
} from "../../context/AuthContext";

import "../../styles/StudentChat.css";


const API_URL =
  process.env.REACT_APP_API_URL ||
  "http://localhost:5000";


const StudentChat = () => {

  const {
    token,
    user
  } = useAuth();

  const {
    conversationId
  } = useParams();

  const navigate =
    useNavigate();


  // ==========================================
  // STATE
  // ==========================================

  const [
    conversation,
    setConversation
  ] = useState(null);

  const [
    messages,
    setMessages
  ] = useState([]);

  const [
    message,
    setMessage
  ] = useState("");

  const [
    loading,
    setLoading
  ] = useState(true);

  const [
    sending,
    setSending
  ] = useState(false);

  const [
    error,
    setError
  ] = useState("");

  const [
    socketConnected,
    setSocketConnected
  ] = useState(false);


  const messagesEndRef =
    useRef(null);

  const socketRef =
    useRef(null);


  // ==========================================
  // LOAD FORUM + CONNECT SOCKET
  // ==========================================

  useEffect(() => {

    if (
      !token ||
      !conversationId
    ) {
      return;
    }


    let mounted = true;


    const loadForum =
      async () => {

        try {

          setLoading(true);

          setError("");


          // ====================================
          // LOAD FORUM MESSAGES
          // ====================================

          const response =
            await fetch(
              `${API_URL}/api/communication/conversation/${conversationId}`,
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
              "Failed to load course forum"
            );

          }


          if (!mounted) {
            return;
          }


          setConversation(
            data.conversation
          );

          setMessages(
            data.messages || []
          );


          // ====================================
          // CONNECT SOCKET.IO
          // ====================================

          const socket =
            io(API_URL, {
              auth: {
                token
              }
            });


          socketRef.current =
            socket;


          // ====================================
          // SOCKET CONNECTED
          // ====================================

          socket.on(
            "connect",
            () => {

              console.log(
                "Student Forum Socket.IO connected:",
                socket.id
              );


              setSocketConnected(
                true
              );


              // ================================
              // JOIN COURSE FORUM ROOM
              // ================================

              socket.emit(
                "join_conversation",
                conversationId
              );

            }
          );


          // ====================================
          // FORUM JOINED
          // ====================================

          socket.on(
            "conversation_joined",
            socketData => {

              console.log(
                "Course forum joined:",
                socketData
              );

            }
          );


          // ====================================
          // RECEIVE NEW MESSAGE
          // ====================================

          socket.on(
            "new_message",
            newMessage => {

              console.log(
                "New forum message received:",
                newMessage
              );


              setMessages(
                previousMessages => {

                  const alreadyExists =
                    previousMessages.some(
                      existingMessage =>
                        existingMessage._id ===
                        newMessage._id
                    );


                  if (
                    alreadyExists
                  ) {

                    return previousMessages;

                  }


                  return [
                    ...previousMessages,
                    newMessage
                  ];

                }
              );

            }
          );


          // ====================================
          // FORUM ERROR
          // ====================================

          socket.on(
            "communication_error",
            socketError => {

              console.error(
                "Forum socket error:",
                socketError
              );


              setError(
                socketError?.message ||
                "Forum communication error"
              );

              setSending(false);

            }
          );


          // ====================================
          // SOCKET DISCONNECT
          // ====================================

          socket.on(
            "disconnect",
            reason => {

              console.log(
                "Student Forum Socket.IO disconnected:",
                reason
              );


              setSocketConnected(
                false
              );

            }
          );


          // ====================================
          // SOCKET CONNECTION ERROR
          // ====================================

          socket.on(
            "connect_error",
            socketError => {

              console.error(
                "Forum socket connection error:",
                socketError
              );


              setSocketConnected(
                false
              );

              setError(
                "Unable to connect to the course forum."
              );

            }
          );

        } catch (err) {

          console.error(
            "Load student forum error:",
            err
          );


          if (mounted) {

            setError(
              err.message ||
              "Failed to load course forum."
            );

          }

        } finally {

          if (mounted) {

            setLoading(false);

          }

        }

      };


    loadForum();


    // ==========================================
    // CLEANUP
    // ==========================================

    return () => {

      mounted = false;


      if (
        socketRef.current
      ) {

        socketRef.current.emit(
          "leave_conversation",
          conversationId
        );


        socketRef.current.disconnect();

        socketRef.current = null;

      }

    };

  }, [
    token,
    conversationId
  ]);


  // ==========================================
  // SCROLL TO BOTTOM
  // ==========================================

  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });

  }, [
    messages
  ]);


  // ==========================================
  // FIND INSTRUCTOR
  // ==========================================

  const instructor =
    conversation?.participants?.find(
      participant =>
        participant?.role?.toLowerCase() ===
        "instructor"
    );


  // ==========================================
  // COURSE INFORMATION
  // ==========================================

  const course =
    conversation?.course;


  const courseTitle =
    course?.title ||
    "Course Forum";


  // ==========================================
  // SEND MESSAGE THROUGH SOCKET.IO
  // ==========================================

  const handleSendMessage =
    event => {

      event.preventDefault();


      const trimmedMessage =
        message.trim();


      if (
        !trimmedMessage ||
        sending
      ) {

        return;

      }


      if (
        !socketRef.current ||
        !socketConnected
      ) {

        setError(
          "Forum is not connected. Please wait a moment and try again."
        );

        return;

      }


      setSending(true);

      setError("");


      // ========================================
      // SEND MESSAGE
      // ========================================

      socketRef.current.emit(
        "send_message",
        {
          conversationId,
          content: trimmedMessage
        }
      );


      // ========================================
      // CLEAR INPUT
      // ========================================

      setMessage("");


      // ========================================
      // RESET SENDING STATE
      // ========================================

      setTimeout(() => {

        setSending(false);

      }, 300);

    };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="student-chat-page">

        <div className="student-chat-loading">

          <FaComments />

          <p>
            Loading course forum...
          </p>

        </div>

      </div>

    );

  }


  // ==========================================
  // ERROR
  // ==========================================

  if (
    error &&
    !conversation
  ) {

    return (

      <div className="student-chat-page">

        <div className="student-chat-error">

          <FaComments />

          <h2>
            Unable to open forum
          </h2>

          <p>
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/student/communication"
              )
            }
          >
            Back to Forum
          </button>

        </div>

      </div>

    );

  }


  // ==========================================
  // FORUM PAGE
  // ==========================================

  return (

    <div className="student-chat-page">


      {/* ======================================
          HEADER
      ====================================== */}

      <header className="student-chat-header">

        <button
          type="button"
          className="student-chat-back-button"
          onClick={() =>
            navigate(
              "/student/communication"
            )
          }
        >

          <FaArrowLeft />

        </button>


        {/* ====================================
            FORUM ICON
        ==================================== */}

        <div className="student-chat-user-avatar">

          <FaComments />

        </div>


        {/* ====================================
            FORUM INFORMATION
        ==================================== */}

        <div className="student-chat-user-info">

          <h2>
            {courseTitle}
          </h2>

          <span>
            Course Forum
          </span>

        </div>


        {/* ====================================
            SOCKET STATUS
        ==================================== */}

        <div
          className={
            socketConnected
              ? "student-chat-online-status connected"
              : "student-chat-online-status"
          }
        >

          <span />

          {socketConnected
            ? "Online"
            : "Connecting..."}

        </div>


        {/* ====================================
            CALL BUTTONS
        ==================================== */}

        <div className="student-chat-header-actions">

          <button
            type="button"
            className="student-chat-call-button"
            title="Audio call"
            disabled
          >

            <FaPhone />

          </button>


          <button
            type="button"
            className="student-chat-video-button"
            title="Video call"
            disabled
          >

            <FaVideo />

          </button>


          <button
            type="button"
            className="student-chat-more-button"
            title="More"
          >

            <FaEllipsisV />

          </button>

        </div>

      </header>


      {/* ======================================
          COURSE / INSTRUCTOR BAR
      ====================================== */}

      <div className="student-chat-course-bar">

        <FaChalkboardTeacher />

        <span>

          Instructor:{" "}

          {instructor?.name ||
            instructor?.email ||
            "Course Instructor"}

        </span>

      </div>


      {/* ======================================
          INLINE ERROR
      ====================================== */}

      {error && (

        <div className="student-chat-inline-error">

          {error}

        </div>

      )}


      {/* ======================================
          MESSAGES
      ====================================== */}

      <main className="student-chat-messages">

        {messages.length === 0 ? (

          <div className="student-chat-empty">

            <FaComments />

            <h3>
              Welcome to the Course Forum
            </h3>

            <p>
              Start a discussion with your
              instructor and fellow enrolled
              students.
            </p>

          </div>

        ) : (

          messages.map(
            currentMessage => {

              const senderId =
                currentMessage.sender?._id ||
                currentMessage.sender;


              const isMine =
                senderId?.toString() ===
                user?._id?.toString();


              return (

                <div
                  key={
                    currentMessage._id
                  }
                  className={
                    isMine
                      ? "student-chat-message-row mine"
                      : "student-chat-message-row"
                  }
                >

                  {/* ============================
                      OTHER USER
                  ============================ */}

                  {!isMine && (

                    <div className="student-chat-message-sender">

                      <FaUserGraduate />

                      <span>
                        {
                          currentMessage.sender?.name ||
                          "Forum Member"
                        }
                      </span>

                    </div>

                  )}


                  <div
                    className={
                      isMine
                        ? "student-chat-message-bubble mine"
                        : "student-chat-message-bubble"
                    }
                  >

                    {currentMessage.type ===
                    "text" ? (

                      <p>
                        {
                          currentMessage.content
                        }
                      </p>

                    ) : (

                      <p>
                        {
                          currentMessage.type ||
                          "Message"
                        }
                      </p>

                    )}


                    <span className="student-chat-message-time">

                      {currentMessage.createdAt
                        ? new Date(
                            currentMessage.createdAt
                          ).toLocaleTimeString(
                            [],
                            {
                              hour:
                                "2-digit",
                              minute:
                                "2-digit"
                            }
                          )
                        : ""}

                    </span>

                  </div>

                </div>

              );

            }

          )

        )}


        <div
          ref={
            messagesEndRef
          }
        />

      </main>


      {/* ======================================
          MESSAGE INPUT
      ====================================== */}

      <form
        className="student-chat-input-area"
        onSubmit={
          handleSendMessage
        }
      >

        {/* ====================================
            VOICE MESSAGE
        ==================================== */}

        <button
          type="button"
          className="student-chat-input-action"
          title="Voice message"
          disabled
        >

          <FaMicrophone />

        </button>


        {/* ====================================
            TEXT INPUT
        ==================================== */}

        <input
          type="text"
          placeholder="Write something to the forum..."
          value={
            message
          }
          onChange={
            event =>
              setMessage(
                event.target.value
              )
          }
          disabled={
            !socketConnected
          }
        />


        {/* ====================================
            SEND
        ==================================== */}

        <button
          type="submit"
          className="student-chat-send-button"
          disabled={
            !message.trim() ||
            sending ||
            !socketConnected
          }
        >

          <FaPaperPlane />

        </button>

      </form>

    </div>

  );

};


export default StudentChat;