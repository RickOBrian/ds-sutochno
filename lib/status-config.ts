import type { LucideIcon } from "lucide-react";
import {
  Circle,
  CircleCheck,
  Clock,
  Layers,
  Pencil,
  ScanEye,
  Timer,
} from "lucide-react";
import {
  PASTEL_AMBER,
  PASTEL_SKY,
  PASTEL_VIOLET,
  PASTEL_ZINC,
  pastelFromSheetHex,
  type PastelClasses,
} from "@/lib/status-pastel";

export const EMPTY_STATUS_KEY = "__empty__";

export interface StatusTheme {
  label: string;
  badgeClass: string;
  icon: LucideIcon;
  iconClass: string;
  shareBadgeClass: string;
  showShare?: boolean;
  sortOrder: number;
}

interface StatusMeta {
  label: string;
  icon: LucideIcon;
  showShare?: boolean;
  sortOrder: number;
  fallbackPastel: PastelClasses;
}

const STATUS_META: Record<string, StatusMeta> = {
  согласовано: {
    label: "Согласовано",
    icon: CircleCheck,
    showShare: true,
    sortOrder: 10,
    fallbackPastel: PASTEL_SKY,
  },
  "дизайн-ревью": {
    label: "Дизайн-ревью",
    icon: ScanEye,
    sortOrder: 20,
    fallbackPastel: PASTEL_VIOLET,
  },
  "на дизайне": {
    label: "На дизайне",
    icon: Pencil,
    sortOrder: 30,
    fallbackPastel: PASTEL_ZINC,
  },
  "на грумминге": {
    label: "На грумминге",
    icon: Timer,
    sortOrder: 40,
    fallbackPastel: PASTEL_AMBER,
  },
  "в работе": {
    label: "В работе",
    icon: Clock,
    sortOrder: 50,
    fallbackPastel: PASTEL_SKY,
  },
  "не начато": {
    label: "Не начато",
    icon: Circle,
    sortOrder: 60,
    fallbackPastel: {
      badgeClass:
        "bg-white text-zinc-500 ring-1 ring-zinc-200/60 backdrop-blur-sm",
      iconClass: "bg-zinc-100 text-zinc-500",
      shareBadgeClass: "bg-zinc-100 text-zinc-600",
    },
  },
  [EMPTY_STATUS_KEY]: {
    label: "Без статуса",
    icon: Circle,
    sortOrder: 90,
    fallbackPastel: PASTEL_ZINC,
  },
};

const DEFAULT_META: StatusMeta = {
  label: "",
  icon: Layers,
  sortOrder: 70,
  fallbackPastel: PASTEL_ZINC,
};

function themeFromMeta(meta: StatusMeta, sheetHex?: string): StatusTheme {
  const pastel = (sheetHex && pastelFromSheetHex(sheetHex)) || meta.fallbackPastel;

  return {
    label: meta.label,
    badgeClass: pastel.badgeClass,
    icon: meta.icon,
    iconClass: pastel.iconClass,
    shareBadgeClass: pastel.shareBadgeClass,
    showShare: meta.showShare,
    sortOrder: meta.sortOrder,
  };
}

export function normalizeStatusKey(status: string): string {
  const trimmed = status.trim();
  return trimmed ? trimmed.toLowerCase() : EMPTY_STATUS_KEY;
}

export function getStatusTheme(
  statusKey: string,
  displayLabel?: string,
  sheetHex?: string,
): StatusTheme {
  const meta = STATUS_META[statusKey];
  if (meta) return themeFromMeta(meta, sheetHex);

  if (statusKey === EMPTY_STATUS_KEY) {
    return themeFromMeta(STATUS_META[EMPTY_STATUS_KEY], sheetHex);
  }

  const fallbackPastel =
    (sheetHex && pastelFromSheetHex(sheetHex)) || DEFAULT_META.fallbackPastel;

  return {
    label: displayLabel?.trim() || statusKey,
    badgeClass: fallbackPastel.badgeClass,
    icon: DEFAULT_META.icon,
    iconClass: fallbackPastel.iconClass,
    shareBadgeClass: fallbackPastel.shareBadgeClass,
    sortOrder: DEFAULT_META.sortOrder,
  };
}

export function getBadgeClass(status: string, sheetHex?: string): string {
  return getStatusTheme(normalizeStatusKey(status), status, sheetHex).badgeClass;
}
