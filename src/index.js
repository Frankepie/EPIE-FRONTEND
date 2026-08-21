import React from "react";
import ReactDOM from "react-dom/client";
import "@fortawesome/fontawesome-free/css/all.min.css";
import App from "./App";
import "./index.css";

const registerServiceWorker = () => {

  if ("serviceWorker" in navigator) {

    window.addEventListener(
      "load",
      () => {

        navigator.serviceWorker
          .register("/service-worker.js")
          .then((registration) => {

            console.log(
              "EduLearn service worker registered:",
              registration.scope
            );

          })
          .catch((error) => {

            console.error(
              "EduLearn service worker registration failed:",
              error
            );

          });

      }
    );

  }

};

registerServiceWorker();
const root =
  ReactDOM.createRoot(
    document.getElementById("root")
  );

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);