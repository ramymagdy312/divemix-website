"use client";

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Save, RotateCcw } from 'lucide-react';

interface DraggableMapProps {
  latitude: number;
  longitude: number;
  onLocationChange: (lat: number, lng: number) => void;
  onSave?: () => void;
  className?: string;
  height?: string;
}

const DraggableMap: React.FC<DraggableMapProps> = ({
  latitude,
  longitude,
  onLocationChange,
  onSave,
  className = "",
  height = "400px"
}) => {
  const [currentLat, setCurrentLat] = useState(latitude);
  const [currentLng, setCurrentLng] = useState(longitude);
  const [isDragging, setIsDragging] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentLat(latitude);
    setCurrentLng(longitude);
    setHasChanges(false);
  }, [latitude, longitude]);

  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!mapRef.current) return;

    const rect = mapRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Convert pixel coordinates to lat/lng (simplified calculation)
    // This is a basic implementation - in a real app you'd use a proper map library
    const mapWidth = rect.width;
    const mapHeight = rect.height;
    
    // Approximate conversion (this would need proper map projection in real implementation)
    const newLng = currentLng + ((x - mapWidth / 2) / mapWidth) * 0.01;
    const newLat = currentLat - ((y - mapHeight / 2) / mapHeight) * 0.01;

    setCurrentLat(newLat);
    setCurrentLng(newLng);
    setHasChanges(true);
    onLocationChange(newLat, newLng);
  };

  const handleReset = () => {
    setCurrentLat(latitude);
    setCurrentLng(longitude);
    setHasChanges(false);
    onLocationChange(latitude, longitude);
  };

  const handleSave = () => {
    if (onSave) {
      onSave();
      setHasChanges(false);
    }
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-300 overflow-hidden ${className}`}>
      {/* Map Header */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 space-x-reverse">
            <MapPin className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              الموقع: {currentLat.toFixed(6)}, {currentLng.toFixed(6)}
            </span>
          </div>
          
          <div className="flex items-center space-x-2 space-x-reverse">
            {hasChanges && (
              <>
                <button
                  onClick={handleReset}
                  className="flex items-center space-x-1 space-x-reverse px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>إعادة تعيين</span>
                </button>
                
                {onSave && (
                  <button
                    onClick={handleSave}
                    className="flex items-center space-x-1 space-x-reverse px-3 py-1 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                  >
                    <Save className="w-4 h-4" />
                    <span>حفظ</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative">
        {/* Interactive Overlay */}
        <div
          ref={mapRef}
          onClick={handleMapClick}
          className="absolute inset-0 z-10 cursor-crosshair"
          style={{ height }}
        >
          {/* Custom Marker */}
          <div
            className="absolute transform -translate-x-1/2 -translate-y-full z-20 pointer-events-none"
            style={{
              left: '50%',
              top: '50%',
            }}
          >
            <div className="relative">
              <MapPin className={`w-8 h-8 ${hasChanges ? 'text-red-500' : 'text-blue-500'} drop-shadow-lg`} />
              <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 ${hasChanges ? 'bg-red-500' : 'bg-blue-500'} rounded-full`} />
            </div>
          </div>
          
          {/* Click instruction */}
          <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-2 rounded-md text-sm">
            انقر على الخريطة لتحديد الموقع
          </div>
        </div>

        {/* Google Maps Embed */}
        <iframe
          src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY'}&q=${currentLat},${currentLng}&zoom=15`}
          width="100%"
          height={height}
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="خريطة تفاعلية"
        />
      </div>

      {/* Instructions */}
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          <p className="mb-2">
            <strong>تعليمات:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>انقر على الخريطة لتحديد موقع جديد</li>
            <li>يمكنك أيضاً إدخال الإحداثيات يدوياً في الحقول أعلاه</li>
            <li>استخدم "إعادة تعيين" للعودة للموقع الأصلي</li>
            <li>اضغط "حفظ" لحفظ التغييرات</li>
          </ul>
        </div>
      </div>

      {/* Manual Coordinates Input */}
      <div className="bg-white px-4 py-3 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              خط العرض (Latitude)
            </label>
            <input
              type="number"
              step="any"
              value={currentLat}
              onChange={(e) => {
                const newLat = parseFloat(e.target.value) || 0;
                setCurrentLat(newLat);
                setHasChanges(true);
                onLocationChange(newLat, currentLng);
              }}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              خط الطول (Longitude)
            </label>
            <input
              type="number"
              step="any"
              value={currentLng}
              onChange={(e) => {
                const newLng = parseFloat(e.target.value) || 0;
                setCurrentLng(newLng);
                setHasChanges(true);
                onLocationChange(currentLat, newLng);
              }}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DraggableMap;