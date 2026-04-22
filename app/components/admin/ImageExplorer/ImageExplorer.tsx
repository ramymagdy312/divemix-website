"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";
import {
  ArrowDownAZ,
  ArrowUpAZ,
  Calendar,
  CheckCircle2,
  CheckSquare,
  ChevronRight,
  Copy,
  Filter,
  Folder,
  FolderOpen,
  FolderPlus,
  Grid3x3,
  Home,
  Image as ImageIcon,
  LayoutList,
  Loader2,
  MoveRight,
  PanelLeftClose,
  PanelLeftOpen,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Square,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import FolderTree from "./FolderTree";
import PreviewDialog from "./PreviewDialog";
import MoveDialog from "./MoveDialog";
import {
  extOf,
  formatBytes,
  formatDate,
  KNOWN_EXTENSIONS,
  withinRange,
  type DateRange,
  type FolderInfo,
  type ImageExplorerProps,
  type ImageInfo,
  type SortKey,
  type ViewMode,
} from "./types";

const PAGE_SIZE = 60;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ImageExplorer: React.FC<ImageExplorerProps> = ({
  mode = "multiple",
  selected = [],
  onSelectionChange,
  maxImages = 10,
  label = "Images",
  initialFolder = "root",
  defaultView = "grid",
  hideTreeByDefault = false,
  compact = false,
}) => {
  // ------------ Navigation / data ------------
  const [currentPath, setCurrentPath] = useState<string>(initialFolder || "root");
  const [pathStack, setPathStack] = useState<string[]>([initialFolder || "root"]);
  const [folders, setFolders] = useState<FolderInfo[]>([]);
  const [images, setImages] = useState<ImageInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [refreshToken, setRefreshToken] = useState(0);

  // ------------ UI state ------------
  const [view, setView] = useState<ViewMode>(defaultView);
  const [showTree, setShowTree] = useState(!hideTreeByDefault);
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState<DateRange>("all");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  // ------------ Selection (local, for bulk ops) ------------
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const lastSelectedIdxRef = useRef<number | null>(null);

  // ------------ New-folder form ------------
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  // ------------ Preview ------------
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  // ------------ Move dialog ------------
  const [moveDialogFor, setMoveDialogFor] = useState<string[] | null>(null);

  // ------------ Drag & drop ------------
  const [isDraggingExternal, setIsDraggingExternal] = useState(false);
  const [draggingUrls, setDraggingUrls] = useState<string[] | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const isPicker = mode !== "none";

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim().toLowerCase()), 180);
    return () => clearTimeout(t);
  }, [search]);

  // Reset page on filter changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, typeFilter, dateFilter, sortKey, sortDir, currentPath]);

  // Clear checked selection when folder changes
  useEffect(() => {
    setChecked(new Set());
    lastSelectedIdxRef.current = null;
  }, [currentPath]);

  // ------------ Data loading ------------
  const loadCurrentPath = useCallback(
    async (path: string = currentPath, opts: { silent?: boolean } = {}) => {
      if (!opts.silent) setLoading(true);
      try {
        const foldersUrl =
          path === "root"
            ? "/api/upload/folders"
            : `/api/upload/folders?path=${encodeURIComponent(path)}`;
        const imagesUrl =
          path === "root"
            ? "/api/upload/list"
            : `/api/upload/list?folder=${encodeURIComponent(path)}`;

        const [fRes, iRes] = await Promise.all([fetch(foldersUrl), fetch(imagesUrl)]);
        const fData = fRes.ok ? await fRes.json() : { folders: [] };
        const iData = iRes.ok ? await iRes.json() : { images: [] };

        setFolders(fData.folders || []);
        setImages(iData.images || []);
      } catch (e) {
        console.error("ImageExplorer load failed:", e);
        toast.error("Failed to load folder contents");
      } finally {
        if (!opts.silent) setLoading(false);
      }
    },
    [currentPath]
  );

  useEffect(() => {
    loadCurrentPath(currentPath);
  }, [currentPath, loadCurrentPath]);

  const refreshAll = useCallback(() => {
    loadCurrentPath(currentPath);
    setRefreshToken((n) => n + 1);
  }, [currentPath, loadCurrentPath]);

  // ------------ Navigation helpers ------------
  const navigateTo = useCallback((target: string) => {
    const next = target || "root";
    setCurrentPath(next);
    setPathStack((s) => {
      // If target is in current stack, slice back to it; otherwise push
      const idx = s.indexOf(next);
      if (idx >= 0) return s.slice(0, idx + 1);
      return [...s, next];
    });
  }, []);

  const navigateUp = useCallback(() => {
    if (currentPath === "root") return;
    const parts = currentPath.split("/");
    parts.pop();
    const parent = parts.length === 0 ? "root" : parts.join("/");
    navigateTo(parent);
  }, [currentPath, navigateTo]);

  const breadcrumbs = useMemo(() => {
    if (currentPath === "root") return [{ name: "Home", path: "root" }];
    const parts = currentPath.split("/");
    const crumbs: { name: string; path: string }[] = [{ name: "Home", path: "root" }];
    let acc = "";
    for (const p of parts) {
      acc = acc ? `${acc}/${p}` : p;
      crumbs.push({ name: p, path: acc });
    }
    return crumbs;
  }, [currentPath]);

  // ------------ Filter + sort ------------
  const typeOptionsInFolder = useMemo(() => {
    const s = new Set<string>();
    for (const img of images) {
      const e = extOf(img.filename);
      if (e) s.add(e === "jpeg" ? "jpg" : e);
    }
    return Array.from(s).sort();
  }, [images]);

  const filteredImages = useMemo(() => {
    let list = images;
    if (debouncedSearch) {
      list = list.filter((i) => i.filename.toLowerCase().includes(debouncedSearch));
    }
    if (typeFilter.length > 0) {
      list = list.filter((i) => {
        let e = extOf(i.filename);
        if (e === "jpeg") e = "jpg";
        return typeFilter.includes(e);
      });
    }
    if (dateFilter !== "all") {
      list = list.filter((i) => withinRange(i.uploadedAt, dateFilter));
    }
    const sorted = [...list].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") cmp = a.filename.localeCompare(b.filename);
      else if (sortKey === "size") cmp = (a.size || 0) - (b.size || 0);
      else {
        const da = a.uploadedAt ? new Date(a.uploadedAt).getTime() : 0;
        const db = b.uploadedAt ? new Date(b.uploadedAt).getTime() : 0;
        cmp = da - db;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [images, debouncedSearch, typeFilter, dateFilter, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filteredImages.length / PAGE_SIZE));
  const clampedPage = Math.min(page, totalPages);
  const paginatedImages = useMemo(
    () => filteredImages.slice((clampedPage - 1) * PAGE_SIZE, clampedPage * PAGE_SIZE),
    [filteredImages, clampedPage]
  );

  const filteredFolders = useMemo(() => {
    if (!debouncedSearch) return folders;
    return folders.filter((f) => f.name.toLowerCase().includes(debouncedSearch));
  }, [folders, debouncedSearch]);

  const hasActiveFilters =
    typeFilter.length > 0 || dateFilter !== "all" || debouncedSearch.length > 0;

  // ------------ Selection helpers ------------
  const toggleChecked = useCallback(
    (url: string, idxInPage: number, e?: React.MouseEvent) => {
      const next = new Set(checked);
      const shift = e?.shiftKey;
      if (shift && lastSelectedIdxRef.current !== null) {
        const [a, b] = [lastSelectedIdxRef.current, idxInPage].sort((x, y) => x - y);
        for (let i = a; i <= b; i++) {
          const url = paginatedImages[i]?.url;
          if (url) next.add(url);
        }
      } else if (next.has(url)) {
        next.delete(url);
      } else {
        next.add(url);
      }
      lastSelectedIdxRef.current = idxInPage;
      setChecked(next);
    },
    [checked, paginatedImages]
  );

  const selectAllOnPage = useCallback(() => {
    const allOnPage = paginatedImages.map((i) => i.url);
    const allSelected = allOnPage.every((u) => checked.has(u));
    const next = new Set(checked);
    if (allSelected) {
      for (const u of allOnPage) next.delete(u);
    } else {
      for (const u of allOnPage) next.add(u);
    }
    setChecked(next);
  }, [checked, paginatedImages]);

  const clearChecked = useCallback(() => setChecked(new Set()), []);

  // ------------ Picker selection ------------
  const isPickerSelected = useCallback(
    (url: string) => selected.includes(url),
    [selected]
  );

  const togglePickerSelect = useCallback(
    (url: string) => {
      if (!onSelectionChange) return;
      if (mode === "single") {
        onSelectionChange([url]);
        return;
      }
      if (mode === "multiple") {
        if (selected.includes(url)) {
          onSelectionChange(selected.filter((s) => s !== url));
        } else {
          if (selected.length >= maxImages) {
            toast.error(`Maximum ${maxImages} images allowed`);
            return;
          }
          onSelectionChange([...selected, url]);
        }
      }
    },
    [mode, onSelectionChange, selected, maxImages]
  );

  // ------------ Folder CRUD ------------
  const createFolder = async () => {
    const name = newFolderName.trim();
    if (!name) {
      toast.error("Please enter a folder name");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/upload/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          folderName: name,
          parentPath: currentPath === "root" ? undefined : currentPath,
        }),
      });
      if (res.ok) {
        setNewFolderName("");
        setShowCreateForm(false);
        toast.success("Folder created");
        refreshAll();
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || "Failed to create folder");
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to create folder");
    } finally {
      setLoading(false);
    }
  };

  const deleteFolder = async (folder: FolderInfo) => {
    if (
      !confirm(
        `Delete folder "${folder.name}" and ALL its contents?\n\nThis cannot be undone.`
      )
    )
      return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/upload/folders?path=${encodeURIComponent(folder.fullPath)}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        toast.success(`Folder "${folder.name}" deleted`);
        refreshAll();
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || "Failed to delete folder");
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete folder");
    } finally {
      setLoading(false);
    }
  };

  // ------------ Image CRUD ------------
  const deleteImages = async (urls: string[]) => {
    if (urls.length === 0) return;
    const label =
      urls.length === 1 ? `image "${urls[0].split("/").pop()}"` : `${urls.length} images`;
    if (!confirm(`Delete ${label}?\n\nThis cannot be undone.`)) return;

    setLoading(true);
    let ok = 0;
    let fail = 0;
    for (const url of urls) {
      try {
        const res = await fetch("/api/upload/delete", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageUrl: url }),
        });
        if (res.ok) ok++;
        else fail++;
      } catch {
        fail++;
      }
    }

    // Deselect from picker selection too
    if (onSelectionChange && selected.some((u) => urls.includes(u))) {
      onSelectionChange(selected.filter((u) => !urls.includes(u)));
    }
    const next = new Set(checked);
    for (const u of urls) next.delete(u);
    setChecked(next);

    if (fail === 0) toast.success(`Deleted ${ok} image${ok === 1 ? "" : "s"}`);
    else toast.error(`Deleted ${ok}, failed ${fail}`);
    refreshAll();
    setLoading(false);
  };

  const moveImages = async (urls: string[], targetFolder: string) => {
    if (urls.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch("/api/upload/move", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromPaths: urls,
          toFolder: targetFolder === "root" ? "" : targetFolder,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        toast.success(`Moved ${data.moved} item${data.moved === 1 ? "" : "s"}`);
      } else {
        toast.error(
          `Moved ${data.moved || 0}, failed ${data.failed || urls.length}`
        );
      }

      // Remap picker selection to new URLs
      if (onSelectionChange && data.results) {
        const map = new Map<string, string>();
        for (const r of data.results || []) {
          if (r.success && r.url) {
            const origFromUrl = urls.find((u) => u.endsWith("/" + (r.from.split("/").pop() || "")));
            if (origFromUrl) map.set(origFromUrl, r.url);
          }
        }
        if (map.size > 0) {
          onSelectionChange(selected.map((u) => map.get(u) || u));
        }
      }

      clearChecked();
      setMoveDialogFor(null);
      refreshAll();
    } catch (e) {
      console.error(e);
      toast.error("Failed to move images");
    } finally {
      setLoading(false);
    }
  };

  // ------------ Upload ------------
  const handleFiles = useCallback(
    async (fileList: FileList | File[] | null) => {
      if (!fileList) return;
      const files = Array.from(fileList).filter(
        (f) => f.type.startsWith("image/") && f.size <= MAX_FILE_SIZE
      );
      if (files.length === 0) {
        toast.error("No valid image files (max 5MB each)");
        return;
      }

      setUploading(true);
      let ok = 0;
      let fail = 0;
      const uploadedUrls: string[] = [];
      for (const file of files) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("folder", currentPath);
        try {
          const res = await fetch("/api/upload", { method: "POST", body: fd });
          if (res.ok) {
            const data = await res.json();
            ok++;
            if (data.url) uploadedUrls.push(data.url);
          } else fail++;
        } catch {
          fail++;
        }
      }

      if (ok > 0) {
        toast.success(
          `Uploaded ${ok} image${ok === 1 ? "" : "s"}${fail ? ` (${fail} failed)` : ""}`
        );
      } else {
        toast.error("Upload failed");
      }

      // Auto-select freshly uploaded images in picker mode
      if (isPicker && onSelectionChange && uploadedUrls.length > 0) {
        if (mode === "single") {
          onSelectionChange([uploadedUrls[0]]);
        } else {
          const merged = [...selected];
          for (const u of uploadedUrls) {
            if (merged.length >= maxImages) break;
            if (!merged.includes(u)) merged.push(u);
          }
          onSelectionChange(merged);
        }
      }

      refreshAll();
      setUploading(false);
    },
    [currentPath, refreshAll, isPicker, onSelectionChange, mode, selected, maxImages]
  );

  // External drag-and-drop upload
  const dragDepthRef = useRef(0);
  const onDragEnter = (e: React.DragEvent) => {
    if (!e.dataTransfer.types.includes("Files")) return;
    e.preventDefault();
    dragDepthRef.current += 1;
    setIsDraggingExternal(true);
  };
  const onDragOver = (e: React.DragEvent) => {
    if (!e.dataTransfer.types.includes("Files")) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };
  const onDragLeave = () => {
    dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
    if (dragDepthRef.current === 0) setIsDraggingExternal(false);
  };
  const onDrop = (e: React.DragEvent) => {
    if (!e.dataTransfer.types.includes("Files")) return;
    e.preventDefault();
    dragDepthRef.current = 0;
    setIsDraggingExternal(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) handleFiles(files);
  };

  // Keyboard shortcuts scoped to the component
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      // Avoid interfering with inputs
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      if (previewIndex !== null) return; // preview has its own handlers
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a") {
        e.preventDefault();
        selectAllOnPage();
      } else if (e.key === "Delete" && checked.size > 0) {
        e.preventDefault();
        deleteImages(Array.from(checked));
      } else if (e.key === "Escape") {
        if (checked.size > 0) clearChecked();
      }
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked, previewIndex, paginatedImages]);

  // ------------ Render helpers ------------
  const allOnPageSelected =
    paginatedImages.length > 0 && paginatedImages.every((i) => checked.has(i.url));
  const someOnPageSelected =
    paginatedImages.some((i) => checked.has(i.url)) && !allOnPageSelected;

  const toggleType = (ext: string) => {
    setTypeFilter((prev) =>
      prev.includes(ext) ? prev.filter((e) => e !== ext) : [...prev, ext]
    );
  };

  const clearFilters = () => {
    setTypeFilter([]);
    setDateFilter("all");
    setSearch("");
  };

  return (
    <div
      ref={rootRef}
      tabIndex={0}
      className="relative bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm flex flex-col focus:outline-none"
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {/* Header */}
      {!compact && (
        <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-cyan-50 via-white to-blue-50">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-cyan-600" />
              {label} Explorer
            </h3>
            <div className="flex items-center gap-1">
              <IconBtn
                onClick={() => setShowTree((v) => !v)}
                title={showTree ? "Hide folder tree" : "Show folder tree"}
              >
                {showTree ? (
                  <PanelLeftClose className="h-4 w-4" />
                ) : (
                  <PanelLeftOpen className="h-4 w-4" />
                )}
              </IconBtn>
              <IconBtn
                onClick={refreshAll}
                title="Refresh"
                disabled={loading || uploading}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              </IconBtn>
            </div>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="px-3 py-2 border-b border-gray-200 bg-white/90 backdrop-blur flex flex-wrap items-center gap-2">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-md px-2 py-1 min-w-0 flex-1 max-w-full overflow-x-auto">
          {breadcrumbs.map((c, i) => (
            <React.Fragment key={c.path}>
              {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-gray-400 shrink-0" />}
              <button
                type="button"
                onClick={() => navigateTo(c.path)}
                className={`text-sm px-1.5 py-0.5 rounded hover:bg-white transition-colors whitespace-nowrap ${
                  i === breadcrumbs.length - 1
                    ? "text-cyan-700 font-medium"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {i === 0 ? (
                  <span className="inline-flex items-center gap-1">
                    <Home className="h-3.5 w-3.5" /> {c.name}
                  </span>
                ) : (
                  c.name
                )}
              </button>
            </React.Fragment>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="h-4 w-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search files and folders..."
            className="pl-8 pr-8 py-1.5 text-sm rounded-md border border-gray-300 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none w-56"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Filter toggle */}
        <button
          type="button"
          onClick={() => setShowFilters((v) => !v)}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-sm rounded-md border transition ${
            showFilters || hasActiveFilters
              ? "bg-cyan-50 text-cyan-700 border-cyan-300"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          }`}
          title="Filters"
        >
          <Filter className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <span className="ml-0.5 inline-flex items-center justify-center text-[10px] font-semibold bg-cyan-600 text-white rounded-full w-4 h-4">
              {(typeFilter.length > 0 ? 1 : 0) +
                (dateFilter !== "all" ? 1 : 0) +
                (debouncedSearch ? 1 : 0)}
            </span>
          )}
        </button>

        {/* Sort */}
        <div className="inline-flex items-center gap-1 text-sm">
          <SlidersHorizontal className="h-4 w-4 text-gray-500" />
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="py-1.5 pr-6 pl-2 text-sm rounded-md border border-gray-300 bg-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
          >
            <option value="date">Date</option>
            <option value="name">Name</option>
            <option value="size">Size</option>
          </select>
          <button
            type="button"
            onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
            className="p-1.5 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-gray-700"
            title={`Sort ${sortDir === "asc" ? "ascending" : "descending"}`}
          >
            {sortDir === "asc" ? (
              <ArrowUpAZ className="h-4 w-4" />
            ) : (
              <ArrowDownAZ className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* View toggle */}
        <div className="inline-flex rounded-md border border-gray-300 bg-white overflow-hidden">
          <button
            type="button"
            onClick={() => setView("grid")}
            className={`p-1.5 ${
              view === "grid"
                ? "bg-cyan-600 text-white"
                : "text-gray-700 hover:bg-gray-50"
            }`}
            title="Grid view"
          >
            <Grid3x3 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setView("list")}
            className={`p-1.5 ${
              view === "list"
                ? "bg-cyan-600 text-white"
                : "text-gray-700 hover:bg-gray-50"
            }`}
            title="List view"
          >
            <LayoutList className="h-4 w-4" />
          </button>
        </div>

        {/* Primary actions */}
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowCreateForm((v) => !v)}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-sm rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <FolderPlus className="h-4 w-4" />
            New Folder
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md bg-cyan-600 text-white hover:bg-cyan-700 disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {uploading ? "Uploading…" : "Upload"}
          </button>
        </div>
      </div>

      {/* Advanced filter panel */}
      {showFilters && (
        <div className="px-3 py-2 border-b bg-gray-50/70 flex flex-wrap items-center gap-3 text-sm">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-500 uppercase font-medium tracking-wide">
              Type
            </span>
            {KNOWN_EXTENSIONS.filter((e) =>
              typeOptionsInFolder.length === 0 ? true : typeOptionsInFolder.includes(e)
            ).map((ext) => (
              <button
                key={ext}
                type="button"
                onClick={() => toggleType(ext)}
                className={`px-2 py-0.5 text-xs rounded-full border ${
                  typeFilter.includes(ext)
                    ? "bg-cyan-600 text-white border-cyan-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                {ext.toUpperCase()}
              </button>
            ))}
          </div>

          <span className="h-5 w-px bg-gray-300" />

          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-gray-500" />
            <span className="text-xs text-gray-500 uppercase font-medium tracking-wide">
              Date
            </span>
            {(
              [
                { v: "all", l: "All" },
                { v: "today", l: "Today" },
                { v: "week", l: "7 days" },
                { v: "month", l: "30 days" },
                { v: "year", l: "Year" },
              ] as { v: DateRange; l: string }[]
            ).map((opt) => (
              <button
                key={opt.v}
                type="button"
                onClick={() => setDateFilter(opt.v)}
                className={`px-2 py-0.5 text-xs rounded-full border ${
                  dateFilter === opt.v
                    ? "bg-cyan-600 text-white border-cyan-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                {opt.l}
              </button>
            ))}
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="ml-auto text-xs text-gray-600 hover:text-gray-900 underline"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Create folder inline */}
      {showCreateForm && (
        <div className="px-3 py-2 border-b bg-blue-50/60 flex items-center gap-2">
          <FolderPlus className="h-4 w-4 text-cyan-600 shrink-0" />
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder={`New folder name in ${currentPath === "root" ? "Home" : currentPath}`}
            className="flex-1 px-3 py-1.5 text-sm rounded-md border border-gray-300 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter") createFolder();
              if (e.key === "Escape") {
                setShowCreateForm(false);
                setNewFolderName("");
              }
            }}
            autoFocus
          />
          <button
            type="button"
            onClick={createFolder}
            disabled={loading || !newFolderName.trim()}
            className="px-3 py-1.5 text-sm rounded-md bg-cyan-600 text-white hover:bg-cyan-700 disabled:opacity-50"
          >
            Create
          </button>
          <button
            type="button"
            onClick={() => {
              setShowCreateForm(false);
              setNewFolderName("");
            }}
            className="px-3 py-1.5 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Body: tree + content */}
      <div className="flex min-h-[420px]">
        {showTree && (
          <aside className="w-60 border-r border-gray-200 bg-gray-50/50 hidden md:flex md:flex-col">
            <div className="px-3 py-2 text-xs uppercase tracking-wide text-gray-500 font-semibold border-b">
              Folders
            </div>
            <FolderTree
              currentPath={currentPath}
              onNavigate={navigateTo}
              onDropOnFolder={(target) => {
                if (!draggingUrls || draggingUrls.length === 0) return;
                moveImages(draggingUrls, target);
                setDraggingUrls(null);
              }}
              refreshToken={refreshToken}
            />
          </aside>
        )}

        <main className="flex-1 flex flex-col min-w-0">
          {/* Selection / bulk action bar */}
          <div className="px-3 py-2 border-b bg-gray-50/70 flex items-center gap-3 text-sm flex-wrap">
            <button
              type="button"
              onClick={selectAllOnPage}
              className="inline-flex items-center gap-1.5 text-gray-700 hover:text-gray-900"
              title="Select all on this page"
            >
              {allOnPageSelected ? (
                <CheckSquare className="h-4 w-4 text-cyan-600" />
              ) : someOnPageSelected ? (
                <CheckSquare className="h-4 w-4 text-cyan-600/60" />
              ) : (
                <Square className="h-4 w-4 text-gray-400" />
              )}
              <span className="text-xs">
                {checked.size > 0 ? `${checked.size} selected` : "Select all"}
              </span>
            </button>

            <div className="text-xs text-gray-500">
              {filteredFolders.length} folder{filteredFolders.length === 1 ? "" : "s"} ·{" "}
              {filteredImages.length} image{filteredImages.length === 1 ? "" : "s"}
              {images.length !== filteredImages.length && (
                <span className="ml-1 text-gray-400">
                  (of {images.length})
                </span>
              )}
            </div>

            {checked.size > 0 && (
              <div className="ml-auto flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMoveDialogFor(Array.from(checked))}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-gray-700"
                >
                  <MoveRight className="h-3.5 w-3.5" /> Move
                </button>
                <button
                  type="button"
                  onClick={() => deleteImages(Array.from(checked))}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md bg-red-600 text-white hover:bg-red-700"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
                <button
                  type="button"
                  onClick={clearChecked}
                  className="inline-flex items-center gap-1.5 px-2 py-1 text-xs rounded-md text-gray-500 hover:text-gray-800"
                >
                  Clear
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-auto p-3">
            {loading && images.length === 0 && folders.length === 0 ? (
              <div className="flex items-center justify-center py-20 text-gray-500">
                <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading…
              </div>
            ) : (
              <>
                {/* Folders */}
                {filteredFolders.length > 0 && (
                  <section className="mb-5">
                    <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                      <Folder className="h-3.5 w-3.5 text-amber-500" /> Folders
                      <span className="text-gray-400 font-normal">
                        ({filteredFolders.length})
                      </span>
                    </h4>
                    <div
                      className={
                        view === "grid"
                          ? "grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
                          : "flex flex-col divide-y divide-gray-100 border border-gray-100 rounded-md overflow-hidden"
                      }
                    >
                      {filteredFolders.map((f) => (
                        <FolderCard
                          key={f.fullPath}
                          folder={f}
                          view={view}
                          onOpen={() => navigateTo(f.fullPath)}
                          onDelete={() => deleteFolder(f)}
                          onDropImages={(urls) => moveImages(urls, f.fullPath)}
                          draggingUrls={draggingUrls}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* Images */}
                {filteredImages.length > 0 ? (
                  <section>
                    <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                      <ImageIcon className="h-3.5 w-3.5 text-emerald-500" /> Images
                      <span className="text-gray-400 font-normal">
                        ({filteredImages.length})
                      </span>
                    </h4>
                    {view === "grid" ? (
                      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                        {paginatedImages.map((img, i) => (
                          <ImageCardGrid
                            key={img.url}
                            image={img}
                            checked={checked.has(img.url)}
                            onToggleCheck={(e) => toggleChecked(img.url, i, e)}
                            pickerSelected={isPicker && isPickerSelected(img.url)}
                            onPickerToggle={() =>
                              isPicker ? togglePickerSelect(img.url) : undefined
                            }
                            onPreview={() =>
                              setPreviewIndex((clampedPage - 1) * PAGE_SIZE + i)
                            }
                            onDelete={() => deleteImages([img.url])}
                            onMove={() => setMoveDialogFor([img.url])}
                            onCopyUrl={async () => {
                              try {
                                await navigator.clipboard.writeText(img.url);
                                toast.success("URL copied");
                              } catch {
                                toast.error("Copy failed");
                              }
                            }}
                            onDragStart={() => {
                              const urls =
                                checked.has(img.url) && checked.size > 1
                                  ? Array.from(checked)
                                  : [img.url];
                              setDraggingUrls(urls);
                            }}
                            onDragEnd={() => setDraggingUrls(null)}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="border border-gray-100 rounded-md overflow-hidden">
                        <div className="grid grid-cols-[44px_56px_1fr_120px_140px_160px_auto] gap-2 items-center px-3 py-2 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wide border-b">
                          <span />
                          <span />
                          <span>Name</span>
                          <span className="hidden md:block">Type</span>
                          <span className="hidden md:block">Size</span>
                          <span className="hidden lg:block">Uploaded</span>
                          <span />
                        </div>
                        <div className="divide-y divide-gray-100">
                          {paginatedImages.map((img, i) => (
                            <ImageRowList
                              key={img.url}
                              image={img}
                              checked={checked.has(img.url)}
                              onToggleCheck={(e) => toggleChecked(img.url, i, e)}
                              pickerSelected={isPicker && isPickerSelected(img.url)}
                              onPickerToggle={() =>
                                isPicker ? togglePickerSelect(img.url) : undefined
                              }
                              onPreview={() =>
                                setPreviewIndex((clampedPage - 1) * PAGE_SIZE + i)
                              }
                              onDelete={() => deleteImages([img.url])}
                              onMove={() => setMoveDialogFor([img.url])}
                              onDragStart={() => {
                                const urls =
                                  checked.has(img.url) && checked.size > 1
                                    ? Array.from(checked)
                                    : [img.url];
                                setDraggingUrls(urls);
                              }}
                              onDragEnd={() => setDraggingUrls(null)}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="mt-4 flex items-center justify-center gap-1 text-sm">
                        <button
                          type="button"
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          disabled={clampedPage <= 1}
                          className="px-2.5 py-1 rounded-md border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50"
                        >
                          Previous
                        </button>
                        <span className="px-3 text-gray-600">
                          Page {clampedPage} of {totalPages}
                        </span>
                        <button
                          type="button"
                          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                          disabled={clampedPage >= totalPages}
                          className="px-2.5 py-1 rounded-md border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </section>
                ) : filteredFolders.length === 0 ? (
                  <EmptyState hasFilters={hasActiveFilters} onClear={clearFilters} />
                ) : null}
              </>
            )}
          </div>

          {/* Picker summary footer */}
          {isPicker && selected.length > 0 && (
            <div className="border-t bg-emerald-50/60 px-3 py-2 flex items-center justify-between text-sm">
              <div className="inline-flex items-center gap-2 text-emerald-800">
                <CheckCircle2 className="h-4 w-4" />
                {mode === "single" ? (
                  <span className="truncate max-w-[60ch]">
                    Selected: {selected[0].split("/").pop()}
                  </span>
                ) : (
                  <span>
                    {selected.length} of {maxImages} image
                    {selected.length === 1 ? "" : "s"} selected
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => onSelectionChange?.([])}
                className="text-xs text-red-600 hover:text-red-800 underline"
              >
                Clear selection
              </button>
            </div>
          )}
        </main>
      </div>

      {/* External drop overlay */}
      {isDraggingExternal && (
        <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center bg-cyan-500/10 backdrop-blur-sm border-4 border-dashed border-cyan-500 rounded-xl">
          <div className="bg-white rounded-xl shadow-lg px-5 py-3 border border-cyan-200 text-cyan-800 font-medium inline-flex items-center gap-2">
            <Upload className="h-5 w-5" /> Drop images to upload to{" "}
            <b>{currentPath === "root" ? "Home" : currentPath}</b>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.currentTarget.value = "";
        }}
      />

      {/* Preview */}
      {previewIndex !== null && filteredImages[previewIndex] && (
        <PreviewDialog
          images={filteredImages}
          index={previewIndex}
          onIndexChange={setPreviewIndex}
          onClose={() => setPreviewIndex(null)}
          onDelete={async (img) => {
            await deleteImages([img.url]);
            setPreviewIndex(null);
          }}
        />
      )}

      {/* Move dialog */}
      {moveDialogFor && moveDialogFor.length > 0 && (
        <MoveDialog
          count={moveDialogFor.length}
          currentFolder={currentPath}
          onCancel={() => setMoveDialogFor(null)}
          onConfirm={async (target) => {
            await moveImages(moveDialogFor, target);
          }}
        />
      )}
    </div>
  );
};

// =============== Sub-components ===============

const IconBtn: React.FC<
  React.PropsWithChildren<{
    onClick: () => void;
    title: string;
    disabled?: boolean;
  }>
> = ({ onClick, title, disabled, children }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    disabled={disabled}
    className="p-1.5 rounded-md text-gray-600 hover:text-gray-900 hover:bg-white/80 disabled:opacity-50"
  >
    {children}
  </button>
);

const FolderCard: React.FC<{
  folder: FolderInfo;
  view: ViewMode;
  onOpen: () => void;
  onDelete: () => void;
  onDropImages: (urls: string[]) => void;
  draggingUrls: string[] | null;
}> = ({ folder, view, onOpen, onDelete, onDropImages, draggingUrls }) => {
  const [dragOver, setDragOver] = useState(false);

  const commonDrop = {
    onDragOver: (e: React.DragEvent) => {
      if (!draggingUrls) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      if (!dragOver) setDragOver(true);
    },
    onDragLeave: () => setDragOver(false),
    onDrop: (e: React.DragEvent) => {
      if (!draggingUrls) return;
      e.preventDefault();
      setDragOver(false);
      onDropImages(draggingUrls);
    },
  };

  if (view === "list") {
    return (
      <div
        {...commonDrop}
        className={`group flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer ${
          dragOver ? "bg-cyan-50 ring-1 ring-cyan-300" : ""
        }`}
        onClick={onOpen}
      >
        <Folder className="h-5 w-5 text-amber-500 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-900 truncate">{folder.name}</div>
          <div className="text-xs text-gray-500">
            {folder.source === "supabase" ? "Cloud" : "Local"}
          </div>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md text-red-600 hover:bg-red-50"
          aria-label="Delete folder"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      {...commonDrop}
      onClick={onOpen}
      className={`group relative rounded-lg border bg-white hover:border-cyan-300 hover:shadow-sm transition cursor-pointer p-3 ${
        dragOver ? "border-cyan-400 ring-2 ring-cyan-200 bg-cyan-50" : "border-gray-200"
      }`}
    >
      <div className="flex flex-col items-center text-center">
        <Folder className="h-10 w-10 text-amber-400" />
        <p className="mt-2 text-sm font-medium text-gray-900 truncate w-full">
          {folder.name}
        </p>
        <p className="text-[11px] text-gray-500">
          {folder.source === "supabase" ? "Cloud" : "Local"}
        </p>
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="absolute top-1.5 right-1.5 p-1.5 rounded-full bg-white border border-gray-200 text-red-600 opacity-0 group-hover:opacity-100 shadow-sm hover:bg-red-50"
        aria-label="Delete folder"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};

const ImageCardGrid: React.FC<{
  image: ImageInfo;
  checked: boolean;
  onToggleCheck: (e: React.MouseEvent) => void;
  pickerSelected: boolean;
  onPickerToggle?: () => void;
  onPreview: () => void;
  onDelete: () => void;
  onMove: () => void;
  onCopyUrl: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}> = ({
  image,
  checked,
  onToggleCheck,
  pickerSelected,
  onPickerToggle,
  onPreview,
  onDelete,
  onMove,
  onCopyUrl,
  onDragStart,
  onDragEnd,
}) => {
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", image.url);
        onDragStart();
      }}
      onDragEnd={onDragEnd}
      className={`group relative rounded-lg overflow-hidden border-2 bg-white transition ${
        pickerSelected
          ? "border-emerald-500 ring-2 ring-emerald-200"
          : checked
          ? "border-cyan-500 ring-2 ring-cyan-200"
          : "border-gray-200 hover:border-cyan-400"
      }`}
    >
      <div className="aspect-square relative bg-gray-100 cursor-pointer" onClick={onPreview}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.url}
          alt={image.filename}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
        {/* Top-left checkbox for bulk select */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleCheck(e);
          }}
          className={`absolute top-1.5 left-1.5 w-6 h-6 rounded-md flex items-center justify-center border transition ${
            checked
              ? "bg-cyan-600 border-cyan-600 text-white opacity-100"
              : "bg-white/90 border-gray-300 text-transparent opacity-0 group-hover:opacity-100"
          }`}
          aria-label="Select"
        >
          {checked ? <CheckSquare className="h-3.5 w-3.5" /> : <Square className="h-3.5 w-3.5" />}
        </button>

        {/* Picker select indicator */}
        {onPickerToggle && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPickerToggle();
            }}
            className={`absolute inset-0 flex items-center justify-center transition ${
              pickerSelected
                ? "bg-emerald-500/20"
                : "opacity-0 group-hover:opacity-100 bg-black/10"
            }`}
          >
            <span
              className={`rounded-full p-1 ${
                pickerSelected ? "bg-emerald-600 text-white" : "bg-white/90 text-gray-700"
              }`}
            >
              <CheckCircle2 className="h-5 w-5" />
            </span>
          </button>
        )}

        {/* Per-image quick actions */}
        <div className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCopyUrl();
            }}
            title="Copy URL"
            className="p-1.5 rounded-md bg-white/95 border border-gray-200 text-gray-700 hover:bg-white"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onMove();
            }}
            title="Move"
            className="p-1.5 rounded-md bg-white/95 border border-gray-200 text-gray-700 hover:bg-white"
          >
            <MoveRight className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            title="Delete"
            className="p-1.5 rounded-md bg-red-600 text-white hover:bg-red-700"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <div className="p-2">
        <p className="text-xs text-gray-900 font-medium truncate" title={image.filename}>
          {image.filename}
        </p>
        <p className="text-[11px] text-gray-500">{formatBytes(image.size)}</p>
      </div>
    </div>
  );
};

const ImageRowList: React.FC<{
  image: ImageInfo;
  checked: boolean;
  onToggleCheck: (e: React.MouseEvent) => void;
  pickerSelected: boolean;
  onPickerToggle?: () => void;
  onPreview: () => void;
  onDelete: () => void;
  onMove: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}> = ({
  image,
  checked,
  onToggleCheck,
  pickerSelected,
  onPickerToggle,
  onPreview,
  onDelete,
  onMove,
  onDragStart,
  onDragEnd,
}) => {
  const ext = extOf(image.filename).toUpperCase() || "—";
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", image.url);
        onDragStart();
      }}
      onDragEnd={onDragEnd}
      className={`grid grid-cols-[44px_56px_1fr_120px_140px_160px_auto] gap-2 items-center px-3 py-2 text-sm hover:bg-gray-50 ${
        pickerSelected ? "bg-emerald-50/60" : checked ? "bg-cyan-50/60" : ""
      }`}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleCheck(e);
        }}
        className="w-6 h-6 rounded-md flex items-center justify-center border border-gray-300 bg-white hover:bg-gray-100"
        aria-label="Select"
      >
        {checked ? (
          <CheckSquare className="h-3.5 w-3.5 text-cyan-600" />
        ) : (
          <Square className="h-3.5 w-3.5 text-gray-400" />
        )}
      </button>
      <button
        type="button"
        onClick={onPreview}
        className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden relative"
        aria-label="Preview"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.url}
          alt={image.filename}
          loading="lazy"
          className="w-full h-full object-cover"
        />
      </button>
      <div className="min-w-0 flex items-center gap-2">
        <button
          type="button"
          onClick={onPreview}
          className="font-medium text-gray-900 truncate text-left hover:text-cyan-700"
          title={image.filename}
        >
          {image.filename}
        </button>
        {onPickerToggle && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPickerToggle();
            }}
            className={`shrink-0 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[11px] border ${
              pickerSelected
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
            }`}
          >
            <CheckCircle2 className="h-3 w-3" />
            {pickerSelected ? "Selected" : "Select"}
          </button>
        )}
      </div>
      <span className="hidden md:block text-xs text-gray-600">{ext}</span>
      <span className="hidden md:block text-xs text-gray-600">{formatBytes(image.size)}</span>
      <span className="hidden lg:block text-xs text-gray-600">{formatDate(image.uploadedAt)}</span>
      <div className="flex items-center justify-end gap-1">
        <button
          type="button"
          onClick={onMove}
          className="p-1.5 rounded-md text-gray-600 hover:bg-gray-100"
          title="Move"
        >
          <MoveRight className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="p-1.5 rounded-md text-red-600 hover:bg-red-50"
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

const EmptyState: React.FC<{ hasFilters: boolean; onClear: () => void }> = ({
  hasFilters,
  onClear,
}) => (
  <div className="text-center py-16 text-gray-500">
    <FolderOpen className="h-12 w-12 mx-auto mb-3 text-gray-300" />
    {hasFilters ? (
      <>
        <p className="mb-2">No items match your filters</p>
        <button
          type="button"
          onClick={onClear}
          className="text-sm text-cyan-600 hover:text-cyan-700 underline"
        >
          Clear filters
        </button>
      </>
    ) : (
      <>
        <p className="mb-1 font-medium text-gray-700">This folder is empty</p>
        <p className="text-sm">Drag &amp; drop files to upload, or use the Upload button.</p>
      </>
    )}
  </div>
);

export default ImageExplorer;
