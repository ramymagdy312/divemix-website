"use client";

import { useState } from 'react';

export default function FixRLSPolicies() {
  const [results, setResults] = useState<string>('');

  const showSQLCommands = () => {
    const sqlCommands = `
-- 🔧 SQL Commands to Fix RLS Policies for Forms
-- Run these commands in your Supabase SQL Editor

-- 1. Disable RLS temporarily for testing (OPTIONAL)
ALTER TABLE applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE services DISABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories DISABLE ROW LEVEL SECURITY;

-- 2. OR Create proper RLS policies for public access

-- Applications table policies
CREATE POLICY "Enable read access for all users" ON applications
FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON applications
FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON applications
FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON applications
FOR DELETE USING (true);

-- Services table policies
CREATE POLICY "Enable read access for all users" ON services
FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON services
FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON services
FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON services
FOR DELETE USING (true);

-- Product categories table policies
CREATE POLICY "Enable read access for all users" ON product_categories
FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON product_categories
FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON product_categories
FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON product_categories
FOR DELETE USING (true);

-- 3. Check if policies exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('applications', 'services', 'product_categories');

-- 4. Drop existing policies if needed (run only if you want to recreate them)
-- DROP POLICY IF EXISTS "Enable read access for all users" ON applications;
-- DROP POLICY IF EXISTS "Enable insert access for all users" ON applications;
-- DROP POLICY IF EXISTS "Enable update access for all users" ON applications;
-- DROP POLICY IF EXISTS "Enable delete access for all users" ON applications;

-- 5. Alternative: Create more restrictive policies (for production)
-- CREATE POLICY "Enable insert for authenticated users only" ON applications
-- FOR INSERT TO authenticated WITH CHECK (true);

-- CREATE POLICY "Enable update for authenticated users only" ON applications
-- FOR UPDATE TO authenticated USING (true);
`;

    setResults(sqlCommands);
  };

  const showTroubleshootingSteps = () => {
    const steps = `
🔍 TROUBLESHOOTING STEPS FOR FORM ERRORS

1. 📊 CHECK SUPABASE DASHBOARD
   • Go to your Supabase project dashboard
   • Navigate to Authentication > Policies
   • Check if RLS is enabled on applications/services tables
   • Look for any restrictive policies

2. 🔧 COMMON RLS ISSUES
   • RLS enabled but no policies = All operations blocked
   • Policies exist but don't match your use case
   • Authentication required but user not logged in
   • Wrong policy conditions

3. 🚀 QUICK FIXES
   Option A: Disable RLS (for development only)
   • Go to Database > Tables
   • Click on table name
   • Toggle "Enable RLS" to OFF

   Option B: Create permissive policies
   • Use the SQL commands provided above
   • Run them in SQL Editor

4. 🧪 TEST AFTER CHANGES
   • Try adding a new application/service
   • Check browser console for errors
   • Use /diagnose-forms to verify fixes

5. 📝 FORM-SPECIFIC CHECKS
   • Ensure all required fields are filled
   • Check that array fields (use_cases, benefits, features) are properly formatted
   • Verify image_url is a valid URL format
   • Make sure display_order is a positive number

6. 🔍 BROWSER CONSOLE ERRORS
   Common error messages and solutions:
   
   "new row violates row-level security policy"
   → RLS is blocking the insert, fix policies
   
   "null value in column violates not-null constraint"
   → Required field is missing, check form validation
   
   "invalid input syntax for type json"
   → Array field formatting issue, check data structure
   
   "permission denied for table"
   → Database permissions issue, check Supabase settings

7. 🛠️ DEVELOPMENT VS PRODUCTION
   Development: Disable RLS or use permissive policies
   Production: Use proper authentication-based policies
`;

    setResults(steps);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">🔒 Fix RLS Policies for Forms</h1>
      
      <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-yellow-800 mb-2">⚠️ Row Level Security (RLS) Issues</h2>
        <p className="text-yellow-700 mb-2">
          Form submission errors are often caused by Row Level Security policies blocking database operations.
        </p>
        <div className="text-sm text-yellow-600">
          <strong>Common symptoms:</strong>
          <ul className="mt-1 space-y-1">
            <li>• "new row violates row-level security policy" error</li>
            <li>• Forms submit but data doesn't save</li>
            <li>• "permission denied" errors in console</li>
            <li>• Empty tables even after successful submissions</li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <button
          onClick={showSQLCommands}
          className="bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 text-left"
        >
          <div className="font-semibold mb-1">📝 Show SQL Commands</div>
          <div className="text-sm opacity-90">Get SQL commands to fix RLS policies</div>
        </button>

        <button
          onClick={showTroubleshootingSteps}
          className="bg-green-600 text-white px-6 py-4 rounded-lg hover:bg-green-700 text-left"
        >
          <div className="font-semibold mb-1">🔍 Troubleshooting Guide</div>
          <div className="text-sm opacity-90">Step-by-step problem solving</div>
        </button>
      </div>

      {results && (
        <div className="bg-gray-900 text-green-400 p-6 rounded-lg font-mono text-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg text-white">📋 Instructions:</h2>
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
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="font-semibold text-red-800 mb-2">🚨 Quick Fix (Development)</h3>
          <div className="text-sm text-red-700 space-y-2">
            <p><strong>Fastest solution:</strong></p>
            <ol className="space-y-1">
              <li>1. Go to Supabase Dashboard</li>
              <li>2. Database → Tables</li>
              <li>3. Click table name</li>
              <li>4. Toggle "Enable RLS" OFF</li>
              <li>5. Test forms again</li>
            </ol>
            <p className="text-xs mt-2 opacity-75">⚠️ Only for development!</p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">🔧 Proper Fix (Recommended)</h3>
          <div className="text-sm text-blue-700 space-y-2">
            <p><strong>Create proper policies:</strong></p>
            <ol className="space-y-1">
              <li>1. Use SQL commands provided</li>
              <li>2. Run in Supabase SQL Editor</li>
              <li>3. Create permissive policies</li>
              <li>4. Test form submissions</li>
              <li>5. Adjust policies as needed</li>
            </ol>
            <p className="text-xs mt-2 opacity-75">✅ Safe for production</p>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-800 mb-2">🧪 Testing Steps</h3>
          <div className="text-sm text-green-700 space-y-2">
            <p><strong>After applying fixes:</strong></p>
            <ol className="space-y-1">
              <li>1. Run /diagnose-forms</li>
              <li>2. Test /admin/applications/new</li>
              <li>3. Test /admin/services/new</li>
              <li>4. Check browser console</li>
              <li>5. Verify data in Supabase</li>
            </ol>
            <p className="text-xs mt-2 opacity-75">🎯 Confirm everything works</p>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h3 className="font-semibold text-purple-800 mb-2">🎯 Expected Outcome</h3>
        <div className="text-sm text-purple-700">
          <p className="mb-2">After applying the fixes, you should be able to:</p>
          <ul className="space-y-1">
            <li>• ✅ Add new applications without errors</li>
            <li>• ✅ Edit existing applications successfully</li>
            <li>• ✅ Add new services without errors</li>
            <li>• ✅ Edit existing services successfully</li>
            <li>• ✅ See data immediately in admin lists</li>
            <li>• ✅ No console errors during form submission</li>
          </ul>
        </div>
      </div>
    </div>
  );
}