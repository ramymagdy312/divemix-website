"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import PageHeader from '../common/PageHeader';
import AnimatedElement from '../common/AnimatedElement';

interface ServicesPageData {
  id: string;
  title: string;
  description: string;
  hero_image: string;
  intro_title: string;
  intro_description: string;
}

interface ServicesPageDBProps {
  children: React.ReactNode;
}

export default function ServicesPageDB({ children }: ServicesPageDBProps) {
  const [data, setData] = useState<ServicesPageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServicesPageData();
  }, []);

  const fetchServicesPageData = async () => {
    try {
      const { data: pageData, error } = await supabase
        .from('services_page')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching services page data:', error);
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
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Data Available</h2>
          <p className="text-gray-600">Please configure the services page data in the admin panel.</p>
        </div>
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