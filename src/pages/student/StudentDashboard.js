import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import {
  getMyCourses,
  getMyProgress,
  getMyAssignments,
  getMyCertificates
} from "../../services/api";

import "./StudentDashboard.css";


const StudentDashboard = () => {

  const { user, token } = useAuth();


  const [courses, setCourses] =
    useState([]);

  const [progress, setProgress] =
    useState(null);

  const [assignments, setAssignments] =
    useState([]);

  const [certificates, setCertificates] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // ==========================================
  // LOAD DASHBOARD DATA
  // ==========================================

  useEffect(() => {

    const loadDashboard =
      async () => {

        try {

          setLoading(true);

          setError("");


          const [
            coursesData,
            progressData,
            assignmentsData,
            certificatesData
          ] = await Promise.all([

            getMyCourses(token),

            getMyProgress(token),

            getMyAssignments(token),

            getMyCertificates(token)

          ]);


          // MyCourses uses enrollments
          setCourses(
            coursesData.enrollments || []
          );


          setProgress(
            progressData
          );


          setAssignments(
            assignmentsData.assignments || []
          );


          setCertificates(
            certificatesData.certificates || []
          );


        } catch (error) {

          console.error(
            "Student dashboard error:",
            error
          );

          setError(
            error.message
          );

        } finally {

          setLoading(false);

        }

      };


    if (token) {

      loadDashboard();

    }

  }, [token]);


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="role-dashboard">

        Loading your dashboard...

      </div>

    );

  }


  // ==========================================
  // ERROR
  // ==========================================

  if (error) {

    return (

      <div className="role-dashboard">

        <div className="dashboard-error">

          {error}

        </div>

      </div>

    );

  }


  // ==========================================
  // CALCULATED DATA
  // ==========================================

  const completedLessons =
    progress?.completedLessons || 0;


  const overallProgress =
    progress?.percentage || 0;


  const completedCourses =
    courses.filter(
      enrollment =>
        Number(enrollment.progress || 0) >= 100
    ).length;


  const inProgressCourses =
    courses.filter(
      enrollment => {

        const courseProgress =
          Number(
            enrollment.progress || 0
          );

        return (
          courseProgress > 0 &&
          courseProgress < 100
        );

      }
    ).length;


  const pendingAssignments =
    assignments.filter(
      assignment =>
        !assignment.submitted
    ).length;


  // ==========================================
  // DASHBOARD
  // ==========================================

  return (

    <div className="role-dashboard">


      {/* ======================================
          WELCOME HEADER
      ====================================== */}

     <div className="role-dashboard-header">

  <div className="student-welcome-content">

    <p className="student-welcome-label">
      Student Portal
    </p>

    <h1>
      Welcome back,{" "}
      {user?.fullName ||
        user?.name ||
        "Student"}
      ! 👋
    </h1>

    <span className="student-welcome-description">
      Continue learning and track your
      progress.
    </span>

  </div>

  <div className="student-header-profile">

    <div className="student-header-avatar">

      {user?.profileImage ? (

        <img
          src={user.profileImage}
          alt="Profile"
        />

      ) : (

        (
          user?.fullName ||
          user?.name ||
          "S"
        )
          .charAt(0)
          .toUpperCase()

      )}

    </div>

  </div>

</div>

      {/* ======================================
          OVERVIEW TITLE
      ====================================== */}

      <div className="student-overview-title">

        <h2>
          Your Learning Overview
        </h2>

      </div>


      {/* ======================================
          OVERVIEW CARDS
      ====================================== */}

      <div className="role-stats">


        {/* AVAILABLE COURSES */}

        <div className="role-stat-card">

          <div className="student-stat-top">

            <div className="student-stat-icon">

              📚

            </div>

            <span className="student-stat-label">

              Available Courses

            </span>

          </div>

          <h3>
            {courses.length}
          </h3>

        </div>


        {/* IN PROGRESS */}

        <div className="role-stat-card">

          <div className="student-stat-top">

            <div className="student-stat-icon green">

              📖

            </div>

            <span className="student-stat-label">

              In-Progress

            </span>

          </div>

          <h3>
            {inProgressCourses}
          </h3>

        </div>


        {/* COMPLETED */}

        <div className="role-stat-card">

          <div className="student-stat-top">

            <div className="student-stat-icon green">

              ✓

            </div>

            <span className="student-stat-label">

              Completed

            </span>

          </div>

          <h3>
            {completedCourses}
          </h3>

        </div>


        {/* CERTIFICATES */}

        <div className="role-stat-card">

          <div className="student-stat-top">

            <div className="student-stat-icon orange">

              🏆

            </div>

            <span className="student-stat-label">

              Certificates

            </span>

          </div>

          <h3>
            {certificates.length}
          </h3>

        </div>

      </div>
       
       {/* ======================================
    OVERALL LEARNING PROGRESS
====================================== */}

<div className="student-overall-progress">

  <div className="student-overall-progress-header">

    <div>

      <p>
        Overall Learning Progress
      </p>

      <span>
        Keep going! You're making great progress.
      </span>

    </div>

    <strong>
      {overallProgress}%
    </strong>

  </div>


  <div className="student-overall-progress-bar">

    <div
      className="student-overall-progress-fill"
      style={{
        width: `${Math.min(
          Math.max(overallProgress, 0),
          100
        )}%`
      }}
    />

  </div>


  <div className="student-overall-progress-footer">

    <span>
      {completedLessons} lessons completed
    </span>

    <span>
      {overallProgress >= 100
        ? "Course goal completed 🎉"
        : "Keep learning"}
    </span>

  </div>

</div>

      {/* ======================================
          MAIN CONTENT
      ====================================== */}

      <div className="student-content-grid">


        {/* ====================================
            CONTINUE LEARNING
        ==================================== */}

        <div className="student-section">


          <div className="student-section-header">

            <div>

              <h2>
                Continue Learning
              </h2>

            </div>

            <Link to="/student/courses">
              View All
            </Link>

          </div>


          {courses.length === 0 ? (

            <div className="course-placeholder">

              <div>
                📚
              </div>

              <p>
                You haven't enrolled in
                any courses yet.
              </p>

              <Link to="/courses">
                Browse Courses
              </Link>

            </div>

          ) : (

            <div className="dashboard-course-list">

              {courses
                .slice(0, 3)
                .map(
                  enrollment => {

                    const course =
                      enrollment.course;

                    const courseId =
                      course?._id;


                    const courseProgress =
                      Number(
                        enrollment.progress || 0
                      );


                    return (

                    
                        <Link
  to={
    courseId
      ? `/courses/${courseId}`
      : "/student/courses"
  }
  className="dashboard-course-item"
  key={
    enrollment._id ||
    courseId
  }
>

  {/* ====================================
      COURSE IMAGE
  ==================================== */}

  <div className="dashboard-course-image">

    {course?.image ? (

      <img
        src={course.image}
        alt={
          course.title ||
          "Course"
        }
      />

    ) : (

      <span>
        {course?.title
          ?.charAt(0)
          .toUpperCase() ||
          "C"}
      </span>

    )}

  </div>


  {/* ====================================
      COURSE INFORMATION
  ==================================== */}

  <div className="dashboard-course-info">

  <h3>
    {course?.title || "Course"}
  </h3>

  <p>
    {Math.min(
      Math.max(courseProgress, 0),
      100
    )}% Completed
  </p>

  <div className="dashboard-course-progress">

    <div
      className="dashboard-course-progress-fill"
      style={{
        width: `${Math.min(
          Math.max(courseProgress, 0),
          100
        )}%`
      }}
    />

  </div>

  <span className="dashboard-course-action">
    {courseProgress >= 100
      ? "Completed"
      : courseProgress > 0
        ? "Continue Learning"
        : "Start Course"}
  </span>

</div>

  {/* ====================================
      RATING
  ==================================== */}

  <div className="dashboard-course-rating">

    ⭐

    <span>
      {course?.rating ||
        ""}
    </span>

  </div>


  {/* ====================================
      CONTINUE INDICATOR
  ==================================== */}

  <span className="dashboard-course-arrow">
    →
  </span>

</Link>

                    );

                  }
                )}

            </div>

          )}

        </div>


        {/* ====================================
            RECENT ACTIVITY
        ==================================== */}

        <div className="student-section">


          <div className="student-section-header">

            <div>

              <h2>
                Recent Activity
              </h2>

            </div>

          </div>


          <div className="dashboard-task-list">


            {/* COMPLETED LESSON */}

            {completedLessons > 0 && (

              <div className="dashboard-task-item">

                <div>

                  <h3>
                    Learning Progress
                  </h3>

                  <p>
                    You have completed{" "}
                    {completedLessons} lesson
                    {completedLessons !== 1
                      ? "s"
                      : ""}.
                  </p>

                </div>

                <div className="activity-check">
                  ✓
                </div>

              </div>

            )}


            {/* ASSIGNMENT ACTIVITY */}

            {assignments.length > 0 && (

              <div className="dashboard-task-item">

                <div>

                  <h3>
                    Assignments
                  </h3>

                  <p>
                    You have{" "}
                    {pendingAssignments}{" "}
                    pending assignment
                    {pendingAssignments !== 1
                      ? "s"
                      : ""}.
                  </p>

                </div>

                <div className="activity-check">
                  ✓
                </div>

              </div>

            )}


            {/* COURSE ACTIVITY */}

            {courses.length > 0 && (

              <div className="dashboard-task-item">

                <div>

                  <h3>
                    Course Activity
                  </h3>

                  <p>
                    You are currently enrolled
                    in {courses.length} course
                    {courses.length !== 1
                      ? "s"
                      : ""}.
                  </p>

                </div>

                <div className="activity-check">
                  ✓
                </div>

              </div>

            )}


            {/* CERTIFICATE ACTIVITY */}

            {certificates.length > 0 && (

              <div className="dashboard-task-item">

                <div>

                  <h3>
                    Achievement
                  </h3>

                  <p>
                    You have earned{" "}
                    {certificates.length}{" "}
                    certificate
                    {certificates.length !== 1
                      ? "s"
                      : ""}.
                  </p>

                </div>

                <div className="activity-check">
                  ✓
                </div>

              </div>

            )}


            {/* EMPTY ACTIVITY */}

            {courses.length === 0 &&
              assignments.length === 0 &&
              completedLessons === 0 &&
              certificates.length === 0 && (

                <div className="task-placeholder">

                  No recent activity yet.

                </div>

              )}

          </div>

        </div>

      </div>


      {/* ======================================
          QUICK ACTIONS
      ====================================== */}

      <div className="student-quick-actions">

        <h2>
          Quick Actions
        </h2>


        <div className="quick-action-grid">


          <Link
            to="/student/courses"
            className="quick-action-card"
          >

            <span>
              📚
            </span>

            <strong>
              My Courses
            </strong>

            <p>
              Continue learning.
            </p>

          </Link>


          <Link
            to="/student/assignments"
            className="quick-action-card"
          >

            <span>
              📝
            </span>

            <strong>
              Assignments
            </strong>

            <p>
              Complete your tasks.
            </p>

          </Link>


          <Link
            to="/student/progress"
            className="quick-action-card"
          >

            <span>
              📊
            </span>

            <strong>
              My Progress
            </strong>

            <p>
              Track your learning.
            </p>

          </Link>


          <Link
            to="/student/certificates"
            className="quick-action-card"
          >

            <span>
              🏆
            </span>

            <strong>
              Certificates
            </strong>

            <p>
              View your achievements.
            </p>

          </Link>


        </div>

      </div>


    </div>

  );

};


export default StudentDashboard;