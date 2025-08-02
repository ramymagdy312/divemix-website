"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import CategoryForm from '../components/CategoryForm';

export default function NewCategoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);

  const handleSubmit = async (categoryData: any) => {
    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey || 
        supabaseUrl === 'your-supabase-url' || 
        supabaseKey === 'your-supabase-anon-key' ||
        supabaseUrl === 'https://placeholder.supabase.co' ||
        supabaseKey === 'placeholder-key') {
      alert('Cannot add categories in demo mode. Set up database to enable full functionality.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('product_categories')
        .insert([categoryData]);

      if (error) throw error;

      alert('Category created successfully!');
      router.push('/admin/categories');
    } catch (error: any) {
      console.error('Error creating category:', error);
      alert(`Error creating category: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Demo Mode Banner */}
      <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-yellow-400 mr-3" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-yellow-800">Demo Mode Active</h3>
            <p className="text-sm text-yellow-700 mt-1">
              Database not configured. Set up database to add real categories.
              <Link href="/check-products-database" className="underline ml-2">
                Set up database →
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Link
            href="/admin/categories"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Categories
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Add New Category</h1>
        <p className="mt-2 text-gray-600">Add a new category for products</p>
      </div>

      <CategoryForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}