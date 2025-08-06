"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../../lib/supabase';
import { ArrowLeft, Edit } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Skeleton } from '@/app/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import ServiceForm from '../../components/ServiceForm';

interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  features: string[];
  is_active: boolean;
  display_order: number;
}

export default function EditServicePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<Service | null>(null);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    fetchService();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const fetchService = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) {
        console.error('Error fetching service:', error);
        toast.error('Error fetching service data');
        return;
      }
      
      setInitialData(data);
    } catch (error) {
      console.error('Error fetching service:', error);
      toast.error('Error fetching service data');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('services')
        .update(data)
        .eq('id', params.id);

      if (error) {
        console.error('Error updating service:', error);
        toast.error('Error updating service');
        return;
      }

      toast.success('Service updated successfully!');
      router.push('/admin/services');
    } catch (error) {
      console.error('Error updating service:', error);
      toast.error('Error updating service');
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
            <CardTitle>Service Not Found</CardTitle>
            <CardDescription>
              The requested service could not be found.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/admin/services">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Services
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
              <Link href="/admin/services">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Services
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Service</h1>
          <p className="text-muted-foreground">
            Edit service data
          </p>
          {initialData && (
            <div className="text-sm text-muted-foreground">
              Service ID: {initialData.id} • {initialData.name}
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
      <ServiceForm 
        initialData={initialData} 
        onSubmit={handleSubmit} 
        loading={loading} 
      />
    </div>
  );
}