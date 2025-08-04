"use client";

import React, { useState, useEffect } from 'react';
import { Folder, Plus, Trash2, FolderOpen, Edit3, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface FolderManagerProps {
  selectedFolder: string;
  onFolderSelect: (folder: string) => void;
  onFoldersChange?: () => void;
}

interface FolderInfo {
  name: string;
  path: string;
  source: string;
  createdAt: string;
}

const FolderManager: React.FC<FolderManagerProps> = ({
  selectedFolder,
  onFolderSelect,
  onFoldersChange
}) => {
  const [folders, setFolders] = useState<FolderInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [editingFolder, setEditingFolder] = useState<string | null>(null);
  const [editFolderName, setEditFolderName] = useState('');

  // Load folders
  const loadFolders = async () => {
    try {
      const response = await fetch('/api/upload/folders');
      if (response.ok) {
        const data = await response.json();
        setFolders(data.folders || []);
      }
    } catch (error) {
      console.error('Error loading folders:', error);
      toast.error('Failed to load folders');
    }
  };

  useEffect(() => {
    loadFolders();
  }, []);

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
        body: JSON.stringify({ folderName: newFolderName.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        setFolders(prev => [...prev, data.folder]);
        setNewFolderName('');
        setShowCreateForm(false);
        toast.success('Folder created successfully');
        onFoldersChange?.();
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
  const deleteFolder = async (folderName: string) => {
    if (!confirm(`⚠️ Delete folder "${folderName}"?\n\nThis will delete the folder and all images inside it. This action cannot be undone.\n\nClick OK to confirm deletion.`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/upload/folders?folder=${folderName}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setFolders(prev => prev.filter(f => f.name !== folderName));
        if (selectedFolder === folderName) {
          onFolderSelect('root');
        }
        toast.success('Folder deleted successfully');
        onFoldersChange?.();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to delete folder');
      }
    } catch (error) {
      console.error('Error deleting folder:', error);
      toast.error('Failed to delete folder');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Folder className="h-5 w-5 mr-2 text-blue-600" />
          📁 Folders
        </h3>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          disabled={loading}
        >
          <Plus className="h-4 w-4 mr-1" />
          New Folder
        </button>
      </div>

      {/* Create Folder Form */}
      {showCreateForm && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Enter folder name..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
              onKeyPress={(e) => e.key === 'Enter' && createFolder()}
              autoFocus
            />
            <button
              onClick={createFolder}
              disabled={loading || !newFolderName.trim()}
              className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
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
          <p className="text-xs text-blue-600 mt-2">
            💡 Folder names will be automatically cleaned (lowercase, no special characters)
          </p>
        </div>
      )}

      {/* Folders List */}
      <div className="space-y-2">
        {/* Root Folder */}
        <div
          onClick={() => onFolderSelect('root')}
          className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
            selectedFolder === 'root'
              ? 'bg-blue-100 border-2 border-blue-500'
              : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
          }`}
        >
          <div className="flex items-center">
            <FolderOpen className={`h-5 w-5 mr-3 ${
              selectedFolder === 'root' ? 'text-blue-600' : 'text-gray-500'
            }`} />
            <div>
              <p className={`font-medium ${
                selectedFolder === 'root' ? 'text-blue-900' : 'text-gray-900'
              }`}>
                📂 Root Folder
              </p>
              <p className="text-xs text-gray-500">Main uploads folder</p>
            </div>
          </div>
          {selectedFolder === 'root' && (
            <div className="text-blue-600 font-medium text-sm">
              ✓ Selected
            </div>
          )}
        </div>

        {/* Custom Folders */}
        {folders.map((folder) => (
          <div
            key={folder.name}
            className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
              selectedFolder === folder.name
                ? 'bg-green-100 border-2 border-green-500'
                : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
            }`}
          >
            <div
              onClick={() => onFolderSelect(folder.name)}
              className="flex items-center flex-1 cursor-pointer"
            >
              <Folder className={`h-5 w-5 mr-3 ${
                selectedFolder === folder.name ? 'text-green-600' : 'text-gray-500'
              }`} />
              <div>
                <p className={`font-medium ${
                  selectedFolder === folder.name ? 'text-green-900' : 'text-gray-900'
                }`}>
                  📁 {folder.name}
                </p>
                <p className="text-xs text-gray-500">
                  {folder.source === 'supabase' ? '☁️ Cloud' : '💻 Local'} • 
                  Created {new Date(folder.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {selectedFolder === folder.name && (
                <div className="text-green-600 font-medium text-sm mr-2">
                  ✓ Selected
                </div>
              )}
              
              <button
                onClick={() => deleteFolder(folder.name)}
                className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                title="Delete folder"
                disabled={loading}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {folders.length === 0 && !showCreateForm && (
          <div className="text-center py-6 text-gray-500">
            <Folder className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No custom folders yet</p>
            <p className="text-xs">Create folders to organize your images</p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          💡 Organize your images by creating folders for different categories
        </p>
      </div>
    </div>
  );
};

export default FolderManager;