import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "./LessonAI.css";


const LessonAI = ({
  lesson,
  moduleId
}) => {

  const { token } = useAuth();


  const [isOpen, setIsOpen] =
    useState(false);

  const [messages, setMessages] =
    useState([
      {
        role: "assistant",
        content:
          "Hi! I'm EduLearn Lesson AI. Ask me anything about this lesson."
      }
    ]);

  const [input, setInput] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  // =====================================
  // SEND MESSAGE
  // =====================================

  const sendMessage = async () => {

    const trimmedMessage =
      input.trim();


    if (
      !trimmedMessage ||
      loading ||
      !lesson?._id
    ) {
      return;
    }


    const userMessage = {
      role: "user",
      content: trimmedMessage
    };


    setMessages((previous) => [
      ...previous,
      userMessage
    ]);


    setInput("");

    setLoading(true);


    try {

      const response =
        await fetch(
          "http://localhost:5000/api/ai/lesson-chat",
          {
            method: "POST",

            headers: {

              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`

            },

            body: JSON.stringify({

              lessonId:
                lesson._id,

              message:
                trimmedMessage

            })

          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to get lesson AI response."
        );

      }


      setMessages((previous) => [

        ...previous,

        {
          role: "assistant",
          content:
            data.answer
        }

      ]);

    } catch (error) {

      console.error(
        "Lesson AI request error:",
        error
      );


      setMessages((previous) => [

        ...previous,

        {
          role: "assistant",
          content:
            "Sorry, I couldn't process your question right now. Please try again."
        }

      ]);

    } finally {

      setLoading(false);

    }

  };


  // =====================================
  // ENTER KEY
  // =====================================

  const handleKeyDown =
    (event) => {

      if (
        event.key === "Enter" &&
        !event.shiftKey
      ) {

        event.preventDefault();

        sendMessage();

      }

    };


  // =====================================
  // CLOSE AI
  // =====================================

  const closeAssistant = () => {

    setIsOpen(false);

  };


  // =====================================
  // NO LESSON
  // =====================================

  if (!lesson) {
    return null;
  }


  return (

    <div className="lesson-ai-wrapper">


      {/* =================================
          OPEN BUTTON
      ================================= */}

      {!isOpen && (

        <button
          type="button"
          className="lesson-ai-open-button"
          onClick={() =>
            setIsOpen(true)
          }
        >

          <span className="lesson-ai-open-icon">

            <i className="fas fa-robot"></i>

          </span>

          <span>

            <strong>
              Ask EduLearn AI
            </strong>

            <small>
              About this lesson
            </small>

          </span>

        </button>

      )}


      {/* =================================
          CHAT WINDOW
      ================================= */}

      {isOpen && (

        <div className="lesson-ai-chat">


          {/* HEADER */}

          <div className="lesson-ai-header">

            <div className="lesson-ai-header-info">

              <div className="lesson-ai-avatar">

                <i className="fas fa-robot"></i>

              </div>


              <div>

                <h3>
                  Lesson AI
                </h3>

                <span>
                  Current lesson context
                </span>

              </div>

            </div>


            <button
              type="button"
              className="lesson-ai-close"
              onClick={closeAssistant}
              title="Close Lesson AI"
            >

              <i className="fas fa-times"></i>

            </button>

          </div>


          {/* CONTEXT */}

          <div className="lesson-ai-context">

            <div>

              <i className="fas fa-book"></i>

              <span>
                Current Lesson
              </span>

            </div>

            <strong>
              {lesson.title}
            </strong>

          </div>


          {/* MESSAGES */}

          <div className="lesson-ai-messages">

            {messages.map(
              (message, index) => (

                <div
                  key={index}
                  className={
                    message.role === "user"
                      ? "lesson-ai-message lesson-ai-user"
                      : "lesson-ai-message lesson-ai-assistant"
                  }
                >

                  {message.role === "assistant" && (

                    <div className="lesson-ai-message-avatar">

                      <i className="fas fa-robot"></i>

                    </div>

                  )}


                  <div className="lesson-ai-message-content">

                    {message.content}

                  </div>

                </div>

              )
            )}


            {/* LOADING */}

            {loading && (

              <div className="lesson-ai-message lesson-ai-assistant">

                <div className="lesson-ai-message-avatar">

                  <i className="fas fa-robot"></i>

                </div>


                <div className="lesson-ai-typing">

                  <span></span>
                  <span></span>
                  <span></span>

                </div>

              </div>

            )}

          </div>


          {/* INPUT */}

          <div className="lesson-ai-input-area">

            <textarea
              value={input}
              onChange={(event) =>
                setInput(
                  event.target.value
                )
              }
              onKeyDown={handleKeyDown}
              placeholder="Ask about this lesson..."
              rows="1"
              disabled={loading}
            />


            <button
              type="button"
              onClick={sendMessage}
              disabled={
                loading ||
                !input.trim()
              }
              title="Send question"
            >

              <i className="fas fa-paper-plane"></i>

            </button>

          </div>


          <div className="lesson-ai-disclaimer">

            Answers are based on the current
            lesson context.

          </div>

        </div>

      )}

    </div>

  );

};


export default LessonAI;