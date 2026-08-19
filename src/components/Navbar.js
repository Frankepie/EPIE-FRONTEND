import {
  Link,
  useNavigate
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { FaGraduationCap } from "react-icons/fa";
import "../styles/Navbar.css";


const Navbar = () => {

  const {
    user,
    logout
  } = useAuth();

  const navigate =
    useNavigate();


  const handleLogout = () => {

    logout();

    navigate("/login");

  };


  return (

    <nav className="navbar">

      <div className="navbar-container">

        <Link
          to="/"
          className="navbar-logo"
        >

          <span className="navbar-logo-icon">
             <FaGraduationCap />
          </span>
          <span>
            EduLearn
          </span>
        </Link>

        <div className="navbar-links">
          <Link to="/">
            Home
          </Link>
          <Link to="/courses">
            Courses
          </Link>
          {!user && (
            <>
              <Link to="/login">
                Login
              </Link>
              <Link to="/register">
                Register
              </Link>
            </>
          )}
         {user && (
  <>

    {user.role === "student" && (
      <Link to="/student-dashboard">
        Dashboard
      </Link>
    )}

    {user.role === "instructor" && (
      <Link to="/instructor-dashboard">
        Dashboard
      </Link>
    )}

    <Link to="/profile">
      Profile
    </Link>

    <button
      onClick={handleLogout}
      className="logout-button"
    >
      Logout
    </button>

  </>
)}
        </div>

      </div>

    </nav>
  );
};

export default Navbar;