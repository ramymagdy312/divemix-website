import ContactHero from "../components/contact/ContactHero";
import ContactIntro from "../components/contact/ContactIntro";
import FloatingContactForm from "../components/contact/FloatingContactForm";
import BranchLocations from "../components/contact/BranchLocations";
import AnimatedElement from "../components/common/AnimatedElement";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow page-content">
        <AnimatedElement animation="fadeIn">
          <div>
            <ContactHero />
            <div className="py-16 bg-gray-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-12 mb-20">
                  <div className="lg:w-1/2">
                    <ContactIntro />
                  </div>
                  <div className="lg:w-1/2 lg:sticky lg:top-8">
                    <FloatingContactForm />
                  </div>
                </div>
                <BranchLocations />
              </div>
            </div>
          </div>
        </AnimatedElement>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}