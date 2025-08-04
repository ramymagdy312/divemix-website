"use client";

import React, { useState, useEffect } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import { createClient } from '@/app/lib/supabase';

interface Branch {
  name: string;
  address: string;
  phone: string;
  email: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface FooterSettings {
  show_branches_in_footer: string;
  footer_branches_title: string;
}

const Footer = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [settings, setSettings] = useState<FooterSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFooterData();
  }, []);

  const fetchFooterData = async () => {
    try {
      const supabase = createClient();
      
      // Fetch footer settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('settings')
        .select('key, value')
        .in('key', ['show_branches_in_footer', 'footer_branches_title']);

      if (settingsError) {
        console.error('Error fetching footer settings:', settingsError);
      } else {
        const settingsObj = settingsData.reduce((acc: FooterSettings, item: any) => {
          acc[item.key as keyof FooterSettings] = item.value;
          return acc;
        }, {} as FooterSettings);
        setSettings(settingsObj);
      }

      // Fetch branches if they should be shown
      if (!settingsError && settingsData.find((s: any) => s.key === 'show_branches_in_footer')?.value === 'true') {
        const { data: contactData, error: contactError } = await supabase
          .from('contact_page')
          .select('branches')
          .single();

        if (contactError) {
          console.error('Error fetching branches:', contactError);
        } else if (contactData?.branches) {
          setBranches(contactData.branches as Branch[]);
        }
      }
    } catch (error) {
      console.error('Error fetching footer data:', error);
    } finally {
      setLoading(false);
    }
  };

  const shouldShowBranches = settings?.show_branches_in_footer === 'true' && branches.length > 0;
  const branchesTitle = settings?.footer_branches_title || 'Our Branches';

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className={`grid grid-cols-1 ${shouldShowBranches ? 'md:grid-cols-3' : 'md:grid-cols-3'} gap-8`}>
          {shouldShowBranches && (
            <div>
              <h3 className="text-lg font-semibold mb-4">{branchesTitle}</h3>
              <div className="space-y-4">
                {branches.map((branch, index) => (
                  <div key={index} className="text-sm">
                    <h4 className="font-medium text-cyan-400 mb-1">{branch.name}</h4>
                    <div className="space-y-1 text-gray-300">
                      <div className="flex items-start space-x-2">
                        <MapPin className="h-3 w-3 mt-1 flex-shrink-0" />
                        <span className="text-xs">{branch.address}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-3 w-3 flex-shrink-0" />
                        <a href={`tel:${branch.phone}`} className="text-xs hover:text-cyan-400 transition-colors">
                          {branch.phone}
                        </a>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-3 w-3 flex-shrink-0" />
                        <a href={`mailto:${branch.email}`} className="text-xs hover:text-cyan-400 transition-colors">
                          {branch.email}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="hover:text-cyan-400 transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-cyan-400 transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/applications" className="hover:text-cyan-400 transition-colors">
                  Applications
                </Link>
              </li>
            </ul>
          </div>

          

          <div>
            <h3 className="text-lg font-semibold mb-4">About DiveMix</h3>
            <p className="mb-4 text-gray-300">
              Leading provider of innovative solutions and services. We're committed to delivering excellence and building lasting partnerships with our clients.
            </p>
            <div className="flex space-x-4">
              <Link 
                href="/about" 
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Learn More
              </Link>
              <Link 
                href="/contact" 
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p>&copy; {new Date().getFullYear()} Divemix. All rights reserved. | Powered by DevsDiamond</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;