import {
  NavLink
} from "react-router-dom";


const StudentBottomNav = () => {

  return (

    <nav
      className="student-bottom-nav"
      aria-label="Student mobile navigation"
    >


      {/* =====================================
          DASHBOARD
      ===================================== */}

      <NavLink
        to="/student/dashboard"
        className={({ isActive }) =>
          isActive
            ? "student-bottom-nav-item active"
            : "student-bottom-nav-item"
        }
        aria-label="Dashboard"
      >

        <i className="fa-solid fa-house"></i>

        <span>
          Dashboard
        </span>

      </NavLink>


      {/* =====================================
          MY COURSES
      ===================================== */}

      <NavLink
        to="/student/courses"
        className={({ isActive }) =>
          isActive
            ? "student-bottom-nav-item active"
            : "student-bottom-nav-item"
        }
        aria-label="My Courses"
      >

        <i className="fa-solid fa-book"></i>

        <span>
          Courses
        </span>

      </NavLink>


      {/* =====================================
          POPULAR COURSES
      ===================================== */}

      <NavLink
        to="/student/popular-courses"
        className={({ isActive }) =>
          isActive
            ? "student-bottom-nav-item active"
            : "student-bottom-nav-item"
        }
        aria-label="Popular Courses"
      >

        <i className="fa-solid fa-fire"></i>

        <span>
          Popular
        </span>

      </NavLink>


      {/* =====================================
          PROFILE
      ===================================== */}

      <NavLink
        to="/profile"
        className={({ isActive }) =>
          isActive
            ? "student-bottom-nav-item active"
            : "student-bottom-nav-item"
        }
        aria-label="Profile"
      >

        <i className="fa-solid fa-user"></i>

        <span>
          Profile
        </span>

      </NavLink>


      {/* =====================================
          SETTINGS
      ===================================== */}

      <NavLink
        to="/student/settings"
        className={({ isActive }) =>
          isActive
            ? "student-bottom-nav-item active"
            : "student-bottom-nav-item"
        }
        aria-label="Settings"
      >

        <i className="fa-solid fa-gear"></i>

        <span>
          Settings
        </span>

      </NavLink>


    </nav>

  );

};


export default StudentBottomNav;