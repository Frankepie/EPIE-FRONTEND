import { useState } from "react";
import { Outlet } from "react-router-dom";
import { FaBars } from "react-icons/fa";

import InstructorSidebar from "../../components/InstructorSidebar";
import InstructorBottomNav from "../../components/InstructorBottomNav";

import "../../styles/InstructorDashboardLayout.css";

const InstructorDashboardLayout = () => {

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const handleMenuToggle = () => {
    setMobileMenuOpen(
      previous => !previous
    );
  };

  const handleCloseMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div
      className={
        mobileMenuOpen
          ? "instructor-dashboard-layout mobile-menu-open"
          : "instructor-dashboard-layout"
      }
    >

      <InstructorSidebar />

      {mobileMenuOpen && (
        <div
          className="instructor-mobile-overlay"
          onClick={handleCloseMenu}
          aria-hidden="true"
        />
      )}

      <main className="instructor-dashboard-main">

        <div className="instructor-mobile-header">

          <button
            type="button"
            className="instructor-mobile-menu-button"
            onClick={handleMenuToggle}
            aria-label={
              mobileMenuOpen
                ? "Close navigation"
                : "Open navigation"
            }
          >
            <FaBars />
          </button>

          <span className="instructor-mobile-header-title">
            EduLearn
          </span>

        </div>

        <Outlet />

      </main>

      <InstructorBottomNav />

    </div>
  );
};

export default InstructorDashboardLayout;