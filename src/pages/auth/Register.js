import {
  Link,
  useNavigate
} from "react-router-dom";

import {
  useState
} from "react";

import {
  FaApple,
  FaFacebookF,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaGraduationCap
} from "react-icons/fa";

import {
  registerUser
} from "../../services/api";

import "../../styles/Auth.css";


const Register = () => {

  const navigate =
    useNavigate();


  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      password: "",
      role: "student"
    });


  const [
    confirmPassword,
    setConfirmPassword
  ] = useState("");


  const [
    acceptedTerms,
    setAcceptedTerms
  ] = useState(false);


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


  const [loading, setLoading] =
    useState(false);


  const handleChange = (
    event
  ) => {

    const {
      name,
      value
    } = event.target;


    setFormData({
      ...formData,
      [name]: value
    });

  };


  const handleConfirmPasswordChange = (
    event
  ) => {

    setConfirmPassword(
      event.target.value
    );

    setError("");

  };


  const handleSubmit = async (
    event
  ) => {

    event.preventDefault();

    setError("");


    if (
      !formData.name.trim()
    ) {

      setError(
        "Please enter your full name."
      );

      return;
    }


    if (
      !formData.email.trim()
    ) {

      setError(
        "Please enter your email address."
      );

      return;
    }


    if (
      !formData.password
    ) {

      setError(
        "Please create a password."
      );

      return;
    }


    if (
      formData.password !==
      confirmPassword
    ) {

      setError(
        "Passwords do not match."
      );

      return;
    }


    if (!acceptedTerms) {

      setError(
        "Please agree to the Terms & Conditions."
      );

      return;
    }


    setLoading(true);


    try {

      const data =
        await registerUser(
          formData
        );


      navigate(
        "/verify-otp",
        {
          state: {

            email:
              data.email ||
              formData.email,

            purpose:
              "registration"

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

      <div className="auth-card register-card">

        <div className="auth-logo">

          <div className="auth-logo-icon">

            <FaGraduationCap />

          </div>

          <h1>
            EduLearn
          </h1>

        </div>


        <h2>
          Create Your Account
        </h2>


        <p className="auth-subtitle">
          Join EduLearn today
        </p>


        {error && (

          <div className="auth-error">
            {error}
          </div>

        )}


        <form
          onSubmit={handleSubmit}
        >

          {/* FULL NAME */}

          <div className="form-group">

            <label htmlFor="name">
              Full Name
            </label>

            <input
              id="name"
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
              required
            />

          </div>


          {/* EMAIL */}

          <div className="form-group">

            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              name="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />

          </div>


          {/* PASSWORD */}

          <div className="form-group">

            <label htmlFor="password">
              Password
            </label>

            <div className="password-input-wrapper">

              <input
                id="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
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


          {/* CONFIRM PASSWORD */}

          <div className="form-group">

            <label htmlFor="confirmPassword">
              Confirm Password
            </label>

            <div className="password-input-wrapper">

              <input
                id="confirmPassword"
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                name="confirmPassword"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={
                  handleConfirmPasswordChange
                }
                autoComplete="new-password"
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


          {/* ACCOUNT TYPE */}

          <div className="form-group">

            <label htmlFor="role">
              Account Type
            </label>

            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >

              <option value="student">
                Student
              </option>

              <option value="instructor">
                Instructor
              </option>

            </select>

          </div>


          {/* TERMS */}

          <div className="terms-row">

            <input
              type="checkbox"
              id="terms"
              checked={acceptedTerms}
              onChange={(event) =>
                setAcceptedTerms(
                  event.target.checked
                )
              }
            />

            <label htmlFor="terms">

              I agree to the{" "}

              <Link to="/terms">
                Terms & Conditions
              </Link>

            </label>

          </div>


          {/* SUBMIT */}

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >

            {loading
              ? "Sending Verification Code..."
              : "Sign Up"}

          </button>

        </form>


        <div className="auth-divider">

          <span></span>

          <p>
            Or continue with:
          </p>

          <span></span>

        </div>


       <div className="social-buttons">

  <button
    type="button"
    aria-label="Continue with Google"
  >
    <FaGoogle />
  </button>


  <button
    type="button"
    aria-label="Continue with Facebook"
  >
    <FaFacebookF />
  </button>


  <button
    type="button"
    aria-label="Continue with Apple"
  >
    <FaApple />
  </button>

</div>


        <p className="auth-footer">

          Already have an account?{" "}

          <Link to="/login">
            Login
          </Link>

        </p>

      </div>

    </div>

  );

};


export default Register;