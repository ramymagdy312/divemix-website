"use client";

import React from "react";
import ServiceCard from "./ServiceCard";
import { services } from "../../data/services";
import AnimatedElement from "../common/AnimatedElement";

const ServiceGrid: React.FC = () => {
  return (
    <AnimatedElement animation="fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((service, index) => (
          <ServiceCard
            key={service.id}
            title={service.title}
            description={service.description}
            Icon={service.icon}
            features={service.features}
            index={index}
          />
        ))}
      </div>
    </AnimatedElement>
  );
};

export default ServiceGrid;
