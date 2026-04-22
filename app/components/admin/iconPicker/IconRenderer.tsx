"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cn } from "@/app/lib/utils";
import { getIconByName, isValidIconName } from "@/app/lib/iconLibrary";

interface IconRendererProps {
  iconName: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  fallback?: React.ReactNode;
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
  xl: "w-8 h-8",
};

const IconRenderer: React.FC<IconRendererProps> = ({
  iconName,
  className,
  size = "md",
  fallback = null,
}) => {
  if (!iconName || !isValidIconName(iconName)) return <>{fallback}</>;
  const iconDef = getIconByName(iconName);
  if (!iconDef) return <>{fallback}</>;

  return <FontAwesomeIcon icon={iconDef} className={cn(sizeClasses[size], className)} />;
};

export default IconRenderer;
