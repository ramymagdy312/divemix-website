import CategoryList from "../components/products/CategoryList";
import ProductsPageDB from "../components/products/ProductsPageDB";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FloatingWhatsApp from "../components/FloatingWhatsApp";

export default function Products() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow page-content">
        <ProductsPageDB>
          <CategoryList />
        </ProductsPageDB>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}