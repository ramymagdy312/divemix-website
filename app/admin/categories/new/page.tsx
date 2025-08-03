"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import CategoryForm from '../components/CategoryForm';
import toast from 'react-hot-toast';

export default function NewCategoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);

  const handleSubmit = async (categoryData: any) => {
    // Check if Supabase is configured
    setLoading(true);
    try {
      const { error } = await supabase
        .from('product_categories')
        .insert([categoryData]);

      if (error) throw error;

      toast.success('Category created successfully!');
      router.push('/admin/categories');
    } catch (error: any) {
      console.error('Error creating category:', error);
      toast.error(`Error creating category: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
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