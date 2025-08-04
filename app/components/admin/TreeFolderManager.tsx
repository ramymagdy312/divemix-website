"use client";

import React, { useState, useEffect } from 'react';
import { 
  Folder, 
  FolderOpen, 
  Plus, 
  Trash2, 
  ChevronRight, 
  ChevronDown, 
  Check, 
  X,
  FolderPlus,
  Home
} from 'lucide-react';
import toast from 'react-hot-toast';

interface TreeFolderManagerProps {
  selectedFolder: string;
  onFolderSelect: (folder: string) => void;
  onFoldersChange?: () => void;
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

interface TreeNode {
  folder: FolderInfo;
  children: TreeNode[];
  isExpanded: boolean;
}

const TreeFolderManager: React.FC<TreeFolderManagerProps> = ({
  selectedFolder,
  onFolderSelect,
  onFoldersChange
}) => {
  const [folders, setFolders] = useState<FolderInfo[]>([]);
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [showCreateForm, setShowCreateForm] = useState<string | null>(null); // null or parent path
  const [newFolderName, setNewFolderName] = useState('');

  // Load folders recursively
  const loadFolders = async (parentPath: string = '') => {
    try {
      const url = parentPath 
        ? `/api/upload/folders?path=${encodeURIComponent(parentPath)}`
        : '/api/upload/folders';
        
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        return data.folders || [];
      }
      return [];
    } catch (error) {
      console.error('Error loading folders:', error);
      return [];
    }
  };

  // Build tree structure from flat folder list
  const buildTree = (folders: FolderInfo[]): TreeNode[] => {
    const tree: TreeNode[] = [];
    const folderMap = new Map<string, TreeNode>();

    // Create nodes for all folders
    folders.forEach(folder => {
      const node: TreeNode = {
        folder,
        children: [],
        isExpanded: expandedFolders.has(folder.fullPath)
      };
      folderMap.set(folder.fullPath, node);
    });

    // Build parent-child relationships
    folders.forEach(folder => {
      const node = folderMap.get(folder.fullPath);
      if (!node) return;

      if (folder.parentPath) {
        const parent = folderMap.get(folder.parentPath);
        if (parent) {
          parent.children.push(node);
        } else {
          // Parent not loaded yet, add to root for now
          tree.push(node);
        }
      } else {
        tree.push(node);
      }
    });

    return tree;
  };

  // Load all folders and build tree
  const loadAllFolders = async () => {
    setLoading(true);
    try {
      const allFolders: FolderInfo[] = [];
      const loadedPaths = new Set<string>();

      // Load root folders first
      const rootFolders = await loadFolders('');
      allFolders.push(...rootFolders);
      
      // Load subfolders for expanded folders
      for (const expandedPath of expandedFolders) {
        if (!loadedPaths.has(expandedPath)) {
          const subFolders = await loadFolders(expandedPath);
          allFolders.push(...subFolders);
          loadedPaths.add(expandedPath);
        }
      }

      setFolders(allFolders);
      setTreeData(buildTree(allFolders));
    } catch (error) {
      console.error('Error loading all folders:', error);
      toast.error('Failed to load folders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllFolders();
  }, [expandedFolders]);

  // Toggle folder expansion
  const toggleExpansion = async (folderPath: string) => {
    const newExpanded = new Set(expandedFolders);
    
    if (newExpanded.has(folderPath)) {
      newExpanded.delete(folderPath);
    } else {
      newExpanded.add(folderPath);
    }
    
    setExpandedFolders(newExpanded);
  };

  // Create new folder
  const createFolder = async (parentPath: string = '') => {
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
          parentPath: parentPath || undefined
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setNewFolderName('');
        setShowCreateForm(null);
        
        // Expand parent folder if creating nested folder
        if (parentPath) {
          setExpandedFolders(prev => new Set([...prev, parentPath]));
        }
        
        toast.success('Folder created successfully');
        onFoldersChange?.();
        loadAllFolders();
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
  const deleteFolder = async (folder: FolderInfo) => {
    const folderDisplayName = folder.fullPath || folder.name;
    
    if (!confirm(`⚠️ Delete folder "${folderDisplayName}"?\n\nThis will delete the folder and ALL contents including:\n- All images in this folder\n- All subfolders and their contents\n\nThis action cannot be undone.\n\nClick OK to confirm deletion.`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/upload/folders?path=${encodeURIComponent(folder.fullPath)}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove from expanded folders
        setExpandedFolders(prev => {
          const newSet = new Set(prev);
          newSet.delete(folder.fullPath);
          return newSet;
        });

        // If deleted folder was selected, switch to root
        if (selectedFolder === folder.fullPath) {
          onFolderSelect('root');
        }

        toast.success('Folder deleted successfully');
        onFoldersChange?.();
        loadAllFolders();
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

  // Render tree node
  const renderTreeNode = (node: TreeNode, level: number = 0) => {
    const { folder } = node;
    const isSelected = selectedFolder === folder.fullPath;
    const hasChildren = node.children.length > 0;
    const isExpanded = expandedFolders.has(folder.fullPath);

    return (
      <div key={folder.fullPath} className="select-none">
        {/* Folder Row */}
        <div
          className={`flex items-center py-2 px-2 rounded-lg cursor-pointer transition-colors ${
            isSelected
              ? 'bg-green-100 border-2 border-green-500'
              : 'hover:bg-gray-100 border-2 border-transparent'
          }`}
          style={{ marginLeft: `${level * 20}px` }}
        >
          {/* Expand/Collapse Button */}
          <button
            onClick={() => toggleExpansion(folder.fullPath)}
            className="p-1 hover:bg-gray-200 rounded mr-1"
            disabled={!hasChildren && !isExpanded}
          >
            {hasChildren || isExpanded ? (
              isExpanded ? (
                <ChevronDown className="h-4 w-4 text-gray-600" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-600" />
              )
            ) : (
              <div className="h-4 w-4" />
            )}
          </button>

          {/* Folder Icon */}
          <div className="mr-2">
            {isExpanded ? (
              <FolderOpen className={`h-5 w-5 ${
                isSelected ? 'text-green-600' : 'text-blue-500'
              }`} />
            ) : (
              <Folder className={`h-5 w-5 ${
                isSelected ? 'text-green-600' : 'text-gray-500'
              }`} />
            )}
          </div>

          {/* Folder Info */}
          <div
            onClick={() => onFolderSelect(folder.fullPath)}
            className="flex-1 min-w-0"
          >
            <p className={`font-medium truncate ${
              isSelected ? 'text-green-900' : 'text-gray-900'
            }`}>
              📁 {folder.name}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {folder.source === 'supabase' ? '☁️ Cloud' : '💻 Local'} • 
              {folder.isNested ? ` Nested in ${folder.parentPath}` : ' Root level'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-1 ml-2">
            {isSelected && (
              <div className="text-green-600 font-medium text-xs mr-2">
                ✓ Selected
              </div>
            )}
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowCreateForm(folder.fullPath);
              }}
              className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
              title="Create subfolder"
              disabled={loading}
            >
              <FolderPlus className="h-4 w-4" />
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteFolder(folder);
              }}
              className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
              title="Delete folder"
              disabled={loading}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Create Subfolder Form */}
        {showCreateForm === folder.fullPath && (
          <div className="mt-2 ml-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder={`New folder in ${folder.name}...`}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                onKeyPress={(e) => e.key === 'Enter' && createFolder(folder.fullPath)}
                autoFocus
              />
              <button
                onClick={() => createFolder(folder.fullPath)}
                disabled={loading || !newFolderName.trim()}
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Check className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  setShowCreateForm(null);
                  setNewFolderName('');
                }}
                className="px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-blue-600 mt-2">
              💡 Creating subfolder in: {folder.fullPath}
            </p>
          </div>
        )}

        {/* Render Children */}
        {isExpanded && node.children.length > 0 && (
          <div className="ml-4">
            {node.children.map(child => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Folder className="h-5 w-5 mr-2 text-blue-600" />
          🌳 Folder Tree
        </h3>
        <button
          onClick={() => setShowCreateForm('')}
          className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          disabled={loading}
        >
          <Plus className="h-4 w-4 mr-1" />
          New Root Folder
        </button>
      </div>

      {/* Create Root Folder Form */}
      {showCreateForm === '' && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Enter root folder name..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
              onKeyPress={(e) => e.key === 'Enter' && createFolder('')}
              autoFocus
            />
            <button
              onClick={() => createFolder('')}
              disabled={loading || !newFolderName.trim()}
              className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                setShowCreateForm(null);
                setNewFolderName('');
              }}
              className="px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="text-xs text-blue-600 mt-2">
            💡 Creating new root folder
          </p>
        </div>
      )}

      {/* Tree Structure */}
      <div className="space-y-1 max-h-96 overflow-y-auto">
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
            <Home className={`h-5 w-5 mr-3 ${
              selectedFolder === 'root' ? 'text-blue-600' : 'text-gray-500'
            }`} />
            <div>
              <p className={`font-medium ${
                selectedFolder === 'root' ? 'text-blue-900' : 'text-gray-900'
              }`}>
                🏠 Root Folder
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

        {/* Tree Nodes */}
        {loading ? (
          <div className="text-center py-6 text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm">Loading folders...</p>
          </div>
        ) : treeData.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <Folder className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No custom folders yet</p>
            <p className="text-xs">Create folders to organize your images</p>
          </div>
        ) : (
          treeData.map(node => renderTreeNode(node))
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          🌳 Create nested folders by clicking the <FolderPlus className="inline h-3 w-3" /> icon
        </p>
      </div>
    </div>
  );
};

export default TreeFolderManager;