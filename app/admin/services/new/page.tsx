"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { ArrowLeft, Wrench } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import ServiceForm from '../components/ServiceForm';

export default function NewServicePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('services')
        .insert([data]);

      if (error) throw error;

      toast.success('Service created successfully!');
      router.push('/admin/services');
    } catch (error) {
      console.error('Error creating service:', error);
      toast.error('An error occurred while creating the service.');
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
              <Link href="/admin/services">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Services
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Service</h1>
          <p className="text-muted-foreground">
            Add a new service to the database
          </p>
        </div>
        <Badge variant="secondary">
          <Wrench className="h-3 w-3 mr-1" />
          New Service
        </Badge>
      </div>

      {/* Main Form */}
      <ServiceForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}