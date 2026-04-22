"use client";

import React, { useEffect, useState } from "react";
import { X, Folder, Home, Loader2, MoveRight } from "lucide-react";
import FolderTree from "./FolderTree";

interface MoveDialogProps {
  count: number;
  currentFolder: string;
  onCancel: () => void;
  onConfirm: (targetFolder: string) => Promise<void> | void;
}

const MoveDialog: React.FC<MoveDialogProps> = ({
  count,
  currentFolder,
  onCancel,
  onConfirm,
}) => {
  const [target, setTarget] = useState<string>("root");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  const handleConfirm = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await onConfirm(target);
    } finally {
      setSubmitting(false);
    }
  };

  const normalizedCurrent = currentFolder === "" ? "root" : currentFolder;
  const sameFolder = target === normalizedCurrent;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 p-4"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between px-5 py-4 border-b">
          <div className="flex items-center gap-2">
            <MoveRight className="h-5 w-5 text-cyan-600" />
            <h3 className="font-semibold text-gray-900">
              Move {count} item{count === 1 ? "" : "s"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="px-5 py-3 border-b bg-gray-50 text-sm text-gray-600">
          Select a destination folder:
        </div>

        <div className="flex-1 overflow-y-auto px-2 min-h-[280px]">
          <FolderTree currentPath={target} onNavigate={(p) => setTarget(p)} />
        </div>

        <footer className="px-5 py-3 border-t flex items-center justify-between gap-3 bg-gray-50">
          <div className="text-xs text-gray-600 truncate">
            Destination:{" "}
            {target === "root" ? (
              <span className="inline-flex items-center gap-1 text-gray-800">
                <Home className="h-3.5 w-3.5" /> Home
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-gray-800">
                <Folder className="h-3.5 w-3.5" /> {target}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-1.5 text-sm rounded-md border border-gray-300 hover:bg-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={submitting || sameFolder}
              className="px-4 py-1.5 text-sm rounded-md bg-cyan-600 text-white hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
            >
              {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Move here
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default MoveDialog;
