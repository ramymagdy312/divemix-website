"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, Image as ImageIcon, Loader2, Folder, Plus, Trash2, Minus } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface ImageUploaderProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  multiple?: boolean;
  maxImages?: number;
  label?: string;
}

const SimpleEnhancedUploader: React.FC<ImageUploaderProps> = ({
  images,
  onImagesChange,
  multiple = true,
  maxImages = 10,
  label = "Images"
}) => {
  const [uploading, setUploading] = useState(false);
  const [showServerImages, setShowServerImages] = useState(false);
  const [serverImages, setServerImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load server images
  const loadServerImages = async () => {
    try {
      const response = await fetch('/api/upload/list');
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

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => 
      file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024
    );

    if (validFiles.length === 0) {
      toast.error('Please select valid image files (less than 5MB)');
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
          throw new Error('Upload failed');
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
      loadServerImages(); // Refresh server images
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Error occurred while uploading images');
    } finally {
      setUploading(false);
    }
  };

  const selectServerImage = (imageUrl: string) => {
    if (images.includes(imageUrl)) {
      toast.error('This image is already selected');
      return;
    }

    if (images.length >= maxImages) {
      toast.error(`You can select maximum ${maxImages} images`);
      return;
    }

    if (multiple) {
      onImagesChange([...images, imageUrl]);
    } else {
      onImagesChange([imageUrl]);
    }

    toast.success('Image added successfully');
  };

  const unselectServerImage = (imageUrl: string) => {
    const newImages = images.filter(img => img !== imageUrl);
    onImagesChange(newImages);
    toast.success('Image unselected');
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
        
        // Remove from selected images if it was selected
        if (images.includes(imageUrl)) {
          const newImages = images.filter(img => img !== imageUrl);
          onImagesChange(newImages);
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

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        <p className="text-sm text-gray-600">
          🎯 Choose existing images from server or upload new ones from your device
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
          📁 Choose from Server ({serverImages.length} available)
        </button>
        
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
        >
          <Upload className="h-4 w-4 mr-2" />
          ⬆️ Upload New Images
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

      {/* Selected Images Preview */}
      {images.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-700">
              ✅ Selected Images ({images.length}/{maxImages})
            </h4>
            <button
              type="button"
              onClick={() => {
                onImagesChange([]);
                toast.success('All images removed');
              }}
              className="text-sm text-red-600 hover:text-red-800 underline"
            >
              Remove All
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden border-2 border-green-200">
                  <Image
                    src={image}
                    alt={`Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  
                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    title="Remove from selection"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  
                  {/* Primary Image Badge */}
                  {index === 0 && (
                    <div className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                      Primary
                    </div>
                  )}
                  
                  {/* Image Number */}
                  <div className="absolute top-2 left-2 bg-green-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
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
            ))}
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
                  📁 Server Images Library
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Select from {serverImages.length} available images
                </p>
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
                    onClick={loadServerImages}
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
                          images.includes(imageUrl) 
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
                            {images.includes(imageUrl) ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  unselectServerImage(imageUrl);
                                }}
                                className="bg-orange-500 hover:bg-orange-600 text-white rounded-full p-2 transition-colors"
                                title="Unselect image"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                            ) : (
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
                            )}
                            
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
                        {images.includes(imageUrl) && (
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
                            images.includes(imageUrl) 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {images.includes(imageUrl) ? 'Selected' : 'Available'}
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
                {images.length > 0 && (
                  <span className="ml-4 text-green-600">
                    • <span className="font-medium">{images.length}</span> selected
                  </span>
                )}
              </div>
              
              <div className="flex gap-3">
                {images.length > 0 && (
                  <button
                    onClick={() => {
                      onImagesChange([]);
                      toast.success('All images unselected');
                    }}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Unselect All
                  </button>
                )}
                
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

      {/* Empty State */}
      {images.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
          <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-sm text-gray-500 mb-2 font-medium">No images selected yet</p>
          <p className="text-xs text-gray-400 mb-4">
            Choose from {serverImages.length} server images or upload new ones
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

export default SimpleEnhancedUploader;