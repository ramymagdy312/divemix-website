"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../../lib/supabase';
import ProductForm from '../../components/ProductForm';



export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) {
        console.error('Error fetching product:', error);
        alert('Error fetching product data');
        return;
      }
      
      setInitialData(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      alert('Error fetching product data');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (productData: any) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', params.id);

      if (error) {
        console.error('Error updating product:', error);
        alert('Error updating product');
        return;
      }

      alert('Product updated successfully!');
      router.push('/admin/products');
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error updating product');
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
        <p className="text-gray-500">Product not found</p>
        <button
          onClick={() => router.push('/admin/products')}
          className="mt-4 px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
        <p className="mt-2 text-gray-600">Edit product data</p>
      </div>

      <ProductForm 
        initialData={initialData} 
        onSubmit={handleSubmit} 
        loading={loading} 
      />
    </div>
  );
}