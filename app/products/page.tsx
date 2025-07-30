import CategoryListDB from "../components/products/CategoryListDB";
import ProductHero from "../components/products/ProductHero";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";

export default function Products() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow page-content">
        <div className="min-h-screen bg-gray-50">
          <ProductHero
            category={{
              id: "all",
              categoryName: "Our Products",
              shortDesc:
                "Discover our comprehensive range of gas mixing and compression solutions, engineered for excellence and built to last.",
              hero: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=2000",
              image: "/img/products/L&W Compressors/Mobile/1.png",
              products: [],
            }}
          />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <CategoryListDB />
          </div>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}