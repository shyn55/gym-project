// src/app/(routes)/page.js
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import Facilities from "@/components/home/Facilities";
import Trainer from "@/components/home/Trainer";
import Pricing from "@/components/home/Pricing";
import MentalHealth from "@/components/home/MentalHealth";
import HealthyHabits from "@/components/home/HealthyHabits";
import FAQ from "@/components/home/FAQ";
import Footer from "@/components/layout/Footer";
import Testimonials from "@/components/home/Testimonials";
import Blog from "@/components/home/Blog";
import Branches from "@/components/home/Branches";
import Gallery from "@/components/home/Gallery";

export default function Home() {
  return (
    <>
     
      <Hero />
      <Facilities />
      <Trainer />
      <Pricing />
      <MentalHealth />
      <HealthyHabits />
      <Testimonials />
      <Blog /> {/* <-- اضافه شد */}
      <Branches /> {/* <-- اضافه شد */}
      <Gallery /> {/* <-- اضافه شد */}
      <FAQ />
      
    </>
  );
}
