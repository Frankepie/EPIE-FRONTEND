import {
  Link,
  useNavigate
} from "react-router-dom";

import {
  useState
} from "react";

import {
  loginUser
} from "../../services/api";

import {
  useAuth
} from "../../context/AuthContext";

import {
  FaApple,
  FaEye,
  FaEyeSlash,
  FaFacebookF,
  FaGoogle,
  FaGraduationCap
} from "react-icons/fa";

import "../../styles/Auth.css";


const Login = () => {

  const navigate = useNavigate();

  const { login } = useAuth();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [rememberMe, setRememberMe] =
    useState(false);

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);


  const handleSubmit = async (event) => {

    event.preventDefault();

    setError("");

    setLoading(true);

    try {

      const data = await loginUser({
        email,
        password
      });


      login(
        data.user,
        data.token
      );


      if (data.user.role === "admin") {

        navigate("/admin/dashboard");

      } else if (
        data.user.role === "instructor"
      ) {

        navigate("/instructor-dashboard");

      } else {

        navigate("/student/dashboard");

      }

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

      <div className="auth-card login-card">

        <div className="auth-brand">

          <div className="auth-brand-icon">
            <FaGraduationCap />
          </div>

          <span>
            EduLearn
          </span>

        </div>


        <div className="auth-heading">

          <h1>
            Welcome Back!
          </h1>

          <p>
            Sign in to continue
          </p>

        </div>


        {error && (

          <div className="auth-error">
            {error}
          </div>

        )}


        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >

          <div className="form-group">

            <label htmlFor="login-email">
              Email
            </label>

            <input
              id="login-email"
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              autoComplete="email"
              required
            />

          </div>


          <div className="form-group">

            <label htmlFor="login-password">
              Password
            </label>

            <div className="password-input-wrapper">

              <input
                id="login-password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter your password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(
                    !showPassword
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
                  : <FaEye />
                }

              </button>

            </div>

          </div>


      <div className="login-options">

  <label className="remember-row">

    <input
      type="checkbox"
      checked={rememberMe}
      onChange={(event) =>
        setRememberMe(
          event.target.checked
        )
      }
    />

    <span>
      Remember me
    </span>

  </label>


  <Link
    to="/forgot-password"
    className="forgot-link"
  >
    Forgot password?
  </Link>

</div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >

            {loading
              ? "Logging in..."
              : "Login"
            }

          </button>

        </form>


        <div className="social-divider">

          <span></span>

          <p>
            Or continue with:
          </p>

          <span></span>

        </div>


        <div className="social-buttons">

          <button
            type="button"
            className="social-button"
            aria-label="Continue with Google"
          >
            <FaGoogle />
          </button>


          <button
            type="button"
            className="social-button"
            aria-label="Continue with Facebook"
          >
            <FaFacebookF />
          </button>


          <button
            type="button"
            className="social-button"
            aria-label="Continue with Apple"
          >
            <FaApple />
          </button>

        </div>


        <p className="auth-footer">

          Don't have an account?

          <Link to="/register">
            Sign up
          </Link>

        </p>

      </div>

    </div>

  );

};


export default Login;