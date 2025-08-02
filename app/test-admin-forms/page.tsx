"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function TestAdminForms() {
  const [testResults, setTestResults] = useState<{[key: string]: string}>({});

  const adminPages = [
    {
      name: 'Applications List',
      url: '/admin/applications',
      description: 'View all applications',
      type: 'list'
    },
    {
      name: 'Add New Application',
      url: '/admin/applications/new',
      description: 'Create new application',
      type: 'form'
    },
    {
      name: 'Services List',
      url: '/admin/services',
      description: 'View all services',
      type: 'list'
    },
    {
      name: 'Add New Service',
      url: '/admin/services/new',
      description: 'Create new service',
      type: 'form'
    },
    {
      name: 'Categories List',
      url: '/admin/categories',
      description: 'View all categories',
      type: 'list'
    },
    {
      name: 'Add New Category',
      url: '/admin/categories/new',
      description: 'Create new category',
      type: 'form'
    }
  ];

  const testPage = (pageName: string, result: string) => {
    setTestResults(prev => ({ ...prev, [pageName]: result }));
  };

  const getStatusIcon = (pageName: string) => {
    const result = testResults[pageName];
    if (result === 'working') return '✅';
    if (result === 'error') return '❌';
    if (result === 'testing') return '⏳';
    return '⚪';
  };

  const getStatusColor = (pageName: string) => {
    const result = testResults[pageName];
    if (result === 'working') return 'bg-green-50 border-green-200 text-green-800';
    if (result === 'error') return 'bg-red-50 border-red-200 text-red-800';
    if (result === 'testing') return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    return 'bg-gray-50 border-gray-200 text-gray-800';
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">🔧 Admin Forms Testing</h1>
      
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-blue-800 mb-2">Admin Forms Status</h2>
        <p className="text-blue-700 mb-2">
          Test all admin forms to ensure they work correctly after the database schema fixes.
        </p>
        <div className="text-sm text-blue-600">
          <strong>Fixed Issues:</strong>
          <ul className="mt-1 space-y-1">
            <li>• Applications: Updated to use image_url, use_cases, benefits fields</li>
            <li>• Services: Updated to use name instead of title field</li>
            <li>• Added is_active and display_order fields to all forms</li>
            <li>• Fixed interface mismatches with database schema</li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {adminPages.map((page) => (
          <div key={page.name} className={`border rounded-lg p-4 ${getStatusColor(page.name)}`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">{page.name}</h3>
              <span className="text-2xl">{getStatusIcon(page.name)}</span>
            </div>
            
            <p className="text-sm mb-3">{page.description}</p>
            
            <div className="flex items-center justify-between mb-3">
              <span className={`text-xs px-2 py-1 rounded ${
                page.type === 'form' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {page.type === 'form' ? '📝 Form' : '📋 List'}
              </span>
              <code className="text-xs bg-black bg-opacity-10 px-2 py-1 rounded">
                {page.url}
              </code>
            </div>

            <div className="flex space-x-2">
              <Link
                href={page.url}
                target="_blank"
                className="flex-1 text-center text-xs bg-white bg-opacity-50 hover:bg-opacity-75 px-3 py-2 rounded"
              >
                Open Page
              </Link>
              <button
                onClick={() => testPage(page.name, 'working')}
                className="text-xs bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
              >
                ✅ Works
              </button>
              <button
                onClick={() => testPage(page.name, 'error')}
                className="text-xs bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
              >
                ❌ Error
              </button>
            </div>

            {testResults[page.name] && (
              <div className="mt-2 text-xs">
                Status: <strong>{testResults[page.name]}</strong>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-gray-50 border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">📊 Testing Summary</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 border border-green-200 rounded p-4">
            <h3 className="font-semibold text-green-800 mb-2">✅ Working</h3>
            <div className="text-2xl font-bold text-green-600">
              {Object.values(testResults).filter(result => result === 'working').length}
            </div>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded p-4">
            <h3 className="font-semibold text-red-800 mb-2">❌ Errors</h3>
            <div className="text-2xl font-bold text-red-600">
              {Object.values(testResults).filter(result => result === 'error').length}
            </div>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded p-4">
            <h3 className="font-semibold text-gray-800 mb-2">⚪ Not Tested</h3>
            <div className="text-2xl font-bold text-gray-600">
              {adminPages.length - Object.keys(testResults).length}
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">🧪 Testing Instructions:</h3>
          <ol className="text-sm text-yellow-700 space-y-1">
            <li>1. Click &quot;Open Page&quot; to test each admin page</li>
            <li>2. For List pages: Check if data loads without errors</li>
            <li>3. For Form pages: Try filling and submitting the form</li>
            <li>4. Mark as &quot;Works&quot; ✅ if no errors, &quot;Error&quot; ❌ if problems found</li>
            <li>5. If errors persist, check browser console for details</li>
          </ol>
        </div>

        <div className="mt-4 bg-green-50 border border-green-200 rounded p-4">
          <h3 className="font-semibold text-green-800 mb-2">✅ What Was Fixed:</h3>
          <div className="text-sm text-green-700 space-y-2">
            <div>
              <strong>Applications Forms:</strong>
              <ul className="ml-4 space-y-1">
                <li>• Changed from images[] to image_url field</li>
                <li>• Changed from features[] to use_cases[] and benefits[]</li>
                <li>• Added is_active and display_order fields</li>
                <li>• Updated form validation and submission</li>
              </ul>
            </div>
            <div>
              <strong>Services Forms:</strong>
              <ul className="ml-4 space-y-1">
                <li>• Changed from title to name field</li>
                <li>• Added is_active and display_order fields</li>
                <li>• Updated icon options with emojis</li>
                <li>• Fixed form field mappings</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}