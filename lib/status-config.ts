import type { LucideIcon } from "lucide-react";
import { Circle, CircleCheck, Clock, Layers, Palette, Timer } from "lucide-react";

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

const STATUS_THEMES: Record<string, StatusTheme> = {
  согласовано: {
    label: "Согласовано",
    badgeClass: "bg-[var(--lime)]/90 text-zinc-900 backdrop-blur-sm",
    icon: CircleCheck,
    iconClass: "bg-[var(--lime)]/30 text-zinc-800",
    shareBadgeClass: "bg-[var(--lime)] text-zinc-900",
    showShare: true,
    sortOrder: 10,
  },
  "на дизайне": {
    label: "На дизайне",
    badgeClass: "bg-violet-100/90 text-violet-800 backdrop-blur-sm",
    icon: Palette,
    iconClass: "bg-violet-100/80 text-violet-700",
    shareBadgeClass: "",
    sortOrder: 20,
  },
  "на грумминге": {
    label: "На грумминге",
    badgeClass: "bg-amber-100/90 text-amber-900 backdrop-blur-sm",
    icon: Timer,
    iconClass: "bg-amber-100/80 text-amber-800",
    shareBadgeClass: "",
    sortOrder: 30,
  },
  "в работе": {
    label: "В работе",
    badgeClass: "bg-sky-100/90 text-sky-800 backdrop-blur-sm",
    icon: Clock,
    iconClass: "bg-sky-100/80 text-sky-700",
    shareBadgeClass: "",
    sortOrder: 40,
  },
  "не начато": {
    label: "Не начато",
    badgeClass: "bg-white text-zinc-500 ring-1 ring-zinc-200/60 backdrop-blur-sm",
    icon: Circle,
    iconClass: "bg-zinc-100 text-zinc-500",
    shareBadgeClass: "bg-zinc-100 text-zinc-600",
    sortOrder: 50,
  },
  [EMPTY_STATUS_KEY]: {
    label: "Без статуса",
    badgeClass: "bg-zinc-50 text-zinc-500 ring-1 ring-zinc-100 backdrop-blur-sm",
    icon: Circle,
    iconClass: "bg-zinc-100 text-zinc-400",
    shareBadgeClass: "bg-zinc-100 text-zinc-600",
    sortOrder: 90,
  },
};

const DEFAULT_THEME: StatusTheme = {
  label: "",
  badgeClass: "bg-zinc-50 text-zinc-600 ring-1 ring-zinc-100 backdrop-blur-sm",
  icon: Layers,
  iconClass: "bg-zinc-100 text-zinc-600",
  shareBadgeClass: "",
  sortOrder: 60,
};

export function normalizeStatusKey(status: string): string {
  const trimmed = status.trim();
  return trimmed ? trimmed.toLowerCase() : EMPTY_STATUS_KEY;
}

export function getStatusTheme(statusKey: string, displayLabel?: string): StatusTheme {
  const known = STATUS_THEMES[statusKey];
  if (known) return known;

  if (statusKey === EMPTY_STATUS_KEY) {
    return STATUS_THEMES[EMPTY_STATUS_KEY];
  }

  return {
    ...DEFAULT_THEME,
    label: displayLabel?.trim() || statusKey,
  };
}

export function getBadgeClass(status: string): string {
  return getStatusTheme(normalizeStatusKey(status), status).badgeClass;
}
