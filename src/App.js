import {
  useEffect,
  useState
} from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import SplashScreen from "./pages/SplashScreen";

import Dashboard from "./pages/Dashboard";
import StudentDashboard from "./pages/student/StudentDashboard";
import InstructorDashboard from "./pages/instructor/InstructorDashboard";

import ProtectedRoute from "./components/ProtectedRoute";


import Profile from "./pages/Profile";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";

import MyCourses from "./pages/student/MyCourses";
import InstructorCourses from "./pages/instructor/InstructorCourses";

import CreateCourse from "./pages/instructor/CreateCourse";
import EditCourse from "./pages/instructor/EditCourse";

import CourseModules from "./pages/instructor/CourseModules";
import LessonManager from "./pages/instructor/LessonManager";
import LessonViewer from "./pages/student/LessonViewer";
import StudentProgress from "./pages/student/StudentProgress";

import GreetingOne from "./pages/GreetingOne";
import GreetingTwo from "./pages/GreetingTwo";
// import IntroRedirect from "./pages/IntroRedirect";

// import Certificates from "./pages/student/Certificates";
import CertificateDetails from "./pages/student/CertificateDetails";
import MyCertificates from "./pages/student/MyCertificates";
import CertificateVerification from "./pages/CertificateVerification";
import InstructorAssignmentSubmissions from "./pages/instructor/InstructorAssignmentSubmissions";

import CreateAssignment from "./pages/instructor/CreateAssignment";
import InstructorAssignments from "./pages/instructor/InstructorAssignments";
import EditAssignment from "./pages/instructor/EditAssignment";

import StudentAssignments from "./pages/student/StudentAssignments";
import StudentAssignmentDetails from "./pages/student/StudentAssignmentDetails";

import StudentDashboardLayout from "./pages/student/StudentDashboardLayout";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";

import InstructorLessons from "./pages/instructor/InstructorLessons";
import InstructorStudents from "./pages/instructor/InstructorStudents";
import MyBookmarks from "./pages/student/MyBookmarks";
import StudentDiscussions from "./pages/student/StudentDiscussions";
import CreateDiscussion from "./pages/student/CreateDiscussion";

import AdminDashboardLayout from "./pages/admin/AdminDashboardLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";

import AIAssistant from "./components/ai/AIAssistant";
import VerifyOTP  from "./pages/auth/VerifyOTP";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import "./App.css";
import BackButton from "./components/BackButton";
import CourseCommunication from "./pages/student/CourseCommunication";

import InstructorDashboardLayout  from "./pages/instructor/InstructorDashboardLayout";
import StudentProfile from "./pages/student/StudentProfile";
import {LanguageProvider} from "./context/LanguageContext";
// import LaunchRouter from "./pages/LaunchRouter";
import PopularCourses from "./pages/student/PopularCourses";

// ==========================================
// LAUNCH ROUTER
// ==========================================

const LaunchRouter = () => {

  const [isMobile, setIsMobile] = useState(
    window.innerWidth <= 768
  );

  useEffect(() => {

    const handleResize = () => {

      setIsMobile(
        window.innerWidth <= 768
      );

    };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );
    };

  }, []);


  if (isMobile) {

    return (
      <Navigate
        to="/splash"
        replace
      />
    );

  }


  return (
    <Navigate
      to="/greeting-one"
      replace
    />
  );

};
function App() {

  return (
<BrowserRouter>

  <AuthProvider>

    <LanguageProvider>
         <BackButton />
      <Routes>

          {/* =====================================
    MAIN HOME PAGE
===================================== */}

<Route
  path="/"
  element={<LaunchRouter />}
/>
<Route
  path="/home"
  element={<Home />}
/>
<Route
  path="/greeting-one"
  element={<GreetingOne />}
/>

<Route
  path="/greeting-two"
  element={<GreetingTwo />}
/>

<Route
  path="/splash"
  element={<SplashScreen />}
/>

            {/* AUTH */}

            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/register"
              element={<Register />}
            />

<Route
  path="/verify-otp"
  element={<VerifyOTP />}
/>
<Route
  path="/forgot-password"
  element={<ForgotPassword />}
/>

<Route
  path="/verify-otp"
  element={<VerifyOTP />}
/>

<Route
  path="/reset-password"
  element={<ResetPassword />}
/>
            {/* GENERAL DASHBOARD */}

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

{/* =================================
    INSTRUCTOR SECTION
================================= */}

<Route
  path="/instructor"
  element={
    <ProtectedRoute>
      <InstructorDashboardLayout />
    </ProtectedRoute>
  }
>

  {/* /instructor → /instructor/dashboard */}

  <Route
    index
    element={
      <Navigate
        to="dashboard"
        replace
      />
    }
  />


  {/* =================================
      INSTRUCTOR DASHBOARD
  ================================= */}

  <Route
    path="dashboard"
    element={
      <InstructorDashboard />
    }
  />


  {/* =================================
      INSTRUCTOR COURSES
  ================================= */}

  <Route
    path="courses"
    element={
      <InstructorCourses />
    }
  />


  {/* =================================
      CREATE COURSE
  ================================= */}

  <Route
    path="courses/create"
    element={
      <CreateCourse />
    }
  />


  {/* =================================
      EDIT COURSE
  ================================= */}

  <Route
    path="courses/edit/:id"
    element={
      <EditCourse />
    }
  />


  {/* =================================
      COURSE MODULES
  ================================= */}

  <Route
    path="courses/:courseId/modules"
    element={
      <CourseModules />
    }
  />


  {/* =================================
      LESSON MANAGER
  ================================= */}

  <Route
    path="modules/:moduleId/lessons"
    element={
      <LessonManager />
    }
  />


  {/* =================================
      INSTRUCTOR LESSONS
  ================================= */}

  <Route
    path="lessons"
    element={
      <InstructorLessons />
    }
  />


  {/* =================================
      STUDENTS
  ================================= */}

  <Route
    path="students"
    element={
      <InstructorStudents />
    }
  />


  {/* =================================
      ASSIGNMENTS
  ================================= */}

  <Route
    path="assignments"
    element={
      <InstructorAssignments />
    }
  />


  {/* =================================
      CREATE ASSIGNMENT
  ================================= */}

  <Route
    path="courses/:courseId/assignments/create"
    element={
      <CreateAssignment />
    }
  />


  {/* =================================
      EDIT ASSIGNMENT
  ================================= */}

  <Route
    path="assignments/edit/:id"
    element={
      <EditAssignment />
    }
  />


  {/* =================================
      ASSIGNMENT SUBMISSIONS
  ================================= */}

  <Route
    path="assignments/:assignmentId/submissions"
    element={
      <InstructorAssignmentSubmissions />
    }
  />


  {/* =================================
      DISCUSSIONS
  ================================= */}

  <Route
    path="discussions"
    element={
      <div>
        Instructor Discussions
      </div>
    }
  />


  {/* =================================
      EARNINGS
  ================================= */}

  <Route
    path="earnings"
    element={
      <div>
        Instructor Earnings
      </div>
    }
  />


  {/* =================================
      PROFILE
  ================================= */}

  <Route
    path="profile"
    element={
      <Profile />
    }
  />


  {/* =================================
      SETTINGS
  ================================= */}

  <Route
    path="settings"
    element={
      <Settings />
    }
  />

</Route>
   {/* =================================
    STUDENT PROFILE
================================= */}

<Route
  path="profile"
  element={
    <StudentProfile />
  }
/> 
            {/* =================================
                GENERAL PAGES
            ================================= */}

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
      

            <Route
              path="/courses"
              element={<Courses />}
            />

            <Route
              path="/courses/:id"
              element={<CourseDetails />}
            />

            <Route
              path="/my-courses"
              element={
                <ProtectedRoute>
                  <MyCourses />
                </ProtectedRoute>
              }
            />



            {/* =================================
                CERTIFICATES
            ================================= */}

            <Route
              path="/certificates/:certificateId"
              element={
                <ProtectedRoute>
                  <CertificateDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/my-certificates"
              element={
                <ProtectedRoute>
                  <MyCertificates />
                </ProtectedRoute>
              }
            />
  

            <Route
              path="/verify-certificate"
              element={<CertificateVerification />}
            />

  
{/* =====================================
    ADMIN SECTION
===================================== */}

<Route
  path="/admin"
  element={
    <ProtectedRoute role="admin">
      <AdminDashboardLayout />
    </ProtectedRoute>
  }
>

  {/* /admin → /admin/dashboard */}

  <Route
    index
    element={
      <Navigate
        to="dashboard"
        replace
      />
    }
  />

  {/* ADMIN DASHBOARD */}

  <Route
    path="dashboard"
    element={
      <AdminDashboard />
    }
  />

  {/* ADMIN USERS */}

  <Route
  path="users"
  element={
    <AdminUsers />
  }
/>

  {/* ADMIN STUDENTS */}

  <Route
    path="students"
    element={
      <div>
        Students
      </div>
    }
  />

  {/* ADMIN INSTRUCTORS */}

  <Route
    path="instructors"
    element={
      <div>
        Instructors
      </div>
    }
  />

  {/* ADMIN COURSES */}

  <Route
    path="courses"
    element={
      <div>
        Courses
      </div>
    }
  />

  {/* ADMIN ENROLLMENTS */}

  <Route
    path="enrollments"
    element={
      <div>
        Enrollments
      </div>
    }
  />

  {/* ADMIN ASSIGNMENTS */}

  <Route
    path="assignments"
    element={
      <div>
        Assignments
      </div>
    }
  />

  {/* ADMIN QUIZZES */}

  <Route
    path="quizzes"
    element={
      <div>
        Quizzes
      </div>
    }
  />

  {/* ADMIN CERTIFICATES */}

  <Route
    path="certificates"
    element={
      <div>
        Certificates
      </div>
    }
  />

  {/* ADMIN REPORTS */}

  <Route
    path="reports"
    element={
      <div>
        Reports
      </div>
    }
  />

  {/* ADMIN NOTIFICATIONS */}

  <Route
    path="notifications"
    element={
      <div>
        Notifications
      </div>
    }
  />

  {/* ADMIN SETTINGS */}

  <Route
    path="settings"
    element={
      <div>
        Settings
      </div>
    }
  />

</Route>

          <Route
            path="/student"
            element={
              <ProtectedRoute>
                <StudentDashboardLayout />
              </ProtectedRoute>
            }
          >

          <Route
  path="bookmarks"
  element={<MyBookmarks />}
/>
<Route
  path="ai-assistant"
  element={<AIAssistant />}
/>

<Route
  path="courses/:courseId/communication"
  element={
    <CourseCommunication />
  }
/>
            {/* /student → /student/dashboard */}

            <Route
              index
              element={
                <Navigate
                  to="dashboard"
                  replace
                />
              }
            />


            {/* DASHBOARD */}

            <Route
              path="dashboard"
              element={<StudentDashboard />}
            />


            {/* MY COURSES */}

            <Route
              path="courses"
              element={<MyCourses />}
            />
       {/* POPULAR COURSES */}

  <Route
    path="popular-courses"
    element={<PopularCourses />}
  />      
{/* COURSE DETAILS */}

<Route
  path="courses/:id"
  element={
    <CourseDetails />
  }
/>
{/* LESSON VIEWER */}

<Route
  path="modules/:moduleId/lessons"
  element={<LessonViewer />}
/>

            {/* ASSIGNMENTS */}

            <Route
              path="assignments"
              element={<StudentAssignments />}
            />

            <Route
              path="assignments/:assignmentId"
              element={
                <StudentAssignmentDetails />
              }
            />


            {/* PROGRESS */}

            <Route
              path="progress"
              element={<StudentProgress />}
            />


            {/* CERTIFICATES */}

            <Route
              path="certificates"
              element={<MyCertificates />}
            />
             
             <Route
  path="settings"
  element={<Settings />}
/>
      <Route
  path="notifications"
  element={<Notifications />}
/>
<Route
  path="discussions"
  element={<StudentDiscussions />}
/>

<Route
  path="discussions/create"
  element={<CreateDiscussion />}
/>
          </Route>


          {/* =====================================
              OLD STUDENT DASHBOARD URL
              Redirect to new dashboard
          ===================================== */}

          <Route
            path="/student-dashboard"
            element={
              <Navigate
                to="/student/dashboard"
                replace
              />
            }
          />


          {/* =====================================
              OLD STUDENT PROGRESS URL
          ===================================== */}

          <Route
            path="/student/progress"
            element={
              <Navigate
                to="/student/progress"
                replace
              />
            }
          />


          {/* =====================================
              OLD STUDENT CERTIFICATE URL
          ===================================== */}

          <Route
            path="/student/certificates"
            element={
              <Navigate
                to="/student/certificates"
                replace
              />
            }
          />


          {/* =====================================
              OLD STUDENT ASSIGNMENT URL
          ===================================== */}

          <Route
            path="/student/assignments"
            element={
              <Navigate
                to="/student/assignments"
                replace
              />
            }
          />

          <Route
  path="/instructor/students"
  element={
    <ProtectedRoute>
      <InstructorStudents />
    </ProtectedRoute>
  }
/>


            </Routes>

    </LanguageProvider>

  </AuthProvider>

</BrowserRouter>
  );
}

export default App;