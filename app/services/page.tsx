import ServiceGridDB from "../components/services/ServiceGridDB";
import PageHeader from "../components/common/PageHeader";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";

export default function Services() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow page-content">
        <div className="min-h-screen bg-gray-50">
          <PageHeader
            title="Services"
            description="Discover our comprehensive range of gas mixing and compression solutions"
            backgroundImage="img/gallery/Oel-Gas.jpg"
          />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <ServiceGridDB />
          </div>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}