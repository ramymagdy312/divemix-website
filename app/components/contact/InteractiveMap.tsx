"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { MapPin, Navigation, Phone, Mail, Clock, ExternalLink } from 'lucide-react';

interface Branch {
  id: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  latitude: number;
  longitude: number;
  working_hours?: Record<string, string>;
  is_active: boolean;
  display_order: number;
}

interface InteractiveMapProps {
  branches: Branch[];
  selectedBranchId?: string;
  onBranchSelect?: (branchId: string) => void;
  className?: string;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({
  branches,
  selectedBranchId,
  onBranchSelect,
  className = ""
}) => {
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

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

  const handleBranchSelect = (branch: Branch) => {
    setSelectedBranch(branch);
    onBranchSelect?.(branch.id);
  };

  const openInGoogleMaps = (branch: Branch) => {
    const url = `https://www.google.com/maps?q=${branch.latitude},${branch.longitude}`;
    window.open(url, '_blank');
  };

  const getWorkingHoursText = (workingHours?: Record<string, string>) => {
    if (!workingHours) return 'غير محدد';
    
    const days = {
      saturday: 'السبت',
      sunday: 'الأحد',
      monday: 'الاثنين',
      tuesday: 'الثلاثاء',
      wednesday: 'الأربعاء',
      thursday: 'الخميس',
      friday: 'الجمعة'
    };

    const today = new Date().getDay();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const todayKey = dayNames[today];
    const todayHours = workingHours[todayKey];

    if (todayHours === 'closed') {
      return 'مغلق اليوم';
    } else if (todayHours) {
      return `مفتوح اليوم: ${todayHours}`;
    }

    return 'غير محدد';
  };

  return (
    <div className={`bg-white rounded-2xl shadow-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-6">
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold">مواقع فروعنا</h3>
            <p className="text-cyan-100">اختر الفرع الأقرب إليك</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Branches List */}
        <div className="lg:w-1/3 p-6 border-l border-gray-200">
          <div className="space-y-4">
            {branches.map((branch) => (
              <div
                key={branch.id}
                onClick={() => handleBranchSelect(branch)}
                className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                  selectedBranch?.id === branch.id
                    ? 'bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-200 shadow-md'
                    : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                }`}
              >
                <div className="flex items-start space-x-3 space-x-reverse">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    selectedBranch?.id === branch.id
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-semibold text-sm ${
                      selectedBranch?.id === branch.id ? 'text-cyan-700' : 'text-gray-900'
                    }`}>
                      {branch.name}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                      {branch.address}
                    </p>
                    {branch.phone && (
                      <div className="flex items-center space-x-2 space-x-reverse mt-2">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-600">{branch.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Map and Details */}
        <div className="lg:w-2/3 p-6">
          {selectedBranch && (
            <div className="space-y-6">
              {/* Branch Details */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">
                      {selectedBranch.name}
                    </h4>
                    <div className="flex items-start space-x-2 space-x-reverse text-gray-600">
                      <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">{selectedBranch.address}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => openInGoogleMaps(selectedBranch)}
                    className="flex items-center space-x-2 space-x-reverse bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>فتح في الخرائط</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedBranch.phone && (
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Phone className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">الهاتف</p>
                        <p className="text-sm font-medium text-gray-900">{selectedBranch.phone}</p>
                      </div>
                    </div>
                  )}

                  {selectedBranch.email && (
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Mail className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">البريد الإلكتروني</p>
                        <p className="text-sm font-medium text-gray-900">{selectedBranch.email}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-3 space-x-reverse md:col-span-2">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">ساعات العمل</p>
                      <p className="text-sm font-medium text-gray-900">
                        {getWorkingHoursText(selectedBranch.working_hours)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Embedded Map */}
              <div className="bg-gray-100 rounded-xl overflow-hidden" style={{ height: '400px' }}>
                <iframe
                  src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY'}&q=${selectedBranch.latitude},${selectedBranch.longitude}&zoom=15`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`خريطة ${selectedBranch.name}`}
                />
              </div>

              {/* Navigation Button */}
              <div className="flex justify-center">
                <button
                  onClick={() => openInGoogleMaps(selectedBranch)}
                  className="flex items-center space-x-3 space-x-reverse bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Navigation className="w-5 h-5" />
                  <span className="font-medium">احصل على الاتجاهات</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;