const HomeFooter = () => {

  return (

    <footer className="home-footer">

      <div className="footer-container">


        {/* BRAND */}

        <div className="footer-brand">

          <h2>
            Edu<span>Learn</span>
          </h2>

          <p>
            A simple and modern learning platform
            helping students develop skills and
            achieve their goals.
          </p>


          <div className="footer-socials">

            <a href="#facebook" aria-label="Facebook">
              <i className="fab fa-facebook-f"></i>
            </a>

            <a href="#twitter" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a>

            <a href="#linkedin" aria-label="LinkedIn">
              <i className="fab fa-linkedin-in"></i>
            </a>

            <a href="#instagram" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>

          </div>

        </div>


        {/* PLATFORM */}

        <div className="footer-column">

          <h3>
            Platform
          </h3>

          <a href="/courses">
            Courses
          </a>

          <a href="/courses">
            Popular Courses
          </a>

          <a href="/register">
            Become a Student
          </a>

          <a href="/login">
            Login
          </a>

        </div>


        {/* COMPANY */}

        <div className="footer-column">

          <h3>
            Company
          </h3>

          <a href="#about">
            About Us
          </a>

          <a href="#instructors">
            Instructors
          </a>

          <a href="#testimonials">
            Student Reviews
          </a>

          <a href="#contact">
            Contact
          </a>

        </div>


        {/* SUPPORT */}

        <div className="footer-column">

          <h3>
            Support
          </h3>

          <a href="#help">
            Help Center
          </a>

          <a href="#faq">
            FAQ
          </a>

          <a href="#privacy">
            Privacy Policy
          </a>

          <a href="#terms">
            Terms of Service
          </a>

        </div>

      </div>


      <div className="footer-bottom">

        <p>
          © {new Date().getFullYear()} EduLearn.
          All rights reserved.
        </p>

        <p>
          Built for better learning.
        </p>

      </div>

    </footer>

  );
};

export default HomeFooter;