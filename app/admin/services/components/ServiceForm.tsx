"use client";

import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Switch } from '@/app/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { IconPicker, IconRenderer } from '@/app/components/admin/iconPicker';
import I18nTextField, { type I18nValue } from '@/app/components/admin/i18n/I18nTextField';
import I18nTextarea from '@/app/components/admin/i18n/I18nTextarea';
import I18nListField from '@/app/components/admin/i18n/I18nListField';
import { normalizeI18n, seedI18n } from '@/app/lib/i18n/resolve';

interface ServiceFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  loading: boolean;
}

export default function ServiceForm({ initialData, onSubmit, loading }: ServiceFormProps) {
  const [formData, setFormData] = useState<{
    name: I18nValue;
    description: I18nValue;
    icon: string;
    features: I18nValue[];
    is_active: boolean;
    display_order: number;
  }>({
    name: normalizeI18n(initialData?.name ?? initialData?.title),
    description: normalizeI18n(initialData?.description),
    icon: initialData?.icon || 'Settings',
    features: Array.isArray(initialData?.features) && initialData.features.length > 0
      ? initialData.features.map((f: any) => normalizeI18n(f))
      : [seedI18n('')],
    is_active: initialData?.is_active !== undefined ? initialData.is_active : true,
    display_order: initialData?.display_order || 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanedData = {
      ...formData,
      features: formData.features.filter((f) => (f.en || '').trim() !== ''),
    };

    onSubmit(cleanedData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Information</CardTitle>
        <CardDescription>Enter the service details below</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <I18nTextField
            label="Service Name *"
            value={formData.name}
            onChange={(v) => setFormData({ ...formData, name: v })}
            placeholder="Enter service name"
            required
          />

          <div className="space-y-2">
            <Label htmlFor="icon">Icon</Label>
            <div className="flex items-center gap-2">
              <IconPicker
                value={formData.icon}
                onValueChange={(icon) => setFormData({ ...formData, icon })}
              />
              <IconRenderer iconName={formData.icon} size="md" className="text-muted-foreground" />
            </div>
          </div>

          <I18nTextarea
            label="Description *"
            value={formData.description}
            onChange={(v) => setFormData({ ...formData, description: v })}
            placeholder="Enter service description"
            rows={4}
            required
          />

          <I18nListField
            label="Service Features"
            values={formData.features}
            onChange={(features) => setFormData({ ...formData, features })}
            placeholder="Feature"
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
              {loading ? 'Saving...' : initialData ? 'Update Service' : 'Create Service'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
