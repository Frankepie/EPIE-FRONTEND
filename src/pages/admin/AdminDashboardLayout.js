import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

import {
  FaBars,
  FaTachometerAlt,
  FaUsers,
  FaBook,
  FaBell,
  FaEllipsisH,
  FaTimes
} from "react-icons/fa";

import AdminSidebar from "../../components/AdminSidebar";

import "../../styles/AdminDashboardLayout.css";


const AdminDashboardLayout = () => {

  const [sidebarOpen, setSidebarOpen] = useState(false);


  // =====================================
  // CLOSE MOBILE SIDEBAR
  // =====================================

  const closeSidebar = () => {
    setSidebarOpen(false);
  };


  // =====================================
  // BOTTOM NAVIGATION
  // =====================================

  const bottomNavItems = [

    {
      path: "/admin/dashboard",
      label: "Home",
      icon: <FaTachometerAlt />
    },

    {
      path: "/admin/users",
      label: "Users",
      icon: <FaUsers />
    },

    {
      path: "/admin/courses",
      label: "Courses",
      icon: <FaBook />
    },

    {
      path: "/admin/notifications",
      label: "Alerts",
      icon: <FaBell />
    }

  ];


  return (

    <div className="admin-dashboard-layout">


      {/* =====================================
          MOBILE TOP BAR
      ===================================== */}

      <header className="admin-mobile-header">

        <button
          type="button"
          className="admin-mobile-menu-button"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open admin menu"
        >

          <FaBars />

        </button>


        <div className="admin-mobile-title">

          <span className="admin-mobile-title-icon">
            <FaTachometerAlt />
          </span>

          <span>
            Admin Panel
          </span>

        </div>


      </header>


      {/* =====================================
          MOBILE OVERLAY
      ===================================== */}

      {sidebarOpen && (

        <div
          className="admin-sidebar-overlay"
          onClick={closeSidebar}
        />

      )}


      {/* =====================================
          SIDEBAR
      ===================================== */}

      <div
        className={
          sidebarOpen
            ? "admin-sidebar-wrapper mobile-open"
            : "admin-sidebar-wrapper"
        }
      >

        {/* MOBILE CLOSE BUTTON */}

        <button
          type="button"
          className="admin-mobile-close-button"
          onClick={closeSidebar}
          aria-label="Close admin menu"
        >

          <FaTimes />

        </button>


        <AdminSidebar />

      </div>


      {/* =====================================
          MAIN CONTENT
      ===================================== */}

      <main className="admin-dashboard-main">

        <Outlet />

      </main>


      {/* =====================================
          MOBILE BOTTOM NAVIGATION
      ===================================== */}

      <nav className="admin-mobile-bottom-nav">


        {bottomNavItems.map((item) => (

          <NavLink
            key={item.path}
            to={item.path}
            onClick={closeSidebar}
            className={({ isActive }) =>
              isActive
                ? "admin-bottom-nav-item active"
                : "admin-bottom-nav-item"
            }
          >

            <span className="admin-bottom-nav-icon">

              {item.icon}

            </span>

            <span className="admin-bottom-nav-label">

              {item.label}

            </span>

          </NavLink>

        ))}


        {/* MORE */}

        <button
          type="button"
          className="admin-bottom-nav-item admin-bottom-more"
          onClick={() => setSidebarOpen(true)}
        >

          <span className="admin-bottom-nav-icon">

            <FaEllipsisH />

          </span>

          <span className="admin-bottom-nav-label">

            More

          </span>

        </button>


      </nav>


    </div>

  );

};


export default AdminDashboardLayout;