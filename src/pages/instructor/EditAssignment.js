import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import {
  getAssignmentById,
  updateAssignment,
  getCourseModules
} from "../../services/api";

import "../../styles/EditAssignment.css";


const EditAssignment = () => {

  const { token } = useAuth();

  const navigate = useNavigate();

  const { id } = useParams();

  const [assignment, setAssignment] =
    useState(null);

  const [modules, setModules] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
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
  // LOAD ASSIGNMENT
  // ==========================================

  useEffect(() => {

    const loadAssignment =
      async () => {

        try {

          const data =
            await getAssignmentById(
              id,
              token
            );

          const current =
            data.assignment;

          setAssignment(current);

          setFormData({
            title:
              current.title || "",

            description:
              current.description || "",

            instructions:
              current.instructions || "",

            module:
              current.module?._id ||
              current.module ||
              "",

            dueDate:
              current.dueDate
                ? new Date(
                    current.dueDate
                  )
                    .toISOString()
                    .slice(0, 16)
                : "",

            totalMarks:
              current.totalMarks || 100,

            published:
              current.published || false
          });


          // Load modules belonging
          // to the assignment course

          const courseId =
            current.course?._id ||
            current.course;


          if (courseId) {

            const moduleData =
              await getCourseModules(
                courseId,
                token
              );

            setModules(
              moduleData.modules || []
            );

          }

        } catch (error) {

          setError(
            error.message
          );

        } finally {

          setLoading(false);

        }

      };


    if (id && token) {
      loadAssignment();
    }

  }, [id, token]);


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
  // UPDATE ASSIGNMENT
  // ==========================================

  const handleSubmit =
    async (event) => {

      event.preventDefault();

      setError("");

      setSuccess("");

      setSaving(true);


      try {

        const assignmentData = {

          title:
            formData.title,

          description:
            formData.description,

          instructions:
            formData.instructions,

          module:
            formData.module,

          dueDate:
            formData.dueDate || null,

          totalMarks:
            Number(
              formData.totalMarks
            ),

          published:
            formData.published

        };


        await updateAssignment(
          id,
          assignmentData,
          token
        );


        setSuccess(
          "Assignment updated successfully!"
        );


        setTimeout(() => {

          navigate(
            "/instructor/assignments"
          );

        }, 1000);


      } catch (error) {

        setError(
          error.message
        );

      } finally {

        setSaving(false);

      }

    };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (
      <div className="edit-assignment-page">
        Loading assignment...
      </div>
    );

  }


  // ==========================================
  // ERROR / NOT FOUND
  // ==========================================

  if (!assignment) {

    return (
      <div className="edit-assignment-page">

        <div className="edit-assignment-error">
          {error || "Assignment not found."}
        </div>

      </div>
    );

  }


  return (

    <div className="edit-assignment-page">

      <div className="edit-assignment-header">

        <p>
          Instructor Area
        </p>

        <h1>
          Edit Assignment
        </h1>

        <span>
          Update your assignment details.
        </span>

      </div>


      <form
        className="edit-assignment-form"
        onSubmit={handleSubmit}
      >

        <div className="form-group">

          <label>
            Assignment Title
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
            rows="4"
          />

        </div>


        <div className="form-group">

          <label>
            Instructions
          </label>

          <textarea
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            rows="6"
          />

        </div>


        <div className="form-group">

          <label>
            Module
          </label>

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

        </div>


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


        <div className="edit-publish-option">

          <label>

            <input
              type="checkbox"
              name="published"
              checked={formData.published}
              onChange={handleChange}
            />

            <span>
              Published
            </span>

          </label>

        </div>


        {error && (

          <div className="edit-assignment-error">
            {error}
          </div>

        )}


        {success && (

          <div className="edit-assignment-success">
            {success}
          </div>

        )}


        <div className="edit-assignment-actions">

          <button
            type="button"
            className="edit-cancel-button"
            onClick={() =>
              navigate(
                "/instructor/assignments"
              )
            }
          >
            Cancel
          </button>


          <button
            type="submit"
            className="edit-save-button"
            disabled={saving}
          >

            {saving
              ? "Saving..."
              : "Save Changes"}

          </button>

        </div>

      </form>

    </div>

  );

};


export default EditAssignment;