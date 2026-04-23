"use client";

import React, { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { supabase } from "../../lib/supabase";
import { deepResolveI18n } from "../../lib/i18n/resolve";
import type { Locale } from "../../lib/i18n/config";
import ServiceCard from "./ServiceCard";
import AnimatedElement from "../common/AnimatedElement";
import StatsCounter from "../common/StatsCounter";
import EnhancedLoader from "../common/EnhancedLoader";
import { Settings, Wrench, Droplets, FireExtinguisher, Award, Clock } from "lucide-react";

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
  Settings,
  Wrench,
  Droplets,
  FireExtinguisher,
  // Backward compatibility for older saved emoji values
  "🔧": Wrench,
  "⚙️": Settings,
  "🔍": Settings,
  "🛢️": FireExtinguisher,
};

const ServiceGridDB: React.FC<{ initialServices?: Service[] }> = ({ initialServices }) => {
  const locale = useLocale() as Locale;
  const [services, setServices] = useState<Service[]>(initialServices || []);
  const [loading, setLoading] = useState(!initialServices);

  useEffect(() => {
    if (initialServices) return;

    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from("services")
          .select("*")
          .eq("is_active", true)
          .order("display_order", { ascending: true });

        if (error) throw error;
        setServices(deepResolveI18n(data || [], locale));
      } catch (error) {
        console.error("Error fetching services:", error);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [initialServices, locale]);

  if (loading) {
    return <EnhancedLoader message="Loading services..." variant="dots" size="md" />;
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-semibold text-gray-900">No Services Available</h3>
        <p className="text-gray-500">No services are currently available. Please check back later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AnimatedElement animation="slideUp" delay={0.05}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-12">
          <StatsCounter count={services.length} label="Services" icon={<Settings className="w-full h-full" />} />
          <StatsCounter
            count={services.reduce((acc, service) => acc + (service.features?.length || 0), 0)}
            label="Features"
            icon={<Award className="w-full h-full" />}
          />
          <StatsCounter count={24} label="Support Hours" icon={<Clock className="w-full h-full" />} suffix="/7" />
        </div>
      </AnimatedElement>

      <AnimatedElement animation="fadeIn" delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 grid-stagger items-stretch">
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
