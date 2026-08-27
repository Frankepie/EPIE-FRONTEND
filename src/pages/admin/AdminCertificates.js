import {
  useEffect,
  useState
} from "react";

import {
  FaCertificate,
  FaUserGraduate,
  FaBook,
  FaUserTie,
  FaCalendarAlt
} from "react-icons/fa";

import {
  useAuth
} from "../../context/AuthContext";

import {
  getAdminCertificates
} from "../../services/api";

import "../../styles/AdminCertificates.css";


const AdminCertificates = () => {

  const { token } = useAuth();

  const [certificates, setCertificates] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {

    const loadCertificates = async () => {

      try {

        setLoading(true);
        setError("");

        const data =
          await getAdminCertificates(token);

        setCertificates(
          data.certificates || []
        );

      } catch (error) {

        console.error(
          "Admin certificates error:",
          error
        );

        setError(
          error.message ||
          "Failed to load certificates."
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
      <div className="admin-page-loading">
        Loading certificates...
      </div>
    );

  }


  return (

    <div className="admin-certificates-page">

      <div className="admin-page-header">

        <div>

          <h1>
            Certificates
          </h1>

          <p>
            View certificates issued to
            students who completed courses.
          </p>

        </div>

        <div className="admin-page-stat">

          <FaCertificate />

          <span>
            {certificates.length} Certificates
          </span>

        </div>

      </div>


      {error && (

        <div className="admin-page-error">
          {error}
        </div>

      )}


      {!error &&
        certificates.length === 0 && (

          <div className="admin-empty-state">

            <FaCertificate />

            <h3>
              No certificates found
            </h3>

            <p>
              Certificates generated after
              course completion will appear here.
            </p>

          </div>

        )}


      {certificates.length > 0 && (

        <div className="admin-certificates-grid">

          {certificates.map(certificate => (

            <div
              className="admin-certificate-card"
              key={certificate._id}
            >

              <div className="certificate-icon">

                <FaCertificate />

              </div>


              <div className="certificate-body">

                <span className="certificate-label">
                  Certificate ID
                </span>

                <strong className="certificate-id">
                  {certificate.certificateId}
                </strong>


                <div className="certificate-info">

                  <div>

                    <FaUserGraduate />

                    <div>

                      <small>
                        Student
                      </small>

                      <strong>
                        {
                          certificate
                            .student
                            ?.name ||
                          "Unknown student"
                        }
                      </strong>

                      <span>
                        {
                          certificate
                            .student
                            ?.email ||
                          ""
                        }
                      </span>

                    </div>

                  </div>


                  <div>

                    <FaBook />

                    <div>

                      <small>
                        Course
                      </small>

                      <strong>
                        {
                          certificate
                            .course
                            ?.title ||
                          "Unknown course"
                        }
                      </strong>

                    </div>

                  </div>


                  <div>

                    <FaUserTie />

                    <div>

                      <small>
                        Instructor
                      </small>

                      <strong>
                        {
                          certificate
                            .course
                            ?.instructor
                            ?.name ||
                          "Unknown instructor"
                        }
                      </strong>

                    </div>

                  </div>


                  <div>

                    <FaCalendarAlt />

                    <div>

                      <small>
                        Issued
                      </small>

                      <strong>
                        {new Date(
                          certificate.issuedAt
                        ).toLocaleDateString()}
                      </strong>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  );

};


export default AdminCertificates;