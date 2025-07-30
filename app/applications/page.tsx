import ApplicationGridDB from "../components/applications/ApplicationGridDB";
import PageHeader from "../components/common/PageHeader";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";

export default function Applications() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow page-content">
        <div className="min-h-screen bg-gray-50">
          <PageHeader
            title="Applications"
            description="Discover our comprehensive range of gas mixing and compression solutions"
            backgroundImage="/img/gallery/Oel-Gas.jpg"
          />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <ApplicationGridDB />
          </div>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}