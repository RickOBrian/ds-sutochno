/**
 * Структура bento «Эмоциональный дизайн» из Figma (4 ряда на desktop — без пересечений)
 */

export type VisionTileId =
  | "mascot"
  | "communication"
  | "personalization"
  | "emotional"
  | "spotlightImages"
  | "spotlightVideo"
  | "humor"
  | "gamification"
  | "micro";

export type VisionTileSurface = "dark" | "elevated" | "red" | "glass" | "liquid-glass";

export interface VisionTileConfig {
  id: VisionTileId;
  title: string;
  surface: VisionTileSurface;
  className: string;
}

/** Плитки на 2 ряда — заполняют span; однострочные — по контенту/min-height */
const lgSpan = "lg:min-h-0 lg:h-full";
const lgSingle = "lg:min-h-0";

export const VISION_BENTO_TILES: VisionTileConfig[] = [
  {
    id: "mascot",
    title: "",
    surface: "liquid-glass",
    className: `order-2 col-span-1 min-h-[16rem] lg:col-span-3 lg:col-start-1 lg:row-span-2 lg:row-start-1 ${lgSpan}`,
  },
  {
    id: "communication",
    title: "",
    surface: "elevated",
    className: `order-3 col-span-1 min-h-[11rem] lg:col-span-3 lg:col-start-4 lg:row-start-1 lg:min-h-[10.5rem] ${lgSingle}`,
  },
  {
    id: "personalization",
    title: "",
    surface: "dark",
    className: `order-4 col-span-1 min-h-[11rem] lg:col-span-3 lg:col-start-7 lg:row-start-1 lg:min-h-[10.5rem] ${lgSingle}`,
  },
  {
    id: "emotional",
    title: "",
    surface: "dark",
    className: `order-1 col-span-2 min-h-[18rem] sm:min-h-[20rem] lg:col-span-6 lg:col-start-4 lg:row-span-2 lg:row-start-2 ${lgSpan}`,
  },
  {
    id: "spotlightImages",
    title: "",
    surface: "elevated",
    className: `order-6 col-span-2 min-h-[16rem] sm:min-h-[18rem] lg:col-span-3 lg:col-start-10 lg:row-span-2 lg:row-start-1 ${lgSpan}`,
  },
  {
    id: "spotlightVideo",
    title: "",
    surface: "elevated",
    className: `order-7 col-span-2 min-h-[12rem] lg:col-span-3 lg:col-start-10 lg:row-span-1 lg:row-start-3 lg:min-h-[10.5rem] ${lgSingle}`,
  },
  {
    id: "humor",
    title: "Typography: Inter",
    surface: "dark",
    className: `order-5 col-span-1 min-h-[11rem] lg:col-span-3 lg:col-start-1 lg:row-span-2 lg:row-start-3 ${lgSpan}`,
  },
  {
    id: "gamification",
    title: "Геймификация",
    surface: "dark",
    className: `order-8 col-span-1 min-h-[12rem] lg:col-span-6 lg:col-start-4 lg:row-start-4 lg:min-h-[11rem] ${lgSingle}`,
  },
  {
    id: "micro",
    title: "",
    surface: "elevated",
    className: `order-9 col-span-1 min-h-[11rem] lg:col-span-3 lg:col-start-10 lg:row-start-4 lg:min-h-[10.5rem] ${lgSingle}`,
  },
];

export const VISION_COPY = {
  communicationMessage: "Привет! Заценишь редполитику от Алины?",
  gamificationSubtitle: "челенджи, награды, игры и задания",
  gamificationLevels: ["10%", "20%", "30%"] as const,
  weekDays: ["пн", "вт", "ср", "чт", "пт"] as const,
} as const;