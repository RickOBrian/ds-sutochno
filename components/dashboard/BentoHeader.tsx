"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { bento } from "@/lib/bento-styles";
import { ThemeToggle } from "./ThemeToggle";

const navLinkClass =
  "transition hover:text-[var(--ink)] hover:underline underline-offset-4";

export function BentoHeader() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative mb-6"
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <nav
            className={`${bento.label} flex flex-wrap items-center gap-x-4 gap-y-1`}
            aria-label="Разделы портала"
          >
            <a
              href="#roadmap"
              className={navLinkClass}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("roadmap")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              Роудмап
            </a>
            <Link href="/red-policy" className={navLinkClass}>
              Редполитика
            </Link>
          </nav>
          <h1 className={bento.titleMobile}>Хаб-портал ДС Суточно</h1>
        </div>

        <div className="hidden shrink-0 md:flex md:self-auto">
          <ThemeToggle />
        </div>
      </div>
    </motion.header>
  );
}
