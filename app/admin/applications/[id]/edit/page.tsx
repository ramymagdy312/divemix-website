"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../../lib/supabase';
import { Plus, X, ArrowLeft, Save, Trash2, Target, Edit } from 'lucide-react';
import Link from 'next/link';
import FolderExplorerSingle from '../../../../components/admin/FolderExplorerSingle';
import toast from 'react-hot-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Skeleton } from '@/app/components/ui/skeleton';

interface Application {
  id: string;
  name: string;
  description: string;
  image_url: string;
  use_cases: string[];
  benefits: string[];
  is_active: boolean;
  display_order: number;
}

export default function EditApplicationPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<Application | null>(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: '',
    use_cases: [''],
    benefits: [''],
    is_active: true,
    display_order: 1,
  });

  useEffect(() => {
  fetchApplication();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [params.id]);

  const fetchApplication = async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) {
        console.error('Error fetching application:', error);
        toast.error('Error fetching application data');
        return;
      }
      
      setInitialData(data);
      setFormData({
        name: data.name || '',
        description: data.description || '',
        image_url: data.image_url || '',
        use_cases: data.use_cases?.length > 0 ? data.use_cases : [''],
        benefits: data.benefits?.length > 0 ? data.benefits : [''],
        is_active: data.is_active ?? true,
        display_order: data.display_order || 1,
      });
    } catch (error) {
      console.error('Error fetching application:', error);
      toast.error('Error fetching application data');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const cleanedData = {
        ...formData,
        use_cases: formData.use_cases.filter((useCase: string) => useCase.trim() !== ''),
        benefits: formData.benefits.filter((benefit: string) => benefit.trim() !== ''),
      };

      const { error } = await supabase
        .from('applications')
        .update(cleanedData)
        .eq('id', params.id);

      if (error) {
        console.error('Error updating application:', error);
        toast.error('Error updating application');
        return;
      }

      toast.success('Application updated successfully!');
      router.push('/admin/applications');
    } catch (error) {
      console.error('Error updating application:', error);
      toast.error('Error updating application');
    } finally {
      setLoading(false);
    }
  };

  const addUseCase = () => {
    setFormData({
      ...formData,
      use_cases: [...formData.use_cases, ''],
    });
  };

  const removeUseCase = (index: number) => {
    setFormData({
      ...formData,
      use_cases: formData.use_cases.filter((_, i) => i !== index),
    });
  };

  const updateUseCase = (index: number, value: string) => {
    const newUseCases = [...formData.use_cases];
    newUseCases[index] = value;
    setFormData({
      ...formData,
      use_cases: newUseCases,
    });
  };

  const addBenefit = () => {
    setFormData({
      ...formData,
      benefits: [...formData.benefits, ''],
    });
  };

  const removeBenefit = (index: number) => {
    setFormData({
      ...formData,
      benefits: formData.benefits.filter((_, i) => i !== index),
    });
  };

  const updateBenefit = (index: number, value: string) => {
    const newBenefits = [...formData.benefits];
    newBenefits[index] = value;
    setFormData({
      ...formData,
      benefits: newBenefits,
    });
  };

  if (fetchLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-6 w-20" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!initialData) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Application Not Found</CardTitle>
            <CardDescription>
              The requested application could not be found.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/admin/applications">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Applications
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/applications">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Applications
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Application</h1>
          <p className="text-muted-foreground">Edit application data</p>
          {initialData && (
            <div className="text-sm text-muted-foreground">
              Application ID: {initialData.id} • {initialData.name}
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">Live</Badge>
          <Badge variant="outline">
            <Edit className="h-3 w-3 mr-1" />
            Editing
          </Badge>
        </div>
      </div>

      {/* Main Form */}
      <Card>
        <CardHeader>
          <CardTitle>Application Information</CardTitle>
          <CardDescription>
            Update the application details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Application Name
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div>
              <FolderExplorerSingle
                image={formData.image_url}
                onImageChange={(image) => setFormData({ ...formData, image_url: image })}
                label="Application Image"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Use Cases
                </label>
                <button
                  type="button"
                  onClick={addUseCase}
                  className="inline-flex items-center px-3 py-1 text-sm bg-cyan-600 text-white rounded-md hover:bg-cyan-700"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Use Case
                </button>
              </div>
              <div className="space-y-2">
                {formData.use_cases.map((useCase, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Use case description"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
                      value={useCase}
                      onChange={(e) => updateUseCase(index, e.target.value)}
                    />
                    {formData.use_cases.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeUseCase(index)}
                        className="p-2 text-red-600 hover:text-red-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Benefits
                </label>
                <button
                  type="button"
                  onClick={addBenefit}
                  className="inline-flex items-center px-3 py-1 text-sm bg-cyan-600 text-white rounded-md hover:bg-cyan-700"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Benefit
                </button>
              </div>
              <div className="space-y-2">
                {formData.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Benefit description"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
                      value={benefit}
                      onChange={(e) => updateBenefit(index, e.target.value)}
                    />
                    {formData.benefits.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeBenefit(index)}
                        className="p-2 text-red-600 hover:text-red-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 1 })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
                  value={formData.is_active ? 'active' : 'inactive'}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.value === 'active' })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.push('/admin/applications')}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}