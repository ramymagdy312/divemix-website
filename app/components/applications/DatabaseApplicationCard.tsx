"use client";

import React from "react";
import AnimatedElement from "../common/AnimatedElement";
import Image from 'next/image';

interface DatabaseApplication {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  use_cases?: string[];
  benefits?: string[];
  is_active: boolean;
  display_order: number;
}

interface DatabaseApplicationCardProps {
  application: DatabaseApplication;
  index?: number;
}

const DatabaseApplicationCard: React.FC<DatabaseApplicationCardProps> = ({ application, index = 0 }) => {
  // Get the image URL
  const getImageUrl = () => {
    if (application.image_url) {
      return application.image_url;
    }
    // Fallback image
    return 'https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?auto=format&fit=crop&w=2000';
  };

  return (
    <AnimatedElement animation="slideUp" delay={index * 0.1}>
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
        <div className="aspect-[16/9] relative overflow-hidden bg-gray-50">
          <Image
            src={getImageUrl()}
            alt={application.name}
            fill
            className="object-cover transform transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold mb-3">{application.name}</h3>
          <p className="text-gray-600 leading-relaxed mb-4">{application.description}</p>
          
          {/* Use Cases */}
          {application.use_cases && application.use_cases.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-800 mb-2">Use Cases:</h4>
              <ul className="space-y-1">
                {application.use_cases.slice(0, 3).map((useCase, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-2 h-2 bg-cyan-600 rounded-full mt-2 mr-3 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{useCase}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Benefits */}
          {application.benefits && application.benefits.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-2">Benefits:</h4>
              <ul className="space-y-1">
                {application.benefits.slice(0, 2).map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </AnimatedElement>
  );
};

export default DatabaseApplicationCard;