/** Текст поверх цветных / тонированных блоков — без серых hex */
export const onTint = {
  surface: "on-tint-surface",
  fg: "text-[var(--on-tint-fg)]",
  fgMeta: "text-[var(--on-tint-fg-meta)]",
} as const;

/** Тёмные editorial-поверхности (hero, vision) */
export const onDarkChrome = {
  muted: "text-white/65",
  faint: "text-white/42",
  soft: "text-white/55",
} as const;

/** Светлые насыщенные заливки (lime, amber и т.п.) */
export const onLightChrome = {
  fg: "text-black/80",
  muted: "text-black/55",
} as const;
