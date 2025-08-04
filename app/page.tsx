import HeroSection from "./components/home/HeroSection";
import CompanySection from "./components/home/CompanySection";
import FeaturedCategories from "./components/home/FeaturedCategories";
import FeaturedApplications from "./components/home/FeaturedApplications";
import StatsSection from "./components/home/StatsSection";
import ContactCTA from "./components/home/ContactCTA";
import FloatingContactForm from "./components/home/FloatingContactForm";
import FeaturedServices from "./components/home/FeaturedServices";
import VendorsSlider from "./components/home/VendorsSlider";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

export default async function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow page-content">
        <div className="relative">
          <HeroSection />
          <CompanySection />
          <FeaturedCategories />
          <StatsSection />
          <FeaturedServices />
          <FeaturedApplications />
          <VendorsSlider />
          <ContactCTA />
          <FloatingContactForm />
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}