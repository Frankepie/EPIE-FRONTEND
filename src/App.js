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

import CourseCommunication from "./pages/student/CourseCommunication";


function App() {

  return (

    <BrowserRouter>

      <AuthProvider>

        <Routes>


          {/* =====================================
    MAIN HOME PAGE
===================================== */}

<Route
  path="/"
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
                INSTRUCTOR
            ================================= */}

            <Route
              path="/instructor-dashboard"
              element={
                <ProtectedRoute>
                  <InstructorDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/instructor/courses"
              element={
                <ProtectedRoute>
                  <InstructorCourses />
                </ProtectedRoute>
              }
            />

            <Route
              path="/instructor/courses/create"
              element={
                <ProtectedRoute>
                  <CreateCourse />
                </ProtectedRoute>
              }
            />

            <Route
              path="/instructor/courses/edit/:id"
              element={
                <ProtectedRoute>
                  <EditCourse />
                </ProtectedRoute>
              }
            />

            <Route
              path="/instructor/courses/:courseId/modules"
              element={
                <ProtectedRoute>
                  <CourseModules />
                </ProtectedRoute>
              }
            />

 <Route
  path="/instructor/modules/:moduleId/lessons"
  element={
    <ProtectedRoute>
      <LessonManager />
    </ProtectedRoute>
  }
/>
<Route
  path="/instructor/lessons"
  element={
    <ProtectedRoute>
      <InstructorLessons />
    </ProtectedRoute>
  }
/>

            <Route
              path="/instructor/courses/:courseId/assignments/create"
              element={
                <ProtectedRoute>
                  <CreateAssignment />
                </ProtectedRoute>
              }
            />

           <Route
  path="/instructor/assignments"
  element={
    <ProtectedRoute>
      <InstructorAssignments />
    </ProtectedRoute>
  }
/>
            <Route
              path="/instructor/assignments/edit/:id"
              element={
                <ProtectedRoute>
                  <EditAssignment />
                </ProtectedRoute>
              }
            />
<Route
  path="/instructor/assignments/:assignmentId/submissions"
  element={
    <ProtectedRoute>
      <InstructorAssignmentSubmissions />
    </ProtectedRoute>
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

      </AuthProvider>

    </BrowserRouter>
  );
}

export default App;