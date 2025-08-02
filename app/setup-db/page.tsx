"use client";

import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function SetupDB() {
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const setupDatabase = async () => {
    setLoading(true);
    setStatus('Starting database setup...\n');

    try {
      // Step 1: Create update function
      setStatus(prev => prev + 'Creating update function...\n');
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

      // Step 2: Create categories table
      setStatus(prev => prev + 'Creating gallery_categories table...\n');
      const { error: categoriesError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS gallery_categories (
              id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
              name TEXT NOT NULL UNIQUE,
              description TEXT,
              slug TEXT NOT NULL UNIQUE,
              display_order INTEGER DEFAULT 0,
              is_active BOOLEAN DEFAULT true,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      });

      if (categoriesError) {
        throw new Error(`Categories table error: ${categoriesError.message}`);
      }

      // Step 3: Create categories trigger
      setStatus(prev => prev + 'Creating categories trigger...\n');
      await supabase.rpc('exec_sql', {
        sql: `
          DROP TRIGGER IF EXISTS update_gallery_categories_updated_at ON gallery_categories;
          CREATE TRIGGER update_gallery_categories_updated_at 
              BEFORE UPDATE ON gallery_categories 
              FOR EACH ROW 
              EXECUTE FUNCTION update_updated_at_column();
        `
      });

      // Step 4: Insert categories
      setStatus(prev => prev + 'Inserting categories...\n');
      const { error: insertCategoriesError } = await supabase
        .from('gallery_categories')
        .upsert([
          { name: 'Installations', description: 'Industrial compressor installations and setup', slug: 'installations', display_order: 1 },
          { name: 'Maintenance', description: 'Maintenance workshops and service operations', slug: 'maintenance', display_order: 2 },
          { name: 'Testing', description: 'Quality testing processes and procedures', slug: 'testing', display_order: 3 },
          { name: 'Facilities', description: 'Our manufacturing facilities and equipment', slug: 'facilities', display_order: 4 },
          { name: 'Training', description: 'Training sessions and educational programs', slug: 'training', display_order: 5 }
        ], { onConflict: 'slug' });

      if (insertCategoriesError) {
        throw new Error(`Insert categories error: ${insertCategoriesError.message}`);
      }

      // Step 5: Create images table
      setStatus(prev => prev + 'Creating gallery_images table...\n');
      const { error: imagesError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS gallery_images (
              id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
              title TEXT NOT NULL,
              url TEXT NOT NULL,
              category TEXT,
              category_id UUID REFERENCES gallery_categories(id) ON DELETE SET NULL,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      });

      if (imagesError) {
        throw new Error(`Images table error: ${imagesError.message}`);
      }

      // Step 6: Create images trigger
      setStatus(prev => prev + 'Creating images trigger...\n');
      await supabase.rpc('exec_sql', {
        sql: `
          DROP TRIGGER IF EXISTS update_gallery_images_updated_at ON gallery_images;
          CREATE TRIGGER update_gallery_images_updated_at 
              BEFORE UPDATE ON gallery_images 
              FOR EACH ROW 
              EXECUTE FUNCTION update_updated_at_column();
        `
      });

      // Step 7: Get category IDs
      setStatus(prev => prev + 'Getting category IDs...\n');
      const { data: categories } = await supabase
        .from('gallery_categories')
        .select('id, slug');

      const categoryMap = categories?.reduce((acc: any, cat: any) => {
        acc[cat.slug] = cat.id;
        return acc;
      }, {}) || {};

      // Step 8: Insert images
      setStatus(prev => prev + 'Inserting images...\n');
      const images = [
        { title: 'Industrial Compressor Installation', url: '/img/gallery/4big.jpg', category: 'installations', category_id: categoryMap.installations },
        { title: 'Maintenance Workshop', url: '/img/gallery/11big.jpg', category: 'maintenance', category_id: categoryMap.maintenance },
        { title: 'Quality Testing Process', url: '/img/gallery/12big.jpg', category: 'testing', category_id: categoryMap.testing },
        { title: 'Advanced Manufacturing Facility', url: '/img/gallery/Al Ahmadeya.jpg', category: 'facilities', category_id: categoryMap.facilities },
        { title: 'Training Session', url: '/img/gallery/Al Ahram.jpg', category: 'training', category_id: categoryMap.training },
        { title: 'Manufacturing Facility Equipment', url: '/img/gallery/Al_Ahmadeya.jpg', category: 'facilities', category_id: categoryMap.facilities },
        { title: 'Advanced Installation Project', url: '/img/gallery/Alamia Advanced.jpg', category: 'installations', category_id: categoryMap.installations },
        { title: 'Industrial Installation - Qaliub', url: '/img/gallery/Alamia Qaliub.jpg', category: 'installations', category_id: categoryMap.installations },
        { title: 'Maintenance Operations', url: '/img/gallery/maintenence.jpg', category: 'maintenance', category_id: categoryMap.maintenance },
        { title: 'Egyptian Methanex Testing', url: '/img/gallery/Egyptian Methanex.jpg', category: 'testing', category_id: categoryMap.testing },
        { title: 'Installation Documentation', url: '/img/gallery/DSC00502.jpg', category: 'installations', category_id: categoryMap.installations },
        { title: 'Best Analog Compressor Facility', url: '/img/gallery/BEST_ANALOG_COMPRESSOR_BG.jpg', category: 'facilities', category_id: categoryMap.facilities },
        { title: 'Alex Pharma Installation', url: '/img/gallery/Alex Pharma.jpg', category: 'installations', category_id: categoryMap.installations },
        { title: 'Danone Egypt Testing', url: '/img/gallery/Danone Egypt.jpg', category: 'testing', category_id: categoryMap.testing },
        { title: 'EgyRoll Maintenance', url: '/img/gallery/EgyRoll.jpg', category: 'maintenance', category_id: categoryMap.maintenance },
        { title: 'Training Documentation', url: '/img/gallery/IMG_4019.jpg', category: 'training', category_id: categoryMap.training }
      ];

      const { error: insertImagesError } = await supabase
        .from('gallery_images')
        .upsert(images, { onConflict: 'url' });

      if (insertImagesError) {
        throw new Error(`Insert images error: ${insertImagesError.message}`);
      }

      setStatus(prev => prev + '✅ Database setup completed successfully!\n');
      setStatus(prev => prev + 'You can now go to /gallery to see the images from database.\n');

    } catch (error: any) {
      console.error('Setup error:', error);
      setStatus(prev => prev + `❌ Error: ${error.message}\n`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Database Setup</h1>
      <p className="mb-4 text-gray-600">
        This will create the necessary tables and insert sample data for the gallery.
      </p>
      
      <button
        onClick={setupDatabase}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50 mb-4"
      >
        {loading ? 'Setting up...' : 'Setup Database'}
      </button>

      {status && (
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg mb-2">Setup Status:</h2>
          <pre className="whitespace-pre-wrap text-sm">{status}</pre>
        </div>
      )}
    </div>
  );
}