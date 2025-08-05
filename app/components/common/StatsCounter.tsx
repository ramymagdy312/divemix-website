"use client";

import React, { useState, useEffect, useRef } from 'react';

interface StatsCounterProps {
  count: number;
  label: string;
  icon?: React.ReactNode;
  suffix?: string;
  duration?: number;
}

const StatsCounter: React.FC<StatsCounterProps> = ({ 
  count, 
  label, 
  icon, 
  suffix = '', 
  duration = 2000 
}) => {
  const [currentCount, setCurrentCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const startTime = Date.now();
    const startCount = 0;
    const endCount = count;

    const updateCount = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(startCount + (endCount - startCount) * easeOutQuart);
      
      setCurrentCount(current);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };

    requestAnimationFrame(updateCount);
  }, [isVisible, count, duration]);

  return (
    <div 
      ref={counterRef}
      className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 hover:border-cyan-200 transition-all duration-300 group hover:shadow-lg"
    >
      {icon && (
        <div className="flex justify-center mb-2">
          <div className="w-8 h-8 text-cyan-600 group-hover:text-cyan-700 transition-colors duration-300 group-hover:scale-110 transform transition-transform">
            {icon}
          </div>
        </div>
      )}
      <div className="text-2xl font-bold text-gray-900 group-hover:text-cyan-700 transition-colors duration-300">
        {currentCount.toLocaleString()}{suffix}
      </div>
      <div className="text-sm text-gray-600 font-medium">
        {label}
      </div>
    </div>
  );
};

export default StatsCounter;