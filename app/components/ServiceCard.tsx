import React from "react";
import { LucideIcon } from "lucide-react";

interface ServiceCardProps {
  id: number;
  title: string;
  description: string;
  Icon: LucideIcon;
  features: string[];
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  id,
  title,
  description,
  Icon,
  features,
}) => {
  return (
    <div key={id} className="bg-white p-6 rounded-lg shadow-md relative">
      <div className="flex items-center mb-4">
        <Icon className="h-8 w-8 text-cyan-600 mr-3" />
        <h2 className="text-2xl font-semibold">{title}</h2>
      </div>
      <p className="text-gray-600 mb-4">{description}</p>
      <ul className="space-y-2">
        {features.map((feature) => (
          <li key={feature} className="flex items-center text-gray-700">
            <span className="w-2 h-2 bg-cyan-600 rounded-full mr-2"></span>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ServiceCard;
