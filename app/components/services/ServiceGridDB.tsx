"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import ServiceCard from "./ServiceCard";
import AnimatedElement from "../common/AnimatedElement";
import StatsCounter from "../common/StatsCounter";
import EnhancedLoader from "../common/EnhancedLoader";
import { Settings, Wrench, Droplets, FireExtinguisher, Users, Award, Clock } from "lucide-react";

interface Service {
  id: string;
  name: string;
  description: string;
  short_description: string;
  icon: string;
  features: string[];
  is_active: boolean;
  display_order: number;
}

const iconMap: { [key: string]: any } = {
  '🔧': Settings,
  '🛠️': Wrench,
  '💨': Droplets,
  '🔥': FireExtinguisher,
  'Settings': Settings,
  'Wrench': Wrench,
  'Droplets': Droplets,
  'FireExtinguisher': FireExtinguisher,
};

const ServiceGridDB: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      // Fallback to empty array if database fails
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <EnhancedLoader message="Loading services..." variant="dots" size="md" />;
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900">No Services Available</h3>
          <p className="text-gray-500">
            No services are currently available. Please check back later.
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
            Our Services
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Professional diving and marine services tailored to meet your specific needs
          </p>
        </AnimatedElement>
      </div>

      {/* Stats Section */}
      <AnimatedElement animation="slideUp" delay={0.05}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-12">
          <StatsCounter 
            count={services.length} 
            label="Services" 
            icon={<Settings className="w-full h-full" />}
          />
          <StatsCounter 
            count={services.reduce((acc, service) => acc + (service.features?.length || 0), 0)} 
            label="Features" 
            icon={<Award className="w-full h-full" />}
          />
          <StatsCounter 
            count={24} 
            label="Support Hours" 
            icon={<Clock className="w-full h-full" />}
            suffix="/7"
          />
        </div>
      </AnimatedElement>

      {/* Services Grid */}
      <AnimatedElement animation="fadeIn" delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 grid-stagger">
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              title={service.name}
              description={service.description}
              Icon={iconMap[service.icon] || Settings}
              features={service.features}
              index={index}
            />
          ))}
        </div>
      </AnimatedElement>
    </div>
  );
};

export default ServiceGridDB;