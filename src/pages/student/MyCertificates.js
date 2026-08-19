import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import {
  getMyCertificates
} from "../../services/api";

import "../../styles/MyCertificates.css";


const MyCertificates = () => {

  const { token } = useAuth();

  const [certificates, setCertificates] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {

    const loadCertificates =
      async () => {

        try {

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


  if (loading) {

    return (
      <div className="certificates-page">
        Loading your certificates...
      </div>
    );

  }


  if (error) {

    return (
      <div className="certificates-page">

        <div className="certificate-error">
          {error}
        </div>

      </div>
    );

  }


  return (

    <div className="certificates-page">

      <div className="certificates-header">

        <p>
          Student Area
        </p>

        <h1>
          My Certificates
        </h1>

        <span>
          Celebrate your learning achievements.
        </span>

      </div>


      {certificates.length === 0 ? (

        <div className="no-certificates">

          <div className="certificate-icon">
            🏆
          </div>

          <h2>
            No certificates yet
          </h2>

          <p>
            Complete a course to earn
            your first certificate.
          </p>

          <Link to="/student/courses">
            Continue Learning
                 </Link>

        </div>

      ) : (

        <div className="certificates-grid">

          {certificates.map(
            (certificate) => (

              <div
                className="certificate-card"
                key={
                  certificate._id
                }
              >

                <div className="certificate-card-icon">
                  🏆
                </div>

                <h2>
                  {certificate.course?.title ||
                    "Completed Course"}
                </h2>

                <p>
                  Certificate ID:
                </p>

                <strong>
                  {certificate.certificateId}
                </strong>

                <span>
                  Issued on{" "}
                  {new Date(
                    certificate.issuedAt
                  ).toLocaleDateString()}
                </span>

                <Link
                  to={`/certificates/${certificate.certificateId}`}
                >
                  View Certificate
                </Link>

              </div>

            )
          )}

        </div>

      )}

    </div>

  );

};


export default MyCertificates;