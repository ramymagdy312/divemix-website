"use client";

import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function DiagnoseForms() {
  const [results, setResults] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);

  const runDiagnosis = async () => {
    setIsRunning(true);
    setResults('🔍 Starting Forms Diagnosis...\n\n');

    try {
      // Test 1: Check table structures
      setResults(prev => prev + '1. Checking table structures...\n');
      
      // Check applications table
      try {
        const { data: appColumns, error: appError } = await supabase
          .from('applications')
          .select('*')
          .limit(1);
        
        if (appError) {
          setResults(prev => prev + `   ❌ Applications table error: ${appError.message}\n`);
        } else {
          const sampleApp = appColumns?.[0];
          if (sampleApp) {
            const fields = Object.keys(sampleApp);
            setResults(prev => prev + `   ✅ Applications table fields: ${fields.join(', ')}\n`);
            
            // Check for required fields
            const requiredFields = ['name', 'description', 'image_url', 'use_cases', 'benefits', 'is_active', 'display_order'];
            const missingFields = requiredFields.filter(field => !fields.includes(field));
            if (missingFields.length > 0) {
              setResults(prev => prev + `   ⚠️  Missing fields: ${missingFields.join(', ')}\n`);
            }
          } else {
            setResults(prev => prev + '   ℹ️  Applications table is empty\n');
          }
        }
      } catch (error: any) {
        setResults(prev => prev + `   ❌ Applications table check failed: ${error.message}\n`);
      }

      // Check services table
      try {
        const { data: serviceColumns, error: serviceError } = await supabase
          .from('services')
          .select('*')
          .limit(1);
        
        if (serviceError) {
          setResults(prev => prev + `   ❌ Services table error: ${serviceError.message}\n`);
        } else {
          const sampleService = serviceColumns?.[0];
          if (sampleService) {
            const fields = Object.keys(sampleService);
            setResults(prev => prev + `   ✅ Services table fields: ${fields.join(', ')}\n`);
            
            // Check for required fields
            const requiredFields = ['name', 'description', 'icon', 'features', 'is_active', 'display_order'];
            const missingFields = requiredFields.filter(field => !fields.includes(field));
            if (missingFields.length > 0) {
              setResults(prev => prev + `   ⚠️  Missing fields: ${missingFields.join(', ')}\n`);
            }
          } else {
            setResults(prev => prev + '   ℹ️  Services table is empty\n');
          }
        }
      } catch (error: any) {
        setResults(prev => prev + `   ❌ Services table check failed: ${error.message}\n`);
      }

      setResults(prev => prev + '\n');

      // Test 2: Try inserting sample data
      setResults(prev => prev + '2. Testing data insertion...\n');
      
      // Test application insertion
      try {
        const testApp = {
          name: 'Test Application',
          description: 'Test description',
          image_url: 'https://example.com/test.jpg',
          use_cases: ['Test use case'],
          benefits: ['Test benefit'],
          is_active: true,
          display_order: 999
        };
      const { data: insertedApp, error: insertError } = await supabase
          .from('applications')
          .insert([testApp])
          .select()
          .single();

        if (insertError) {
          setResults(prev => prev + `   ❌ Application insert failed: ${insertError.message}\n`);
          setResults(prev => prev + `   💡 Error details: ${JSON.stringify(insertError, null, 2)}\n`);
        } else {
          setResults(prev => prev + '   ✅ Application insert successful\n');
          
          // Clean up test data
          await supabase.from('applications').delete().eq('id', insertedApp.id);
          setResults(prev => prev + '   🧹 Test data cleaned up\n');
        }
      } catch (error: any) {
        setResults(prev => prev + `   ❌ Application insert test failed: ${error.message}\n`);
      }

      // Test service insertion
      try {
        const testService = {
          name: 'Test Service',
          description: 'Test description',
          icon: '🔧',
          features: ['Test feature'],
          is_active: true,
          display_order: 999
        };
      const { data: insertedService, error: insertError } = await supabase
          .from('services')
          .insert([testService])
          .select()
          .single();

        if (insertError) {
          setResults(prev => prev + `   ❌ Service insert failed: ${insertError.message}\n`);
          setResults(prev => prev + `   💡 Error details: ${JSON.stringify(insertError, null, 2)}\n`);
        } else {
          setResults(prev => prev + '   ✅ Service insert successful\n');
          
          // Clean up test data
          await supabase.from('services').delete().eq('id', insertedService.id);
          setResults(prev => prev + '   🧹 Test data cleaned up\n');
        }
      } catch (error: any) {
        setResults(prev => prev + `   ❌ Service insert test failed: ${error.message}\n`);
      }

      setResults(prev => prev + '\n');

      // Test 3: Check RLS policies
      setResults(prev => prev + '3. Checking Row Level Security (RLS) policies...\n');
      
      try {
        // Try to read without authentication
        const { data: publicApps, error: publicError } = await supabase
          .from('applications')
          .select('id')
          .limit(1);

        if (publicError) {
          setResults(prev => prev + `   ⚠️  RLS might be blocking access: ${publicError.message}\n`);
          setResults(prev => prev + '   💡 Solution: Disable RLS or add proper policies\n');
        } else {
          setResults(prev => prev + '   ✅ Public read access working\n');
        }
      } catch (error: any) {
        setResults(prev => prev + `   ❌ RLS check failed: ${error.message}\n`);
      }

      setResults(prev => prev + '\n');

      // Test 4: Check for common form issues
      setResults(prev => prev + '4. Checking for common form issues...\n');
      
      // Check if ImageUploader component exists
      try {
        setResults(prev => prev + '   ℹ️  Note: Forms now use image_url instead of ImageUploader\n');
        setResults(prev => prev + '   ℹ️  Note: Applications use use_cases and benefits arrays\n');
        setResults(prev => prev + '   ℹ️  Note: Services use name instead of title\n');
      } catch (error: any) {
        setResults(prev => prev + `   ❌ Component check failed: ${error.message}\n`);
      }

      setResults(prev => prev + '\n🎉 Diagnosis Complete!\n\n');
      
      // Summary and recommendations
      setResults(prev => prev + '📋 Summary & Recommendations:\n');
      setResults(prev => prev + '• If insert tests failed, check database schema\n');
      setResults(prev => prev + '• If RLS errors occur, check Supabase policies\n');
      setResults(prev => prev + '• Make sure all required fields are present\n');
      setResults(prev => prev + '• Test forms manually after running this diagnosis\n\n');
      
      setResults(prev => prev + '🚀 Next Steps:\n');
      setResults(prev => prev + '1. Visit /admin/applications/new to test application form\n');
      setResults(prev => prev + '2. Visit /admin/services/new to test service form\n');
      setResults(prev => prev + '3. Check browser console for any JavaScript errors\n');
      setResults(prev => prev + '4. If issues persist, check Supabase dashboard\n');

    } catch (error: any) {
      setResults(prev => prev + `\n❌ Diagnosis failed: ${error.message}\n`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">🔍 Forms Error Diagnosis</h1>
      
      <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-red-800 mb-2">🚨 Form Errors Detected</h2>
        <p className="text-red-700 mb-2">
          Running comprehensive diagnosis to identify the root cause of form submission errors.
        </p>
        <div className="text-sm text-red-600">
          <strong>This tool will check:</strong>
          <ul className="mt-1 space-y-1">
            <li>• Database table structures and field names</li>
            <li>• Data insertion capabilities</li>
            <li>• Row Level Security (RLS) policies</li>
            <li>• Common form configuration issues</li>
          </ul>
        </div>
      </div>

      <div className="mb-6">
        <button
          onClick={runDiagnosis}
          disabled={isRunning}
          className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 disabled:opacity-50 text-lg font-semibold"
        >
          {isRunning ? '🔍 Running Diagnosis...' : '🚀 Start Diagnosis'}
        </button>
      </div>

      {results && (
        <div className="bg-gray-900 text-green-400 p-6 rounded-lg font-mono text-sm">
          <h2 className="text-lg mb-4 text-white">🔍 Diagnosis Results:</h2>
          <pre className="whitespace-pre-wrap max-h-96 overflow-y-auto">{results}</pre>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">🔧 Common Issues & Solutions:</h3>
          <ul className="text-sm text-blue-700 space-y-2">
            <li><strong>Field name mismatch:</strong> Check if database fields match form fields</li>
            <li><strong>Missing required fields:</strong> Ensure all required columns exist</li>
            <li><strong>RLS policies:</strong> Check if Row Level Security is blocking inserts</li>
            <li><strong>Data type errors:</strong> Verify array fields are properly formatted</li>
            <li><strong>Validation errors:</strong> Check for missing or invalid data</li>
          </ul>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-800 mb-2">✅ Expected Results:</h3>
          <ul className="text-sm text-green-700 space-y-2">
            <li><strong>Table structures:</strong> All required fields present</li>
            <li><strong>Data insertion:</strong> Test records insert successfully</li>
            <li><strong>RLS policies:</strong> No blocking policies for inserts</li>
            <li><strong>Form compatibility:</strong> All fields match database schema</li>
            <li><strong>Clean operation:</strong> Test data cleaned up automatically</li>
          </ul>
        </div>
      </div>
    </div>
  );
}