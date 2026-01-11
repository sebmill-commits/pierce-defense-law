import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import Services from "@/components/home/Services";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import FAQ from "@/components/home/FAQ";
import LocalArea from "@/components/home/LocalArea";
import FinalCTA from "@/components/home/FinalCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Services />
      <WhyChooseUs />
      <FAQ />
      <LocalArea />
      <FinalCTA />
    </>
  );
}
