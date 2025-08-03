import React from "react";

import ApplicationDetail from "./ApplicationDetail";

interface Application {
  id: string;
  name: string;
  desc: string;
  images: string[];
  features: string[];
}

interface ApplicationListProps {
  applications: Application[];
}

const ApplicationList: React.FC<ApplicationListProps> = ({ applications }) => {
  return (
    <div className="space-y-8">
      {applications.map((application) => (
        <ApplicationDetail key={application.id} application={application} />
      ))}
    </div>
  );
};

export default ApplicationList;