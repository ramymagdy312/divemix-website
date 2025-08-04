"use client";

import { useState } from 'react';
import FolderExplorer from '../components/admin/FolderExplorer';
import FolderExplorerSingle from '../components/admin/FolderExplorerSingle';
import Image from 'next/image';
import { Toaster } from 'react-hot-toast';
import { FolderTree, Folder, FolderOpen, Image as ImageIcon, ChevronRight } from 'lucide-react';

export default function TestNestedFoldersPage() {
  const [multipleImages, setMultipleImages] = useState<string[]>([]);
  const [singleImage, setSingleImage] = useState<string>('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <Toaster position="top-right" />
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <FolderTree className="h-8 w-8 text-green-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">
              🌳 Nested Folder System Test
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Test the advanced nested folder system! Create folders inside folders, organize your images in a tree structure, and manage complex hierarchies with ease.
          </p>
        </div>

        {/* Features Overview */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <FolderTree className="h-5 w-5 mr-2 text-green-600" />
            🎯 Advanced Nested Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">🌳 Tree Structure</h3>
              <p className="text-sm text-green-700">
                Create unlimited levels of nested folders. Build complex hierarchies like: Products → Electronics → Phones → iPhone
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">📁 Subfolder Creation</h3>
              <p className="text-sm text-blue-700">
                Click the + icon next to any folder to create a subfolder inside it. Organize by category, project, or any system.
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-2">🔍 Expand/Collapse</h3>
              <p className="text-sm text-purple-700">
                Navigate large folder trees easily. Expand folders to see subfolders, collapse to keep the view clean.
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-900 mb-2">📂 Deep Navigation</h3>
              <p className="text-sm text-yellow-700">
                Upload and browse images in deeply nested folders. Full path support: folder/subfolder/subsubfolder
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="font-semibold text-red-900 mb-2">🗑️ Recursive Deletion</h3>
              <p className="text-sm text-red-700">
                Delete folders and all their contents recursively. Removes all subfolders and images in one operation.
              </p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h3 className="font-semibold text-indigo-900 mb-2">☁️ Cloud Sync</h3>
              <p className="text-sm text-indigo-700">
                All nested folders are stored in Supabase cloud storage with full path preservation and sync.
              </p>
            </div>
          </div>
        </div>

        {/* Example Folder Structure */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <FolderTree className="h-5 w-5 mr-2 text-blue-600" />
            📋 Example Folder Structures
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">🛍️ E-commerce Structure:</h3>
              <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm">
                <div className="space-y-1">
                  <div>📂 products</div>
                  <div className="ml-4">📁 electronics</div>
                  <div className="ml-8">📁 phones</div>
                  <div className="ml-12">📁 iphone</div>
                  <div className="ml-12">📁 samsung</div>
                  <div className="ml-8">📁 laptops</div>
                  <div className="ml-12">📁 gaming</div>
                  <div className="ml-12">📁 business</div>
                  <div className="ml-4">📁 clothing</div>
                  <div className="ml-8">📁 men</div>
                  <div className="ml-8">📁 women</div>
                  <div className="ml-8">📁 kids</div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">🎨 Creative Agency Structure:</h3>
              <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm">
                <div className="space-y-1">
                  <div>📂 projects</div>
                  <div className="ml-4">📁 client-a</div>
                  <div className="ml-8">📁 branding</div>
                  <div className="ml-12">📁 logos</div>
                  <div className="ml-12">📁 business-cards</div>
                  <div className="ml-8">📁 website</div>
                  <div className="ml-12">📁 mockups</div>
                  <div className="ml-12">📁 final</div>
                  <div className="ml-4">📁 client-b</div>
                  <div className="ml-8">📁 social-media</div>
                  <div className="ml-8">📁 print-ads</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Multiple Images Test */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <ImageIcon className="h-5 w-5 mr-2 text-cyan-600" />
              📸 Multiple Images in Nested Folders
            </h2>
            <p className="text-gray-600 mb-6">
              Test uploading multiple images to deeply nested folder structures. Perfect for organizing large image collections.
            </p>

            <FolderExplorer
              images={multipleImages}
              onImagesChange={setMultipleImages}
              label="Gallery Images"
              // // initialPath removed
              maxImages={15}
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
                      <p className="text-xs text-blue-600 truncate">
                        📁 {image.includes('/uploads/') ? image.split('/uploads/')[1].split('/').slice(0, -1).join(' → ') || 'Root' : 'Root'}
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
              🖼️ Single Image in Nested Folders
            </h2>
            <p className="text-gray-600 mb-6">
              Test uploading a single image to nested folder structures. Perfect for category images, featured images, or specific assets.
            </p>

            <FolderExplorerSingle
              image={singleImage}
              onImageChange={setSingleImage}
              label="Featured Image"
              // // initialPath removed
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
                    <p className="text-sm text-blue-600 mt-1">
                      📁 Folder: {singleImage.includes('/uploads/') ? singleImage.split('/uploads/')[1].split('/').slice(0, -1).join(' → ') || 'Root' : 'Root'}
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
        <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            📋 How to Test Nested Folders
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">🎯 Step-by-Step Guide:</h3>
              <ol className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="font-bold mr-2">1.</span>
                  <div>
                    <strong>📂 Create Root Folder:</strong> Click "Change Folder" → "New Root Folder" → Enter name (e.g., "products")
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">2.</span>
                  <div>
                    <strong>📁 Create Subfolder:</strong> Click the + icon next to any folder → Enter subfolder name (e.g., "electronics")
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">3.</span>
                  <div>
                    <strong>🌳 Build Tree:</strong> Continue creating subfolders: electronics → phones → iphone
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">4.</span>
                  <div>
                    <strong>📂 Navigate:</strong> Click arrows to expand/collapse folders, click folder names to select
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">5.</span>
                  <div>
                    <strong>⬆️ Upload:</strong> Select deep folder (e.g., products/electronics/phones/iphone) and upload images
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">6.</span>
                  <div>
                    <strong>🔍 Browse:</strong> Navigate to any folder and browse its specific images
                  </div>
                </li>
              </ol>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">💡 Advanced Features:</h3>
              <div className="space-y-2 text-sm">
                <div className="bg-white p-3 rounded border">
                  <strong>🌳 Tree Navigation:</strong> Use <ChevronRight className="inline h-3 w-3" /> arrows to expand folders and see their subfolders
                </div>
                <div className="bg-white p-3 rounded border">
                  <strong>📁 Nested Creation:</strong> Create folders inside folders up to any depth level
                </div>
                <div className="bg-white p-3 rounded border">
                  <strong>🎯 Deep Selection:</strong> Select folders at any level: root, level 1, level 2, level 3, etc.
                </div>
                <div className="bg-white p-3 rounded border">
                  <strong>⬆️ Nested Upload:</strong> Upload images directly to deeply nested folders
                </div>
                <div className="bg-white p-3 rounded border">
                  <strong>🗑️ Recursive Delete:</strong> Delete folders and all their subfolders/images at once
                </div>
                <div className="bg-white p-3 rounded border">
                  <strong>☁️ Cloud Sync:</strong> All nested structures are preserved in cloud storage
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Example Scenarios */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            🎯 Try These Example Scenarios
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">🛍️ E-commerce Store</h3>
              <p className="text-sm text-blue-700 mb-3">
                Create: products → electronics → phones → iphone-15
              </p>
              <p className="text-xs text-blue-600">
                Upload product images to the deepest folder for perfect organization
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">🎨 Design Agency</h3>
              <p className="text-sm text-green-700 mb-3">
                Create: projects → client-name → branding → logos
              </p>
              <p className="text-xs text-green-600">
                Organize client work by project type and deliverable
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-2">📚 Educational Content</h3>
              <p className="text-sm text-purple-700 mb-3">
                Create: courses → web-development → html → basics
              </p>
              <p className="text-xs text-purple-600">
                Structure educational materials by subject and difficulty
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-600">
          <p className="text-sm">
            🌳 <strong>Advanced Nested Folder System</strong> - Unlimited depth, perfect organization
          </p>
          <p className="text-xs mt-2">
            Create complex folder hierarchies and manage them with ease
          </p>
        </div>
      </div>
    </div>
  );
}
