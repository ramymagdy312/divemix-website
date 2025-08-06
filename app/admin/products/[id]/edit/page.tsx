"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../../lib/supabase';
import { AlertCircle, ArrowLeft, Edit, Save } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import ProductForm from '../../components/ProductForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/app/components/ui/alert';
import { Badge } from '@/app/components/ui/badge';
import { Skeleton } from '@/app/components/ui/skeleton';

interface Product {
  id: string;
  name: string;
  description: string;
  short_description?: string;
  category_id: string;
  image_url: string;
  images?: string[];
  features?: string[];
  is_active: boolean;
  display_order: number;
}

// Fallback product data for demo
const fallbackProducts: { [key: string]: Product } = {
  '1': {
    id: '1',
    name: 'Professional Diving Mask',
    description: 'High-quality diving mask with anti-fog technology and comfortable silicone skirt',
    short_description: 'Crystal clear vision underwater',
    category_id: '1',
    image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800',
    images: ['https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800'],

    features: ['Anti-fog coating', 'Comfortable silicone skirt', 'Tempered glass lens'],
    is_active: true,
    display_order: 1
  },
  '2': {
    id: '2',
    name: 'Diving Fins',
    description: 'Lightweight and efficient diving fins for better propulsion',
    short_description: 'Enhanced underwater mobility',
    category_id: '1',
    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800',
    images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800'],

    features: ['Lightweight design', 'Efficient blade shape', 'Comfortable foot pocket'],
    is_active: true,
    display_order: 2
  }
};

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<Product | null>(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchProduct();
  }, [params.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchProduct = async () => {
    try {
      // Check if Supabase is configured
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) {
        console.error('Error fetching product:', error);
        setError(`Database error: ${error.message}`);
        const fallbackProduct = fallbackProducts[params.id];
        if (fallbackProduct) {
          setInitialData(fallbackProduct);
          setUsingFallback(true);
        }
      } else {
        setInitialData(data);
        setUsingFallback(false);
      }
    } catch (error: any) {
      console.error('Error:', error);
      setError(`Connection error: ${error.message}`);
      const fallbackProduct = fallbackProducts[params.id];
      if (fallbackProduct) {
        setInitialData(fallbackProduct);
        setUsingFallback(true);
      }
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (productData: any) => {
    if (usingFallback) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', params.id);

      if (error) {
        console.error('Error updating product:', error);
        toast.error(`Error updating product: ${error.message}`);
        return;
      }

      toast.success('Product updated successfully!');
      router.push('/admin/products');
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast.error(`Error updating product: ${error.message}`);
    } finally {
      setLoading(false);
    }
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
            <CardTitle>Product Not Found</CardTitle>
            <CardDescription>
              The requested product could not be found.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col space-y-2">
            <Button asChild>
              <Link href="/admin/products">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Products
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/check-products-database">
                <AlertCircle className="h-4 w-4 mr-2" />
                Check Database
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error/Demo Mode Banner */}
      {(usingFallback || error) && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>
            {error ? 'Database Connection Issue' : 'Demo Mode Active'}
          </AlertTitle>
          <AlertDescription>
            {error ? (
              <>Database error: {error}. Showing sample product data.</>
            ) : (
              <>Editing sample product. Database not configured.</>
            )}
            <Link href="/check-products-database" className="underline ml-2">
              Set up database →
            </Link>
          </AlertDescription>
        </Alert>
      )}

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
          <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
          <p className="text-muted-foreground">
            {usingFallback ? 'Editing sample product (Demo Mode)' : 'Edit product data'}
          </p>
          {initialData && (
            <div className="text-sm text-muted-foreground">
              Product ID: {initialData.id} • {initialData.name}
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={usingFallback ? "destructive" : "secondary"}>
            {usingFallback ? "Demo Mode" : "Live"}
          </Badge>
          <Badge variant="outline">
            <Edit className="h-3 w-3 mr-1" />
            Editing
          </Badge>
        </div>
      </div>

      <ProductForm 
        initialData={initialData} 
        onSubmit={handleSubmit} 
        loading={loading} 
      />
    </div>
  );
}