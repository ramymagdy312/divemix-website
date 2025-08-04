"use client";

import { useState } from 'react';
import FolderExplorer from '../components/admin/FolderExplorer';
import FolderExplorerSingle from '../components/admin/FolderExplorerSingle';
import Image from 'next/image';
import { Toaster } from 'react-hot-toast';
import { 
  FolderOpen, 
  Image as ImageIcon, 
  Navigation,
  Folder,
  Upload,
  Plus,
  ArrowLeft,
  Home,
  ChevronRight,
  Trash2
} from 'lucide-react';

export default function TestExplorerPage() {
  const [multipleImages, setMultipleImages] = useState<string[]>([]);
  const [singleImage, setSingleImage] = useState<string>('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Navigation className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">
              🗂️ Windows Explorer Style Interface
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto">
            Experience the familiar Windows Explorer interface! Navigate folders with breadcrumbs, create folders on-the-fly, upload images directly, and manage everything from one place - no modals needed!
          </p>
        </div>

        {/* Features Overview */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Navigation className="h-5 w-5 mr-2 text-blue-600" />
            🎯 Windows Explorer Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
                <Home className="h-4 w-4 mr-1" />
                🧭 Breadcrumb Navigation
              </h3>
              <p className="text-sm text-blue-700">
                Navigate with familiar breadcrumb trail. Click any folder in the path to jump directly there.
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2 flex items-center">
                <ArrowLeft className="h-4 w-4 mr-1" />
                ⬅️ Back Button
              </h3>
              <p className="text-sm text-green-700">
                Navigate back through your folder history just like in Windows Explorer.
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-2 flex items-center">
                <Plus className="h-4 w-4 mr-1" />
                📁 Inline Folder Creation
              </h3>
              <p className="text-sm text-purple-700">
                Create folders directly in the current location without opening modals or dialogs.
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-900 mb-2 flex items-center">
                <Upload className="h-4 w-4 mr-1" />
                ⬆️ Direct Upload
              </h3>
              <p className="text-sm text-yellow-700">
                Upload images directly to the current folder. No need to select folder separately.
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="font-semibold text-red-900 mb-2">🖱️ Double-Click Navigation</h3>
              <p className="text-sm text-red-700">
                Double-click folders to enter them, just like Windows Explorer. Intuitive and familiar.
              </p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h3 className="font-semibold text-indigo-900 mb-2">🗂️ Grid View</h3>
              <p className="text-sm text-indigo-700">
                View folders and images in a clean grid layout with hover effects and visual feedback.
              </p>
            </div>
            <div className="bg-pink-50 p-4 rounded-lg">
              <h3 className="font-semibold text-pink-900 mb-2">🔄 Real-time Updates</h3>
              <p className="text-sm text-pink-700">
                See changes immediately. Create a folder or upload an image and it appears instantly.
              </p>
            </div>
            <div className="bg-teal-50 p-4 rounded-lg">
              <h3 className="font-semibold text-teal-900 mb-2">📊 Status Information</h3>
              <p className="text-sm text-teal-700">
                Always see current location, folder count, and image count in the status bar.
              </p>
            </div>
          </div>
        </div>

        {/* Interface Comparison */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            🔄 Interface Comparison
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h3 className="font-semibold text-red-900 mb-3">❌ Old Modal-Based Approach:</h3>
              <ol className="space-y-2 text-sm text-red-700">
                <li>1. Click "Change Folder" button</li>
                <li>2. Wait for modal to open</li>
                <li>3. Navigate in tree view</li>
                <li>4. Select folder and close modal</li>
                <li>5. Click "Upload" button</li>
                <li>6. Select files</li>
                <li>7. Wait for upload</li>
                <li>8. Click "Browse" to see images</li>
                <li>9. Wait for another modal</li>
                <li>10. Select images and close modal</li>
              </ol>
              <p className="text-xs text-red-600 mt-2 font-medium">
                😫 10 steps, multiple modals, confusing workflow
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-900 mb-3">✅ New Explorer Approach:</h3>
              <ol className="space-y-2 text-sm text-green-700">
                <li>1. See all folders and images in one view</li>
                <li>2. Click folder to navigate (or use breadcrumbs)</li>
                <li>3. Click "Upload" to add images here</li>
                <li>4. Click images to select them</li>
                <li>5. Create folders with "New Folder" button</li>
              </ol>
              <p className="text-xs text-green-600 mt-2 font-medium">
                😊 5 steps, no modals, intuitive workflow
              </p>
              <div className="mt-3 p-2 bg-green-100 rounded text-xs text-green-800">
                <strong>🚀 50% fewer steps, 100% more intuitive!</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Multiple Images Explorer */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 border-b">
              <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center">
                <ImageIcon className="h-5 w-5 mr-2 text-blue-600" />
                📸 Multiple Images Explorer
              </h2>
              <p className="text-gray-600 text-sm">
                Navigate folders, upload multiple images, and select them all in one interface - just like Windows Explorer!
              </p>
            </div>

            <div className="p-4">
              <FolderExplorer
                images={multipleImages}
                onImagesChange={setMultipleImages}
                multiple={true}
                maxImages={15}
                label="Gallery"
              />
            </div>

            {/* Selected Images Display */}
            {multipleImages.length > 0 && (
              <div className="border-t bg-gray-50 p-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  ✅ Selected Images ({multipleImages.length})
                </h3>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                  {multipleImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square relative bg-white rounded-lg overflow-hidden border-2 border-green-200">
                        <Image 
                          src={image}
                          alt={`Selected ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-1 py-0.5 rounded">
                          {index + 1}
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mt-1 truncate">
                        📁 {image.includes('/uploads/') ? image.split('/uploads/')[1].split('/').slice(0, -1).join(' → ') || 'Root' : 'Root'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Single Image Explorer */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 border-b">
              <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center">
                <ImageIcon className="h-5 w-5 mr-2 text-green-600" />
                🖼️ Single Image Explorer
              </h2>
              <p className="text-gray-600 text-sm">
                Navigate folders and select a single image with the familiar Windows Explorer interface.
              </p>
            </div>

            <div className="p-4">
              <FolderExplorerSingle
                image={singleImage}
                onImageChange={setSingleImage}
                label="Featured"
              />
            </div>

            {/* Selected Image Display */}
            {singleImage && (
              <div className="border-t bg-gray-50 p-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  ✅ Selected Image
                </h3>
                <div className="flex items-start space-x-4">
                  <div className="w-20 h-20 relative bg-white rounded-lg overflow-hidden border-2 border-green-200">
                    <Image 
                      src={singleImage}
                      alt="Selected image"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">
                      {singleImage.split('/').pop()}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
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

        {/* Deletion Instructions */}
        <div className="mt-8 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 border border-red-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Trash2 className="h-5 w-5 mr-2 text-red-600" />
            🗑️ How to Delete Folders and Images
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg border border-red-200">
              <h3 className="font-semibold text-red-900 mb-3 flex items-center">
                <Folder className="h-4 w-4 mr-2" />
                📁 Delete Folders:
              </h3>
              <ol className="space-y-2 text-sm text-red-700">
                <li className="flex items-start">
                  <span className="font-bold mr-2 text-red-600">1.</span>
                  <div>
                    <strong>Hover over folder:</strong> Move your mouse over any folder card
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2 text-red-600">2.</span>
                  <div>
                    <strong>Red button appears:</strong> A red circular delete button (🗑️) will appear in the top-right corner
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2 text-red-600">3.</span>
                  <div>
                    <strong>Click delete button:</strong> Click the red button to delete the folder
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2 text-red-600">4.</span>
                  <div>
                    <strong>Confirm deletion:</strong> A confirmation dialog will appear - click OK to confirm
                  </div>
                </li>
              </ol>
              <div className="mt-3 p-2 bg-red-100 rounded text-xs text-red-800">
                <strong>⚠️ Warning:</strong> Deleting a folder removes ALL contents including subfolders and images!
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-red-200">
              <h3 className="font-semibold text-red-900 mb-3 flex items-center">
                <ImageIcon className="h-4 w-4 mr-2" />
                🖼️ Delete Images:
              </h3>
              <ol className="space-y-2 text-sm text-red-700">
                <li className="flex items-start">
                  <span className="font-bold mr-2 text-red-600">1.</span>
                  <div>
                    <strong>Hover over image:</strong> Move your mouse over any image thumbnail
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2 text-red-600">2.</span>
                  <div>
                    <strong>Red button appears:</strong> A red circular delete button (🗑️) will appear in the top-right corner
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2 text-red-600">3.</span>
                  <div>
                    <strong>Click delete button:</strong> Click the red button to delete the image
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2 text-red-600">4.</span>
                  <div>
                    <strong>Confirm deletion:</strong> A confirmation dialog will appear - click OK to confirm
                  </div>
                </li>
              </ol>
              <div className="mt-3 p-2 bg-red-100 rounded text-xs text-red-800">
                <strong>💡 Tip:</strong> If the image was selected, it will be automatically removed from your selection!
              </div>
            </div>
          </div>
          <div className="mt-4 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h4 className="font-semibold text-yellow-900 mb-2">🎯 Visual Guide:</h4>
            <p className="text-sm text-yellow-800">
              <strong>Look for the red circular button (🗑️) that appears when you hover!</strong> 
              It's positioned in the top-right corner of each folder and image card. 
              The button has a red background and becomes more visible on hover with a shadow effect.
            </p>
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            📋 How to Use Windows Explorer Interface
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Navigation className="h-4 w-4 mr-2" />
                🧭 Navigation:
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <ChevronRight className="h-3 w-3 mt-1 mr-2 text-blue-500" />
                  <div>
                    <strong>Breadcrumb Trail:</strong> Click any folder name in the path bar to jump directly there
                  </div>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-3 w-3 mt-1 mr-2 text-blue-500" />
                  <div>
                    <strong>Back Button:</strong> Use ← button to go back through your navigation history
                  </div>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-3 w-3 mt-1 mr-2 text-blue-500" />
                  <div>
                    <strong>Folder Click:</strong> Click any folder to enter it and see its contents
                  </div>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-3 w-3 mt-1 mr-2 text-blue-500" />
                  <div>
                    <strong>Home Button:</strong> Click Home in breadcrumb to return to root folder
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Folder className="h-4 w-4 mr-2" />
                📁 Management:
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <ChevronRight className="h-3 w-3 mt-1 mr-2 text-green-500" />
                  <div>
                    <strong>Create Folder:</strong> Click "New Folder" button, type name, press Enter or click ✓
                  </div>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-3 w-3 mt-1 mr-2 text-green-500" />
                  <div>
                    <strong>Upload Images:</strong> Click "Upload Images" button and select files from your device
                  </div>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-3 w-3 mt-1 mr-2 text-green-500" />
                  <div>
                    <strong>Select Images:</strong> Click images to select/deselect them (green border = selected)
                  </div>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-3 w-3 mt-1 mr-2 text-green-500" />
                  <div>
                    <strong>Delete Folders/Images:</strong> Hover over any item and click the red 🗑️ button that appears
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Example Workflows */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            🎯 Example Workflows
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-3">🛍️ E-commerce Product Upload:</h3>
              <ol className="space-y-1 text-sm text-blue-700">
                <li>1. Navigate to products folder</li>
                <li>2. Create "new-arrivals" folder</li>
                <li>3. Enter the new folder</li>
                <li>4. Upload product images</li>
                <li>5. Select images for gallery</li>
              </ol>
              <p className="text-xs text-blue-600 mt-2">
                ⚡ All in one interface, no modals!
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-3">🎨 Design Project Organization:</h3>
              <ol className="space-y-1 text-sm text-green-700">
                <li>1. Go to projects folder</li>
                <li>2. Create client folder</li>
                <li>3. Create "logos" subfolder</li>
                <li>4. Upload logo variations</li>
                <li>5. Select final logo</li>
              </ol>
              <p className="text-xs text-green-600 mt-2">
                🎯 Perfect for creative workflows!
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-3">📚 Content Management:</h3>
              <ol className="space-y-1 text-sm text-purple-700">
                <li>1. Navigate to blog folder</li>
                <li>2. Create "2024" folder</li>
                <li>3. Create "january" subfolder</li>
                <li>4. Upload article images</li>
                <li>5. Select featured image</li>
              </ol>
              <p className="text-xs text-purple-600 mt-2">
                📝 Ideal for content creators!
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-600">
          <p className="text-sm">
            🗂️ <strong>Windows Explorer Interface</strong> - Familiar, intuitive, and efficient
          </p>
          <p className="text-xs mt-2">
            Navigate, create, upload, and manage - all from one familiar interface
          </p>
        </div>
      </div>
    </div>
  );
}