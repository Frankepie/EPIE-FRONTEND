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
  FaEnvelope,
  FaKey
} from "react-icons/fa";

import {
  resendRegistrationOTP,
  verifyRegistrationOTP,
  verifyPasswordResetOTP,
  forgotPassword
} from "../../services/api";

import "../../styles/Auth.css";


const VerifyOTP = () => {

  const navigate =
    useNavigate();

  const location =
    useLocation();


  const email =
    location.state?.email || "";


  const purpose =
    location.state?.purpose ||
    "registration";


  const [otp, setOtp] =
    useState("");


  const [error, setError] =
    useState("");


  const [success, setSuccess] =
    useState("");


  const [loading, setLoading] =
    useState(false);


  const [resending, setResending] =
    useState(false);


  const [
    resendTimer,
    setResendTimer
  ] = useState(60);


  useEffect(() => {

    if (resendTimer <= 0) {
      return;
    }


    const timer =
      setInterval(() => {

        setResendTimer(
          previous =>
            previous - 1
        );

      }, 1000);


    return () =>
      clearInterval(timer);

  }, [resendTimer]);


 useEffect(() => {

  if (!email) {

    navigate(
      purpose === "registration"
        ? "/register"
        : "/forgot-password",
      {
        replace: true
      }
    );

  }

}, [
  email,
  purpose,
  navigate
]);


  const handleOtpChange = (
    event
  ) => {

    const value =
      event.target.value
        .replace(/\D/g, "")
        .slice(0, 6);


    setOtp(value);

    setError("");
  };


  const handleSubmit = async (
    event
  ) => {

    event.preventDefault();

    setError("");
    setSuccess("");


    if (otp.length !== 6) {

      setError(
        "Please enter the 6-digit verification code."
      );

      return;
    }


    setLoading(true);


    try {

      if (
        purpose ===
        "registration"
      ) {

        await verifyRegistrationOTP({
          email,
          otp
        });


        setSuccess(
          "Your account has been verified successfully."
        );


        setTimeout(() => {

          navigate("/login");

        }, 1200);


      } else {

        const data =
          await verifyPasswordResetOTP({
            email,
            otp
          });


        navigate(
          "/reset-password",
          {
            state: {
              email,
              resetToken:
                data.resetToken
            }
          }
        );

      }


    } catch (error) {

      setError(
        error.message
      );

    } finally {

      setLoading(false);

    }

  };


 const handleResend = async () => {

  if (resendTimer > 0) {
    return;
  }


  setError("");
  setSuccess("");
  setResending(true);


  try {

    if (
      purpose ===
      "registration"
    ) {

      await resendRegistrationOTP({
        email
      });

    } else {

      await forgotPassword({
        email
      });

    }


    setSuccess(
      "A new verification code has been sent."
    );


    setResendTimer(60);


  } catch (error) {

    setError(
      error.message
    );

  } finally {

    setResending(false);

  }

};


  return (

    <div className="auth-page">

      <div className="auth-card otp-card">

        <div className="otp-icon">

          <FaEnvelope />

        </div>


        <h2>
          Verify Your Email
        </h2>


        <p className="auth-subtitle">

          We've sent a 6-digit
          verification code to

          <strong>
            {" "}
            {email}
          </strong>

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
              Verification Code
            </label>

            <div className="otp-input-wrapper">

              <FaKey />

              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength="6"
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={handleOtpChange}
                required
              />

            </div>

          </div>


          <button
            type="submit"
            className="auth-button"
            disabled={
              loading ||
              otp.length !== 6
            }
          >

            {loading
              ? "Verifying..."
              : "Verify OTP"}

          </button>

        </form>


        <div className="otp-resend">

          <p>
            Didn't receive the code?
          </p>


          <button
            type="button"
            className="resend-button"
            onClick={handleResend}
            disabled={
              resendTimer > 0 ||
              resending
            }
          >

            {resending
              ? "Sending..."
              : resendTimer > 0
                ? `Resend OTP in ${resendTimer}s`
                : "Resend OTP"}

          </button>

        </div>


        <Link
          to={
            purpose ===
            "registration"
              ? "/register"
              : "/forgot-password"
          }
          className="back-link"
        >

          <FaArrowLeft />

          {" "}
          Back

        </Link>

      </div>

    </div>

  );

};


export default VerifyOTP;