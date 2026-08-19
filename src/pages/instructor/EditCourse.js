import {useEffect,useState} from "react";
import {useNavigate,useParams} from "react-router-dom";
import {useAuth} from "../../context/AuthContext";
import "../../styles/EditCourse.css";


const EditCourse = () => {

  const {
    token
  } = useAuth();

  const {
    id
  } = useParams();

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
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");


  useEffect(() => {

    const loadCourse =
      async () => {

        try {

          const API_URL =
            process.env.REACT_APP_API_URL ||
            "http://localhost:5000";


          const response =
            await fetch(
              `${API_URL}/api/courses/${id}`
            );


          const data =
            await response.json();


          if (!response.ok) {

            throw new Error(
              data.message ||
              "Failed to load course"
            );

          }


          const course =
            data.course;


          setFormData({

            title:
              course.title || "",

            description:
              course.description || "",

            category:
              course.category || "",

            level:
              course.level || "Beginner",

            duration:
              course.duration || "",

            price:
              course.price || 0,

            image:
              course.image || ""

          });


        } catch (error) {

          setError(
            error.message
          );

        } finally {

          setLoading(false);

        }

      };


    loadCourse();

  }, [id]);


  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value

    });

  };


  const handleSubmit =
    async (e) => {

      e.preventDefault();

      setSaving(true);

      setError("");


      try {

        const API_URL =
          process.env.REACT_APP_API_URL ||
          "http://localhost:5000";


        const response =
          await fetch(
            `${API_URL}/api/courses/${id}`,
            {

              method: "PUT",

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
            "Failed to update course"
          );

        }


        navigate(
          "/instructor/courses"
        );


      } catch (error) {

        setError(
          error.message
        );

      } finally {

        setSaving(false);

      }

    };


  if (loading) {

    return (
      <div className="edit-course-page">
        Loading course...
      </div>
    );

  }


  return (

    <div className="edit-course-page">

      <div className="edit-course-container">

        <div className="edit-course-header">

          <p>
            Instructor Area
          </p>

          <h1>
            Edit Course
          </h1>
        </div>
        {error && (
          <div className="form-error">
            {error}
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
            />
          </div>
          <button
            type="submit"
            className="create-course-submit"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};
export default EditCourse;