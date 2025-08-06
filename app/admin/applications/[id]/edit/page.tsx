"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../../lib/supabase';
import { ArrowLeft, Target, Edit } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Skeleton } from '@/app/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import ApplicationForm from '../../components/ApplicationForm';

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
    } catch (error) {
      console.error('Error fetching application:', error);
      toast.error('Error fetching application data');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('applications')
        .update(data)
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
      <ApplicationForm 
        initialData={initialData} 
        onSubmit={handleSubmit} 
        loading={loading} 
      />
    </div>
  );
}