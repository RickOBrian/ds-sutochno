"use client";

import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const THUMB_OFFSET = 34;

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
      <Sun
        className={`pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 transition-colors ${
          isDark ? "text-[var(--ink-faint)]" : "text-amber-500"
        }`}
        strokeWidth={1.75}
        aria-hidden
      />
      <Moon
        className={`pointer-events-none absolute top-1/2 right-2.5 h-3.5 w-3.5 -translate-y-1/2 transition-colors ${
          isDark ? "text-violet-300" : "text-[var(--ink-faint)]"
        }`}
        strokeWidth={1.75}
        aria-hidden
      />

      <motion.span
        className="absolute top-1 left-1 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--toggle-thumb)] text-[var(--toggle-thumb-fg)] shadow-sm ring-1 ring-[var(--border-subtle)]"
        initial={false}
        animate={{ x: isDark ? THUMB_OFFSET : 0 }}
        transition={{ type: "spring", stiffness: 520, damping: 34 }}
      >
        {mounted ? (
          isDark ? (
            <Moon className="h-3.5 w-3.5" strokeWidth={1.75} />
          ) : (
            <Sun className="h-3.5 w-3.5 text-amber-500" strokeWidth={1.75} />
          )
        ) : (
          <span className="h-3.5 w-3.5" />
        )}
      </motion.span>
    </button>
  );
}
