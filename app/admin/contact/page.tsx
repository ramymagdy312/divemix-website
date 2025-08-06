"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

import { Edit, Save, X, Plus, Trash2, MapPin } from 'lucide-react';
import FolderExplorerSingle from '../../components/admin/FolderExplorerSingle';
import Image from 'next/image';
import Breadcrumb from '../../components/admin/Breadcrumb';
import toast from 'react-hot-toast';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Switch } from '@/app/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Separator } from '@/app/components/ui/separator';

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
    show_in_footer?: boolean;
    map_url?: string;
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
        show_in_footer: false,
        map_url: '',
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

  // Function to extract coordinates from Google Maps URL
  const extractCoordinatesFromUrl = (url: string) => {
    try {
      // Pattern for Google Maps URLs with coordinates
      const coordPattern = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
      const match = url.match(coordPattern);
      
      if (match) {
        return {
          lat: parseFloat(match[1]),
          lng: parseFloat(match[2])
        };
      }
      
      // Pattern for place URLs with coordinates in data parameter
      const dataPattern = /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/;
      const dataMatch = url.match(dataPattern);
      
      if (dataMatch) {
        return {
          lat: parseFloat(dataMatch[1]),
          lng: parseFloat(dataMatch[2])
        };
      }
    } catch (error) {
      console.error('Error extracting coordinates:', error);
    }
    
    return null;
  };

  const updateBranch = (index: number, field: string, value: string | number | boolean) => {
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
    } else if (field === 'map_url') {
      // Auto-extract coordinates from Google Maps URL
      const coords = extractCoordinatesFromUrl(value as string);
      newBranches[index] = { 
        ...newBranches[index], 
        [field]: value,
        ...(coords && {
          coordinates: {
            lat: coords.lat,
            lng: coords.lng
          }
        })
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
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <MapPin className="h-8 w-8 mr-3 text-primary" />
            Contact Page Management
          </h1>
          <p className="text-muted-foreground">Manage the content of your Contact page</p>
        </div>
        <div className="flex space-x-2">
          {editing ? (
            <>
              <Button
                variant="outline"
                onClick={() => setEditing(false)}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setEditing(true)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Page
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-8">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Configure the main content and hero section of the contact page
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="page-title">Page Title</Label>
                {editing ? (
                  <Input
                    id="page-title"
                    type="text"
                    value={data?.title || ''}
                    onChange={(e) => setData({ ...data!, title: e.target.value })}
                  />
                ) : (
                  <p className="text-sm font-medium">{data?.title}</p>
                )}
              </div>
            <div>
              {editing ? (
                <FolderExplorerSingle
                  image={data?.hero_image || ''}
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
          </CardContent>
        </Card>

        {/* Intro Section */}
        <Card>
          <CardHeader>
            <CardTitle>Introduction Section</CardTitle>
            <CardDescription>
              Configure the introduction content that appears below the hero section
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="intro-title">Intro Title</Label>
              {editing ? (
                <Input
                  id="intro-title"
                  type="text"
                  value={data?.intro_title || ''}
                  onChange={(e) => setData({ ...data!, intro_title: e.target.value })}
                />
              ) : (
                <p className="text-sm font-medium">{data?.intro_title}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="intro-description">Intro Description</Label>
              {editing ? (
                <Textarea
                  id="intro-description"
                  value={data?.intro_description || ''}
                  onChange={(e) => setData({ ...data!, intro_description: e.target.value })}
                  rows={4}
                />
              ) : (
                <p className="text-sm">{data?.intro_description}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Branches */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Branch Locations</CardTitle>
                <CardDescription>
                  Manage your company branch locations and contact information
                </CardDescription>
              </div>
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
                      Show in Footer
                    </label>
                    {editing ? (
                      <div className="flex items-center mt-2">
                        <input
                          type="checkbox"
                          checked={branch.show_in_footer || false}
                          onChange={(e) => updateBranch(index, 'show_in_footer', e.target.checked)}
                          className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 text-sm text-gray-700">
                          Display this branch in the website footer
                        </label>
                      </div>
                    ) : (
                      <p className="text-gray-900">
                        {branch.show_in_footer ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Shown in Footer
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Hidden from Footer
                          </span>
                        )}
                      </p>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Google Maps Link
                  </label>
                  {editing ? (
                    <div>
                      <input
                        type="url"
                        value={branch.map_url || ''}
                        onChange={(e) => updateBranch(index, 'map_url', e.target.value)}
                        placeholder="https://www.google.com/maps/place/..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Paste the Google Maps link here. Coordinates will be extracted automatically.
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      {branch.map_url ? (
                        <a 
                          href={branch.map_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-cyan-600 hover:text-cyan-700 underline"
                        >
                          View on Google Maps
                        </a>
                      ) : (
                        <p className="text-gray-500">No map link provided</p>
                      )}
                    </div>
                  )}
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
                  
                  {/* Map Preview */}
                  {branch.map_url && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Branch Location Preview
                      </label>
                      <div className="h-64 rounded-lg overflow-hidden border border-gray-300">
                        <iframe
                          src={convertToEmbedUrl(branch.map_url)}
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          title={`Location of ${branch.name}`}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
