"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit, Trash2, Search, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  image_url: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
}

// Fallback categories for demo mode
const fallbackCategories: Category[] = [
  {
    id: '1',
    name: 'Diving Equipment',
    description: 'Professional diving gear and equipment for all levels of divers',
    slug: 'diving-equipment',
    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800',
    is_active: true,
    display_order: 1,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Safety Gear',
    description: 'Essential safety equipment for underwater activities and diving',
    slug: 'safety-gear',
    image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800',
    is_active: true,
    display_order: 2,
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Underwater Cameras',
    description: 'Capture your underwater adventures with professional cameras',
    slug: 'underwater-cameras',
    image_url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800',
    is_active: true,
    display_order: 3,
    created_at: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Accessories',
    description: 'Essential accessories for diving and underwater activities',
    slug: 'accessories',
    image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800',
    is_active: true,
    display_order: 4,
    created_at: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Wetsuits & Gear',
    description: 'High-quality wetsuits and thermal protection gear',
    slug: 'wetsuits-gear',
    image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800',
    is_active: true,
    display_order: 5,
    created_at: new Date().toISOString()
  },
  {
    id: '6',
    name: 'Maintenance Tools',
    description: 'Tools and equipment for maintaining your diving gear',
    slug: 'maintenance-tools',
    image_url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800',
    is_active: true,
    display_order: 6,
    created_at: new Date().toISOString()
  }
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [usingFallback, setUsingFallback] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      // Check if Supabase is configured
      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching categories:', error);
        setError(`Database error: ${error.message}`);
        setCategories(fallbackCategories);
        setUsingFallback(true);
      } else {
        setCategories(data || []);
        setUsingFallback(false);
      }
    } catch (error: any) {
      console.error('Error:', error);
      setError(`Connection error: ${error.message}`);
      setCategories(fallbackCategories);
      setUsingFallback(true);
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id: string) => {
    if (usingFallback) {
      return;
    }

    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const { error } = await supabase
        .from('product_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setCategories(categories.filter(c => c.id !== id));
      toast.success('Category deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting category:', error);
      toast.error(`Error deleting category: ${error.message}`);
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
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
      {/* Error/Demo Mode Banner */}
      {(usingFallback || error) && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-yellow-400 mr-3" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-yellow-800">
                {error ? 'Database Connection Issue' : 'Demo Mode Active'}
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                {error ? (
                  <>Database error: {error}. Showing sample categories.</>
                ) : (
                  <>Showing sample categories. Database not configured.</>
                )}
                <Link href="/check-products-database" className="underline ml-2">
                  Set up database →
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Categories Management</h1>
          <p className="mt-2 text-gray-600">
            {usingFallback ? 'Manage sample categories (Demo Mode)' : 'Manage product categories'}
          </p>
        </div>
        <Link
          href="/admin/categories/new"
          className={`inline-flex items-center px-4 py-2 rounded-md transition-colors ${
            usingFallback 
              ? 'bg-gray-400 text-white cursor-not-allowed' 
              : 'bg-cyan-600 text-white hover:bg-cyan-700'
          }`}
          onClick={(e) => {
            if (usingFallback) {
              e.preventDefault();
              }
          }}
        >
          <Plus className="h-5 w-5 mr-2" />
          {usingFallback ? 'Database Required' : 'Add New Category'}
        </Link>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search categories..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredCategories.map((category) => (
            <li key={category.id}>
              <div className="px-4 py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <Image
                    src={category.image_url}
                    alt={category.name}
                    width={64}
                    height={64}
                    className="h-16 w-16 object-cover rounded-md mr-4"
                  />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 max-w-md">
                      {category.description}
                    </p>
                    <div className="flex items-center mt-2 space-x-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        category.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {category.is_active ? 'Active' : 'Inactive'}
                      </span>
                      <span className="text-xs text-gray-500">
                        Order: {category.display_order}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/admin/categories/${category.id}/edit`}
                    className={`p-2 transition-colors ${
                      usingFallback 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                    onClick={(e) => {
                      if (usingFallback) {
                        e.preventDefault();
                        }
                    }}
                  >
                    <Edit className="h-5 w-5" />
                  </Link>
                  <button
                    onClick={() => deleteCategory(category.id)}
                    className={`p-2 transition-colors ${
                      usingFallback 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-red-400 hover:text-red-600'
                    }`}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {filteredCategories.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No categories found</p>
          {!usingFallback && (
            <Link
              href="/admin/categories/new"
              className="mt-4 inline-flex items-center px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Your First Category
            </Link>
          )}
        </div>
      )}

      {/* Help Section */}
      {usingFallback && (
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">🚀 Getting Started</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
            <div>
              <h4 className="font-medium mb-2">To Add Real Categories:</h4>
              <ol className="space-y-1">
                <li>1. Set up database tables</li>
                <li>2. Configure product categories</li>
                <li>3. Add your categories</li>
                <li>4. Manage products</li>
              </ol>
            </div>
            <div>
              <h4 className="font-medium mb-2">Current Features:</h4>
              <ul className="space-y-1">
                <li>• View sample categories</li>
                <li>• Search functionality</li>
                <li>• Category management</li>
                <li>• Image management</li>
              </ul>
            </div>
          </div>
          <div className="mt-4">
            <Link
              href="/check-products-database"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Set Up Database Now →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}