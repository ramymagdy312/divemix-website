"use client";

import { useState } from 'react';
import ImageUploader from '../components/admin/ImageUploader';

export default function TestProductForm() {
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    images: [] as string[],
  });

  const handleImagesChange = (newImages: string[]) => {
    console.log('Images changed:', newImages);
    setImages(newImages);
    setFormData({ 
      ...formData, 
      images: newImages 
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    alert(`Form submitted with ${formData.images.length} images`);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">🧪 Test Product Form - Multiple Images</h1>
      
      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter product name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter product description"
            />
          </div>

          <div>
            <ImageUploader
              images={formData.images}
              onImagesChange={handleImagesChange}
              multiple={true}
              maxImages={10}
              label="Product Images"
            />
            <p className="text-sm text-gray-500 mt-2">
              Upload multiple images for this product. The first image will be used as the main image.
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Current Form Data:</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <div><strong>Name:</strong> {formData.name || 'Not set'}</div>
              <div><strong>Description:</strong> {formData.description || 'Not set'}</div>
              <div><strong>Images Count:</strong> {formData.images.length}</div>
              <div><strong>Images:</strong></div>
              <ul className="ml-4 space-y-1">
                {formData.images.map((img, index) => (
                  <li key={index} className="text-xs break-all">
                    {index + 1}. {img}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-cyan-600 text-white py-2 px-4 rounded-md hover:bg-cyan-700 transition-colors"
          >
            Test Submit (Check Console)
          </button>
        </form>
      </div>

      <div className="mt-8 bg-blue-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">🔍 Testing Instructions:</h2>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>Try uploading multiple images using the ImageUploader</li>
          <li>Check that the form data updates correctly</li>
          <li>Submit the form and check the console for the data</li>
          <li>Verify that all images are included in the form submission</li>
        </ol>
      </div>
    </div>
  );
}