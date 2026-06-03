/** Spring для сегмент-контролов и тоггла темы */
export const segmentSpring = {
  type: "spring" as const,
  stiffness: 520,
  damping: 34,
};

export const PORTAL_EASE = [0.22, 1, 0.36, 1] as const;

export const bentoRevealContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.065, delayChildren: 0.1 },
  },
};

export const bentoRevealTile = {
  hidden: { opacity: 0, y: 26, scale: 0.97, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.68, ease: PORTAL_EASE },
  },
};

export const bentoTileHover = {
  y: -4,
  transition: { duration: 0.35, ease: PORTAL_EASE },
};
