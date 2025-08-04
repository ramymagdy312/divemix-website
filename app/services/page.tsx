import ServiceGridDB from "../components/services/ServiceGridDB";
import ServicesPageDB from "../components/services/ServicesPageDB";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FloatingWhatsApp from "../components/FloatingWhatsApp";

export default function Services() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow page-content">
        <ServicesPageDB>
          <ServiceGridDB />
        </ServicesPageDB>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}