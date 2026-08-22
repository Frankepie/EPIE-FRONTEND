import { NavLink } from "react-router-dom";

import {
  FaHome,
  FaBook,
  FaUsers,
  FaUser,
  FaCog
} from "react-icons/fa";

import "../styles/InstructorDashboardLayout.css";


const InstructorBottomNav = () => {

  return (

    <nav className="instructor-bottom-nav">

      {/* DASHBOARD */}

      <NavLink
        to="/instructor/dashboard"
        className={({ isActive }) =>
          isActive
            ? "instructor-bottom-nav-item active"
            : "instructor-bottom-nav-item"
        }
      >

        <FaHome />

        <span>
          Dashboard
        </span>

      </NavLink>


      {/* COURSES */}

      <NavLink
        to="/instructor/courses"
        className={({ isActive }) =>
          isActive
            ? "instructor-bottom-nav-item active"
            : "instructor-bottom-nav-item"
        }
      >

        <FaBook />

        <span>
          Courses
        </span>

      </NavLink>


      {/* STUDENTS */}

      <NavLink
        to="/instructor/students"
        className={({ isActive }) =>
          isActive
            ? "instructor-bottom-nav-item active"
            : "instructor-bottom-nav-item"
        }
      >

        <FaUsers />

        <span>
          Students
        </span>

      </NavLink>


      {/* PROFILE */}

      <NavLink
        to="/instructor/profile"
        className={({ isActive }) =>
          isActive
            ? "instructor-bottom-nav-item active"
            : "instructor-bottom-nav-item"
        }
      >

        <FaUser />

        <span>
          Profile
        </span>

      </NavLink>


      {/* SETTINGS */}

      <NavLink
        to="/instructor/settings"
        className={({ isActive }) =>
          isActive
            ? "instructor-bottom-nav-item active"
            : "instructor-bottom-nav-item"
        }
      >

        <FaCog />

        <span>
          Settings
        </span>

      </NavLink>

    </nav>

  );

};


export default InstructorBottomNav;