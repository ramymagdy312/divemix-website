"use client";

import { useState } from 'react';
import FolderExplorer from '../components/admin/FolderExplorer';
import FolderExplorerSingle from '../components/admin/FolderExplorerSingle';
import Image from 'next/image';
import { Toaster } from 'react-hot-toast';
import { Folder, FolderOpen, Image as ImageIcon } from 'lucide-react';

export default function TestFoldersPage() {
  const [multipleImages, setMultipleImages] = useState<string[]>([]);
  const [singleImage, setSingleImage] = useState<string>('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <Toaster position="top-right" />
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Folder className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">
              📁 Folder Management System Test
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Test the new folder management system for organizing images. Create folders, upload images to specific folders, and manage your image library efficiently.
          </p>
        </div>

        {/* Features Overview */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <FolderOpen className="h-5 w-5 mr-2 text-green-600" />
            🎯 New Folder Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">📂 Create Folders</h3>
              <p className="text-sm text-blue-700">
                Create custom folders to organize your images by category, project, or any system you prefer.
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">📁 Upload to Folders</h3>
              <p className="text-sm text-green-700">
                Upload images directly to specific folders. Images are automatically organized in your chosen location.
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-2">🗂️ Browse by Folder</h3>
              <p className="text-sm text-purple-700">
                Browse and select images from specific folders. Switch between folders easily to find what you need.
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-900 mb-2">🗑️ Manage Folders</h3>
              <p className="text-sm text-yellow-700">
                Delete folders and all their contents when no longer needed. Full folder lifecycle management.
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="font-semibold text-red-900 mb-2">☁️ Cloud Storage</h3>
              <p className="text-sm text-red-700">
                All folders and images are stored in Supabase cloud storage with local fallback support.
              </p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h3 className="font-semibold text-indigo-900 mb-2">🔄 Real-time Sync</h3>
              <p className="text-sm text-indigo-700">
                Changes are reflected immediately across all components. Create a folder and use it instantly.
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Multiple Images Test */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <ImageIcon className="h-5 w-5 mr-2 text-cyan-600" />
              📸 Multiple Images with Folders
            </h2>
            <p className="text-gray-600 mb-6">
              Test uploading multiple images to organized folders. Perfect for product galleries, portfolios, or any collection.
            </p>

            <FolderExplorer
              images={multipleImages}
              onImagesChange={setMultipleImages}
              label="Product Images"
              // initialPath="products"
              maxImages={10}
            />

            {/* Selected Images Display */}
            {multipleImages.length > 0 && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">
                  ✅ Selected Images ({multipleImages.length})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {multipleImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square relative bg-white rounded-lg overflow-hidden border-2 border-gray-200">
                        <Image 
                          src={image}
                          alt={`Selected ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                          {index + 1}
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mt-1 truncate">
                        {image.split('/').pop()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Single Image Test */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <ImageIcon className="h-5 w-5 mr-2 text-green-600" />
              🖼️ Single Image with Folders
            </h2>
            <p className="text-gray-600 mb-6">
              Test uploading a single image to organized folders. Perfect for category images, avatars, or featured images.
            </p>

            <FolderExplorerSingle
              image={singleImage}
              onImageChange={setSingleImage}
              label="Category Image"
            />

            {/* Selected Image Display */}
            {singleImage && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">
                  ✅ Selected Image
                </h3>
                <div className="flex items-start space-x-4">
                  <div className="w-24 h-24 relative bg-white rounded-lg overflow-hidden border-2 border-gray-200">
                    <Image 
                      src={singleImage}
                      alt="Selected image"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {singleImage.split('/').pop()}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      📁 Stored in organized folder structure
                    </p>
                    <p className="text-xs text-gray-500 mt-2 break-all">
                      {singleImage}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            📋 How to Test Folder Management
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">🎯 Testing Steps:</h3>
              <ol className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="font-bold mr-2">1.</span>
                  <div>
                    <strong>📂 Create Folders:</strong> Click "Change Folder" → "New Folder" to create custom folders
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">2.</span>
                  <div>
                    <strong>📁 Select Folder:</strong> Choose which folder to work with from the folder manager
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">3.</span>
                  <div>
                    <strong>⬆️ Upload to Folder:</strong> Upload new images directly to your selected folder
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">4.</span>
                  <div>
                    <strong>🔍 Browse Folder:</strong> View and select from images in the current folder
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">5.</span>
                  <div>
                    <strong>🗑️ Manage Folders:</strong> Delete folders and their contents when needed
                  </div>
                </li>
              </ol>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">💡 Suggested Folder Names:</h3>
              <div className="space-y-2 text-sm">
                <div className="bg-white p-2 rounded border">
                  <strong>📦 products</strong> - For product images
                </div>
                <div className="bg-white p-2 rounded border">
                  <strong>🏷️ categories</strong> - For category images
                </div>
                <div className="bg-white p-2 rounded border">
                  <strong>🖼️ gallery</strong> - For gallery images
                </div>
                <div className="bg-white p-2 rounded border">
                  <strong>👤 profiles</strong> - For user avatars
                </div>
                <div className="bg-white p-2 rounded border">
                  <strong>📰 blog</strong> - For blog post images
                </div>
                <div className="bg-white p-2 rounded border">
                  <strong>🎨 banners</strong> - For promotional banners
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-600">
          <p className="text-sm">
            🚀 <strong>Folder Management System</strong> - Organize your images efficiently with custom folders
          </p>
          <p className="text-xs mt-2">
            All folders and images are stored securely in Supabase cloud storage
          </p>
        </div>
      </div>
    </div>
  );
}