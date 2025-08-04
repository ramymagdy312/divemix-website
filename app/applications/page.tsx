import ApplicationGridDB from "../components/applications/ApplicationGridDB";
import ApplicationsPageDB from "../components/applications/ApplicationsPageDB";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FloatingWhatsApp from "../components/FloatingWhatsApp";

export default function Applications() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow page-content">
        <ApplicationsPageDB>
          <ApplicationGridDB />
        </ApplicationsPageDB>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}