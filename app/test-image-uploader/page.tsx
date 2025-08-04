"use client";

import { useState } from 'react';
import SimpleEnhancedUploader from '../components/admin/SimpleEnhancedUploader';
import Image from 'next/image';
import { Toaster } from 'react-hot-toast';

export default function TestImageUploader() {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Toaster position="top-right" />
      
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🖼️ Enhanced Image Uploader Test
          </h1>
          <p className="text-gray-600 mb-8">
            Test the new image uploader with server image selection and file upload capabilities
          </p>

          <div className="space-y-8">
            {/* Image Uploader */}
            <div>
              <SimpleEnhancedUploader
                images={selectedImages}
                onImagesChange={setSelectedImages}
                multiple={true}
                maxImages={10}
                label="Test Product Images"
              />
            </div>

            {/* Selected Images Info */}
            {selectedImages.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">
                  Selected Images ({selectedImages.length})
                </h3>
                <div className="space-y-2">
                  {selectedImages.map((image, index) => (
                    <div key={index} className="flex items-center justify-between bg-white p-3 rounded border">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-700">
                          {index + 1}.
                        </span>
                        <Image 
                          src={image}
                          alt={`Selected ${index + 1}`}
                          width={48}
                          height={48}
                          className="object-cover rounded"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {image.split('/').pop()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {image.includes('supabase') ? 'Supabase Storage' : 
                             image.includes('/uploads/') ? 'Local Server' : 'External URL'}
                          </p>
                        </div>
                      </div>
                      {index === 0 && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          Primary Image
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-4">
                🚀 How to Test - New Features!
              </h3>
              <div className="space-y-3 text-sm text-green-800">
                <div className="flex items-start space-x-2">
                  <span className="font-bold">1.</span>
                  <div>
                    <strong>📁 Server Images:</strong> Click &quot;Choose from Server Images&quot; to browse pre-uploaded images
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="font-bold">2.</span>
                  <div>
                    <strong>➕ Select Images:</strong> Click the blue + button to select images from server
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="font-bold">3.</span>
                  <div>
                    <strong>➖ Unselect Images:</strong> Click the orange - button to unselect images
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="font-bold">4.</span>
                  <div>
                    <strong>🗑️ Delete from Server:</strong> Click the red trash button to permanently delete images from server
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="font-bold">5.</span>
                  <div>
                    <strong>⬆️ Upload New:</strong> Click &quot;Upload New Images&quot; or drag & drop files
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="font-bold">6.</span>
                  <div>
                    <strong>🔄 Bulk Actions:</strong> Use &quot;Unselect All&quot; and &quot;Remove All&quot; for quick management
                  </div>
                </div>
              </div>
            </div>

            {/* Clear Button */}
            {selectedImages.length > 0 && (
              <div className="text-center">
                <button
                  onClick={() => setSelectedImages([])}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Clear All Images
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}