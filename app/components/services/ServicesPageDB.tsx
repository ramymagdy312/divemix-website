"use client";

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { supabase } from '../../lib/supabase';
import { deepResolveI18n } from '../../lib/i18n/resolve';
import type { Locale } from '../../lib/i18n/config';
import PageHeader from '../common/PageHeader';
import AnimatedElement from '../common/AnimatedElement';
import type { PageData } from '@/app/lib/content';

interface ServicesPageDBProps {
  children: React.ReactNode;
  data?: PageData | null;
}

export default function ServicesPageDB({ children, data: initialData }: ServicesPageDBProps) {
  const locale = useLocale() as Locale;
  const [data, setData] = useState<PageData | null>(initialData || null);
  const [loading, setLoading] = useState(!initialData);

  useEffect(() => {
    if (initialData) return;
    const fetchServicesPageData = async () => {
      try {
        const { data: pageData, error } = await supabase.from('services_page').select('*').single();

        if (error) {
          console.error('Error fetching services page data:', error);
          setData(null);
        } else {
          setData(deepResolveI18n(pageData, locale) as PageData);
        }
      } catch (error) {
        console.error('Error:', error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchServicesPageData();
  }, [initialData, locale]);

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
