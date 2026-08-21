import {
  useEffect,
  useState
} from "react";

import {
  useParams
} from "react-router-dom";

import {
  useAuth
} from "../../context/AuthContext";

import {
  getModuleLessons,
  markLessonComplete,
  getMyLessonProgress,
  addBookmark,
  removeBookmark,
  checkBookmark
} from "../../services/api";
import LessonAI from "../../components/LessonAI/LessonAI";
import "../../styles/LessonViewer.css";


const LessonViewer = () => {

  const { moduleId } = useParams();

  const { token } = useAuth();


  const [lessons, setLessons] =
    useState([]);
const [courseContext, setCourseContext] =
  useState(null);

const [moduleContext, setModuleContext] =
  useState(null);
  const [selectedLesson, setSelectedLesson] =
    useState(null);

  const [completedLessons, setCompletedLessons] =
    useState([]);
    const [isBookmarked, setIsBookmarked] =
  useState(false);

const [bookmarkLoading, setBookmarkLoading] =
  useState(false);
  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");
const [movingToNext, setMovingToNext] =
  useState(false);
const completedCount =
  lessons.filter((lesson) =>
    completedLessons.includes(lesson._id)
  ).length;

const lessonCount =
  lessons.length;

const moduleProgress =
  lessonCount > 0
    ? Math.round(
        (completedCount / lessonCount) * 100
      )
    : 0;
  useEffect(() => {

    const loadLessons = async () => {

      try {

        setLoading(true);
        setError("");


        // Get module lessons
       const data =
  await getModuleLessons(
    moduleId,
    token
  );


const lessonList =
  data.lessons || [];

setLessons(
          lessonList
        );
// =====================================
// SAVE AI LEARNING CONTEXT
// =====================================

setCourseContext(
  data.course || null
);

setModuleContext(
  data.module || null
);

        if (
          lessonList.length > 0
        ) {

          setSelectedLesson(
            lessonList[0]
          );

        }


        // Get student's progress
        const progressData =
          await getMyLessonProgress(
            token
          );


        const completed =
          (progressData.progress || [])
            .filter(
              (item) =>
                item.completed
            )
            .map(
              (item) =>
                typeof item.lesson === "object"
                  ? item.lesson._id
                  : item.lesson
            );


        setCompletedLessons(
          completed
        );


      } catch (error) {

        setError(
          error.message
        );

      } finally {

        setLoading(false);

      }

    };


    if (
      token &&
      moduleId
    ) {

      loadLessons();

    }

  }, 
  
  [
    token,
    moduleId
  ]);

   useEffect(() => {

  const loadBookmarkStatus = async () => {

    if (
      !selectedLesson ||
      !token
    ) {
      return;
    }

    try {

      const data =
        await checkBookmark(
          selectedLesson._id,
          token
        );

      setIsBookmarked(
        data.bookmarked
      );

    } catch (error) {

      console.error(
        "Failed to check bookmark:",
        error
      );

      setIsBookmarked(false);

    }

  };

  loadBookmarkStatus();

}, [
  selectedLesson,
  token
]);
 const handleComplete = async () => {

  if (
    !selectedLesson ||
    !token
  ) {
    return;
  }

  try {

    setError("");

    await markLessonComplete(
      selectedLesson._id,
      token
    );

    const updatedCompletedLessons =
      completedLessons.includes(
        selectedLesson._id
      )
        ? completedLessons
        : [
            ...completedLessons,
            selectedLesson._id
          ];

    setCompletedLessons(
      updatedCompletedLessons
    );


    // =====================================
    // AUTOMATICALLY MOVE TO NEXT LESSON
    // =====================================

    const currentIndex =
      lessons.findIndex(
        (lesson) =>
          lesson._id ===
          selectedLesson._id
      );

    const nextLesson =
      lessons[currentIndex + 1];


    if (nextLesson) {

  setMovingToNext(true);

  setTimeout(() => {

    setSelectedLesson(
      nextLesson
    );

    setMovingToNext(false);

  }, 700);

}

  } catch (error) {

    setError(
      error.message
    );

  }

};

  const handleBookmark =
  async () => {

    if (
      !selectedLesson ||
      !token
    ) {
      return;
    }

    try {

      setBookmarkLoading(true);
      setError("");

      if (isBookmarked) {

        await removeBookmark(
          selectedLesson._id,
          token
        );

        setIsBookmarked(false);

      } else {

        const courseId =
          selectedLesson.course?._id ||
          selectedLesson.course;

        if (!courseId) {

          throw new Error(
            "Course information is missing from this lesson."
          );

        }

        await addBookmark(
          selectedLesson._id,
          courseId,
          token
        );

        setIsBookmarked(true);

      }

    } catch (error) {

      setError(
        error.message
      );

    } finally {

      setBookmarkLoading(false);

    }

  };
  const goToPreviousLesson =
    () => {

      if (!selectedLesson) {
        return;
      }


      const index =
        lessons.findIndex(
          (lesson) =>
            lesson._id ===
            selectedLesson._id
        );


      if (index > 0) {

        setSelectedLesson(
          lessons[index - 1]
        );

      }

    };


  const goToNextLesson =
    () => {

      if (!selectedLesson) {
        return;
      }


      const index =
        lessons.findIndex(
          (lesson) =>
            lesson._id ===
            selectedLesson._id
        );


      if (
        index <
        lessons.length - 1
      ) {

        setSelectedLesson(
          lessons[index + 1]
        );

      }

    };


  if (loading) {

    return (
      <div className="lesson-viewer-page">

        <div className="lesson-loading">

          Loading lessons...

        </div>

      </div>
    );

  }


  if (error && lessons.length === 0) {

    return (
      <div className="lesson-viewer-page">

        <div className="lesson-viewer-error">

          {error}

        </div>

      </div>
    );

  }


  return (

    <div className="lesson-viewer-page">


     <div className="lesson-viewer-header">

  <p>
    {courseContext?.title ||
      "Student Learning"}
  </p>

  <h1>
    {moduleContext?.title ||
      "Module Lessons"}
  </h1>

  <span>
    {lessonCount} lesson
    {lessonCount !== 1 ? "s" : ""}
    {" • "}
    {completedCount} completed
  </span>

</div>

{lessons.length > 0 && (

  <div className="module-progress-card">

    <div className="module-progress-top">

      <div>
        <span>
          MODULE PROGRESS
        </span>

        <strong>
          {completedCount} of {lessonCount} lessons completed
        </strong>
      </div>

      <strong className="module-progress-percentage">
        {moduleProgress}%
      </strong>

    </div>

    <div className="module-progress-bar">

      <div
        className="module-progress-fill"
        style={{
          width: `${moduleProgress}%`
        }}
      />

    </div>

  </div>

)}
      {error && (

        <div className="lesson-viewer-error">

          {error}

        </div>

      )}


      {lessons.length === 0 ? (

        <div className="no-lessons">

          <h2>
            No lessons available
          </h2>

          <p>
            This module does not have
            any lessons yet.
          </p>

        </div>

      ) : (

        <div className="lesson-viewer-layout">


          {/* SIDEBAR */}

          <aside className="lesson-sidebar">

            <h2>
              Course Lessons
            </h2>


            <div className="student-lesson-list">

              {lessons.map(
                (lesson) => (

                  <button
                    key={lesson._id}
                    type="button"
                    className={`
  student-lesson-item
  ${
    selectedLesson?._id === lesson._id
      ? "active"
      : ""
  }
  ${
    completedLessons.includes(lesson._id)
      ? "completed"
      : ""
  }
`}
                    onClick={() =>
                      setSelectedLesson(
                        lesson
                      )
                    }
                  >

                    <span className="student-lesson-number">

                      {lesson.order}

                    </span>


                    <span className="student-lesson-details">

                      <strong>
                        {lesson.title}
                      </strong>


                   <small>

  {completedLessons.includes(
    lesson._id
  )
    ? "Completed"
    : selectedLesson?._id === lesson._id
      ? "Current lesson"
      : lesson.duration
        ? `${lesson.duration} min`
        : "Not started"}

</small>
                    </span>

                  </button>

                )
              )}

            </div>

          </aside>


          {/* MAIN CONTENT */}

          <main className="lesson-content-area">

            {selectedLesson && (

              <>

              <div className="lesson-content-header">

  <span>
    Lesson {selectedLesson.order}
  </span>

  <h2>
    {selectedLesson.title}
  </h2>

  {selectedLesson.duration > 0 && (

    <p>
      {selectedLesson.duration}
      {" "}
      minutes
    </p>

  )}

  <button
    type="button"
    className={
      isBookmarked
        ? "bookmark-button bookmarked"
        : "bookmark-button"
    }
    onClick={handleBookmark}
    disabled={bookmarkLoading}
  >

    {bookmarkLoading
      ? "Saving..."
      : isBookmarked
        ? "🔖 Bookmarked"
        : "🔖 Bookmark Lesson"}

  </button>

</div>


                {/* VIDEO */}

                {selectedLesson.videoUrl && (

                  <div className="lesson-video-container">

                    <iframe
                      src={
                        selectedLesson.videoUrl
                      }
                      title={
                        selectedLesson.title
                      }
                      allowFullScreen
                    />

                  </div>

                )}


                {/* CONTENT */}

                {selectedLesson.content && (

                  <div className="lesson-reading-content">

                    <h3>
                      Lesson Content
                    </h3>

                    <p>
                      {selectedLesson.content}
                    </p>

                  </div>

                )}
{/* =================================
    LESSON AI
================================= */}

<LessonAI
  lesson={selectedLesson}
  moduleId={moduleId}
/>
{movingToNext && (

  <div className="next-lesson-message">

    Moving to the next lesson...

  </div>

)}
                {/* COMPLETE BUTTON */}

                <div className="lesson-completion">

                  {completedLessons.includes(
  selectedLesson._id
) ? (

  <div className="completed-message">

    Lesson Completed

  </div>

) : (

  <button
    type="button"
    className="complete-lesson-button"
    onClick={handleComplete}
  >

    {lessons.findIndex(
      (lesson) =>
        lesson._id ===
        selectedLesson._id
    ) === lessons.length - 1

      ? "Complete Lesson"

      : "Complete & Continue"
    }

  </button>

)}

                </div>


                {/* NAVIGATION */}

                <div className="lesson-navigation">

                  <button
                    type="button"
                    disabled={
                      selectedLesson._id ===
                      lessons[0]?._id
                    }
                    onClick={
                      goToPreviousLesson
                    }
                  >

                    ← Previous

                  </button>


                  <button
                    type="button"
                    disabled={
                      selectedLesson._id ===
                      lessons[
                        lessons.length - 1
                      ]?._id
                    }
                    onClick={
                      goToNextLesson
                    }
                  >

                    Next →

                  </button>

                </div>

              </>

            )}

          </main>

        </div>

      )}

    </div>

  );

};


export default LessonViewer;