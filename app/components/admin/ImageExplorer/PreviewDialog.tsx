"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  Info,
  RotateCcw,
  Trash2,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import toast from "react-hot-toast";
import { formatBytes, formatDate, type ImageInfo } from "./types";

interface PreviewDialogProps {
  images: ImageInfo[];
  index: number;
  onIndexChange: (i: number) => void;
  onClose: () => void;
  onDelete?: (image: ImageInfo) => void;
}

const MIN_ZOOM = 0.25;
const MAX_ZOOM = 8;
const ZOOM_STEP = 1.25;

const PreviewDialog: React.FC<PreviewDialogProps> = ({
  images,
  index,
  onIndexChange,
  onClose,
  onDelete,
}) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [showInfo, setShowInfo] = useState(true);
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null);
  const startRef = useRef<{ x: number; y: number } | null>(null);

  const img = images[index];

  const resetView = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    resetView();
    setDims(null);
  }, [index, resetView]);

  const go = useCallback(
    (delta: number) => {
      if (images.length === 0) return;
      const next = (index + delta + images.length) % images.length;
      onIndexChange(next);
    },
    [images.length, index, onIndexChange]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "+" || e.key === "=") setZoom((z) => clamp(z * ZOOM_STEP));
      else if (e.key === "-") setZoom((z) => clamp(z / ZOOM_STEP));
      else if (e.key === "0") resetView();
      else if ((e.key === "Delete" || e.key === "Backspace") && onDelete && img) {
        onDelete(img);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, onClose, resetView, onDelete, img]);

  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((z) => clamp(e.deltaY < 0 ? z * ZOOM_STEP : z / ZOOM_STEP));
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    setDragging(true);
    startRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging || !startRef.current) return;
    setPan({ x: e.clientX - startRef.current.x, y: e.clientY - startRef.current.y });
  };
  const onMouseUp = () => {
    setDragging(false);
    startRef.current = null;
  };

  const copyUrl = async () => {
    if (!img) return;
    try {
      await navigator.clipboard.writeText(img.url);
      toast.success("URL copied");
    } catch {
      toast.error("Failed to copy URL");
    }
  };

  const download = () => {
    if (!img) return;
    const a = document.createElement("a");
    a.href = img.url;
    a.download = img.filename;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (!img) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-stretch bg-black/90 text-white"
      onClick={onClose}
    >
      {/* Toolbar */}
      <div
        className="absolute top-0 left-0 right-0 h-14 z-10 flex items-center justify-between px-4 bg-gradient-to-b from-black/70 to-transparent"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm font-medium truncate max-w-[40vw]">{img.filename}</span>
          <span className="text-xs text-white/70">
            {index + 1} / {images.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <IconBtn onClick={() => setZoom((z) => clamp(z / ZOOM_STEP))} title="Zoom out (-)">
            <ZoomOut className="h-4 w-4" />
          </IconBtn>
          <span className="text-xs tabular-nums w-12 text-center">{Math.round(zoom * 100)}%</span>
          <IconBtn onClick={() => setZoom((z) => clamp(z * ZOOM_STEP))} title="Zoom in (+)">
            <ZoomIn className="h-4 w-4" />
          </IconBtn>
          <IconBtn onClick={resetView} title="Reset (0)">
            <RotateCcw className="h-4 w-4" />
          </IconBtn>
          <span className="w-px h-5 bg-white/30 mx-1" />
          <IconBtn onClick={copyUrl} title="Copy URL">
            <Copy className="h-4 w-4" />
          </IconBtn>
          <IconBtn onClick={download} title="Download">
            <Download className="h-4 w-4" />
          </IconBtn>
          <IconBtn onClick={() => setShowInfo((v) => !v)} title="Toggle info panel">
            <Info className="h-4 w-4" />
          </IconBtn>
          {onDelete && (
            <IconBtn
              onClick={() => onDelete(img)}
              title="Delete"
              className="hover:bg-red-600/70"
            >
              <Trash2 className="h-4 w-4" />
            </IconBtn>
          )}
          <span className="w-px h-5 bg-white/30 mx-1" />
          <IconBtn onClick={onClose} title="Close (Esc)">
            <X className="h-5 w-5" />
          </IconBtn>
        </div>
      </div>

      {/* Prev */}
      {images.length > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            go(-1);
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur z-10"
          aria-label="Previous"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}

      {/* Viewport */}
      <div
        className="flex-1 flex items-center justify-center overflow-hidden select-none"
        onClick={(e) => e.stopPropagation()}
        onWheel={onWheel}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        style={{ cursor: zoom > 1 ? (dragging ? "grabbing" : "grab") : "default" }}
      >
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "center center",
            transition: dragging ? "none" : "transform 120ms ease-out",
          }}
        >
          {/* Use plain img to avoid next/image layout constraints inside a zoomable viewport */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img.url}
            alt={img.filename}
            className="max-h-[85vh] max-w-[85vw] object-contain pointer-events-none"
            onLoad={(e) => {
              const t = e.currentTarget;
              setDims({ w: t.naturalWidth, h: t.naturalHeight });
            }}
            draggable={false}
          />
        </div>
      </div>

      {/* Next */}
      {images.length > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            go(1);
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur z-10"
          aria-label="Next"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}

      {/* Info panel */}
      {showInfo && (
        <aside
          className="w-72 shrink-0 border-l border-white/10 bg-black/60 p-4 text-sm space-y-3 overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-xs uppercase tracking-wide text-white/60">Details</h3>
          <MetaRow label="Name" value={img.filename} mono />
          <MetaRow label="Folder" value={img.folder === "root" ? "Home" : img.folder} />
          <MetaRow
            label="Dimensions"
            value={dims ? `${dims.w} × ${dims.h}` : "…"}
          />
          <MetaRow label="Size" value={formatBytes(img.size)} />
          <MetaRow label="Uploaded" value={formatDate(img.uploadedAt)} />
          <MetaRow label="Source" value={img.source === "supabase" ? "Cloud" : "Local"} />
          <div className="pt-2">
            <div className="text-xs text-white/60 mb-1">URL</div>
            <div className="text-[11px] break-all bg-white/5 p-2 rounded font-mono">
              {img.url}
            </div>
          </div>
        </aside>
      )}
    </div>
  );
};

const IconBtn: React.FC<
  React.PropsWithChildren<{
    onClick: () => void;
    title: string;
    className?: string;
  }>
> = ({ onClick, title, className = "", children }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`p-2 rounded hover:bg-white/20 transition ${className}`}
  >
    {children}
  </button>
);

const MetaRow: React.FC<{ label: string; value: string; mono?: boolean }> = ({
  label,
  value,
  mono,
}) => (
  <div>
    <div className="text-xs text-white/60">{label}</div>
    <div className={`${mono ? "font-mono text-[12px]" : ""} break-words`}>{value}</div>
  </div>
);

function clamp(z: number) {
  return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, z));
}

export default PreviewDialog;
