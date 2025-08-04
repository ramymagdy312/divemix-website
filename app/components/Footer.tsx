"use client";

import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5" />
                <a href="tel:+201000096033"><span>+20 1000 096 033</span></a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5" />
                <a href="mailto:info@divemix.com"><span>info@divemix.com</span></a>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5" />
                <span>96 Industrial Area, El Nagda St, 84111 Hurghada, Red Sea, Egypt.</span>
              </div>
            </div>
          </div>

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
          <p>&copy; {new Date().getFullYear()} DiveMix. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;