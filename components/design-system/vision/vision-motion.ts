"use client";

import { useReducedMotion } from "framer-motion";

export const VISION_EASE = [0.16, 1, 0.3, 1] as const;

/** Мягкая перестройка bento при ресайзе */
export const visionLayoutSpring = {
  type: "spring" as const,
  stiffness: 220,
  damping: 30,
  mass: 0.9,
};

export const visionLayoutTransition = {
  layout: visionLayoutSpring,
};

export const visionGridContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.15 },
  },
};

export function useVisionTileMotion() {
  const reduceMotion = useReducedMotion();

  const enter = reduceMotion
    ? {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: 0.25 } },
      }
    : {
        hidden: {
          opacity: 0,
          y: 48,
          scale: 0.92,
          rotateX: 8,
          filter: "blur(14px)",
        },
        show: {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          filter: "blur(0px)",
          transition: { duration: 0.85, ease: VISION_EASE },
        },
      };

  const hoverLift = reduceMotion
    ? {}
    : {
        y: -4,
        transition: { duration: 0.4, ease: VISION_EASE },
      };

  return { enter, hoverLift, reduceMotion, visionLayoutTransition: reduceMotion ? { layout: { duration: 0 } } : visionLayoutTransition };
}
