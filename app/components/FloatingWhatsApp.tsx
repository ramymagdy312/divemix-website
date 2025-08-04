"use client";

import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { createClient } from '@/app/lib/supabase';

interface WhatsAppSettings {
  whatsapp_number: string;
  whatsapp_message: string;
  show_whatsapp_float: string;
}

const FloatingWhatsApp = () => {
  const [settings, setSettings] = useState<WhatsAppSettings | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    fetchSettings();
    
    // Show button after a delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const fetchSettings = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('settings')
        .select('key, value')
        .in('key', ['whatsapp_number', 'whatsapp_message', 'show_whatsapp_float']);

      if (error) {
        console.error('Error fetching WhatsApp settings:', error);
        return;
      }

      const settingsObj = data.reduce((acc: WhatsAppSettings, item: any) => {
        acc[item.key as keyof WhatsAppSettings] = item.value;
        return acc;
      }, {} as WhatsAppSettings);

      setSettings(settingsObj);
    } catch (error) {
      console.error('Error fetching WhatsApp settings:', error);
    }
  };

  const handleWhatsAppClick = () => {
    if (!settings?.whatsapp_number) return;

    const message = encodeURIComponent(settings.whatsapp_message || 'Hello! I would like to get more information about your services.');
    const whatsappUrl = `https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, '')}?text=${message}`;
    
    window.open(whatsappUrl, '_blank');
  };

  // Don't render if settings indicate it should be hidden
  if (!settings || settings.show_whatsapp_float === 'false') {
    return null;
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
    }`}>
      {/* Expanded chat bubble */}
      {isExpanded && (
        <div className="mb-4 bg-white rounded-lg shadow-lg p-4 max-w-xs animate-in slide-in-from-bottom-2">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-800">DiveMix Support</p>
                <p className="text-xs text-green-500">Online</p>
              </div>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Hi there! 👋 How can we help you today?
          </p>
          <button
            onClick={handleWhatsAppClick}
            className="w-full bg-green-500 hover:bg-green-600 text-white text-sm py-2 px-4 rounded-lg transition-colors"
          >
            Start Chat
          </button>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 group"
        aria-label="Open WhatsApp Chat"
      >
        <MessageCircle className="w-6 h-6" />
        
        {/* Pulse animation */}
        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
        
        {/* Notification badge */}
        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          1
        </div>
      </button>
    </div>
  );
};

export default FloatingWhatsApp;