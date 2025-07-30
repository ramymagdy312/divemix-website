"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import CategoryForm from '../components/CategoryForm';

export default function NewCategoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (categoryData: any) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('categories')
        .insert([categoryData]);

      if (error) throw error;

      router.push('/admin/categories');
    } catch (error) {
      console.error('Error creating category:', error);
      alert('حدث خطأ أثناء إنشاء الفئة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add New Category</h1>
        <p className="mt-2 text-gray-600">Add a new category for products</p>
      </div>

      <CategoryForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}