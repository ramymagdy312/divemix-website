"use client";

import { useState } from 'react';
import FolderExplorerSingle from '../../../components/admin/FolderExplorerSingle';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Switch } from '@/app/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import I18nTextField, { type I18nValue } from '@/app/components/admin/i18n/I18nTextField';
import I18nTextarea from '@/app/components/admin/i18n/I18nTextarea';
import I18nListField from '@/app/components/admin/i18n/I18nListField';
import { normalizeI18n, seedI18n } from '@/app/lib/i18n/resolve';

interface ApplicationFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  loading: boolean;
}

export default function ApplicationForm({ initialData, onSubmit, loading }: ApplicationFormProps) {
  const [formData, setFormData] = useState<{
    name: I18nValue;
    description: I18nValue;
    image_url: string;
    use_cases: I18nValue[];
    benefits: I18nValue[];
    is_active: boolean;
    display_order: number;
  }>({
    name: normalizeI18n(initialData?.name ?? initialData?.title),
    description: normalizeI18n(initialData?.description),
    image_url: initialData?.image_url || '',
    use_cases: Array.isArray(initialData?.use_cases) && initialData.use_cases.length > 0
      ? initialData.use_cases.map((f: any) => normalizeI18n(f))
      : [seedI18n('')],
    benefits: Array.isArray(initialData?.benefits) && initialData.benefits.length > 0
      ? initialData.benefits.map((f: any) => normalizeI18n(f))
      : [seedI18n('')],
    is_active: initialData?.is_active !== undefined ? initialData.is_active : true,
    display_order: initialData?.display_order || 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanedData = {
      ...formData,
      use_cases: formData.use_cases.filter((v) => (v.en || '').trim() !== ''),
      benefits: formData.benefits.filter((v) => (v.en || '').trim() !== ''),
    };

    onSubmit(cleanedData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Information</CardTitle>
        <CardDescription>Enter the application details below</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <I18nTextField
            label="Application Name *"
            value={formData.name}
            onChange={(v) => setFormData({ ...formData, name: v })}
            placeholder="Enter application name"
            required
          />

          <I18nTextarea
            label="Description *"
            value={formData.description}
            onChange={(v) => setFormData({ ...formData, description: v })}
            placeholder="Enter application description"
            rows={4}
            required
          />

          <div className="space-y-2">
            <Label>Application Image</Label>
            <FolderExplorerSingle
              image={formData.image_url}
              onImageChange={(image_url) => setFormData({ ...formData, image_url })}
              label="Application Image"
            />
          </div>

          <I18nListField
            label="Use Cases"
            values={formData.use_cases}
            onChange={(use_cases) => setFormData({ ...formData, use_cases })}
            placeholder="Use Case"
          />

          <I18nListField
            label="Benefits"
            values={formData.benefits}
            onChange={(benefits) => setFormData({ ...formData, benefits })}
            placeholder="Benefit"
          />

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
