"use client";

import { motion } from "framer-motion";
import type { Platform } from "@/lib/csv-sources";
import { PLATFORM_LABELS, PLATFORMS } from "@/lib/csv-sources";
import { segmentSpring } from "@/lib/motion-presets";

interface PlatformTabsProps {
  active: Platform;
  onChange: (platform: Platform) => void;
}

export function PlatformTabs({ active, onChange }: PlatformTabsProps) {
  return (
    <div
      className="relative inline-flex max-w-full flex-wrap gap-0.5 rounded-full bg-[var(--surface-muted)] p-1 ring-1 ring-[var(--border-subtle)] backdrop-blur-sm"
      role="tablist"
      aria-label="Платформы"
    >
      {PLATFORMS.map((platform) => {
        const isActive = platform === active;
        return (
          <button
            key={platform}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(platform)}
            className={[
              "relative rounded-full px-4 py-2 text-sm font-normal transition-colors",
              isActive
                ? "text-[var(--pill-active-fg)]"
                : "text-[var(--ink-muted)] hover:text-[var(--ink)]",
            ].join(" ")}
          >
            {isActive && (
              <motion.span
                layoutId="platform-segment-thumb"
                className="absolute inset-0 rounded-full bg-[var(--pill-active-bg)] shadow-sm"
                transition={segmentSpring}
              />
            )}
            <span className="relative z-10">{PLATFORM_LABELS[platform]}</span>
          </button>
        );
      })}
    </div>
  );
}
