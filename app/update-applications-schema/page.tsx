"use client";

import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function UpdateApplicationsSchema() {
  const [results, setResults] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);

  const updateSchema = async () => {
    setIsRunning(true);
    setResults('🔄 Updating Applications schema to support multiple images...\n\n');

    try {
      // Step 1: Check current schema
      setResults(prev => prev + '1. Checking current schema...\n');
      
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
          setResults(prev => prev + '   ✅ Schema already supports multiple images\n');
        } else if (fields.includes('image_url')) {
          setResults(prev => prev + '   ⚠️  Schema uses single image_url, needs update\n');
        }
      } else {
        setResults(prev => prev + '   ℹ️  Table is empty, cannot check current schema\n');
      }

      setResults(prev => prev + '\n2. Schema update options:\n');
      setResults(prev => prev + '   Option A: Add images[] column alongside image_url\n');
      setResults(prev => prev + '   Option B: Rename image_url to images and change type\n');
      setResults(prev => prev + '   Option C: Migrate existing image_url data to images[]\n\n');

      // Step 2: Show SQL commands needed
      setResults(prev => prev + '3. Required SQL commands (run in Supabase SQL Editor):\n\n');
      
      const sqlCommands = `-- Option A: Add images column (recommended)
ALTER TABLE applications ADD COLUMN IF NOT EXISTS images TEXT[];

-- Option B: If you want to replace image_url completely
-- ALTER TABLE applications DROP COLUMN IF EXISTS image_url;
-- ALTER TABLE applications ADD COLUMN images TEXT[];

-- Option C: Migrate existing data (if you have data in image_url)
-- UPDATE applications 
-- SET images = ARRAY[image_url] 
-- WHERE image_url IS NOT NULL AND image_url != '';

-- Check the updated schema
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'applications' 
ORDER BY ordinal_position;`;

      setResults(prev => prev + sqlCommands + '\n\n');

      // Step 3: Test if we can add images column
      setResults(prev => prev + '4. Testing schema update...\n');
      
      try {
        // Try to insert a test record with images array
        const testData = {
          name: 'Schema Test Application',
          description: 'Testing images array support',
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
            setResults(prev => prev + '   ⚠️  images column does not exist - needs to be added\n');
            setResults(prev => prev + '   💡 Run the SQL commands above to add the column\n');
          } else {
            setResults(prev => prev + `   ❌ Insert test failed: ${insertError.message}\n`);
          }
        } else {
          setResults(prev => prev + '   ✅ images array support is working!\n');
          
          // Clean up test data
          await supabase.from('applications').delete().eq('id', insertResult.id);
          setResults(prev => prev + '   🧹 Test data cleaned up\n');
        }
      } catch (error: any) {
        setResults(prev => prev + `   ❌ Schema test failed: ${error.message}\n`);
      }

      setResults(prev => prev + '\n5. Next steps:\n');
      setResults(prev => prev + '   • Run the SQL commands in Supabase SQL Editor\n');
      setResults(prev => prev + '   • Update the application forms to use ImageUploader\n');
      setResults(prev => prev + '   • Test the updated forms\n');
      setResults(prev => prev + '   • Migrate existing image_url data if needed\n\n');

      setResults(prev => prev + '🎉 Schema analysis complete!\n');

    } catch (error: any) {
      setResults(prev => prev + `\n❌ Schema update failed: ${error.message}\n`);
    } finally {
      setIsRunning(false);
    }
  };

  const showMigrationScript = () => {
    const migrationSQL = `
-- 🔄 Complete Applications Schema Migration Script
-- Run these commands in your Supabase SQL Editor

-- Step 1: Add images column if it doesn't exist
ALTER TABLE applications ADD COLUMN IF NOT EXISTS images TEXT[];

-- Step 2: Migrate existing image_url data to images array (optional)
UPDATE applications 
SET images = CASE 
  WHEN image_url IS NOT NULL AND image_url != '' THEN ARRAY[image_url]
  ELSE ARRAY[]::TEXT[]
END
WHERE images IS NULL;

-- Step 3: Check the migration results
SELECT 
  id, 
  name, 
  image_url, 
  images,
  CASE 
    WHEN images IS NOT NULL AND array_length(images, 1) > 0 THEN 'Has images'
    WHEN image_url IS NOT NULL AND image_url != '' THEN 'Has image_url only'
    ELSE 'No images'
  END as image_status
FROM applications
ORDER BY id;

-- Step 4: (Optional) Remove image_url column after migration
-- Only run this after confirming the migration worked correctly
-- ALTER TABLE applications DROP COLUMN image_url;

-- Step 5: Verify final schema
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'applications' 
ORDER BY ordinal_position;
`;

    setResults(migrationSQL);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">🔄 Update Applications Schema for Multiple Images</h1>
      
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-blue-800 mb-2">📸 Multiple Images Support</h2>
        <p className="text-blue-700 mb-2">
          Updating the applications table to support multiple images instead of a single image_url.
        </p>
        <div className="text-sm text-blue-600">
          <strong>Changes needed:</strong>
          <ul className="mt-1 space-y-1">
            <li>• Add images[] column to store multiple image URLs</li>
            <li>• Update forms to use ImageUploader component</li>
            <li>• Migrate existing image_url data (if any)</li>
            <li>• Test the updated functionality</li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <button
          onClick={updateSchema}
          disabled={isRunning}
          className="bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 text-left"
        >
          <div className="font-semibold mb-1">🔍 Analyze Current Schema</div>
          <div className="text-sm opacity-90">Check current structure and plan updates</div>
        </button>

        <button
          onClick={showMigrationScript}
          className="bg-green-600 text-white px-6 py-4 rounded-lg hover:bg-green-700 text-left"
        >
          <div className="font-semibold mb-1">📝 Show Migration Script</div>
          <div className="text-sm opacity-90">Get complete SQL migration commands</div>
        </button>
      </div>

      {results && (
        <div className="bg-gray-900 text-green-400 p-6 rounded-lg font-mono text-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg text-white">📋 Schema Analysis Results:</h2>
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

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Before Migration</h3>
          <div className="text-sm text-yellow-700 space-y-2">
            <p><strong>Backup your data:</strong></p>
            <ul className="space-y-1">
              <li>• Export applications table</li>
              <li>• Test on development first</li>
              <li>• Verify existing image URLs</li>
              <li>• Plan rollback strategy</li>
            </ul>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">🔄 Migration Steps</h3>
          <div className="text-sm text-blue-700 space-y-2">
            <ol className="space-y-1">
              <li>1. Run schema analysis</li>
              <li>2. Execute SQL commands</li>
              <li>3. Update form components</li>
              <li>4. Test image upload</li>
              <li>5. Migrate existing data</li>
            </ol>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-800 mb-2">✅ After Migration</h3>
          <div className="text-sm text-green-700 space-y-2">
            <p><strong>You'll have:</strong></p>
            <ul className="space-y-1">
              <li>• Multiple image upload</li>
              <li>• Drag & drop interface</li>
              <li>• Image preview grid</li>
              <li>• Automatic file management</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}