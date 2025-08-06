"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { ArrowLeft, Package } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import ProductForm from '../components/ProductForm';

interface Category {
  id: string;
  name: string;
  slug: string;
}

// Fallback categories
const fallbackCategories: Category[] = [
  { id: '1', name: 'Diving Equipment', slug: 'diving-equipment' },
  { id: '2', name: 'Safety Gear', slug: 'safety-gear' },
  { id: '3', name: 'Underwater Cameras', slug: 'underwater-cameras' },
  { id: '4', name: 'Accessories', slug: 'accessories' },
  { id: '5', name: 'Wetsuits & Gear', slug: 'wetsuits-gear' },
  { id: '6', name: 'Maintenance Tools', slug: 'maintenance-tools' }
];

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('products')
        .insert([data]);

      if (error) throw error;

      toast.success('Product created successfully!');
      router.push('/admin/products');
    } catch (error: any) {
      console.error('Error creating product:', error);
      toast.error(`Error creating product: ${error.message}`);
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
              <Link href="/admin/products">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Products
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
          <p className="text-muted-foreground">
            Add a new product to the database
          </p>
        </div>
        <Badge variant="secondary">
          <Package className="h-3 w-3 mr-1" />
          New Product
        </Badge>
      </div>

      {/* Main Form */}
      <ProductForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}
