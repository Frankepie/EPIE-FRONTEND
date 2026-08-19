import { useState } from "react";

import {
  verifyCertificate
} from "../services/api";

import "../styles/CertificateVerification.css";


const CertificateVerification = () => {

  const [certificateId, setCertificateId] =
    useState("");

  const [certificate, setCertificate] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleVerify = async (event) => {

    event.preventDefault();

    if (!certificateId.trim()) {

      setError(
        "Please enter a certificate ID."
      );

      return;
    }

    try {

      setLoading(true);

      setError("");

      setCertificate(null);

      const data =
        await verifyCertificate(
          certificateId.trim()
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


  return (

    <div className="certificate-verification-page">

      <div className="verification-container">

        <div className="verification-logo">

          <div className="verification-logo-icon">
            E
          </div>

          <span>
            EduLearn
          </span>

        </div>


        <p className="verification-label">
          CERTIFICATE VERIFICATION
        </p>


        <h1>
          Verify a Certificate
        </h1>


        <p className="verification-description">

          Enter the certificate ID below to verify
          the authenticity of an EduLearn certificate.

        </p>


        <form
          onSubmit={handleVerify}
          className="verification-form"
        >

          <label>
            Certificate ID
          </label>

          <input
            type="text"
            value={certificateId}
            onChange={(event) =>
              setCertificateId(
                event.target.value
              )
            }
            placeholder="e.g. EDU-1750000000000-4821"
          />


          <button
            type="submit"
            disabled={loading}
          >

            {loading
              ? "Verifying..."
              : "Verify Certificate"}

          </button>

        </form>


        {error && (

          <div className="verification-error">

            ✕ {error}

          </div>

        )}


        {certificate && (

          <div className="verification-success">

            <div className="success-icon">
              ✓
            </div>

            <h2>
              Certificate is Valid
            </h2>

            <p>
              This certificate has been
              successfully verified.
            </p>


            <div className="verified-details">

              <div>

                <span>
                  Student
                </span>

                <strong>
                  {certificate.student?.fullName}
                </strong>

              </div>


              <div>

                <span>
                  Course
                </span>

                <strong>
                  {certificate.course?.title}
                </strong>

              </div>


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

                  {certificate.issuedAt
                    ? new Date(
                        certificate.issuedAt
                      ).toLocaleDateString()
                    : "N/A"}

                </strong>

              </div>

            </div>

          </div>

        )}

      </div>

    </div>

  );

};


export default CertificateVerification;