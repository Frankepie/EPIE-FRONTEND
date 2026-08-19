import { Outlet } from "react-router-dom";
import React from "react";
import AdminSidebar from "../../components/AdminSidebar";

import "../../styles/AdminDashboardLayout.css";


const AdminDashboardLayout = () => {

  return (

    <div className="admin-dashboard-layout">

      <AdminSidebar />

      <main className="admin-dashboard-main">

        <Outlet />

      </main>

    </div>

  );

};


export default AdminDashboardLayout;