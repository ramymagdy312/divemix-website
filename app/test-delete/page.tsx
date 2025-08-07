"use client";

import {
  AlertTriangle,
  CheckCircle,
  Folder,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

interface FolderInfo {
  name: string;
  path: string;
  fullPath: string;
  parentPath: string;
  source: string;
  createdAt: string;
  isNested: boolean;
}

export default function TestDeletePage() {
  const [folders, setFolders] = useState<FolderInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [testResults, setTestResults] = useState<string[]>([]);

  // Load folders
  const loadFolders = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/upload/folders");
      if (response.ok) {
        const data = await response.json();
        setFolders(data.folders || []);
        addTestResult(`✅ Loaded ${data.folders?.length || 0} folders`);
      } else {
        addTestResult(`❌ Failed to load folders: ${response.status}`);
      }
    } catch (error) {
      addTestResult(`❌ Error loading folders: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  // Add test result
  const addTestResult = (message: string) => {
    setTestResults((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  // Create test folder
  const createTestFolder = async () => {
    if (!newFolderName.trim()) {
      toast.error("Please enter a folder name");
      return;
    }

    setLoading(true);
    addTestResult(`🔄 Creating folder: ${newFolderName}`);

    try {
      const response = await fetch("/api/upload/folders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          folderName: newFolderName.trim(),
        }),
      });

      const result = await response.json();
      addTestResult(`📝 Create response: ${JSON.stringify(result)}`);

      if (response.ok) {
        toast.success("Folder created successfully");
        addTestResult(`✅ Folder created: ${newFolderName}`);
        setNewFolderName("");
        loadFolders();
      } else {
        toast.error(result.error || "Failed to create folder");
        addTestResult(`❌ Create failed: ${result.error}`);
      }
    } catch (error) {
      addTestResult(`❌ Create error: ${error}`);
      toast.error("Error creating folder");
    } finally {
      setLoading(false);
    }
  };

  // Delete folder with detailed logging
  const deleteFolder = async (folder: FolderInfo) => {
    addTestResult(
      `🔄 Starting deletion of folder: ${folder.name} (${folder.fullPath})`
    );

    if (!confirm(`Delete folder "${folder.name}"?`)) {
      addTestResult(`❌ Deletion cancelled by user`);
      return;
    }

    setLoading(true);

    try {
      addTestResult(
        `📤 Sending DELETE request to: /api/upload/folders?path=${encodeURIComponent(
          folder.fullPath
        )}`
      );

      const response = await fetch(
        `/api/upload/folders?path=${encodeURIComponent(folder.fullPath)}`,
        {
          method: "DELETE",
        }
      );

      addTestResult(
        `📥 Response status: ${response.status} ${response.statusText}`
      );

      const result = await response.json();
      addTestResult(`📝 Response body: ${JSON.stringify(result)}`);

      if (response.ok) {
        toast.success(`Folder "${folder.name}" deleted successfully`);
        addTestResult(`✅ Folder deleted successfully: ${folder.name}`);
        loadFolders();
      } else {
        toast.error(result.error || "Failed to delete folder");
        addTestResult(`❌ Delete failed: ${result.error || "Unknown error"}`);
      }
    } catch (error) {
      addTestResult(`❌ Network error: ${error}`);
      toast.error("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Test API endpoint directly
  const testDeleteAPI = async () => {
    addTestResult(`🧪 Testing DELETE API endpoint directly...`);

    try {
      const response = await fetch("/api/upload/folders?path=test-folder", {
        method: "DELETE",
      });

      addTestResult(
        `📥 API Test Response: ${response.status} ${response.statusText}`
      );

      const result = await response.json();
      addTestResult(`📝 API Test Body: ${JSON.stringify(result)}`);
    } catch (error) {
      addTestResult(`❌ API Test Error: ${error}`);
    }
  };

  // Clear test results
  const clearResults = () => {
    setTestResults([]);
  };

  useEffect(() => {
    loadFolders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Toaster position="top-right" />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <Trash2 className="h-6 w-6 mr-2 text-red-600" />
            🔧 Delete Functionality Diagnostic Tool
          </h1>
          <p className="text-gray-600">
            This tool helps diagnose issues with folder deletion. It provides
            detailed logging of all API calls and responses.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Panel - Folder Management */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Folder className="h-5 w-5 mr-2 text-blue-600" />
              📁 Folder Management
            </h2>

            {/* Create Folder */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-2">
                Create Test Folder:
              </h3>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Enter folder name..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  onKeyPress={(e) => e.key === "Enter" && createTestFolder()}
                />
                <button
                  onClick={createTestFolder}
                  disabled={loading || !newFolderName.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Create
                </button>
              </div>
            </div>

            {/* Refresh Button */}
            <div className="mb-4">
              <button
                onClick={loadFolders}
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center"
              >
                <RefreshCw
                  className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`}
                />
                Refresh Folders
              </button>
            </div>

            {/* Test API Button */}
            <div className="mb-6">
              <button
                onClick={testDeleteAPI}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center"
              >
                <AlertTriangle className="h-4 w-4 mr-1" />
                Test Delete API
              </button>
            </div>

            {/* Folders List */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">
                Current Folders ({folders.length}):
              </h3>
              {folders.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  No folders found. Create one to test deletion.
                </p>
              ) : (
                <div className="space-y-2">
                  {folders.map((folder) => (
                    <div
                      key={folder.fullPath}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {folder.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Path: {folder.fullPath} • Source: {folder.source}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteFolder(folder)}
                        disabled={loading}
                        className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Test Results */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                📊 Test Results & Logs
              </h2>
              <button
                onClick={clearResults}
                className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 transition-colors"
              >
                Clear
              </button>
            </div>

            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
              {testResults.length === 0 ? (
                <p className="text-gray-500">
                  No test results yet. Perform some actions to see logs here.
                </p>
              ) : (
                testResults.map((result, index) => (
                  <div key={index} className="mb-1">
                    {result}
                  </div>
                ))
              )}
            </div>

            {/* Instructions */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-medium text-blue-900 mb-2">
                🔍 How to Use This Tool:
              </h3>
              <ol className="text-sm text-blue-800 space-y-1">
                <li>1. Create a test folder using the input above</li>
                <li>2. Try to delete the folder using the Delete button</li>
                <li>3. Watch the detailed logs in the console area</li>
                <li>4. Check for any error messages or failed API calls</li>
                <li>5. Use "Test Delete API" to test the endpoint directly</li>
              </ol>
            </div>

            {/* Common Issues */}
            <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h3 className="font-medium text-yellow-900 mb-2">
                ⚠️ Common Issues:
              </h3>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• API endpoint not responding (check server logs)</li>
                <li>• Supabase connection issues (check credentials)</li>
                <li>• Folder path encoding problems</li>
                <li>• Permission issues with file system</li>
                <li>• Network connectivity problems</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
