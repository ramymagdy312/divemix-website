"use client";

import React from "react";
import ApplicationCard from "./ApplicationCard";
import type { Application } from "../../data/applications";
import AnimatedElement from "../common/AnimatedElement";

interface ApplicationGridProps {
  applications: Application[];
}

const ApplicationGrid: React.FC<ApplicationGridProps> = ({ applications }) => {
  return (
    <AnimatedElement animation="fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {applications.map((application, index) => (
          <ApplicationCard 
            key={application.id} 
            application={application}
            index={index}
          />
        ))}
      </div>
    </AnimatedElement>
  );
};

export default ApplicationGrid;