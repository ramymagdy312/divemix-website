"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import ContactIntro from "./ContactIntro";
import ContactForm from "./ContactForm";
import BranchList from "./BranchList";
import WhatsAppCard from "./WhatsAppCard";
import AnimatedElement from "../common/AnimatedElement";
import EnhancedLoader from "../common/EnhancedLoader";
import PageHeader from "../common/PageHeader";

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
  const [selectedBranchId, setSelectedBranchId] = useState<string>("");

  useEffect(() => {
    fetchContactData();
    fetchBranches();
  }, []);

  const fetchContactData = async () => {
    try {
      const { data: contactPageData, error } = await supabase
        .from("contact_page")
        .select("*")
        .single();

      if (error) {
        console.error("Error fetching contact data:", error);
        setData(null);
      } else {
        setData(contactPageData);
      }
    } catch (error) {
      console.error("Error:", error);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchBranches = async () => {
    try {
      // Get branches from contact_page table
      const { data: contactPageData, error } = await supabase
        .from("contact_page")
        .select("branches")
        .single();

      if (!error && contactPageData?.branches) {
        // Convert contact_page branches format to our format
        const convertedBranches = contactPageData.branches.map(
          (branch: any, index: number) => ({
            id: `branch-${index}`,
            name: branch.name,
            address: branch.address,
            phone: branch.phone,
            email: branch.email,
            latitude: branch.coordinates?.lat || 30.0444,
            longitude: branch.coordinates?.lng || 31.2357,
            map_url: branch.map_url || "",
            working_hours: {},
            is_active: true,
            display_order: index,
          })
        );

        setBranches(convertedBranches);
        if (convertedBranches.length > 0 && !selectedBranchId) {
          setSelectedBranchId(convertedBranches[0].id);
        }
      }
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };

  const handleBranchSelect = (branchId: string) => {
    setSelectedBranchId(branchId);
  };

  if (loading) {
    return (
      <EnhancedLoader
        message="Loading contact page..."
        variant="dots"
        size="lg"
      />
    );
  }

  return (
    <AnimatedElement animation="fadeIn">
      <div>
        {/* Hero Section */}
        {data && (
          <PageHeader
            title={data.title}
            description={data.description}
            backgroundImage={data.hero_image}
          />
        )}

        {/* Main Content */}
        <div className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Intro Section */}
            {data && (
              <div className="mb-16 text-center">
                <AnimatedElement animation="fadeIn" delay={0.1}>
                  <ContactIntro
                    title={data.intro_title || "How can we help you?"}
                    description={
                      data.intro_description ||
                      "Get in touch with us using the form below and we'll get back to you as soon as possible"
                    }
                  />
                </AnimatedElement>
              </div>
            )}

            {/* Contact Options */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Contact Form */}
              <div className="lg:col-span-2">
                <AnimatedElement animation="slideIn" delay={0.2}>
                  <ContactForm
                    branches={branches}
                    selectedBranchId={selectedBranchId}
                    onBranchSelect={handleBranchSelect}
                  />
                </AnimatedElement>
              </div>

              {/* WhatsApp Card */}
              <div className="space-y-8">
                <AnimatedElement animation="slideIn" delay={0.3}>
                  <WhatsAppCard />
                </AnimatedElement>
              </div>
            </div>

            {/* Branch List - Full Width */}
            <div className="mt-16">
              <AnimatedElement animation="slideIn" delay={0.4}>
                <BranchList branches={branches} />
              </AnimatedElement>
            </div>
          </div>
        </div>
      </div>
    </AnimatedElement>
  );
}
