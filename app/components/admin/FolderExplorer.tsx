"use client";

// Backward-compatible shim. The real implementation lives in
// ./ImageExplorer. Keeping this file preserves the existing import path
// used across the admin forms.

import React, { useState } from "react";
import { ImagePlus, X } from "lucide-react";
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
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between rounded-md border p-3 bg-muted/30">
        <div className="text-sm text-muted-foreground">
          {images.length > 0
            ? `${images.length} image${images.length === 1 ? "" : "s"} selected`
            : "No images selected"}
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-md bg-cyan-600 px-3 py-2 text-sm font-medium text-white hover:bg-cyan-700"
        >
          <ImagePlus className="h-4 w-4" />
          Open {label} Explorer
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-[120] bg-black/50 p-4 md:p-8 overflow-y-auto">
          <div className="mx-auto h-full max-h-[calc(100vh-2rem)] md:max-h-[calc(100vh-4rem)] max-w-7xl rounded-xl bg-background shadow-xl border overflow-hidden flex flex-col">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h3 className="text-sm font-semibold">Select {label}</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md p-1.5 hover:bg-muted"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              <ImageExplorer
                mode={multiple ? "multiple" : "single"}
                selected={images}
                onSelectionChange={onImagesChange}
                maxImages={maxImages}
                label={label}
                compact
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FolderExplorer;
