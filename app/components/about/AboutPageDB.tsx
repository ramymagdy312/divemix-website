"use client";

import { useState, useEffect } from 'react';
import { Shield, Award, Users, Focus, Star, Heart } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { aboutData } from '../../data/aboutData';
import PageHeader from '../common/PageHeader';
import Timeline from './Timeline';
import CompanyOverview from './CompanyOverview';
import AnimatedElement from '../common/AnimatedElement';

interface AboutPageData {
  id: string;
  title: string;
  description: string;
  hero_image: string;
  vision: string;
  mission: string;
  company_overview: string;
  values: {
    title: string;
    description: string;
    icon: string;
  }[];
  timeline: {
    year: string;
    title: string;
    description: string;
  }[];
}

const iconMap = {
  Award,
  Focus,
  Users,
  Shield,
  Star,
  Heart,
};

export default function AboutPageDB() {
  const [data, setData] = useState<AboutPageData>(aboutData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
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
        setData(aboutData);
        setLoading(false);
        return;
      }

      const { data: aboutPageData, error } = await supabase
        .from('about_page')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching about data:', error);
        setData(aboutData);
      } else {
        setData(aboutPageData);
      }
    } catch (error) {
      console.error('Error:', error);
      setData(aboutData);
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

        <div className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Company Overview */}
            <div className="mb-20">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  {data.company_overview}
                </p>
              </div>
            </div>

            {/* Vision & Mission */}
            <div className="grid md:grid-cols-2 gap-12 mb-20">
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
                <p className="text-gray-600">
                  {data.vision}
                </p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                <p className="text-gray-600">
                  {data.mission}
                </p>
              </div>
            </div>

            {/* Core Values */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
              {data.values.map((value, index) => {
                const IconComponent = iconMap[value.icon as keyof typeof iconMap] || Star;
                return (
                  <div key={index} className="text-center p-6 bg-white rounded-lg shadow-sm">
                    <IconComponent className="h-12 w-12 text-cyan-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                    <p className="text-gray-600">
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Timeline */}
            <div className="mb-20">
              <h2 className="text-3xl font-bold text-center mb-12">
                Our Journey
              </h2>
              <Timeline timelineData={data.timeline} />
            </div>
          </div>
        </div>
      </div>
    </AnimatedElement>
  );
}