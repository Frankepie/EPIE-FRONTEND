import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import {
  getCertificate
} from "../../services/api";

import "../../styles/CertificateDetails.css";


const CertificateDetails = () => {

  const { certificateId } =
    useParams();

  const { token } =
    useAuth();


  const [certificate, setCertificate] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {

    const loadCertificate =
      async () => {

        try {

          const data =
            await getCertificate(
              certificateId,
              token
            );

          setCertificate(
            data.certificate
          );

        } catch (error) {

          setError(
            error.message
          );

        } finally {

          setLoading(false);

        }

      };


    if (
      token &&
      certificateId
    ) {

      loadCertificate();

    }

  }, [
    token,
    certificateId
  ]);


  if (loading) {

    return (
      <div className="certificate-details-page">

        <div className="certificate-loading">

          Loading certificate...

        </div>

      </div>
    );

  }


  if (error) {

    return (
      <div className="certificate-details-page">

        <div className="certificate-error">

          {error}

        </div>

        <Link
          to="/my-certificates"
          className="back-certificates"
        >
          ← Back to My Certificates
        </Link>

      </div>
    );

  }


  if (!certificate) {

    return (
      <div className="certificate-details-page">

        <div className="certificate-error">

          Certificate not found.

        </div>

      </div>
    );

  }


  return (

    <div className="certificate-details-page">

      <div className="certificate-wrapper">

        {/* =====================================
            CERTIFICATE
        ===================================== */}

        <div className="certificate">

          <div className="certificate-border">

            <div className="certificate-inner">

              <div className="certificate-logo">

                <div className="certificate-logo-icon">
                  E
                </div>

                <span>
                  EduLearn
                </span>

              </div>


              <p className="certificate-label">

                CERTIFICATE OF COMPLETION

              </p>


              <h1>
                Certificate of Achievement
              </h1>


              <p className="certificate-text">

                This certificate is proudly presented to

              </p>


              <h2 className="student-name">

                {certificate.student?.fullName ||
                  "Student"}

              </h2>


              <p className="certificate-text">

                for successfully completing

              </p>


              <h3 className="course-name">

                {certificate.course?.title ||
                  "Course"}

              </h3>


              <div className="certificate-meta">

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
                    Date Issued
                  </span>

                  <strong>

                    {new Date(
                      certificate.issuedAt
                    ).toLocaleDateString()}

                  </strong>

                </div>

              </div>


              <div className="certificate-footer">

                <div className="signature">

                  <div className="signature-line"></div>

                  <span>
                    EduLearn
                  </span>

                </div>


                <div className="seal">

                  🏆

                </div>


                <div className="signature">

                  <div className="signature-line"></div>

                  <span>
                    Certificate
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* =====================================
            ACTIONS
        ===================================== */}

        <div className="certificate-actions">

          <button
            type="button"
            onClick={() =>
              window.print()
            }
          >
            🖨️ Print Certificate
          </button>


          <Link
            to="/my-certificates"
          >
            ← My Certificates
          </Link>

        </div>

      </div>

    </div>

  );

};


export default CertificateDetails;