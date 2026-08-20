import { Link } from "react-router-dom";

import "../styles/PopularCourses.css";

const courses = [
  {
    id: 1,
    category: "Web Development",
    title: "Full Stack Web Development",
    description:
      "Learn how to build modern web applications from frontend to backend.",
    instructor: "John Smith",
    students: "245",
    rating: "4.9",
    price: "$49",
    icon: "WEB"
  },

  {
    id: 2,
    category: "UI/UX Design",
    title: "Modern UI/UX Design",
    description:
      "Learn the principles of user interface and user experience design.",
    instructor: "Sarah Johnson",
    students: "189",
    rating: "4.8",
    price: "$39",
    icon: "UX"
  },

  {
    id: 3,
    category: "Programming",
    title: "JavaScript Programming",
    description:
      "Master JavaScript fundamentals and build interactive applications.",
    instructor: "Michael Brown",
    students: "320",
    rating: "4.9",
    price: "$45",
    icon: "JS"
  },

  {
    id: 4,
    category: "Data Science",
    title: "Introduction to Data Science",
    description:
      "Discover data analysis, visualization and essential data science skills.",
    instructor: "David Wilson",
    students: "156",
    rating: "4.7",
    price: "$42",
    icon: "DS"
  }
];

const PopularCourses = () => {
  return (
    <section className="popular-courses-section">

      <div className="popular-courses-container">

        {/* SECTION HEADER */}

        <div className="popular-courses-header">

          <div>

            <span className="section-label">
              LEARN WITH EDULEARN
            </span>

            <h2>
              Popular Courses
            </h2>

            <p>
              Explore courses designed to help
              you develop practical skills and
              achieve your learning goals.
            </p>

          </div>

          <Link
            to="/courses"
            className="view-all-courses"
          >
            View All Courses
            <span>→</span>
          </Link>

        </div>


        {/* COURSE GRID */}

        <div className="popular-course-grid">

          {courses.map((course) => (

            <article
              className="popular-course-card"
              key={course.id}
            >

              {/* COURSE IMAGE PLACEHOLDER */}

              <div className="course-card-image">

                <div className="course-image-pattern">
                  {course.icon}
                </div>

                <span className="course-category">
                  {course.category}
                </span>

              </div>


              {/* COURSE CONTENT */}

              <div className="course-card-content">

                <h3>
                  {course.title}
                </h3>

                <p className="course-description">
                  {course.description}
                </p>


                {/* INSTRUCTOR */}

                <div className="course-instructor">

                  <div className="instructor-avatar">
                    {course.instructor.charAt(0)}
                  </div>

                  <span>
                    {course.instructor}
                  </span>

                </div>


                {/* RATING */}

                <div className="course-meta">

                  <div className="course-rating">

                    <span className="rating-star">
                      ★
                    </span>

                    <strong>
                      {course.rating}
                    </strong>

                    <span>
                      ({course.students})
                    </span>

                  </div>

                  <span className="course-students">
                    {course.students} students
                  </span>

                </div>


                {/* FOOTER */}

                <div className="course-card-footer">

                  <strong className="course-price">
                    {course.price}
                  </strong>

                  <Link
                    to={`/courses/${course.id}`}
                    className="course-view-button"
                  >
                    View Course
                  </Link>

                </div>

              </div>

            </article>

          ))}

        </div>

      </div>

    </section>
  );
};

export default PopularCourses;