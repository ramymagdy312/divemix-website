import CategoryDetailDB from "../../components/products/CategoryDetailDB";
import { supabase } from "../../lib/supabase";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ScrollToTop from "../../components/ScrollToTop";

export async function generateStaticParams() {
  try {
    const { data: categories } = await supabase
      .from('categories')
      .select('id');
    
    return categories?.map((category) => ({
      categoryId: category.id,
    })) || [];
  } catch (error) {
    console.error('Error generating static params:', error);
    // Return predefined category IDs as fallback for static export
    return [
      { categoryId: '550e8400-e29b-41d4-a716-446655440001' },
      { categoryId: '550e8400-e29b-41d4-a716-446655440002' },
      { categoryId: '550e8400-e29b-41d4-a716-446655440003' },
      { categoryId: '550e8400-e29b-41d4-a716-446655440004' },
      { categoryId: '550e8400-e29b-41d4-a716-446655440005' },
    ];
  }
}

export default function CategoryPage({ params }: { params: { categoryId: string } }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow page-content">
        <div className="min-h-screen bg-gray-50">
          <CategoryDetailDB categoryId={params.categoryId} />
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}