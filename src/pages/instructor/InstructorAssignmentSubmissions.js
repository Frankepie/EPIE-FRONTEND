import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import {
  getMyAssignments,
  getAssignmentSubmissions,
  gradeAssignmentSubmission
} from "../../services/api";

import "./InstructorAssignmentSubmissions.css";


const InstructorAssignmentSubmissions = () => {

  const { assignmentId } = useParams();

  const { token } = useAuth();


  const [assignment, setAssignment] =
    useState(null);

  const [submissions, setSubmissions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [gradingId, setGradingId] =
    useState(null);

  const [marks, setMarks] =
    useState("");

  const [feedback, setFeedback] =
    useState("");


  // ==========================================
  // LOAD ASSIGNMENT + SUBMISSIONS
  // ==========================================

  useEffect(() => {

    const loadData = async () => {

      try {

        setLoading(true);
        setError("");

        const assignmentData =
          await getMyAssignments(
            token
          );

        const foundAssignment =
          (assignmentData.assignments || [])
            .find(
              assignment =>
                assignment._id === assignmentId
            );


        if (!foundAssignment) {

          throw new Error(
            "Assignment not found"
          );

        }


        setAssignment(
          foundAssignment
        );


        const submissionData =
          await getAssignmentSubmissions(
            assignmentId,
            token
          );


        setSubmissions(
          submissionData.submissions || []
        );


      } catch (error) {

        console.error(
          "Error loading submissions:",
          error
        );

        setError(
          error.message ||
          "Failed to load submissions"
        );

      } finally {

        setLoading(false);

      }

    };


    if (
      token &&
      assignmentId
    ) {

      loadData();

    }

  }, [
    token,
    assignmentId
  ]);


  // ==========================================
  // START GRADING
  // ==========================================

  const handleStartGrading =
    (submission) => {

      setGradingId(
        submission._id
      );

      setMarks(
        submission.marks !== null &&
        submission.marks !== undefined
          ? submission.marks
          : ""
      );

      setFeedback(
        submission.feedback || ""
      );

    };


  // ==========================================
  // CANCEL GRADING
  // ==========================================

  const handleCancelGrading = () => {

    setGradingId(null);

    setMarks("");

    setFeedback("");

  };


  // ==========================================
  // SAVE GRADE
  // ==========================================

  const handleGrade =
    async (submissionId) => {

      if (
        marks === "" ||
        marks === null
      ) {

        setError(
          "Please enter marks."
        );

        return;

      }


      try {

        setError("");


        setGradingId(
          submissionId
        );


        const data =
          await gradeAssignmentSubmission(
            submissionId,
            Number(marks),
            feedback,
            token
          );


        setSubmissions(
          currentSubmissions =>
            currentSubmissions.map(
              submission =>
                submission._id ===
                submissionId
                  ? data.submission
                  : submission
            )
        );


        setGradingId(null);

        setMarks("");

        setFeedback("");


      } catch (error) {

        console.error(
          "Error grading submission:",
          error
        );

        setError(
          error.message ||
          "Failed to grade submission"
        );

      }

    };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="instructor-submissions-page">

        <div className="submissions-message">

          Loading submissions...

        </div>

      </div>

    );

  }


  // ==========================================
  // ERROR
  // ==========================================

  if (
    error &&
    !assignment
  ) {

    return (

      <div className="instructor-submissions-page">

        <div className="submissions-error">

          {error}

        </div>

        <Link to="/instructor/assignments">

          ← Back to Assignments

        </Link>

      </div>

    );

  }


  // ==========================================
  // PAGE
  // ==========================================

  return (

    <div className="instructor-submissions-page">


      {/* =====================================
          HEADER
      ====================================== */}

      <div className="instructor-submissions-header">

        <div>

          <p>
            Instructor Area
          </p>

          <h1>
            Assignment Submissions
          </h1>

          <span>
            Review and grade student submissions.
          </span>

        </div>


        <Link
          to="/instructor/assignments"
          className="back-assignments-button"
        >
          ← Assignments
        </Link>

      </div>


      {/* =====================================
          ASSIGNMENT INFORMATION
      ====================================== */}

      <div className="submission-assignment-card">

        <div>

          <span>
            {assignment?.course?.title ||
              "Course"}
          </span>

          <h2>
            {assignment?.title}
          </h2>

          <p>
            {assignment?.description ||
              "No description provided."}
          </p>

        </div>


        <div className="submission-assignment-stats">

          <div>

            <span>
              Total Marks
            </span>

            <strong>
              {assignment?.totalMarks || 0}
            </strong>

          </div>


          <div>

            <span>
              Submissions
            </span>

            <strong>
              {submissions.length}
            </strong>

          </div>

        </div>

      </div>


      {/* =====================================
          ERROR
      ====================================== */}

      {error && (

        <div className="submissions-error">

          {error}

        </div>

      )}


      {/* =====================================
          EMPTY
      ====================================== */}

      {submissions.length === 0 ? (

        <div className="submissions-empty">

          <div>
            ✓
          </div>

          <h2>
            No submissions yet
          </h2>

          <p>
            Students have not submitted
            this assignment yet.
          </p>

        </div>

      ) : (

        <div className="submissions-list">

          {submissions.map(
            submission => (

              <div
                className="student-submission-card"
                key={submission._id}
              >


                {/* STUDENT */}

                <div className="submission-student">

                  <div className="student-avatar">

                    {
                      (
                        submission.student?.fullName ||
                        submission.student?.name ||
                        "S"
                      )
                        .charAt(0)
                        .toUpperCase()
                    }

                  </div>


                  <div>

                    <h3>

                      {
                        submission.student?.fullName ||
                        submission.student?.name ||
                        "Student"
                      }

                    </h3>

                    <p>

                      {
                        submission.student?.email ||
                        "No email"
                      }

                    </p>

                  </div>

                </div>


                {/* SUBMISSION */}

                <div className="submission-answer">

                  <div className="submission-section-title">

                    Student Answer

                  </div>

                  <p>

                    {submission.answer}

                  </p>

                </div>


                {/* META */}

                <div className="submission-meta">

                  <span>

                    Submitted:{" "}

                    {
                      submission.submittedAt
                        ? new Date(
                            submission.submittedAt
                          ).toLocaleString()
                        : "—"
                    }

                  </span>


                  <span
                    className={
                      submission.status ===
                      "Graded"
                        ? "graded-status"
                        : "submitted-status"
                    }
                  >

                    {submission.status}

                  </span>

                </div>


                {/* GRADE RESULT */}

                {submission.status === "Graded" && (

                  <div className="existing-grade">

                    <div>

                      <span>
                        Grade
                      </span>

                      <strong>

                        {
                          submission.marks
                        }

                        /
                        {
                          assignment?.totalMarks
                        }

                      </strong>

                    </div>


                    {submission.feedback && (

                      <div>

                        <span>
                          Feedback
                        </span>

                        <p>
                          {
                            submission.feedback
                          }
                        </p>

                      </div>

                    )}

                  </div>

                )}


                {/* GRADING FORM */}

                {gradingId ===
                submission._id ? (

                  <div className="grading-form">

                    <div>

                      <label>
                        Marks
                      </label>

                      <input
                        type="number"
                        min="0"
                        max={
                          assignment?.totalMarks
                        }
                        value={marks}
                        onChange={
                          event =>
                            setMarks(
                              event.target.value
                            )
                        }
                        placeholder="Enter marks"
                      />

                    </div>


                    <div>

                      <label>
                        Feedback
                      </label>

                      <textarea
                        rows="4"
                        value={feedback}
                        onChange={
                          event =>
                            setFeedback(
                              event.target.value
                            )
                        }
                        placeholder="Write feedback for the student..."
                      />

                    </div>


                    <div className="grading-actions">

                      <button
                        type="button"
                        onClick={() =>
                          handleGrade(
                            submission._id
                          )
                        }
                      >
                        Save Grade
                      </button>


                      <button
                        type="button"
                        onClick={
                          handleCancelGrading
                        }
                      >
                        Cancel
                      </button>

                    </div>

                  </div>

                ) : (

                  <button
                    type="button"
                    className="grade-submission-button"
                    onClick={() =>
                      handleStartGrading(
                        submission
                      )
                    }
                  >

                    {submission.status ===
                    "Graded"
                      ? "Edit Grade"
                      : "Grade Submission"}

                  </button>

                )}

              </div>

            )
          )}

        </div>

      )}

    </div>

  );

};


export default InstructorAssignmentSubmissions;