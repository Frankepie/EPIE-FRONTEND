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
  FaComments
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
  // LOAD CONVERSATION + CONNECT SOCKET
  // ==========================================

  useEffect(() => {

    if (
      !token ||
      !conversationId
    ) {
      return;
    }


    let mounted = true;


    const loadConversation =
      async () => {

        try {

          setLoading(true);
          setError("");


          // ====================================
          // LOAD EXISTING CONVERSATION
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
              "Failed to load conversation"
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
                "Student Socket.IO connected:",
                socket.id
              );


              setSocketConnected(
                true
              );


              // ================================
              // JOIN CONVERSATION ROOM
              // ================================

              socket.emit(
                "join_conversation",
                conversationId
              );

            }
          );


          // ====================================
          // CONVERSATION JOINED
          // ====================================

          socket.on(
            "conversation_joined",
            data => {

              console.log(
                "Conversation joined:",
                data
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
                "New message received:",
                newMessage
              );


              setMessages(
                previousMessages => {

                  // ==========================
                  // PREVENT DUPLICATES
                  // ==========================

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
          // COMMUNICATION ERROR
          // ====================================

          socket.on(
            "communication_error",
            socketError => {

              console.error(
                "Socket communication error:",
                socketError
              );


              setError(
                socketError?.message ||
                "Communication error"
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
                "Student Socket.IO disconnected:",
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
                "Socket connection error:",
                socketError
              );


              setSocketConnected(
                false
              );

              setError(
                "Unable to connect to real-time chat."
              );

            }
          );

        } catch (err) {

          console.error(
            "Load student conversation error:",
            err
          );


          if (mounted) {

            setError(
              err.message ||
              "Failed to load conversation."
            );

          }

        } finally {

          if (mounted) {

            setLoading(false);

          }

        }

      };


    loadConversation();


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
  // GET OTHER PARTICIPANT
  // ==========================================

  const instructor =
    conversation?.participants?.find(
      participant =>
        participant._id !== user?._id
    );


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
          "Chat is not connected. Please wait a moment and try again."
        );

        return;

      }


      setSending(true);
      setError("");


      // ========================================
      // SEND TO BACKEND
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
            Loading conversation...
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
            Unable to open chat
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
            Back to Communication
          </button>

        </div>

      </div>

    );

  }


  // ==========================================
  // CHAT PAGE
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


        <div className="student-chat-user-avatar">

          {instructor?.profileImage ? (

            <img
              src={
                instructor.profileImage
              }
              alt={
                instructor.name
              }
            />

          ) : (

            <span>
              {(instructor?.name ||
                "I")
                .charAt(0)
                .toUpperCase()}
            </span>

          )}

        </div>


        <div className="student-chat-user-info">

          <h2>
            {instructor?.name ||
              "Instructor"}
          </h2>

          <span>
            {instructor?.email ||
              "Course Instructor"}
          </span>

        </div>


        {/* ==================================
            SOCKET STATUS
        ================================== */}

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


        {/* ==================================
            CALL BUTTONS
        ================================== */}

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
          COURSE BAR
      ====================================== */}

      <div className="student-chat-course-bar">

        <FaComments />

        <span>
          {conversation.course?.title ||
            "Course Communication"}
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
              Start a conversation
            </h3>

            <p>
              Send a message to your
              instructor.
            </p>

          </div>

        ) : (

          messages.map(
            currentMessage => {

              const isMine =
                currentMessage.sender?._id ===
                  user?._id ||
                currentMessage.sender ===
                  user?._id;


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
                          currentMessage.type
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
          INPUT
      ====================================== */}

      <form
        className="student-chat-input-area"
        onSubmit={
          handleSendMessage
        }
      >

        <button
          type="button"
          className="student-chat-input-action"
          title="Voice message"
          onClick={() =>
            console.log(
              "Voice messages will be added in the audio phase"
            )
          }
        >

          <FaMicrophone />

        </button>


        <input
          type="text"
          placeholder="Type a message..."
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

