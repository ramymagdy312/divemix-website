"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Folder, 
  FolderOpen, 
  Plus, 
  Trash2, 
  Upload,
  Home,
  ChevronRight,
  ArrowLeft,
  Check,
  X,
  Image as ImageIcon,
  Loader2,
  RefreshCw
} from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface FolderExplorerSingleProps {
  image: string;
  onImageChange: (image: string) => void;
  label?: string;
}

interface FolderInfo {
  name: string;
  path: string;
  fullPath: string;
  parentPath: string;
  source: string;
  createdAt: string;
  isNested: boolean;
}

const FolderExplorerSingle: React.FC<FolderExplorerSingleProps> = ({
  image,
  onImageChange,
  label = "Image"
}) => {
  const [currentPath, setCurrentPath] = useState('root');
  const [folders, setFolders] = useState<FolderInfo[]>([]);
  const [serverImages, setServerImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [pathHistory, setPathHistory] = useState<string[]>(['root']);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load folders and images for current path
  const loadCurrentPath = async (path: string = currentPath) => {
    setLoading(true);
    try {
      // Load folders
      const foldersUrl = path === 'root' 
        ? '/api/upload/folders' 
        : `/api/upload/folders?path=${encodeURIComponent(path)}`;
        
      const foldersResponse = await fetch(foldersUrl);
      if (foldersResponse.ok) {
        const foldersData = await foldersResponse.json();
        setFolders(foldersData.folders || []);
      }

      // Load images
      const imagesUrl = path === 'root' 
        ? '/api/upload/list' 
        : `/api/upload/list?folder=${encodeURIComponent(path)}`;
        
      const imagesResponse = await fetch(imagesUrl);
      if (imagesResponse.ok) {
        const imagesData = await imagesResponse.json();
        const imageUrls = imagesData.images?.map((img: any) => img.url) || [];
        setServerImages(imageUrls);
      }
    } catch (error) {
      console.error('Error loading path:', error);
      toast.error('Failed to load folder contents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCurrentPath();
  }, [currentPath]);

  // Navigate to folder
  const navigateToFolder = (folderPath: string) => {
    setCurrentPath(folderPath);
    setPathHistory(prev => [...prev, folderPath]);
  };

  // Navigate back
  const navigateBack = () => {
    if (pathHistory.length > 1) {
      const newHistory = [...pathHistory];
      newHistory.pop(); // Remove current
      const previousPath = newHistory[newHistory.length - 1];
      setPathHistory(newHistory);
      setCurrentPath(previousPath);
    }
  };

  // Navigate to specific path from breadcrumb
  const navigateToPath = (targetPath: string, index: number) => {
    setCurrentPath(targetPath);
    setPathHistory(prev => prev.slice(0, index + 1));
  };

  // Create new folder
  const createFolder = async () => {
    if (!newFolderName.trim()) {
      toast.error('Please enter a folder name');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/upload/folders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          folderName: newFolderName.trim(),
          parentPath: currentPath === 'root' ? undefined : currentPath
        }),
      });

      if (response.ok) {
        setNewFolderName('');
        setShowCreateForm(false);
        toast.success('Folder created successfully');
        loadCurrentPath();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to create folder');
      }
    } catch (error) {
      console.error('Error creating folder:', error);
      toast.error('Failed to create folder');
    } finally {
      setLoading(false);
    }
  };

  // Delete folder
  const deleteFolder = async (folder: FolderInfo, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent folder navigation
    
    const folderDisplayName = folder.name;
    
    if (!confirm(`⚠️ Delete folder "${folderDisplayName}"?\n\nThis will delete the folder and ALL contents including:\n- All images in this folder\n- All subfolders and their contents\n\nThis action cannot be undone.\n\nClick OK to confirm deletion.`)) {
      return;
    }

    setLoading(true);
    console.log('Deleting folder:', folder.fullPath);
    
    try {
      const response = await fetch(`/api/upload/folders?path=${encodeURIComponent(folder.fullPath)}`, {
        method: 'DELETE',
      });

      console.log('Delete response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Delete result:', result);
        toast.success(`Folder "${folderDisplayName}" deleted successfully`);
        loadCurrentPath();
      } else {
        const error = await response.json();
        console.error('Delete error response:', error);
        toast.error(error.error || 'Failed to delete folder');
      }
    } catch (error) {
      console.error('Error deleting folder:', error);
      toast.error('Network error: Failed to delete folder');
    } finally {
      setLoading(false);
    }
  };

  // Delete image
  const deleteImage = async (imageUrl: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent image selection
    
    const imageName = imageUrl.split('/').pop() || 'image';
    
    if (!confirm(`⚠️ Delete image "${imageName}"?\n\nThis action cannot be undone.\n\nClick OK to confirm deletion.`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/upload/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl }),
      });

      if (response.ok) {
        // Clear selection if this image was selected
        if (image === imageUrl) {
          onImageChange('');
        }
        toast.success('Image deleted successfully');
        loadCurrentPath();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to delete image');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    } finally {
      setLoading(false);
    }
  };

  // Handle file upload
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
      formData.append('folder', currentPath);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      onImageChange(result.url);
      
      const folderName = currentPath === 'root' ? 'root folder' : currentPath;
      toast.success(`Image uploaded successfully to ${folderName}`);
      loadCurrentPath(); // Refresh to show new image
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error occurred while uploading image');
    } finally {
      setUploading(false);
    }
  };

  // Select image
  const selectImage = (imageUrl: string) => {
    onImageChange(imageUrl);
  };

  // Get breadcrumb path
  const getBreadcrumbPath = () => {
    return pathHistory.map((path, index) => ({
      name: path === 'root' ? 'Home' : path.split('/').pop() || path,
      path: path,
      index: index
    }));
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header with breadcrumb and actions */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <FolderOpen className="h-5 w-5 mr-2 text-green-600" />
            🖼️ {label} Explorer
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => loadCurrentPath()}
              disabled={loading}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-white rounded-lg transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 mb-3">
          <button
            onClick={navigateBack}
            disabled={pathHistory.length <= 1}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          
          <div className="flex items-center space-x-1 bg-white rounded-lg px-3 py-2 border flex-1">
            {getBreadcrumbPath().map((item, index) => (
              <React.Fragment key={item.path}>
                {index > 0 && <ChevronRight className="h-3 w-3 text-gray-400" />}
                <button
                  onClick={() => navigateToPath(item.path, item.index)}
                  className={`text-sm px-2 py-1 rounded hover:bg-gray-100 transition-colors ${
                    index === getBreadcrumbPath().length - 1 
                      ? 'text-green-600 font-medium' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {index === 0 ? (
                    <div className="flex items-center">
                      <Home className="h-3 w-3 mr-1" />
                      {item.name}
                    </div>
                  ) : (
                    item.name
                  )}
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowCreateForm(true)}
            disabled={loading}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-50"
          >
            <Plus className="h-4 w-4 mr-1" />
            New Folder
          </button>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm disabled:opacity-50"
          >
            <Upload className="h-4 w-4 mr-1" />
            {uploading ? 'Uploading...' : 'Upload Image'}
          </button>

          <div className="text-sm text-gray-600">
            📂 {currentPath === 'root' ? 'Root Folder' : currentPath} • 
            {folders.length} folder(s) • {serverImages.length} image(s)
          </div>
        </div>

        {/* Create Folder Form */}
        {showCreateForm && (
          <div className="mt-3 p-3 bg-white rounded-lg border">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-sm"
                onKeyPress={(e) => e.key === 'Enter' && createFolder()}
                autoFocus
              />
              <button
                onClick={createFolder}
                disabled={loading || !newFolderName.trim()}
                className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <Check className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setNewFolderName('');
                }}
                className="px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-green-600 mt-2">
              💡 Creating folder in: {currentPath === 'root' ? 'Root' : currentPath}
            </p>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-4">
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-green-600 mx-auto mb-4" />
            <p className="text-gray-500">Loading folder contents...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Folders Grid */}
            {folders.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                  <Folder className="h-4 w-4 mr-2 text-blue-500" />
                  📁 Folders ({folders.length})
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                  {folders.map((folder) => (
                    <div
                      key={folder.fullPath}
                      className="group relative bg-gray-50 hover:bg-blue-50 rounded-lg p-3 cursor-pointer transition-colors border border-gray-200 hover:border-blue-300"
                    >
                      <div
                        onClick={() => navigateToFolder(folder.fullPath)}
                        className="text-center"
                      >
                        <Folder className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {folder.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {folder.source === 'supabase' ? '☁️ Cloud' : '💻 Local'}
                        </p>
                      </div>
                      
                      {/* Delete Button */}
                      <button
                        onClick={(e) => deleteFolder(folder, e)}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white hover:bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg hover:shadow-xl"
                        title="Delete folder"
                        disabled={loading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Images Grid */}
            {serverImages.length > 0 ? (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                  <ImageIcon className="h-4 w-4 mr-2 text-green-500" />
                  🖼️ Images ({serverImages.length})
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {serverImages.map((imageUrl, index) => {
                    const isSelected = image === imageUrl;
                    return (
                      <div
                        key={index}
                        onClick={() => selectImage(imageUrl)}
                        className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                          isSelected
                            ? 'border-green-500 ring-2 ring-green-200 shadow-lg'
                            : 'border-gray-200 hover:border-green-500 hover:shadow-md'
                        }`}
                      >
                        <div className="aspect-square relative bg-gray-100">
                          <Image
                            src={imageUrl}
                            alt={`Image ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                          {isSelected && (
                            <div className="absolute inset-0 bg-green-500 bg-opacity-20 flex items-center justify-center">
                              <div className="bg-green-500 text-white rounded-full p-1">
                                <Check className="h-4 w-4" />
                              </div>
                            </div>
                          )}
                          
                          {/* Delete Image Button */}
                          <button
                            onClick={(e) => deleteImage(imageUrl, e)}
                            className="absolute top-2 right-2 p-2 bg-red-500 text-white hover:bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg hover:shadow-xl"
                            title="Delete image"
                            disabled={loading}
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-xs truncate">
                            {imageUrl.split('/').pop()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : folders.length === 0 ? (
              <div className="text-center py-12">
                <FolderOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">This folder is empty</p>
                <p className="text-sm text-gray-400">Create folders or upload images to get started</p>
              </div>
            ) : (
              <div className="text-center py-8">
                <ImageIcon className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No images in this folder</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Selected Image Summary */}
      {image && (
        <div className="border-t bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Check className="h-4 w-4 text-green-600 mr-2" />
              <span className="text-sm font-medium text-gray-900">
                Image selected: {image.split('/').pop()}
              </span>
            </div>
            <button
              onClick={() => onImageChange('')}
              className="text-sm text-red-600 hover:text-red-800 underline"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
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

export default FolderExplorerSingle;