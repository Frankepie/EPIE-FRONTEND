import {
  NavLink,
  useNavigate
} from "react-router-dom";

import {
  useAuth
} from "../context/AuthContext";
import {
  useLanguage
} from "../context/LanguageContext";
import "../styles/StudentSidebar.css";


const StudentSidebar = () => {
const {
  t
} = useLanguage();
  const navigate = useNavigate();

  const { logout } = useAuth();


  const handleLogout = () => {

    logout();

    navigate("/login");

  };


  return (

    <aside className="student-sidebar">


      {/* ======================================
          LOGO
      ====================================== */}

      <div className="student-sidebar-logo">

        <div className="student-sidebar-logo-icon">
          E
        </div>

        <span>
          EduLearn
        </span>

      </div>


      {/* ======================================
          NAVIGATION
      ====================================== */}

      <nav className="student-sidebar-nav">


        {/* DASHBOARD */}

        <NavLink
          to="/student/dashboard"
          className={({ isActive }) =>
            isActive
              ? "student-nav-link active"
              : "student-nav-link"
          }
        >

          <i className="fa-regular fa-house"></i>

        <span>{t("dashboard")}</span>
        </NavLink>


        {/* MY COURSES */}

        <NavLink
          to="/student/courses"
          className={({ isActive }) =>
            isActive
              ? "student-nav-link active"
              : "student-nav-link"
          }
        >

          <i className="fa-solid fa-book"></i>

         <span>{t("myCourses")}</span>

        </NavLink>


        {/* ASSIGNMENTS */}

        <NavLink
          to="/student/assignments"
          className={({ isActive }) =>
            isActive
              ? "student-nav-link active"
              : "student-nav-link"
          }
        >

          <i className="fa-solid fa-clipboard-list"></i>
<span>{t("assignments")}</span>
        </NavLink>


        {/* MY PROGRESS */}

        <NavLink
          to="/student/progress"
          className={({ isActive }) =>
            isActive
              ? "student-nav-link active"
              : "student-nav-link"
          }
        >

          <i className="fa-solid fa-bars-progress"></i>

         <span>{t("myProgress")}</span>

        </NavLink>


        {/* CERTIFICATES */}

        <NavLink
          to="/student/certificates"
          className={({ isActive }) =>
            isActive
              ? "student-nav-link active"
              : "student-nav-link"
          }
        >

          <i className="fa-solid fa-trophy"></i>

         <span>{t("certificates")}</span>

        </NavLink>


        {/* BOOKMARKS */}

        <NavLink
          to="/student/bookmarks"
          className={({ isActive }) =>
            isActive
              ? "student-nav-link active"
              : "student-nav-link"
          }
        >

          <i className="fa-solid fa-bookmark"></i>

         <span>{t("bookmarks")}</span>

        </NavLink>


        {/* NOTIFICATIONS */}

        <NavLink
          to="/student/notifications"
          className={({ isActive }) =>
            isActive
              ? "student-nav-link active"
              : "student-nav-link"
          }
        >

          <i className="fa-solid fa-bell"></i>

          <span>{t("notifications")}</span>

        </NavLink>


        {/* DISCUSSIONS */}

        <NavLink
          to="/student/discussions"
          className={({ isActive }) =>
            isActive
              ? "student-nav-link active"
              : "student-nav-link"
          }
        >

          <i className="fa-solid fa-message"></i>

          <span>{t("discussions")}</span>

        </NavLink>


        {/* AI ASSISTANT */}

        <NavLink
          to="/student/ai-assistant"
          className={({ isActive }) =>
            isActive
              ? "student-nav-link active"
              : "student-nav-link"
          }
        >

          <i className="fa-solid fa-robot"></i>

          <span>{t("aiAssistant")}</span>

        </NavLink>


        <div className="student-sidebar-divider" />


        {/* PROFILE */}

        <NavLink
          to="/student/profile"
          className={({ isActive }) =>
            isActive
              ? "student-nav-link active"
              : "student-nav-link"
          }
        >

          <i className="fa-solid fa-user"></i>

          <span>{t("profile")}</span>

        </NavLink>


        {/* SETTINGS */}

        <NavLink
          to="/student/settings"
          className={({ isActive }) =>
            isActive
              ? "student-nav-link active"
              : "student-nav-link"
          }
        >

          <i className="fa-solid fa-gear"></i>

          <span>{t("settings")}</span>

        </NavLink>


      </nav>


      {/* ======================================
          LOGOUT
      ====================================== */}

      <div className="student-sidebar-bottom">

        <button
          onClick={handleLogout}
          className="student-logout-button"
        >

          <i className="fa-solid fa-right-from-bracket"></i>

          <span>
  {t("logout")}
</span>

        </button>

      </div>


    </aside>

  );

};


export default StudentSidebar;