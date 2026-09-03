import {
  NavLink,
  useNavigate
} from "react-router-dom";

import {
  FaHome,
  FaBook,
  FaUsers,
  FaClipboardList,
  FaLayerGroup,
  FaComments,
  FaMoneyBillWave,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaCommentDots
} from "react-icons/fa";

import {
  useAuth
} from "../context/AuthContext";

import "../styles/InstructorSidebar.css";


const InstructorSidebar = () => {

  const navigate = useNavigate();

  const {
    logout
  } = useAuth();


  const handleLogout = () => {

    logout();

    navigate("/login");

  };


  return (

    <aside className="instructor-sidebar">

      {/* =====================================
          LOGO
      ===================================== */}

      <div className="instructor-brand">

        <div className="brand-logo">
          E
        </div>

        <span>
          EduLearn
        </span>

      </div>


      {/* =====================================
          NAVIGATION
      ===================================== */}

      <nav className="instructor-navigation">


        {/* ==================================
            DASHBOARD
        ================================== */}

        <NavLink
          to="/instructor/dashboard"
          className={({ isActive }) =>
            isActive
              ? "instructor-nav-item active"
              : "instructor-nav-item"
          }
        >

          <FaHome />

          <span>
            Dashboard
          </span>

        </NavLink>


        {/* ==================================
            MY COURSES
        ================================== */}

        <NavLink
          to="/instructor/courses"
          className={({ isActive }) =>
            isActive
              ? "instructor-nav-item active"
              : "instructor-nav-item"
          }
        >

          <FaBook />

          <span>
            My Courses
          </span>

        </NavLink>


        {/* ==================================
            STUDENTS
        ================================== */}

        <NavLink
          to="/instructor/students"
          className={({ isActive }) =>
            isActive
              ? "instructor-nav-item active"
              : "instructor-nav-item"
          }
        >

          <FaUsers />

          <span>
            Students
          </span>

        </NavLink>


        {/* ==================================
            ASSIGNMENTS
        ================================== */}

        <NavLink
          to="/instructor/assignments"
          className={({ isActive }) =>
            isActive
              ? "instructor-nav-item active"
              : "instructor-nav-item"
          }
        >

          <FaClipboardList />

          <span>
            Assignments
          </span>

        </NavLink>


        {/* ==================================
            LESSONS
        ================================== */}

        <NavLink
          to="/instructor/courses"
          className={({ isActive }) =>
            isActive
              ? "instructor-nav-item active"
              : "instructor-nav-item"
          }
        >

          <FaLayerGroup />

          <span>
            Lessons
          </span>

        </NavLink>


        {/* ==================================
            COMMUNICATION
        ================================== */}

        <NavLink
          to="/instructor/communication"
          className={({ isActive }) =>
            isActive
              ? "instructor-nav-item active"
              : "instructor-nav-item"
          }
        >

          <FaCommentDots />

          <span>
            Communication
          </span>

        </NavLink>


        {/* ==================================
            DISCUSSIONS
        ================================== */}

        <NavLink
          to="/instructor/discussions"
          className={({ isActive }) =>
            isActive
              ? "instructor-nav-item active"
              : "instructor-nav-item"
          }
        >

          <FaComments />

          <span>
            Discussions
          </span>

        </NavLink>


        {/* ==================================
            EARNINGS
        ================================== */}

        <NavLink
          to="/instructor/earnings"
          className={({ isActive }) =>
            isActive
              ? "instructor-nav-item active"
              : "instructor-nav-item"
          }
        >

          <FaMoneyBillWave />

          <span>
            Earnings
          </span>

        </NavLink>


        <div className="instructor-sidebar-divider" />


        {/* ==================================
            PROFILE
        ================================== */}

        <NavLink
          to="/instructor/profile"
          className={({ isActive }) =>
            isActive
              ? "instructor-nav-item active"
              : "instructor-nav-item"
          }
        >

          <FaUser />

          <span>
            Profile
          </span>

        </NavLink>


        {/* ==================================
            SETTINGS
        ================================== */}

        <NavLink
          to="/instructor/settings"
          className={({ isActive }) =>
            isActive
              ? "instructor-nav-item active"
              : "instructor-nav-item"
          }
        >

          <FaCog />

          <span>
            Settings
          </span>

        </NavLink>


      </nav>


      {/* =====================================
          LOGOUT
      ===================================== */}

      <div className="instructor-sidebar-bottom">

        <button
          type="button"
          className="instructor-logout"
          onClick={handleLogout}
        >

          <FaSignOutAlt />

          <span>
            Logout
          </span>

        </button>

      </div>


    </aside>

  );

};


export default InstructorSidebar;

