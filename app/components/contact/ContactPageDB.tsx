"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import ContactHero from './ContactHero';
import ContactIntro from './ContactIntro';
import EnhancedContactForm from './EnhancedContactForm';
import BranchMap from './BranchMap';
import AnimatedElement from '../common/AnimatedElement';
import EnhancedLoader from '../common/EnhancedLoader';

interface Branch {
  id: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  latitude: number;
  longitude: number;
  working_hours?: Record<string, string>;
  is_active: boolean;
  display_order: number;
}

interface ContactPageData {
  id: string;
  title: string;
  description: string;
  hero_image: string;
  intro_title: string;
  intro_description: string;
}

export default function ContactPageDB() {
  const [data, setData] = useState<ContactPageData | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBranchId, setSelectedBranchId] = useState<string>('');

  useEffect(() => {
    fetchContactData();
    fetchBranches();
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

  const fetchBranches = async () => {
    try {
      // Get branches from contact_page table
      const { data: contactPageData, error } = await supabase
        .from('contact_page')
        .select('branches')
        .single();

      if (!error && contactPageData?.branches) {
        // Convert contact_page branches format to our format
        const convertedBranches = contactPageData.branches.map((branch: any, index: number) => ({
          id: `branch-${index}`,
          name: branch.name,
          address: branch.address,
          phone: branch.phone,
          email: branch.email,
          latitude: branch.coordinates?.lat || 30.0444,
          longitude: branch.coordinates?.lng || 31.2357,
          map_url: branch.map_url || '',
          working_hours: {},
          is_active: true,
          display_order: index
        }));
        
        setBranches(convertedBranches);
        if (convertedBranches.length > 0 && !selectedBranchId) {
          setSelectedBranchId(convertedBranches[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching branches:', error);
    }
  };

  const handleBranchSelect = (branchId: string) => {
    setSelectedBranchId(branchId);
  };

  if (loading) {
    return <EnhancedLoader message="جاري تحميل صفحة الاتصال..." variant="dots" size="lg" />;
  }

  return (
    <AnimatedElement animation="fadeIn">
      <div>
        {/* Hero Section */}
        {data && (
          <ContactHero 
            title={data.title || "تواصل معنا"}
            description={data.description || "نحن هنا لخدمتك"}
            backgroundImage={data.hero_image}
          />
        )}

        {/* Main Content */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Intro Section */}
            {data && (
              <div className="mb-16">
                <ContactIntro 
                  title={data.intro_title || "كيف يمكننا مساعدتك؟"}
                  description={data.intro_description || "تواصل معنا عبر النموذج أدناه أو زر أحد فروعنا"}
                />
              </div>
            )}

            {/* Contact Form and Map */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
              {/* Contact Form */}
              <AnimatedElement animation="slideIn" delay={0.2}>
                <EnhancedContactForm 
                  branches={branches}
                  selectedBranchId={selectedBranchId}
                  onBranchSelect={handleBranchSelect}
                />
              </AnimatedElement>

              {/* Interactive Map */}
              <AnimatedElement animation="slideIn" delay={0.4}>
                <BranchMap 
                  branches={branches}
                  selectedBranchId={selectedBranchId}
                  onBranchSelect={handleBranchSelect}
                />
              </AnimatedElement>
            </div>
          </div>
        </div>
      </div>
    </AnimatedElement>
  );
}