import {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  useAuth
} from "../../context/AuthContext";

import {
  getMyBookmarks,
  removeBookmark
} from "../../services/api";

import "../../styles/MyBookmarks.css";


const MyBookmarks = () => {

  const {
    token
  } = useAuth();

  const navigate =
    useNavigate();


  const [bookmarks, setBookmarks] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [removingId, setRemovingId] =
    useState(null);


  useEffect(() => {

    const loadBookmarks =
      async () => {

        try {

          setLoading(true);
          setError("");

          const data =
            await getMyBookmarks(
              token
            );

          setBookmarks(
            data.bookmarks || []
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

      loadBookmarks();

    }

  }, [token]);


  const handleRemove =
    async (lessonId) => {

      try {

        setRemovingId(
          lessonId
        );

        setError("");


        await removeBookmark(
          lessonId,
          token
        );


        setBookmarks(
          bookmarks.filter(
            (bookmark) =>
              bookmark.lesson?._id !==
              lessonId
          )
        );

      } catch (error) {

        setError(
          error.message
        );

      } finally {

        setRemovingId(null);

      }

    };


  const handleOpenLesson =
    (bookmark) => {

      const lesson =
        bookmark.lesson;

      const module =
        lesson?.module;


      if (!module) {

        setError(
          "Module information is missing from this bookmark."
        );

        return;

      }


      const moduleId =
        typeof module === "object"
          ? module._id
          : module;


      navigate(
        `/student/modules/${moduleId}/lessons`
      );

    };


  if (loading) {

    return (

      <div className="my-bookmarks-page">

        <div className="my-bookmarks-loading">

          Loading your bookmarks...

        </div>

      </div>

    );

  }


  return (

    <div className="my-bookmarks-page">


      {/* HEADER */}

      <div className="my-bookmarks-header">

        <div>

          <p className="bookmarks-eyebrow">
            Student Learning
          </p>

          <h1>
            My Bookmarks
          </h1>

          <p>
            Quickly return to the lessons
            you saved for later.
          </p>

        </div>


        <div className="bookmarks-count">

          🔖 {bookmarks.length}

        </div>

      </div>


      {/* ERROR */}

      {error && (

        <div className="bookmarks-error">

          {error}

        </div>

      )}


      {/* EMPTY */}

      {bookmarks.length === 0 ? (

        <div className="bookmarks-empty">

          <div className="bookmarks-empty-icon">
            🔖
          </div>

          <h2>
            No bookmarks yet
          </h2>

          <p>
            When you bookmark a lesson,
            it will appear here.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/student/courses"
              )
            }
          >
            Browse My Courses
          </button>

        </div>

      ) : (

        <div className="bookmarks-list">

          {bookmarks.map(
            (bookmark) => {

              const lesson =
                bookmark.lesson;

              const course =
                bookmark.course;


              return (

                <div
                  className="bookmark-card"
                  key={bookmark._id}
                >

                  <div className="bookmark-icon">
                    🔖
                  </div>


                  <div className="bookmark-information">

                    <span className="bookmark-label">
                      SAVED LESSON
                    </span>

                    <h2>
                      {lesson?.title ||
                        "Untitled Lesson"}
                    </h2>


                    <p>
                      {lesson?.duration
                        ? `${lesson.duration} minutes`
                        : "Lesson"}
                    </p>


                    {course && (

                      <small>
                        {typeof course ===
                        "object"
                          ? course.title
                          : "Course"}
                      </small>

                    )}

                  </div>


                  <div className="bookmark-actions">

                    <button
                      type="button"
                      onClick={() =>
                        handleOpenLesson(
                          bookmark
                        )
                      }
                      className="open-bookmark-button"
                    >
                      Open Lesson
                    </button>


                    <button
                      type="button"
                      onClick={() =>
                        handleRemove(
                          lesson?._id
                        )
                      }
                      className="remove-bookmark-button"
                      disabled={
                        removingId ===
                        lesson?._id
                      }
                    >

                      {removingId ===
                      lesson?._id
                        ? "Removing..."
                        : "Remove"}

                    </button>

                  </div>

                </div>

              );

            }
          )}

        </div>

      )}

    </div>

  );

};


export default MyBookmarks;