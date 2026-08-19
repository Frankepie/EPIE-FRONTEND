import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import {
  createAssignment,
  getCourseModules
} from "../../services/api";

import "../../styles/CreateAssignment.css";


const CreateAssignment = () => {

  const { token } = useAuth();

  const navigate = useNavigate();

  const { courseId } = useParams();


  const [modules, setModules] =
    useState([]);

  const [loadingModules, setLoadingModules] =
    useState(true);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  const [formData, setFormData] =
    useState({

      title: "",

      description: "",

      instructions: "",

      module: "",

      dueDate: "",

      totalMarks: 100,

      published: false

    });


  // ==========================================
  // LOAD COURSE MODULES
  // ==========================================

  useEffect(() => {

    const loadModules =
      async () => {

        try {

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

          setLoadingModules(false);

        }

      };


    if (
      courseId &&
      token
    ) {

      loadModules();

    }

  }, [courseId, token]);


  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (event) => {

    const {
      name,
      value,
      type,
      checked
    } = event.target;


    setFormData(
      previous => ({

        ...previous,

        [name]:
          type === "checkbox"
            ? checked
            : value

      })
    );

  };


  // ==========================================
  // SUBMIT ASSIGNMENT
  // ==========================================

  const handleSubmit =
    async (event) => {

      event.preventDefault();

      setError("");

      setSuccess("");


      if (!formData.module) {

        setError(
          "Please select a module."
        );

        return;

      }


      try {

        setLoading(true);


        const assignmentData = {

          title:
            formData.title,

          description:
            formData.description,

          instructions:
            formData.instructions,

          module:
            formData.module,

          course:
            courseId,

          dueDate:
            formData.dueDate || null,

          totalMarks:
            Number(
              formData.totalMarks
            ),

          published:
            formData.published

        };


        await createAssignment(
          assignmentData,
          token
        );


        setSuccess(
          "Assignment created successfully!"
        );


        setTimeout(() => {

          navigate(
            `/instructor/courses/${courseId}/modules`
          );

        }, 1200);


      } catch (error) {

        setError(
          error.message
        );

      } finally {

        setLoading(false);

      }

    };


  return (

    <div className="create-assignment-page">

      <div className="create-assignment-header">

        <p>
          Instructor Area
        </p>

        <h1>
          Create Assignment
        </h1>

        <span>
          Create an assignment for your students.
        </span>

      </div>


      <form
        className="assignment-form"
        onSubmit={handleSubmit}
      >

        {/* =================================
            TITLE
        ================================= */}

        <div className="form-group">

          <label>
            Assignment Title
          </label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter assignment title"
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
            placeholder="Describe the assignment"
            rows="4"
          />

        </div>


        {/* =================================
            INSTRUCTIONS
        ================================= */}

        <div className="form-group">

          <label>
            Instructions
          </label>

          <textarea
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            placeholder="Tell students what they need to do"
            rows="6"
          />

        </div>


        {/* =================================
            MODULE
        ================================= */}

        <div className="form-group">

          <label>
            Module
          </label>

          {loadingModules ? (

            <p className="form-info">
              Loading modules...
            </p>

          ) : (

            <select
              name="module"
              value={formData.module}
              onChange={handleChange}
              required
            >

              <option value="">
                Select a module
              </option>

              {modules.map(
                module => (

                  <option
                    key={module._id}
                    value={module._id}
                  >
                    {module.title}
                  </option>

                )
              )}

            </select>

          )}

        </div>


        {/* =================================
            DUE DATE
        ================================= */}

        <div className="form-group">

          <label>
            Due Date
          </label>

          <input
            type="datetime-local"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
          />

        </div>


        {/* =================================
            TOTAL MARKS
        ================================= */}

        <div className="form-group">

          <label>
            Total Marks
          </label>

          <input
            type="number"
            name="totalMarks"
            value={formData.totalMarks}
            onChange={handleChange}
            min="1"
            required
          />

        </div>


        {/* =================================
            PUBLISHED
        ================================= */}

        <div className="assignment-publish-option">

          <label>

            <input
              type="checkbox"
              name="published"
              checked={
                formData.published
              }
              onChange={handleChange}
            />

            <span>
              Publish assignment immediately
            </span>

          </label>

        </div>


        {/* =================================
            MESSAGES
        ================================= */}

        {error && (

          <div className="assignment-error">
            {error}
          </div>

        )}


        {success && (

          <div className="assignment-success">
            {success}
          </div>

        )}


        {/* =================================
            BUTTONS
        ================================= */}

        <div className="assignment-form-actions">

          <button
            type="button"
            className="assignment-cancel-button"
            onClick={() =>
              navigate(-1)
            }
          >
            Cancel
          </button>


          <button
            type="submit"
            className="assignment-submit-button"
            disabled={loading}
          >

            {loading
              ? "Creating..."
              : "Create Assignment"}

          </button>

        </div>

      </form>

    </div>

  );

};


export default CreateAssignment;