"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Application {
  id: string;
  name: string;
  description: string;
  features: string[];
  images: string[];
  created_at: string;
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteApplication = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا التطبيق؟')) return;

    try {
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setApplications(applications.filter(a => a.id !== id));
    } catch (error) {
      console.error('Error deleting application:', error);
      alert('حدث خطأ أثناء حذف التطبيق');
    }
  };

  const filteredApplications = applications.filter(app =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">إدارة التطبيقات</h1>
          <p className="mt-2 text-gray-600">إدارة جميع تطبيقات الشركة</p>
        </div>
        <Link
          href="/admin/applications/new"
          className="inline-flex items-center px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          إضافة تطبيق جديد
        </Link>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="البحث في التطبيقات..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredApplications.map((app) => (
            <li key={app.id}>
              <div className="px-4 py-4 flex items-center justify-between">
                <div className="flex items-center">
                  {app.images.length > 0 && (
                    <Image
                      src={app.images[0]}
                      alt={app.name}
                      width={64}
                      height={64}
                      className="h-16 w-16 object-cover rounded-md mr-4"
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {app.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 max-w-md truncate">
                      {app.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {app.features.length} مميزات • {app.images.length} صور
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/admin/applications/${app.id}/edit`}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <Edit className="h-5 w-5" />
                  </Link>
                  <button
                    onClick={() => deleteApplication(app.id)}
                    className="p-2 text-red-400 hover:text-red-600"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {filteredApplications.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">لا توجد تطبيقات</p>
        </div>
      )}
    </div>
  );
}