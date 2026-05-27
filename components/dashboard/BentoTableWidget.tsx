"use client";

import { motion } from "framer-motion";
import type { ComponentRow } from "@/types/component-row";
import { bento } from "@/lib/bento-styles";
import { ComponentsTable } from "./ComponentsTable";

interface BentoTableWidgetProps {
  rows: ComponentRow[];
  isPlatformEmpty: boolean;
}

export function BentoTableWidget({ rows, isPlatformEmpty }: BentoTableWidgetProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
      className={`col-span-full min-w-0 max-w-full overflow-hidden rounded-2xl bg-[var(--surface)] shadow-[var(--shadow-float)] ring-1 ring-[var(--border-subtle)] sm:rounded-[2rem] !p-0 hover:translate-y-0`}
    >
      <ComponentsTable rows={rows} isPlatformEmpty={isPlatformEmpty} embedded />
    </motion.section>
  );
}
