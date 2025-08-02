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
  image_url?: string;
  use_cases?: string[];
  benefits?: string[];
  is_active: boolean;
  display_order: number;
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
        .order('display_order', { ascending: true });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteApplication = async (id: string) => {
    if (!confirm('Are you sure you want to delete this application?')) return;

    try {
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setApplications(applications.filter(a => a.id !== id));
    } catch (error) {
      console.error('Error deleting application:', error);
      alert('Error deleting application');
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
          <h1 className="text-3xl font-bold text-gray-900">Applications Management</h1>
          <p className="mt-2 text-gray-600">Manage all company applications</p>
        </div>
        <Link
          href="/admin/applications/new"
          className="inline-flex items-center px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Application
        </Link>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search applications..."
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
                  {app.image_url && (
                    <Image
                      src={app.image_url}
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
                      {(app.use_cases || []).length} use cases • {(app.benefits || []).length} benefits
                      <span className={`ml-2 px-2 py-1 text-xs rounded ${app.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {app.is_active ? 'Active' : 'Inactive'}
                      </span>
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
          <p className="text-gray-500">No applications found</p>
        </div>
      )}
    </div>
  );
}