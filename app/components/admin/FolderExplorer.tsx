"use client";

// Backward-compatible shim. The real implementation lives in
// ./ImageExplorer. Keeping this file preserves the existing import path
// used across the admin forms.

import React from "react";
import ImageExplorer from "./ImageExplorer";

interface FolderExplorerProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  multiple?: boolean;
  maxImages?: number;
  label?: string;
}

const FolderExplorer: React.FC<FolderExplorerProps> = ({
  images,
  onImagesChange,
  multiple = true,
  maxImages = 10,
  label = "Images",
}) => {
  return (
    <ImageExplorer
      mode={multiple ? "multiple" : "single"}
      selected={images}
      onSelectionChange={onImagesChange}
      maxImages={maxImages}
      label={label}
    />
  );
};

export default FolderExplorer;
