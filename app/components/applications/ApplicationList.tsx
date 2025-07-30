import React from "react";
import type { Application } from "../../data/applications";
import ApplicationDetail from "./ApplicationDetail";

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