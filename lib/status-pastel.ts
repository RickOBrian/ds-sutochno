/** Пастельные Tailwind-классы по оттенку из Google Sheets (hex фона ячейки) */

export interface PastelClasses {
  badgeClass: string;
  iconClass: string;
  shareBadgeClass: string;
}

const PASTEL_BASE = "backdrop-blur-sm";

const PASTEL_SKY: PastelClasses = {
  badgeClass: `${PASTEL_BASE} bg-sky-100/90 text-sky-800 dark:bg-sky-500/20 dark:text-sky-200 dark:ring-1 dark:ring-sky-400/25`,
  iconClass: "bg-sky-100/80 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300",
  shareBadgeClass: "bg-sky-200/90 text-sky-900",
};

const PASTEL_EMERALD: PastelClasses = {
  badgeClass: `${PASTEL_BASE} bg-emerald-100/90 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200 dark:ring-1 dark:ring-emerald-400/25`,
  iconClass: "bg-emerald-100/80 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
  shareBadgeClass: "bg-emerald-200/90 text-emerald-900",
};

const PASTEL_VIOLET: PastelClasses = {
  badgeClass: `${PASTEL_BASE} bg-violet-100/90 text-violet-800 dark:bg-violet-500/20 dark:text-violet-200 dark:ring-1 dark:ring-violet-400/25`,
  iconClass: "bg-violet-100/80 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300",
  shareBadgeClass: "bg-violet-200/90 text-violet-900",
};

const PASTEL_AMBER: PastelClasses = {
  badgeClass: `${PASTEL_BASE} bg-amber-100/90 text-amber-900 dark:bg-amber-500/20 dark:text-amber-100 dark:ring-1 dark:ring-amber-400/25`,
  iconClass: "bg-amber-100/80 text-amber-800 dark:bg-amber-500/20 dark:text-amber-200",
  shareBadgeClass: "bg-amber-200/90 text-amber-950",
};

const PASTEL_ZINC: PastelClasses = {
  badgeClass: `${PASTEL_BASE} bg-zinc-100/90 text-zinc-600 ring-1 ring-zinc-200/50 dark:bg-zinc-500/15 dark:text-zinc-300 dark:ring-zinc-500/30`,
  iconClass: "bg-zinc-100/80 text-zinc-500 dark:bg-zinc-500/20 dark:text-zinc-400",
  shareBadgeClass: "bg-zinc-100 text-zinc-600",
};

const PASTEL_LIME: PastelClasses = {
  badgeClass: `${PASTEL_BASE} bg-[var(--lime)]/90 text-zinc-900`,
  iconClass: "bg-[var(--lime)]/30 text-zinc-800",
  shareBadgeClass: "bg-[var(--lime)] text-zinc-900",
};

const SHEET_HEX_PRESETS: Record<string, PastelClasses> = {
  "#bfe1f6": PASTEL_SKY,
  "#d4edbc": PASTEL_EMERALD,
  "#e6cff2": PASTEL_VIOLET,
  "#e6e6e6": PASTEL_ZINC,
  "#ffe5a0": PASTEL_AMBER,
};

function normalizeSheetHex(value: string): string | null {
  const trimmed = value.trim().toLowerCase();
  if (!trimmed) return null;

  const hexMatch = trimmed.match(/^#?([0-9a-f]{6})$/i);
  if (hexMatch) return `#${hexMatch[1]}`;

  const rgbMatch = trimmed.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
  if (rgbMatch) {
    const toHex = (n: number) => n.toString(16).padStart(2, "0");
    return `#${toHex(Number(rgbMatch[1]))}${toHex(Number(rgbMatch[2]))}${toHex(Number(rgbMatch[3]))}`;
  }

  return null;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const normalized = normalizeSheetHex(hex)!;
  return {
    r: parseInt(normalized.slice(1, 3), 16),
    g: parseInt(normalized.slice(3, 5), 16),
    b: parseInt(normalized.slice(5, 7), 16),
  };
}

function rgbToHue({ r, g, b }: { r: number; g: number; b: number }): number {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;

  if (delta === 0) return 0;

  let hue = 0;
  if (max === rn) hue = ((gn - bn) / delta) % 6;
  else if (max === gn) hue = (bn - rn) / delta + 2;
  else hue = (rn - gn) / delta + 4;

  return Math.round(hue * 60);
}

function pastelFromHue(hue: number, saturation: number): PastelClasses {
  if (saturation < 12) return PASTEL_ZINC;
  if (hue >= 35 && hue < 75) return PASTEL_AMBER;
  if (hue >= 75 && hue < 155) return PASTEL_EMERALD;
  if (hue >= 155 && hue < 215) return PASTEL_SKY;
  if (hue >= 215 && hue < 290) return PASTEL_VIOLET;
  return PASTEL_ZINC;
}

export function pastelFromSheetHex(hex: string): PastelClasses | null {
  const normalized = normalizeSheetHex(hex);
  if (!normalized) return null;

  const preset = SHEET_HEX_PRESETS[normalized];
  if (preset) return preset;

  const { r, g, b } = hexToRgb(normalized);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const saturation = max === 0 ? 0 : ((max - min) / max) * 100;
  const hue = rgbToHue({ r, g, b });

  return pastelFromHue(hue, saturation);
}

export { PASTEL_LIME, PASTEL_SKY, PASTEL_EMERALD, PASTEL_VIOLET, PASTEL_AMBER, PASTEL_ZINC };
