import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import * as SolidIcons from "@fortawesome/free-solid-svg-icons";
import * as RegularIcons from "@fortawesome/free-regular-svg-icons";
import * as BrandIcons from "@fortawesome/free-brands-svg-icons";

type IconPack = "solid" | "regular" | "brands";
type IconEntry = { def: IconDefinition; pack: IconPack };

function isIconDefinition(value: unknown): value is IconDefinition {
  return Boolean(
    value &&
      typeof value === "object" &&
      "iconName" in value &&
      "prefix" in value
  );
}

function toBaseName(exportName: string): string {
  return exportName.replace(/^fa/, "");
}

function suffixByPack(pack: IconPack): string {
  if (pack === "regular") return "Regular";
  if (pack === "brands") return "Brand";
  return "";
}

function addPackEntries(
  target: Record<string, IconEntry>,
  source: Record<string, unknown>,
  pack: IconPack
) {
  for (const [exportName, iconDef] of Object.entries(source)) {
    if (!/^fa[A-Z]/.test(exportName)) continue;
    if (!isIconDefinition(iconDef)) continue;

    const baseName = toBaseName(exportName);
    if (!target[baseName]) {
      target[baseName] = { def: iconDef, pack };
      continue;
    }

    const withPackSuffix = `${baseName}${suffixByPack(pack)}`;
    if (!target[withPackSuffix]) {
      target[withPackSuffix] = { def: iconDef, pack };
    }
  }
}

const generatedLibrary: Record<string, IconEntry> = {};
addPackEntries(generatedLibrary, SolidIcons as Record<string, unknown>, "solid");
addPackEntries(generatedLibrary, RegularIcons as Record<string, unknown>, "regular");
addPackEntries(generatedLibrary, BrandIcons as Record<string, unknown>, "brands");

const aliasMap: Record<string, string> = {
  Settings: "Gear",
  MessageCircle: "CommentDots",
  FileText: "FileLines",
  AlertTriangle: "TriangleExclamation",
  ThumbsUp: "ThumbsUp",
  TrendingUp: "ArrowTrendUp",
  Linkedin: "LinkedinIn",
};

export const iconLibrary: Record<string, IconDefinition> = Object.fromEntries(
  Object.entries(generatedLibrary).map(([name, entry]) => [name, entry.def])
);

function categoryFilter(
  regex: RegExp,
  options?: { packs?: IconPack[] }
): string[] {
  return Object.entries(generatedLibrary)
    .filter(([name, entry]) => {
      if (options?.packs && !options.packs.includes(entry.pack)) return false;
      return regex.test(name);
    })
    .map(([name]) => name)
    .sort((a, b) => a.localeCompare(b));
}

export const iconCategories = {
  general: categoryFilter(/(Star|Heart|Award|Globe|Clock|Check|Thumb|Sparkle|Gift|Medal|Flag|Face)/i),
  business: categoryFilter(/(Briefcase|Building|Chart|Money|Wallet|Handshake|Industry|Bullseye|FileInvoice|Scale)/i),
  arrows: categoryFilter(/(Arrow|Chevron|Caret|Turn|Rotate|Angles)/i),
  media: categoryFilter(/(Image|Photo|Camera|Video|Play|Pause|Music|Film|Microphone|Volume)/i),
  technology: categoryFilter(/(Gear|Wrench|Screwdriver|Code|Database|Server|Wifi|Mobile|Laptop|Microchip|Robot)/i),
  files: categoryFilter(/(File|Folder|Book|Copy|Clipboard|Receipt|Archive|Paste|Note)/i),
  communication: categoryFilter(/(User|Users|Envelope|Phone|Comment|Message|Share|Bell|Address)/i),
  social: categoryFilter(/.*/, { packs: ["brands"] }),
  alerts: categoryFilter(/(TriangleExclamation|CircleExclamation|Shield|Fire|Bug|Skull|Bomb|Trash|Ban)/i),
} as const;

export function getIconByName(iconName: string): IconDefinition | null {
  const mapped = aliasMap[iconName] || iconName;
  return iconLibrary[mapped] || null;
}

export function getAllIconNames(): string[] {
  return Object.keys(iconLibrary).sort((a, b) => a.localeCompare(b));
}

export function getIconsByCategory(category: keyof typeof iconCategories): string[] {
  return Array.from(iconCategories[category] || []);
}

export function isValidIconName(iconName: string): boolean {
  const mapped = aliasMap[iconName] || iconName;
  return Boolean(iconLibrary[mapped]);
}
