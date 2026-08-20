import HomeNavbar from "../components/HomeNavbar";
import HeroSection from "../components/HeroSection";
import PopularCourses from "../components/PopularCourses";
import LearningVideoSection from "../components/LearningVideoSection";
import AboutSection from "../components/AboutSection";
import LearningStats from "../components/LearningStats";
import WhyChooseUs from "../components/WhyChooseUs";
import InstructorsSection from "../components/InstructorsSection";
import TestimonialsSection from "../components/TestimonialsSection";
import HomeCTA from "../components/HomeCTA";

import "../styles/Home.css";
const Home = () => {
  return (
    <div className="home-page">

      <HomeNavbar />

      <main>

        <section id="home">
          <HeroSection />
        </section>


        <section id="courses">
          <PopularCourses />
        </section>


        <section id="learning-video">
          <LearningVideoSection />
        </section>


        <section id="about">
          <AboutSection />
        </section>


        <LearningStats />

        <WhyChooseUs />


        <section id="instructors">
          <InstructorsSection />
        </section>


        <TestimonialsSection />

        <HomeCTA />

      </main>

    </div>
  );
};

export default Home;