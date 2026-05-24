"use client";

import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { bento } from "@/lib/bento-styles";

interface BentoHeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}

function formatHeaderDate(date: Date): string {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function BentoHeader({ onRefresh, isRefreshing }: BentoHeaderProps) {
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
          <h1 className={bento.titleMobile}>Грумминг компонентов</h1>
        </div>

        <motion.button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          className="inline-flex h-10 shrink-0 items-center gap-2 self-start rounded-full bg-zinc-900 px-5 text-sm font-normal text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 md:self-auto"
        >
          {isRefreshing ? "Обновление…" : "Обновить"}
          <motion.span
            className="inline-flex"
            animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
            whileTap={isRefreshing ? undefined : { rotate: -180 }}
            transition={
              isRefreshing
                ? { duration: 0.8, repeat: Infinity, ease: "linear" }
                : { type: "spring", stiffness: 280, damping: 18 }
            }
          >
            <RefreshCw className="h-3.5 w-3.5" strokeWidth={2} />
          </motion.span>
        </motion.button>
      </div>
    </motion.header>
  );
}
