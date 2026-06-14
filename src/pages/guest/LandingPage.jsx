import TestimonialsSection from "@/components/guest/TestimonialsSection";
import HeroSection from "@/components/guest/HeroSection";
import ServicesSection from "@/components/guest/ServicesSection";
import WhyChooseUsSection from "@/components/guest/WhyChooseUsSection";
import WorkingProcessSection from "@/components/guest/WorkingProcessSection";
import ContactSection from "@/components/guest/ContactSection";
import BlogNewsletterSection from "@/components/guest/BlogNewsletterSection";

const LandingPage = () => {
  return (
    <div>
      <HeroSection />
      <ServicesSection />
      <WhyChooseUsSection />
      <TestimonialsSection />
      <WorkingProcessSection />
      <ContactSection />
      <BlogNewsletterSection />
    </div>
  );
};

export default LandingPage;