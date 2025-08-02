"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function TestFormsWithImages() {
  const [testStatus, setTestStatus] = useState<{[key: string]: string}>({});

  const updateStatus = (form: string, status: string) => {
    setTestStatus(prev => ({ ...prev, [form]: status }));
  };

  const getStatusIcon = (form: string) => {
    const status = testStatus[form];
    switch (status) {
      case 'working': return '✅';
      case 'error': return '❌';
      case 'testing': return '⏳';
      default: return '⚪';
    }
  };

  const getStatusColor = (form: string) => {
    const status = testStatus[form];
    switch (status) {
      case 'working': return 'bg-green-50 border-green-200';
      case 'error': return 'bg-red-50 border-red-200';
      case 'testing': return 'bg-yellow-50 border-yellow-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const forms = [
    {
      name: 'Add New Application',
      url: '/admin/applications/new',
      description: 'Test adding application with image upload',
      steps: [
        'Fill in application name and description',
        'Upload one or more images using drag & drop',
        'Add use cases and benefits',
        'Submit the form',
        'Check if data saves correctly'
      ]
    },
    {
      name: 'Edit Application',
      url: '/admin/applications',
      description: 'Test editing existing application images',
      steps: [
        'Go to applications list',
        'Click edit on any application',
        'Try uploading new images',
        'Remove existing images',
        'Save changes',
        'Verify images updated correctly'
      ]
    }
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">📸 Test Forms with Image Upload</h1>
      
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-blue-800 mb-2">🎯 Image Upload Testing</h2>
        <p className="text-blue-700 mb-2">
          Test the updated application forms to ensure image upload functionality works correctly.
        </p>
        <div className="text-sm text-blue-600">
          <strong>What's been updated:</strong>
          <ul className="mt-1 space-y-1">
            <li>• Forms now use ImageUploader component instead of URL input</li>
            <li>• Support for multiple image uploads (up to 10 images)</li>
            <li>• Drag & drop functionality</li>
            <li>• Image preview and management</li>
            <li>• Database schema supports images[] array</li>
          </ul>
        </div>
      </div>

      {/* Prerequisites Check */}
      <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Prerequisites</h3>
        <div className="text-sm text-yellow-700 space-y-2">
          <p><strong>Before testing, make sure you've completed:</strong></p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div>
              <h4 className="font-medium mb-1">1. Database Schema Update:</h4>
              <code className="text-xs bg-yellow-100 px-2 py-1 rounded block">
                ALTER TABLE applications ADD COLUMN images TEXT[];
              </code>
            </div>
            <div>
              <h4 className="font-medium mb-1">2. Test Image Upload API:</h4>
              <Link href="/test-image-upload" className="text-yellow-800 underline text-sm">
                Visit /test-image-upload →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Form Testing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {forms.map((form) => (
          <div key={form.name} className={`border rounded-lg p-6 ${getStatusColor(form.name)}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{form.name}</h3>
              <span className="text-2xl">{getStatusIcon(form.name)}</span>
            </div>
            
            <p className="text-sm mb-4">{form.description}</p>
            
            <div className="mb-4">
              <h4 className="font-medium text-sm mb-2">Testing Steps:</h4>
              <ol className="text-xs space-y-1">
                {form.steps.map((step, index) => (
                  <li key={index} className="flex">
                    <span className="mr-2">{index + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="flex space-x-2">
              <Link
                href={form.url}
                target="_blank"
                className="flex-1 text-center text-sm bg-white bg-opacity-50 hover:bg-opacity-75 px-3 py-2 rounded border"
              >
                Open Form
              </Link>
              <button
                onClick={() => updateStatus(form.name, 'working')}
                className="text-xs bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
              >
                ✅ Works
              </button>
              <button
                onClick={() => updateStatus(form.name, 'error')}
                className="text-xs bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
              >
                ❌ Error
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Testing Checklist */}
      <div className="bg-white border rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">📋 Image Upload Testing Checklist</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3">🔧 Functionality Tests:</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <input type="checkbox" className="mt-1 mr-2" />
                <span>Drag & drop images works</span>
              </li>
              <li className="flex items-start">
                <input type="checkbox" className="mt-1 mr-2" />
                <span>Click to select images works</span>
              </li>
              <li className="flex items-start">
                <input type="checkbox" className="mt-1 mr-2" />
                <span>Multiple images can be uploaded</span>
              </li>
              <li className="flex items-start">
                <input type="checkbox" className="mt-1 mr-2" />
                <span>Image preview shows correctly</span>
              </li>
              <li className="flex items-start">
                <input type="checkbox" className="mt-1 mr-2" />
                <span>Images can be removed before saving</span>
              </li>
              <li className="flex items-start">
                <input type="checkbox" className="mt-1 mr-2" />
                <span>Form submits successfully with images</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">✅ Validation Tests:</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <input type="checkbox" className="mt-1 mr-2" />
                <span>Only image files are accepted</span>
              </li>
              <li className="flex items-start">
                <input type="checkbox" className="mt-1 mr-2" />
                <span>File size limit (5MB) is enforced</span>
              </li>
              <li className="flex items-start">
                <input type="checkbox" className="mt-1 mr-2" />
                <span>Maximum images limit (10) works</span>
              </li>
              <li className="flex items-start">
                <input type="checkbox" className="mt-1 mr-2" />
                <span>Error messages show for invalid files</span>
              </li>
              <li className="flex items-start">
                <input type="checkbox" className="mt-1 mr-2" />
                <span>Loading states work during upload</span>
              </li>
              <li className="flex items-start">
                <input type="checkbox" className="mt-1 mr-2" />
                <span>Images display on frontend after saving</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Common Issues */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-red-800 mb-4">🚨 Common Issues & Solutions</h3>
        
        <div className="space-y-4 text-sm text-red-700">
          <div>
            <strong>Issue:</strong> "Column 'images' does not exist" error
            <br />
            <strong>Solution:</strong> Run the SQL command to add the images column:
            <code className="block mt-1 bg-red-100 px-2 py-1 rounded text-xs">
              ALTER TABLE applications ADD COLUMN images TEXT[];
            </code>
          </div>
          
          <div>
            <strong>Issue:</strong> Images not uploading (stuck on loading)
            <br />
            <strong>Solution:</strong> Check /api/upload endpoint and Supabase configuration
          </div>
          
          <div>
            <strong>Issue:</strong> Images not showing in preview
            <br />
            <strong>Solution:</strong> Check browser console for errors, verify image URLs
          </div>
          
          <div>
            <strong>Issue:</strong> Form submission fails
            <br />
            <strong>Solution:</strong> Check browser console, verify all required fields are filled
          </div>
        </div>
      </div>

      {/* Success State */}
      {Object.values(testStatus).filter(status => status === 'working').length === forms.length && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-800 mb-2">🎉 All Tests Passed!</h3>
          <p className="text-green-700 mb-4">
            Excellent! The image upload functionality is working correctly in your application forms.
          </p>
          <div className="text-sm text-green-600">
            <strong>What's working:</strong>
            <ul className="mt-2 space-y-1">
              <li>✅ Image upload component is functional</li>
              <li>✅ Multiple images can be uploaded and managed</li>
              <li>✅ Forms save data correctly to database</li>
              <li>✅ Images display properly on frontend</li>
            </ul>
          </div>
        </div>
      )}

      {/* Next Steps */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-4">🚀 Next Steps</h3>
        <div className="text-sm text-blue-700 space-y-2">
          <p><strong>After confirming everything works:</strong></p>
          <ol className="space-y-1 ml-4">
            <li>1. Test with real users to ensure usability</li>
            <li>2. Configure Supabase Storage for production (if not using placeholders)</li>
            <li>3. Set up proper image optimization and CDN</li>
            <li>4. Add image alt text and SEO optimization</li>
            <li>5. Consider adding image editing features (crop, resize)</li>
          </ol>
        </div>
      </div>
    </div>
  );
}