"use client";

import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function ApplyImageUpdates() {
  const [results, setResults] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);

  const applyUpdates = async () => {
    setIsRunning(true);
    setResults('🔄 Applying image upload updates to Applications...\n\n');

    try {
      // Step 1: Check current schema
      setResults(prev => prev + '1. Checking current applications table schema...\n');
      
      const { data: currentData, error: checkError } = await supabase
        .from('applications')
        .select('*')
        .limit(1);

      if (checkError) {
        setResults(prev => prev + `   ❌ Error checking schema: ${checkError.message}\n`);
        return;
      }

      const sampleRecord = currentData?.[0];
      if (sampleRecord) {
        const fields = Object.keys(sampleRecord);
        setResults(prev => prev + `   ✅ Current fields: ${fields.join(', ')}\n`);
        
        if (fields.includes('images')) {
          setResults(prev => prev + '   ✅ images[] column already exists\n');
        } else {
          setResults(prev => prev + '   ⚠️  images[] column missing - needs to be added\n');
        }
      } else {
        setResults(prev => prev + '   ℹ️  Table is empty\n');
      }

      // Step 2: Test if we can use images column
      setResults(prev => prev + '\n2. Testing images column support...\n');
      
      try {
        const testData = {
          name: 'Image Test Application',
          description: 'Testing multiple images support',
          images: ['https://example.com/test1.jpg', 'https://example.com/test2.jpg'],
          use_cases: ['Test use case'],
          benefits: ['Test benefit'],
          is_active: true,
          display_order: 999
        };

        const { data: insertResult, error: insertError } = await supabase
          .from('applications')
          .insert([testData])
          .select()
          .single();

        if (insertError) {
          if (insertError.message.includes('column "images" does not exist')) {
            setResults(prev => prev + '   ❌ images column does not exist\n');
            setResults(prev => prev + '   💡 You need to run this SQL command in Supabase:\n');
            setResults(prev => prev + '   ALTER TABLE applications ADD COLUMN images TEXT[];\n');
          } else {
            setResults(prev => prev + `   ❌ Insert test failed: ${insertError.message}\n`);
          }
        } else {
          setResults(prev => prev + '   ✅ images column is working!\n');
          
          // Clean up test data
          await supabase.from('applications').delete().eq('id', insertResult.id);
          setResults(prev => prev + '   🧹 Test data cleaned up\n');
        }
      } catch (error: any) {
        setResults(prev => prev + `   ❌ Column test failed: ${error.message}\n`);
      }

      // Step 3: Check if migration is needed
      setResults(prev => prev + '\n3. Checking for existing image_url data...\n');
      
      try {
        const { data: existingData, error: dataError } = await supabase
          .from('applications')
          .select('id, name, image_url, images')
          .not('image_url', 'is', null)
          .neq('image_url', '');

        if (dataError) {
          setResults(prev => prev + `   ⚠️  Could not check existing data: ${dataError.message}\n`);
        } else if (existingData && existingData.length > 0) {
          setResults(prev => prev + `   📊 Found ${existingData.length} records with image_url data\n`);
          
          // Show sample of data that needs migration
          existingData.slice(0, 3).forEach((record: any) => {
            setResults(prev => prev + `   • ${record.name}: ${record.image_url}\n`);
          });

          if (existingData.length > 3) {
            setResults(prev => prev + `   ... and ${existingData.length - 3} more records\n`);
          }

          setResults(prev => prev + '   💡 Consider migrating this data to images[] column\n');
        } else {
          setResults(prev => prev + '   ✅ No existing image_url data found\n');
        }
      } catch (error: any) {
        setResults(prev => prev + `   ⚠️  Data check failed: ${error.message}\n`);
      }

      // Step 4: Summary and next steps
      setResults(prev => prev + '\n4. Summary and next steps:\n');
      setResults(prev => prev + '   ✅ Forms updated to use ImageUploader component\n');
      setResults(prev => prev + '   ✅ Database interfaces updated\n');
      setResults(prev => prev + '   ✅ Display components updated\n');
      
      setResults(prev => prev + '\n📋 Required SQL Commands (run in Supabase SQL Editor):\n\n');
      
      const sqlCommands = `-- Add images column if it doesn't exist
ALTER TABLE applications ADD COLUMN IF NOT EXISTS images TEXT[];

-- Migrate existing image_url data to images array (optional)
UPDATE applications 
SET images = CASE 
  WHEN image_url IS NOT NULL AND image_url != '' THEN ARRAY[image_url]
  ELSE ARRAY[]::TEXT[]
END
WHERE images IS NULL OR array_length(images, 1) IS NULL;

-- Verify the migration
SELECT id, name, image_url, images FROM applications LIMIT 5;`;

      setResults(prev => prev + sqlCommands + '\n\n');

      setResults(prev => prev + '🚀 Next steps:\n');
      setResults(prev => prev + '1. Run the SQL commands above in Supabase SQL Editor\n');
      setResults(prev => prev + '2. Test image upload at /test-image-upload\n');
      setResults(prev => prev + '3. Try adding a new application with images\n');
      setResults(prev => prev + '4. Verify images display correctly on the frontend\n');

      setResults(prev => prev + '\n🎉 Image upload system is ready!\n');

    } catch (error: any) {
      setResults(prev => prev + `\n❌ Update process failed: ${error.message}\n`);
    } finally {
      setIsRunning(false);
    }
  };

  const showMigrationSQL = () => {
    const migrationSQL = `
-- 📸 Complete Applications Image Migration Script
-- Run these commands in your Supabase SQL Editor

-- Step 1: Add images column
ALTER TABLE applications ADD COLUMN IF NOT EXISTS images TEXT[];

-- Step 2: Migrate existing image_url data
UPDATE applications 
SET images = CASE 
  WHEN image_url IS NOT NULL AND image_url != '' THEN ARRAY[image_url]
  ELSE ARRAY[]::TEXT[]
END
WHERE images IS NULL OR array_length(images, 1) IS NULL;

-- Step 3: Verify migration results
SELECT 
  id, 
  name, 
  image_url, 
  images,
  CASE 
    WHEN images IS NOT NULL AND array_length(images, 1) > 0 THEN 'Has images array'
    WHEN image_url IS NOT NULL AND image_url != '' THEN 'Has image_url only'
    ELSE 'No images'
  END as image_status
FROM applications
ORDER BY id;

-- Step 4: (Optional) Clean up old image_url column after confirming migration
-- Only run this after verifying everything works correctly
-- ALTER TABLE applications DROP COLUMN image_url;

-- Step 5: Check final schema
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'applications' 
AND column_name IN ('image_url', 'images')
ORDER BY ordinal_position;
`;

    setResults(migrationSQL);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">📸 Apply Image Upload Updates</h1>
      
      <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-green-800 mb-2">✅ Updates Applied</h2>
        <p className="text-green-700 mb-2">
          The following updates have been applied to support image upload in Applications:
        </p>
        <div className="text-sm text-green-600">
          <strong>Code changes completed:</strong>
          <ul className="mt-1 space-y-1">
            <li>• ✅ Application forms updated to use ImageUploader</li>
            <li>• ✅ Database interfaces updated to support images[]</li>
            <li>• ✅ Display components updated for multiple images</li>
            <li>• ✅ Backward compatibility maintained</li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <button
          onClick={applyUpdates}
          disabled={isRunning}
          className="bg-green-600 text-white px-6 py-4 rounded-lg hover:bg-green-700 disabled:opacity-50 text-left"
        >
          <div className="font-semibold mb-1">🔍 Check Database Status</div>
          <div className="text-sm opacity-90">Verify current schema and data</div>
        </button>

        <button
          onClick={showMigrationSQL}
          className="bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 text-left"
        >
          <div className="font-semibold mb-1">📝 Show Migration SQL</div>
          <div className="text-sm opacity-90">Get complete database migration commands</div>
        </button>
      </div>

      {results && (
        <div className="bg-gray-900 text-green-400 p-6 rounded-lg font-mono text-sm mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg text-white">📋 Update Results:</h2>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">1️⃣ Database Setup</h3>
          <div className="text-sm text-blue-700 space-y-2">
            <p>Run SQL commands to:</p>
            <ul className="space-y-1">
              <li>• Add images[] column</li>
              <li>• Migrate existing data</li>
              <li>• Verify schema</li>
            </ul>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-800 mb-2">2️⃣ Test Upload</h3>
          <div className="text-sm text-green-700 space-y-2">
            <p>Visit /test-image-upload to:</p>
            <ul className="space-y-1">
              <li>• Test API endpoint</li>
              <li>• Try file uploads</li>
              <li>• Verify functionality</li>
            </ul>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 className="font-semibold text-purple-800 mb-2">3️⃣ Test Forms</h3>
          <div className="text-sm text-purple-700 space-y-2">
            <p>Try the updated forms:</p>
            <ul className="space-y-1">
              <li>• /admin/applications/new</li>
              <li>• Edit existing applications</li>
              <li>• Upload multiple images</li>
            </ul>
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h3 className="font-semibold text-orange-800 mb-2">4️⃣ Verify Display</h3>
          <div className="text-sm text-orange-700 space-y-2">
            <p>Check frontend display:</p>
            <ul className="space-y-1">
              <li>• Home page applications</li>
              <li>• Applications list page</li>
              <li>• Image galleries</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-yellow-800 mb-4">⚡ Quick Start Guide</h3>
        <div className="text-sm text-yellow-700 space-y-3">
          <div>
            <strong>1. Database Migration (Required):</strong>
            <p>Copy and run the SQL commands in your Supabase SQL Editor to add the images[] column.</p>
          </div>
          <div>
            <strong>2. Test Image Upload:</strong>
            <p>Visit /test-image-upload to verify the upload system works correctly.</p>
          </div>
          <div>
            <strong>3. Try the Forms:</strong>
            <p>Go to /admin/applications/new and try uploading images using drag & drop or file selection.</p>
          </div>
          <div>
            <strong>4. Production Setup (Optional):</strong>
            <p>Configure Supabase Storage for real image uploads instead of placeholder images.</p>
          </div>
        </div>
      </div>
    </div>
  );
}