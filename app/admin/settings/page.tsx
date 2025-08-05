"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, Mail, MessageCircle, Settings as SettingsIcon, Clock, Globe, Shield, Plus, Trash2, Edit3 } from 'lucide-react';
import Breadcrumb from '../../components/admin/Breadcrumb';
import toast from 'react-hot-toast';

interface Setting {
  key: string;
  value: string;
  description: string;
}

interface SupportItem {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  enabled: boolean;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [supportItems, setSupportItems] = useState<SupportItem[]>([]);
  const [editingItem, setEditingItem] = useState<SupportItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

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

      let settingsData = data || [];

      // Add missing default settings
      const defaultSettings = [
        { key: 'contact_email', value: 'ramy.magdy@rockettravelsystem.com', description: 'Email address for contact form submissions' },
        { key: 'whatsapp_number', value: '+201010606967', description: 'WhatsApp number for contact (with country code)' },
        { key: 'whatsapp_message', value: 'Hello! I would like to get more information about your services.', description: 'Default WhatsApp message' },
        { key: 'show_branches_in_footer', value: 'true', description: 'Show branch contact information in footer (true/false)' },
        { key: 'show_whatsapp_float', value: 'true', description: 'Show floating WhatsApp button (true/false)' },
        { key: 'footer_branches_title', value: 'Our Branches', description: 'Title for branches section in footer' },
        { key: 'support_section_title', value: 'Support', description: 'Title for support section in footer' },
        { key: 'support_section_enabled', value: 'true', description: 'Show support section in footer (true/false)' },
        { key: 'support_items', value: JSON.stringify([
          {
            id: 'working_hours',
            icon: 'Clock',
            title: 'Working Hours',
            subtitle: 'Mon - Fri: 9:00 AM - 6:00 PM',
            enabled: true
          },
          {
            id: 'languages',
            icon: 'Globe',
            title: 'Languages',
            subtitle: 'Arabic, English',
            enabled: true
          },
          {
            id: 'quality_certified',
            icon: 'Shield',
            title: 'Quality Certified',
            subtitle: 'ISO 9001:2015',
            enabled: true
          }
        ]), description: 'JSON array of support items to display in footer' }
      ];

      const existingKeys = settingsData.map(s => s.key);
      const missingSettings = defaultSettings.filter(s => !existingKeys.includes(s.key));

      if (missingSettings.length > 0) {
        // Insert missing settings
        const { error: insertError } = await supabase
          .from('settings')
          .insert(missingSettings);

        if (insertError) {
          console.error('Error inserting missing settings:', insertError);
        } else {
          // Refetch to get all settings including newly inserted ones
          const { data: updatedData } = await supabase
            .from('settings')
            .select('*')
            .order('key');
          settingsData = updatedData || settingsData;
        }
      }

      setSettings(settingsData);
      
      // Parse support items from settings
      const supportItemsSetting = settingsData.find(s => s.key === 'support_items');
      if (supportItemsSetting?.value) {
        try {
          const items = JSON.parse(supportItemsSetting.value);
          setSupportItems(items);
        } catch (error) {
          console.error('Error parsing support items:', error);
          setSupportItems([]);
        }
      }
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
      // Update support items in settings
      const updatedSettings = settings.map(setting => {
        if (setting.key === 'support_items') {
          return {
            ...setting,
            value: JSON.stringify(supportItems)
          };
        }
        return setting;
      });

      const updates = updatedSettings.map(setting => ({
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

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Clock': return Clock;
      case 'Globe': return Globe;
      case 'Shield': return Shield;
      case 'Award': return Save; // Using Save as Award placeholder
      case 'Users': return MessageCircle; // Using MessageCircle as Users placeholder
      case 'Zap': return Mail; // Using Mail as Zap placeholder
      case 'Settings': return SettingsIcon;
      default: return SettingsIcon;
    }
  };

  const addSupportItem = () => {
    const newItem: SupportItem = {
      id: `item_${Date.now()}`,
      icon: 'Clock',
      title: 'New Item',
      subtitle: 'Description',
      enabled: true
    };
    setSupportItems([...supportItems, newItem]);
    setEditingItem(newItem);
    setShowAddForm(false);
  };

  const updateSupportItem = (id: string, updates: Partial<SupportItem>) => {
    setSupportItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    );
  };

  const deleteSupportItem = (id: string) => {
    setSupportItems(prev => prev.filter(item => item.id !== id));
    if (editingItem?.id === id) {
      setEditingItem(null);
    }
  };

  const toggleSupportItem = (id: string) => {
    updateSupportItem(id, { enabled: !supportItems.find(item => item.id === id)?.enabled });
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
  const showBranchesInFooterSetting = settings.find(s => s.key === 'show_branches_in_footer');
  const showWhatsappFloatSetting = settings.find(s => s.key === 'show_whatsapp_float');
  const footerBranchesTitleSetting = settings.find(s => s.key === 'footer_branches_title');
  const supportSectionTitleSetting = settings.find(s => s.key === 'support_section_title');
  const supportSectionEnabledSetting = settings.find(s => s.key === 'support_section_enabled');

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
            Configure email, WhatsApp, footer, and support section settings
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

        {/* Footer Settings */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center mb-6">
            <SettingsIcon className="h-6 w-6 text-purple-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Footer Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Show Branches in Footer
              </label>
              <select
                value={showBranchesInFooterSetting?.value || 'true'}
                onChange={(e) => updateSetting('show_branches_in_footer', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
              >
                <option value="true">Yes, show branches</option>
                <option value="false">No, hide branches</option>
              </select>
              <p className="text-sm text-gray-500 mt-1">
                Display branch contact information in the website footer
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Footer Branches Section Title
              </label>
              <input
                type="text"
                value={footerBranchesTitleSetting?.value || 'Our Branches'}
                onChange={(e) => updateSetting('footer_branches_title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
                placeholder="Our Branches"
              />
              <p className="text-sm text-gray-500 mt-1">
                Title displayed above the branches section in footer
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Show Floating WhatsApp Button
              </label>
              <select
                value={showWhatsappFloatSetting?.value || 'true'}
                onChange={(e) => updateSetting('show_whatsapp_float', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
              >
                <option value="true">Yes, show floating button</option>
                <option value="false">No, hide floating button</option>
              </select>
              <p className="text-sm text-gray-500 mt-1">
                Display floating WhatsApp contact button on all pages
              </p>
            </div>
          </div>
        </div>

        {/* Support & Info Settings */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <SettingsIcon className="h-6 w-6 text-orange-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Support & Info Section</h2>
            </div>
            <button
              onClick={addSupportItem}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Item</span>
            </button>
          </div>
          
          <div className="space-y-4 mb-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section Title
                </label>
                <input
                  type="text"
                  value={supportSectionTitleSetting?.value || 'Support'}
                  onChange={(e) => updateSetting('support_section_title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
                  placeholder="Support"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Show Support Section
                </label>
                <select
                  value={supportSectionEnabledSetting?.value || 'true'}
                  onChange={(e) => updateSetting('support_section_enabled', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
                >
                  <option value="true">Yes, show section</option>
                  <option value="false">No, hide section</option>
                </select>
              </div>
            </div>
          </div>

          {/* Support Items List */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Support Items</h3>
            
            {supportItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <SettingsIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No support items configured</p>
                <button
                  onClick={addSupportItem}
                  className="mt-2 text-cyan-600 hover:text-cyan-700"
                >
                  Add your first item
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {supportItems.map((item) => {
                  const IconComponent = getIconComponent(item.icon);
                  return (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                      {editingItem?.id === item.id ? (
                        // Edit Form
                        <div className="space-y-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Title
                              </label>
                              <input
                                type="text"
                                value={item.title}
                                onChange={(e) => updateSupportItem(item.id, { title: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Icon
                              </label>
                              <select
                                value={item.icon}
                                onChange={(e) => updateSupportItem(item.id, { icon: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
                              >
                                <option value="Clock">Clock (Working Hours)</option>
                                <option value="Globe">Globe (Languages)</option>
                                <option value="Shield">Shield (Certification)</option>
                                <option value="Award">Award (Awards)</option>
                                <option value="Users">Users (Team)</option>
                                <option value="Zap">Zap (Fast Service)</option>
                                <option value="Settings">Settings (General)</option>
                              </select>
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Subtitle/Description
                            </label>
                            <input
                              type="text"
                              value={item.subtitle}
                              onChange={(e) => updateSupportItem(item.id, { subtitle: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
                            />
                          </div>
                          
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => setEditingItem(null)}
                              className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => setEditingItem(null)}
                              className="bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-700"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        // Display Mode
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`p-2 rounded-lg ${item.enabled ? 'bg-cyan-100 text-cyan-600' : 'bg-gray-100 text-gray-400'}`}>
                              <IconComponent className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className={`font-medium ${item.enabled ? 'text-gray-900' : 'text-gray-500'}`}>
                                {item.title}
                              </h4>
                              <p className={`text-sm ${item.enabled ? 'text-gray-600' : 'text-gray-400'}`}>
                                {item.subtitle}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => toggleSupportItem(item.id)}
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                item.enabled 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {item.enabled ? 'Enabled' : 'Disabled'}
                            </button>
                            
                            <button
                              onClick={() => setEditingItem(item)}
                              className="p-2 text-gray-400 hover:text-cyan-600"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            
                            <button
                              onClick={() => deleteSupportItem(item.id)}
                              className="p-2 text-gray-400 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Preview Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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

            {/* Footer & Float Preview */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2">Footer & Float Settings</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  Branches in footer: <span className="font-medium text-purple-600">
                    {showBranchesInFooterSetting?.value === 'true' ? 'Enabled' : 'Disabled'}
                  </span>
                </p>
                <p>
                  Branches title: <span className="font-medium">
                    "{footerBranchesTitleSetting?.value || 'Our Branches'}"
                  </span>
                </p>
                <p>
                  WhatsApp float: <span className="font-medium text-green-600">
                    {showWhatsappFloatSetting?.value === 'true' ? 'Enabled' : 'Disabled'}
                  </span>
                </p>
              </div>
            </div>

            {/* Support Section Preview */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2">Support Section</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  Section: <span className="font-medium text-orange-600">
                    {supportSectionEnabledSetting?.value === 'true' ? 'Enabled' : 'Disabled'}
                  </span>
                </p>
                <p>
                  Title: <span className="font-medium">
                    "{supportSectionTitleSetting?.value || 'Support'}"
                  </span>
                </p>
                <p>
                  Items: <span className="font-medium text-cyan-600">
                    {supportItems.filter(item => item.enabled).length} active
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}