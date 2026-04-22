"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import PageHeader from '../common/PageHeader';
import AnimatedElement from '../common/AnimatedElement';
import type { PageData } from '@/app/lib/content';

interface ApplicationsPageDBProps {
  children: React.ReactNode;
  data?: PageData | null;
}

export default function ApplicationsPageDB({ children, data: initialData }: ApplicationsPageDBProps) {
  const [data, setData] = useState<PageData | null>(initialData || null);
  const [loading, setLoading] = useState(!initialData);

  useEffect(() => {
    if (initialData) return;
    const fetchApplicationsPageData = async () => {
      try {
        const { data: pageData, error } = await supabase.from('applications_page').select('*').single();

        if (error) {
          console.error('Error fetching applications page data:', error);
          setData(null);
        } else {
          setData(pageData as PageData);
        }
      } catch (error) {
        console.error('Error:', error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationsPageData();
  }, [initialData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">No data available</div>
      </div>
    );
  }

  return (
    <AnimatedElement animation="fadeIn">
      <div>
        <PageHeader title={data.title} description={data.description} backgroundImage={data.hero_image} />

        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{data.intro_title}</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">{data.intro_description}</p>
            </div>

            {children}
          </div>
        </div>
      </div>
    </AnimatedElement>
  );
}
