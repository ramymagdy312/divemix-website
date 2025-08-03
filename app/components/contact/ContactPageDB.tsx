"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

import ContactHero from './ContactHero';
import ContactIntro from './ContactIntro';
import FloatingContactForm from './FloatingContactForm';
import BranchLocations from './BranchLocations';
import AnimatedElement from '../common/AnimatedElement';

interface ContactPageData {
  id: string;
  title: string;
  description: string;
  hero_image: string;
  intro_title: string;
  intro_description: string;
  branches: {
    name: string;
    address: string;
    phone: string;
    email: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  }[];
}

export default function ContactPageDB() {
  const [data, setData] = useState<ContactPageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContactData();
  }, []);

  const fetchContactData = async () => {
    try {
      const { data: contactPageData, error } = await supabase
        .from('contact_page')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching contact data:', error);
        setData(null);
      } else {
        setData(contactPageData);
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
        <ContactHero 
          title={data.title}
          description={data.description}
          backgroundImage={data.hero_image}
        />
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-12 mb-20">
              <div className="lg:w-1/2">
                <ContactIntro 
                  title={data.intro_title}
                  description={data.intro_description}
                />
              </div>
              <div className="lg:w-1/2 lg:sticky lg:top-8">
                <FloatingContactForm />
              </div>
            </div>
            <BranchLocations branches={data.branches} />
          </div>
        </div>
      </div>
    </AnimatedElement>
  );
}