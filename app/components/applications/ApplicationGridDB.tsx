"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import ApplicationCard from "./ApplicationCard";
import AnimatedElement from "../common/AnimatedElement";
import StatsCounter from "../common/StatsCounter";
import EnhancedLoader from "../common/EnhancedLoader";
import { Layers, Target, TrendingUp } from "lucide-react";

interface Application {
  id: string;
  name: string;
  description: string;
  short_description: string;
  image_url: string;
  industry: string;
  use_cases: string[];
  benefits: string[];
  is_active: boolean;
  display_order: number;
}

const ApplicationGridDB: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <EnhancedLoader message="Loading applications..." variant="pulse" size="lg" />;
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900">No Applications Available</h3>
          <p className="text-gray-500">
            No applications are currently available. Please check back later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <AnimatedElement animation="fadeIn">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Applications
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover innovative applications and solutions for various marine and diving scenarios
          </p>
        </AnimatedElement>
      </div>

      {/* Stats Section */}
      <AnimatedElement animation="slideUp" delay={0.05}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-12">
          <StatsCounter 
            count={applications.length} 
            label="Applications" 
            icon={<Layers className="w-full h-full" />}
          />
          <StatsCounter 
            count={applications.reduce((acc, app) => acc + (app.use_cases?.length || 0), 0)} 
            label="Use Cases" 
            icon={<Target className="w-full h-full" />}
          />
          <StatsCounter 
            count={applications.reduce((acc, app) => acc + (app.benefits?.length || 0), 0)} 
            label="Benefits" 
            icon={<TrendingUp className="w-full h-full" />}
          />
        </div>
      </AnimatedElement>

      {/* Applications Grid */}
      <AnimatedElement animation="fadeIn" delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 grid-stagger">
          {applications.map((application, index) => (
            <ApplicationCard 
              key={application.id} 
              application={{
                id: application.id,
                name: application.name,
                desc: application.description,
                use_cases: application.use_cases || [],
                benefits: application.benefits || [],
                images: [application.image_url]
              }}
              index={index}
            />
          ))}
        </div>
      </AnimatedElement>
    </div>
  );
};

export default ApplicationGridDB;