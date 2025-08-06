"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { AlertCircle, ArrowLeft, Package, Plus } from 'lucide-react';
import Link from 'next/link';
import CategoryForm from '../components/CategoryForm';
import toast from 'react-hot-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';

export default function NewCategoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);

  const handleSubmit = async (categoryData: any) => {
    // Check if Supabase is configured
    setLoading(true);
    try {
      const { error } = await supabase
        .from('product_categories')
        .insert([categoryData]);

      if (error) throw error;

      toast.success('Category created successfully!');
      router.push('/admin/categories');
    } catch (error: any) {
      console.error('Error creating category:', error);
      toast.error(`Error creating category: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/categories">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Categories
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Category</h1>
          <p className="text-muted-foreground">
            Add a new category for products
          </p>
        </div>
        <Badge variant="secondary">
          <Package className="h-3 w-3 mr-1" />
          New Category
        </Badge>
      </div>

      <CategoryForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}