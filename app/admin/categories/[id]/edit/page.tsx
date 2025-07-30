"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../../lib/supabase';
import CategoryForm from '../../components/CategoryForm';

export default function EditCategoryPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    fetchCategory();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const fetchCategory = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) {
        console.error('Error fetching category:', error);
        alert('حدث خطأ أثناء جلب بيانات الفئة');
        return;
      }
      
      setInitialData(data);
    } catch (error) {
      console.error('Error fetching category:', error);
      alert('حدث خطأ أثناء جلب بيانات الفئة');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (categoryData: any) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('categories')
        .update(categoryData)
        .eq('id', params.id);

      if (error) {
        console.error('Error updating category:', error);
        alert('حدث خطأ أثناء تحديث الفئة');
        return;
      }

      alert('تم تحديث الفئة بنجاح!');
      router.push('/admin/categories');
    } catch (error) {
      console.error('Error updating category:', error);
      alert('حدث خطأ أثناء تحديث الفئة');
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
        <p className="text-gray-500">الفئة غير موجودة</p>
        <button
          onClick={() => router.push('/admin/categories')}
          className="mt-4 px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700"
        >
          العودة للفئات
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">تعديل الفئة</h1>
        <p className="mt-2 text-gray-600">تعديل بيانات الفئة</p>
      </div>

      <CategoryForm 
        initialData={initialData} 
        onSubmit={handleSubmit} 
        loading={loading} 
      />
    </div>
  );
}