import { useState } from "react";
import { Link } from "react-router-dom";

import "../styles/HomeNavbar.css";

const HomeNavbar = () => {

  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }

    closeMenu();
  };

  return (
    <header className="home-navbar">

      <div className="home-navbar-container">

        {/* LOGO */}

        <button
          className="home-logo"
          onClick={() => scrollToSection("home")}
        >
          <span className="home-logo-icon">
            E
          </span>

          <span className="home-logo-text">
            Edu<span>Learn</span>
          </span>
        </button>


        {/* DESKTOP NAVIGATION */}

        <nav className="desktop-navigation">

          <button
            onClick={() => scrollToSection("home")}
          >
            Home
          </button>

          <button
            onClick={() => scrollToSection("courses")}
          >
            Courses
          </button>

          <button
            onClick={() => scrollToSection("learning-video")}
          >
            Learning
          </button>

          <button
            onClick={() => scrollToSection("about")}
          >
            About Us
          </button>

          <button
            onClick={() => scrollToSection("instructors")}
          >
            Instructors
          </button>

        </nav>


        {/* DESKTOP AUTH BUTTONS */}

        <div className="home-auth-buttons">

          <Link
            to="/login"
            className="home-login-button"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="home-register-button"
          >
            Register
          </Link>

        </div>


        {/* MOBILE HAMBURGER */}

        <button
          className={`hamburger-button ${
            menuOpen ? "active" : ""
          }`}
          onClick={() =>
            setMenuOpen(!menuOpen)
          }
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >

          <span></span>
          <span></span>
          <span></span>

        </button>

      </div>


      {/* MOBILE MENU */}

      <div
        className={`mobile-navigation ${
          menuOpen ? "mobile-navigation-open" : ""
        }`}
      >

        <button
          onClick={() =>
            scrollToSection("home")
          }
        >
          Home
        </button>

        <button
          onClick={() =>
            scrollToSection("courses")
          }
        >
          Courses
        </button>

        <button
          onClick={() =>
            scrollToSection("learning-video")
          }
        >
          Learning
        </button>

        <button
          onClick={() =>
            scrollToSection("about")
          }
        >
          About Us
        </button>

        <button
          onClick={() =>
            scrollToSection("instructors")
          }
        >
          Instructors
        </button>


        <div className="mobile-auth-buttons">

          <Link
            to="/login"
            className="mobile-login-button"
            onClick={closeMenu}
          >
            Login
          </Link>

          <Link
            to="/register"
            className="mobile-register-button"
            onClick={closeMenu}
          >
            Register
          </Link>

        </div>

      </div>

    </header>
  );
};

export default HomeNavbar;