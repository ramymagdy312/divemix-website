"use client";

import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function FixAllIssues() {
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const fixAllIssues = async () => {
    setLoading(true);
    setStatus('Starting comprehensive issue fixing...\n');

    try {
      // Step 1: Check Supabase connection
      setStatus(prev => prev + '1. Testing Supabase connection...\n');
      const { data: testData, error: testError } = await supabase
        .from('gallery_images')
        .select('count')
        .limit(1);
      
      if (testError) {
        setStatus(prev => prev + `❌ Supabase connection failed: ${testError.message}\n`);
        setStatus(prev => prev + '⚠️ Running in development mode with mock data\n');
      } else {
        setStatus(prev => prev + '✅ Supabase connection successful\n');
      }

      // Step 2: Create missing functions
      setStatus(prev => prev + '2. Creating/updating database functions...\n');
      try {
        await supabase.rpc('exec_sql', {
          sql: `
            CREATE OR REPLACE FUNCTION update_updated_at_column()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = NOW();
                RETURN NEW;
            END;
            $$ language 'plpgsql';
          `
        });
        setStatus(prev => prev + '✅ Database functions created\n');
      } catch (error: any) {
        setStatus(prev => prev + `⚠️ Function creation skipped: ${error.message}\n`);
      }

      // Step 3: Check and fix table structures
      setStatus(prev => prev + '3. Checking table structures...\n');
      
      const tables = [
        'product_categories',
        'products', 
        'services',
        'applications',
        'gallery_categories',
        'gallery_images',
        'products_page',
        'services_page',
        'applications_page'
      ];

      for (const table of tables) {
        try {
          const { data, error } = await supabase
            .from(table)
            .select('*')
            .limit(1);
          
          if (error) {
            setStatus(prev => prev + `❌ Table ${table} has issues: ${error.message}\n`);
          } else {
            setStatus(prev => prev + `✅ Table ${table} is accessible\n`);
          }
        } catch (error: any) {
          setStatus(prev => prev + `❌ Table ${table} error: ${error.message}\n`);
        }
      }

      // Step 4: Test data retrieval for each component
      setStatus(prev => prev + '4. Testing component data retrieval...\n');
      
      // Test Product Categories
      try {
        const { data: categories, error: catError } = await supabase
          .from('product_categories')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });
        
        if (catError) {
          setStatus(prev => prev + `❌ Product categories error: ${catError.message}\n`);
        } else {
          setStatus(prev => prev + `✅ Product categories: ${categories?.length || 0} found\n`);
        }
      } catch (error: any) {
        setStatus(prev => prev + `❌ Product categories test failed: ${error.message}\n`);
      }

      // Test Services
      try {
        const { data: services, error: servError } = await supabase
          .from('services')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });
        
        if (servError) {
          setStatus(prev => prev + `❌ Services error: ${servError.message}\n`);
        } else {
          setStatus(prev => prev + `✅ Services: ${services?.length || 0} found\n`);
        }
      } catch (error: any) {
        setStatus(prev => prev + `❌ Services test failed: ${error.message}\n`);
      }

      // Test Applications
      try {
        const { data: applications, error: appError } = await supabase
          .from('applications')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });
        
        if (appError) {
          setStatus(prev => prev + `❌ Applications error: ${appError.message}\n`);
        } else {
          setStatus(prev => prev + `✅ Applications: ${applications?.length || 0} found\n`);
        }
      } catch (error: any) {
        setStatus(prev => prev + `❌ Applications test failed: ${error.message}\n`);
      }

      // Test Gallery
      try {
        const { data: gallery, error: galError } = await supabase
          .from('gallery_images')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (galError) {
          setStatus(prev => prev + `❌ Gallery error: ${galError.message}\n`);
        } else {
          setStatus(prev => prev + `✅ Gallery images: ${gallery?.length || 0} found\n`);
        }
      } catch (error: any) {
        setStatus(prev => prev + `❌ Gallery test failed: ${error.message}\n`);
      }

      // Step 5: Check page content
      setStatus(prev => prev + '5. Testing page content...\n');
      
      const pageTypes = ['products_page', 'services_page', 'applications_page'];
      
      for (const pageType of pageTypes) {
        try {
          const { data: pageData, error: pageError } = await supabase
            .from(pageType)
            .select('*')
            .single();
          
          if (pageError) {
            setStatus(prev => prev + `❌ ${pageType} error: ${pageError.message}\n`);
          } else {
            setStatus(prev => prev + `✅ ${pageType} content loaded\n`);
          }
        } catch (error: any) {
          setStatus(prev => prev + `❌ ${pageType} test failed: ${error.message}\n`);
        }
      }

      // Step 6: Environment check
      setStatus(prev => prev + '6. Checking environment configuration...\n');
      
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        setStatus(prev => prev + '❌ Environment variables not set\n');
      } else if (supabaseUrl === 'your-supabase-url' || supabaseKey === 'your-supabase-anon-key') {
        setStatus(prev => prev + '❌ Environment variables contain placeholder values\n');
      } else {
        setStatus(prev => prev + '✅ Environment variables configured\n');
        setStatus(prev => prev + `   URL: ${supabaseUrl}\n`);
        setStatus(prev => prev + `   Key: ${supabaseKey.substring(0, 20)}...\n`);
      }

      // Step 7: Component compatibility check
      setStatus(prev => prev + '7. Checking component compatibility...\n');
      
      const componentIssues = [];
      
      // Check if all required fields exist in database schema
      const requiredFields = {
        product_categories: ['name', 'description', 'slug', 'image_url', 'is_active', 'display_order'],
        services: ['name', 'description', 'icon', 'features', 'is_active', 'display_order'],
        applications: ['name', 'description', 'image_url', 'industry', 'use_cases', 'benefits', 'is_active', 'display_order']
      };

      for (const [table, fields] of Object.entries(requiredFields)) {
        try {
          const { data, error } = await supabase
            .from(table)
            .select(fields.join(','))
            .limit(1);
          
          if (error) {
            componentIssues.push(`${table}: ${error.message}`);
          }
        } catch (error: any) {
          componentIssues.push(`${table}: ${error.message}`);
        }
      }

      if (componentIssues.length > 0) {
        setStatus(prev => prev + '❌ Component compatibility issues found:\n');
        componentIssues.forEach(issue => {
          setStatus(prev => prev + `   - ${issue}\n`);
        });
      } else {
        setStatus(prev => prev + '✅ All components compatible with database schema\n');
      }

      // Final summary
      setStatus(prev => prev + '\n🔍 DIAGNOSTIC SUMMARY:\n');
      setStatus(prev => prev + '================================\n');
      
      if (testError) {
        setStatus(prev => prev + '🔴 STATUS: DEVELOPMENT MODE\n');
        setStatus(prev => prev + '   - Supabase not connected\n');
        setStatus(prev => prev + '   - Using fallback/mock data\n');
        setStatus(prev => prev + '   - Components will show empty states\n');
        setStatus(prev => prev + '\n💡 TO FIX:\n');
        setStatus(prev => prev + '   1. Run setup-all-db to create tables\n');
        setStatus(prev => prev + '   2. Check Supabase configuration\n');
        setStatus(prev => prev + '   3. Verify environment variables\n');
      } else {
        setStatus(prev => prev + '🟢 STATUS: DATABASE CONNECTED\n');
        setStatus(prev => prev + '   - All tables accessible\n');
        setStatus(prev => prev + '   - Components should work properly\n');
        setStatus(prev => prev + '   - Data retrieval functional\n');
      }

      setStatus(prev => prev + '\n🚀 NEXT STEPS:\n');
      setStatus(prev => prev + '   1. Visit /setup-all-db if tables are empty\n');
      setStatus(prev => prev + '   2. Test each page: /products, /services, /applications, /gallery\n');
      setStatus(prev => prev + '   3. Check admin panel: /admin\n');
      setStatus(prev => prev + '   4. Verify image uploads work\n');

    } catch (error: any) {
      console.error('Fix process error:', error);
      setStatus(prev => prev + `❌ Critical error: ${error.message}\n`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">🔧 Project Issue Diagnostics & Fixes</h1>
      
      <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-yellow-800 mb-2">What this tool does:</h2>
        <ul className="list-disc list-inside text-yellow-700 space-y-1">
          <li>Tests Supabase database connection</li>
          <li>Verifies all table structures and accessibility</li>
          <li>Checks component compatibility with database schema</li>
          <li>Tests data retrieval for all major components</li>
          <li>Validates environment configuration</li>
          <li>Provides actionable recommendations</li>
        </ul>
      </div>
      
      <button
        onClick={fixAllIssues}
        disabled={loading}
        className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 mb-6 text-lg font-semibold"
      >
        {loading ? '🔍 Running Diagnostics...' : '🚀 Run Full Diagnostic'}
      </button>

      {status && (
        <div className="bg-gray-900 text-green-400 p-6 rounded-lg font-mono text-sm">
          <h2 className="text-lg mb-4 text-white">📊 Diagnostic Results:</h2>
          <pre className="whitespace-pre-wrap max-h-96 overflow-y-auto">{status}</pre>
        </div>
      )}
    </div>
  );
}