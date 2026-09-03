
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

import {
  useAuth
} from "../../context/AuthContext";

import "../../styles/InstructorChat.css";


const API_URL =
  process.env.REACT_APP_API_URL ||
  "http://localhost:5000";


const InstructorChat = () => {

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


  const messagesEndRef =
    useRef(null);


  // ==========================================
  // LOAD CONVERSATION
  // ==========================================

  useEffect(() => {

    const loadConversation =
      async () => {

        try {

          setLoading(true);

          setError("");


          /*
           * We currently load the conversation
           * through the communication endpoint.
           *
           * The Socket.IO connection will be
           * added in the next step.
           */

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


          setConversation(
            data.conversation
          );

          setMessages(
            data.messages || []
          );


        } catch (err) {

          console.error(
            "Load conversation error:",
            err
          );

          setError(
            err.message ||
            "Failed to load conversation."
          );

        } finally {

          setLoading(false);

        }

      };


    if (
      token &&
      conversationId
    ) {

      loadConversation();

    }

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
  // GET STUDENT
  // ==========================================

  const student =
    conversation?.participants?.find(
      participant =>
        participant._id !== user?._id
    );


  // ==========================================
  // SEND MESSAGE
  // ==========================================

  const handleSendMessage =
    async (event) => {

      event.preventDefault();


      const trimmedMessage =
        message.trim();


      if (
        !trimmedMessage ||
        sending
      ) {

        return;

      }


      try {

        setSending(true);


        /*
         * REST message creation will be
         * connected to Socket.IO shortly.
         */

        const response =
          await fetch(
            `${API_URL}/api/communication/messages`,
            {
              method: "POST",

              headers: {

                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`

              },

              body: JSON.stringify({

                conversationId,

                content:
                  trimmedMessage,

                type:
                  "text"

              })

            }
          );


        const data =
          await response.json();


        if (!response.ok) {

          throw new Error(
            data.message ||
            "Failed to send message"
          );

        }


        if (data.message) {

          setMessages(
            previous => [
              ...previous,
              data.message
            ]
          );

        }


        setMessage("");


      } catch (err) {

        console.error(
          "Send message error:",
          err
        );

        setError(
          err.message ||
          "Failed to send message."
        );

      } finally {

        setSending(false);

      }

    };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="instructor-chat-page">

        <div className="instructor-chat-loading">

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
    error ||
    !conversation
  ) {

    return (

      <div className="instructor-chat-page">

        <div className="instructor-chat-error">

          <FaComments />

          <h2>
            Unable to open chat
          </h2>

          <p>
            {error ||
              "Conversation not found."}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/instructor/communication"
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
  // CHAT
  // ==========================================

  return (

    <div className="instructor-chat-page">


      {/* ======================================
          CHAT HEADER
      ====================================== */}

      <header className="instructor-chat-header">

        <button
          type="button"
          className="chat-back-button"
          onClick={() =>
            navigate(
              "/instructor/communication"
            )
          }
        >

          <FaArrowLeft />

        </button>


        <div className="chat-user-avatar">

          {student?.profileImage ? (

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
              {(student?.name ||
                "S")
                .charAt(0)
                .toUpperCase()}
            </span>

          )}

        </div>


        <div className="chat-user-info">

          <h2>
            {student?.name ||
              "Student"}
          </h2>

          <span>
            {student?.email ||
              "Student"}
          </span>

        </div>


        {/* ==================================
            CALL ACTIONS

            Instructor is allowed to
            initiate calls.
        ================================== */}

        <div className="chat-header-actions">

          <button
            type="button"
            title="Audio call"
            className="chat-call-button"
            onClick={() =>
              console.log(
                "Audio call will be added in the next phase"
              )
            }
          >

            <FaPhone />

          </button>


          <button
            type="button"
            title="Video call"
            className="chat-video-button"
            onClick={() =>
              console.log(
                "Video call will be added in the next phase"
              )
            }
          >

            <FaVideo />

          </button>


          <button
            type="button"
            title="More"
            className="chat-more-button"
          >

            <FaEllipsisV />

          </button>

        </div>

      </header>


      {/* ======================================
          COURSE INFORMATION
      ====================================== */}

      <div className="chat-course-bar">

        <FaComments />

        <span>
          {conversation.course?.title ||
            "Course Communication"}
        </span>

      </div>


      {/* ======================================
          ERROR
      ====================================== */}

      {error && (

        <div className="chat-inline-error">

          {error}

        </div>

      )}


      {/* ======================================
          MESSAGES
      ====================================== */}

      <main className="chat-messages">

        {messages.length === 0 ? (

          <div className="chat-empty">

            <FaComments />

            <h3>
              Start a conversation
            </h3>

            <p>
              Send a message to your
              student.
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
                      ? "chat-message-row mine"
                      : "chat-message-row"
                  }
                >

                  <div
                    className={
                      isMine
                        ? "chat-message-bubble mine"
                        : "chat-message-bubble"
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


                    <span className="chat-message-time">

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
        className="chat-input-area"
        onSubmit={
          handleSendMessage
        }
      >

        <button
          type="button"
          className="chat-input-action"
          title="Voice message"
          onClick={() =>
            console.log(
              "Voice messages will be added next"
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
        />


        <button
          type="submit"
          className="chat-send-button"
          disabled={
            !message.trim() ||
            sending
          }
        >

          <FaPaperPlane />

        </button>

      </form>

    </div>

  );

};


export default InstructorChat;
