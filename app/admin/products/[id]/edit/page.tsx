"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../../lib/supabase';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ProductForm from '../../components/ProductForm';

interface Product {
  id: string;
  name: string;
  description: string;
  short_description?: string;
  category_id: string;
  image_url: string;
  images?: string[];
  features?: string[];
  is_active: boolean;
  display_order: number;
}

// Fallback product data for demo
const fallbackProducts: { [key: string]: Product } = {
  '1': {
    id: '1',
    name: 'Professional Diving Mask',
    description: 'High-quality diving mask with anti-fog technology and comfortable silicone skirt',
    short_description: 'Crystal clear vision underwater',
    category_id: '1',
    image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800',
    images: ['https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800'],

    features: ['Anti-fog coating', 'Comfortable silicone skirt', 'Tempered glass lens'],
    is_active: true,
    display_order: 1
  },
  '2': {
    id: '2',
    name: 'Diving Fins',
    description: 'Lightweight and efficient diving fins for better propulsion',
    short_description: 'Enhanced underwater mobility',
    category_id: '1',
    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800',
    images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800'],

    features: ['Lightweight design', 'Efficient blade shape', 'Comfortable foot pocket'],
    is_active: true,
    display_order: 2
  }
};

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<Product | null>(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchProduct();
  }, [params.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchProduct = async () => {
    try {
      // Check if Supabase is configured
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey || 
          supabaseUrl === 'your-supabase-url' || 
          supabaseKey === 'your-supabase-anon-key' ||
          supabaseUrl === 'https://placeholder.supabase.co' ||
          supabaseKey === 'placeholder-key') {
        console.warn('Supabase not configured. Using fallback data.');
        const fallbackProduct = fallbackProducts[params.id];
        if (fallbackProduct) {
          setInitialData(fallbackProduct);
          setUsingFallback(true);
        }
        setFetchLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) {
        console.error('Error fetching product:', error);
        setError(`Database error: ${error.message}`);
        const fallbackProduct = fallbackProducts[params.id];
        if (fallbackProduct) {
          setInitialData(fallbackProduct);
          setUsingFallback(true);
        }
      } else {
        setInitialData(data);
        setUsingFallback(false);
      }
    } catch (error: any) {
      console.error('Error:', error);
      setError(`Connection error: ${error.message}`);
      const fallbackProduct = fallbackProducts[params.id];
      if (fallbackProduct) {
        setInitialData(fallbackProduct);
        setUsingFallback(true);
      }
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (productData: any) => {
    if (usingFallback) {
      alert('Cannot update products in demo mode. Set up database to enable full functionality.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', params.id);

      if (error) {
        console.error('Error updating product:', error);
        alert(`Error updating product: ${error.message}`);
        return;
      }

      alert('Product updated successfully!');
      router.push('/admin/products');
    } catch (error: any) {
      console.error('Error updating product:', error);
      alert(`Error updating product: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  if (!initialData) {
    return (
      <div className="text-center py-12">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
          <p className="text-gray-500">The requested product could not be found.</p>
        </div>
        <div className="space-x-4">
          <Link
            href="/admin/products"
            className="inline-flex items-center px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>
          <Link
            href="/check-products-database"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <AlertCircle className="h-4 w-4 mr-2" />
            Check Database
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Error/Demo Mode Banner */}
      {(usingFallback || error) && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-yellow-400 mr-3" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-yellow-800">
                {error ? 'Database Connection Issue' : 'Demo Mode Active'}
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                {error ? (
                  <>Database error: {error}. Showing sample product data.</>
                ) : (
                  <>Editing sample product. Database not configured.</>
                )}
                <Link href="/check-products-database" className="underline ml-2">
                  Set up database →
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Link
            href="/admin/products"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Products
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
        <p className="mt-2 text-gray-600">
          {usingFallback ? 'Editing sample product (Demo Mode)' : 'Edit product data'}
        </p>
        {initialData && (
          <div className="mt-2 text-sm text-gray-500">
            Product ID: {initialData.id} • {initialData.name}
          </div>
        )}
      </div>

      <ProductForm 
        initialData={initialData} 
        onSubmit={handleSubmit} 
        loading={loading} 
      />
    </div>
  );
}