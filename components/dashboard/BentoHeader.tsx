"use client";

import { motion } from "framer-motion";
import { bento } from "@/lib/bento-styles";
import { ThemeToggle } from "./ThemeToggle";

function formatHeaderDate(date: Date): string {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function BentoHeader() {
  const today = formatHeaderDate(new Date());

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative mb-6"
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <p className={`${bento.label} capitalize`}>{today}</p>
          <h1 className={bento.titleMobile}>Хаб-портал ДС Суточно</h1>
        </div>

        <div className="hidden shrink-0 md:flex md:self-auto">
          <ThemeToggle />
        </div>
      </div>
    </motion.header>
  );
}
