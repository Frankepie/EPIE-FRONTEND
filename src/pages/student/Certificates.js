import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getMyCertificates } from "../../services/api";
import { useNavigate } from "react-router-dom";
import "../../styles/Certificates.css";


const Certificates = () => {
const navigate = useNavigate();
  const { token } = useAuth();

  const [certificates, setCertificates] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // ==========================================
  // LOAD CERTIFICATES
  // ==========================================

  useEffect(() => {

    const loadCertificates = async () => {

      try {

        setLoading(true);
        setError("");

        const data =
          await getMyCertificates(token);

        setCertificates(
          data.certificates || []
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
      loadCertificates();
    }

  }, [token]);


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (
      <div className="certificates-page">

        <div className="certificates-loading">
          Loading your certificates...
        </div>

      </div>
    );

  }


  // ==========================================
  // ERROR
  // ==========================================

  if (error) {

    return (
      <div className="certificates-page">

        <div className="certificates-error">
          {error}
        </div>

      </div>
    );

  }


  // ==========================================
  // PAGE
  // ==========================================

  return (

    <div className="certificates-page">

      {/* HEADER */}

      <div className="certificates-header">

        <div>

          <p className="certificates-label">
            YOUR ACHIEVEMENTS
          </p>

          <h1>
            My Certificates
          </h1>

          <p className="certificates-description">
            View the certificates you have earned
            from your completed courses.
          </p>

        </div>

      </div>


      {/* EMPTY STATE */}

      {certificates.length === 0 ? (

        <div className="certificates-empty">

          <div className="certificate-empty-icon">
            🏆
          </div>

          <h2>
            No certificates yet
          </h2>

          <p>
            Complete a course to earn your
            first EduLearn certificate.
          </p>

        </div>

      ) : (

        /* CERTIFICATE GRID */

        <div className="certificates-grid">

          {certificates.map(
            (certificate) => (
<div
  className="certificate-card"
  key={certificate._id}
  onClick={() =>
    navigate(
      `/student/certificates/${certificate.certificateId}`
    )
  }
  style={{ cursor: "pointer" }}
>

                <div className="certificate-card-icon">
                  🏆
                </div>


                <div className="certificate-card-content">

                  <span className="certificate-status">
                    CERTIFICATE EARNED
                  </span>


                  <h2>
                    {certificate.course?.title ||
                      "Course Certificate"}
                  </h2>


                  <p>
                    {certificate.course?.description ||
                      "Course completion certificate"}
                  </p>


                  <div className="certificate-info">

                    <div>

                      <span>
                        Certificate ID
                      </span>

                      <strong>
                        {certificate.certificateId}
                      </strong>

                    </div>


                    <div>

                      <span>
                        Issued
                      </span>

                      <strong>
                        {new Date(
                          certificate.issuedAt
                        ).toLocaleDateString()}
                      </strong>

                    </div>

                  </div>

                </div>

              </div>

            )
          )}

        </div>

      )}
    </div>
  );
};

export default Certificates;