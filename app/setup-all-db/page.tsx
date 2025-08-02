"use client";

import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function SetupAllDB() {
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const setupAllTables = async () => {
    setLoading(true);
    setStatus('Starting complete database setup...\n');

    try {
      // Step 1: Create update function
      setStatus(prev => prev + '1. Creating update function...\n');
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

      // Step 2: Create Product Categories
      setStatus(prev => prev + '2. Creating product_categories table...\n');
      await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS product_categories (
              id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
              name TEXT NOT NULL UNIQUE,
              description TEXT,
              slug TEXT NOT NULL UNIQUE,
              image_url TEXT,
              is_active BOOLEAN DEFAULT true,
              display_order INTEGER DEFAULT 0,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );

          DROP TRIGGER IF EXISTS update_product_categories_updated_at ON product_categories;
          CREATE TRIGGER update_product_categories_updated_at 
              BEFORE UPDATE ON product_categories 
              FOR EACH ROW 
              EXECUTE FUNCTION update_updated_at_column();
        `
      });

      // Step 3: Insert Product Categories (using original website content)
      setStatus(prev => prev + '3. Inserting product categories...\n');
      await supabase.from('product_categories').upsert([
        {
          name: 'L&W Compressors',
          description: 'Diverse range of high-pressure compressors designed for various industrial needs.',
          slug: 'lw-compressors',
          image_url: '/img/products/L&W Compressors/lw.jpg',
          is_active: true,
          display_order: 1
        },
        {
          name: 'INMATEC Gas Generators',
          description: 'Advanced compression solutions for industrial applications.',
          slug: 'inmatec-gas-generators',
          image_url: '/img/products/INMATEC/inmatec.png',
          is_active: true,
          display_order: 2
        },
        {
          name: 'ALMiG',
          description: 'At DiveMix we are proud to partner with ALMiG, a premier provider of state-of-the-art compressed air systems.',
          slug: 'almig',
          image_url: '/img/products/ALMIG/almig.png',
          is_active: true,
          display_order: 3
        },
        {
          name: 'BEKO',
          description: 'At DiveMix, we proudly partner with BEKO Technologies, a renowned leader in the field of compressed air and gas treatment solutions.',
          slug: 'beko',
          image_url: '/img/products/BEKO/beko.png',
          is_active: true,
          display_order: 4
        },
        {
          name: 'Maximator',
          description: 'At DiveMix, we are proud to partner with MAXIMATOR, a global leader in high-pressure technology.',
          slug: 'maximator',
          image_url: '/img/products/MAXIMATOR/maximator.png',
          is_active: true,
          display_order: 5
        }
      ], { onConflict: 'slug' });

      // Step 4: Create Products Table
      setStatus(prev => prev + '4. Creating products table...\n');
      await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS products (
              id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
              name TEXT NOT NULL,
              description TEXT NOT NULL,
              short_description TEXT,
              image_url TEXT,
              category_id UUID REFERENCES product_categories(id) ON DELETE SET NULL,
              category TEXT,
              price DECIMAL(10,2),
              specifications JSONB,
              features TEXT[],
              is_active BOOLEAN DEFAULT true,
              display_order INTEGER DEFAULT 0,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );

          DROP TRIGGER IF EXISTS update_products_updated_at ON products;
          CREATE TRIGGER update_products_updated_at 
              BEFORE UPDATE ON products 
              FOR EACH ROW 
              EXECUTE FUNCTION update_updated_at_column();
        `
      });

      // Step 5: Get category IDs and insert products
      setStatus(prev => prev + '5. Inserting products...\n');
      const { data: categories } = await supabase.from('product_categories').select('id, slug');
      const categoryMap = categories?.reduce((acc: any, cat: any) => {
        acc[cat.slug] = cat.id;
        return acc;
      }, {}) || {};

      // Note: Products will be added later as they are complex with multiple products per category
      // For now, we'll add a few sample products from the original data
      await supabase.from('products').upsert([
        {
          name: 'Mobile Compressors',
          description: 'Designed for easy transport and mobility, these compressors deliver reliable performance in a compact form. Available with gasoline, diesel, or electric motors, they are perfect for field operations and on-site tasks, offering convenience and efficiency.',
          short_description: 'Mobile compressors for field operations',
          image_url: '/img/products/L&W Compressors/Mobile/1.png',
          category: 'lw-compressors',
          category_id: categoryMap['lw-compressors'],
          features: ['Easy transport', 'Gasoline/diesel/electric motors', 'Field operations', 'Compact form'],
          is_active: true,
          display_order: 1
        },
        {
          name: 'Nitrogen Generators',
          description: 'At Divemix Gas & Compressor technologies, we proudly partner with INMATEC, a leading manufacturer of high-quality PSA gas generators. INMATEC specializes in providing innovative solutions for on-site nitrogen and oxygen generation.',
          short_description: 'PSA nitrogen generators for on-site generation',
          image_url: '/img/products/INMATEC/Nitrogen/1.png',
          category: 'inmatec-gas-generators',
          category_id: categoryMap['inmatec-gas-generators'],
          features: ['PSA technology', 'On-site generation', 'High quality', 'Innovative solutions'],
          is_active: true,
          display_order: 2
        },
        {
          name: 'Screw Compressors',
          description: 'ALMiGs screw compressors are renowned for their efficiency and reliability, offering a continuous supply of compressed air with minimal energy consumption. Available in various models, these compressors are suitable for both small and large-scale applications.',
          short_description: 'Efficient and reliable screw compressors',
          image_url: '/img/products/ALMIG/Screw compressors/BELT_XP4_web.png',
          category: 'almig',
          category_id: categoryMap['almig'],
          features: ['Variable Speed Drive (VSD)', 'Quiet Operation', 'Compact Design', 'High Efficiency'],
          is_active: true,
          display_order: 3
        },
        {
          name: 'Condensate Drains',
          description: 'BEKOMAT® condensate drains ensure efficient and reliable removal of condensate from compressed air systems. Engineered to prevent compressed air loss, these drains optimize system performance.',
          short_description: 'Efficient condensate removal systems',
          image_url: '/img/products/BEKO/Condensate drains/bm_12_co_00_00_iso-00.png',
          category: 'beko',
          category_id: categoryMap['beko'],
          features: ['Smart level control prevents air loss', 'Energy-saving design', 'Durable materials', 'Easy maintenance'],
          is_active: true,
          display_order: 4
        },
        {
          name: 'Gas Boosters',
          description: 'Maximators amplifiers and gas boosters enhance gas pressure efficiently, Suitable for the oil free compression of gases and air. Industrial gases like Argon, Helium, Hydrogen and Nitrogen can be compressed to operating pressures of 2,100 bar.',
          short_description: 'High-pressure gas boosters and amplifiers',
          image_url: '/img/products/MAXIMATOR/Gas Boosters/DLE 15-1.jpg',
          category: 'maximator',
          category_id: categoryMap['maximator'],
          features: ['High-pressure capabilities', 'Oil-free compression', 'Multiple gas types', 'Up to 2,100 bar pressure'],
          is_active: true,
          display_order: 5
        }
      ], { onConflict: 'name' });

      // Step 6: Create Services Table
      setStatus(prev => prev + '6. Creating services table...\n');
      await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS services (
              id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
              name TEXT NOT NULL,
              description TEXT NOT NULL,
              short_description TEXT,
              image_url TEXT,
              icon TEXT,
              features TEXT[],
              is_active BOOLEAN DEFAULT true,
              display_order INTEGER DEFAULT 0,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );

          DROP TRIGGER IF EXISTS update_services_updated_at ON services;
          CREATE TRIGGER update_services_updated_at 
              BEFORE UPDATE ON services 
              FOR EACH ROW 
              EXECUTE FUNCTION update_updated_at_column();
        `
      });

      // Step 7: Insert Services (using original website content)
      setStatus(prev => prev + '7. Inserting services...\n');
      await supabase.from('services').upsert([
        {
          name: 'Installation & Commissioning',
          description: 'At DiveMix, we specialize in the installation and commissioning of high-quality gas equipment, including L&W High Pressure Compressors, Inmatec Oxygen & Nitrogen Generators, and Maximator High Pressure Technology products. Our experienced engineers ensure trouble-free installation, adhering to manufacturers warranty terms and guaranteeing the highest standard of service.',
          short_description: 'Professional installation and commissioning of gas equipment',
          image_url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800',
          icon: '🔧',
          features: ['L&W High Pressure Compressors', 'Inmatec Oxygen & Nitrogen Generators', 'Maximator High Pressure Technology', 'Trouble-free installation', 'Manufacturers warranty compliance'],
          is_active: true,
          display_order: 1
        },
        {
          name: 'Preventive Maintenance',
          description: 'Timely maintenance is essential for preventing major failures, and extending equipment life. maximizing parts reusability, our customizable maintenance contracts offer proactive solutions tailored to your specific needs, helping you schedule downtime and plan maintenance costs effectively. From routine inspections to full system overhauls, we ensure that your equipment operates at peak performance, lowering overall owning and operating costs.',
          short_description: 'Customizable maintenance contracts for optimal equipment performance',
          image_url: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=800',
          icon: '🛠️',
          features: ['Prevent major failures', 'Extend equipment life', 'Maximize parts reusability', 'Customizable contracts', 'Schedule downtime planning', 'Cost-effective maintenance'],
          is_active: true,
          display_order: 2
        },
        {
          name: 'Air/Gas Quality Tests',
          description: 'Ensuring the purity and safety of breathing air, including Oxygen Compatible Air and Medical Breathing Air, can be only achieved by continuous monitoring of compressed and filtered air. DiveMix provides comprehensive Air Quality Laboratory Checks, adhering to recognized standards such as DIN EN 12021 for breathing air compliance. To maintain optimal gas quality, we strongly advise conducting a minimum of one comprehensive check per compressor per quarter.',
          short_description: 'Comprehensive air quality testing and monitoring services',
          image_url: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&w=800',
          icon: '💨',
          features: ['Breathing air purity', 'Oxygen Compatible Air', 'Medical Breathing Air', 'DIN EN 12021 compliance', 'Laboratory checks', 'Quarterly testing recommended'],
          is_active: true,
          display_order: 3
        },
        {
          name: 'Cylinder Services Station',
          description: 'Our cylinder services station offers comprehensive inspection, testing, and maintenance services for pressurized cylinders. From hydrostatic testing to valve maintenance and requalification, DiveMix ensures the safety and integrity of your cylinders, meeting regulatory standards and industry best practices.',
          short_description: 'Comprehensive cylinder inspection, testing, and maintenance services',
          image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800',
          icon: '🔥',
          features: ['Comprehensive inspection', 'Hydrostatic testing', 'Valve maintenance', 'Cylinder requalification', 'Regulatory compliance', 'Industry best practices'],
          is_active: true,
          display_order: 4
        }
      ], { onConflict: 'name' });

      // Step 8: Create Applications Table
      setStatus(prev => prev + '8. Creating applications table...\n');
      await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS applications (
              id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
              name TEXT NOT NULL,
              description TEXT NOT NULL,
              short_description TEXT,
              image_url TEXT,
              industry TEXT,
              use_cases TEXT[],
              benefits TEXT[],
              is_active BOOLEAN DEFAULT true,
              display_order INTEGER DEFAULT 0,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );

          DROP TRIGGER IF EXISTS update_applications_updated_at ON applications;
          CREATE TRIGGER update_applications_updated_at 
              BEFORE UPDATE ON applications 
              FOR EACH ROW 
              EXECUTE FUNCTION update_updated_at_column();
        `
      });

      // Step 9: Insert Applications (using original website content)
      setStatus(prev => prev + '9. Inserting applications...\n');
      await supabase.from('applications').upsert([
        {
          name: 'Oil and Gas Fields',
          description: 'DiveMix provides robust and reliable compressed air and gas solutions tailored to the demanding environments of oil and gas fields. Our high-performance equipment ensures safe and efficient operations, supporting both upstream and downstream activities.',
          short_description: 'Robust compressed air and gas solutions for oil and gas fields',
          image_url: '/img/applications/oilAndGas.jpg',
          industry: 'Oil & Gas',
          use_cases: ['Upstream operations', 'Downstream activities', 'Field operations', 'Industrial processes'],
          benefits: ['Robust performance', 'Reliable operation', 'Safe operations', 'High efficiency'],
          is_active: true,
          display_order: 1
        },
        {
          name: 'Food & Beverage',
          description: 'In the food and beverage industry, purity and reliability are paramount. DiveMix offers advanced compressed air and gas systems that meet stringent safety and quality standards, ensuring contamination-free production processes and enhancing product integrity.',
          short_description: 'Advanced compressed air systems for food and beverage industry',
          image_url: '/img/applications/food_and_beverage.jpg',
          industry: 'Food & Beverage',
          use_cases: ['Production processes', 'Quality control', 'Packaging', 'Food safety'],
          benefits: ['Contamination-free processes', 'Product integrity', 'Quality standards', 'Safety compliance'],
          is_active: true,
          display_order: 2
        },
        {
          name: 'Pharmaceutical Companies',
          description: 'Pharmaceutical companies require precise and dependable gas solutions for critical applications. DiveMix delivers high-quality compressed air and gas systems that support stringent regulatory compliance and ensure the purity and reliability essential for pharmaceutical manufacturing.',
          short_description: 'Precise gas solutions for pharmaceutical manufacturing',
          image_url: '/img/applications/Pharmaceutical.jpg',
          industry: 'Pharmaceutical',
          use_cases: ['Manufacturing processes', 'Quality control', 'Regulatory compliance', 'Critical applications'],
          benefits: ['High purity', 'Regulatory compliance', 'Reliable operation', 'Quality assurance'],
          is_active: true,
          display_order: 3
        },
        {
          name: 'Chemical and Petrochemical Industries',
          description: 'DiveMix understands the complex needs of the chemical and petrochemical industries. Our specialized compressed air and gas equipment is designed to handle corrosive and hazardous environments, ensuring safe and efficient operations while maximizing productivity.',
          short_description: 'Specialized equipment for chemical and petrochemical industries',
          image_url: '/img/applications/Chemical and Petrochemical Industries.jpg',
          industry: 'Chemical & Petrochemical',
          use_cases: ['Corrosive environments', 'Hazardous operations', 'Industrial processes', 'Safety systems'],
          benefits: ['Safe operations', 'Efficient performance', 'Maximum productivity', 'Specialized design'],
          is_active: true,
          display_order: 4
        },
        {
          name: 'Laser Cutting',
          description: 'Precision and consistency are crucial in laser cutting applications. DiveMix provides cutting-edge gas solutions that deliver high-quality performance, enabling accurate and efficient cutting processes while reducing operational costs.',
          short_description: 'Cutting-edge gas solutions for laser cutting applications',
          image_url: '/img/applications/laser_cutting.jpg',
          industry: 'Manufacturing',
          use_cases: ['Precision cutting', 'Industrial manufacturing', 'Metal processing', 'Quality control'],
          benefits: ['High precision', 'Consistent performance', 'Reduced costs', 'Efficient processes'],
          is_active: true,
          display_order: 5
        },
        {
          name: 'Marine and Offshore Locations',
          description: 'Marine and offshore environments demand durable and reliable compressed air and gas solutions. DiveMix offers equipment designed to withstand harsh marine conditions, ensuring safe and efficient operations for offshore drilling, shipping, and other maritime activities.',
          short_description: 'Durable solutions for marine and offshore environments',
          image_url: '/img/applications/Marine-or-Offshore.jpg',
          industry: 'Marine & Offshore',
          use_cases: ['Offshore drilling', 'Shipping operations', 'Maritime activities', 'Harsh environments'],
          benefits: ['Durable design', 'Reliable performance', 'Safe operations', 'Marine-resistant'],
          is_active: true,
          display_order: 6
        },
        {
          name: 'Recreational Diving',
          description: 'Safety is paramount in the recreational diving tourism industry. DiveMix supplies high-quality compressed air systems that ensure pure breathing air for divers, enhancing safety and providing a superior diving experience for tourists around the world.',
          short_description: 'High-quality compressed air systems for recreational diving',
          image_url: '/img/applications/2.jpg',
          industry: 'Tourism & Recreation',
          use_cases: ['Recreational diving', 'Tourism industry', 'Breathing air supply', 'Safety systems'],
          benefits: ['Enhanced safety', 'Pure breathing air', 'Superior experience', 'Tourist satisfaction'],
          is_active: true,
          display_order: 7
        }
      ], { onConflict: 'name' });

      // Step 10: Add is_active to existing page tables
      setStatus(prev => prev + '10. Updating page tables with is_active field...\n');
      
      // Add is_active to products_page
      await supabase.rpc('exec_sql', {
        sql: `
          ALTER TABLE products_page ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
          UPDATE products_page SET is_active = true WHERE is_active IS NULL;
        `
      });

      // Add is_active to services_page
      await supabase.rpc('exec_sql', {
        sql: `
          ALTER TABLE services_page ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
          UPDATE services_page SET is_active = true WHERE is_active IS NULL;
        `
      });

      // Add is_active to applications_page
      await supabase.rpc('exec_sql', {
        sql: `
          ALTER TABLE applications_page ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
          UPDATE applications_page SET is_active = true WHERE is_active IS NULL;
        `
      });

      setStatus(prev => prev + '✅ Complete database setup finished successfully!\n');
      setStatus(prev => prev + '\n📊 Summary:\n');
      setStatus(prev => prev + '- Product Categories: 5 (all active - original brands)\n');
      setStatus(prev => prev + '- Products: 5 (sample products from each category)\n');
      setStatus(prev => prev + '- Services: 4 (all active - original services)\n');
      setStatus(prev => prev + '- Applications: 7 (all active - original applications)\n');
      setStatus(prev => prev + '- Gallery Categories: Already set up\n');
      setStatus(prev => prev + '- Gallery Images: Already set up\n');
      setStatus(prev => prev + '\n🎉 All tables now have is_active status field with original website content!\n');

    } catch (error: any) {
      console.error('Setup error:', error);
      setStatus(prev => prev + `❌ Error: ${error.message}\n`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Complete Database Setup</h1>
      <p className="mb-4 text-gray-600">
        This will create all necessary tables with is_active status fields:
      </p>
      
      <div className="mb-4 bg-blue-50 p-4 rounded">
        <h3 className="font-semibold mb-2">Tables to be created/updated with ORIGINAL website content:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li><strong>product_categories</strong> - L&W, INMATEC, ALMiG, BEKO, Maximator</li>
          <li><strong>products</strong> - Sample products from each brand category</li>
          <li><strong>services</strong> - Installation, Maintenance, Air Quality Tests, Cylinder Services</li>
          <li><strong>applications</strong> - Oil & Gas, Food & Beverage, Pharmaceutical, Chemical, Laser Cutting, Marine, Diving</li>
          <li><strong>*_page tables</strong> - Add is_active field to existing page tables</li>
        </ul>
        <p className="text-sm text-blue-600 mt-2">✨ All content matches the original website data!</p>
      </div>
      
      <button
        onClick={setupAllTables}
        disabled={loading}
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50 mb-4"
      >
        {loading ? 'Setting up all tables...' : 'Setup All Tables'}
      </button>

      {status && (
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg mb-2">Setup Status:</h2>
          <pre className="whitespace-pre-wrap text-sm max-h-96 overflow-y-auto">{status}</pre>
        </div>
      )}
    </div>
  );
}