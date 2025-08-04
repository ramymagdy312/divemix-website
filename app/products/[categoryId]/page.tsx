import CategoryDetailDB from "../../components/products/CategoryDetailDB";
import CategoryDetailFallback from "../../components/products/CategoryDetailFallback";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import FloatingWhatsApp from "../../components/FloatingWhatsApp";
import { Suspense } from "react";

export async function generateStaticParams() {
  // Return predefined category slugs as fallback
  return [
    { categoryId: 'diving-equipment' },
    { categoryId: 'safety-gear' },
    { categoryId: 'underwater-cameras' },
    { categoryId: 'accessories' },
    { categoryId: 'wetsuits-gear' },
    { categoryId: 'maintenance-tools' },
  ];
}

export default function CategoryPage({ params }: { params: { categoryId: string } }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow page-content">
        <div className="min-h-screen bg-gray-50">
          <Suspense fallback={
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-600"></div>
            </div>
          }>
            <CategoryDetailDB categoryId={params.categoryId} />
          </Suspense>
        </div>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}