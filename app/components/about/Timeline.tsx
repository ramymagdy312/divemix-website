"use client";

import React from 'react';

interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

interface TimelineProps {
  timelineData?: TimelineItem[];
}

const Timeline = ({ timelineData }: TimelineProps) => {
  const milestones = timelineData || [];

  return (
    <div className="relative">
      <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gray-200"></div>
      <div className="space-y-12">
        {milestones.length === 0 && (
          <div className="text-center text-gray-500">No timeline entries configured yet.</div>
        )}
        {milestones.map((milestone, index) => (
          <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
            <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <span className="text-cyan-600 font-bold">{milestone.year}</span>
                <h3 className="text-xl font-semibold mt-1">{milestone.title}</h3>
                <p className="text-gray-600 mt-2">{milestone.description}</p>
              </div>
            </div>
            <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-cyan-600 border-4 border-white"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;