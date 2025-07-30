import React from 'react';
import { Target, Lightbulb } from 'lucide-react';

const MissionVision = () => {
  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-cyan-100 mb-6">
              <Target className="h-6 w-6 text-cyan-600" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
            <p className="text-gray-600 leading-relaxed">
              To provide industry-leading compressed air and gas solutions through innovation, 
              expertise, and unwavering commitment to quality. We strive to exceed customer 
              expectations while maintaining the highest standards of safety and reliability.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-cyan-100 mb-6">
              <Lightbulb className="h-6 w-6 text-cyan-600" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
            <p className="text-gray-600 leading-relaxed">
              To be the global leader in gas mixing technology, recognized for our innovation, 
              reliability, and commitment to sustainability. We aim to shape the future of 
              industrial gas solutions while maintaining our dedication to German engineering excellence.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionVision;