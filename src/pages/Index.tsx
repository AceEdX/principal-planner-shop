import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import PreviewSection from "@/components/PreviewSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import PrebookSection from "@/components/PrebookSection";
import FooterSection from "@/components/FooterSection";
import FAQSection from "@/components/FAQSection";

const Index = () => (
  <div className="min-h-screen pb-28 md:pb-0">
    <Navbar />
    <HeroSection />
    <FeaturesSection />
    <PreviewSection />
    <TestimonialsSection />
    <FAQSection />
    <PrebookSection />
    <FooterSection />
  </div>
);

export default Index;
