"use client";

import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { supabase } from "../../lib/supabase";
import { deepResolveI18n } from "../../lib/i18n/resolve";
import type { Locale } from "../../lib/i18n/config";
import ApplicationCard from "../../components/applications/ApplicationCard";

interface Application {
  id: string;
  name: string;
  description: string;
  image_url: string;
  use_cases?: string[];
  benefits?: string[];
  is_active: boolean;
  display_order: number;
}

interface FeaturedApplicationsProps {
  initialApplications?: Application[];
  heading?: string;
  description?: string;
}

const FeaturedApplications = ({
  initialApplications,
  heading = "Featured Applications",
  description = "Discover how our solutions serve diverse industries",
}: FeaturedApplicationsProps) => {
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
          .order("display_order", { ascending: true })
          .limit(3);

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
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-4"
          >
            {heading}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            {description}
          </motion.p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {applications.map((app, index) => (
            <ApplicationCard key={app.id} application={app} index={index} />
          ))}
        </div>
        <div className="text-center mt-12">
          <Link
            href="/applications"
            className="inline-flex items-center px-6 py-3 border-2 border-cyan-600 text-cyan-600 rounded-lg hover:bg-cyan-600 hover:text-white transition-colors"
          >
            Explore All Applications
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedApplications;
