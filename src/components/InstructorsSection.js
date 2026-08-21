import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "../styles/InstructorsSection.css";

const API_URL =
  process.env.REACT_APP_API_URL ||
  "http://localhost:5000";


const InstructorsSection = () => {

  const [instructors, setInstructors] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // =====================================
  // LOAD REAL INSTRUCTORS
  // =====================================

  useEffect(() => {

    const fetchInstructors = async () => {

      try {

        setLoading(true);
        setError("");

        const response =
          await fetch(
            `${API_URL}/api/users/instructors`
          );

        const data =
          await response.json();


        if (!response.ok) {

          throw new Error(
            data.message ||
            "Failed to load instructors"
          );

        }


        setInstructors(
          data.instructors || []
        );

      } catch (err) {

        console.error(
          "Instructor loading error:",
          err
        );

        setError(
          "Unable to load instructors."
        );

      } finally {

        setLoading(false);

      }

    };


    fetchInstructors();

  }, []);


  // =====================================
  // INITIALS
  // =====================================

  const getInitials = (name) => {

    if (!name) {
      return "IN";
    }

    const words =
      name.trim().split(" ");

    if (words.length === 1) {
      return words[0]
        .substring(0, 2)
        .toUpperCase();
    }

    return (
      words[0][0] +
      words[words.length - 1][0]
    ).toUpperCase();

  };


  return (

    <section
      className="instructors-section"
      id="instructors"
    >

      <div className="instructors-container">


        {/* =====================================
            HEADER
        ===================================== */}

        <div className="instructors-header">

          <span className="instructors-label">
            OUR INSTRUCTORS
          </span>

          <h2>
            Learn From
            <span>
              {" "}Experienced Instructors
            </span>
          </h2>

          <p>
            Meet the educators and professionals
            who create practical learning
            experiences to help you achieve
            your goals.
          </p>

        </div>


        {/* =====================================
            LOADING
        ===================================== */}

        {loading && (

          <div className="instructors-state">

            <p>
              Loading instructors...
            </p>

          </div>

        )}


        {/* =====================================
            ERROR
        ===================================== */}

        {!loading && error && (

          <div className="instructors-state instructors-error">

            <p>
              {error}
            </p>

          </div>

        )}


        {/* =====================================
            EMPTY
        ===================================== */}

        {!loading &&
          !error &&
          instructors.length === 0 && (

            <div className="instructors-state">

              <p>
                No instructors available yet.
              </p>

            </div>

          )}


        {/* =====================================
            INSTRUCTOR GRID
        ===================================== */}

        {!loading &&
          !error &&
          instructors.length > 0 && (

            <div className="instructors-grid">

              {instructors.map(
                (instructor) => (

                  <article
                    className="instructor-card"
                    key={instructor._id}
                  >


                    {/* =====================================
                        IMAGE
                    ===================================== */}

                    <div className="instructor-image">

                      {instructor.profileImage ? (

                        <img
                          src={
                            instructor.profileImage
                          }
                          alt={
                            instructor.name
                          }
                        />

                      ) : (

                        <span>
                          {getInitials(
                            instructor.name
                          )}
                        </span>

                      )}

                    </div>


                    {/* =====================================
                        INFORMATION
                    ===================================== */}

                    <div className="instructor-info">

                      <h3>
                        {instructor.name}
                      </h3>


                      <span className="instructor-role">
                        Instructor
                      </span>


                      <p>
                        Learn practical skills
                        and knowledge from
                        {` ${instructor.name}`}
                        {" "}through engaging
                        courses on EduLearn.
                      </p>


                      <Link
                        to="/courses"
                        className="instructor-profile-button"
                      >
                        View Courses
                      </Link>

                    </div>

                  </article>

                )
              )}

            </div>

          )}

      </div>

    </section>

  );

};


export default InstructorsSection;