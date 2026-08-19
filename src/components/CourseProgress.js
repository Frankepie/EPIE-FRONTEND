import { useEffect, useState } from "react";

import { useAuth } from "../context/AuthContext";

import {
  getCourseProgress
} from "../services/api";

import "../styles/CourseProgress.css";


const CourseProgress = ({
  courseId
}) => {

  const { token } = useAuth();

  const [progress, setProgress] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {

    const loadProgress = async () => {

      try {

        const data =
          await getCourseProgress(
            courseId,
            token
          );

        setProgress(data);

      } catch (error) {

        setError(error.message);

      } finally {

        setLoading(false);

      }

    };


    if (
      courseId &&
      token
    ) {

      loadProgress();

    }

  }, [
    courseId,
    token
  ]);


  if (loading) {

    return (
      <div className="course-progress">
        Loading progress...
      </div>
    );

  }


  if (error) {

    return (
      <div className="course-progress-error">
        {error}
      </div>
    );

  }


  return (

    <div className="course-progress">

      <div className="course-progress-header">

        <h3>
          Course Progress
        </h3>

        <strong>
          {progress?.percentage || 0}%
        </strong>

      </div>


      <div className="course-progress-bar">

        <div
          className="course-progress-fill"
          style={{
            width:
              `${progress?.percentage || 0}%`
          }}
        />

      </div>


      <div className="course-progress-info">

        <span>
          {progress?.completedLessons || 0}
          {" "}
          of
          {" "}
          {progress?.totalLessons || 0}
          {" "}
          lessons completed
        </span>
      </div>
    </div>
  );
};
export default CourseProgress;