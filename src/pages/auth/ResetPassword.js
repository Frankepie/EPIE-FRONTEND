import {
  Link,
  useLocation,
  useNavigate
} from "react-router-dom";

import {
  useEffect,
  useState
} from "react";

import {
  FaArrowLeft,
  FaEye,
  FaEyeSlash,
  FaLock
} from "react-icons/fa";

import {
  resetPassword
} from "../../services/api";

import "../../styles/Auth.css";


const ResetPassword = () => {

  const navigate =
    useNavigate();

  const location =
    useLocation();


  const email =
    location.state?.email || "";

  const resetToken =
    location.state?.resetToken || "";


  const [
    password,
    setPassword
  ] = useState("");


  const [
    confirmPassword,
    setConfirmPassword
  ] = useState("");


  const [
    showPassword,
    setShowPassword
  ] = useState(false);


  const [
    showConfirmPassword,
    setShowConfirmPassword
  ] = useState(false);


  const [error, setError] =
    useState("");


  const [success, setSuccess] =
    useState("");


  const [loading, setLoading] =
    useState(false);


  useEffect(() => {

    if (
      !email ||
      !resetToken
    ) {

      navigate(
        "/forgot-password",
        {
          replace: true
        }
      );

    }

  }, [
    email,
    resetToken,
    navigate
  ]);


  const handleSubmit = async (
    event
  ) => {

    event.preventDefault();

    setError("");
    setSuccess("");


    if (
      password.length < 6
    ) {

      setError(
        "Password must be at least 6 characters."
      );

      return;

    }


    if (
      password !==
      confirmPassword
    ) {

      setError(
        "Passwords do not match."
      );

      return;

    }


    setLoading(true);


    try {

      await resetPassword({

        email,

        resetToken,

        password

      });


      setSuccess(
        "Password reset successfully. Redirecting to login..."
      );


      setTimeout(() => {

        navigate("/login");

      }, 1500);


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

      <div className="auth-card reset-password-card">

        <div className="auth-logo">

          <div className="auth-logo-icon">
            <FaLock />
          </div>

          <h1>
            EduLearn
          </h1>

        </div>


        <h2>
          Create New Password
        </h2>


        <p className="auth-subtitle">

          Your new password must be
          different from your previous
          password.

        </p>


        {error && (

          <div className="auth-error">
            {error}
          </div>

        )}


        {success && (

          <div className="auth-success">
            {success}
          </div>

        )}


        <form
          onSubmit={handleSubmit}
        >

          <div className="form-group">

            <label>
              New Password
            </label>


            <div className="password-input-wrapper">

              <FaLock
                className="password-left-icon"
              />


              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter your new password"
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
                required
              />


              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(
                    previous =>
                      !previous
                  )
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >

                {showPassword
                  ? <FaEyeSlash />
                  : <FaEye />}

              </button>

            </div>

          </div>


          <div className="form-group">

            <label>
              Confirm New Password
            </label>


            <div className="password-input-wrapper">

              <FaLock
                className="password-left-icon"
              />


              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                placeholder="Confirm your new password"
                value={
                  confirmPassword
                }
                onChange={(event) =>
                  setConfirmPassword(
                    event.target.value
                  )
                }
                required
              />


              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowConfirmPassword(
                    previous =>
                      !previous
                  )
                }
                aria-label={
                  showConfirmPassword
                    ? "Hide password"
                    : "Show password"
                }
              >

                {showConfirmPassword
                  ? <FaEyeSlash />
                  : <FaEye />}

              </button>

            </div>

          </div>


          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >

            {loading
              ? "Resetting Password..."
              : "Reset Password"}

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


export default ResetPassword;