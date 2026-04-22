"use client";

import React, { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faArrowDown,
  faArrowLeft,
  faArrowRight,
  faArrowTrendUp,
  faArrowUp,
  faAward,
  faBell,
  faBolt,
  faBook,
  faBriefcase,
  faBuilding,
  faCamera,
  faChartLine,
  faCheck,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faChevronUp,
  faClock,
  faCode,
  faDatabase,
  faEnvelope,
  faEye,
  faFile,
  faFileLines,
  faFilter,
  faFireExtinguisher,
  faFolder,
  faGear,
  faGlobe,
  faHandshake,
  faHeart,
  faImage,
  faLink,
  faMagnifyingGlass,
  faMicrochip,
  faMobileScreen,
  faMoneyBill,
  faMusic,
  faPhone,
  faPlay,
  faRotate,
  faScrewdriverWrench,
  faSearch,
  faServer,
  faShareNodes,
  faShield,
  faSliders,
  faSquareCheck,
  faStar,
  faStop,
  faTag,
  faThumbsUp,
  faTrash,
  faTriangleExclamation,
  faUser,
  faUsers,
  faVideo,
  faWifi,
  faWrench,
} from "@fortawesome/free-solid-svg-icons";
import { faMessage } from "@fortawesome/free-regular-svg-icons";
import { faFacebook, faInstagram, faLinkedin, faXTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons";

type CategoryKey =
  | "All"
  | "General"
  | "Business"
  | "Arrows"
  | "Media"
  | "Tech"
  | "Files"
  | "Social"
  | "Alerts";

interface IconPickerModalProps {
  open: boolean;
  selectedIcon?: string;
  onClose: () => void;
  onSelect: (iconName: string) => void;
}

const CATEGORY_TABS: CategoryKey[] = [
  "All",
  "General",
  "Business",
  "Arrows",
  "Media",
  "Tech",
  "Files",
  "Social",
  "Alerts",
];

const categoryMatchers: Record<Exclude<CategoryKey, "All">, RegExp> = {
  General: /(award|star|heart|sparkles|globe|clock|check|target|thumbs|zap)/i,
  Business: /(briefcase|building|factory|package|handshake|chart|trending|wallet|badge)/i,
  Arrows: /(arrow|chevron|move|corner|redo|undo)/i,
  Media: /(image|camera|video|music|mic|play|pause|radio)/i,
  Tech: /(wrench|settings|cpu|monitor|code|database|server|wifi|smartphone)/i,
  Files: /(file|folder|archive|clipboard|book|notebook|receipt)/i,
  Social: /(users|user|message|mail|phone|share|send|at-sign)/i,
  Alerts: /(alert|alarm|bell|shield|siren|triangle|circle-alert)/i,
};

type PickerIconItem = { key: string; icon: IconDefinition };

const ICONS: PickerIconItem[] = [
  { key: "Award", icon: faAward },
  { key: "Star", icon: faStar },
  { key: "Heart", icon: faHeart },
  { key: "Globe", icon: faGlobe },
  { key: "Clock", icon: faClock },
  { key: "Check", icon: faCheck },
  { key: "SquareCheck", icon: faSquareCheck },
  { key: "ThumbsUp", icon: faThumbsUp },
  { key: "Zap", icon: faBolt },
  { key: "Eye", icon: faEye },
  { key: "Search", icon: faSearch },
  { key: "Filter", icon: faFilter },
  { key: "Tag", icon: faTag },
  { key: "Link", icon: faLink },
  { key: "Briefcase", icon: faBriefcase },
  { key: "Building", icon: faBuilding },
  { key: "Handshake", icon: faHandshake },
  { key: "ChartLine", icon: faChartLine },
  { key: "TrendingUp", icon: faArrowTrendUp },
  { key: "Wallet", icon: faMoneyBill },
  { key: "Users", icon: faUsers },
  { key: "User", icon: faUser },
  { key: "ArrowUp", icon: faArrowUp },
  { key: "ArrowDown", icon: faArrowDown },
  { key: "ArrowLeft", icon: faArrowLeft },
  { key: "ArrowRight", icon: faArrowRight },
  { key: "ChevronUp", icon: faChevronUp },
  { key: "ChevronDown", icon: faChevronDown },
  { key: "ChevronLeft", icon: faChevronLeft },
  { key: "ChevronRight", icon: faChevronRight },
  { key: "Rotate", icon: faRotate },
  { key: "Image", icon: faImage },
  { key: "Camera", icon: faCamera },
  { key: "Video", icon: faVideo },
  { key: "Music", icon: faMusic },
  { key: "Play", icon: faPlay },
  { key: "Stop", icon: faStop },
  { key: "Settings", icon: faGear },
  { key: "Wrench", icon: faWrench },
  { key: "ScrewdriverWrench", icon: faScrewdriverWrench },
  { key: "Code", icon: faCode },
  { key: "Database", icon: faDatabase },
  { key: "Server", icon: faServer },
  { key: "Wifi", icon: faWifi },
  { key: "Smartphone", icon: faMobileScreen },
  { key: "Cpu", icon: faMicrochip },
  { key: "Sliders", icon: faSliders },
  { key: "File", icon: faFile },
  { key: "FileText", icon: faFileLines },
  { key: "Folder", icon: faFolder },
  { key: "Book", icon: faBook },
  { key: "Mail", icon: faEnvelope },
  { key: "MessageCircle", icon: faMessage },
  { key: "Phone", icon: faPhone },
  { key: "Share", icon: faShareNodes },
  { key: "Facebook", icon: faFacebook },
  { key: "Instagram", icon: faInstagram },
  { key: "Linkedin", icon: faLinkedin },
  { key: "XTwitter", icon: faXTwitter },
  { key: "Youtube", icon: faYoutube },
  { key: "AlertTriangle", icon: faTriangleExclamation },
  { key: "Bell", icon: faBell },
  { key: "Shield", icon: faShield },
  { key: "FireExtinguisher", icon: faFireExtinguisher },
  { key: "Trash", icon: faTrash },
  { key: "MagnifyingGlass", icon: faMagnifyingGlass },
];

export default function IconPickerModal({
  open,
  selectedIcon,
  onClose,
  onSelect,
}: IconPickerModalProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CategoryKey>("All");

  const allIcons = useMemo(() => ICONS, []);

  const filteredIcons = useMemo(() => {
    return allIcons.filter((iconName) => {
      const matchSearch = iconName.key.toLowerCase().includes(search.trim().toLowerCase());
      if (!matchSearch) return false;
      if (category === "All") return true;
      return categoryMatchers[category].test(iconName.key);
    });
  }, [allIcons, search, category]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[130] bg-black/60 p-4 md:p-8 overflow-y-auto">
      <div className="mx-auto w-full max-w-6xl rounded-xl bg-background border shadow-xl max-h-[calc(100vh-2rem)] md:max-h-[calc(100vh-4rem)] flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="text-xl font-semibold">Select an Icon</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-2 hover:bg-muted"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-4 border-b space-y-3">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search icons..."
              className="w-full border rounded-md pl-10 pr-3 py-2 text-sm"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setCategory(tab)}
                className={`px-3 py-1.5 text-sm rounded-md border transition ${
                  category === tab
                    ? "bg-cyan-600 text-white border-cyan-600"
                    : "bg-background hover:bg-muted"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2">
            {filteredIcons.map((iconName) => {
              const isSelected = selectedIcon === iconName.key;

              return (
                <button
                  key={iconName.key}
                  type="button"
                  title={iconName.key}
                  onClick={() => onSelect(iconName.key)}
                  className={`p-2 rounded-md border hover:bg-muted transition flex flex-col items-center gap-1 ${
                    isSelected ? "border-cyan-600 bg-cyan-50" : ""
                  }`}
                >
                  <FontAwesomeIcon icon={iconName.icon} className="h-5 w-5" />
                  <span className="text-[10px] leading-tight text-center truncate w-full">
                    {iconName.key}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="px-4 py-3 border-t text-sm text-muted-foreground">
          Showing {filteredIcons.length} icons
        </div>
      </div>
    </div>
  );
}

