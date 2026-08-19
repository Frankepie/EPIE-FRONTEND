import { useAuth } from "../context/AuthContext";
import "../styles/Settings.css";

const Settings = () => {

  const { user } = useAuth();

  return (

    <div className="settings-page">

      <div className="settings-header">

        <p>
          Student Area
        </p>

        <h1>
          Settings
        </h1>

        <span>
          Manage your account and learning preferences.
        </span>

      </div>


      <div className="settings-container">


        {/* ======================================
            ACCOUNT SETTINGS
        ====================================== */}

        <div className="settings-card">

          <div className="settings-card-header">

            <div className="settings-icon">
              👤
            </div>

            <div>

              <h2>
                Account
              </h2>

              <p>
                Your account information
              </p>

            </div>

          </div>


          <div className="settings-row">

            <div>

              <span>
                Full Name
              </span>

              <strong>
                {user?.fullName ||
                  user?.name ||
                  "Student"}
              </strong>

            </div>

          </div>


          <div className="settings-row">

            <div>

              <span>
                Email Address
              </span>

              <strong>
                {user?.email ||
                  "Not available"}
              </strong>

            </div>

          </div>


          <div className="settings-row">

            <div>

              <span>
                Account Type
              </span>

              <strong>
                {user?.role ||
                  "Student"}
              </strong>

            </div>

          </div>

        </div>


        {/* ======================================
            NOTIFICATIONS
        ====================================== */}

        <div className="settings-card">

          <div className="settings-card-header">

            <div className="settings-icon">
              🔔
            </div>

            <div>

              <h2>
                Notifications
              </h2>

              <p>
                Manage your notification preferences
              </p>

            </div>

          </div>


          <div className="settings-option">

            <div>

              <strong>
                Assignment Notifications
              </strong>

              <span>
                Receive notifications about new assignments.
              </span>

            </div>

            <label className="settings-switch">

              <input
                type="checkbox"
                defaultChecked
              />

              <span></span>

            </label>

          </div>


          <div className="settings-option">

            <div>

              <strong>
                Course Notifications
              </strong>

              <span>
                Receive updates about your courses.
              </span>

            </div>

            <label className="settings-switch">

              <input
                type="checkbox"
                defaultChecked
              />

              <span></span>

            </label>

          </div>


          <div className="settings-option">

            <div>

              <strong>
                Certificate Notifications
              </strong>

              <span>
                Get notified when certificates are available.
              </span>

            </div>

            <label className="settings-switch">

              <input
                type="checkbox"
                defaultChecked
              />

              <span></span>

            </label>

          </div>

        </div>


        {/* ======================================
            APPEARANCE
        ====================================== */}

        <div className="settings-card">

          <div className="settings-card-header">

            <div className="settings-icon">
              🎨
            </div>

            <div>

              <h2>
                Appearance
              </h2>

              <p>
                Customize how EduLearn looks.
              </p>

            </div>

          </div>


          <div className="settings-option">

            <div>

              <strong>
                Dark Mode
              </strong>

              <span>
                Switch between light and dark appearance.
              </span>

            </div>

            <label className="settings-switch">

              <input
                type="checkbox"
              />

              <span></span>

            </label>

          </div>

        </div>


        {/* ======================================
            SECURITY
        ====================================== */}

        <div className="settings-card">

          <div className="settings-card-header">

            <div className="settings-icon">
              🔒
            </div>

            <div>

              <h2>
                Security
              </h2>

              <p>
                Manage your account security.
              </p>

            </div>

          </div>


          <button
            className="settings-security-button"
            type="button"
          >
            Change Password
          </button>

        </div>


      </div>

    </div>

  );

};


export default Settings;