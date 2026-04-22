export interface FolderInfo {
  name: string;
  path: string;
  fullPath: string;
  parentPath: string;
  source: string;
  createdAt: string;
  isNested: boolean;
}

export interface ImageInfo {
  url: string;
  filename: string;
  size: number;
  uploadedAt: string;
  source: string;
  folder: string;
  path: string;
}

export type ViewMode = 'grid' | 'list';

export type SortKey = 'name' | 'date' | 'size';
export type SortDir = 'asc' | 'desc';

export type DateRange = 'all' | 'today' | 'week' | 'month' | 'year';

export interface Filters {
  search: string;
  types: string[]; // lowercase extensions, e.g. ['jpg','png']
  dateRange: DateRange;
}

export interface SortState {
  key: SortKey;
  dir: SortDir;
}

export type PickerMode = 'none' | 'single' | 'multiple';

export interface ImageExplorerProps {
  /** Picker mode: 'multiple' for multi-select, 'single' for single-select, 'none' for manage-only */
  mode?: PickerMode;
  /** Currently selected image URLs (for controlled picker use) */
  selected?: string[];
  /** Called whenever the selection changes (picker modes) */
  onSelectionChange?: (selected: string[]) => void;
  /** Optional maximum selectable images (multi mode) */
  maxImages?: number;
  /** Display label shown in the header */
  label?: string;
  /** Start in a specific folder path (e.g. "products/lw"), or "root" */
  initialFolder?: string;
  /** Default view mode */
  defaultView?: ViewMode;
  /** Hide the folder tree sidebar by default (user can still toggle it on) */
  hideTreeByDefault?: boolean;
  /** Compact header (hides the label row) */
  compact?: boolean;
}

export const KNOWN_EXTENSIONS = [
  'jpg',
  'jpeg',
  'png',
  'gif',
  'webp',
  'svg',
  'bmp',
  'tiff',
] as const;

export function extOf(filename: string): string {
  const idx = filename.lastIndexOf('.');
  if (idx < 0) return '';
  return filename.slice(idx + 1).toLowerCase();
}

export function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return '—';
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  let n = bytes;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  return `${n.toFixed(n >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
}

export function formatDate(iso?: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString();
}

export function withinRange(iso: string | undefined, range: DateRange): boolean {
  if (range === 'all') return true;
  if (!iso) return false;
  const d = new Date(iso).getTime();
  if (Number.isNaN(d)) return false;
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  const delta = now - d;
  switch (range) {
    case 'today':
      return delta <= day;
    case 'week':
      return delta <= 7 * day;
    case 'month':
      return delta <= 30 * day;
    case 'year':
      return delta <= 365 * day;
  }
}
