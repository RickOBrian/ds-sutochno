"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { VisionTypeConstructionGraphic } from "./VisionTypeConstructionGraphic";
import { visionInter } from "./vision-inter-font";

type WeightStep = {
  name: string;
  value: number;
  className: string;
};

const WEIGHTS: WeightStep[] = [
  { name: "Extralight", value: 200, className: "font-extralight" },
  { name: "Regular", value: 400, className: "font-normal" },
  { name: "Medium", value: 500, className: "font-medium" },
];

const PAIRS: [number, number][] = [
  [0, 1],
  [1, 2],
];

const CYCLE_MS = 3600;

export function VisionTypographyIllustration() {
  const [pairIndex, setPairIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPairIndex((current) => (current + 1) % PAIRS.length);
    }, CYCLE_MS);

    return () => window.clearInterval(timer);
  }, []);

  const [topIndex, bottomIndex] = PAIRS[pairIndex];
  const top = WEIGHTS[topIndex];
  const bottom = WEIGHTS[bottomIndex];

  return (
    <div
      className={`${visionInter.variable} relative flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden bg-black/40 font-[family-name:var(--font-vision-inter),sans-serif]`}
    >
      <VisionTypeConstructionGraphic />

      <div className="relative z-10 flex min-h-0 flex-1 flex-col justify-end px-5 pb-5 pt-12 sm:px-6 sm:pb-6 sm:pt-14 2xl:px-7 2xl:pb-7">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${top.name}-${bottom.name}`}
            className="flex flex-col gap-0.5"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <p
              className={`leading-[1.05] tracking-[-0.02em] text-white/52 ${top.className}`}
              style={{ fontSize: "clamp(1.625rem, 7.5vw, 2.35rem)" }}
            >
              {top.name}
            </p>
            <p
              className={`leading-[1.02] tracking-[-0.025em] text-white ${bottom.className}`}
              style={{ fontSize: "clamp(1.75rem, 8.2vw, 2.65rem)" }}
            >
              {bottom.name}
            </p>
          </motion.div>
        </AnimatePresence>

        <p className="mt-4 font-mono text-[0.625rem] tabular-nums text-white/32">
          {top.value} · {bottom.value}
        </p>
      </div>
    </div>
  );
}
