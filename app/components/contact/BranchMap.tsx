"use client";

import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Navigation, ExternalLink } from 'lucide-react';

interface Branch {
  id: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  latitude?: number;
  longitude?: number;
  map_url?: string;
  working_hours?: Record<string, string>;
  is_active: boolean;
  display_order: number;
}

interface BranchMapProps {
  branches: Branch[];
  selectedBranchId?: string;
  onBranchSelect?: (branchId: string) => void;
  className?: string;
  height?: string;
}

const BranchMap: React.FC<BranchMapProps> = ({
  branches,
  selectedBranchId,
  onBranchSelect,
  className = "",
  height = "400px"
}) => {
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  useEffect(() => {
    if (selectedBranchId) {
      const branch = branches.find(b => b.id === selectedBranchId);
      if (branch) {
        setSelectedBranch(branch);
      }
    } else if (branches.length > 0) {
      setSelectedBranch(branches[0]);
    }
  }, [selectedBranchId, branches]);

  const handleBranchClick = (branch: Branch) => {
    setSelectedBranch(branch);
    if (onBranchSelect) {
      onBranchSelect(branch.id);
    }
  };

  const getWorkingHoursText = (workingHours?: Record<string, string>) => {
    if (!workingHours) return 'غير محدد';
    
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const todayHours = workingHours[today];
    
    if (todayHours === 'closed') {
      return 'مغلق اليوم';
    }
    
    return todayHours || 'غير محدد';
  };

  // Function to convert Google Maps URL to embed URL
  const convertToEmbedUrl = (url: string) => {
    try {
      // If it's already an embed URL, return as is
      if (url.includes('/embed/')) {
        return url;
      }
      
      // Extract place ID or coordinates from the URL
      const placeIdMatch = url.match(/place\/([^\/]+)/);
      if (placeIdMatch) {
        const placeName = placeIdMatch[1];
        return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dO_BcqCGAOtice&q=${encodeURIComponent(placeName)}`;
      }
      
      // Extract coordinates from URL
      const coordMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (coordMatch) {
        const lat = coordMatch[1];
        const lng = coordMatch[2];
        return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dO_BcqCGAOtice&q=${lat},${lng}&zoom=15`;
      }
      
      // Fallback: try to convert place URL to embed
      if (url.includes('google.com/maps/place/')) {
        return url.replace('google.com/maps/place/', 'google.com/maps/embed/place/');
      }
      
      return url;
    } catch (error) {
      console.error('Error converting URL:', error);
      return url;
    }
  };

  const openInGoogleMaps = (branch: Branch) => {
    if (branch.map_url) {
      window.open(branch.map_url, '_blank');
    } else if (branch.latitude && branch.longitude) {
      const url = `https://www.google.com/maps/search/?api=1&query=${branch.latitude},${branch.longitude}`;
      window.open(url, '_blank');
    }
  };

  const getDirections = (branch: Branch) => {
    if (branch.latitude && branch.longitude) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${branch.latitude},${branch.longitude}`;
      window.open(url, '_blank');
    } else if (branch.map_url) {
      // Extract coordinates from Google Maps URL if possible
      window.open(branch.map_url, '_blank');
    }
  };

  if (branches.length === 0) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`} style={{ height }}>
        <p className="text-gray-500">لا توجد فروع متاحة</p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${className}`}>
      {/* Branch Selector */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold">فروعنا</h3>
          <span className="text-sm bg-white/20 px-2 py-1 rounded">
            {branches.length} فرع
          </span>
        </div>
        
        <select
          value={selectedBranch?.id || ''}
          onChange={(e) => {
            const branch = branches.find(b => b.id === e.target.value);
            if (branch) handleBranchClick(branch);
          }}
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30"
        >
          {branches.map((branch) => (
            <option key={branch.id} value={branch.id} className="text-gray-900">
              {branch.name}
            </option>
          ))}
        </select>
      </div>

      {/* Map Container */}
      <div className="relative">
        {selectedBranch?.map_url ? (
          <div>
            {/* Debug info */}
            <div className="mb-2 p-2 bg-blue-50 text-xs text-blue-600 rounded">
              <strong>Debug:</strong> Map URL found: {selectedBranch.map_url.substring(0, 50)}...
              <br />
              <strong>Embed URL:</strong> {convertToEmbedUrl(selectedBranch.map_url).substring(0, 50)}...
            </div>
            <iframe
              src={convertToEmbedUrl(selectedBranch.map_url)}
              width="100%"
              height={height}
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`خريطة ${selectedBranch?.name || 'الفرع'}`}
            />
          </div>
        ) : selectedBranch?.latitude && selectedBranch?.longitude ? (
          <iframe
            src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dO_BcqCGAOtice&q=${selectedBranch.latitude},${selectedBranch.longitude}&zoom=15`}
            width="100%"
            height={height}
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`خريطة ${selectedBranch?.name || 'الفرع'}`}
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-100 text-gray-500" style={{ height }}>
            <div className="text-center">
              <MapPin className="w-12 h-12 mx-auto mb-2" />
              <p>لا توجد خريطة متاحة لهذا الفرع</p>
              <p className="text-sm mt-2">يرجى إضافة رابط Google Maps في لوحة التحكم</p>
            </div>
          </div>
        )}
        
        {/* Map Overlay with Branch Info */}
        {selectedBranch && (
          <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 mb-2">{selectedBranch.name}</h4>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-start space-x-2 space-x-reverse">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-cyan-600" />
                    <span>{selectedBranch.address}</span>
                  </div>
                  
                  {selectedBranch.phone && (
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Phone className="w-4 h-4 flex-shrink-0 text-cyan-600" />
                      <a 
                        href={`tel:${selectedBranch.phone}`}
                        className="text-cyan-600 hover:text-cyan-700"
                      >
                        {selectedBranch.phone}
                      </a>
                    </div>
                  )}
                  
                  {selectedBranch.email && (
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Mail className="w-4 h-4 flex-shrink-0 text-cyan-600" />
                      <a 
                        href={`mailto:${selectedBranch.email}`}
                        className="text-cyan-600 hover:text-cyan-700"
                      >
                        {selectedBranch.email}
                      </a>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Clock className="w-4 h-4 flex-shrink-0 text-cyan-600" />
                    <span>{getWorkingHoursText(selectedBranch.working_hours)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2 mr-3">
                <button
                  onClick={() => getDirections(selectedBranch)}
                  className="flex items-center space-x-1 space-x-reverse px-3 py-1 bg-cyan-600 text-white text-xs rounded-md hover:bg-cyan-700 transition-colors"
                >
                  <Navigation className="w-3 h-3" />
                  <span>اتجاهات</span>
                </button>
                
                <button
                  onClick={() => openInGoogleMaps(selectedBranch)}
                  className="flex items-center space-x-1 space-x-reverse px-3 py-1 bg-gray-600 text-white text-xs rounded-md hover:bg-gray-700 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>فتح</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Branch List */}
      <div className="p-4 bg-gray-50">
        <h4 className="font-medium text-gray-900 mb-3">جميع الفروع</h4>
        <div className="grid grid-cols-1 gap-3">
          {branches.map((branch) => (
            <div
              key={branch.id}
              onClick={() => handleBranchClick(branch)}
              className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                selectedBranch?.id === branch.id
                  ? 'bg-cyan-100 border-2 border-cyan-300'
                  : 'bg-white border border-gray-200 hover:border-cyan-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-medium text-gray-900">{branch.name}</h5>
                  <p className="text-sm text-gray-600 mt-1">{branch.address}</p>
                  {branch.phone && (
                    <p className="text-sm text-cyan-600 mt-1">{branch.phone}</p>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 space-x-reverse">
                  <MapPin className={`w-5 h-5 ${
                    selectedBranch?.id === branch.id ? 'text-cyan-600' : 'text-gray-400'
                  }`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BranchMap;