"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { productsPageData } from '../../data/productsPageData';
import { Edit, Save, X } from 'lucide-react';
import ImageUpload from '../../components/admin/ImageUpload';
import Image from 'next/image';
import Breadcrumb from '../../components/admin/Breadcrumb';
import toast from 'react-hot-toast';

interface ProductsPageData {
  id: string;
  title: string;
  description: string;
  hero_image: string;
  intro_title: string;
  intro_description: string;
}

export default function ProductsPageAdmin() {
  const [data, setData] = useState<ProductsPageData>(productsPageData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchProductsPageData();
  }, []);

  const fetchProductsPageData = async () => {
    try {
      // Check if Supabase is properly configured
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey || 
          supabaseUrl === 'your-supabase-url' || 
          supabaseKey === 'your-supabase-anon-key' ||
          supabaseUrl === 'https://placeholder.supabase.co' ||
          supabaseKey === 'placeholder-key') {
        // Use mock data for development
        console.warn('Supabase not configured. Using mock data.');
        setData(productsPageData);
        setLoading(false);
        return;
      }

      const { data: pageData, error } = await supabase
        .from('products_page')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching products page data:', error);
        setData(productsPageData);
      } else {
        setData(pageData);
      }
    } catch (error) {
      console.error('Error:', error);
      setData(productsPageData);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Check if Supabase is properly configured
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey || 
          supabaseUrl === 'your-supabase-url' || 
          supabaseKey === 'your-supabase-anon-key' ||
          supabaseUrl === 'https://placeholder.supabase.co' ||
          supabaseKey === 'placeholder-key') {
        // Mock save for development
        console.warn('Supabase not configured. Mock save successful.');
        setEditing(false);
        setSaving(false);
        return;
      }

      const { error } = await supabase
        .from('products_page')
        .upsert({
          ...data,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving products page data:', error);
        toast.error('Error saving data');
      } else {
        setEditing(false);
        toast.success('Products page updated successfully!');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error saving data');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb items={[
        { name: 'Pages' },
        { name: 'Products Page' }
      ]} />
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products Page Management</h1>
          <p className="mt-2 text-gray-600">Manage the content of your Products page</p>
        </div>
        <div className="flex space-x-4">
          {editing ? (
            <>
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center space-x-2"
              >
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-700 flex items-center space-x-2 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-700 flex items-center space-x-2"
            >
              <Edit className="h-4 w-4" />
              <span>Edit Page</span>
            </button>
          )}
        </div>
      </div>

      <div className="space-y-8">
        {/* Basic Info */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Page Title
              </label>
              {editing ? (
                <input
                  type="text"
                  value={data.title}
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              ) : (
                <p className="text-gray-900">{data.title}</p>
              )}
            </div>
            <div>
              {editing ? (
                <ImageUpload
                  currentImage={data.hero_image}
                  onImageChange={(imageUrl) => setData({ ...data, hero_image: imageUrl })}
                  label="Hero Image"
                />
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hero Image
                  </label>
                  {data.hero_image ? (
                    <div className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-300">
                      <Image
                        src={data.hero_image}
                        alt="Hero image"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No image uploaded</p>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            {editing ? (
              <textarea
                value={data.description}
                onChange={(e) => setData({ ...data, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            ) : (
              <p className="text-gray-900">{data.description}</p>
            )}
          </div>
        </div>

        {/* Intro Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Introduction Section</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Intro Title
              </label>
              {editing ? (
                <input
                  type="text"
                  value={data.intro_title}
                  onChange={(e) => setData({ ...data, intro_title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              ) : (
                <p className="text-gray-900">{data.intro_title}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Intro Description
              </label>
              {editing ? (
                <textarea
                  value={data.intro_description}
                  onChange={(e) => setData({ ...data, intro_description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              ) : (
                <p className="text-gray-900">{data.intro_description}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}