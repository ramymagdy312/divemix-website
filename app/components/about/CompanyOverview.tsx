import React from 'react';
import { Building2, Award, Users } from 'lucide-react';

const CompanyOverview = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
      <div className="flex items-center gap-4 mb-6">
        <Building2 className="h-8 w-8 text-cyan-600" />
        <h2 className="text-2xl font-bold">Company Overview</h2>
      </div>
      
      <div className="space-y-6">
        <p className="text-gray-600 leading-relaxed">
          DiveMix has grown to be a prominent, active figure, known for its reliable top-of-the-range 
          compressed air and gas products as well as plants.
        </p>

        <div className="flex items-start gap-3">
          <Award className="h-6 w-6 text-cyan-600 flex-shrink-0 mt-1" />
          <p className="text-gray-600 leading-relaxed">
            DiveMix is the sole agent, representative, distributor, and authorized service point for 
            carefully selected, high-quality products that carry the prestigious "Made in Germany" trademark.
          </p>
        </div>

        <div className="flex items-start gap-3">
          <Users className="h-6 w-6 text-cyan-600 flex-shrink-0 mt-1" />
          <p className="text-gray-600 leading-relaxed">
            We serve various market sectors such as oil and gas fields, food & beverage, pharmaceutical 
            companies, chemical and petrochemical industries, laser cutting, marine and offshore locations, 
            as well as the recreational diving tourism industry, to name just a few.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompanyOverview;