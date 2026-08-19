import React from "react";

import AIChatWindow
  from "./AIChatWindow";

import "./AIAssistant.css";


const AIAssistant = ({
  courseContext = null,
  moduleContext = null,
  selectedLesson = null
}) => {

  return (

    <div className="ai-assistant-page">

      <div className="ai-assistant-container">

        <div className="ai-assistant-intro">

          <h1>
            AI Learning Assistant
          </h1>

          <p>
            Get help understanding lessons,
            concepts, assignments, and more.
          </p>

        </div>


        <AIChatWindow

          courseContext={
            courseContext
          }

          moduleContext={
            moduleContext
          }

          selectedLesson={
            selectedLesson
          }

        />

      </div>

    </div>

  );

};


export default AIAssistant;