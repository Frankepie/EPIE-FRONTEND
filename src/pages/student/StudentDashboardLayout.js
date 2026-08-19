import { Outlet } from "react-router-dom";

import StudentSidebar from "../../components/StudentSidebar";

import "./StudentDashboardLayout.css";


const StudentDashboardLayout = () => {

  return (

    <div className="student-dashboard-layout">

      <StudentSidebar />

      <main className="student-dashboard-main">

        <Outlet />

      </main>

    </div>

  );

};


export default StudentDashboardLayout;