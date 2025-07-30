"use client";
import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface SingleImageUploaderProps {
  image: string;
  onImageChange: (image: string) => void;
  label?: string;
  required?: boolean;
}

const SingleImageUploader: React.FC<SingleImageUploaderProps> = ({
  image,
  onImageChange,
  label = "Image",
  required = false
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('Image size must be less than 5MB');
      return;
    }

    setUploading(true);

    try {
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
      onImageChange(result.url);
      setUploading(false);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error occurred while uploading image');
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

  const removeImage = async () => {
    // If it's an uploaded file (starts with /uploads/), delete it from server
    if (image.startsWith('/uploads/')) {
      try {
        const filename = image.split('/').pop();
        await fetch(`/api/upload?filename=${filename}`, {
          method: 'DELETE',
        });
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }
    
    onImageChange('');
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {image ? (
        /* Image Preview */
        <div className="relative group">
          <div className="aspect-video relative bg-gray-100 rounded-lg overflow-hidden max-w-md">
            <Image
              src={image}
              alt="Image preview"
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <button
            type="button"
            onClick={openFileDialog}
            className="mt-2 text-sm text-cyan-600 hover:text-cyan-700"
          >
            Change Image
          </button>
        </div>
      ) : (
        /* Upload Area */
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors max-w-md ${
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
              <p className="text-sm text-gray-600">Uploading image...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <ImageIcon className="h-12 w-12 text-gray-300 mb-4" />
              <Upload className="h-6 w-6 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-1">
                Drag image here or click to select
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF up to 5MB
              </p>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />
    </div>
  );
};

export default SingleImageUploader;