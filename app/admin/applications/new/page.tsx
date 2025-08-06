"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { Plus, X, ArrowLeft, Save, Trash2, Target } from 'lucide-react';
import Link from 'next/link';
import FolderExplorerSingle from '../../../components/admin/FolderExplorerSingle';
import toast from 'react-hot-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Label } from '@/app/components/ui/label';
import { Badge } from '@/app/components/ui/badge';
import { Separator } from '@/app/components/ui/separator';

export default function NewApplicationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: '',
    use_cases: [''],
    benefits: [''],
    is_active: true,
    display_order: 1,
  });

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
        .insert([cleanedData]);

      if (error) throw error;

      router.push('/admin/applications');
    } catch (error) {
      console.error('Error creating application:', error);
      toast.error('Error creating application');
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
          <h1 className="text-3xl font-bold tracking-tight">Add New Application</h1>
          <p className="text-muted-foreground">
            Add a new application to the database
          </p>
        </div>
        <Badge variant="secondary">
          <Target className="h-3 w-3 mr-1" />
          New Application
        </Badge>
      </div>

      {/* Main Form */}
      <Card>
        <CardHeader>
          <CardTitle>Application Information</CardTitle>
          <CardDescription>
            Enter the details for the new application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Application Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Application Name *</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter application name"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed application description"
              />
            </div>

            <Separator />

            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Application Image</Label>
              <FolderExplorerSingle
                image={formData.image_url}
                onImageChange={(image) => setFormData({ ...formData, image_url: image })}
                label="Application Image"
              />
            </div>

            <Separator />

            {/* Use Cases */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Use Cases</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addUseCase}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Use Case
                </Button>
              </div>
              <div className="space-y-2">
                {formData.use_cases.map((useCase, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={useCase}
                      onChange={(e) => updateUseCase(index, e.target.value)}
                      placeholder={`Use case ${index + 1}`}
                      className="flex-1"
                    />
                    {formData.use_cases.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeUseCase(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Benefits</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addBenefit}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Benefit
                </Button>
              </div>
              <div className="space-y-2">
                {formData.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={benefit}
                      onChange={(e) => updateBenefit(index, e.target.value)}
                      placeholder={`Benefit ${index + 1}`}
                      className="flex-1"
                    />
                    {formData.benefits.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeBenefit(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Display Order */}
              <div className="space-y-2">
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  min="1"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 1 })}
                />
              </div>

              {/* Status */}
              <div className="flex items-center space-x-2 pt-6">
                <input
                  type="checkbox"
                  id="is_active"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                />
                <Label htmlFor="is_active">Application is active</Label>
              </div>
            </div>

            <Separator />

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-3">
              <Button variant="outline" asChild>
                <Link href="/admin/applications">
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Link>
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-1" />
                    Save Application
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
