import React, { useState } from "react";
import "./AIAssistant.css";


const AIChatWindow = ({
  courseContext = null,
  moduleContext = null,
  selectedLesson = null
}) => {

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm EduLearn AI Assistant. How can I help you learn today?"
    }
  ]);

  const [input, setInput] = useState("");

  const [loading, setLoading] = useState(false);


  // =====================================
  // SEND MESSAGE
  // =====================================

  const sendMessage = async () => {

    const trimmedMessage =
      input.trim();

// =====================================
// BUILD LEARNING CONTEXT
// =====================================

const learningContext = {

  course: courseContext
    ? {
        title:
          courseContext.title,

        category:
          courseContext.category,

        level:
          courseContext.level,

        description:
          courseContext.description
      }
    : null,


  module: moduleContext
    ? {
        title:
          moduleContext.title,

        description:
          moduleContext.description
      }
    : null,


  lesson: selectedLesson
    ? {
        title:
          selectedLesson.title,

        content:
          selectedLesson.content,

        duration:
          selectedLesson.duration
      }
    : null

};
    if (
      !trimmedMessage ||
      loading
    ) {
      return;
    }


    // ===================================
    // SAVE CURRENT CONVERSATION
    // BEFORE ADDING NEW USER MESSAGE
    // ===================================

    const conversationHistory =
      messages
        .filter(
          (message) =>
            message.role === "user" ||
            message.role === "assistant"
        )
        .map(
          (message) => ({
            role: message.role,
            content: message.content
          })
        );


    // ===================================
    // CREATE USER MESSAGE
    // ===================================

    const userMessage = {
      role: "user",
      content: trimmedMessage
    };


    // ===================================
    // SHOW USER MESSAGE IMMEDIATELY
    // ===================================

    setMessages((previous) => [

      ...previous,

      userMessage

    ]);


    setInput("");

    setLoading(true);


    try {

      const token =
        localStorage.getItem("token");


      // =================================
      // SEND TO BACKEND
      // =================================

      const response = await fetch(

        "http://localhost:5000/api/ai/chat",

        {

          method: "POST",

          headers: {

            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`

          },

       body: JSON.stringify({

  message:
    trimmedMessage,

  conversationHistory,

  learningContext

})

        }

      );


      const data =
        await response.json();


      // =================================
      // HANDLE ERROR
      // =================================

      if (!response.ok) {

        throw new Error(

          data.message ||
          "Failed to get AI response."

        );

      }


      // =================================
      // ADD AI RESPONSE
      // =================================

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
        "AI request error:",
        error
      );


      setMessages((previous) => [

        ...previous,

        {

          role: "assistant",

          content:
            "Sorry, I couldn't process your request right now. Please try again."

        }

      ]);


    } finally {

      setLoading(false);

    }

  };


  // =====================================
  // ENTER KEY
  // =====================================

  const handleKeyDown = (event) => {

    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {

      event.preventDefault();

      sendMessage();

    }

  };


  return (

    <div className="ai-chat-window">


      {/* =================================
          HEADER
      ================================= */}

      <div className="ai-chat-header">

        <div className="ai-chat-header-info">

          <div className="ai-avatar">

            <i className="fas fa-robot"></i>

          </div>


          <div>

            <h3>
              EduLearn AI
            </h3>

            <span>
              Learning Assistant
            </span>

          </div>

        </div>


        <div className="ai-status">

          <span className="ai-status-dot"></span>

          Online

        </div>

      </div>


      {/* =================================
          MESSAGES
      ================================= */}

      <div className="ai-chat-messages">

        {messages.map(
          (message, index) => (

            <div
              key={index}
              className={
                `ai-message ${
                  message.role === "user"
                    ? "ai-message-user"
                    : "ai-message-assistant"
                }`
              }
            >

              {message.role ===
              "assistant" && (

                <div className="ai-message-avatar">

                  <i className="fas fa-robot"></i>

                </div>

              )}


              <div className="ai-message-content">

                {message.content}

              </div>

            </div>

          )
        )}


        {/* LOADING */}

        {loading && (

          <div className="ai-message ai-message-assistant">

            <div className="ai-message-avatar">

              <i className="fas fa-robot"></i>

            </div>


            <div className="ai-typing">

              <span></span>
              <span></span>
              <span></span>

            </div>

          </div>

        )}

      </div>


      {/* =================================
          INPUT
      ================================= */}

      <div className="ai-chat-input-area">

        <textarea
          value={input}

          onChange={(event) =>
            setInput(
              event.target.value
            )
          }

          onKeyDown={handleKeyDown}

          placeholder="Ask EduLearn AI anything..."

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

          title="Send message"
        >

          <i className="fas fa-paper-plane"></i>

        </button>

      </div>


      <div className="ai-disclaimer">

        EduLearn AI can make mistakes.
        Always verify important information.

      </div>

    </div>

  );

};


export default AIChatWindow;