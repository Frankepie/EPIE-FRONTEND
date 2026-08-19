import {
  useEffect,
  useState
} from "react";

import {
  Link
} from "react-router-dom";

import {
  useAuth
} from "../../context/AuthContext";

import "../../styles/StudentDiscussions.css";


const StudentDiscussions = () => {

  const { token } = useAuth();

  const [discussions, setDiscussions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {

    const loadDiscussions =
      async () => {

        try {

          setLoading(true);
          setError("");

          const response =
            await fetch(
              "http://localhost:5000/api/discussions",
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
              "Failed to load discussions"
            );

          }

          setDiscussions(
            data.discussions || []
          );

        } catch (error) {

          setError(
            error.message
          );

        } finally {

          setLoading(false);

        }

      };


    if (token) {

      loadDiscussions();

    }

  }, [token]);


  if (loading) {

    return (

      <div className="student-discussions-page">

        <div className="student-discussions-loading">

          Loading discussions...

        </div>

      </div>

    );

  }


  return (

    <div className="student-discussions-page">

      {/* HEADER */}

      <div className="student-discussions-header">

        <div>

          <p>
            Student Community
          </p>

          <h1>
            Discussions
          </h1>

          <span>
            Ask questions, share ideas
            and learn with other students.
          </span>

        </div>


        <Link
          to="/student/discussions/create"
          className="create-discussion-button"
        >
          + New Discussion
        </Link>

      </div>


      {/* ERROR */}

      {error && (

        <div className="discussion-error">

          {error}

        </div>

      )}


      {/* DISCUSSIONS */}

      {discussions.length === 0 ? (

        <div className="discussions-empty">

          <div className="discussions-empty-icon">
            💬
          </div>

          <h2>
            No discussions yet
          </h2>

          <p>
            Be the first student to
            start a discussion.
          </p>

          <Link
            to="/student/discussions/create"
            className="empty-create-button"
          >
            Start a Discussion
          </Link>

        </div>

      ) : (

        <div className="discussions-list">

          {discussions.map(
            (discussion) => (

              <Link
                key={discussion._id}
                to={`/student/discussions/${discussion._id}`}
                className="discussion-card"
              >

                <div className="discussion-card-icon">
                  💬
                </div>


                <div className="discussion-card-content">

                  <h2>
                    {discussion.title}
                  </h2>

                  <p>
                    {discussion.content}
                  </p>


                  <div className="discussion-card-meta">

                    <span>
                      👤{" "}
                      {discussion.author?.name ||
                        "Student"}
                    </span>

                    <span>
                      💬{" "}
                      {discussion.replies?.length ||
                        0} replies
                    </span>

                    <span>
                      {discussion.createdAt
                        ? new Date(
                            discussion.createdAt
                          ).toLocaleDateString()
                        : ""}
                    </span>

                  </div>

                </div>

              </Link>

            )
          )}

        </div>

      )}

    </div>

  );

};


export default StudentDiscussions;