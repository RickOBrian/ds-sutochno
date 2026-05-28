"use client";

import { useReducedMotion } from "framer-motion";

export const RED_POLICY_EASE = [0.22, 1, 0.36, 1] as const;

export const contentStagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.055,
      delayChildren: 0.08,
    },
  },
};

export function useRedPolicyRevealVariants() {
  const reduceMotion = useReducedMotion();

  const block = reduceMotion
    ? {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: 0.2 } },
      }
    : {
        hidden: { opacity: 0, y: 22, filter: "blur(6px)" },
        show: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: 0.62, ease: RED_POLICY_EASE },
        },
      };

  const inView = reduceMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.2 } },
      }
    : {
        hidden: { opacity: 0, y: 18, filter: "blur(5px)" },
        visible: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: 0.58, ease: RED_POLICY_EASE },
        },
      };

  return { block, inView, reduceMotion };
}
