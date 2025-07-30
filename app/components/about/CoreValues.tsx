import React from 'react';
import { Shield, Award, Focus, Users, CheckCircle } from 'lucide-react';

const values = [
  {
    icon: Shield,
    title: 'Expertise',
    description: 'Industry-leading knowledge and experience in gas mixing technology'
  },
  {
    icon: Award,
    title: 'Quality',
    description: 'Commitment to excellence with German engineering precision'
  },
  {
    icon: Focus,
    title: 'Innovation',
    description: 'Continuous advancement in technology and solutions'
  },
  {
    icon: Users,
    title: 'Service',
    description: 'Dedicated support and customer satisfaction'
  },
  {
    icon: CheckCircle,
    title: 'Compliance',
    description: 'Adherence to international safety standards'
  }
];

const CoreValues = () => {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Our Core Values</h2>
          <p className="mt-4 text-lg text-gray-600">
            The principles that guide our commitment to excellence
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {values.map((value) => (
            <div key={value.title} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-100 mb-4">
                <value.icon className="h-8 w-8 text-cyan-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoreValues;