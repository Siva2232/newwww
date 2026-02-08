import Hero from "../sections/Hero";
// import About from "../sections/About";
// import Habout from "../sections/Habout";
// import Services from "../sections/Services";
// import Process from "../sections/Process";
// import Portfolio from "../sections/Portfolio";
// import Testimonials from "../sections/Testimonials";
import ContactCTA from "../sections/ContactCTA";
import TestimonialSection from "../components/common/TestimonialSection";

export default function Home() {
  return (
    <>
      <Hero />
      <TestimonialSection />
      {/* <Services />
      <Habout /> */}
      {/* <Process /> */}
      {/* <Portfolio /> */}
      {/* <Testimonials /> */}
      <ContactCTA />
    </>
  );
}
