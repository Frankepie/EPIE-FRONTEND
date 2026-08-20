import "../styles/InstructorsSection.css";

const instructors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    role: "Web Development",
    description:
      "Passionate educator helping learners build practical web development skills.",
    initials: "SJ"
  },

  {
    id: 2,
    name: "Michael Anderson",
    role: "UI/UX Design",
    description:
      "Designer and instructor focused on creating simple and engaging digital experiences.",
    initials: "MA"
  },

  {
    id: 3,
    name: "David Williams",
    role: "Business & Technology",
    description:
      "Technology enthusiast helping students understand modern business and digital tools.",
    initials: "DW"
  }
];


const InstructorsSection = () => {

  return (
    <section className="instructors-section">

      <div className="instructors-container">

        {/* HEADER */}

        <div className="instructors-header">

          <span className="instructors-label">
            OUR INSTRUCTORS
          </span>

          <h2>
            Learn From
            <span> Experienced Instructors</span>
          </h2>

          <p>
            Meet the educators and professionals who
            create practical learning experiences to
            help you achieve your goals.
          </p>

        </div>


        {/* INSTRUCTOR GRID */}

        <div className="instructors-grid">

          {instructors.map((instructor) => (

            <article
              className="instructor-card"
              key={instructor.id}
            >

              <div className="instructor-image">

                <span>
                  {instructor.initials}
                </span>

              </div>


              <div className="instructor-info">

                <h3>
                  {instructor.name}
                </h3>

                <span className="instructor-role">
                  {instructor.role}
                </span>

                <p>
                  {instructor.description}
                </p>

                <button
                  type="button"
                  className="instructor-profile-button"
                >
                  View Profile
                </button>

              </div>

            </article>

          ))}

        </div>

      </div>

    </section>
  );
};

export default InstructorsSection;