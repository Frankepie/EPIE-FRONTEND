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
  FaSignOutAlt
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