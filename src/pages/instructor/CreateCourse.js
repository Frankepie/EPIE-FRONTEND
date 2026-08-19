import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../context/AuthContext";

import "../../styles/CreateCourse.css";


const CreateCourse = () => {

  const {
    token
  } = useAuth();

  const navigate =
    useNavigate();


  const [formData, setFormData] =
    useState({
      title: "",
      description: "",
      category: "",
      level: "Beginner",
      duration: "",
      price: 0,
      image: ""
    });


  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  const handleChange = (e) => {

    const {
      name,
      value
    } = e.target;


    setFormData({
      ...formData,
      [name]: value
    });

  };


  const handleSubmit =
    async (e) => {

      e.preventDefault();

      setError("");
      setSuccess("");
      setLoading(true);


      try {

        const API_URL =
          process.env.REACT_APP_API_URL ||
          "http://localhost:5000";


        const response =
          await fetch(
            `${API_URL}/api/courses`,
            {

              method: "POST",

              headers: {

                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`

              },

              body: JSON.stringify(
                formData
              )

            }
          );


        const data =
          await response.json();


        if (!response.ok) {

          throw new Error(
            data.message ||
            "Failed to create course"
          );

        }


        setSuccess(
          "Course created successfully!"
        );


        setTimeout(() => {

          navigate(
            "/instructor/courses"
          );

        }, 1000);


      } catch (error) {

        setError(
          error.message
        );

      } finally {

        setLoading(false);

      }

    };


  return (

    <div className="create-course-page">

      <div className="create-course-container">

        <div className="create-course-header">

          <p>
            Instructor Area
          </p>

          <h1>
            Create a New Course
          </h1>

          <span>
            Share your knowledge
            with students.
          </span>

        </div>


        {error && (
          <div className="form-error">
            {error}
          </div>
        )}


        {success && (
          <div className="form-success">
            {success}
          </div>
        )}


        <form
          className="course-form"
          onSubmit={handleSubmit}
        >

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
          <div className="form-group">
            <label>
              Course Image URL
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/course.jpg"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="create-course-submit"
          >
            {loading
              ? "Creating..."
              : "Create Course"}
          </button>
        </form>
      </div>
    </div>
  );
};
export default CreateCourse;