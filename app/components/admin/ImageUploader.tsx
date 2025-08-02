"use client";

import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface ImageUploaderProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  multiple?: boolean;
  maxImages?: number;
  label?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  onImagesChange,
  multiple = true,
  maxImages = 10,
  label = "Images"
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    
    // If it's an uploaded file (starts with /uploads/), delete it from server
    if (imageToRemove.startsWith('/uploads/')) {
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

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      {/* Upload Area */}
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
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />

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

      {/* Image Preview Grid */}
      {images.length > 0 && (
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
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && (
        <div className="text-center py-4">
          <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No images selected yet</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;