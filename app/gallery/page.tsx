import DatabaseGallery from "../components/gallery/DatabaseGallery";
import PageHeader from "../components/common/PageHeader";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";

export default function Gallery() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow page-content">
        <div>
          <PageHeader
            title="Gallery"
            description="Experience our world-class facilities and installations through our curated collection of images"
            backgroundImage="https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=2000"
          />
          <DatabaseGallery />
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}