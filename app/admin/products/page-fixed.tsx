"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit, Trash2, Search, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  description: string;
  short_description?: string;
  category_id: string;
  image_url?: string;
  price?: number;
  features?: string[];
  is_active: boolean;
  display_order: number;
  created_at: string;
  product_categories?: {
    name: string;
  };
}

// Fallback products data
const fallbackProducts: Product[] = [
  {
    id: '1',
    name: 'Professional Diving Mask',
    description: 'High-quality diving mask with anti-fog technology and comfortable silicone skirt',
    short_description: 'Crystal clear vision underwater',
    category_id: '1',
    image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800',
    price: 89.99,
    features: ['Anti-fog coating', 'Comfortable silicone skirt', 'Tempered glass lens'],
    is_active: true,
    display_order: 1,
    created_at: '2024-01-01T00:00:00Z',
    product_categories: { name: 'Diving Equipment' }
  },
  {
    id: '2',
    name: 'Diving Fins',
    description: 'Lightweight and efficient diving fins for better propulsion',
    short_description: 'Enhanced underwater mobility',
    category_id: '1',
    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800',
    price: 65.99,
    features: ['Lightweight design', 'Efficient blade shape', 'Comfortable foot pocket'],
    is_active: true,
    display_order: 2,
    created_at: '2024-01-02T00:00:00Z',
    product_categories: { name: 'Diving Equipment' }
  },
  {
    id: '3',
    name: 'Underwater Safety Light',
    description: 'Bright LED safety light for underwater visibility',
    short_description: 'Stay visible and safe underwater',
    category_id: '2',
    image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800',
    price: 45.99,
    features: ['Waterproof to 100m', 'Long battery life', 'Multiple flash modes'],
    is_active: true,
    display_order: 1,
    created_at: '2024-01-03T00:00:00Z',
    product_categories: { name: 'Safety Gear' }
  },
  {
    id: '4',
    name: 'Waterproof Action Camera',
    description: '4K underwater action camera with stabilization',
    short_description: 'Capture stunning underwater footage',
    category_id: '3',
    image_url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800',
    price: 299.99,
    features: ['4K video recording', 'Image stabilization', 'Waterproof to 30m'],
    is_active: true,
    display_order: 1,
    created_at: '2024-01-04T00:00:00Z',
    product_categories: { name: 'Underwater Cameras' }
  }
];

export default function ProductsPageFixed() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [usingFallback, setUsingFallback] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // Check if Supabase is configured
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey || 
          supabaseUrl === 'your-supabase-url' || 
          supabaseKey === 'your-supabase-anon-key' ||
          supabaseUrl === 'https://placeholder.supabase.co' ||
          supabaseKey === 'placeholder-key') {
        console.warn('Supabase not configured. Using fallback data.');
        setProducts(fallbackProducts);
        setUsingFallback(true);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_categories (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        setError(`Database error: ${error.message}`);
        setProducts(fallbackProducts);
        setUsingFallback(true);
      } else {
        setProducts(data || []);
        setUsingFallback(false);
      }
    } catch (error: any) {
      console.error('Error:', error);
      setError(`Connection error: ${error.message}`);
      setProducts(fallbackProducts);
      setUsingFallback(true);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (usingFallback) {
      alert('Cannot delete products in demo mode. Set up database to enable full functionality.');
      return;
    }

    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setProducts(products.filter(p => p.id !== id));
    } catch (error: any) {
      console.error('Error deleting product:', error);
      alert(`Error deleting product: ${error.message}`);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
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
                  <>Database error: {error}. Showing sample products.</>
                ) : (
                  <>Showing sample products. Database not configured.</>
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
          <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
          <p className="mt-2 text-gray-600">
            {usingFallback ? 'Managing sample products (Demo Mode)' : 'Managing all company products'}
          </p>
        </div>
        <div className="flex space-x-3">
          <Link
            href="/check-products-database"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <AlertCircle className="h-5 w-5 mr-2" />
            Database Setup
          </Link>
          <Link
            href="/admin/products/new"
            className={`inline-flex items-center px-4 py-2 rounded-md transition-colors ${
              usingFallback 
                ? 'bg-gray-400 text-white cursor-not-allowed' 
                : 'bg-cyan-600 text-white hover:bg-cyan-700'
            }`}
            onClick={(e) => {
              if (usingFallback) {
                e.preventDefault();
                alert('Set up database first to add real products');
              }
            }}
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Product
          </Link>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredProducts.map((product) => (
            <li key={product.id}>
              <div className="px-4 py-4 flex items-center justify-between">
                <div className="flex items-center">
                  {product.image_url && (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      width={64}
                      height={64}
                      className="h-16 w-16 object-cover rounded-md mr-4"
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {product.product_categories?.name}
                    </p>
                    <p className="text-sm text-gray-600 mt-1 max-w-md truncate">
                      {product.description}
                    </p>
                    {product.price && (
                      <p className="text-sm font-medium text-green-600 mt-1">
                        ${product.price}
                      </p>
                    )}
                    {usingFallback && (
                      <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full mt-1">
                        Demo Product
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className={`p-2 transition-colors ${
                      usingFallback 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                    onClick={(e) => {
                      if (usingFallback) {
                        e.preventDefault();
                        alert('Set up database first to edit products');
                      }
                    }}
                  >
                    <Edit className="h-5 w-5" />
                  </Link>
                  <button
                    onClick={() => deleteProduct(product.id)}
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

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found</p>
          {!usingFallback && (
            <Link
              href="/admin/products/new"
              className="mt-4 inline-flex items-center px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Your First Product
            </Link>
          )}
        </div>
      )}

      {/* Help Section */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-4">🚀 Getting Started</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div>
            <h4 className="font-medium mb-2">To Add Real Products:</h4>
            <ol className="space-y-1">
              <li>1. Set up database tables</li>
              <li>2. Configure product categories</li>
              <li>3. Add your products</li>
              <li>4. Manage inventory</li>
            </ol>
          </div>
          <div>
            <h4 className="font-medium mb-2">Current Features:</h4>
            <ul className="space-y-1">
              <li>• View sample products</li>
              <li>• Search functionality</li>
              <li>• Product categorization</li>
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
    </div>
  );
}