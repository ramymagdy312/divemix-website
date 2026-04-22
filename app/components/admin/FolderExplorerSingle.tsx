"use client";

// Backward-compatible shim. The real implementation lives in
// ./ImageExplorer. Keeping this file preserves the existing import path
// used across the admin forms (gallery, vendors, applications, etc.).

import React, { useCallback } from "react";
import ImageExplorer from "./ImageExplorer";

interface FolderExplorerSingleProps {
  image: string;
  onImageChange: (image: string) => void;
  label?: string;
}

const FolderExplorerSingle: React.FC<FolderExplorerSingleProps> = ({
  image,
  onImageChange,
  label = "Image",
}) => {
  const handleChange = useCallback(
    (next: string[]) => {
      onImageChange(next[0] || "");
    },
    [onImageChange]
  );

  return (
    <ImageExplorer
      mode="single"
      selected={image ? [image] : []}
      onSelectionChange={handleChange}
      label={label}
    />
  );
};

export default FolderExplorerSingle;
