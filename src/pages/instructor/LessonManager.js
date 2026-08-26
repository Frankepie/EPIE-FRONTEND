import {
  useCallback,
  useEffect,
  useState
} from "react";
import {
  useParams
} from "react-router-dom";
import {
  useAuth
} from "../../context/AuthContext";
import {
  getModuleLessons,
  createLesson,
  updateLesson,
  deleteLesson
} from "../../services/api";
import "../../styles/LessonManager.css";

const LessonManager = () => {
  // ALL hooks MUST be inside the component
  const {
    moduleId
  } = useParams();
  const {
    token
  } = useAuth();
  
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [videoPreview, setVideoPreview] = useState("");
  const [form, setForm] = useState({
    title: "",
    content: "",
    video: null,
    duration: "",
    order: 1
  });

  const handleVideoSelect = (file) => {
    if (!file) {
      return;
    }

    const allowedTypes = [
      "video/mp4",
      "video/webm",
      "video/quicktime",
      "video/x-matroska"
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Please select an MP4, WEBM, MOV or MKV video.");
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      setError("Video must be smaller than 100 MB.");
      return;
    }

    setError("");
    setForm(previous => ({
      ...previous,
      video: file
    }));

    const previewUrl = URL.createObjectURL(file);
    setVideoPreview(previewUrl);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files[0];
    handleVideoSelect(file);
  };

  const loadLessons = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getModuleLessons(moduleId, token);
      setLessons(data.lessons || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [moduleId, token]);

  useEffect(() => {
    if (token && moduleId) {
      loadLessons();
    }
  }, [token, moduleId, loadLessons]);

  const handleChange = (event) => {
    const {
      name,
      value
    } = event.target;
    setForm({
      ...form,
      [name]: value
    });
  };

  const resetForm = () => {
    setForm({
      title: "",
      content: "",
      video: null,
      duration: "",
      order: 1
    });
    setVideoPreview("");
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError("");

      const lessonData = new FormData();
      lessonData.append("title", form.title);
      lessonData.append("content", form.content);
      lessonData.append("duration", Number(form.duration) || 0);
      lessonData.append("order", Number(form.order) || 1);
      lessonData.append("module", moduleId);

      if (form.video) {
        lessonData.append("video", form.video);
      }

      if (editingId) {
        await updateLesson(editingId, lessonData, token);
      } else {
        await createLesson(lessonData, token);
      }

      resetForm();
      await loadLessons();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEdit = (lesson) => {
    setEditingId(lesson._id);
    setForm({
      title: lesson.title || "",
      content: lesson.content || "",
      video: null,
      duration: lesson.duration || "",
      order: lesson.order || 1
    });
    // Clear video preview when editing
    setVideoPreview(lesson.videoUrl || "");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handleDelete = async (lessonId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this lesson?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(lessonId);
      setError("");
      await deleteLesson(lessonId, token);
      setLessons(lessons.filter((lesson) => lesson._id !== lessonId));
    } catch (error) {
      setError(error.message);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="lesson-manager-page">
        <p>Loading lessons...</p>
      </div>
    );
  }

  return (
    <div className="lesson-manager-page">
      <div className="lesson-manager-header">
        <div>
          <p className="lesson-eyebrow">Instructor Area</p>
          <h1>Lesson Manager</h1>
          <p>Create and manage lessons for this module.</p>
        </div>
      </div>

      {error && (
        <div className="lesson-error">{error}</div>
      )}

      <div className="lesson-manager-layout">
        {/* FORM */}
        <div className="lesson-form-card">
          <h2>{editingId ? "Edit Lesson" : "Create Lesson"}</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Lesson Title</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter lesson title"
                required
              />
            </div>

            <div className="form-group">
              <label>Lesson Content</label>
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                placeholder="Write lesson content..."
                rows="7"
              />
            </div>

            <div className="form-group">
              <label>Lesson Video</label>
              <div
                className={dragging ? "video-upload-area dragging" : "video-upload-area"}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="lesson-video"
                  accept="video/mp4,video/webm,video/quicktime,video/x-matroska"
                  onChange={(event) => handleVideoSelect(event.target.files[0])}
                  hidden
                />

                <label htmlFor="lesson-video" className="video-upload-label">
                  <div className="video-upload-icon">
                    <i className="fa-solid fa-video"></i>
                  </div>
                  <strong>
                    {form.video ? form.video.name : "Drag & drop your video here"}
                  </strong>
                  <span>or click to select a video</span>
                  <small>MP4, WEBM, MOV or MKV · Max 100 MB</small>
                </label>
              </div>

              {videoPreview && (
                <div className="video-preview">
                  <video src={videoPreview} controls preload="metadata" />
                </div>
              )}
            </div>

            <div className="lesson-form-row">
              <div className="form-group">
                <label>Duration (minutes)</label>
                <input
                  type="number"
                  name="duration"
                  value={form.duration}
                  onChange={handleChange}
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>Lesson Order</label>
                <input
                  type="number"
                  name="order"
                  value={form.order}
                  onChange={handleChange}
                  min="1"
                />
              </div>
            </div>

            <div className="lesson-form-actions">
              <button type="submit" className="lesson-primary-button">
                {editingId ? "Update Lesson" : "Create Lesson"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="lesson-cancel-button"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* LESSON LIST */}
        <div className="lesson-list-card">
          <div className="lesson-list-header">
            <div>
              <p>Module Lessons</p>
              <h2>
                {lessons.length} Lesson{lessons.length !== 1 ? "s" : ""}
              </h2>
            </div>
          </div>

          {lessons.length === 0 ? (
            <div className="lesson-empty">
              <h3>No lessons yet</h3>
              <p>Create your first lesson using the form.</p>
            </div>
          ) : (
            <div className="lesson-list">
              {lessons.map((lesson) => (
                <div className="lesson-item" key={lesson._id}>
                  <div className="lesson-number">{lesson.order}</div>
                  <div className="lesson-info">
                    <h3>{lesson.title}</h3>
                    <p>
                      {lesson.duration
                        ? `${lesson.duration} minutes`
                        : "No duration"}
                    </p>
                  </div>
                  <div className="lesson-actions">
                    <button
                      type="button"
                      onClick={() => handleEdit(lesson)}
                      className="lesson-edit-button"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(lesson._id)}
                      className="lesson-delete-button"
                      disabled={deletingId === lesson._id}
                    >
                      {deletingId === lesson._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonManager;