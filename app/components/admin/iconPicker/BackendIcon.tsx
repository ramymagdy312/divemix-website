"use client";

import React from "react";
import IconRenderer from "./IconRenderer";

type BackendIconProps = {
  iconName: string;
  className?: string;
};

const BackendIcon: React.FC<BackendIconProps> = ({ iconName, className }) => {
  return (
    <IconRenderer
      iconName={iconName}
      className={className ?? "w-7 h-7 text-white"}
      fallback={<div className={className ?? "w-5 h-5 bg-gray-300 rounded"} />}
    />
  );
};

export default BackendIcon;
