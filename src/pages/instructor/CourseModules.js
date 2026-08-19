import {useEffect,useState} from "react";
import {Link,useParams} from "react-router-dom";
import {useAuth} from "../../context/AuthContext";

import {
  getCourseModules,
  createModule,
  updateModule,
  deleteModule
} from "../../services/api";

import "../../styles/CourseModules.css";


const CourseModules = () => {

  const {
    courseId
  } = useParams();


  const {
    token
  } = useAuth();


  const [modules, setModules] =
    useState([]);


  const [loading, setLoading] =
    useState(true);


  const [error, setError] =
    useState("");


  const [showForm, setShowForm] =
    useState(false);


  const [editingId, setEditingId] =
    useState(null);


  const [title, setTitle] =
    useState("");


  const [description, setDescription] =
    useState("");


  const [order, setOrder] =
    useState(1);


  const [saving, setSaving] =
    useState(false);


  /*
    LOAD MODULES
  */

  useEffect(() => {

    const loadModules =
      async () => {

        try {

          setLoading(true);

          setError("");


          const data =
            await getCourseModules(
              courseId,
              token
            );


          setModules(
            data.modules || []
          );


        } catch (error) {

          setError(
            error.message
          );

        } finally {

          setLoading(false);

        }

      };


    if (
      token &&
      courseId
    ) {

      loadModules();

    }

  }, [
    token,
    courseId
  ]);


  /*
    RESET FORM
  */

  const resetForm = () => {

    setTitle("");

    setDescription("");

    setOrder(
      modules.length + 1
    );

    setEditingId(null);

    setShowForm(false);

  };


  /*
    OPEN CREATE FORM
  */

  const handleAddModule = () => {

    setTitle("");

    setDescription("");

    setOrder(
      modules.length + 1
    );

    setEditingId(null);

    setShowForm(true);

  };


  /*
    OPEN EDIT FORM
  */

  const handleEdit =
    (module) => {

      setTitle(
        module.title
      );

      setDescription(
        module.description || ""
      );

      setOrder(
        module.order || 1
      );

      setEditingId(
        module._id
      );

      setShowForm(true);

    };


  /*
    SUBMIT FORM
  */

  const handleSubmit =
    async (event) => {

      event.preventDefault();


      if (!title.trim()) {

        setError(
          "Module title is required."
        );

        return;

      }


      try {

        setSaving(true);

        setError("");


        if (editingId) {

          const data =
            await updateModule(
              editingId,
              {
                title,
                description,
                order
              },
              token
            );


          setModules(
            modules.map(
              (module) =>
                module._id === editingId
                  ? data.module
                  : module
            )
          );


        } else {

          const data =
            await createModule(
              {
                title,
                description,
                course:
                  courseId,
                order
              },
              token
            );


          setModules(
            [
              ...modules,
              data.module
            ]
          );

        }


        resetForm();


      } catch (error) {

        setError(
          error.message
        );

      } finally {

        setSaving(false);

      }

    };


  /*
    DELETE MODULE
  */

  const handleDelete =
    async (moduleId) => {

      const confirmed =
        window.confirm(
          "Are you sure you want to delete this module?"
        );


      if (!confirmed) {

        return;

      }


      try {

        setError("");


        await deleteModule(
          moduleId,
          token
        );


        setModules(
          modules.filter(
            (module) =>
              module._id !== moduleId
          )
        );


      } catch (error) {

        setError(
          error.message
        );

      }

    };


  /*
    LOADING
  */

  if (loading) {

    return (

      <div className="course-modules-page">

        <div className="course-modules-loading">

          Loading course modules...

        </div>

      </div>

    );

  }


  return (

    <div className="course-modules-page">


      {/* HEADER */}

      <div className="course-modules-header">

        <div>

          <p>
            Instructor Area
          </p>

          <h1>
            Course Content
          </h1>

        </div>


        <Link
          to="/instructor/courses"
          className="back-courses-button"
        >
          ← My Courses
        </Link>

      </div>


      {/* COURSE CONTENT HEADER */}

      <div className="course-content-header">

        <div>

          <span>
            COURSE CONTENT
          </span>

          <h2>
            Course Modules
          </h2>

          <p>
            Organize your course into
            modules and lessons.
          </p>

        </div>


        <button
          className="add-module-button"
          onClick={
            handleAddModule
          }
        >
          + Add Module
        </button>

      </div>


      {/* ERROR */}

      {error && (

        <div className="module-error">

          {error}

        </div>

      )}


      {/* FORM */}

      {showForm && (

        <div className="module-form-card">

          <div className="module-form-header">

            <h2>

              {editingId
                ? "Edit Module"
                : "Create Module"}

            </h2>

          </div>


          <form
            onSubmit={
              handleSubmit
            }
          >

            <div className="module-form-group">

              <label>
                Module Title
              </label>

              <input
                type="text"
                value={title}
                onChange={
                  (event) =>
                    setTitle(
                      event.target.value
                    )
                }
                placeholder="e.g. Introduction to MERN"
              />

            </div>


            <div className="module-form-group">

              <label>
                Description
              </label>

              <textarea
                value={description}
                onChange={
                  (event) =>
                    setDescription(
                      event.target.value
                    )
                }
                placeholder="Describe what students will learn..."
              />

            </div>


            <div className="module-form-group">

              <label>
                Module Order
              </label>

              <input
                type="number"
                min="1"
                value={order}
                onChange={
                  (event) =>
                    setOrder(
                      Number(
                        event.target.value
                      )
                    )
                }
              />

            </div>


            <div className="module-form-actions">

              <button
                type="submit"
                className="save-module-button"
                disabled={saving}
              >

                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Module"
                    : "Create Module"}

              </button>


              <button
                type="button"
                className="cancel-module-button"
                onClick={
                  resetForm
                }
              >
                Cancel
              </button>

            </div>

          </form>

        </div>

      )}


      {/* MODULES */}

      {modules.length === 0 ? (

        <div className="modules-empty">

          <div className="modules-empty-icon">
            +
          </div>

          <h2>
            No modules yet
          </h2>

          <p>
            Start organizing your course
            by creating your first module.
          </p>

          <button
            onClick={
              handleAddModule
            }
          >
            Create First Module
          </button>

        </div>

      ) : (

        <div className="modules-list">

          {modules.map(
            (module, index) => (

              <div
                className="module-card"
                key={module._id}
              >

                <div className="module-number">

                  {index + 1}

                </div>


                <div className="module-information">

                  <span>
                    MODULE {index + 1}
                  </span>

                  <h2>
                    {module.title}
                  </h2>

                  <p>
                    {module.description ||
                      "No description provided."}
                  </p>

                </div>


    <div className="module-actions">

  <Link
    to={`/instructor/modules/${module._id}/lessons`}
    className="manage-lessons-button"
  >
    Manage Lessons
  </Link>


  <button
    onClick={() =>
      handleEdit(module)
    }
  >
    Edit
  </button>


  <button
    className="delete-module-button"
    onClick={() =>
      handleDelete(module._id)
    }
  >
    Delete
  </button>

</div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};
export default CourseModules;