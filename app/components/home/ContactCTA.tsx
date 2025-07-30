"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

const ContactCTA = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-cyan-900 to-cyan-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
        <p className="text-xl text-cyan-100 mb-8 max-w-2xl mx-auto">
          Contact our team of experts for a consultation and discover how we can help optimize your operations
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center px-8 py-4 bg-white text-cyan-900 rounded-lg hover:bg-cyan-50 transition-colors text-lg font-medium"
        >
          Contact Us Today
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </div>
    </section>
  );
};

export default ContactCTA;