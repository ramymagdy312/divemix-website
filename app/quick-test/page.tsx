"use client";

import { useState } from 'react';

export default function QuickTest() {
  const [testResults, setTestResults] = useState<{[key: string]: string}>({});
  const [isRunning, setIsRunning] = useState(false);

  const pages = [
    { name: 'Home', url: '/', description: 'Main homepage with featured content' },
    { name: 'Products', url: '/products', description: 'Product categories listing' },
    { name: 'Services', url: '/services', description: 'Services listing' },
    { name: 'Applications', url: '/applications', description: 'Applications listing' },
    { name: 'Gallery', url: '/gallery', description: 'Image gallery' },
    { name: 'About', url: '/about', description: 'About page' },
    { name: 'Contact', url: '/contact', description: 'Contact page' },
    { name: 'Admin Dashboard', url: '/admin', description: 'Admin dashboard' },
    { name: 'Admin Applications', url: '/admin/applications', description: 'Admin applications management' },
    { name: 'Admin Services', url: '/admin/services', description: 'Admin services management' },
    { name: 'Admin Categories', url: '/admin/categories', description: 'Admin categories management' },
  ];

  const testPage = async (page: { name: string; url: string }) => {
    try {
      const response = await fetch(page.url, { method: 'HEAD' });
      if (response.ok) {
        return '✅ OK';
      } else {
        return `❌ Error ${response.status}`;
      }
    } catch (error) {
      return `❌ Failed: ${error}`;
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults({});

    for (const page of pages) {
      setTestResults(prev => ({ ...prev, [page.name]: '⏳ Testing...' }));
      const result = await testPage(page);
      setTestResults(prev => ({ ...prev, [page.name]: result }));
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsRunning(false);
  };

  const openPage = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">🚀 Quick Page Test</h1>
      
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-blue-800 mb-2">Quick Testing Tool</h2>
        <p className="text-blue-700">
          This tool quickly tests all major pages to identify which ones are working and which have issues.
        </p>
      </div>

      <div className="mb-6">
        <button
          onClick={runAllTests}
          disabled={isRunning}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 mr-4"
        >
          {isRunning ? '🔄 Testing...' : '🚀 Test All Pages'}
        </button>
        
        <button
          onClick={() => setTestResults({})}
          className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700"
        >
          🗑️ Clear Results
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pages.map((page) => (
          <div key={page.name} className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg">{page.name}</h3>
              <div className="text-2xl">
                {testResults[page.name] === '✅ OK' && '✅'}
                {testResults[page.name]?.startsWith('❌') && '❌'}
                {testResults[page.name] === '⏳ Testing...' && '⏳'}
                {!testResults[page.name] && '⚪'}
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-3">{page.description}</p>
            
            <div className="flex items-center justify-between">
              <code className="text-xs bg-gray-100 px-2 py-1 rounded">{page.url}</code>
              <button
                onClick={() => openPage(page.url)}
                className="text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded hover:bg-cyan-200"
              >
                Open
              </button>
            </div>
            
            {testResults[page.name] && (
              <div className="mt-2 text-sm">
                <span className={`px-2 py-1 rounded text-xs ${
                  testResults[page.name] === '✅ OK' 
                    ? 'bg-green-100 text-green-800' 
                    : testResults[page.name]?.startsWith('❌')
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {testResults[page.name]}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 bg-gray-50 border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">📊 Test Summary</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 border border-green-200 rounded p-4">
            <h3 className="font-semibold text-green-800 mb-2">✅ Working Pages</h3>
            <div className="text-2xl font-bold text-green-600">
              {Object.values(testResults).filter(result => result === '✅ OK').length}
            </div>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded p-4">
            <h3 className="font-semibold text-red-800 mb-2">❌ Pages with Issues</h3>
            <div className="text-2xl font-bold text-red-600">
              {Object.values(testResults).filter(result => result?.startsWith('❌')).length}
            </div>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded p-4">
            <h3 className="font-semibold text-gray-800 mb-2">⚪ Not Tested</h3>
            <div className="text-2xl font-bold text-gray-600">
              {pages.length - Object.keys(testResults).length}
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <h4 className="font-semibold text-yellow-800 mb-2">🔧 Common Issues & Solutions:</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• <strong>Home page crashes:</strong> Check FeaturedCategories, FeaturedServices, FeaturedApplications components</li>
            <li>• <strong>Products page empty:</strong> Database not set up - run /setup-all-db</li>
            <li>• <strong>Admin pages error:</strong> Interface mismatch - check database schema</li>
            <li>• <strong>404 errors:</strong> Check routing and file structure</li>
            <li>• <strong>Database errors:</strong> Run /fix-all-issues for diagnosis</li>
          </ul>
        </div>
      </div>
    </div>
  );
}