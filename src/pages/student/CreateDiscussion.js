import {
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  useAuth
} from "../../context/AuthContext";

import "../../styles/CreateDiscussion.css";


const CreateDiscussion = () => {

  const navigate = useNavigate();

  const { token } = useAuth();

  const [title, setTitle] =
    useState("");

  const [content, setContent] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");


  const handleSubmit =
    async (event) => {

      event.preventDefault();

      if (!title.trim()) {

        setError(
          "Discussion title is required."
        );

        return;
      }

      if (!content.trim()) {

        setError(
          "Discussion content is required."
        );

        return;
      }


      try {

        setSaving(true);
        setError("");


        const response =
          await fetch(
            "http://localhost:5000/api/discussions",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`
              },

              body: JSON.stringify({
                title,
                content
              })
            }
          );


        const data =
          await response.json();


        if (!response.ok) {

          throw new Error(
            data.message ||
            "Failed to create discussion"
          );

        }


        navigate(
          "/student/discussions"
        );


      } catch (error) {

        setError(
          error.message
        );

      } finally {

        setSaving(false);

      }

    };


  return (

    <div className="create-discussion-page">

      <div className="create-discussion-header">

        <button
          type="button"
          className="back-discussions-button"
          onClick={() =>
            navigate(
              "/student/discussions"
            )
          }
        >
          ← Discussions
        </button>

        <p>
          Student Community
        </p>

        <h1>
          Start a Discussion
        </h1>

        <span>
          Ask a question or share
          something with the community.
        </span>

      </div>


      {error && (

        <div className="create-discussion-error">
          {error}
        </div>

      )}


      <div className="create-discussion-card">

        <form
          onSubmit={handleSubmit}
        >

          <div className="discussion-form-group">

            <label>
              Discussion Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(
                  event.target.value
                )
              }
              placeholder="e.g. How do I connect React to MongoDB?"
              disabled={saving}
            />

          </div>


          <div className="discussion-form-group">

            <label>
              Your Message
            </label>

            <textarea
              value={content}
              onChange={(event) =>
                setContent(
                  event.target.value
                )
              }
              placeholder="Write your question or discussion here..."
              rows="8"
              disabled={saving}
            />

          </div>


          <div className="discussion-form-actions">

            <button
              type="button"
              className="cancel-discussion-button"
              onClick={() =>
                navigate(
                  "/student/discussions"
                )
              }
              disabled={saving}
            >
              Cancel
            </button>


            <button
              type="submit"
              className="submit-discussion-button"
              disabled={saving}
            >
              {saving
                ? "Publishing..."
                : "Publish Discussion"}
            </button>

          </div>

        </form>

      </div>

    </div>

  );

};


export default CreateDiscussion;