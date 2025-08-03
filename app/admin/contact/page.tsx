"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

import { Edit, Save, X, Plus, Trash2, MapPin } from 'lucide-react';
import ImageUpload from '../../components/admin/ImageUpload';
import Image from 'next/image';
import Breadcrumb from '../../components/admin/Breadcrumb';
import toast from 'react-hot-toast';

interface ContactPageData {
  id: string;
  title: string;
  description: string;
  hero_image: string;
  intro_title: string;
  intro_description: string;
  branches: {
    name: string;
    address: string;
    phone: string;
    email: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  }[];
}

export default function ContactAdmin() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchContactData();
  }, []);

  const fetchContactData = async () => {
    try {
      const { data: contactPageData, error } = await supabase
        .from('contact_page')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching contact data:', error);
        setData(null);
      } else {
        setData(contactPageData);
      }
    } catch (error) {
      console.error('Error:', error);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('contact_page')
        .upsert({
          ...(data || {}),
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving contact data:', error);
        toast.error('Error saving data');
      } else {
        setEditing(false);
        toast.success('Contact page updated successfully!');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error saving data');
    } finally {
      setSaving(false);
    }
  };

  const addBranch = () => {
    if (!data) return;
    setData({ ...data!,
      branches: [...data?.branches, {
        name: '',
        address: '',
        phone: '',
        email: '',
        coordinates: { lat: 0, lng: 0 }
      }]
    });
  };

  const removeBranch = (index: number) => {
    if (!data) return;
    setData({ ...data!,
      branches: (data?.branches || []).filter((_: any, i: number) => i !== index)
    });
  };

  const updateBranch = (index: number, field: string, value: string | number) => {
    if (!data) return;
    const newBranches = [...(data?.branches || [])];
    if (field === 'lat' || field === 'lng') {
      newBranches[index] = {
        ...newBranches[index],
        coordinates: {
          ...newBranches[index].coordinates,
          [field]: Number(value)
        }
      };
    } else {
      newBranches[index] = { ...newBranches[index], [field]: value };
    }
    setData({ ...data!, branches: newBranches });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb items={[
        { name: 'Pages' },
        { name: 'Contact Page' }
      ]} />
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contact Page Management</h1>
          <p className="mt-2 text-gray-600">Manage the content of your Contact page</p>
        </div>
        <div className="flex space-x-4">
          {editing ? (
            <>
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center space-x-2"
              >
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-700 flex items-center space-x-2 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-700 flex items-center space-x-2"
            >
              <Edit className="h-4 w-4" />
              <span>Edit Page</span>
            </button>
          )}
        </div>
      </div>

      <div className="space-y-8">
        {/* Basic Info */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Page Title
              </label>
              {editing ? (
                <input
                  type="text"
                  value={data?.title}
                  onChange={(e) => setData({ ...data!, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              ) : (
                <p className="text-gray-900">{data?.title}</p>
              )}
            </div>
            <div>
              {editing ? (
                <ImageUpload
                  currentImage={data?.hero_image}
                  onImageChange={(imageUrl) => setData({ ...data!, hero_image: imageUrl })}
                  label="Hero Image"
                />
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hero Image
                  </label>
                  {data?.hero_image ? (
                    <div className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-300">
                      <Image
                        src={data?.hero_image}
                        alt="Hero image"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No image uploaded</p>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            {editing ? (
              <textarea
                value={data?.description}
                onChange={(e) => setData({ ...data!, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            ) : (
              <p className="text-gray-900">{data?.description}</p>
            )}
          </div>
        </div>

        {/* Intro Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Introduction Section</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Intro Title
              </label>
              {editing ? (
                <input
                  type="text"
                  value={data?.intro_title}
                  onChange={(e) => setData({ ...data!, intro_title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              ) : (
                <p className="text-gray-900">{data?.intro_title}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Intro Description
              </label>
              {editing ? (
                <textarea
                  value={data?.intro_description}
                  onChange={(e) => setData({ ...data!, intro_description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              ) : (
                <p className="text-gray-900">{data?.intro_description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Branches */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Branch Locations</h2>
            {editing && (
              <button
                onClick={addBranch}
                className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 flex items-center space-x-1 text-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Add Branch</span>
              </button>
            )}
          </div>
          <div className="space-y-6">
            {data?.branches.map((branch: any, index: number) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-cyan-600" />
                    <h3 className="text-lg font-medium">Branch {index + 1}</h3>
                  </div>
                  {editing && (
                    <button
                      onClick={() => removeBranch(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Branch Name
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        value={branch.name}
                        onChange={(e) => updateBranch(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    ) : (
                      <p className="text-gray-900">{branch.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    {editing ? (
                      <input
                        type="tel"
                        value={branch.phone}
                        onChange={(e) => updateBranch(index, 'phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    ) : (
                      <p className="text-gray-900">{branch.phone}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    {editing ? (
                      <input
                        type="email"
                        value={branch.email}
                        onChange={(e) => updateBranch(index, 'email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    ) : (
                      <p className="text-gray-900">{branch.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    {editing ? (
                      <textarea
                        value={branch.address}
                        onChange={(e) => updateBranch(index, 'address', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    ) : (
                      <p className="text-gray-900">{branch.address}</p>
                    )}
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Coordinates (for map display)
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Latitude</label>
                      {editing ? (
                        <input
                          type="number"
                          step="any"
                          value={branch.coordinates.lat}
                          onChange={(e) => updateBranch(index, 'lat', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                      ) : (
                        <p className="text-gray-900">{branch.coordinates.lat}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Longitude</label>
                      {editing ? (
                        <input
                          type="number"
                          step="any"
                          value={branch.coordinates.lng}
                          onChange={(e) => updateBranch(index, 'lng', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                      ) : (
                        <p className="text-gray-900">{branch.coordinates.lng}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}