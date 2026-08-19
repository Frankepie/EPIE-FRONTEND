import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import {
  getMyProgress,
  createCertificate
} from "../../services/api";

import "../../styles/StudentProgress.css";


const StudentProgress = () => {

  
  const { token } = useAuth();

  const [progress, setProgress] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

   const [certificateLoading, setCertificateLoading] =
  useState(null);

const [certificateMessage, setCertificateMessage] =
  useState("");
  const handleCreateCertificate = async (courseId) => {

  try {

    setCertificateLoading(courseId);

    setCertificateMessage("");

    const data =
      await createCertificate(
        courseId,
        token
      );

    setCertificateMessage(
      data.message ||
      "Certificate created successfully!"
    );

  } catch (error) {

    setCertificateMessage(
      error.message
    );

  } finally {

    setCertificateLoading(null);

  }
};
  useEffect(() => {

    const loadProgress = async () => {

      try {

       const data =
  await getMyProgress(token);

console.log(data);

setProgress(data);
      } catch (error) {

        setError(error.message);

      } finally {

        setLoading(false);

      }

    };


    if (token) {
      loadProgress();
    }

  }, [token]);


  if (loading) {

    return (
      <div className="student-progress-page">
        Loading your progress...
      </div>
    );

  }


  if (error) {

    return (
      <div className="student-progress-page">
        <div className="progress-error">
          {error}
        </div>
      </div>
    );

  }


  return (

    <div className="student-progress-page">

      <div className="progress-header">

        <p>
          Student Area
        </p>

        <h1>
          My Learning Progress
        </h1>

        <span>
          Keep learning and reach your goals.
        </span>

      </div>


      <div className="progress-summary">

        <div className="progress-card">

          <h3>
            Courses
          </h3>

          <strong>
            {progress?.totalCourses || 0}
          </strong>

        </div>


        <div className="progress-card">

          <h3>
            Completed Lessons
          </h3>

          <strong>
            {progress?.completedLessons || 0}
          </strong>

        </div>


        <div className="progress-card">

          <h3>
            Overall Progress
          </h3>

          <strong>
            {progress?.percentage || 0}%
          </strong>

        </div>

      </div>


      <div className="overall-progress">

        <div className="progress-title">

          <h2>
            Overall Learning Progress
          </h2>

          <span>
            {progress?.percentage || 0}%
          </span>

        </div>


        <div className="progress-bar">

          <div
            className="progress-fill"
            style={{
              width:
                `${progress?.percentage || 0}%`
            }}
          />

        </div>

      </div>
        <div className="course-progress-list">

  <h2>
    My Courses
  </h2>

  {progress?.courses?.map((course) => (

    <div
      className="course-progress-item"
      key={course.courseId}
    >

      <div className="course-progress-info">

        <h3>
          {course.title || "Course"}
        </h3>

        <span>
          {course.percentage}% completed
        </span>

      </div>

      <div className="progress-bar">

        <div
          className="progress-fill"
          style={{
            width:
              `${course.percentage}%`
          }}
        />

      </div>


      {course.completed && (

        <div className="certificate-section">

          <p>
            🎉 Congratulations! You completed
            this course.
          </p>

          <button
            type="button"
            onClick={() =>
              handleCreateCertificate(
                course.courseId
              )
            }
            disabled={
              certificateLoading ===
              course.courseId
            }
          >

            {certificateLoading ===
            course.courseId
              ? "Generating..."
              : "🏆 Get Certificate"}

          </button>

        </div>

      )}

    </div>

  ))}

  {certificateMessage && (

    <div className="certificate-message">

      {certificateMessage}

    </div>

  )}

</div>

      <div className="continue-learning">

        <h2>
          Continue Learning
        </h2>

        <p>
          Pick up where you left off.
        </p>

        <Link
          to="/my-courses"
        >
          View My Courses
        </Link>

      </div>

    </div>

  );

};

export default StudentProgress;