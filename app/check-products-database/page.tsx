"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { CheckCircle, XCircle, AlertCircle, Database, Copy, ExternalLink, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface TableStatus {
  name: string;
  exists: boolean;
  error?: string;
  count?: number;
}

export default function CheckProductsDatabase() {
  const [results, setResults] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [tableStatus, setTableStatus] = useState<TableStatus[]>([]);
  const [supabaseConfigured, setSupabaseConfigured] = useState(false);

  useEffect(() => {
    quickCheck();
  }, []);

  const quickCheck = async () => {
    // Check if Supabase is configured
    setSupabaseConfigured(true);

    const tables = ['product_categories', 'products'];
    const status: TableStatus[] = [];

    for (const tableName of tables) {
      try {
        const { data, error, count } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true });

        if (error) {
          status.push({ name: tableName, exists: false, error: error.message });
        } else {
          status.push({ name: tableName, exists: true, count: count || 0 });
        }
      } catch (error: any) {
        status.push({ name: tableName, exists: false, error: error.message });
      }
    }

    setTableStatus(status);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('SQL copied to clipboard!');
  };

  const createTablesSQL = `-- 🚀 Quick Setup: Products Database Tables
-- Copy and run this in your Supabase SQL Editor

-- 1. Create product_categories table
CREATE TABLE IF NOT EXISTS product_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create products table (without price)
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    short_description TEXT,
    category_id UUID REFERENCES product_categories(id) ON DELETE SET NULL,
    image_url TEXT,
    images TEXT[] DEFAULT '{}',
    features TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Insert sample categories
INSERT INTO product_categories (name, description, slug, image_url, is_active, display_order)
VALUES 
    ('Diving Equipment', 'Professional diving gear and equipment for all levels of divers', 'diving-equipment', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800', true, 1),
    ('Safety Gear', 'Essential safety equipment for underwater activities and diving', 'safety-gear', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800', true, 2),
    ('Underwater Cameras', 'Capture your underwater adventures with professional cameras', 'underwater-cameras', 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800', true, 3),
    ('Accessories', 'Essential accessories for diving and underwater activities', 'accessories', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800', true, 4),
    ('Wetsuits & Gear', 'High-quality wetsuits and thermal protection gear', 'wetsuits-gear', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800', true, 5),
    ('Maintenance Tools', 'Tools and equipment for maintaining your diving gear', 'maintenance-tools', 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800', true, 6)
ON CONFLICT (slug) DO NOTHING;

-- 4. Enable RLS and set policies
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON product_categories FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read access" ON products FOR SELECT USING (is_active = true);

GRANT SELECT ON product_categories TO anon;
GRANT SELECT ON products TO anon;

-- 🎉 Setup complete! Your database is ready.`;

  const checkDatabase = async () => {
    setIsRunning(true);
    setResults('🔍 Checking Products database tables...\n\n');

    try {
      // Check product_categories table
      setResults(prev => prev + '1. Checking product_categories table...\n');
      
      try {
        const { data: categories, error: categoriesError } = await supabase
          .from('product_categories')
          .select('*')
          .limit(1);

        if (categoriesError) {
          setResults(prev => prev + `   ❌ product_categories table error: ${categoriesError.message}\n`);
        } else {
          setResults(prev => prev + `   ✅ product_categories table exists\n`);
          setResults(prev => prev + `   📊 Sample data: ${categories?.length || 0} records found\n`);
        }
      } catch (error: any) {
        setResults(prev => prev + `   ❌ product_categories table not accessible: ${error.message}\n`);
      }

      // Check products table
      setResults(prev => prev + '\n2. Checking products table...\n');
      
      try {
        const { data: products, error: productsError } = await supabase
          .from('products')
          .select('*')
          .limit(1);

        if (productsError) {
          setResults(prev => prev + `   ❌ products table error: ${productsError.message}\n`);
        } else {
          setResults(prev => prev + `   ✅ products table exists\n`);
          setResults(prev => prev + `   📊 Sample data: ${products?.length || 0} records found\n`);
        }
      } catch (error: any) {
        setResults(prev => prev + `   ❌ products table not accessible: ${error.message}\n`);
      }

      // Check products_page table
      setResults(prev => prev + '\n3. Checking products_page table...\n');
      
      try {
        const { data: productsPage, error: productsPageError } = await supabase
          .from('products_page')
          .select('*')
          .limit(1);

        if (productsPageError) {
          setResults(prev => prev + `   ❌ products_page table error: ${productsPageError.message}\n`);
        } else {
          setResults(prev => prev + `   ✅ products_page table exists\n`);
          setResults(prev => prev + `   📊 Sample data: ${productsPage?.length || 0} records found\n`);
        }
      } catch (error: any) {
        setResults(prev => prev + `   ❌ products_page table not accessible: ${error.message}\n`);
      }

      // Check what tables actually exist
      setResults(prev => prev + '\n4. Checking all available tables...\n');
      
      try {
        // Get list of all tables
        const { data: tables, error: tablesError } = await supabase
          .from('information_schema.tables')
          .select('table_name')
          .eq('table_schema', 'public');

        if (tablesError) {
          setResults(prev => prev + `   ⚠️  Could not list tables: ${tablesError.message}\n`);
        } else {
          const tableNames = tables?.map(t => t.table_name) || [];
          setResults(prev => prev + `   📋 Available tables: ${tableNames.join(', ')}\n`);
          
          const productRelatedTables = tableNames.filter(name => 
            name.toLowerCase().includes('product') || 
            name.toLowerCase().includes('categor')
          );
          
          if (productRelatedTables.length > 0) {
            setResults(prev => prev + `   🎯 Product-related tables: ${productRelatedTables.join(', ')}\n`);
          } else {
            setResults(prev => prev + `   ⚠️  No product-related tables found\n`);
          }
        }
      } catch (error: any) {
        setResults(prev => prev + `   ❌ Could not check tables: ${error.message}\n`);
      }

      setResults(prev => prev + '\n5. Recommendations:\n');
      
      setResults(prev => prev + '   💡 If tables are missing, you need to:\n');
      setResults(prev => prev + '   • Create product_categories table\n');
      setResults(prev => prev + '   • Create products table\n');
      setResults(prev => prev + '   • Create products_page table (optional)\n');
      setResults(prev => prev + '   • Add sample data to test\n');
      
      setResults(prev => prev + '\n🎉 Database check complete!\n');

    } catch (error: any) {
      setResults(prev => prev + `\n❌ Database check failed: ${error.message}\n`);
    } finally {
      setIsRunning(false);
    }
  };

  const showCreateTablesSQL = () => {
    const createSQL = `
-- 🏗️ Create Products Database Tables
-- Run these commands in your Supabase SQL Editor

-- 1. Create product_categories table
CREATE TABLE IF NOT EXISTS product_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  slug VARCHAR(255) UNIQUE NOT NULL,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  short_description TEXT,
  image_url TEXT,
  category_id UUID REFERENCES product_categories(id),
  price DECIMAL(10,2),
  specifications JSONB,
  features TEXT[],
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create products_page table (for page content)
CREATE TABLE IF NOT EXISTS products_page (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) DEFAULT 'Our Products',
  description TEXT DEFAULT 'Discover our comprehensive range of products',
  hero_image TEXT DEFAULT 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=2000',
  intro_title VARCHAR(255) DEFAULT 'Product Categories',
  intro_description TEXT DEFAULT 'Browse our product categories to find exactly what you need',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Insert default products_page data
INSERT INTO products_page (title, description, hero_image, intro_title, intro_description)
VALUES (
  'Our Products',
  'Discover our comprehensive range of high-quality products designed to meet your needs',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=2000',
  'Product Categories',
  'Browse our product categories to find exactly what you need'
) ON CONFLICT DO NOTHING;

-- 5. Insert sample product categories
INSERT INTO product_categories (name, description, slug, image_url, display_order) VALUES
('Diving Equipment', 'Professional diving gear and equipment for all levels', 'diving-equipment', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800', 1),
('Safety Gear', 'Essential safety equipment for underwater activities', 'safety-gear', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800', 2),
('Underwater Cameras', 'Capture your underwater adventures with professional cameras', 'underwater-cameras', 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800', 3),
('Accessories', 'Essential accessories for diving and underwater activities', 'accessories', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800', 4)
ON CONFLICT (slug) DO NOTHING;

-- 6. Insert sample products
INSERT INTO products (name, description, short_description, category_id, price, features, display_order) VALUES
('Professional Diving Mask', 'High-quality diving mask with anti-fog technology', 'Crystal clear vision underwater', (SELECT id FROM product_categories WHERE slug = 'diving-equipment'), 89.99, ARRAY['Anti-fog coating', 'Comfortable silicone skirt', 'Tempered glass lens'], 1),
('Diving Fins', 'Lightweight and efficient diving fins for better propulsion', 'Enhanced underwater mobility', (SELECT id FROM product_categories WHERE slug = 'diving-equipment'), 65.99, ARRAY['Lightweight design', 'Efficient blade shape', 'Comfortable foot pocket'], 2),
('Underwater Safety Light', 'Bright LED safety light for underwater visibility', 'Stay visible and safe underwater', (SELECT id FROM product_categories WHERE slug = 'safety-gear'), 45.99, ARRAY['Waterproof to 100m', 'Long battery life', 'Multiple flash modes'], 1),
('Waterproof Action Camera', '4K underwater action camera with stabilization', 'Capture stunning underwater footage', (SELECT id FROM product_categories WHERE slug = 'underwater-cameras'), 299.99, ARRAY['4K video recording', 'Image stabilization', 'Waterproof to 30m'], 1)
ON CONFLICT DO NOTHING;

-- 7. Enable Row Level Security (optional)
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE products_page ENABLE ROW LEVEL SECURITY;

-- 8. Create policies for public read access
CREATE POLICY "Public can read product_categories" ON product_categories FOR SELECT USING (true);
CREATE POLICY "Public can read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public can read products_page" ON products_page FOR SELECT USING (true);

-- 9. Verify the tables were created
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
AND table_name IN ('product_categories', 'products', 'products_page')
ORDER BY table_name;
`;

    setResults(createSQL);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">🔍 Check Products Database</h1>
      
      <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-red-800 mb-2">🚨 Products Page Issue</h2>
        <p className="text-red-700 mb-2">
          The products page is not loading data from the database because the required tables are missing or not accessible.
        </p>
        <div className="text-sm text-red-600">
          <strong>Required tables:</strong>
          <ul className="mt-1 space-y-1">
            <li>• product_categories - for product categories</li>
            <li>• products - for individual products</li>
            <li>• products_page - for page content (optional)</li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <button
          onClick={checkDatabase}
          disabled={isRunning}
          className="bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 text-left"
        >
          <div className="font-semibold mb-1">🔍 Check Database Tables</div>
          <div className="text-sm opacity-90">Verify which tables exist and their status</div>
        </button>

        <button
          onClick={showCreateTablesSQL}
          className="bg-green-600 text-white px-6 py-4 rounded-lg hover:bg-green-700 text-left"
        >
          <div className="font-semibold mb-1">🏗️ Show Create Tables SQL</div>
          <div className="text-sm opacity-90">Get SQL commands to create missing tables</div>
        </button>
      </div>

      {results && (
        <div className="bg-gray-900 text-green-400 p-6 rounded-lg font-mono text-sm mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg text-white">📋 Database Check Results:</h2>
            <button
              onClick={() => navigator.clipboard.writeText(results)}
              className="bg-gray-700 text-white px-3 py-1 rounded text-xs hover:bg-gray-600"
            >
              📋 Copy
            </button>
          </div>
          <pre className="whitespace-pre-wrap max-h-96 overflow-y-auto">{results}</pre>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Current Issue</h3>
          <div className="text-sm text-yellow-700 space-y-2">
            <p>Products page shows:</p>
            <ul className="space-y-1">
              <li>• Loading spinner</li>
              <li>• Empty categories</li>
              <li>• Database connection errors</li>
              <li>• Missing table errors</li>
            </ul>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">🔧 Solution Steps</h3>
          <div className="text-sm text-blue-700 space-y-2">
            <ol className="space-y-1">
              <li>1. Check database status</li>
              <li>2. Create missing tables</li>
              <li>3. Insert sample data</li>
              <li>4. Test products page</li>
              <li>5. Add real product data</li>
            </ol>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-800 mb-2">✅ Expected Result</h3>
          <div className="text-sm text-green-700 space-y-2">
            <p>After fixing:</p>
            <ul className="space-y-1">
              <li>• Products page loads correctly</li>
              <li>• Categories display properly</li>
              <li>• Search functionality works</li>
              <li>• Product details accessible</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}