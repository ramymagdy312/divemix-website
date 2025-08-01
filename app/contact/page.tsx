import ContactPageDB from "../components/contact/ContactPageDB";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow page-content">
        <ContactPageDB />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}