import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import {
  getMyAssignments
} from "../../services/api";

import "../../styles/StudentAssignments.css";


const StudentAssignments = () => {

  const { token } = useAuth();

  const [assignments, setAssignments] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // ==========================================
  // LOAD ASSIGNMENTS
  // ==========================================

  useEffect(() => {

    const loadAssignments =
      async () => {

        try {

          const data =
            await getMyAssignments(
              token
            );

          setAssignments(
            data.assignments || []
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
      loadAssignments();
    }

  }, [token]);


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (
      <div className="student-assignments-page">

        Loading assignments...

      </div>
    );

  }


  // ==========================================
  // PAGE
  // ==========================================

  return (

    <div className="student-assignments-page">

      <div className="student-assignments-header">

        <p>
          Student Area
        </p>

        <h1>
          My Assignments
        </h1>

        <span>
          Complete your assignments and keep
          progressing through your courses.
        </span>

      </div>


      {error && (

        <div className="student-assignment-error">
          {error}
        </div>

      )}


      {assignments.length === 0 ? (

        <div className="student-assignments-empty">

          <div className="assignment-empty-icon">
            📝
          </div>

          <h2>
            No assignments available
          </h2>

          <p>
            You don't have any assignments
            available at the moment.
          </p>

        </div>

      ) : (

        <div className="student-assignments-grid">

          {assignments.map(
            assignment => (

              <div
                className="student-assignment-card"
                key={assignment._id}
              >

                <div className="student-assignment-top">

                  <span className="student-assignment-course">

                    {assignment.course?.title ||
                      "Course"}

                  </span>

                  <span
                    className={
                      assignment.submitted
                        ? "assignment-submitted"
                        : "assignment-pending"
                    }
                  >

                    {assignment.submitted
                      ? "Submitted"
                      : "Pending"}

                  </span>

                </div>


                <h2>
                  {assignment.title}
                </h2>


                <p className="student-assignment-description">

                  {assignment.description ||
                    "No description provided."}

                </p>


                <div className="student-assignment-info">

                  <div>

                    <span>
                      Module
                    </span>

                    <strong>
                      {assignment.module?.title ||
                        "Module"}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Total Marks
                    </span>

                    <strong>
                      {assignment.totalMarks}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Due Date
                    </span>

                    <strong>

                      {assignment.dueDate
                        ? new Date(
                            assignment.dueDate
                          ).toLocaleString()
                        : "No deadline"}

                    </strong>

                  </div>

                </div>


                <Link
                  to={`/student/assignments/${assignment._id}`}
                  className="open-assignment-button"
                >
                  {assignment.submitted
                    ? "View Submission"
                    : "Open Assignment"}
                </Link>

              </div>

            )
          )}

        </div>

      )}

    </div>

  );

};


export default StudentAssignments;