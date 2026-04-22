"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Mail, Phone, MapPin, Clock, Globe, Award, Users, Shield, Zap } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/app/lib/supabase";
import Logo from "./common/Logo";
import type { FooterContent, SiteSettings } from "@/app/lib/content";

interface Branch {
  name: string;
  address: string;
  phone: string;
  email: string;
  show_in_footer?: boolean;
}

interface SupportItem {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  enabled: boolean;
}

interface FooterProps {
  footerContent?: FooterContent;
  settings?: SiteSettings;
  branches?: Branch[];
  logoUrl?: string;
  logoAlt?: string;
}

const Footer = ({ footerContent, settings: settingsProp, branches: branchesProp, logoUrl, logoAlt }: FooterProps) => {
  const [branches, setBranches] = useState<Branch[]>(branchesProp || []);
  const [settings, setSettings] = useState<SiteSettings | null>(settingsProp || null);
  const [supportItems, setSupportItems] = useState<SupportItem[]>([]);

  useEffect(() => {
    if (settingsProp) {
      parseSupport(settingsProp);
      return;
    }

    const fetchLegacyFooterData = async () => {
      const supabase = createClient();
      const { data: settingsData } = await supabase
        .from("settings")
        .select("key, value")
        .in("key", [
          "show_branches_in_footer",
          "footer_branches_title",
          "support_section_title",
          "support_section_enabled",
          "support_items",
        ]);

      const nextSettings: SiteSettings = {};
      for (const row of settingsData || []) nextSettings[row.key] = row.value;
      setSettings(nextSettings);
      parseSupport(nextSettings);

      if (nextSettings.show_branches_in_footer === "true") {
        const { data: contactData } = await supabase.from("contact_page").select("branches").single();
        const allBranches = (contactData?.branches || []) as Branch[];
        setBranches(allBranches.filter((branch) => branch.show_in_footer === true));
      }
    };

    fetchLegacyFooterData();
  }, [settingsProp]);

  const parseSupport = (value: SiteSettings) => {
    const raw = value.support_items;
    if (!raw) return setSupportItems([]);
    try {
      const parsed = JSON.parse(raw) as SupportItem[];
      setSupportItems(parsed.filter((item) => item.enabled));
    } catch {
      setSupportItems([]);
    }
  };

  const shouldShowBranches = settings?.show_branches_in_footer === "true" && branches.length > 0;
  const branchesTitle = settings?.footer_branches_title || "Our Branches";
  const shouldShowSupport = settings?.support_section_enabled === "true" && supportItems.length > 0;
  const supportTitle = settings?.support_section_title || "Support";

  const columns = useMemo(() => {
    if (footerContent?.columns?.length) return footerContent.columns;
    return [
      {
        title: "Company",
        links: [
          { label: "About Us", href: "/about" },
          { label: "Gallery", href: "/gallery" },
          { label: "Contact Us", href: "/contact" },
        ],
      },
      {
        title: "Our Services",
        links: [
          { label: "Products", href: "/products" },
          { label: "Services", href: "/services" },
          { label: "Applications", href: "/applications" },
        ],
      },
    ];
  }, [footerContent]);

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "Clock":
        return Clock;
      case "Globe":
        return Globe;
      case "Shield":
        return Shield;
      case "Award":
        return Award;
      case "Users":
        return Users;
      case "Zap":
        return Zap;
      default:
        return Clock;
    }
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-cyan-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Logo src={logoUrl} alt={logoAlt} />
          </div>
        </div>

        <div
          className={`grid grid-cols-1 ${
            shouldShowBranches && shouldShowSupport
              ? "md:grid-cols-4"
              : shouldShowBranches || shouldShowSupport
              ? "md:grid-cols-3"
              : "md:grid-cols-2"
          } gap-8 mb-12`}
        >
          {columns.map((column) => (
            <div className="space-y-4" key={column.title}>
              <h3 className="text-xl font-bold mb-6 text-cyan-400 border-b-2 border-cyan-600 pb-2">{column.title}</h3>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={`${column.title}-${link.href}-${link.label}`}>
                    <Link href={link.href} className="flex items-center space-x-2 hover:text-cyan-400 group">
                      <span className="w-2 h-2 bg-cyan-600 rounded-full group-hover:bg-cyan-400"></span>
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {shouldShowSupport && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold mb-6 text-cyan-400 border-b-2 border-cyan-600 pb-2">{supportTitle}</h3>
              <ul className="space-y-3">
                {supportItems.map((item) => {
                  const IconComponent = getIconComponent(item.icon);
                  return (
                    <li key={item.id} className="flex items-center space-x-3 text-gray-300">
                      <IconComponent className="h-5 w-5 text-cyan-400" />
                      <div>
                        <div className="font-medium">{item.title}</div>
                        <div className="text-sm">{item.subtitle}</div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {shouldShowBranches && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold mb-6 text-cyan-400 border-b-2 border-cyan-600 pb-2">{branchesTitle}</h3>
              <div className="space-y-6">
                {branches.map((branch, index) => (
                  <div key={`${branch.name}-${index}`} className="bg-gray-800 bg-opacity-50 p-4 rounded-lg border border-gray-700">
                    <h4 className="font-bold text-cyan-400 mb-3 text-lg">{branch.name}</h4>
                    <div className="space-y-2 text-gray-300">
                      <div className="flex items-start space-x-3">
                        <MapPin className="h-4 w-4 mt-1 flex-shrink-0 text-cyan-400" />
                        <span className="text-sm">{branch.address}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="h-4 w-4 flex-shrink-0 text-cyan-400" />
                        <a href={`tel:${branch.phone}`} className="text-sm hover:text-cyan-400">
                          {branch.phone}
                        </a>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Mail className="h-4 w-4 flex-shrink-0 text-cyan-400" />
                        <a href={`mailto:${branch.email}`} className="text-sm hover:text-cyan-400">
                          {branch.email}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} {footerContent?.copyright_name || "Divemix"}. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>Powered by</span>
              <span className="text-cyan-400 font-semibold">{footerContent?.powered_by_text || "DevsDiamond"}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
