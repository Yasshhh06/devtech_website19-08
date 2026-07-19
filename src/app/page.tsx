import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import WhyChooseUs from "@/components/WhyChooseUs";
import Solutions from "@/components/Solutions";
import Portfolio from "@/components/Portfolio";
import About from "@/components/About";
import Process from "@/components/Process";
import Pricing from "@/components/Pricing";
import Careers from "@/components/Careers";
import FaqContact from "@/components/FaqContact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <WhyChooseUs />
        <Solutions />
        <Portfolio />
        <About />
        <Process />
        <Pricing />
        <Careers />
        <FaqContact />
      </main>
      <Footer />
    </>
  );
}
