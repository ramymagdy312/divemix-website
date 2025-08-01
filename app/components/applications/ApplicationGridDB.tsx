"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import ApplicationCard from "./ApplicationCard";
import AnimatedElement from "../common/AnimatedElement";

interface Application {
  id: string;
  name: string;
  description: string;
  features: string[];
  images: string[];
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
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {applications.map((application, index) => (
          <ApplicationCard 
            key={application.id} 
            application={{
              id: application.id,
              name: application.name,
              desc: application.description,
              features: application.features,
              images: application.images
            }}
            index={index}
          />
        ))}
      </div>
    </AnimatedElement>
  );
};

export default ApplicationGridDB;