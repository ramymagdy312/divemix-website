"use client";

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import FolderExplorerSingle from '../../../components/admin/FolderExplorerSingle';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Switch } from '@/app/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';

interface ApplicationFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  loading: boolean;
}

export default function ApplicationForm({ initialData, onSubmit, loading }: ApplicationFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    image_url: initialData?.image_url || '',
    use_cases: initialData?.use_cases || [''],
    benefits: initialData?.benefits || [''],
    is_active: initialData?.is_active !== undefined ? initialData.is_active : true,
    display_order: initialData?.display_order || 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const cleanedData = {
      ...formData,
      use_cases: formData.use_cases.filter((useCase: string) => useCase.trim() !== ''),
      benefits: formData.benefits.filter((benefit: string) => benefit.trim() !== ''),
    };
    
    onSubmit(cleanedData);
  };

  const addUseCase = () => {
    setFormData({
      ...formData,
      use_cases: [...formData.use_cases, ''],
    });
  };

  const removeUseCase = (index: number) => {
    const newUseCases = formData.use_cases.filter((_: string, i: number) => i !== index);
    setFormData({
      ...formData,
      use_cases: newUseCases.length > 0 ? newUseCases : [''],
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
    const newBenefits = formData.benefits.filter((_: string, i: number) => i !== index);
    setFormData({
      ...formData,
      benefits: newBenefits.length > 0 ? newBenefits : [''],
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
    <Card>
      <CardHeader>
        <CardTitle>Application Information</CardTitle>
        <CardDescription>Enter the application details below</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Application Name */}
          <div className="space-y-2">
            <Label htmlFor="application-name">Application Name *</Label>
            <Input
              id="application-name"
              type="text"
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
              placeholder="Enter application description"
            />
          </div>

          {/* Image */}
          <div className="space-y-2">
            <Label>Application Image</Label>
            <FolderExplorerSingle
              image={formData.image_url}
              onImageChange={(image_url) => setFormData({ ...formData, image_url })}
              label="Application Image"
            />
          </div>

          {/* Use Cases Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Use Cases</Label>
              <Button type="button" variant="outline" size="sm" onClick={addUseCase}>
                <Plus className="h-4 w-4 mr-2" />
                Add Use Case
              </Button>
            </div>
            
            <div className="space-y-2">
              {formData.use_cases.map((useCase: string, index: number) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={useCase}
                    onChange={(e) => updateUseCase(index, e.target.value)}
                    placeholder={`Use Case ${index + 1}`}
                  />
                  {formData.use_cases.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeUseCase(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Benefits Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Benefits</Label>
              <Button type="button" variant="outline" size="sm" onClick={addBenefit}>
                <Plus className="h-4 w-4 mr-2" />
                Add Benefit
              </Button>
            </div>
            
            <div className="space-y-2">
              {formData.benefits.map((benefit: string, index: number) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={benefit}
                    onChange={(e) => updateBenefit(index, e.target.value)}
                    placeholder={`Benefit ${index + 1}`}
                  />
                  {formData.benefits.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeBenefit(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="display-order">Display Order</Label>
              <Input
                id="display-order"
                type="number"
                min="1"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 1 })}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Status</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : initialData ? 'Update Application' : 'Create Application'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}