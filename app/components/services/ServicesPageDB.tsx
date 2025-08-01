"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { servicesPageData } from '../../data/servicesPageData';
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
  const [data, setData] = useState<ServicesPageData>(servicesPageData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServicesPageData();
  }, []);

  const fetchServicesPageData = async () => {
    try {
      // Check if Supabase is properly configured
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey || 
          supabaseUrl === 'your-supabase-url' || 
          supabaseKey === 'your-supabase-anon-key' ||
          supabaseUrl === 'https://placeholder.supabase.co' ||
          supabaseKey === 'placeholder-key') {
        // Use mock data for development
        console.warn('Supabase not configured. Using mock data.');
        setData(servicesPageData);
        setLoading(false);
        return;
      }

      const { data: pageData, error } = await supabase
        .from('services_page')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching services page data:', error);
        setData(servicesPageData);
      } else {
        setData(pageData);
      }
    } catch (error) {
      console.error('Error:', error);
      setData(servicesPageData);
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