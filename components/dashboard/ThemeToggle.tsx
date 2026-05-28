"use client";

import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { segmentSpring } from "@/lib/motion-presets";
import { useEffect, useState } from "react";

/** Внутри p-1: ширина 4rem, бегунок 2rem → сдвиг ровно на одну «ячейку» */
const THUMB_SIZE = "2rem";
const THUMB_TRAVEL = "2rem";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Включить светлую тему" : "Включить тёмную тему"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative h-10 w-[4.5rem] shrink-0 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-muted)] p-1 shadow-[var(--shadow-float)] transition-colors hover:border-[var(--border-strong)]"
    >
      <span className="relative block h-8 w-full">
        {/* Иконка только в неактивной половине */}
        <span className="pointer-events-none absolute inset-0 flex" aria-hidden>
          <span className="flex flex-1 items-center justify-center">
            <Sun
              className={`h-3.5 w-3.5 transition-opacity ${
                isDark ? "text-amber-500 opacity-90" : "opacity-0"
              }`}
              strokeWidth={1.75}
            />
          </span>
          <span className="flex flex-1 items-center justify-center">
            <Moon
              className={`h-3.5 w-3.5 transition-opacity ${
                isDark ? "opacity-0" : "text-[var(--ink-faint)] opacity-90"
              }`}
              strokeWidth={1.75}
            />
          </span>
        </span>

        <motion.span
          className="absolute top-0 left-0 flex items-center justify-center rounded-full bg-[var(--toggle-thumb)] text-[var(--toggle-thumb-fg)] shadow-sm ring-1 ring-[var(--border-subtle)]"
          style={{ width: THUMB_SIZE, height: THUMB_SIZE }}
          initial={false}
          animate={{ x: isDark ? THUMB_TRAVEL : 0 }}
          transition={segmentSpring}
        >
          {mounted ? (
            isDark ? (
              <Moon className="h-3.5 w-3.5 text-violet-300" strokeWidth={1.75} />
            ) : (
              <Sun className="h-3.5 w-3.5 text-amber-500" strokeWidth={1.75} />
            )
          ) : (
            <span className="h-3.5 w-3.5" />
          )}
        </motion.span>
      </span>
    </button>
  );
}
