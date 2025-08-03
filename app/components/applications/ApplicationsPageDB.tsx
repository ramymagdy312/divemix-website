"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

import PageHeader from '../common/PageHeader';
import AnimatedElement from '../common/AnimatedElement';

interface ApplicationsPageData {
  id: string;
  title: string;
  description: string;
  hero_image: string;
  intro_title: string;
  intro_description: string;
}

interface ApplicationsPageDBProps {
  children: React.ReactNode;
}

export default function ApplicationsPageDB({ children }: ApplicationsPageDBProps) {
  const [data, setData] = useState<ApplicationsPageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplicationsPageData();
  }, []);

  const fetchApplicationsPageData = async () => {
    try {
      const { data: pageData, error } = await supabase
        .from('applications_page')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching applications page data:', error);
        setData(null);
      } else {
        setData(pageData);
      }
    } catch (error) {
      console.error('Error:', error);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

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
        <PageHeader
          title={data.title}
          description={data.description}
          backgroundImage={data.hero_image}
        />

        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{data.intro_title}</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {data.intro_description}
              </p>
            </div>
            
            {children}
          </div>
        </div>
      </div>
    </AnimatedElement>
  );
}