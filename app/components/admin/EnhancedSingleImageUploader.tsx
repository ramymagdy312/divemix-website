"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, Image as ImageIcon, Loader2, Folder, Plus, Trash2, Minus, FolderOpen } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import TreeFolderManager from './TreeFolderManager';

interface SingleImageUploaderProps {
  image: string;
  onImageChange: (image: string) => void;
  label?: string;
}

const EnhancedSingleImageUploader: React.FC<SingleImageUploaderProps> = ({
  image,
  onImageChange,
  label = "Image"
}) => {
  const [uploading, setUploading] = useState(false);
  const [showServerImages, setShowServerImages] = useState(false);
  const [serverImages, setServerImages] = useState<string[]>([]);
  const [selectedFolder, setSelectedFolder] = useState('root');
  const [showFolderManager, setShowFolderManager] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load server images
  const loadServerImages = async (folder: string = selectedFolder) => {
    try {
      const url = folder === 'root' 
        ? '/api/upload/list' 
        : `/api/upload/list?folder=${folder}`;
        
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        const imageUrls = data.images?.map((img: any) => img.url) || [];
        setServerImages(imageUrls);
      }
    } catch (error) {
      console.error('Error loading server images:', error);
    }
  };

  useEffect(() => {
    loadServerImages();
  }, []);

  useEffect(() => {
    loadServerImages(selectedFolder);
  }, [selectedFolder]);

  const handleFolderSelect = (folder: string) => {
    setSelectedFolder(folder);
    setShowFolderManager(false);
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) {
      toast.error('Please select a valid image file (less than 5MB)');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', selectedFolder);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      onImageChange(result.url);
      toast.success(`Image uploaded successfully to ${selectedFolder === 'root' ? 'root folder' : selectedFolder}`);
      loadServerImages(); // Refresh server images
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error occurred while uploading image');
    } finally {
      setUploading(false);
    }
  };

  const selectServerImage = (imageUrl: string) => {
    onImageChange(imageUrl);
    setShowServerImages(false);
    toast.success('Image selected successfully');
  };

  const removeImage = () => {
    onImageChange('');
    toast.success('Image removed');
  };

  const deleteServerImage = async (imageUrl: string) => {
    const filename = imageUrl.split('/').pop();
    if (!confirm(`⚠️ Delete "${filename}" from server?\n\nThis will permanently delete the image from the server and cannot be undone.\n\nClick OK to confirm deletion.`)) {
      return;
    }

    try {
      const filename = imageUrl.split('/').pop();
      const response = await fetch(`/api/upload?filename=${filename}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove from server images list
        setServerImages(prev => prev.filter(img => img !== imageUrl));
        
        // Remove from selected image if it was selected
        if (image === imageUrl) {
          onImageChange('');
        }
        
        toast.success('Image deleted from server successfully');
      } else {
        throw new Error('Failed to delete image');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image from server');
    }
  };

  return (
    <div className="space-y-4">
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        <p className="text-sm text-gray-600">
          🎯 Choose existing image from server or upload new one from your device
        </p>
      </div>

      {/* Current Folder Info */}
      <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FolderOpen className="h-4 w-4 mr-2 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">
              Current Folder: {selectedFolder === 'root' ? '📂 Root Folder' : `📁 ${selectedFolder}`}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowFolderManager(true)}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Change Folder
          </button>
        </div>
        <p className="text-xs text-blue-600 mt-1">
          {serverImages.length} image(s) in this folder
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-4">
        <button
          type="button"
          onClick={() => setShowServerImages(true)}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Folder className="h-4 w-4 mr-2" />
          📁 Choose from Folder ({serverImages.length} available)
        </button>
        
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
        >
          <Upload className="h-4 w-4 mr-2" />
          ⬆️ Upload to {selectedFolder === 'root' ? 'Root' : selectedFolder}
        </button>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />

      {/* Selected Image Preview */}
      {image && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            ✅ Selected Image
          </h4>
          <div className="relative group max-w-sm">
            <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden border-2 border-green-200">
              <Image
                src={image}
                alt="Selected image"
                fill
                className="object-cover"
              />
              
              {/* Remove Button */}
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                title="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="mt-2">
              <p className="text-xs text-gray-600 truncate font-medium">
                {image.split('/').pop()}
              </p>
              <p className="text-xs text-green-600">
                {image.includes('/uploads/') ? 'Server Image' : 'External URL'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Folder Manager Modal */}
      {showFolderManager && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  📁 Folder Manager
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Organize your images by selecting or creating folders
                </p>
              </div>
              <button
                onClick={() => setShowFolderManager(false)}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-white rounded-full transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-96">
              <TreeFolderManager
                selectedFolder={selectedFolder}
                onFolderSelect={handleFolderSelect}
                onFoldersChange={() => loadServerImages(selectedFolder)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Server Images Modal */}
      {showServerImages && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-green-50 to-cyan-50">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  📁 Images in {selectedFolder === 'root' ? 'Root Folder' : selectedFolder}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Select from {serverImages.length} available images
                </p>
                <button
                  onClick={() => {
                    setShowServerImages(false);
                    setShowFolderManager(true);
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 underline mt-1"
                >
                  📂 Change Folder
                </button>
              </div>
              <button
                onClick={() => setShowServerImages(false)}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-white rounded-full transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-96">
              {serverImages.length === 0 ? (
                <div className="text-center py-12">
                  <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No images found on server</p>
                  <button
                    onClick={() => loadServerImages()}
                    className="mt-4 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
                  >
                    Refresh
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {serverImages.map((imageUrl, index) => (
                    <div key={index} className="relative group">
                      <div 
                        className={`aspect-square relative bg-gray-100 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                          image === imageUrl 
                            ? 'border-green-500 ring-2 ring-green-200' 
                            : 'border-transparent hover:border-cyan-500 hover:shadow-lg'
                        }`}
                      >
                        <Image
                          src={imageUrl}
                          alt={`Server image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        
                        {/* Action Buttons Overlay */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center">
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                selectServerImage(imageUrl);
                              }}
                              className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-full p-2 transition-colors"
                              title="Select image"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteServerImage(imageUrl);
                              }}
                              className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors"
                              title="Delete from server"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {/* Selected Indicator */}
                        {image === imageUrl && (
                          <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                            <X className="h-3 w-3 rotate-45" />
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-2">
                        <p className="text-xs text-gray-600 truncate font-medium">
                          {imageUrl.split('/').pop()}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            image === imageUrl 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {image === imageUrl ? 'Selected' : 'Available'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-6 border-t bg-gray-50">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{serverImages.length}</span> image(s) available
                {image && (
                  <span className="ml-4 text-green-600">
                    • 1 selected
                  </span>
                )}
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => loadServerImages()}
                  className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
                >
                  Refresh
                </button>
                
                <button
                  onClick={() => setShowServerImages(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!image && (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
          <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-sm text-gray-500 mb-2 font-medium">No image selected yet</p>
          <p className="text-xs text-gray-400 mb-4">
            Choose from {serverImages.length} server images or upload new one
          </p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => setShowServerImages(true)}
              className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
            >
              📁 Browse Server Images
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-xs px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full hover:bg-cyan-200 transition-colors"
            >
              ⬆️ Upload New
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedSingleImageUploader;