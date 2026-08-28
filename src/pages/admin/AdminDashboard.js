import {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  FaFileAlt,
  FaBell,
  FaUsers,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBook
} from "react-icons/fa";

import {
  useAuth
} from "../../context/AuthContext";

import {
  getAdminDashboard
} from "../../services/api";

import AdminNotificationBell
  from "../../components/AdminNotificationBell";

import "../../styles/AdminDashboard.css";


const AdminDashboard = () => {

  const navigate = useNavigate();


  const {
    token,
    user
  } = useAuth();


  const [dashboard, setDashboard] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  /*
  =====================================
  LOAD ADMIN DASHBOARD
  =====================================
  */

  useEffect(() => {

    const loadDashboard = async () => {

      try {

        setLoading(true);

        setError("");


        const data =
          await getAdminDashboard(token);


        setDashboard(data);


      } catch (error) {

        console.error(
          "Admin dashboard error:",
          error
        );


        setError(
          error.message ||
          "Unable to load admin dashboard."
        );


      } finally {

        setLoading(false);

      }

    };


    if (token) {

      loadDashboard();

    }

  }, [token]);


  /*
  =====================================
  PROFILE INFORMATION
  =====================================
  */

  const profileImage =
    user?.profileImage ||
    user?.avatar ||
    user?.photo ||
    user?.image ||
    "";


  const adminName =
    user?.name ||
    user?.fullName ||
    "Admin";


  /*
  =====================================
  LOADING
  =====================================
  */

  if (loading) {

    return (

      <div className="admin-dashboard-page">

        <div className="admin-dashboard-loading">

          Loading dashboard...

        </div>

      </div>

    );

  }


  /*
  =====================================
  ERROR
  =====================================
  */

  if (error) {

    return (

      <div className="admin-dashboard-page">

        <div className="admin-dashboard-error">

          {error}

        </div>

      </div>

    );

  }


  /*
  =====================================
  STATISTICS
  =====================================
  */

  const stats =
  dashboard?.stats || {};


const totalUsers =
  Number(
    stats.totalUsers || 0
  );


const totalStudents =
  Number(
    stats.totalStudents || 0
  );


const totalInstructors =
  Number(
    stats.totalInstructors || 0
  );


const totalCourses =
  Number(
    stats.totalCourses || 0
  );


const totalEnrollments =
  Number(
    stats.totalEnrollments || 0
  );


const totalCertificates =
  Number(
    stats.totalCertificates || 0
  );
  /*
  =====================================
  REAL CHART DATA
  =====================================
  */

  const usersOverview =
    dashboard?.usersOverview ||
    dashboard?.userOverview ||
    dashboard?.monthlyUsers ||
    [];


  const coursesByCategory =
    dashboard?.coursesByCategory ||
    dashboard?.categoryStats ||
    [];


  return (

    <div className="admin-dashboard-page">


      {/* =====================================
          TOP HEADER
      ===================================== */}

      <header className="admin-dashboard-topbar">


        {/* WELCOME */}

        <div className="admin-welcome">

          <h1>
            Welcome back, {adminName}!
          </h1>

        </div>


        {/* HEADER ACTIONS */}

        <div className="admin-dashboard-actions">


          {/* DOCUMENT */}

          <button
            type="button"
            className="admin-action-button"
            title="Documents"
            onClick={() =>
              navigate(
                "/admin/notifications"
              )
            }
          >

            <FaFileAlt />

          </button>


          {/* NOTIFICATION */}

          <AdminNotificationBell />


          {/* ALERT */}

          <button
            type="button"
            className="admin-action-button"
            title="Alerts"
          >

            <FaBell />

          </button>


          {/* PROFILE */}

          <button
            type="button"
            className="admin-profile-button"
            title="Admin Profile"
            onClick={() =>
              navigate(
                "/profile"
              )
            }
          >

            <div className="admin-profile">

              {profileImage ? (

                <img
                  src={profileImage}
                  alt={adminName}
                  className="admin-profile-image"
                />

              ) : (

                <div className="admin-profile-fallback">

                  {adminName
                    ?.charAt(0)
                    ?.toUpperCase()}

                </div>

              )}

            </div>

          </button>


        </div>

      </header>



      {/* =====================================
          OVERVIEW
      ===================================== */}

      <section className="admin-overview-section">


        <h2>
          Overview
        </h2>


        <div className="admin-overview-grid">


          {/* =================================
              USERS
          ================================= */}

          <div className="admin-overview-card">

            <div className="admin-overview-icon users">

              <FaUsers />

            </div>


            <div className="admin-overview-content">

              <span>
                Users
              </span>

              <strong>
                {totalUsers.toLocaleString()}
              </strong>

            </div>

          </div>



          {/* =================================
              STUDENTS
          ================================= */}

          <div className="admin-overview-card">

            <div className="admin-overview-icon students">

              <FaUserGraduate />

            </div>


            <div className="admin-overview-content">

              <span>
                Students
              </span>

              <strong>
                {totalStudents.toLocaleString()}
              </strong>

            </div>

          </div>



          {/* =================================
              INSTRUCTORS
          ================================= */}

          <div className="admin-overview-card">

            <div className="admin-overview-icon instructors">

              <FaChalkboardTeacher />

            </div>


            <div className="admin-overview-content">

              <span>
                Instructors
              </span>

              <strong>
                {totalInstructors.toLocaleString()}
              </strong>

            </div>

          </div>



          {/* =================================
              COURSES
          ================================= */}

          <div className="admin-overview-card">

            <div className="admin-overview-icon courses">

              <FaBook />

            </div>


            <div className="admin-overview-content">

              <span>
                Courses
              </span>

              <strong>
                {totalCourses.toLocaleString()}
              </strong>

            </div>

          </div>


        </div>

      </section>



      {/* =====================================
          CHARTS
      ===================================== */}

      <section className="admin-chart-section">


        {/* ===================================
            USERS OVERVIEW
        =================================== */}

        <div className="admin-chart-card users-chart-card">


          <div className="admin-chart-heading">

            <div>

              <span className="admin-chart-label">
                USER ACTIVITY
              </span>

              <h2>
                Users Overview
              </h2>

            </div>

          </div>


          <UsersChart
            data={usersOverview}
          />

        </div>



        {/* ===================================
            COURSES BY CATEGORY
        =================================== */}

        <div className="admin-chart-card category-chart-card">


          <div className="admin-chart-heading">

            <div>

              <span className="admin-chart-label">
                COURSE DISTRIBUTION
              </span>

              <h2>
                Courses by Category
              </h2>

            </div>

          </div>


          <CategoryChart
            data={coursesByCategory}
          />

        </div>


      </section>


    </div>

  );

};


/*
=========================================
USERS LINE CHART
=========================================
*/

const UsersChart = ({
  data
}) => {


  if (
    !data ||
    data.length === 0
  ) {

    return (

      <div className="admin-chart-empty">

        <span>
          No user overview data available.
        </span>

      </div>

    );

  }


  const width = 600;

  const height = 300;

  const paddingLeft = 48;

  const paddingRight = 20;

  const paddingTop = 20;

  const paddingBottom = 42;


  const chartWidth =
    width -
    paddingLeft -
    paddingRight;


  const chartHeight =
    height -
    paddingTop -
    paddingBottom;


  /*
  -----------------------------------------
  CONVERT BACKEND VALUES TO NUMBERS
  -----------------------------------------
  */

  const values =
    data.map(
      item =>
        Number(
          item.value ??
          item.count ??
          item.users ??
          item.total ??
          0
        )
    );


  /*
  -----------------------------------------
  MAXIMUM VALUE
  -----------------------------------------
  */

  const maxValue =
    Math.max(
      ...values,
      1
    );


  /*
  -----------------------------------------
  POINTS
  -----------------------------------------
  */

  const points =
    values.map(
      (value, index) => {

        const x =
          paddingLeft +
          (
            index /
            Math.max(
              values.length - 1,
              1
            )
          ) *
          chartWidth;


        const y =
          paddingTop +
          chartHeight -
          (
            value /
            maxValue
          ) *
          chartHeight;


        return {
          x,
          y,
          value
        };

      }
    );


  /*
  -----------------------------------------
  LINE
  -----------------------------------------
  */

  const linePoints =
    points
      .map(
        point =>
          `${point.x},${point.y}`
      )
      .join(" ");


  return (

    <div className="admin-line-chart">

      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
      >


        {/* =================================
            GRID
        ================================= */}

        {[0, 1, 2, 3, 4].map(
          (line) => {

            const y =
              paddingTop +
              (
                line / 4
              ) *
              chartHeight;


            return (

              <line
                key={line}
                x1={paddingLeft}
                y1={y}
                x2={
                  width -
                  paddingRight
                }
                y2={y}
                className="chart-grid-line"
              />

            );

          }
        )}



        {/* =================================
            LINE
        ================================= */}

        <polyline
          points={linePoints}
          fill="none"
          className="chart-line"
        />



        {/* =================================
            POINTS
        ================================= */}

        {points.map(
          (point, index) => (

            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="4"
              className="chart-point"
            />

          )
        )}



        {/* =================================
            X LABELS
        ================================= */}

        {data.map(
          (item, index) => {

            const x =
              paddingLeft +
              (
                index /
                Math.max(
                  data.length - 1,
                  1
                )
              ) *
              chartWidth;


            const label =
              item.label ||
              item.month ||
              item.name ||
              "";


            return (

              <text
                key={index}
                x={x}
                y={height - 12}
                textAnchor="middle"
                className="chart-label"
              >

                {label}

              </text>

            );

          }
        )}


      </svg>

    </div>

  );

};



/*
=========================================
CATEGORY DONUT CHART
=========================================
*/

const CategoryChart = ({
  data
}) => {


  if (
    !data ||
    data.length === 0
  ) {

    return (

      <div className="admin-category-empty">

        <div className="admin-empty-donut">

          <span>
            No data
          </span>

        </div>

        <p>
          No course category data available.
        </p>

      </div>

    );

  }


  /*
  -----------------------------------------
  TOTAL COURSES
  -----------------------------------------
  */

  const total =
    data.reduce(
      (sum, item) =>
        sum +
        Number(
          item.value ??
          item.count ??
          item.total ??
          0
        ),
      0
    );


  /*
  -----------------------------------------
  COLORS
  -----------------------------------------
  */

  const colors = [
    "#4f63c6",
    "#2d9cdb",
    "#f2b01e",
    "#d95362",
    "#7657c8",
    "#3ba76d"
  ];


  /*
  -----------------------------------------
  DONUT
  -----------------------------------------
  */

  const radius = 80;

  const circumference =
    2 *
    Math.PI *
    radius;


  let currentOffset = 0;


  return (

    <div className="admin-category-chart">


      {/* =================================
          DONUT
      ================================= */}

      <div className="admin-donut-wrapper">

        <svg
          viewBox="0 0 220 220"
          className="admin-donut"
        >


          {/* BACKGROUND */}

          <circle
            cx="110"
            cy="110"
            r={radius}
            className="donut-background"
          />



          {/* SEGMENTS */}

          {data.map(
            (item, index) => {

              const value =
                Number(
                  item.value ??
                  item.count ??
                  item.total ??
                  0
                );


              const percentage =
                total > 0
                  ? value / total
                  : 0;


              const segmentLength =
                percentage *
                circumference;


              const segmentOffset =
                -currentOffset *
                circumference;


              currentOffset +=
                percentage;


              return (

                <circle
                  key={index}
                  cx="110"
                  cy="110"
                  r={radius}
                  className="donut-segment"
                  stroke={
                    colors[
                      index %
                      colors.length
                    ]
                  }
                  strokeDasharray={
                    `${segmentLength} ${circumference}`
                  }
                  strokeDashoffset={
                    segmentOffset
                  }
                />

              );

            }
          )}



          {/* CENTER TOTAL */}

          <text
            x="110"
            y="106"
            textAnchor="middle"
            className="donut-total"
          >

            {total}

          </text>


          <text
            x="110"
            y="127"
            textAnchor="middle"
            className="donut-total-label"
          >

            Courses

          </text>


        </svg>

      </div>



      {/* =================================
          LEGEND
      ================================= */}

      <div className="admin-category-legend">

        {data.map(
          (item, index) => {

            const label =
              item.label ||
              item.category ||
              item.name ||
              "Other";


            const value =
              Number(
                item.value ??
                item.count ??
                item.total ??
                0
              );


            const percentage =
              total > 0
                ? Math.round(
                    (
                      value /
                      total
                    ) * 100
                  )
                : 0;


            return (

              <div
                className="admin-legend-item"
                key={index}
              >


                <span
                  className="admin-legend-dot"
                  style={{
                    background:
                      colors[
                        index %
                        colors.length
                      ]
                  }}
                />


                <span className="admin-legend-label">

                  {label}

                </span>


                <strong>

                  {value}

                </strong>


                <small>

                  {percentage}%

                </small>


              </div>

            );

          }
        )}

      </div>


    </div>

  );

};


export default AdminDashboard;