"use client";

import { useState, useEffect } from 'react';
import { createClient } from '../lib/supabase';

export default function TestSupportSettings() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const addSupportSettings = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const supabase = createClient();
      
      const supportSettings = [
        {
          key: 'support_section_title',
          value: 'Support',
          description: 'Title for support section in footer'
        },
        {
          key: 'support_section_enabled',
          value: 'true',
          description: 'Show support section in footer (true/false)'
        },
        {
          key: 'support_items',
          value: JSON.stringify([
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
          ]),
          description: 'JSON array of support items to display in footer'
        }
      ];

      const { error } = await supabase
        .from('settings')
        .upsert(supportSettings, { onConflict: 'key' });

      if (error) {
        setMessage(`Error: ${error.message}`);
      } else {
        setMessage('Support settings added successfully!');
      }
    } catch (error) {
      setMessage(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Test Support Settings</h1>
      
      <button
        onClick={addSupportSettings}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Adding...' : 'Add Support Settings to Database'}
      </button>
      
      {message && (
        <div className={`mt-4 p-4 rounded ${
          message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {message}
        </div>
      )}
      
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Instructions:</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>Click the button above to add support settings to the database</li>
          <li>Go to <a href="/admin/settings" className="text-blue-600 hover:underline">/admin/settings</a> to manage the support section</li>
          <li>Check the footer on any page to see the changes</li>
        </ol>
      </div>
    </div>
  );
}