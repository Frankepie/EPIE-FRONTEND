import "../styles/TestimonialsSection.css";

const testimonials = [
  {
    id: 1,
    name: "Emily Carter",
    role: "Web Development Student",
    initials: "EC",
    text:
      "EduLearn made learning web development much easier for me. The lessons are clear, practical, and easy to follow."
  },
  {
    id: 2,
    name: "James Anderson",
    role: "Business Student",
    initials: "JA",
    text:
      "I really enjoy the flexibility of EduLearn. I can learn at my own pace while keeping track of my progress."
  },
  {
    id: 3,
    name: "Sophia Williams",
    role: "UI/UX Design Student",
    initials: "SW",
    text:
      "The instructors explain difficult concepts in a simple way. I have gained skills that I can actually use."
  }
];

const TestimonialsSection = () => {
  return (
    <section className="testimonials-section">

      <div className="testimonials-container">

        {/* HEADER */}

        <div className="testimonials-header">

          <span className="testimonials-label">
            STUDENT FEEDBACK
          </span>

          <h2>
            What Our
            <span> Students Say</span>
          </h2>

          <p>
            Discover how EduLearn is helping students
            build knowledge, develop skills, and reach
            their learning goals.
          </p>

        </div>


        {/* TESTIMONIALS */}

        <div className="testimonials-grid">

          {testimonials.map((testimonial) => (

            <article
              className="testimonial-card"
              key={testimonial.id}
            >

              <div className="testimonial-top">

                <div className="testimonial-avatar">
                  {testimonial.initials}
                </div>

                <div className="testimonial-person">

                  <h3>
                    {testimonial.name}
                  </h3>

                  <span>
                    {testimonial.role}
                  </span>

                </div>

              </div>


              <div className="testimonial-rating">
                ★ ★ ★ ★ ★
              </div>


              <p className="testimonial-text">
                "{testimonial.text}"
              </p>

            </article>

          ))}

        </div>

      </div>

    </section>
  );
};

export default TestimonialsSection;