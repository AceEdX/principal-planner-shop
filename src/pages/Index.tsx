import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import PreviewSection from "@/components/PreviewSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import PrebookSection from "@/components/PrebookSection";
import FooterSection from "@/components/FooterSection";
import WhatsAppButton from "@/components/WhatsAppButton";

const Index = () => (
  <div className="min-h-screen">
    <Navbar />
    <HeroSection />
    <FeaturesSection />
    <PreviewSection />
    <TestimonialsSection />
    <PrebookSection />
    <FooterSection />
    <WhatsAppButton />
  </div>
);

export default Index;
