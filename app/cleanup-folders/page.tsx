"use client";

import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import { 
  Trash2, 
  RefreshCw, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Folder,
  FolderX,
  Eye,
  Zap
} from 'lucide-react';

interface FolderStatus {
  folder: string;
  exists: boolean;
  fileCount: number;
  files: string[];
  error?: string;
}

interface CleanupResult {
  folder: string;
  success: boolean;
  filesDeleted: number;
  error?: string;
  message?: string;
}

export default function CleanupFoldersPage() {
  const [folderStatus, setFolderStatus] = useState<FolderStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [cleanupResults, setCleanupResults] = useState<CleanupResult[]>([]);

  // Check default folders status
  const checkFolders = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/upload/cleanup');
      if (response.ok) {
        const data = await response.json();
        setFolderStatus(data.defaultFolders || []);
        toast.success('Folder status updated');
      } else {
        toast.error('Failed to check folder status');
      }
    } catch (error) {
      console.error('Error checking folders:', error);
      toast.error('Error checking folders');
    } finally {
      setLoading(false);
    }
  };

  // Cleanup default folders
  const cleanupFolders = async () => {
    if (!confirm('⚠️ This will delete all default folders (products, categories, gallery) and their contents.\n\nAre you sure you want to continue?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/upload/cleanup', {
        method: 'DELETE',
      });

      if (response.ok) {
        const data = await response.json();
        setCleanupResults(data.results || []);
        toast.success('Cleanup completed successfully');
        
        // Refresh folder status
        setTimeout(() => {
          checkFolders();
        }, 1000);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Cleanup failed');
      }
    } catch (error) {
      console.error('Error during cleanup:', error);
      toast.error('Network error during cleanup');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkFolders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Toaster position="top-right" />
      
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <FolderX className="h-6 w-6 mr-2 text-red-600" />
            🧹 Default Folders Cleanup Tool
          </h1>
          <p className="text-gray-600 mb-4">
            This tool helps you remove the unwanted default folders (products, categories, gallery) that appear automatically.
          </p>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-900">Important Notice</h3>
                <p className="text-sm text-yellow-800 mt-1">
                  The system was creating default folders automatically. This has been disabled in the code, 
                  but existing default folders need to be manually removed.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={checkFolders}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Check Folder Status
            </button>
            
            <button
              onClick={cleanupFolders}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Default Folders
            </button>
          </div>
        </div>

        {/* Folder Status */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Eye className="h-5 w-5 mr-2 text-blue-600" />
            📊 Default Folders Status
          </h2>

          {folderStatus.length === 0 ? (
            <p className="text-gray-500">Click "Check Folder Status" to see current status</p>
          ) : (
            <div className="space-y-4">
              {folderStatus.map((folder) => (
                <div
                  key={folder.folder}
                  className={`p-4 rounded-lg border-2 ${
                    folder.exists 
                      ? 'border-red-200 bg-red-50' 
                      : 'border-green-200 bg-green-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      {folder.exists ? (
                        <XCircle className="h-5 w-5 text-red-600 mr-2" />
                      ) : (
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      )}
                      <h3 className="font-medium text-gray-900">
                        📁 {folder.folder}
                      </h3>
                    </div>
                    <span className={`px-2 py-1 rounded text-sm font-medium ${
                      folder.exists 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {folder.exists ? 'EXISTS' : 'NOT FOUND'}
                    </span>
                  </div>
                  
                  {folder.exists && (
                    <div className="text-sm text-gray-600">
                      <p>📄 Files: {folder.fileCount}</p>
                      {folder.files.length > 0 && (
                        <div className="mt-2">
                          <p className="font-medium">Contents:</p>
                          <ul className="list-disc list-inside ml-4 text-xs">
                            {folder.files.slice(0, 5).map((file, index) => (
                              <li key={index}>{file}</li>
                            ))}
                            {folder.files.length > 5 && (
                              <li>... and {folder.files.length - 5} more files</li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {folder.error && (
                    <p className="text-sm text-red-600 mt-2">
                      ❌ Error: {folder.error}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cleanup Results */}
        {cleanupResults.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Zap className="h-5 w-5 mr-2 text-purple-600" />
              🧹 Cleanup Results
            </h2>

            <div className="space-y-3">
              {cleanupResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    result.success 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {result.success ? (
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600 mr-2" />
                      )}
                      <span className="font-medium">📁 {result.folder}</span>
                    </div>
                    <span className="text-sm text-gray-600">
                      🗑️ {result.filesDeleted} files deleted
                    </span>
                  </div>
                  
                  {result.message && (
                    <p className="text-sm text-gray-600 mt-1 ml-6">
                      💬 {result.message}
                    </p>
                  )}
                  
                  {result.error && (
                    <p className="text-sm text-red-600 mt-1 ml-6">
                      ❌ {result.error}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            📋 How to Use This Tool
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium mr-3">1</span>
              <div>
                <h3 className="font-medium text-gray-900">Check Current Status</h3>
                <p className="text-sm text-gray-600">Click "Check Folder Status" to see which default folders currently exist</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-800 rounded-full flex items-center justify-center text-sm font-medium mr-3">2</span>
              <div>
                <h3 className="font-medium text-gray-900">Delete Unwanted Folders</h3>
                <p className="text-sm text-gray-600">Click "Delete Default Folders" to remove all default folders and their contents</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-sm font-medium mr-3">3</span>
              <div>
                <h3 className="font-medium text-gray-900">Verify Results</h3>
                <p className="text-sm text-gray-600">Check the cleanup results and verify that folders are no longer appearing</p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-medium text-blue-900 mb-2">✅ What's Been Fixed:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Disabled automatic creation of default folders in the code</li>
              <li>• Created this cleanup tool to remove existing default folders</li>
              <li>• Now you can create your own folder structure without interference</li>
            </ul>
          </div>

          <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="font-medium text-green-900 mb-2">🎯 After Cleanup:</h3>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• No more automatic default folders will be created</li>
              <li>• You can create any folder structure you want</li>
              <li>• The Windows Explorer interface will be clean and empty initially</li>
              <li>• You have full control over your folder organization</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}