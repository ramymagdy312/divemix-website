"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

import { Edit, Save, X, Plus, Trash2, Info } from 'lucide-react';
import FolderExplorerSingle from '../../components/admin/FolderExplorerSingle';
import Image from 'next/image';
import Breadcrumb from '../../components/admin/Breadcrumb';
import toast from 'react-hot-toast';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Separator } from '@/app/components/ui/separator';

interface AboutPageData {
  id: string;
  title: string;
  description: string;
  hero_image: string;
  vision: string;
  mission: string;
  company_overview: string;
  values: {
    title: string;
    description: string;
    icon: string;
  }[];
  timeline: {
    year: string;
    title: string;
    description: string;
  }[];
}

export default function AboutAdmin() {
  const [data, setData] = useState<AboutPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const { data: aboutPageData, error } = await supabase
        .from('about_page')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching about data:', error);
        setData(null);
      } else {
        setData(aboutPageData);
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
        .from('about_page')
        .upsert({
          ...(data || {}),
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving about data:', error);
        toast.error('Error saving data');
      } else {
        setEditing(false);
        toast.success('About page updated successfully!');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error saving data');
    } finally {
      setSaving(false);
    }
  };

  const addValue = () => {
    if (!data) return;
    setData({ ...data!,
      values: [...(data?.values || []), { title: '', description: '', icon: 'Star' }]
    });
  };

  const removeValue = (index: number) => {
    if (!data) return;
    setData({ ...data!,
      values: (data?.values || []).filter((_, i) => i !== index)
    });
  };

  const updateValue = (index: number, field: string, value: string) => {
    if (!data) return;
    const newValues = [...(data?.values || [])];
    newValues[index] = { ...newValues[index], [field]: value };
    setData({ ...data!, values: newValues });
  };

  const addTimelineItem = () => {
    if (!data) return;
    setData({ ...data!,
      timeline: [...(data?.timeline || []), { year: '', title: '', description: '' }]
    });
  };

  const removeTimelineItem = (index: number) => {
    if (!data) return;
    setData({ ...data!,
      timeline: (data?.timeline || []).filter((_, i) => i !== index)
    });
  };

  const updateTimelineItem = (index: number, field: string, value: string) => {
    if (!data) return;
    const newTimeline = [...(data?.timeline || [])];
    newTimeline[index] = { ...newTimeline[index], [field]: value };
    setData({ ...data!, timeline: newTimeline });
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
        { name: 'About Page' }
      ]} />
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">About Page Management</h1>
          <p className="mt-2 text-gray-600">Manage the content of your About page</p>
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
              <Label>Page Title</Label>
              {editing ? (
                <Input
                  type="text"
                  value={data?.title || ''}
                  onChange={(e) => data && setData({ ...data!, title: e.target.value })}
                />
              ) : (
                <p className="text-gray-900">{data?.title}</p>
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
            <Label>Description</Label>
            {editing ? (
              <Textarea
                value={data?.description}
                onChange={(e) => setData({ ...data!, description: e.target.value })}
                rows={3}
              />
            ) : (
              <p className="text-gray-900">{data?.description}</p>
            )}
          </div>
        </div>

        {/* Vision & Mission */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Vision & Mission</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Vision</Label>
              {editing ? (
                <Textarea
                  value={data?.vision}
                  onChange={(e) => setData({ ...data!, vision: e.target.value })}
                  rows={4}
                />
              ) : (
                <p className="text-gray-900">{data?.vision}</p>
              )}
            </div>
            <div>
              <Label>Mission</Label>
              {editing ? (
                <Textarea
                  value={data?.mission}
                  onChange={(e) => setData({ ...data!, mission: e.target.value })}
                  rows={4}
                />
              ) : (
                <p className="text-gray-900">{data?.mission}</p>
              )}
            </div>
          </div>
        </div>

        {/* Company Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Company Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {editing ? (
              <Textarea
                value={data?.company_overview}
                onChange={(e) => setData({ ...data!, company_overview: e.target.value })}
                rows={6}
              />
            ) : (
              <p className="text-gray-900">{data?.company_overview}</p>
            )}
          </CardContent>
        </Card>

        {/* Values */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Core Values</h2>
            {editing && (
              <button
                onClick={addValue}
                className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 flex items-center space-x-1 text-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Add Value</span>
              </button>
            )}
          </div>
          <div className="space-y-4">
            {data?.values.map((value, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                      </label>
                      {editing ? (
                        <input
                          type="text"
                          value={value.title}
                          onChange={(e) => updateValue(index, 'title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                      ) : (
                        <p className="text-gray-900">{value.title}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Icon
                      </label>
                      {editing ? (
                        <select
                          value={value.icon}
                          onChange={(e) => updateValue(index, 'icon', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        >
                          <option value="Award">Award</option>
                          <option value="Focus">Focus</option>
                          <option value="Users">Users</option>
                          <option value="Shield">Shield</option>
                          <option value="Star">Star</option>
                          <option value="Heart">Heart</option>
                        </select>
                      ) : (
                        <p className="text-gray-900">{value.icon}</p>
                      )}
                    </div>
                    <div className="md:col-span-1">
                      {editing && (
                        <div className="flex justify-end">
                          <button
                            onClick={() => removeValue(index)}
                            className="text-red-600 hover:text-red-800 mt-6"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  {editing ? (
                    <textarea
                      value={value.description}
                      onChange={(e) => updateValue(index, 'description', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  ) : (
                    <p className="text-gray-900">{value.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Company Timeline</h2>
            {editing && (
              <button
                onClick={addTimelineItem}
                className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 flex items-center space-x-1 text-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Add Timeline Item</span>
              </button>
            )}
          </div>
          <div className="space-y-4">
            {data?.timeline.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Year
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        value={item.year}
                        onChange={(e) => updateTimelineItem(index, 'year', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    ) : (
                      <p className="text-gray-900 font-semibold">{item.year}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => updateTimelineItem(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    ) : (
                      <p className="text-gray-900">{item.title}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    {editing ? (
                      <textarea
                        value={item.description}
                        onChange={(e) => updateTimelineItem(index, 'description', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    ) : (
                      <p className="text-gray-900">{item.description}</p>
                    )}
                  </div>
                  <div>
                    {editing && (
                      <div className="flex justify-end">
                        <button
                          onClick={() => removeTimelineItem(index)}
                          className="text-red-600 hover:text-red-800 mt-6"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
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