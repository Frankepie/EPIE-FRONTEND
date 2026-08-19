import {
  Link,
  useNavigate
} from "react-router-dom";

import {
  useState
} from "react";

import {
  FaArrowLeft,
  FaEnvelope
} from "react-icons/fa";

import {
  forgotPassword
} from "../../services/api";

import "../../styles/Auth.css";


const ForgotPassword = () => {

  const navigate =
    useNavigate();


  const [email, setEmail] =
    useState("");


  const [error, setError] =
    useState("");


  const [loading, setLoading] =
    useState(false);


  const handleSubmit = async (
    event
  ) => {

    event.preventDefault();

    setError("");
    setLoading(true);


    try {

      const data =
        await forgotPassword({
          email
        });


      navigate(
        "/verify-otp",
        {
          state: {
            email:
              data.email ||
              email,

            purpose:
              "password_reset"
          }
        }
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

    <div className="auth-page">

      <div className="auth-card forgot-password-card">

        <div className="auth-logo">

          <div className="auth-logo-icon">
            <FaEnvelope />
          </div>

          <h1>
            EduLearn
          </h1>

        </div>


        <h2>
          Reset Password
        </h2>


        <p className="auth-subtitle">

          Enter your email and we'll
          send you a verification code
          to reset your password.

        </p>


        {error && (

          <div className="auth-error">
            {error}
          </div>

        )}


        <form
          onSubmit={handleSubmit}
        >

          <div className="form-group">

            <label htmlFor="email">
              Email
            </label>


            <div className="icon-input-wrapper">

              <FaEnvelope />

              <input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value
                  )
                }
                required
              />

            </div>

          </div>


          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >

            {loading
              ? "Sending..."
              : "Send Reset Code"}

          </button>

        </form>


        <Link
          to="/login"
          className="back-link"
        >

          <FaArrowLeft />

          {" "}
          Back to Login

        </Link>

      </div>

    </div>

  );

};


export default ForgotPassword;