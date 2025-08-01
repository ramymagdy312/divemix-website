import CategoryListDB from "../components/products/CategoryListDB";
import ProductsPageDB from "../components/products/ProductsPageDB";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";

export default function Products() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow page-content">
        <ProductsPageDB>
          <CategoryListDB />
        </ProductsPageDB>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}