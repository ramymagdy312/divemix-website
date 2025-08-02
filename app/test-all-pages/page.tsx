"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function TestAllPages() {
  const [testResults, setTestResults] = useState<{[key: string]: 'pending' | 'success' | 'error'}>({});

  const pages = [
    { name: 'Home', path: '/', description: 'Main landing page' },
    { name: 'Products', path: '/products', description: 'Product categories from database' },
    { name: 'Services', path: '/services', description: 'Services from database' },
    { name: 'Applications', path: '/applications', description: 'Applications from database' },
    { name: 'Gallery', path: '/gallery', description: 'Gallery images from database' },
    { name: 'About', path: '/about', description: 'About page' },
    { name: 'Contact', path: '/contact', description: 'Contact page' },
    { name: 'Admin', path: '/admin', description: 'Admin panel (requires auth)' },
    { name: 'Setup DB', path: '/setup-all-db', description: 'Database setup tool' },
    { name: 'Test DB', path: '/test-db', description: 'Database test tool' },
    { name: 'Fix Issues', path: '/fix-all-issues', description: 'Issue diagnostic tool' }
  ];

  const testPage = async (path: string) => {
    setTestResults(prev => ({ ...prev, [path]: 'pending' }));
    
    try {
      const response = await fetch(path);
      if (response.ok) {
        setTestResults(prev => ({ ...prev, [path]: 'success' }));
      } else {
        setTestResults(prev => ({ ...prev, [path]: 'error' }));
      }
    } catch (error) {
      setTestResults(prev => ({ ...prev, [path]: 'error' }));
    }
  };

  const testAllPages = async () => {
    for (const page of pages) {
      await testPage(page.path);
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'success': return '✅';
      case 'error': return '❌';
      default: return '⚪';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'success': return 'text-green-600 bg-green-50';
      case 'error': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">🧪 Page Testing Dashboard</h1>
      
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-blue-800 mb-2">Testing Overview:</h2>
        <p className="text-blue-700">
          This tool tests all pages in the application to ensure they load correctly. 
          It checks both static pages and database-driven pages.
        </p>
      </div>

      <div className="mb-6">
        <button
          onClick={testAllPages}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 mr-4"
        >
          🚀 Test All Pages
        </button>
        
        <button
          onClick={() => setTestResults({})}
          className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
        >
          🔄 Clear Results
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pages.map((page) => {
          const status = testResults[page.path] || 'untested';
          
          return (
            <div
              key={page.path}
              className={`border rounded-lg p-4 ${getStatusColor(status)}`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg">{page.name}</h3>
                <span className="text-2xl">{getStatusIcon(status)}</span>
              </div>
              
              <p className="text-sm mb-3 opacity-75">{page.description}</p>
              
              <div className="flex items-center justify-between">
                <code className="text-xs bg-black bg-opacity-10 px-2 py-1 rounded">
                  {page.path}
                </code>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => testPage(page.path)}
                    className="text-xs bg-white bg-opacity-50 hover:bg-opacity-75 px-2 py-1 rounded"
                    disabled={status === 'pending'}
                  >
                    Test
                  </button>
                  
                  <Link
                    href={page.path}
                    target="_blank"
                    className="text-xs bg-white bg-opacity-50 hover:bg-opacity-75 px-2 py-1 rounded"
                  >
                    Visit
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-gray-50 border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">📋 Testing Checklist</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">🗄️ Database-Driven Pages:</h3>
            <ul className="space-y-1 text-sm">
              <li>✅ Products - Should show product categories</li>
              <li>✅ Services - Should show service cards</li>
              <li>✅ Applications - Should show application grid</li>
              <li>✅ Gallery - Should show image gallery</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">📄 Static Pages:</h3>
            <ul className="space-y-1 text-sm">
              <li>✅ Home - Hero section and components</li>
              <li>✅ About - Company information</li>
              <li>✅ Contact - Contact form and info</li>
            </ul>
          </div>
        </div>

        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Common Issues:</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Empty pages = Database not set up (run /setup-all-db)</li>
            <li>• Loading spinners = Supabase connection issues</li>
            <li>• 404 errors = Routing problems</li>
            <li>• Admin access denied = Authentication not configured</li>
          </ul>
        </div>
      </div>
    </div>
  );
}