"use client";

import React, { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Search, X } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { cn } from "@/app/lib/utils";
import {
  getAllIconNames,
  getIconByName,
  getIconsByCategory,
  iconCategories,
  isValidIconName,
} from "@/app/lib/iconLibrary";

interface IconPickerProps {
  value?: string;
  onValueChange: (iconName: string) => void;
  placeholder?: string;
  className?: string;
  showCategories?: boolean;
}

const IconPicker: React.FC<IconPickerProps> = ({
  value = "Star",
  onValueChange,
  placeholder = "Select an icon",
  className,
  showCategories = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const allIconNames = useMemo(() => getAllIconNames(), []);

  const filteredIcons = useMemo(() => {
    let icons: string[] =
      activeCategory === "all"
        ? allIconNames
        : getIconsByCategory(activeCategory as keyof typeof iconCategories);

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      icons = icons.filter((iconName) => iconName.toLowerCase().includes(q));
    }

    return icons;
  }, [allIconNames, searchTerm, activeCategory]);

  const handleIconSelect = (iconName: string) => {
    onValueChange(iconName);
    setIsOpen(false);
    setSearchTerm("");
    setActiveCategory("all");
  };

  const renderIcon = (iconName: string, size: "sm" | "lg" = "sm") => {
    const iconDef = getIconByName(iconName);
    if (!iconDef) return null;
    return <FontAwesomeIcon icon={iconDef} className={size === "sm" ? "w-4 h-4" : "w-6 h-6"} />;
  };

  const categoryEntries = Object.entries(iconCategories);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className={cn("w-full justify-start gap-2 h-10", className)}
        onClick={() => setIsOpen(true)}
      >
        {value && isValidIconName(value) ? renderIcon(value) : null}
        <span className="truncate">{value || placeholder}</span>
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-[140] bg-black/60 p-4 md:p-8 overflow-y-auto">
          <div className="mx-auto w-full max-w-4xl rounded-xl bg-background border shadow-xl max-h-[calc(100vh-2rem)] md:max-h-[calc(100vh-4rem)] flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                Select an Icon
                {value && isValidIconName(value) && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {renderIcon(value)}
                    {value}
                  </Badge>
                )}
              </h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-md p-2 hover:bg-muted"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 flex flex-col gap-4 flex-1 min-h-0 overflow-hidden">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search icons..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("");
                    setActiveCategory("all");
                  }}
                  disabled={!searchTerm && activeCategory === "all"}
                >
                  <X className="w-4 h-4" />
                  Clear
                </Button>
              </div>

              {showCategories ? (
                <Tabs
                  value={activeCategory}
                  onValueChange={setActiveCategory}
                  className="flex-1 flex flex-col min-h-0 overflow-hidden"
                >
                  <TabsList className="grid grid-cols-3 md:grid-cols-10 w-full h-auto p-1 gap-1">
                    <TabsTrigger value="all" className="text-xs py-2 px-2">All</TabsTrigger>
                    {categoryEntries.map(([key]) => (
                      <TabsTrigger key={key} value={key} className="text-xs py-2 px-2 capitalize">
                        {key === "communication"
                          ? "Comm"
                          : key === "technology"
                          ? "Tech"
                          : key === "business"
                          ? "Biz"
                          : key}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              ) : null}

              <div className="flex-1 min-h-0 border rounded-md overflow-y-auto">
                <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2 p-4">
                  {filteredIcons.map((iconName) => (
                    <button
                      type="button"
                      key={iconName}
                      onClick={() => handleIconSelect(iconName)}
                      className={cn(
                        "flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all duration-200 hover:bg-accent hover:border-primary min-h-[80px]",
                        value === iconName && "border-primary bg-accent"
                      )}
                      title={iconName}
                    >
                      <div className="mb-2">{renderIcon(iconName, "lg")}</div>
                      <span className="text-xs text-center truncate w-full leading-tight">{iconName}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>
                  Showing {filteredIcons.length} icons
                  {activeCategory !== "all" && ` in ${activeCategory}`}
                </span>
                {value && (
                  <Button type="button" variant="outline" size="sm" onClick={() => handleIconSelect("")}>
                    Clear Selection
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default IconPicker;
