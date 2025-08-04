import AboutPageDB from "../components/about/AboutPageDB";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FloatingWhatsApp from "../components/FloatingWhatsApp";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow page-content">
        <AboutPageDB />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}