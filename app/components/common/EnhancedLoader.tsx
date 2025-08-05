"use client";

import React from 'react';

interface EnhancedLoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'dots' | 'pulse';
}

const EnhancedLoader: React.FC<EnhancedLoaderProps> = ({ 
  message = "Loading...", 
  size = 'md',
  variant = 'spinner'
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-16 w-16',
    lg: 'h-24 w-24'
  };

  const SpinnerLoader = () => (
    <div className="relative">
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-cyan-100 border-t-cyan-600 mx-auto`} />
      <div className={`absolute inset-0 ${sizeClasses[size]} rounded-full border-4 border-transparent border-r-cyan-300 animate-pulse mx-auto`} />
    </div>
  );

  const DotsLoader = () => (
    <div className="flex space-x-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-3 h-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );

  const PulseLoader = () => (
    <div className="relative">
      <div className={`${sizeClasses[size]} bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full animate-pulse mx-auto`} />
      <div className={`absolute inset-0 ${sizeClasses[size]} bg-cyan-400 rounded-full animate-ping opacity-75 mx-auto`} />
    </div>
  );

  const renderLoader = () => {
    switch (variant) {
      case 'dots':
        return <DotsLoader />;
      case 'pulse':
        return <PulseLoader />;
      default:
        return <SpinnerLoader />;
    }
  };

  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center space-y-4">
        {renderLoader()}
        <p className="text-gray-600 font-medium animate-pulse">{message}</p>
        <div className="flex justify-center space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EnhancedLoader;