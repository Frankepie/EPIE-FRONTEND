import {
  useEffect,
  useState
} from "react";

import {
  Outlet,
  useLocation
} from "react-router-dom";

import {
  FaBars
} from "react-icons/fa";

import StudentSidebar
  from "../../components/StudentSidebar";

import StudentBottomNav
  from "../../components/StudentBottomNav";

import "./StudentDashboardLayout.css";


const StudentDashboardLayout = () => {

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const location = useLocation();


  /*
  =========================================
  CLOSE MOBILE MENU AFTER NAVIGATION
  =========================================
  */

  useEffect(() => {

    setMobileMenuOpen(false);

  }, [location.pathname]);


  /*
  =========================================
  TOGGLE MOBILE MENU
  =========================================
  */

  const handleMenuToggle = () => {

    setMobileMenuOpen(
      previous => !previous
    );

  };


  /*
  =========================================
  CLOSE MOBILE MENU
  =========================================
  */

  const handleCloseMenu = () => {

    setMobileMenuOpen(false);

  };


  return (

    <div
      className={
        mobileMenuOpen
          ? "student-dashboard-layout mobile-menu-open"
          : "student-dashboard-layout"
      }
    >


      {/* =====================================
          STUDENT SIDEBAR

          DESKTOP
          Always visible

          MOBILE
          Slide-out drawer
      ===================================== */}

      <StudentSidebar />


      {/* =====================================
          MOBILE OVERLAY
      ===================================== */}

      {mobileMenuOpen && (

        <div
          className="student-mobile-overlay"
          onClick={handleCloseMenu}
          aria-hidden="true"
        />

      )}


      {/* =====================================
          MAIN CONTENT
      ===================================== */}

      <main className="student-dashboard-main">


        {/* ===================================
            MOBILE HEADER
        =================================== */}

        <div className="student-mobile-header">


          <button
            type="button"
            className="student-mobile-menu-button"
            onClick={handleMenuToggle}
            aria-label={
              mobileMenuOpen
                ? "Close navigation"
                : "Open navigation"
            }
            aria-expanded={mobileMenuOpen}
          >

            <FaBars />

          </button>


          <span className="student-mobile-header-title">
            EduLearn
          </span>


        </div>


        {/* ===================================
            PAGE CONTENT
        =================================== */}

        <Outlet />


      </main>


      {/* =====================================
          MOBILE BOTTOM NAVIGATION

          Hidden automatically on desktop
          Visible automatically on mobile
      ===================================== */}

      <StudentBottomNav />


    </div>

  );

};


export default StudentDashboardLayout;