"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { bento } from "@/lib/bento-styles";
import { ThemeToggle } from "@/components/dashboard/ThemeToggle";

export function RedPolicyTopBar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="mb-6 flex items-center justify-between gap-4"
    >
      <Link
        href="/"
        className={`inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--surface)]/80 px-4 py-2 text-sm font-normal text-[var(--ink-muted)] backdrop-blur-md transition hover:border-[var(--border-strong)] hover:text-[var(--ink)]`}
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Хаб-портал
      </Link>
      <ThemeToggle />
    </motion.div>
  );
}
