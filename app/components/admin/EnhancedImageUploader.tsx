"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, Image as ImageIcon, Loader2, Folder, Plus, Search } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface ImageUploaderProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  multiple?: boolean;
  maxImages?: number;
  label?: string;
}

interface ServerImage {
  url: string;
  filename: string;
  size?: number;
  uploadedAt?: string;
}

const EnhancedImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  onImagesChange,
  multiple = true,
  maxImages = 10,
  label = "Images"
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [showServerImages, setShowServerImages] = useState(true); // Open server images by default
  const [serverImages, setServerImages] = useState<ServerImage[]>([]);
  const [loadingServerImages, setLoadingServerImages] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load server images when modal opens
  useEffect(() => {
    if (showServerImages && serverImages.length === 0) {
      loadServerImages();
    }
  }, [showServerImages]);

  const loadServerImages = async () => {
    setLoadingServerImages(true);
    try {
      const response = await fetch('/api/upload/list');
      if (response.ok) {
        const data = await response.json();
        setServerImages(data.images || []);
      } else {
        toast.error('Failed to load server images');
      }
    } catch (error) {
      console.error('Error loading server images:', error);
      toast.error('Error loading server images');
    } finally {
      setLoadingServerImages(false);
    }
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => 
      file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024 // 5MB limit
    );

    if (validFiles.length === 0) {
      toast.error('Please select valid image files (less than 5MB)');
      return;
    }

    if (!multiple && validFiles.length > 1) {
      toast.error('You can only select one image');
      return;
    }

    if (images.length + validFiles.length > maxImages) {
      toast.error(`You can upload maximum ${maxImages} images`);
      return;
    }

    setUploading(true);

    try {
      const uploadPromises = validFiles.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Upload failed');
        }

        const result = await response.json();
        return result.url;
      });

      const uploadedImages = await Promise.all(uploadPromises);
      
      if (multiple) {
        onImagesChange([...images, ...uploadedImages]);
      } else {
        onImagesChange(uploadedImages);
      }

      toast.success(`Successfully uploaded ${uploadedImages.length} image(s)`);
      
      // Refresh server images list
      if (showServerImages) {
        loadServerImages();
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Error occurred while uploading images');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeImage = async (index: number) => {
    const imageToRemove = images[index];
    
    // If it's an uploaded file (starts with /uploads/ or contains supabase), try to delete it from server
    if (imageToRemove.includes('/uploads/') || imageToRemove.includes('supabase')) {
      try {
        const filename = imageToRemove.split('/').pop();
        await fetch(`/api/upload?filename=${filename}`, {
          method: 'DELETE',
        });
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }
    
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const selectServerImage = (serverImage: ServerImage) => {
    if (images.includes(serverImage.url)) {
      toast.error('This image is already selected');
      return;
    }

    if (images.length >= maxImages) {
      toast.error(`You can select maximum ${maxImages} images`);
      return;
    }

    if (multiple) {
      onImagesChange([...images, serverImage.url]);
    } else {
      onImagesChange([serverImage.url]);
    }

    toast.success('Image added successfully');
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const filteredServerImages = serverImages.filter(img => 
    img.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        <p className="text-sm text-gray-600">
          Choose existing images from server or upload new ones from your device
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
          Choose from Server Images
        </button>
        
        <button
          type="button"
          onClick={openFileDialog}
          className="flex items-center px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload New Images
        </button>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />

      {/* Drag & Drop Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          dragOver
            ? 'border-cyan-500 bg-cyan-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFileDialog}
      >
        {uploading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 text-cyan-500 animate-spin mb-2" />
            <p className="text-sm text-gray-600">Uploading images...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-1">
              Drag images here or click to select
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG, GIF up to 5MB • {multiple ? `Up to ${maxImages} images` : 'Single image'}
            </p>
          </div>
        )}
      </div>

      {/* Selected Images Preview */}
      {images.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Selected Images ({images.length}/{maxImages})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={image}
                    alt={`Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(index);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  {index === 0 && (
                    <div className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                      Primary
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && (
        <div className="text-center py-8">
          <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No images selected yet</p>
          <p className="text-xs text-gray-400 mt-1">
            Upload new images or choose from server
          </p>
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
                  📁 Server Images Library
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Select from previously uploaded images
                </p>
              </div>
              <button
                onClick={() => setShowServerImages(false)}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-white rounded-full transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search images..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-96">
              {loadingServerImages ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 text-cyan-500 animate-spin" />
                  <span className="ml-2 text-gray-600">Loading images...</span>
                </div>
              ) : filteredServerImages.length === 0 ? (
                <div className="text-center py-12">
                  <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    {searchTerm ? 'No images found matching your search' : 'No images found on server'}
                  </p>
                  <button
                    onClick={loadServerImages}
                    className="mt-4 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
                  >
                    Refresh
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredServerImages.map((serverImage, index) => (
                    <div key={index} className="relative group cursor-pointer">
                      <div 
                        className={`aspect-square relative bg-gray-100 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                          images.includes(serverImage.url) 
                            ? 'border-green-500 ring-2 ring-green-200' 
                            : 'border-transparent hover:border-cyan-500 hover:shadow-lg'
                        }`}
                        onClick={() => selectServerImage(serverImage)}
                      >
                        <Image
                          src={serverImage.url}
                          alt={serverImage.filename}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center">
                          {images.includes(serverImage.url) ? (
                            <div className="bg-green-500 text-white rounded-full p-2">
                              <X className="h-6 w-6 rotate-45" />
                            </div>
                          ) : (
                            <Plus className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity bg-cyan-500 rounded-full p-1" />
                          )}
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-xs text-gray-600 truncate font-medium" title={serverImage.filename}>
                          {serverImage.filename}
                        </p>
                        {serverImage.size && (
                          <p className="text-xs text-gray-400">
                            {(serverImage.size / 1024).toFixed(1)} KB
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-6 border-t bg-gray-50">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{filteredServerImages.length}</span> image(s) available
                {images.length > 0 && (
                  <span className="ml-4 text-green-600">
                    • <span className="font-medium">{images.length}</span> selected
                  </span>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={loadServerImages}
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
    </div>
  );
};

export default EnhancedImageUploader;