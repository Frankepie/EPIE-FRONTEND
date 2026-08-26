import React, {
  useEffect,
  useRef,
  useState
} from "react";

import {
  FaUser,
  FaCamera,
  FaSave,
  FaEnvelope,
  FaIdCard,
  FaArrowLeft,
  FaSpinner
} from "react-icons/fa";

import {
  useAuth
} from "../../context/AuthContext";

import {
  useNavigate
} from "react-router-dom";

import "../../styles/StudentProfile.css";


const API_URL =
  process.env.REACT_APP_API_URL ||
  "http://localhost:5000";


const StudentProfile = () => {

  const {
    user,
    token
  } = useAuth();

  const navigate = useNavigate();

  const fileInputRef = useRef(null);


  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    profileImage: null
  });


  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");


  // =====================================
  // LOAD PROFILE
  // =====================================

  useEffect(() => {

    const loadProfile = async () => {

      try {

        setLoading(true);
        setError("");

        const response =
          await fetch(
            `${API_URL}/api/profile`,
            {
              method: "GET",

              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          );


        const data =
          await response.json();


        if (!response.ok) {

          throw new Error(
            data.message ||
            "Failed to load profile"
          );

        }


        setProfile({
          firstName:
            data.firstName || "",

          lastName:
            data.lastName || "",

          bio:
            data.bio || "",

          profileImage:
            data.profileImage || null
        });

      } catch (err) {

        console.error(
          "Load profile error:",
          err
        );

        setError(
          err.message ||
          "Unable to load profile"
        );

      } finally {

        setLoading(false);

      }

    };


    if (token) {
      loadProfile();
    }

  }, [token]);


  // =====================================
  // HANDLE INPUT
  // =====================================

  const handleChange = (event) => {

    const {
      name,
      value
    } = event.target;


    setProfile(
      previous => ({
        ...previous,
        [name]: value
      })
    );

  };


  // =====================================
  // SAVE PROFILE
  // =====================================

  const handleSubmit = async (event) => {

    event.preventDefault();

    try {

      setSaving(true);
      setMessage("");
      setError("");


      const response =
        await fetch(
          `${API_URL}/api/profile`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`
            },

            body: JSON.stringify({
              firstName:
                profile.firstName,

              lastName:
                profile.lastName,

              bio:
                profile.bio
            })
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to update profile"
        );

      }


      setProfile({
        firstName:
          data.firstName || "",

        lastName:
          data.lastName || "",

        bio:
          data.bio || "",

        profileImage:
          data.profileImage || null
      });


      setMessage(
        "Profile updated successfully."
      );


    } catch (err) {

      console.error(
        "Update profile error:",
        err
      );

      setError(
        err.message ||
        "Unable to update profile"
      );

    } finally {

      setSaving(false);

    }

  };


  // =====================================
  // SELECT IMAGE
  // =====================================

  const handleImageClick = () => {

    fileInputRef.current?.click();

  };


  // =====================================
  // UPLOAD IMAGE
  // =====================================

  const handleImageChange = async (event) => {

    const file =
      event.target.files?.[0];


    if (!file) {
      return;
    }


    // Basic frontend validation

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/webp"
    ];


    if (
      !allowedTypes.includes(
        file.type
      )
    ) {

      setError(
        "Only JPEG, PNG, JPG and WebP images are allowed."
      );

      return;

    }


    if (
      file.size >
      5 * 1024 * 1024
    ) {

      setError(
        "Image must be smaller than 5MB."
      );

      return;

    }


    try {

      setUploading(true);
      setMessage("");
      setError("");


      const formData =
        new FormData();


      formData.append(
        "image",
        file
      );


      const response =
        await fetch(
          `${API_URL}/api/profile/upload-image`,
          {
            method: "POST",

            headers: {
              Authorization:
                `Bearer ${token}`
            },

            body: formData
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Image upload failed"
        );

      }


      setProfile(
        previous => ({
          ...previous,

          profileImage:
            data.profileImage
        })
      );


      setMessage(
        "Profile image updated successfully."
      );


    } catch (err) {

      console.error(
        "Profile image upload error:",
        err
      );

      setError(
        err.message ||
        "Unable to upload profile image"
      );

    } finally {

      setUploading(false);

      // Allow selecting the same image again
      event.target.value = "";

    }

  };


  // =====================================
  // IMAGE URL
  // =====================================

  const getImageUrl = () => {

    if (!profile.profileImage) {
      return null;
    }


    if (
      profile.profileImage.startsWith("http")
    ) {

      return profile.profileImage;

    }


    return `${API_URL}${profile.profileImage}`;

  };


  // =====================================
  // LOADING
  // =====================================

  if (loading) {

    return (

      <div className="student-profile-loading">

        <FaSpinner className="student-profile-spinner" />

        <p>
          Loading profile...
        </p>

      </div>

    );

  }


  return (

    <div className="student-profile-page">


      {/* =====================================
          HEADER
      ===================================== */}

      <div className="student-profile-header">

        <div>

          <h1>
            Student Profile
          </h1>

          <p>
            Manage your personal information
            and profile image.
          </p>

        </div>


        <button
          type="button"
          className="student-profile-back-button"
          onClick={() =>
            navigate("/student/dashboard")
          }
        >

          <FaArrowLeft />

          <span>
            Back to Dashboard
          </span>

        </button>

      </div>


      {/* =====================================
          ALERTS
      ===================================== */}

      {message && (

        <div className="student-profile-success">

          {message}

        </div>

      )}


      {error && (

        <div className="student-profile-error">

          {error}

        </div>

      )}


      {/* =====================================
          PROFILE CARD
      ===================================== */}

      <div className="student-profile-card">


        {/* ===================================
            PROFILE IMAGE
        =================================== */}

        <div className="student-profile-image-section">

          <div className="student-profile-image-wrapper">

            {getImageUrl() ? (

              <img
                src={getImageUrl()}
                alt="Student profile"
                className="student-profile-image"
              />

            ) : (

              <div className="student-profile-placeholder">

                <FaUser />

              </div>

            )}


            <button
              type="button"
              className="student-profile-camera-button"
              onClick={handleImageClick}
              disabled={uploading}
              title="Change profile image"
            >

              {uploading ? (
                <FaSpinner className="student-profile-spinner" />
              ) : (
                <FaCamera />
              )}

            </button>


            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/jpg,image/webp"
              onChange={handleImageChange}
              className="student-profile-file-input"
            />

          </div>


          <h2>

            {profile.firstName ||
            profile.lastName
              ? `${profile.firstName} ${profile.lastName}`.trim()
              : user?.name || "Student"}

          </h2>


          <p>
            {user?.email}
          </p>


          <span className="student-profile-role">
            Student
          </span>

        </div>


        {/* ===================================
            PROFILE FORM
        =================================== */}

        <form
          className="student-profile-form"
          onSubmit={handleSubmit}
        >


          <div className="student-profile-form-title">

            <FaIdCard />

            <h2>
              Personal Information
            </h2>

          </div>


          {/* FIRST NAME */}

          <div className="student-profile-form-group">

            <label htmlFor="firstName">
              First Name
            </label>

            <div className="student-profile-input-wrapper">

              <FaUser />

              <input
                id="firstName"
                name="firstName"
                type="text"
                value={profile.firstName}
                onChange={handleChange}
                placeholder="Enter your first name"
              />

            </div>

          </div>


          {/* LAST NAME */}

          <div className="student-profile-form-group">

            <label htmlFor="lastName">
              Last Name
            </label>

            <div className="student-profile-input-wrapper">

              <FaUser />

              <input
                id="lastName"
                name="lastName"
                type="text"
                value={profile.lastName}
                onChange={handleChange}
                placeholder="Enter your last name"
              />

            </div>

          </div>


          {/* EMAIL */}

          <div className="student-profile-form-group">

            <label>
              Email Address
            </label>

            <div className="student-profile-input-wrapper">

              <FaEnvelope />

              <input
                type="email"
                value={user?.email || ""}
                disabled
              />

            </div>

            <small>
              Your email address cannot be changed here.
            </small>

          </div>


          {/* BIO */}

          <div className="student-profile-form-group">

            <label htmlFor="bio">
              Bio
            </label>

            <textarea
              id="bio"
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              placeholder="Tell us a little about yourself..."
              rows="5"
            />

          </div>


          {/* SAVE */}

          <div className="student-profile-form-actions">

            <button
              type="submit"
              className="student-profile-save-button"
              disabled={saving}
            >

              {saving ? (

                <>
                  <FaSpinner className="student-profile-spinner" />

                  Saving...

                </>

              ) : (

                <>
                  <FaSave />

                  Save Changes

                </>

              )}

            </button>

          </div>


        </form>

      </div>

    </div>

  );

};


export default StudentProfile;