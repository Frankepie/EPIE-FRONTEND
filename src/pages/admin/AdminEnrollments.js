import {
  useEffect,
  useState
} from "react";

import {
  FaUsers,
  FaCheckCircle,
  FaClock,
  FaBook
} from "react-icons/fa";

import {
  useAuth
} from "../../context/AuthContext";

import {
  getAdminEnrollments
} from "../../services/api";

import "../../styles/AdminEnrollments.css";


const AdminEnrollments = () => {

  const { token } = useAuth();

  const [enrollments, setEnrollments] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {

    const loadEnrollments = async () => {

      try {

        setLoading(true);
        setError("");

        const data =
          await getAdminEnrollments(token);

        setEnrollments(
          data.enrollments || []
        );

      } catch (error) {

        console.error(
          "Admin enrollments error:",
          error
        );

        setError(
          error.message ||
          "Failed to load enrollments."
        );

      } finally {

        setLoading(false);

      }

    };


    if (token) {
      loadEnrollments();
    }

  }, [token]);


  if (loading) {

    return (
      <div className="admin-page-loading">
        Loading enrollments...
      </div>
    );

  }


  return (

    <div className="admin-enrollments-page">

      <div className="admin-page-header">

        <div>

          <h1>
            Enrollments
          </h1>

          <p>
            Monitor student enrollment and
            course progress.
          </p>

        </div>

        <div className="admin-page-stat">

          <FaUsers />

          <span>
            {enrollments.length} Enrollments
          </span>

        </div>

      </div>


      {error && (

        <div className="admin-page-error">
          {error}
        </div>

      )}


      {!error &&
        enrollments.length === 0 && (

          <div className="admin-empty-state">

            <FaUsers />

            <h3>
              No enrollments found
            </h3>

            <p>
              Student enrollments will appear
              here.
            </p>

          </div>

        )}


      {enrollments.length > 0 && (

        <div className="admin-table-wrapper">

          <table className="admin-data-table">

            <thead>

              <tr>

                <th>
                  Student
                </th>

                <th>
                  Course
                </th>

                <th>
                  Instructor
                </th>

                <th>
                  Progress
                </th>

                <th>
                  Status
                </th>

                <th>
                  Enrolled
                </th>

              </tr>

            </thead>

            <tbody>

              {enrollments.map(
                enrollment => {

                  const progress =
                    Number(
                      enrollment.progress || 0
                    );

                  return (

                    <tr
                      key={enrollment._id}
                    >

                      <td>

                        <div className="admin-student-cell">

                          {enrollment.student
                            ?.profileImage ? (

                            <img
                              src={
                                enrollment
                                  .student
                                  .profileImage
                              }
                              alt={
                                enrollment
                                  .student
                                  .name
                              }
                            />

                          ) : (

                            <div className="admin-avatar">
                              {(
                                enrollment
                                  .student
                                  ?.name ||
                                "S"
                              )
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                          )}

                          <div>

                            <strong>
                              {
                                enrollment
                                  .student
                                  ?.name ||
                                "Unknown student"
                              }
                            </strong>

                            <small>
                              {
                                enrollment
                                  .student
                                  ?.email ||
                                ""
                              }
                            </small>

                          </div>

                        </div>

                      </td>


                      <td>

                        <div className="course-cell">

                          <FaBook />

                          <div>

                            <strong>
                              {
                                enrollment
                                  .course
                                  ?.title ||
                                "Unknown course"
                              }
                            </strong>

                            <small>
                              {
                                enrollment
                                  .course
                                  ?.category ||
                                ""
                              }
                            </small>

                          </div>

                        </div>

                      </td>


                      <td>

                        {
                          enrollment
                            .course
                            ?.instructor
                            ?.name ||
                          "Unknown"
                        }

                      </td>


                      <td>

                        <div className="progress-cell">

                          <div className="progress-bar">

                            <div
                              className="progress-fill"
                              style={{
                                width:
                                  `${progress}%`
                              }}
                            />

                          </div>

                          <span>
                            {progress}%
                          </span>

                        </div>

                      </td>


                      <td>

                        {enrollment.completed ? (

                          <span className="status completed">

                            <FaCheckCircle />

                            Completed

                          </span>

                        ) : (

                          <span className="status in-progress">

                            <FaClock />

                            In Progress

                          </span>

                        )}

                      </td>


                      <td>

                        {new Date(
                          enrollment.createdAt
                        ).toLocaleDateString()}

                      </td>

                    </tr>

                  );

                }
              )}

            </tbody>

          </table>

        </div>

      )}

    </div>

  );

};


export default AdminEnrollments;