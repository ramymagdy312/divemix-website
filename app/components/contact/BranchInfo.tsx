import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

interface BranchProps {
  name: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  mapUrl: string;
}

const BranchInfo: React.FC<BranchProps> = ({ name, address, phone, email, hours, mapUrl }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-xl font-semibold mb-4">{name}</h3>
      <div className="space-y-3 mb-6">
        <div className="flex items-start">
          <MapPin className="h-5 w-5 text-cyan-600 mt-1 mr-3 flex-shrink-0" />
          <span>{address}</span>
        </div>
        <div className="flex items-center">
          <Phone className="h-5 w-5 text-cyan-600 mr-3" />
          <span>{phone}</span>
        </div>
        <div className="flex items-center">
          <Mail className="h-5 w-5 text-cyan-600 mr-3" />
          <span>{email}</span>
        </div>
        <div className="flex items-center">
          <Clock className="h-5 w-5 text-cyan-600 mr-3" />
          <span>{hours}</span>
        </div>
      </div>
      <div className="aspect-video rounded-lg overflow-hidden">
        <iframe
          src={mapUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
};

export default BranchInfo;