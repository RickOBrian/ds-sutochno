"use client";

import { motion } from "framer-motion";
import type { Platform } from "@/lib/csv-sources";
import { PlatformTabs } from "./PlatformTabs";

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
      className="mb-8"
    >
      <PlatformTabs active={activePlatform} onChange={onPlatformChange} />
    </motion.div>
  );
}
