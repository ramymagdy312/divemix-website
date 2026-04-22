"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  Home,
  Loader2,
} from "lucide-react";
import type { FolderInfo } from "./types";

interface TreeNode {
  key: string; // "root" or fullPath
  name: string;
  fullPath: string; // "" for root, otherwise e.g. "products/lw"
  isRoot: boolean;
  children?: TreeNode[];
  loading?: boolean;
  loaded?: boolean;
}

interface FolderTreeProps {
  currentPath: string; // "root" or fullPath
  onNavigate: (path: string) => void;
  /** Called when an image is dropped onto a folder so the parent can trigger a move */
  onDropOnFolder?: (targetFolder: string) => void;
  /** Bump to force a reload of the tree */
  refreshToken?: number;
}

async function fetchChildren(parent: string): Promise<FolderInfo[]> {
  const url =
    parent && parent !== "root"
      ? `/api/upload/folders?path=${encodeURIComponent(parent)}`
      : "/api/upload/folders";
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  return data.folders || [];
}

const FolderTree: React.FC<FolderTreeProps> = ({
  currentPath,
  onNavigate,
  onDropOnFolder,
  refreshToken = 0,
}) => {
  const [root, setRoot] = useState<TreeNode>(() => ({
    key: "root",
    name: "Home",
    fullPath: "",
    isRoot: true,
    children: [],
    loaded: false,
  }));
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(["root"]));
  const [hoverDrop, setHoverDrop] = useState<string | null>(null);

  const loadChildren = useCallback(
    async (node: TreeNode): Promise<TreeNode[]> => {
      const folders = await fetchChildren(node.isRoot ? "root" : node.fullPath);
      return folders.map<TreeNode>((f) => ({
        key: f.fullPath,
        name: f.name,
        fullPath: f.fullPath,
        isRoot: false,
        children: [],
        loaded: false,
      }));
    },
    []
  );

  // Load root on mount / refresh
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setRoot((r) => ({ ...r, loading: true }));
      const children = await loadChildren({
        key: "root",
        name: "Home",
        fullPath: "",
        isRoot: true,
      });
      if (cancelled) return;
      setRoot({
        key: "root",
        name: "Home",
        fullPath: "",
        isRoot: true,
        children,
        loading: false,
        loaded: true,
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [loadChildren, refreshToken]);

  const toggleExpand = useCallback(
    async (node: TreeNode) => {
      const newExpanded = new Set(expanded);
      const key = node.key;
      if (newExpanded.has(key)) {
        newExpanded.delete(key);
        setExpanded(newExpanded);
        return;
      }
      newExpanded.add(key);
      setExpanded(newExpanded);

      if (!node.loaded && !node.loading) {
        // Lazy-load children
        setRoot((prev) => updateNode(prev, key, (n) => ({ ...n, loading: true })));
        const children = await loadChildren(node);
        setRoot((prev) =>
          updateNode(prev, key, (n) => ({
            ...n,
            children,
            loading: false,
            loaded: true,
          }))
        );
      }
    },
    [expanded, loadChildren]
  );

  return (
    <div className="flex-1 overflow-y-auto py-2 text-sm">
      <TreeRow
        node={root}
        depth={0}
        expanded={expanded}
        currentPath={currentPath}
        onToggle={toggleExpand}
        onNavigate={onNavigate}
        hoverDrop={hoverDrop}
        setHoverDrop={setHoverDrop}
        onDropOnFolder={onDropOnFolder}
      />
    </div>
  );
};

interface TreeRowProps {
  node: TreeNode;
  depth: number;
  expanded: Set<string>;
  currentPath: string;
  onToggle: (node: TreeNode) => void;
  onNavigate: (path: string) => void;
  hoverDrop: string | null;
  setHoverDrop: (v: string | null) => void;
  onDropOnFolder?: (targetFolder: string) => void;
}

const TreeRow: React.FC<TreeRowProps> = ({
  node,
  depth,
  expanded,
  currentPath,
  onToggle,
  onNavigate,
  hoverDrop,
  setHoverDrop,
  onDropOnFolder,
}) => {
  const isOpen = expanded.has(node.key);
  const isActive = node.isRoot
    ? currentPath === "root" || currentPath === ""
    : currentPath === node.fullPath;
  const canHaveChildren = true; // we don't know until loaded; show chevron
  const dropTarget = node.isRoot ? "root" : node.fullPath;
  const isDropHover = hoverDrop === node.key;

  return (
    <div>
      <div
        className={`group flex items-center gap-1 px-2 py-1 rounded-md cursor-pointer select-none
          ${isActive ? "bg-cyan-50 text-cyan-700" : "hover:bg-gray-100 text-gray-800"}
          ${isDropHover ? "ring-2 ring-cyan-400 bg-cyan-50" : ""}`}
        style={{ paddingLeft: depth * 12 + 8 }}
        onClick={() => onNavigate(node.isRoot ? "root" : node.fullPath)}
        onDragOver={(e) => {
          if (!onDropOnFolder) return;
          e.preventDefault();
          e.dataTransfer.dropEffect = "move";
          if (hoverDrop !== node.key) setHoverDrop(node.key);
        }}
        onDragLeave={() => {
          if (hoverDrop === node.key) setHoverDrop(null);
        }}
        onDrop={(e) => {
          if (!onDropOnFolder) return;
          e.preventDefault();
          setHoverDrop(null);
          onDropOnFolder(dropTarget);
        }}
      >
        {canHaveChildren ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggle(node);
            }}
            className="p-0.5 rounded hover:bg-gray-200 text-gray-500"
            aria-label={isOpen ? "Collapse" : "Expand"}
          >
            {node.loading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : isOpen ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
          </button>
        ) : (
          <span className="w-4" />
        )}

        {node.isRoot ? (
          <Home className="h-4 w-4 text-cyan-600 shrink-0" />
        ) : isOpen ? (
          <FolderOpen className="h-4 w-4 text-amber-500 shrink-0" />
        ) : (
          <Folder className="h-4 w-4 text-amber-500 shrink-0" />
        )}

        <span className="truncate">{node.name}</span>
      </div>

      {isOpen && node.children && node.children.length > 0 && (
        <div>
          {node.children.map((child) => (
            <TreeRow
              key={child.key}
              node={child}
              depth={depth + 1}
              expanded={expanded}
              currentPath={currentPath}
              onToggle={onToggle}
              onNavigate={onNavigate}
              hoverDrop={hoverDrop}
              setHoverDrop={setHoverDrop}
              onDropOnFolder={onDropOnFolder}
            />
          ))}
        </div>
      )}
      {isOpen && node.loaded && node.children && node.children.length === 0 && !node.isRoot && (
        <div
          className="text-xs text-gray-400 italic px-2 py-1"
          style={{ paddingLeft: (depth + 1) * 12 + 24 }}
        >
          Empty
        </div>
      )}
    </div>
  );
};

function updateNode(
  node: TreeNode,
  key: string,
  updater: (n: TreeNode) => TreeNode
): TreeNode {
  if (node.key === key) return updater(node);
  if (!node.children) return node;
  return {
    ...node,
    children: node.children.map((c) => updateNode(c, key, updater)),
  };
}

export default FolderTree;
