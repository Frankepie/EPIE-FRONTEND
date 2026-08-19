import {
  useEffect,
  useState
} from "react";

import {
  Link,
  useNavigate
} from "react-router-dom";

import {
  useAuth
} from "../../context/AuthContext";

import {
  getInstructorAssignments,
  deleteAssignment
} from "../../services/api";

import "./InstructorAssignments.css";


const InstructorAssignments = () => {

  const {
    token
  } = useAuth();

  const navigate =
    useNavigate();


  const [assignments, setAssignments] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [deletingId, setDeletingId] =
    useState(null);


  // ==========================================
  // LOAD INSTRUCTOR ASSIGNMENTS
  // ==========================================

  useEffect(() => {

    const loadAssignments =
      async () => {

        try {

          setLoading(true);
          setError("");

          const data =
            await getInstructorAssignments(
              token
            );

          setAssignments(
            data.assignments || []
          );

        } catch (error) {

          console.error(
            "Error loading assignments:",
            error
          );

          setError(
            error.message ||
            "Failed to load assignments"
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
  // DELETE ASSIGNMENT
  // ==========================================

  const handleDelete =
    async (assignmentId) => {

      const confirmed =
        window.confirm(
          "Are you sure you want to delete this assignment?"
        );

      if (!confirmed) {
        return;
      }


      try {

        setDeletingId(
          assignmentId
        );

        setError("");


        await deleteAssignment(
          assignmentId,
          token
        );


        setAssignments(
          (currentAssignments) =>
            currentAssignments.filter(
              (assignment) =>
                assignment._id !==
                assignmentId
            )
        );


      } catch (error) {

        console.error(
          "Error deleting assignment:",
          error
        );

        setError(
          error.message ||
          "Failed to delete assignment"
        );

      } finally {

        setDeletingId(null);

      }

    };


  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate =
    (date) => {

      if (!date) {
        return "No due date";
      }

      return new Date(
        date
      ).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "short",
          day: "numeric"
        }
      );

    };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="instructor-assignments-page">

        <div className="assignments-message">

          Loading your assignments...

        </div>

      </div>

    );

  }


  // ==========================================
  // PAGE
  // ==========================================

  return (

    <div className="instructor-assignments-page">


      {/* =====================================
          HEADER
      ====================================== */}

      <div className="instructor-assignments-header">

        <div>

          <p>
            Instructor Area
          </p>

          <h1>
            Assignments
          </h1>

          <span>
            Create and manage assignments
            for your students.
          </span>

        </div>


        <Link
          to="/instructor/assignments/create"
          className="create-assignment-button"
        >
          + Create Assignment
        </Link>

      </div>


      {/* =====================================
          ERROR
      ====================================== */}

      {error && (

        <div className="assignments-error">

          {error}

        </div>

      )}


      {/* =====================================
          STATISTICS
      ====================================== */}

      <div className="assignment-stat-grid">


        <div className="assignment-stat-card">

          <div className="assignment-stat-icon purple">
            ✓
          </div>

          <div>

            <span>
              Total Assignments
            </span>

            <strong>
              {assignments.length}
            </strong>

          </div>

        </div>


        <div className="assignment-stat-card">

          <div className="assignment-stat-icon green">
            ✓
          </div>

          <div>

            <span>
              Published
            </span>

            <strong>
              {
                assignments.filter(
                  (assignment) =>
                    assignment.published === true
                ).length
              }
            </strong>

          </div>

        </div>


        <div className="assignment-stat-card">

          <div className="assignment-stat-icon orange">
            ◷
          </div>

          <div>

            <span>
              Drafts
            </span>

            <strong>
              {
                assignments.filter(
                  (assignment) =>
                    assignment.published !== true
                ).length
              }
            </strong>

          </div>

        </div>


        <div className="assignment-stat-card">

          <div className="assignment-stat-icon blue">
            ★
          </div>

          <div>

            <span>
              Total Marks
            </span>

            <strong>
              {
                assignments.reduce(
                  (total, assignment) =>
                    total +
                    (
                      Number(
                        assignment.totalMarks
                      ) || 0
                    ),
                  0
                )
              }
            </strong>

          </div>

        </div>


      </div>


      {/* =====================================
          ASSIGNMENTS
      ====================================== */}

      <section className="assignments-section">


        <div className="assignments-section-header">

          <div>

            <h2>
              My Assignments
            </h2>

            <p>
              Manage assignments you've
              created for your courses.
            </p>

          </div>

        </div>


        {assignments.length === 0 ? (

          <div className="assignments-empty">

            <div className="empty-assignment-icon">
              ✓
            </div>

            <h2>
              No assignments yet
            </h2>

            <p>
              Create your first assignment
              and give your students
              something to work on.
            </p>

            <Link
              to="/instructor/assignments/create"
              className="empty-create-button"
            >
              Create Assignment
            </Link>

          </div>

        ) : (

          <div className="assignment-list">

            {assignments.map(
              (assignment) => (

                <div
                  className="assignment-card"
                  key={assignment._id}
                >


                  {/* ASSIGNMENT ICON */}

                  <div className="assignment-card-icon">
                    ✓
                  </div>


                  {/* INFORMATION */}

                  <div className="assignment-card-content">

                    <div className="assignment-card-top">

                      <span className="assignment-course">

                        {
                          assignment.course?.title ||
                          "Course"
                        }

                      </span>


                      <span
                        className={
                          assignment.published
                            ? "assignment-status published"
                            : "assignment-status draft"
                        }
                      >

                        {
                          assignment.published
                            ? "Published"
                            : "Draft"
                        }

                      </span>

                    </div>


                    <h3>
                      {
                        assignment.title ||
                        "Untitled Assignment"
                      }
                    </h3>


                    <p className="assignment-description">

                      {
                        assignment.description ||
                        "No description provided."
                      }

                    </p>


                    <div className="assignment-meta">

                      <span>

                        📚{" "}
                        {
                          assignment.module?.title ||
                          "Module"
                        }

                      </span>


                      <span>

                        ◷ Due:{" "}
                        {
                          formatDate(
                            assignment.dueDate
                          )
                        }

                      </span>


                      <span>

                        ★{" "}
                        {
                          assignment.totalMarks ||
                          0
                        } marks

                      </span>

                    </div>

                  </div>


                  {/* ACTIONS */}

                  <div className="assignment-actions">

  <button
    type="button"
    className="assignment-view-button"
    onClick={() =>
      navigate(
        `/instructor/assignments/${assignment._id}/submissions`
      )
    }
  >
    Submissions
  </button>


  <button
    type="button"
    className="assignment-edit-button"
    onClick={() =>
      navigate(
        `/instructor/assignments/edit/${assignment._id}`
      )
    }
  >
    Edit
  </button>


  <button
    type="button"
    className="assignment-delete-button"
    onClick={() =>
      handleDelete(
        assignment._id
      )
    }
    disabled={
      deletingId ===
      assignment._id
    }
  >

    {
      deletingId ===
      assignment._id
        ? "Deleting..."
        : "Delete"
    }

  </button>

</div>


                </div>

              )
            )}

          </div>

        )}

      </section>

    </div>

  );

};


export default InstructorAssignments;