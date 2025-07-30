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
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-8">
        <div className="flex items-center mb-4">
          <Icon className="h-8 w-8 text-cyan-600 mr-3" />
          <h2 className="text-2xl font-semibold">{title}</h2>
        </div>
        <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>
        {features.length > 0 && (
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <span className="w-2 h-2 bg-cyan-600 rounded-full mt-2 mr-3 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AnimatedElement>
  );
};

export default ServiceCard;
