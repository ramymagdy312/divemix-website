"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import ProductForm from '../components/ProductForm';

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (productData: any) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('products')
        .insert([productData]);

      if (error) throw error;

      router.push('/admin/products');
    } catch (error) {
      console.error('Error creating product:', error);
      alert('حدث خطأ أثناء إنشاء المنتج');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
        <p className="mt-2 text-gray-600">Add a new product to the database</p>
      </div>

      <ProductForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}