"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { ArrowLeft, Target } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import ApplicationForm from '../components/ApplicationForm';

export default function NewApplicationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('applications')
        .insert([data]);

      if (error) throw error;

      toast.success('Application created successfully!');
      router.push('/admin/applications');
    } catch (error) {
      console.error('Error creating application:', error);
      toast.error('Error creating application');
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
      <ApplicationForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}
