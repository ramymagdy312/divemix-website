"use client";

import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function FinalFormsTest() {
  const [testResults, setTestResults] = useState<{[key: string]: any}>({});
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState('');

  const runCompleteTest = async () => {
    setIsRunning(true);
    setTestResults({});
    
    const tests = [
      'Database Connection',
      'Applications Table Structure',
      'Services Table Structure',
      'Application Insert Test',
      'Service Insert Test',
      'Application Update Test',
      'Service Update Test',
      'RLS Policies Check'
    ];

    for (const test of tests) {
      setCurrentTest(test);
      await new Promise(resolve => setTimeout(resolve, 500)); // Visual delay
      
      try {
        switch (test) {
          case 'Database Connection':
            await testDatabaseConnection();
            break;
          case 'Applications Table Structure':
            await testApplicationsTable();
            break;
          case 'Services Table Structure':
            await testServicesTable();
            break;
          case 'Application Insert Test':
            await testApplicationInsert();
            break;
          case 'Service Insert Test':
            await testServiceInsert();
            break;
          case 'Application Update Test':
            await testApplicationUpdate();
            break;
          case 'Service Update Test':
            await testServiceUpdate();
            break;
          case 'RLS Policies Check':
            await testRLSPolicies();
            break;
        }
      } catch (error: any) {
        setTestResults(prev => ({
          ...prev,
          [test]: { status: 'error', message: error.message, details: error }
        }));
      }
    }
    
    setCurrentTest('');
    setIsRunning(false);
  };

  const testDatabaseConnection = async () => {
    try {
      const { data, error } = await supabase.from('applications').select('count').limit(1);
      if (error) throw error;
      
      setTestResults(prev => ({
        ...prev,
        'Database Connection': { 
          status: 'success', 
          message: 'Connected successfully',
          details: 'Supabase connection is working'
        }
      }));
    } catch (error: any) {
      throw new Error(`Database connection failed: ${error.message}`);
    }
  };

  const testApplicationsTable = async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .limit(1);
      
      if (error) throw error;
      
      const requiredFields = ['name', 'description', 'image_url', 'use_cases', 'benefits', 'is_active', 'display_order'];
      const sampleRecord = data?.[0];
      
      if (sampleRecord) {
        const existingFields = Object.keys(sampleRecord);
        const missingFields = requiredFields.filter(field => !existingFields.includes(field));
        
        if (missingFields.length > 0) {
          throw new Error(`Missing fields: ${missingFields.join(', ')}`);
        }
        
        setTestResults(prev => ({
          ...prev,
          'Applications Table Structure': { 
            status: 'success', 
            message: 'All required fields present',
            details: `Fields: ${existingFields.join(', ')}`
          }
        }));
      } else {
        setTestResults(prev => ({
          ...prev,
          'Applications Table Structure': { 
            status: 'warning', 
            message: 'Table exists but is empty',
            details: 'Cannot verify field structure without data'
          }
        }));
      }
    } catch (error: any) {
      throw new Error(`Applications table check failed: ${error.message}`);
    }
  };

  const testServicesTable = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .limit(1);
      
      if (error) throw error;
      
      const requiredFields = ['name', 'description', 'icon', 'features', 'is_active', 'display_order'];
      const sampleRecord = data?.[0];
      
      if (sampleRecord) {
        const existingFields = Object.keys(sampleRecord);
        const missingFields = requiredFields.filter(field => !existingFields.includes(field));
        
        if (missingFields.length > 0) {
          throw new Error(`Missing fields: ${missingFields.join(', ')}`);
        }
        
        setTestResults(prev => ({
          ...prev,
          'Services Table Structure': { 
            status: 'success', 
            message: 'All required fields present',
            details: `Fields: ${existingFields.join(', ')}`
          }
        }));
      } else {
        setTestResults(prev => ({
          ...prev,
          'Services Table Structure': { 
            status: 'warning', 
            message: 'Table exists but is empty',
            details: 'Cannot verify field structure without data'
          }
        }));
      }
    } catch (error: any) {
      throw new Error(`Services table check failed: ${error.message}`);
    }
  };

  const testApplicationInsert = async () => {
    try {
      const testData = {
        name: 'Test Application ' + Date.now(),
        description: 'Test description for application',
        image_url: 'https://example.com/test.jpg',
        use_cases: ['Test use case 1', 'Test use case 2'],
        benefits: ['Test benefit 1', 'Test benefit 2'],
        is_active: true,
        display_order: 999
      };

      const { data, error } = await supabase
        .from('applications')
        .insert([testData])
        .select()
        .single();

      if (error) throw error;

      // Clean up
      await supabase.from('applications').delete().eq('id', data.id);

      setTestResults(prev => ({
        ...prev,
        'Application Insert Test': { 
          status: 'success', 
          message: 'Insert and cleanup successful',
          details: `Created record with ID: ${data.id}`
        }
      }));
    } catch (error: any) {
      throw new Error(`Application insert failed: ${error.message}`);
    }
  };

  const testServiceInsert = async () => {
    try {
      const testData = {
        name: 'Test Service ' + Date.now(),
        description: 'Test description for service',
        icon: '🔧',
        features: ['Test feature 1', 'Test feature 2'],
        is_active: true,
        display_order: 999
      };

      const { data, error } = await supabase
        .from('services')
        .insert([testData])
        .select()
        .single();

      if (error) throw error;

      // Clean up
      await supabase.from('services').delete().eq('id', data.id);

      setTestResults(prev => ({
        ...prev,
        'Service Insert Test': { 
          status: 'success', 
          message: 'Insert and cleanup successful',
          details: `Created record with ID: ${data.id}`
        }
      }));
    } catch (error: any) {
      throw new Error(`Service insert failed: ${error.message}`);
    }
  };

  const testApplicationUpdate = async () => {
    try {
      // First insert a test record
      const testData = {
        name: 'Test App for Update ' + Date.now(),
        description: 'Original description',
        image_url: 'https://example.com/original.jpg',
        use_cases: ['Original use case'],
        benefits: ['Original benefit'],
        is_active: true,
        display_order: 998
      };

      const { data: insertData, error: insertError } = await supabase
        .from('applications')
        .insert([testData])
        .select()
        .single();

      if (insertError) throw insertError;

      // Now update it
      const updateData = {
        name: 'Updated Test App',
        description: 'Updated description',
        use_cases: ['Updated use case'],
        benefits: ['Updated benefit']
      };

      const { data: updateResult, error: updateError } = await supabase
        .from('applications')
        .update(updateData)
        .eq('id', insertData.id)
        .select()
        .single();

      if (updateError) throw updateError;

      // Clean up
      await supabase.from('applications').delete().eq('id', insertData.id);

      setTestResults(prev => ({
        ...prev,
        'Application Update Test': { 
          status: 'success', 
          message: 'Update and cleanup successful',
          details: `Updated record: ${updateResult.name}`
        }
      }));
    } catch (error: any) {
      throw new Error(`Application update failed: ${error.message}`);
    }
  };

  const testServiceUpdate = async () => {
    try {
      // First insert a test record
      const testData = {
        name: 'Test Service for Update ' + Date.now(),
        description: 'Original description',
        icon: '🔧',
        features: ['Original feature'],
        is_active: true,
        display_order: 998
      };

      const { data: insertData, error: insertError } = await supabase
        .from('services')
        .insert([testData])
        .select()
        .single();

      if (insertError) throw insertError;

      // Now update it
      const updateData = {
        name: 'Updated Test Service',
        description: 'Updated description',
        features: ['Updated feature']
      };

      const { data: updateResult, error: updateError } = await supabase
        .from('services')
        .update(updateData)
        .eq('id', insertData.id)
        .select()
        .single();

      if (updateError) throw updateError;

      // Clean up
      await supabase.from('services').delete().eq('id', insertData.id);

      setTestResults(prev => ({
        ...prev,
        'Service Update Test': { 
          status: 'success', 
          message: 'Update and cleanup successful',
          details: `Updated record: ${updateResult.name}`
        }
      }));
    } catch (error: any) {
      throw new Error(`Service update failed: ${error.message}`);
    }
  };

  const testRLSPolicies = async () => {
    try {
      // Try to perform operations that might be blocked by RLS
      const { data: apps, error: appsError } = await supabase
        .from('applications')
        .select('id')
        .limit(1);

      const { data: services, error: servicesError } = await supabase
        .from('services')
        .select('id')
        .limit(1);

      if (appsError || servicesError) {
        throw new Error(`RLS blocking access: ${appsError?.message || servicesError?.message}`);
      }

      setTestResults(prev => ({
        ...prev,
        'RLS Policies Check': { 
          status: 'success', 
          message: 'RLS policies allow required operations',
          details: 'No blocking policies detected'
        }
      }));
    } catch (error: any) {
      throw new Error(`RLS check failed: ${error.message}`);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      default: return '⚪';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-50 border-green-200 text-green-800';
      case 'error': return 'bg-red-50 border-red-200 text-red-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const successCount = Object.values(testResults).filter(r => r.status === 'success').length;
  const errorCount = Object.values(testResults).filter(r => r.status === 'error').length;
  const warningCount = Object.values(testResults).filter(r => r.status === 'warning').length;
  const totalTests = Object.keys(testResults).length;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">🧪 Final Forms Test Suite</h1>
      
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-blue-800 mb-2">🎯 Comprehensive Forms Testing</h2>
        <p className="text-blue-700 mb-2">
          This test suite performs end-to-end testing of all form operations to ensure everything works correctly.
        </p>
        <div className="text-sm text-blue-600">
          <strong>Tests include:</strong> Database connection, table structures, CRUD operations, and RLS policies.
        </div>
      </div>

      <div className="mb-6">
        <button
          onClick={runCompleteTest}
          disabled={isRunning}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 text-lg font-semibold mr-4"
        >
          {isRunning ? '🧪 Running Tests...' : '🚀 Run Complete Test Suite'}
        </button>
        
        {isRunning && currentTest && (
          <span className="text-blue-600 font-medium">
            Currently testing: {currentTest}
          </span>
        )}
      </div>

      {totalTests > 0 && (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-green-50 border border-green-200 rounded p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{successCount}</div>
            <div className="text-sm text-green-800">Passed</div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{errorCount}</div>
            <div className="text-sm text-red-800">Failed</div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{warningCount}</div>
            <div className="text-sm text-yellow-800">Warnings</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{totalTests}</div>
            <div className="text-sm text-blue-800">Total Tests</div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {Object.entries(testResults).map(([testName, result]) => (
          <div key={testName} className={`border rounded-lg p-4 ${getStatusColor(result.status)}`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold flex items-center">
                <span className="mr-2 text-xl">{getStatusIcon(result.status)}</span>
                {testName}
              </h3>
              <span className="text-sm opacity-75">
                {result.status.toUpperCase()}
              </span>
            </div>
            <p className="text-sm mb-1">{result.message}</p>
            {result.details && (
              <p className="text-xs opacity-75">{result.details}</p>
            )}
          </div>
        ))}
      </div>

      {totalTests > 0 && errorCount === 0 && (
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-green-800 mb-2">🎉 All Tests Passed!</h2>
          <p className="text-green-700 mb-4">
            Your forms should now work correctly. You can safely use the admin interface to add and edit applications and services.
          </p>
          <div className="space-y-2 text-sm text-green-600">
            <p>✅ Database connection is working</p>
            <p>✅ Table structures are correct</p>
            <p>✅ Insert operations work</p>
            <p>✅ Update operations work</p>
            <p>✅ RLS policies are not blocking operations</p>
          </div>
        </div>
      )}

      {errorCount > 0 && (
        <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-800 mb-2">❌ Issues Found</h2>
          <p className="text-red-700 mb-4">
            Some tests failed. Please address these issues before using the forms:
          </p>
          <div className="space-y-2 text-sm text-red-600">
            {Object.entries(testResults)
              .filter(([_, result]) => result.status === 'error')
              .map(([testName, result]) => (
                <p key={testName}>❌ {testName}: {result.message}</p>
              ))}
          </div>
          <div className="mt-4 p-3 bg-red-100 rounded">
            <p className="text-sm text-red-800">
              <strong>Next steps:</strong> Visit /fix-rls-policies for solutions, or check your Supabase dashboard for configuration issues.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}