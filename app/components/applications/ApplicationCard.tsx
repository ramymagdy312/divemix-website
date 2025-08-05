"use client";

import React from "react";

import AnimatedElement from "../common/AnimatedElement";
import Image from 'next/image';

interface Application {
  id: string;
  name: string;
  desc: string;
  images: string[];
  use_cases?: string[];
  benefits?: string[];
}

interface ApplicationCardProps {
  application: Application;
  index?: number;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ application, index = 0 }) => {
  return (
    <AnimatedElement animation="slideUp" delay={index * 0.1}>
      <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-cyan-200 relative">
        {/* Image Section */}
        <div className="aspect-[16/9] relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          <Image
            src={application.images[0]}
            alt={application.name}
            fill
            className="object-cover transform transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-4">
          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-cyan-700 transition-colors duration-300">
            {application.name}
          </h3>
          
          {/* Description */}
          <p className="text-gray-600 leading-relaxed line-clamp-3">
            {application.desc}
          </p>
          
          {/* Use Cases */}
          {application.use_cases && application.use_cases.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wide flex items-center">
                <svg className="w-4 h-4 mr-2 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Use Cases
              </h4>
              <ul className="space-y-2">
                {application.use_cases.slice(0, 3).map((useCase, caseIndex) => (
                  <li key={caseIndex} className="flex items-start group/item">
                    <div className="relative mt-1.5 mr-3">
                      <div className="w-2 h-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full group-hover/item:scale-125 transition-transform duration-200" />
                      <div className="absolute inset-0 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-0 group-hover/item:opacity-75" />
                    </div>
                    <span className="text-sm text-gray-700 leading-relaxed group-hover/item:text-gray-900 transition-colors duration-200">
                      {useCase}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Benefits */}
          {application.benefits && application.benefits.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wide flex items-center">
                <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Benefits
              </h4>
              <ul className="space-y-2">
                {application.benefits.slice(0, 2).map((benefit, benefitIndex) => (
                  <li key={benefitIndex} className="flex items-start group/item">
                    <div className="relative mt-1.5 mr-3">
                      <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full group-hover/item:scale-125 transition-transform duration-200" />
                      <div className="absolute inset-0 w-2 h-2 bg-green-400 rounded-full animate-ping opacity-0 group-hover/item:opacity-75" />
                    </div>
                    <span className="text-sm text-gray-700 leading-relaxed group-hover/item:text-gray-900 transition-colors duration-200">
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-cyan-100/30 to-transparent rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-700" />
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-blue-100/30 to-transparent rounded-full translate-y-8 -translate-x-8 group-hover:scale-150 transition-transform duration-700" />
      </div>
    </AnimatedElement>
  );
};

export default ApplicationCard;