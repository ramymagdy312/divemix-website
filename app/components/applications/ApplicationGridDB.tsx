"use client";

import React, { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { supabase } from "../../lib/supabase";
import { deepResolveI18n } from "../../lib/i18n/resolve";
import type { Locale } from "../../lib/i18n/config";
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

const ApplicationGridDB: React.FC<{ initialApplications?: Application[] }> = ({ initialApplications }) => {
  const locale = useLocale() as Locale;
  const [applications, setApplications] = useState<Application[]>(initialApplications || []);
  const [loading, setLoading] = useState(!initialApplications);

  useEffect(() => {
    if (initialApplications) return;

    const fetchApplications = async () => {
      try {
        const { data, error } = await supabase
          .from("applications")
          .select("*")
          .eq("is_active", true)
          .order("display_order", { ascending: true });

        if (error) throw error;
        setApplications(deepResolveI18n(data || [], locale));
      } catch (error) {
        console.error("Error fetching applications:", error);
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [initialApplications, locale]);

  if (loading) {
    return <EnhancedLoader message="Loading applications..." variant="pulse" size="lg" />;
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-semibold text-gray-900">No Applications Available</h3>
        <p className="text-gray-500">No applications are currently available. Please check back later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AnimatedElement animation="slideUp" delay={0.05}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-12">
          <StatsCounter count={applications.length} label="Applications" icon={<Layers className="w-full h-full" />} />
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

      <AnimatedElement animation="fadeIn" delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 grid-stagger items-stretch">
          {applications.map((application, index) => (
            <ApplicationCard
              key={application.id}
              application={{
                id: application.id,
                name: application.name,
                description: application.description,
                use_cases: application.use_cases || [],
                benefits: application.benefits || [],
                image_url: application.image_url || "",
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
