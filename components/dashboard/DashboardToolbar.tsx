"use client";

import { motion } from "framer-motion";
import type { Platform } from "@/lib/csv-sources";
import { PlatformTabs } from "./PlatformTabs";
import { ThemeToggle } from "./ThemeToggle";

interface DashboardToolbarProps {
  activePlatform: Platform;
  onPlatformChange: (platform: Platform) => void;
}

export function DashboardToolbar({ activePlatform, onPlatformChange }: DashboardToolbarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="mb-8 flex min-w-0 items-center justify-between gap-3"
    >
      <PlatformTabs active={activePlatform} onChange={onPlatformChange} />
      <div className="shrink-0 md:hidden">
        <ThemeToggle />
      </div>
    </motion.div>
  );
}
