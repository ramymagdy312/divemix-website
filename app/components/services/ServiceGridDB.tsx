"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import ServiceCard from "./ServiceCard";
import AnimatedElement from "../common/AnimatedElement";
import { Settings, Wrench, Droplets, FireExtinguisher } from "lucide-react";

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
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  return (
    <AnimatedElement animation="fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
  );
};

export default ServiceGridDB;