import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaUsers,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBookOpen,
  FaUserPlus
} from "react-icons/fa";
import "../styles/StudentSidebar.css";


const StudentSidebar = () => {

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


        <NavLink
          to="/student/dashboard"
          className={({ isActive }) =>
            isActive
              ? "student-nav-link active"
              : "student-nav-link"
          }
        >
          <i class="fa-regular fa-house"></i>
          <span>Dashboard</span>
        </NavLink>


        <NavLink
          to="/student/courses"
          className={({ isActive }) =>
            isActive
              ? "student-nav-link active"
              : "student-nav-link"
          }
        >
          <i className="fa-solid fa-book"></i>
          <span>My Courses</span>
        </NavLink>


        <NavLink
         to="/student/assignments"
          className={({ isActive }) =>
            isActive
              ? "student-nav-link active"
              : "student-nav-link"
          }
        >
          <span>📝</span>
          <span>Assignments</span>
        </NavLink>


        <NavLink
          to="/student/progress"
          className={({ isActive }) =>
            isActive
              ? "student-nav-link active"
              : "student-nav-link"
          }
        >
          <i className="fa-solid fa-bars-progress"></i>
          <span>My Progress</span>
        </NavLink>


        <NavLink
            to="/student/certificates"
          className={({ isActive }) =>
            isActive
              ? "student-nav-link active"
              : "student-nav-link"
          }
        >
          <span><i className="fa-regular fa-trophy-star"></i></span>
          <span>Certificates</span>
        </NavLink>

<NavLink
  to="/student/bookmarks"
  className={({ isActive }) =>
    isActive
      ? "student-nav-link active"
      : "student-nav-link"
  }
>
  <span><i className="fa-solid fa-bookmark"></i></span>
  <span>Bookmarks</span>
</NavLink>
        <NavLink to="/student/notifications"
          className={({ isActive }) =>
            isActive
              ? "student-nav-link active"
              : "student-nav-link"
          }
        >
          <span><i class="fa-solid fa-bell fa-shake"></i></span>
          <span>Notifications</span>
        </NavLink>


       <NavLink
  to="/student/discussions"
  className={({ isActive }) =>
    isActive
      ? "student-nav-link active"
      : "student-nav-link"
  }
>
  <span><i className="fa-solid fa-message fa-flip"></i></span>
  <span>Discussions</span>
</NavLink>

<NavLink
  to="/student/ai-assistant"
  className={({ isActive }) =>
    isActive
      ? "student-nav-link active"
      : "student-nav-link"
  }
>
  <span>
    <i className="fa-solid fa-robot"></i>
  </span>

  <span>
    AI Assistant
  </span>
</NavLink>
        <div className="student-sidebar-divider" />


        <NavLink
          to="/profile"
          className={({ isActive }) =>
            isActive
              ? "student-nav-link active"
              : "student-nav-link"
          }
        >
          <span><i class="fa-solid fa-user fa-beat-fade"></i></span>
          <span>Profile</span>
        </NavLink>


        <NavLink
          to="/student/settings"
          className={({ isActive }) =>
            isActive
              ? "student-nav-link active"
              : "student-nav-link"
          }
        >
          <span>⚙️</span>
          <span>Settings</span>
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

          <span>
            <i class="fa-solid fa-door-open"></i>
          </span>

          <span>
            Logout
          </span>

        </button>

      </div>


    </aside>

  );

};


export default StudentSidebar;