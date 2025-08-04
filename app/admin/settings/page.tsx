"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, Mail, MessageCircle, Settings as SettingsIcon } from 'lucide-react';
import Breadcrumb from '../../components/admin/Breadcrumb';
import toast from 'react-hot-toast';

interface Setting {
  key: string;
  value: string;
  description: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .order('key');

      if (error) {
        console.error('Error fetching settings:', error);
        toast.error('Failed to load settings');
        return;
      }

      setSettings(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (key: string, value: string) => {
    setSettings(prev => 
      prev.map(setting => 
        setting.key === key ? { ...setting, value } : setting
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = settings.map(setting => ({
        key: setting.key,
        value: setting.value,
        description: setting.description
      }));

      const { error } = await supabase
        .from('settings')
        .upsert(updates, { onConflict: 'key' });

      if (error) {
        console.error('Error saving settings:', error);
        toast.error('Failed to save settings');
        return;
      }

      toast.success('Settings saved successfully!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  const contactEmailSetting = settings.find(s => s.key === 'contact_email');
  const whatsappNumberSetting = settings.find(s => s.key === 'whatsapp_number');
  const whatsappMessageSetting = settings.find(s => s.key === 'whatsapp_message');

  return (
    <div>
      <Breadcrumb items={[
        { name: 'Settings' }
      ]} />
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <SettingsIcon className="h-8 w-8 mr-3 text-cyan-600" />
            System Settings
          </h1>
          <p className="mt-2 text-gray-600">
            Configure email and WhatsApp contact settings
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-cyan-600 text-white px-6 py-2 rounded-md hover:bg-cyan-700 disabled:opacity-50 flex items-center space-x-2"
        >
          <Save className="h-4 w-4" />
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      <div className="space-y-8">
        {/* Email Settings */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center mb-6">
            <Mail className="h-6 w-6 text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Email Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Form Email Address
              </label>
              <input
                type="email"
                value={contactEmailSetting?.value || ''}
                onChange={(e) => updateSetting('contact_email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
                placeholder="contact@example.com"
              />
              <p className="text-sm text-gray-500 mt-1">
                Email address where contact form submissions will be sent
              </p>
            </div>
          </div>
        </div>

        {/* WhatsApp Settings */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center mb-6">
            <MessageCircle className="h-6 w-6 text-green-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">WhatsApp Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                WhatsApp Number
              </label>
              <input
                type="text"
                value={whatsappNumberSetting?.value || ''}
                onChange={(e) => updateSetting('whatsapp_number', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
                placeholder="+1234567890"
              />
              <p className="text-sm text-gray-500 mt-1">
                WhatsApp number with country code (e.g., +201234567890)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default WhatsApp Message
              </label>
              <textarea
                value={whatsappMessageSetting?.value || ''}
                onChange={(e) => updateSetting('whatsapp_message', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
                placeholder="Hello! I would like to get more information about your services."
              />
              <p className="text-sm text-gray-500 mt-1">
                Default message that will be pre-filled when users click WhatsApp contact
              </p>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Email Preview */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2">Contact Form Email</h4>
              <p className="text-sm text-gray-600">
                Form submissions will be sent to:
              </p>
              <p className="text-sm font-medium text-blue-600">
                {contactEmailSetting?.value || 'Not configured'}
              </p>
            </div>

            {/* WhatsApp Preview */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2">WhatsApp Contact</h4>
              <p className="text-sm text-gray-600 mb-1">
                Number: <span className="font-medium text-green-600">
                  {whatsappNumberSetting?.value || 'Not configured'}
                </span>
              </p>
              <p className="text-sm text-gray-600">
                Default message: <span className="italic">
                  "{whatsappMessageSetting?.value || 'Not configured'}"
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Setup Instructions</h3>
          
          <div className="space-y-4 text-sm text-blue-800">
            <div>
              <h4 className="font-medium mb-2">Email Configuration:</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Enter the email address where you want to receive contact form submissions</li>
                <li>Make sure to configure SMTP settings in your environment variables</li>
                <li>Test the contact form to ensure emails are being delivered</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">WhatsApp Configuration:</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Enter your WhatsApp number with country code (e.g., +201234567890)</li>
                <li>Customize the default message that users will see</li>
                <li>Test the WhatsApp link to ensure it opens correctly</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}