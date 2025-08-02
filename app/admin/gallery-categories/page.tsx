"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { galleryCategoriesData, GalleryCategory } from '../../data/galleryCategoriesData';
import { Edit, Save, X, Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import Breadcrumb from '../../components/admin/Breadcrumb';

export default function GalleryCategoriesAdmin() {
  const [categories, setCategories] = useState<GalleryCategory[]>(galleryCategoriesData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    slug: '',
    display_order: 0,
    is_active: true
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
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
        setCategories(galleryCategoriesData);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('gallery_categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching categories:', error);
        setCategories(galleryCategoriesData);
      } else {
        setCategories(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
      setCategories(galleryCategoriesData);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleSave = async (category: GalleryCategory) => {
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
        setEditingId(null);
        setSaving(false);
        return;
      }

      const { error } = await supabase
        .from('gallery_categories')
        .update({
          name: category.name,
          description: category.description,
          slug: category.slug,
          display_order: category.display_order,
          is_active: category.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', category.id);

      if (error) {
        console.error('Error updating category:', error);
        alert('Error updating category');
      } else {
        setEditingId(null);
        fetchCategories();
        alert('Category updated successfully!');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error updating category');
    } finally {
      setSaving(false);
    }
  };

  const handleAdd = async () => {
    setSaving(true);
    try {
      // Auto-generate slug if not provided
      const slug = newCategory.slug || generateSlug(newCategory.name);
      
      // Check if Supabase is properly configured
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey || 
          supabaseUrl === 'your-supabase-url' || 
          supabaseKey === 'your-supabase-anon-key' ||
          supabaseUrl === 'https://placeholder.supabase.co' ||
          supabaseKey === 'placeholder-key') {
        // Mock add for development
        console.warn('Supabase not configured. Mock add successful.');
        const mockCategory: GalleryCategory = {
          id: `cat-${Date.now()}`,
          ...newCategory,
          slug,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setCategories([...categories, mockCategory]);
        setNewCategory({ name: '', description: '', slug: '', display_order: 0, is_active: true });
        setShowAddForm(false);
        setSaving(false);
        return;
      }

      const { error } = await supabase
        .from('gallery_categories')
        .insert({
          name: newCategory.name,
          description: newCategory.description,
          slug,
          display_order: newCategory.display_order,
          is_active: newCategory.is_active
        });

      if (error) {
        console.error('Error adding category:', error);
        alert('Error adding category');
      } else {
        setNewCategory({ name: '', description: '', slug: '', display_order: 0, is_active: true });
        setShowAddForm(false);
        fetchCategories();
        alert('Category added successfully!');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error adding category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      // Check if Supabase is properly configured
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey || 
          supabaseUrl === 'your-supabase-url' || 
          supabaseKey === 'your-supabase-anon-key' ||
          supabaseUrl === 'https://placeholder.supabase.co' ||
          supabaseKey === 'placeholder-key') {
        // Mock delete for development
        console.warn('Supabase not configured. Mock delete successful.');
        setCategories(categories.filter(cat => cat.id !== id));
        return;
      }

      const { error } = await supabase
        .from('gallery_categories')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting category:', error);
        alert('Error deleting category');
      } else {
        fetchCategories();
        alert('Category deleted successfully!');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error deleting category');
    }
  };

  const handleCategoryChange = (id: string, field: keyof GalleryCategory, value: any) => {
    setCategories(categories.map(cat => 
      cat.id === id ? { ...cat, [field]: value } : cat
    ));
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
        { name: 'Gallery Categories' }
      ]} />
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gallery Categories</h1>
          <p className="mt-2 text-gray-600">Manage gallery image categories</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Add New Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setNewCategory({ 
                    ...newCategory, 
                    name,
                    slug: newCategory.slug || generateSlug(name)
                  });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Category name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
              <input
                type="text"
                value={newCategory.slug}
                onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="category-slug"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Display Order</label>
              <input
                type="number"
                value={newCategory.display_order}
                onChange={(e) => setNewCategory({ ...newCategory, display_order: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                checked={newCategory.is_active}
                onChange={(e) => setNewCategory({ ...newCategory, is_active: e.target.checked })}
                className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
              />
              <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                Active
              </label>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={newCategory.description}
              onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Category description"
            />
          </div>
          <div className="flex space-x-4 mt-6">
            <button
              onClick={handleAdd}
              disabled={saving || !newCategory.name}
              className="bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-700 disabled:opacity-50 flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Adding...' : 'Add Category'}</span>
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setNewCategory({ name: '', description: '', slug: '', display_order: 0, is_active: true });
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center space-x-2"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      )}

      {/* Categories List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Slug
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((category) => (
              <tr key={category.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === category.id ? (
                    <input
                      type="text"
                      value={category.name}
                      onChange={(e) => handleCategoryChange(category.id, 'name', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  ) : (
                    <div>
                      <div className="text-sm font-medium text-gray-900">{category.name}</div>
                      {category.description && (
                        <div className="text-sm text-gray-500">{category.description}</div>
                      )}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === category.id ? (
                    <input
                      type="text"
                      value={category.slug}
                      onChange={(e) => handleCategoryChange(category.id, 'slug', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-900">{category.slug}</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === category.id ? (
                    <input
                      type="number"
                      value={category.display_order}
                      onChange={(e) => handleCategoryChange(category.id, 'display_order', parseInt(e.target.value) || 0)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-900">{category.display_order}</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === category.id ? (
                    <input
                      type="checkbox"
                      checked={category.is_active}
                      onChange={(e) => handleCategoryChange(category.id, 'is_active', e.target.checked)}
                      className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
                    />
                  ) : (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      category.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {category.is_active ? (
                        <>
                          <Eye className="h-3 w-3 mr-1" />
                          Active
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3 w-3 mr-1" />
                          Inactive
                        </>
                      )}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {editingId === category.id ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSave(category)}
                        disabled={saving}
                        className="text-green-600 hover:text-green-900 disabled:opacity-50"
                      >
                        <Save className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          fetchCategories(); // Reset changes
                        }}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingId(category.id)}
                        className="text-cyan-600 hover:text-cyan-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      {category.slug !== 'all' && (
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}