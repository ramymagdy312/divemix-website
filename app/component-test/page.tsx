"use client";

import { useState } from 'react';
import { supabase } from '../lib/supabase';
import ServiceGridDB from '../components/services/ServiceGridDB';
import ApplicationGridDB from '../components/applications/ApplicationGridDB';
import GalleryGridDB from '../components/gallery/GalleryGridDB';

export default function ComponentTest() {
  const [activeTest, setActiveTest] = useState<string>('');
  const [testResults, setTestResults] = useState<{[key: string]: any}>({});

  const components = [
    {
      name: 'ServiceGridDB', 
      component: ServiceGridDB,
      description: 'Services from database',
      table: 'services'
    },
    {
      name: 'ApplicationGridDB',
      component: ApplicationGridDB, 
      description: 'Applications from database',
      table: 'applications'
    },
    {
      name: 'GalleryGridDB',
      component: GalleryGridDB,
      description: 'Gallery images from database', 
      table: 'gallery_images'
    }
  ];

  const testComponent = async (componentName: string, tableName: string) => {
    setActiveTest(componentName);
    setTestResults(prev => ({ ...prev, [componentName]: { status: 'testing' } }));

    try {
      // Test database connection for this component
      const { data, error, count } = await supabase
        .from(tableName)
        .select('*', { count: 'exact' })
        .limit(5);

      if (error) {
        setTestResults(prev => ({ 
          ...prev, 
          [componentName]: { 
            status: 'error', 
            error: error.message,
            data: null,
            count: 0
          } 
        }));
      } else {
        setTestResults(prev => ({ 
          ...prev, 
          [componentName]: { 
            status: 'success', 
            error: null,
            data: data,
            count: count || 0
          } 
        }));
      }
    } catch (err: any) {
      setTestResults(prev => ({ 
        ...prev, 
        [componentName]: { 
          status: 'error', 
          error: err.message,
          data: null,
          count: 0
        } 
      }));
    }

    setActiveTest('');
  };

  const testAllComponents = async () => {
    for (const component of components) {
      await testComponent(component.name, component.table);
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };

  const renderComponent = (ComponentClass: any, componentName: string) => {
    const result = testResults[componentName];
    
    if (!result) {
      return (
        <div className="p-8 text-center text-gray-500">
          Click &quot;Test Component&quot; to load this component
        </div>
      );
    }

    if (result.status === 'error') {
      return (
        <div className="p-8 text-center">
          <div className="text-red-600 mb-4">❌ Component Error</div>
          <div className="text-sm text-gray-600 bg-red-50 p-4 rounded">
            {result.error}
          </div>
          <div className="mt-4 text-sm text-gray-500">
            This component will show empty state or fallback content
          </div>
        </div>
      );
    }

    if (result.status === 'success') {
      return (
        <div>
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
            <div className="text-green-800 font-medium">
              ✅ Component loaded successfully
            </div>
            <div className="text-sm text-green-600">
              Found {result.count} records in database
            </div>
          </div>
          <ComponentClass />
        </div>
      );
    }

    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600 mx-auto"></div>
        <div className="mt-2 text-gray-600">Testing component...</div>
      </div>
    );
  };

  const getStatusIcon = (componentName: string) => {
    const result = testResults[componentName];
    if (!result) return '⚪';
    if (result.status === 'testing') return '⏳';
    if (result.status === 'success') return '✅';
    if (result.status === 'error') return '❌';
    return '⚪';
  };

  const getStatusColor = (componentName: string) => {
    const result = testResults[componentName];
    if (!result) return 'bg-gray-50 text-gray-600';
    if (result.status === 'testing') return 'bg-yellow-50 text-yellow-600';
    if (result.status === 'success') return 'bg-green-50 text-green-600';
    if (result.status === 'error') return 'bg-red-50 text-red-600';
    return 'bg-gray-50 text-gray-600';
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">🧪 Component Testing Lab</h1>
      
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-blue-800 mb-2">Component Testing Overview:</h2>
        <p className="text-blue-700 mb-2">
          This tool tests each major database-driven component individually to identify issues.
        </p>
        <ul className="text-sm text-blue-600 space-y-1">
          <li>• Tests database connectivity for each component</li>
          <li>• Shows actual component rendering with real data</li>
          <li>• Identifies specific errors and data issues</li>
          <li>• Helps debug component-specific problems</li>
        </ul>
      </div>

      <div className="mb-6">
        <button
          onClick={testAllComponents}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 mr-4"
          disabled={activeTest !== ''}
        >
          🚀 Test All Components
        </button>
        
        <button
          onClick={() => setTestResults({})}
          className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
        >
          🔄 Clear Results
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {components.map((comp) => (
          <div key={comp.name} className="border rounded-lg overflow-hidden">
            <div className={`p-4 border-b ${getStatusColor(comp.name)}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg flex items-center">
                  <span className="mr-2 text-xl">{getStatusIcon(comp.name)}</span>
                  {comp.name}
                </h3>
                <button
                  onClick={() => testComponent(comp.name, comp.table)}
                  disabled={activeTest === comp.name}
                  className="text-xs bg-white bg-opacity-50 hover:bg-opacity-75 px-3 py-1 rounded"
                >
                  {activeTest === comp.name ? 'Testing...' : 'Test Component'}
                </button>
              </div>
              
              <p className="text-sm opacity-75 mb-2">{comp.description}</p>
              <code className="text-xs bg-black bg-opacity-10 px-2 py-1 rounded">
                Table: {comp.table}
              </code>
              
              {testResults[comp.name] && (
                <div className="mt-2 text-xs">
                  {testResults[comp.name].status === 'success' && (
                    <div>✅ {testResults[comp.name].count} records found</div>
                  )}
                  {testResults[comp.name].status === 'error' && (
                    <div>❌ {testResults[comp.name].error}</div>
                  )}
                </div>
              )}
            </div>
            
            <div className="bg-white min-h-[300px]">
              {renderComponent(comp.component, comp.name)}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-gray-50 border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">📋 Component Status Summary</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">✅ Working Components:</h3>
            <ul className="space-y-1 text-sm">
              {components.filter(comp => testResults[comp.name]?.status === 'success').map(comp => (
                <li key={comp.name} className="text-green-600">
                  • {comp.name} ({testResults[comp.name]?.count || 0} records)
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">❌ Components with Issues:</h3>
            <ul className="space-y-1 text-sm">
              {components.filter(comp => testResults[comp.name]?.status === 'error').map(comp => (
                <li key={comp.name} className="text-red-600">
                  • {comp.name}: {testResults[comp.name]?.error}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <h4 className="font-semibold text-yellow-800 mb-2">🔧 Troubleshooting Tips:</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• If all components show errors: Database not connected (check /fix-all-issues)</li>
            <li>• If specific component shows errors: Table structure mismatch</li>
            <li>• If components show 0 records: Run /setup-all-db to populate data</li>
            <li>• If components load but show empty: Check is_active filters</li>
          </ul>
        </div>
      </div>
    </div>
  );
}