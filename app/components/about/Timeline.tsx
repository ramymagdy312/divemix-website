"use client";

import React from 'react';

const Timeline = () => {
  const milestones = [
    {
      year: '2004',
      title: 'Company Establishment',
      description: 'Established as a German-Egyptian corporation specializing in high- and low-pressure compressors.'
    },
    {
      year: '2005',
      title: 'L&W Partnership',
      description: 'Appointed as the authorized dealer and sole agent for L&W high-pressure compressors.'
    },
    {
      year: '2006',
      title: 'Innovation in Diving',
      description: 'Developed our first Nitrox generator tailored for diving applications.'
    },
    {
      year: '2007',
      title: 'Strategic Partnerships',
      description: 'Became an authorized dealer for CS Instruments and BEKO filtration systems.'
    },
    {
      year: '2008',
      title: 'Testing Capabilities',
      description: 'Launched our in-house hydrostatic testing station.'
    },
    {
      year: '2009',
      title: 'Expansion & Growth',
      description: 'Opened our Cairo branch and expanded our product portfolio to include INMATEC nitrogen and oxygen generators.'
    },
    {
      year: '2014',
      title: 'New Headquarters',
      description: 'Moved into our new headquarters located in the industrial zone.'
    },
    {
      year: '2022',
      title: 'Facility Upgrade',
      description: 'Upgraded our hydrostatic testing station to accommodate oxygen cylinders over 20 liters.'
    },
    {
      year: '2024',
      title: 'Further Expansion',
      description: 'Acquired a new branch in Cairo to support continued growth.'
    }
  ];

  return (
    <div className="relative">
      <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gray-200"></div>
      <div className="space-y-12">
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