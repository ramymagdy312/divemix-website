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
  branches?: any[];
}

export default function ContactPageDB({ initialData }: { initialData?: ContactPageData | null }) {
  const [data, setData] = useState<ContactPageData | null>(initialData || null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(!initialData);
  const [selectedBranchId, setSelectedBranchId] = useState<string>("");

  useEffect(() => {
    const convertBranches = (input: any[]) => {
      const convertedBranches = (input || []).map((branch: any, index: number) => ({
        id: `branch-${index}`,
        name: branch.name,
        address: branch.address,
        phone: branch.phone,
        email: branch.email,
        latitude: branch.coordinates?.lat || 0,
        longitude: branch.coordinates?.lng || 0,
        map_url: branch.map_url || "",
        working_hours: {},
        is_active: true,
        display_order: index,
      }));

      setBranches(convertedBranches);
      if (convertedBranches.length > 0 && !selectedBranchId) {
        setSelectedBranchId(convertedBranches[0].id);
      }
    };

    if (initialData) {
      setLoading(false);
      convertBranches(initialData.branches || []);
      return;
    }

    const fetchContactData = async () => {
      try {
        const { data: contactPageData, error } = await supabase.from("contact_page").select("*").single();

        if (error) {
          console.error("Error fetching contact data:", error);
          setData(null);
        } else {
          setData(contactPageData as ContactPageData);
          convertBranches(contactPageData?.branches || []);
        }
      } catch (error) {
        console.error("Error:", error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchContactData();
  }, [initialData, selectedBranchId]);

  const handleBranchSelect = (branchId: string) => {
    setSelectedBranchId(branchId);
  };

  if (loading) {
    return <EnhancedLoader message="Loading contact page..." variant="dots" size="lg" />;
  }

  return (
    <AnimatedElement animation="fadeIn">
      <div>
        {data && <PageHeader title={data.title} description={data.description} backgroundImage={data.hero_image} />}

        <div className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <AnimatedElement animation="slideIn" delay={0.2}>
                  <ContactForm
                    branches={branches}
                    selectedBranchId={selectedBranchId}
                    onBranchSelect={handleBranchSelect}
                  />
                </AnimatedElement>
              </div>

              <div className="space-y-8">
                <AnimatedElement animation="slideIn" delay={0.3}>
                  <WhatsAppCard />
                </AnimatedElement>
              </div>
            </div>

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
