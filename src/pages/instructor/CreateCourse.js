import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import "../../styles/CreateCourse.css";


const CreateCourse = () => {

  const { token } = useAuth();

  const navigate = useNavigate();


  const [formData, setFormData] =
  useState({
    title: "",
    description: "",
    category: "",
    level: "Beginner",
    duration: "",
    price: 0,
    image: null
  });


  const [imageFile, setImageFile] =
    useState(null);

  const [imagePreview, setImagePreview] =
    useState("");


  const [dragActive, setDragActive] =
    useState(false);


  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  /*
  =========================================
  HANDLE TEXT INPUTS
  =========================================
  */
const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData({
    ...formData,
    [name]: value
  });
};


  /*
  =========================================
  HANDLE IMAGE
  =========================================
  */

  const handleImage = (file) => {

    setError("");


    if (!file) {
      return;
    }


    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp"
    ];


    if (!allowedTypes.includes(file.type)) {

      setError(
        "Please select a JPG, JPEG, PNG or WEBP image."
      );

      return;

    }


    const maxSize =
      5 * 1024 * 1024;


    if (file.size > maxSize) {

      setError(
        "Course image must be smaller than 5 MB."
      );

      return;

    }


    setImageFile(file);


    const previewUrl =
      URL.createObjectURL(file);

    setImagePreview(previewUrl);

  };


  /*
  =========================================
  FILE INPUT
  =========================================
  */

  const handleImageChange = (e) => {

    const file =
      e.target.files?.[0];

    handleImage(file);

  };


  /*
  =========================================
  DRAG ENTER
  =========================================
  */

  const handleDragEnter = (e) => {

    e.preventDefault();
    e.stopPropagation();

    setDragActive(true);

  };


  /*
  =========================================
  DRAG LEAVE
  =========================================
  */

  const handleDragLeave = (e) => {

    e.preventDefault();
    e.stopPropagation();

    setDragActive(false);

  };


  /*
  =========================================
  DRAG OVER
  =========================================
  */

  const handleDragOver = (e) => {

    e.preventDefault();
    e.stopPropagation();

    setDragActive(true);

  };


  /*
  =========================================
  DROP
  =========================================
  */

  const handleDrop = (e) => {

    e.preventDefault();
    e.stopPropagation();

    setDragActive(false);


    const file =
      e.dataTransfer.files?.[0];

    handleImage(file);

  };


  /*
  =========================================
  REMOVE IMAGE
  =========================================
  */

  const handleRemoveImage = () => {

    setImageFile(null);

    setImagePreview("");

  };


  /*
=========================================
CREATE COURSE
=========================================
*/

const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");
  setSuccess("");

  /*
  --------------------------------------
  IMAGE REQUIRED
  --------------------------------------
  */

  if (!imageFile) {
    setError(
      "Please upload a course image."
    );

    return;
  }

  setLoading(true);

  try {
    const API_URL =
      process.env.REACT_APP_API_URL ||
      "http://localhost:5000";

    /*
    --------------------------------------
    FORM DATA
    --------------------------------------
    */

    const data = new FormData();

    data.append(
      "title",
      formData.title
    );

    data.append(
      "description",
      formData.description
    );

    data.append(
      "category",
      formData.category
    );

    data.append(
      "level",
      formData.level
    );

    data.append(
      "duration",
      formData.duration
    );

    data.append(
      "price",
      formData.price
    );

    /*
    --------------------------------------
    IMAGE FILE
    --------------------------------------
    */

    data.append(
      "image",
      imageFile
    );

    /*
    --------------------------------------
    REQUEST
    --------------------------------------
    */

    const response = await fetch(
      `${API_URL}/api/courses`,
      {
        method: "POST",

        headers: {
          Authorization:
            `Bearer ${token}`
        },

        body: data
      }
    );

    const responseData =
      await response.json();

    /*
    --------------------------------------
    HANDLE ERROR
    --------------------------------------
    */

    if (!response.ok) {
      throw new Error(
        responseData.message ||
        "Failed to create course."
      );
    }

    /*
    --------------------------------------
    SUCCESS
    --------------------------------------
    */

    setSuccess(
      "Course created successfully!"
    );

    /*
    --------------------------------------
    REDIRECT
    --------------------------------------
    */

    setTimeout(() => {
      navigate(
        "/instructor/courses"
      );
    }, 1000);

  } catch (error) {
    console.error(
      "Create course error:",
      error
    );

    setError(
      error.message ||
      "Failed to create course."
    );

  } finally {
    setLoading(false);
  }
};

  /*
  =========================================
  RENDER
  =========================================
  */

  return (

    <div className="create-course-page">

      <div className="create-course-container">


        {/* =================================
            HEADER
        ================================= */}

        <div className="create-course-header">

          <p>
            Instructor Area
          </p>

          <h1>
            Create a New Course
          </h1>

          <span>
            Share your knowledge with students.
          </span>

        </div>


        {/* =================================
            ERROR
        ================================= */}

        {error && (

          <div className="form-error">

            {error}

          </div>

        )}


        {/* =================================
            SUCCESS
        ================================= */}

        {success && (

          <div className="form-success">

            {success}

          </div>

        )}


        <form
          className="course-form"
          onSubmit={handleSubmit}
        >


          {/* =================================
              COURSE TITLE
          ================================= */}

          <div className="form-group">

            <label>
              Course Title
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter course title"
              required
            />

          </div>


          {/* =================================
              DESCRIPTION
          ================================= */}

          <div className="form-group">

            <label>
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your course"
              rows="6"
              required
            />

          </div>


          {/* =================================
              CATEGORY + LEVEL
          ================================= */}

          <div className="form-row">


            <div className="form-group">

              <label>
                Category
              </label>

              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g. Web Development"
                required
              />

            </div>


            <div className="form-group">

              <label>
                Level
              </label>

              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
              >

                <option value="Beginner">
                  Beginner
                </option>

                <option value="Intermediate">
                  Intermediate
                </option>

                <option value="Advanced">
                  Advanced
                </option>

              </select>

            </div>


          </div>


          {/* =================================
              DURATION + PRICE
          ================================= */}

          <div className="form-row">


            <div className="form-group">

              <label>
                Duration
              </label>

              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g. 8 weeks"
                required
              />

            </div>


            <div className="form-group">

              <label>
                Price
              </label>

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
              />

            </div>


          </div>


          {/* =================================
              COURSE IMAGE
          ================================= */}

          <div className="form-group">

            <label>
              Course Image
            </label>


            {!imagePreview ? (

              <div
                className={
                  dragActive
                    ? "course-image-upload drag-active"
                    : "course-image-upload"
                }

                onDragEnter={
                  handleDragEnter
                }

                onDragLeave={
                  handleDragLeave
                }

                onDragOver={
                  handleDragOver
                }

                onDrop={
                  handleDrop
                }

                onClick={() =>
                  document
                    .getElementById(
                      "course-image-input"
                    )
                    .click()
                }
              >

                <div className="course-image-upload-icon">

                  <i className="fa-solid fa-cloud-arrow-up"></i>

                </div>


                <h3>
                  Upload Course Image
                </h3>


                <p>
                  Drag and drop an image here
                </p>


                <span>
                  or click to browse from your device
                </span>


                <small>
                  JPG, JPEG, PNG or WEBP • Maximum 5 MB
                </small>


                <input
                  id="course-image-input"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageChange}
                  hidden
                />

              </div>

            ) : (

              <div className="course-image-preview-container">


                <img
                  src={imagePreview}
                  alt="Course preview"
                  className="course-image-preview"
                />


                <div className="course-image-preview-info">

                  <strong>
                    {imageFile?.name}
                  </strong>


                  <span>
                    {imageFile
                      ? (
                        imageFile.size /
                        (1024 * 1024)
                      ).toFixed(2)
                      : "0"
                    } MB
                  </span>

                </div>


                <div className="course-image-preview-actions">

                  <label
                    htmlFor="course-image-change"
                    className="change-image-button"
                  >

                    <i className="fa-solid fa-pen"></i>

                    Change Image

                  </label>


                  <button
                    type="button"
                    className="remove-image-button"
                    onClick={
                      handleRemoveImage
                    }
                  >

                    <i className="fa-solid fa-trash"></i>

                    Remove

                  </button>


                  <input
                    id="course-image-change"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleImageChange}
                    hidden
                  />

                </div>

              </div>

            )}

          </div>


          {/* =================================
              SUBMIT
          ================================= */}

          <button
            type="submit"
            disabled={loading}
            className="create-course-submit"
          >

            {loading
              ? "Creating Course..."
              : "Create Course"}

          </button>


        </form>

      </div>

    </div>

  );

};


export default CreateCourse;