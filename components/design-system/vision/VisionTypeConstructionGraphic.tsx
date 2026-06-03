"use client";

import { motion } from "framer-motion";

export function VisionTypeConstructionGraphic() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <motion.svg
        viewBox="0 0 480 480"
        className="absolute left-1/2 top-[42%] h-[min(118%,520px)] w-[min(118%,520px)] -translate-x-1/2 -translate-y-1/2"
        fill="none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "240px 220px" }}
        >
          <circle cx="240" cy="220" r="148" stroke="rgba(255,255,255,0.14)" strokeWidth="0.75" />
          <circle cx="240" cy="220" r="92" stroke="rgba(255,255,255,0.1)" strokeWidth="0.75" />
          <circle cx="240" cy="220" r="34" stroke="rgba(255,255,255,0.08)" strokeWidth="0.75" />

          <path
            d="M 92 220 A 148 148 0 0 1 388 220"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="0.75"
          />
          <path
            d="M 148 220 A 92 92 0 0 0 332 220"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="0.75"
          />

          <line x1="48" y1="220" x2="432" y2="220" stroke="rgba(255,255,255,0.11)" strokeWidth="0.75" />
          <line x1="240" y1="56" x2="240" y2="384" stroke="rgba(255,255,255,0.09)" strokeWidth="0.75" />

          <line x1="240" y1="220" x2="318" y2="142" stroke="rgba(255,255,255,0.16)" strokeWidth="0.75" />
          <line x1="240" y1="220" x2="356" y2="248" stroke="rgba(255,255,255,0.14)" strokeWidth="0.75" />
          <line x1="240" y1="220" x2="168" y2="292" stroke="rgba(255,255,255,0.12)" strokeWidth="0.75" />

          <circle cx="318" cy="142" r="4.5" stroke="rgba(255,255,255,0.22)" strokeWidth="0.75" />
          <circle cx="356" cy="248" r="4.5" stroke="rgba(255,255,255,0.2)" strokeWidth="0.75" />
          <circle cx="168" cy="292" r="4.5" stroke="rgba(255,255,255,0.18)" strokeWidth="0.75" />
          <circle cx="240" cy="220" r="3" fill="rgba(255,255,255,0.28)" />

          <line x1="118" y1="168" x2="176" y2="126" stroke="rgba(255,255,255,0.1)" strokeWidth="0.75" />
          <line x1="176" y1="126" x2="228" y2="148" stroke="rgba(255,255,255,0.1)" strokeWidth="0.75" />
          <circle cx="118" cy="168" r="3.5" stroke="rgba(255,255,255,0.16)" strokeWidth="0.75" />
          <circle cx="176" cy="126" r="3.5" stroke="rgba(255,255,255,0.16)" strokeWidth="0.75" />

          <line x1="304" y1="312" x2="372" y2="336" stroke="rgba(255,255,255,0.09)" strokeWidth="0.75" />
          <circle cx="372" cy="336" r="3.5" stroke="rgba(255,255,255,0.14)" strokeWidth="0.75" />
        </motion.g>
      </motion.svg>

      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10" />
    </div>
  );
}
