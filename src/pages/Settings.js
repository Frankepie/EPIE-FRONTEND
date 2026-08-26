import { useEffect, useState } from "react";

import {
  getSettings,
  updateSettings
} from "../services/api";

import { useAuth } from "../context/AuthContext";
import {
  useLanguage
} from "../context/LanguageContext";
import "./Settings.css";


const Settings = () => {
const {
  language,
  changeLanguage,
  t
} = useLanguage();
  const { token } = useAuth();


  // =====================================
  // SETTINGS STATE
  // =====================================

  const [settings, setSettings] = useState({

    darkMode: false,

    language: "English",

    notifications: {

      email: true,

      courses: true,

      assignments: true

    }

  });


  // =====================================
  // UI STATE
  // =====================================

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  // =====================================
  // LOAD SETTINGS
  // =====================================

  useEffect(() => {

    const loadSettings = async () => {

      if (!token) {

        setLoading(false);

        return;

      }


      try {

        setLoading(true);

        setError("");


        const data =
          await getSettings(token);


        if (data.settings) {

          setSettings({

            darkMode:
              data.settings.darkMode ?? false,

            language:
              data.settings.language ??
              "English",

            notifications: {

              email:
                data.settings.notifications?.email ??
                true,

              courses:
                data.settings.notifications?.courses ??
                true,

              assignments:
                data.settings.notifications?.assignments ??
                true

            }

          });

        }

      } catch (err) {

        console.error(
          "Load settings error:",
          err
        );

        setError(
          err.message ||
          "Failed to load settings"
        );

      } finally {

        setLoading(false);

      }

    };


    loadSettings();

  }, [token]);


  // =====================================
  // HANDLE DARK MODE
  // =====================================

  const handleDarkModeChange = () => {

    setSettings(previous => ({

      ...previous,

      darkMode:
        !previous.darkMode

    }));

  };


  // =====================================
  // HANDLE LANGUAGE
  // =====================================

  const handleLanguageChange = (
    event
  ) => {

    setSettings(previous => ({

      ...previous,

      language:
        event.target.value

    }));

  };


  // =====================================
  // HANDLE NOTIFICATIONS
  // =====================================

  const handleNotificationChange = (
    field
  ) => {

    setSettings(previous => ({

      ...previous,

      notifications: {

        ...previous.notifications,

        [field]:
          !previous.notifications[field]

      }

    }));

  };


  // =====================================
  // SAVE SETTINGS
  // =====================================

  const handleSave = async () => {

    if (!token) {

      setError(
        "You must be logged in to save settings."
      );

      return;

    }


    try {

      setSaving(true);

      setError("");

      setSuccess("");


      const data =
        await updateSettings(
          token,
          settings
        );


      if (data.settings) {

        setSettings({

          darkMode:
            data.settings.darkMode,

          language:
            data.settings.language,

          notifications: {

            email:
              data.settings.notifications?.email ??
              true,

            courses:
              data.settings.notifications?.courses ??
              true,

            assignments:
              data.settings.notifications?.assignments ??
              true

          }

        });

      }


      setSuccess(
        "Settings saved successfully."
      );


      // Automatically remove message
      setTimeout(() => {

        setSuccess("");

      }, 3000);


    } catch (err) {

      console.error(
        "Save settings error:",
        err
      );

      setError(
        err.message ||
        "Failed to save settings"
      );

    } finally {

      setSaving(false);

    }

  };


  // =====================================
  // LOADING
  // =====================================

  if (loading) {

    return (

      <div className="settings-page">

        <div className="settings-loading">

          <i className="fa-solid fa-spinner fa-spin"></i>

          <span>
            Loading settings...
          </span>

        </div>

      </div>

    );

  }


  // =====================================
  // PAGE
  // =====================================

  return (

    <div className="settings-page">


      {/* =================================
          HEADER
      ================================= */}

      <div className="settings-header">

        <div>

        <h1>
  {t("settingsTitle")}
</h1>

<p>
  {t("settingsDescription")}
</p>
        </div>

      </div>


      {/* =================================
          ERROR
      ================================= */}

      {error && (

        <div className="settings-message settings-error">

          <i className="fa-solid fa-circle-exclamation"></i>

          <span>
            {error}
          </span>

        </div>

      )}


      {/* =================================
          SUCCESS
      ================================= */}

     {success && (

  <div className="settings-message settings-success">

    <i className="fa-solid fa-circle-check"></i>

    <span>
      {t("settingsSaved")}
    </span>

  </div>

)}


      {/* =================================
          APPEARANCE
      ================================= */}

      <section className="settings-card">

        <div className="settings-card-header">

          <div className="settings-icon">

            <i className="fa-solid fa-palette"></i>

          </div>

          <div>
<h2>
  {t("appearance")}
</h2>

<p>
  {t("appearanceDescription")}
</p>

          </div>

        </div>


        <div className="settings-option">

          <div className="settings-option-info">

       <h3>
  {t("darkMode")}
</h3>

<p>
  {t("darkModeDescription")}
</p>

          </div>


          <label className="settings-switch">

            <input
              type="checkbox"
              checked={settings.darkMode}
              onChange={
                handleDarkModeChange
              }
            />

            <span className="settings-slider"></span>

          </label>

        </div>

      </section>


      {/* =================================
          LANGUAGE
      ================================= */}

      <section className="settings-card">

        <div className="settings-card-header">

          <div className="settings-icon">

            <i className="fa-solid fa-language"></i>

          </div>

          <div>

            <h2>
              Language
            </h2>

            <p>
              Choose your preferred language.
            </p>

          </div>

        </div>


        <div className="settings-language">

          <label htmlFor="language">

            Language

          </label>


         <select
  id="language"
  value={language}
  onChange={(event) => {

    changeLanguage(
      event.target.value
    );

  }}
>

  <option value="English">
    {t("english")}
  </option>

  <option value="French">
    {t("french")}
  </option>

</select>
      

        </div>

      </section>


      {/* =================================
          NOTIFICATIONS
      ================================= */}

      <section className="settings-card">

        <div className="settings-card-header">

          <div className="settings-icon">

            <i className="fa-solid fa-bell"></i>

          </div>

          <div>

           <h2>
  {t("notificationSettings")}
</h2>

<p>
  {t("notificationDescription")}
</p>

          </div>

        </div>


        {/* EMAIL */}

        <div className="settings-option">

          <div className="settings-option-info">

            <h3>
              Email Notifications
            </h3>

            <p>
              Receive important updates by email.
            </p>

          </div>


          <label className="settings-switch">

            <input
              type="checkbox"
              checked={
                settings.notifications.email
              }
              onChange={() =>
                handleNotificationChange(
                  "email"
                )
              }
            />

            <span className="settings-slider"></span>

          </label>

        </div>


        {/* COURSES */}

        <div className="settings-option">

          <div className="settings-option-info">

            <h3>
              Course Notifications
            </h3>

            <p>
              Receive updates about your enrolled courses.
            </p>

          </div>


          <label className="settings-switch">

            <input
              type="checkbox"
              checked={
                settings.notifications.courses
              }
              onChange={() =>
                handleNotificationChange(
                  "courses"
                )
              }
            />

            <span className="settings-slider"></span>

          </label>

        </div>


        {/* ASSIGNMENTS */}

        <div className="settings-option">

          <div className="settings-option-info">

            <h3>
              Assignment Notifications
            </h3>

            <p>
              Receive notifications about assignments and deadlines.
            </p>

          </div>


          <label className="settings-switch">

            <input
              type="checkbox"
              checked={
                settings.notifications.assignments
              }
              onChange={() =>
                handleNotificationChange(
                  "assignments"
                )
              }
            />

            <span className="settings-slider"></span>

          </label>

        </div>

      </section>


      {/* =================================
          SAVE
      ================================= */}

      <div className="settings-actions">

       <button
  type="button"
  className="settings-save-button"
  onClick={handleSave}
  disabled={saving}
>

  {saving ? (

    <>
      <i className="fa-solid fa-spinner fa-spin"></i>

      {t("saving")}
    </>

  ) : (

    <>
      <i className="fa-solid fa-floppy-disk"></i>

      {t("saveChanges")}
    </>

  )}

</button>

      </div>


    </div>

  );

};


export default Settings;