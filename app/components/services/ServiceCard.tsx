"use client";

import React from "react";
import { DivideIcon as LucideIcon } from "lucide-react";
import AnimatedElement from "../common/AnimatedElement";

interface ServiceCardProps {
  title: string;
  description: string;
  Icon: typeof LucideIcon;
  features: string[];
  index?: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  Icon,
  features,
  index = 0,
}) => {
  return (
    <AnimatedElement animation="slideUp" delay={index * 0.1}>
      <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-8 border border-gray-100 hover:border-cyan-200 relative overflow-hidden h-full flex flex-col">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/50 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Icon and Title */}
          <div className="flex items-center mb-6 flex-shrink-0">
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <Icon className="h-7 w-7 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 ml-4 group-hover:text-cyan-700 transition-colors duration-300">
              {title}
            </h2>
          </div>

          {/* Description */}
          <div className="flex-shrink-0 mb-8">
            <p className="text-gray-600 leading-relaxed text-lg">
              {description}
            </p>
          </div>

          {/* Features - This will grow to fill remaining space */}
          <div className="flex-grow">
            {features.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
                  Key Features
                </h3>
                <ul className="space-y-3">
                  {features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start group/item">
                      <div className="relative mt-1.5 mr-4">
                        <div className="w-2 h-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full group-hover/item:scale-125 transition-transform duration-200" />
                        <div className="absolute inset-0 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-0 group-hover/item:opacity-75" />
                      </div>
                      <span className="text-gray-700 leading-relaxed group-hover/item:text-gray-900 transition-colors duration-200">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-cyan-100/20 to-transparent rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-100/20 to-transparent rounded-full translate-y-12 -translate-x-12 group-hover:scale-150 transition-transform duration-700" />
      </div>
    </AnimatedElement>
  );
};

export default ServiceCard;
