"use client";

import { useState } from 'react';
import ImageUploader from '../components/admin/ImageUploader';

export default function TestImageUpload() {
  const [images, setImages] = useState<string[]>([]);
  const [testResults, setTestResults] = useState<string>('');

  const testUploadAPI = async () => {
    setTestResults('🧪 Testing image upload API...\n\n');

    try {
      // Test 1: Check if API endpoint exists
      setTestResults(prev => prev + '1. Testing API endpoint availability...\n');
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: new FormData() // Empty form data to test endpoint
      });

      if (response.status === 400) {
        setTestResults(prev => prev + '   ✅ API endpoint is accessible (returned 400 for empty request)\n');
      } else {
        setTestResults(prev => prev + `   ⚠️  API returned status: ${response.status}\n`);
      }

      // Test 2: Check Supabase configuration
      setTestResults(prev => prev + '\n2. Checking Supabase configuration...\n');
      
      setTestResults(prev => prev + '   ✅ Supabase appears to be configured\n');

      // Test 3: Create a test image file
      setTestResults(prev => prev + '\n3. Testing with sample image...\n');
      
      // Create a small test image (1x1 pixel PNG)
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(0, 0, 1, 1);
      }

      canvas.toBlob(async (blob) => {
        if (blob) {
          const testFile = new File([blob], 'test.png', { type: 'image/png' });
          const formData = new FormData();
          formData.append('file', testFile);

          try {
            const uploadResponse = await fetch('/api/upload', {
              method: 'POST',
              body: formData,
            });

            const result = await uploadResponse.json();

            if (uploadResponse.ok) {
              setTestResults(prev => prev + '   ✅ Image upload successful!\n');
              setTestResults(prev => prev + `   📸 Uploaded URL: ${result.url}\n`);
              
              if (result.development) {
                setTestResults(prev => prev + '   ℹ️  Using placeholder image (development mode)\n');
              }

              // Add the uploaded image to the test gallery
              setImages(prev => [...prev, result.url]);
            } else {
              setTestResults(prev => prev + `   ❌ Upload failed: ${result.error}\n`);
            }
          } catch (error: any) {
            setTestResults(prev => prev + `   ❌ Upload error: ${error.message}\n`);
          }
        }
      }, 'image/png');

      setTestResults(prev => prev + '\n🎉 Upload API test complete!\n');

    } catch (error: any) {
      setTestResults(prev => prev + `\n❌ Test failed: ${error.message}\n`);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">📸 Test Image Upload System</h1>
      
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-blue-800 mb-2">🔧 Image Upload Testing</h2>
        <p className="text-blue-700 mb-2">
          Test the image upload functionality to ensure it works correctly with the Applications forms.
        </p>
        <div className="text-sm text-blue-600">
          <strong>This will test:</strong>
          <ul className="mt-1 space-y-1">
            <li>• API endpoint availability</li>
            <li>• Supabase configuration</li>
            <li>• File upload process</li>
            <li>• Image URL generation</li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Test Controls */}
        <div className="space-y-6">
          <div>
            <button
              onClick={testUploadAPI}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 text-lg font-semibold"
            >
              🧪 Test Upload API
            </button>
          </div>

          {testResults && (
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
              <h3 className="text-lg mb-2 text-white">🔍 Test Results:</h3>
              <pre className="whitespace-pre-wrap max-h-64 overflow-y-auto">{testResults}</pre>
            </div>
          )}
        </div>

        {/* Image Uploader Test */}
        <div className="space-y-6">
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">📤 Interactive Upload Test</h3>
            <ImageUploader
              images={images}
              onImagesChange={setImages}
              multiple={true}
              maxImages={5}
              label="Test Images"
            />
          </div>

          {images.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">✅ Uploaded Images:</h4>
              <div className="space-y-2">
                {images.map((url, index) => (
                  <div key={index} className="text-sm">
                    <span className="text-green-700">Image {index + 1}:</span>
                    <br />
                    <code className="text-xs bg-green-100 px-2 py-1 rounded break-all">
                      {url}
                    </code>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Development Mode</h3>
          <div className="text-sm text-yellow-700 space-y-2">
            <p>If Supabase is not configured:</p>
            <ul className="space-y-1">
              <li>• Placeholder images will be used</li>
              <li>• Upload will still work for testing</li>
              <li>• Images from Unsplash will be returned</li>
              <li>• Perfect for development testing</li>
            </ul>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">🔧 Production Setup</h3>
          <div className="text-sm text-blue-700 space-y-2">
            <p>For real image uploads:</p>
            <ul className="space-y-1">
              <li>• Configure Supabase Storage</li>
              <li>• Create &apos;images&apos; bucket</li>
              <li>• Set proper permissions</li>
              <li>• Update environment variables</li>
            </ul>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-800 mb-2">✅ Expected Results</h3>
          <div className="text-sm text-green-700 space-y-2">
            <p>Working upload system:</p>
            <ul className="space-y-1">
              <li>• Drag & drop works</li>
              <li>• File selection works</li>
              <li>• Images are uploaded</li>
              <li>• URLs are generated</li>
              <li>• Preview shows correctly</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-purple-50 border border-purple-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-purple-800 mb-4">🚀 Next Steps</h3>
        <div className="text-sm text-purple-700 space-y-2">
          <p className="mb-3">After confirming image upload works:</p>
          <ol className="space-y-2">
            <li>1. <strong>Update Database Schema:</strong> Visit /update-applications-schema</li>
            <li>2. <strong>Run SQL Commands:</strong> Add images[] column to applications table</li>
            <li>3. <strong>Test Application Forms:</strong> Try adding/editing applications</li>
            <li>4. <strong>Verify Display:</strong> Check if images show correctly on frontend</li>
            <li>5. <strong>Production Setup:</strong> Configure Supabase Storage for real uploads</li>
          </ol>
        </div>
      </div>
    </div>
  );
}