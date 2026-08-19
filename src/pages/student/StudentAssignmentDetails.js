import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import {
  getMyAssignments,
  getMySubmission,
  submitAssignment
} from "../../services/api";

import "../../styles/StudentAssignmentDetails.css";


const StudentAssignmentDetails = () => {

  const { assignmentId } = useParams();

  const { token } = useAuth();


  const [assignment, setAssignment] =
    useState(null);

  const [submission, setSubmission] =
    useState(null);

  const [answer, setAnswer] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  // ==========================================
  // LOAD ASSIGNMENT
  // ==========================================

  useEffect(() => {

    const loadData = async () => {

      try {

        setLoading(true);
        setError("");

        const assignmentData =
          await getMyAssignments(token);

        const foundAssignment =
          (assignmentData.assignments || [])
            .find(
              item =>
                item._id === assignmentId
            );

        if (!foundAssignment) {

          throw new Error(
            "Assignment not found"
          );

        }

        setAssignment(
          foundAssignment
        );


        // ======================================
        // LOAD EXISTING SUBMISSION
        // ======================================

        const submissionData =
          await getMySubmission(
            assignmentId,
            token
          );

        setSubmission(
          submissionData.submission
        );

      } catch (error) {

        setError(
          error.message
        );

      } finally {

        setLoading(false);

      }

    };


    if (token && assignmentId) {
      loadData();
    }

  }, [token, assignmentId]);


  // ==========================================
  // SUBMIT ASSIGNMENT
  // ==========================================

  const handleSubmit = async (event) => {

    event.preventDefault();

    if (!answer.trim()) {

      setError(
        "Please write your answer before submitting."
      );

      return;

    }


    try {

      setSubmitting(true);

      setError("");

      setSuccess("");


      const data =
        await submitAssignment(
          assignmentId,
          answer,
          token
        );


      setSubmission(
        data.submission
      );

      setSuccess(
        data.message ||
        "Assignment submitted successfully!"
      );

    } catch (error) {

      setError(
        error.message
      );

    } finally {

      setSubmitting(false);

    }

  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (
      <div className="student-assignment-details-page">

        Loading assignment...

      </div>
    );

  }


  // ==========================================
  // ERROR
  // ==========================================

  if (error && !assignment) {

    return (
      <div className="student-assignment-details-page">

        <div className="student-assignment-error">
          {error}
        </div>

        <Link to="/student/assignments">
          ← Back to Assignments
        </Link>

      </div>
    );

  }


  // ==========================================
  // PAGE
  // ==========================================

  return (

    <div className="student-assignment-details-page">

      <Link
        to="/student/assignments"
        className="assignment-back-link"
      >
        ← Back to Assignments
      </Link>


      <div className="assignment-details-header">

        <span>
          {assignment?.course?.title ||
            "Course"}
        </span>

        <h1>
          {assignment?.title}
        </h1>

        <p>
          {assignment?.description ||
            "No description provided."}
        </p>

      </div>


      <div className="assignment-details-info">

        <div>
          <span>
            Module
          </span>

          <strong>
            {assignment?.module?.title ||
              "Module"}
          </strong>
        </div>


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
            Due Date
          </span>

          <strong>

            {assignment?.dueDate
              ? new Date(
                  assignment.dueDate
                ).toLocaleString()
              : "No deadline"}

          </strong>
        </div>

      </div>


      <div className="assignment-instructions">

        <h2>
          Instructions
        </h2>

        <p>
          {assignment?.instructions ||
            "No instructions provided."}
        </p>

      </div>


      {error && (

        <div className="student-assignment-error">
          {error}
        </div>

      )}


      {success && (

        <div className="student-assignment-success">
          {success}
        </div>

      )}


      {submission ? (

        <div className="assignment-submission-result">

          <div className="submission-status">
            ✓ Submitted
          </div>

          <h2>
            Your Submission
          </h2>

          <p>
            {submission.answer}
          </p>

          <span>
            Submitted on{" "}
            {submission.submittedAt
              ? new Date(
                  submission.submittedAt
                ).toLocaleString()
              : "—"}
          </span>

          <div className="submission-grade">

            <strong>
              Grade
            </strong>

            <span>
              {submission.marks !== null &&
              submission.marks !== undefined
                ? `${submission.marks} / ${assignment.totalMarks}`
                : "Not graded yet"}
            </span>

          </div>

          {submission.feedback && (

            <div className="submission-feedback">

              <strong>
                Instructor Feedback
              </strong>

              <p>
                {submission.feedback}
              </p>

            </div>

          )}

        </div>

      ) : (

        <form
          className="assignment-submission-form"
          onSubmit={handleSubmit}
        >

          <h2>
            Your Answer
          </h2>

          <textarea
            value={answer}
            onChange={(event) =>
              setAnswer(
                event.target.value
              )
            }
            placeholder="Write your answer here..."
            rows="10"
          />

          <button
            type="submit"
            disabled={submitting}
          >

            {submitting
              ? "Submitting..."
              : "Submit Assignment"}

          </button>

        </form>

      )}

    </div>

  );

};


export default StudentAssignmentDetails;