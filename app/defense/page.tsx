import SeattleHero from "@/components/seattle/home/Hero";
import SeattleHowItWorks from "@/components/seattle/home/HowItWorks";
import SeattleServices from "@/components/seattle/home/Services";
import SeattleWhyChooseUs from "@/components/seattle/home/WhyChooseUs";
import SeattleFAQ from "@/components/seattle/home/FAQ";
import SeattleLocalArea from "@/components/seattle/home/LocalArea";
import SeattleFinalCTA from "@/components/seattle/home/FinalCTA";

export default function SeattleDefenseHome() {
  return (
    <>
      <SeattleHero />
      <SeattleHowItWorks />
      <SeattleServices />
      <SeattleWhyChooseUs />
      <SeattleFAQ />
      <SeattleLocalArea />
      <SeattleFinalCTA />
    </>
  );
}
