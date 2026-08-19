import {useEffect,useState} from "react";
import {useParams,Link,useNavigate} from "react-router-dom";
import {
  getCourseById,
  enrollInCourse,
  getCourseModules,
  getMyCourses
} from "../services/api";
import {useAuth} from "../context/AuthContext";
import "../styles/CourseDetails.css";
const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] =useState(null);
  const [modules, setModules] =useState([]);
  const [isEnrolled, setIsEnrolled] =useState(false);
    const {
  user,
  token
} = useAuth();

const navigate =
  useNavigate();

const [enrolling, setEnrolling] =
  useState(false);

const [enrollMessage, setEnrollMessage] =
  useState("");
  const handleEnroll = async () => {

  if (!user) {

    navigate("/login");

    return;

  }


  try {

    setEnrolling(true);

    setEnrollMessage("");


    await enrollInCourse(
      course._id,
      token
    );


    setEnrollMessage(
      "You have successfully enrolled in this course."
    );

  } catch (error) {

    setEnrollMessage(
      error.message
    );

  } finally {

    setEnrolling(false);

  }

};
  const [loading, setLoading] =
    useState(true);
  const [error, setError] =
    useState("");
 useEffect(() => {

  const loadCourse = async () => {

    try {

      const data =
        await getCourseById(id);

      setCourse(
        data.course
      );


      if (token) {

        const moduleData =
          await getCourseModules(
            id,
            token
          );

        setModules(
          moduleData.modules || []
        );
        const enrollmentData =
  await getMyCourses(
    token
  );

const enrolled =
  (enrollmentData.enrollments || [])
    .some(
      (enrollment) =>
        enrollment.course?._id === id
    );

setIsEnrolled(
  enrolled
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
  loadCourse();

}, [
  id,
  token
]);
  if (loading) {
    return (
      <div className="course-details-page">
        <div className="course-details-message">
          Loading course...
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="course-details-page">
        <div className="course-details-message">
          <h2>
            Course not found
          </h2>
          <p>
            {error}
          </p>
          <Link to="/courses">
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="course-details-page">
      <div className="course-details-container">
        <div className="course-details-image">
          {course.image ? (
            <img
              src={course.image}
              alt={course.title}
            />
          ) : (
            <span>
              {course.category
                ?.charAt(0)
                .toUpperCase()}
            </span>
          )}
        </div>
        <div className="course-details-content">
          <span className="course-details-category">
            {course.category}
          </span>
          <h1>
            {course.title}
          </h1>
          <p className="course-details-description">
            {course.description}
          </p>
          <div className="course-details-info">
            <div>
              <span>
                Level
              </span>
              <strong>
                {course.level}
              </strong>
            </div>
            <div>
              <span>
                Duration
              </span>
              <strong>
                {course.duration}
              </strong>
            </div>
            <div>
              <span>
                Instructor
              </span>
              <strong>
                {course.instructor?.name}
              </strong>
            </div>
          </div>
          <div className="course-details-bottom">

  <strong className="course-price">
    {course.price === 0
      ? "Free"
      : `$${course.price}`}
  </strong>


  {isEnrolled ? (

    <button
      className="enroll-button"
      type="button"
      onClick={() => {

        if (
          modules.length === 0
        ) {
          setEnrollMessage(
            "No modules are available for this course yet."
          );
          return;
        }
        navigate(
          `/student/modules/${modules[0]._id}/lessons`
        );

      }}
    >
      Continue Learning
    </button>
  ) : (
    <button
      className="enroll-button"
      type="button"
      onClick={handleEnroll}
      disabled={enrolling}
    >
      {enrolling
        ? "Enrolling..."
        : "Enroll Now"}
    </button>
  )}
  {enrollMessage && (
    <p className="enroll-message">
      {enrollMessage}
    </p>
  )}
</div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;