"use client";

import React from "react";

import AnimatedElement from "../common/AnimatedElement";
import Image from 'next/image';

interface Application {
  id: string;
  name: string;
  desc: string;
  images: string[];
  features: string[];
}

interface ApplicationCardProps {
  application: Application;
  index?: number;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ application, index = 0 }) => {
  return (
    <AnimatedElement animation="slideUp" delay={index * 0.1}>
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
        <div className="aspect-[16/9] relative overflow-hidden bg-gray-50">
          <Image
            src={application.images[0]}
            alt={application.name}
            fill
            className="object-cover transform transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold mb-3">{application.name}</h3>
          <p className="text-gray-600 leading-relaxed">{application.desc}</p>
          {application.features.length > 0 && (
            <ul className="mt-4 space-y-2">
              {application.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-2 h-2 bg-cyan-600 rounded-full mt-2 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AnimatedElement>
  );
};

export default ApplicationCard;