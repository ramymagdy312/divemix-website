"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../../lib/supabase';

export default function EditGalleryImagePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    category: '',
  });

  useEffect(() => {
    fetchImage();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const fetchImage = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) {
        console.error('Error fetching image:', error);
        alert('حدث خطأ أثناء جلب بيانات الصورة');
        return;
      }
      
      setInitialData(data);
      setFormData({
        title: data.title || '',
        url: data.url || '',
        category: data.category || '',
      });
    } catch (error) {
      console.error('Error fetching image:', error);
      alert('حدث خطأ أثناء جلب بيانات الصورة');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('gallery_images')
        .update(formData)
        .eq('id', params.id);

      if (error) {
        console.error('Error updating image:', error);
        alert('حدث خطأ أثناء تحديث الصورة');
        return;
      }

      alert('تم تحديث الصورة بنجاح!');
      router.push('/admin/gallery');
    } catch (error) {
      console.error('Error updating image:', error);
      alert('حدث خطأ أثناء تحديث الصورة');
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
        <p className="text-gray-500">الصورة غير موجودة</p>
        <button
          onClick={() => router.push('/admin/gallery')}
          className="mt-4 px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700"
        >
          العودة للمعرض
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">تعديل الصورة</h1>
        <p className="mt-2 text-gray-600">تعديل بيانات الصورة</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow rounded-lg p-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            عنوان الصورة
          </label>
          <input
            type="text"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            رابط الصورة
          </label>
          <input
            type="text"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            الفئة
          </label>
          <select
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            <option value="">اختر الفئة</option>
            <option value="installations">التركيبات</option>
            <option value="maintenance">الصيانة</option>
            <option value="testing">الاختبارات</option>
            <option value="facilities">المرافق</option>
            <option value="training">التدريب</option>
          </select>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push('/admin/gallery')}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          >
            إلغاء
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'جاري الحفظ...' : 'حفظ'}
          </button>
        </div>
      </form>
    </div>
  );
}