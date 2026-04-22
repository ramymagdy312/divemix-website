"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CompanyOverview from "../about/CompanyOverview";

interface CompanySectionProps {
  companyOverview?: string;
}

const CompanySection = ({ companyOverview }: CompanySectionProps) => {
  const paragraphs = companyOverview
    ? companyOverview
        .split(/\n\n+/)
        .map((p) => p.trim())
        .filter(Boolean)
    : undefined;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CompanyOverview paragraphs={paragraphs} />
        <div className="text-center mt-8">
          <Link
            href="/about"
            className="inline-flex items-center text-cyan-600 hover:text-cyan-700 font-medium group"
          >
            Learn More About Us
            <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CompanySection;
