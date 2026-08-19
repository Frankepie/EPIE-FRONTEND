import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  FaGraduationCap,
  FaTachometerAlt,
  FaUsers,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBook,
  FaClipboardList,
  FaTasks,
  FaQuestionCircle,
  FaCertificate,
  FaChartBar,
  FaBell,
  FaCog,
  FaSignOutAlt
} from "react-icons/fa";

import "../styles/AdminSidebar.css"


const AdminSidebar = () => {

  const navigate = useNavigate();

  const { logout } = useAuth();


  const handleLogout = () => {

    logout();

    navigate("/login");

  };


  const navItems = [

    {
      path: "/admin/dashboard",
      label: "Dashboard",
      icon: <FaTachometerAlt />
    },

    {
      path: "/admin/users",
      label: "Users",
      icon: <FaUsers />
    },

    {
      path: "/admin/students",
      label: "Students",
      icon: <FaUserGraduate />
    },

    {
      path: "/admin/instructors",
      label: "Instructors",
      icon: <FaChalkboardTeacher />
    },

    {
      path: "/admin/courses",
      label: "Courses",
      icon: <FaBook />
    },

    {
      path: "/admin/enrollments",
      label: "Enrollments",
      icon: <FaClipboardList />
    },

    {
      path: "/admin/assignments",
      label: "Assignments",
      icon: <FaTasks />
    },

    {
      path: "/admin/quizzes",
      label: "Quizzes",
      icon: <FaQuestionCircle />
    },

    {
      path: "/admin/certificates",
      label: "Certificates",
      icon: <FaCertificate />
    },

    {
      path: "/admin/reports",
      label: "Reports",
      icon: <FaChartBar />
    },

    {
      path: "/admin/notifications",
      label: "Notifications",
      icon: <FaBell />
    },

    {
      path: "/admin/settings",
      label: "Settings",
      icon: <FaCog />
    }

  ];


  return (

    <aside className="admin-sidebar">


      {/* LOGO */}

      <div className="admin-sidebar-logo">

        <div className="admin-logo-icon">

          <FaGraduationCap />

        </div>

        <span>
          EduLearn
        </span>

      </div>


      {/* NAVIGATION */}

      <nav className="admin-sidebar-nav">

        {navItems.map((item) => (

          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive
                ? "admin-nav-link active"
                : "admin-nav-link"
            }
          >

            <span className="admin-nav-icon">
              {item.icon}
            </span>

            <span>
              {item.label}
            </span>

          </NavLink>

        ))}

      </nav>


      {/* LOGOUT */}

      <div className="admin-sidebar-bottom">

        <button
          type="button"
          className="admin-logout-button"
          onClick={handleLogout}
        >

          <span className="admin-nav-icon">

            <FaSignOutAlt />

          </span>

          <span>
            Logout
          </span>

        </button>

      </div>


    </aside>

  );

};


export default AdminSidebar;