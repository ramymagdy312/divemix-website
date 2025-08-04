"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { MessageCircle, Phone } from 'lucide-react';

interface WhatsAppSettings {
  number: string;
  message: string;
}

const WhatsAppContact = () => {
  const [whatsappSettings, setWhatsappSettings] = useState<WhatsAppSettings>({
    number: '+201234567890',
    message: 'Hello! I would like to get more information about your services.'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWhatsAppSettings();
  }, []);

  const fetchWhatsAppSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('key, value')
        .in('key', ['whatsapp_number', 'whatsapp_message']);

      if (data && !error) {
        const settings = data.reduce((acc, item) => {
          if (item.key === 'whatsapp_number') acc.number = item.value;
          if (item.key === 'whatsapp_message') acc.message = item.value;
          return acc;
        }, { ...whatsappSettings });
        
        setWhatsappSettings(settings);
      }
    } catch (error) {
      console.error('Error fetching WhatsApp settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(whatsappSettings.message);
    const whatsappUrl = `https://wa.me/${whatsappSettings.number.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="bg-green-50 rounded-lg p-6 animate-pulse">
        <div className="h-6 bg-green-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-green-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-green-200 rounded w-2/3 mb-4"></div>
        <div className="h-10 bg-green-200 rounded w-full"></div>
      </div>
    );
  }

  return (
    <div className="bg-green-50 rounded-lg p-6 border border-green-200">
      <div className="flex items-center mb-4">
        <MessageCircle className="h-6 w-6 text-green-600 mr-3" />
        <h3 className="text-xl font-semibold text-gray-900">WhatsApp Contact</h3>
      </div>
      
      <p className="text-gray-600 mb-4">
        Get instant support through WhatsApp. We're available to help you with any questions or inquiries.
      </p>
      
      <div className="bg-white rounded-lg p-4 mb-4 border border-green-200">
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <Phone className="h-4 w-4 mr-2" />
          <span>WhatsApp Number:</span>
        </div>
        <p className="font-semibold text-green-700">{whatsappSettings.number}</p>
      </div>

      <button
        onClick={handleWhatsAppClick}
        className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors font-medium flex items-center justify-center"
      >
        <MessageCircle className="h-5 w-5 mr-2" />
        Start WhatsApp Chat
      </button>
      
      <p className="text-xs text-gray-500 mt-3 text-center">
        Click the button above to open WhatsApp with a pre-filled message
      </p>
    </div>
  );
};

export default WhatsAppContact;