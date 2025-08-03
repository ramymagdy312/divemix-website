import React from "react";

import ImageGallery from "../common/ImageGallery";

interface Application {
  id: string;
  name: string;
  desc: string;
  images: string[];
  features: string[];
}

interface ApplicationDetailProps {
  application: Application;
}

const ApplicationDetail: React.FC<ApplicationDetailProps> = ({ application }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-8 mb-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2 lg:w-2/5">
          <ImageGallery images={application.images} alt={application.name} />
        </div>

        <div className="flex-1">
          <h3 className="text-2xl font-bold mb-4">{application.name}</h3>
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            {application.desc}
          </p>
          {application.features.length > 0 && (
            <>
              <h4 className="font-semibold text-lg mb-3">Key Features:</h4>
              <ul className="space-y-2">
                {application.features.map((feature) => (
                  <li key={feature} className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-cyan-600 rounded-full mr-2"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetail;