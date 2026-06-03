"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ListTree, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { bento } from "@/lib/bento-styles";
import { RED_POLICY_EASE } from "./red-policy-motion";
import {
  isTocChapter,
  tocChapterSpacing,
  tocItemClassName,
} from "./red-policy-toc-styles";
import type { RedPolicyNavSection } from "./useRedPolicyScrollSpy";
import { useRedPolicyScrollSpy } from "./useRedPolicyScrollSpy";

interface RedPolicyTocFabProps {
  sections: RedPolicyNavSection[];
}

function TocSheetList({
  sections,
  activeId,
  onNavigate,
}: {
  sections: RedPolicyNavSection[];
  activeId: string | null;
  onNavigate: (id: string) => void;
}) {
  return (
    <ul
      className="scroll-hidden-y min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-3 sm:px-6"
      style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
    >
      {sections.map((section, index) => (
        <li key={section.id} className={tocChapterSpacing(index, section)}>
          <button
            type="button"
            onClick={() => onNavigate(section.id)}
            className={tocItemClassName(section, activeId === section.id, "sheet")}
            aria-current={activeId === section.id ? "location" : undefined}
          >
            {isTocChapter(section) ? (
              section.title
            ) : (
              <span className="flex gap-2.5">
                <span
                  className="mt-[0.35rem] h-1 w-1 shrink-0 rounded-full bg-[var(--rp-prose-meta)]"
                  aria-hidden
                />
                {section.title}
              </span>
            )}
          </button>
        </li>
      ))}
    </ul>
  );
}

export function RedPolicyTocFab({ sections }: RedPolicyTocFabProps) {
  const [open, setOpen] = useState(false);
  const { activeId, scrollTo } = useRedPolicyScrollSpy(sections);

  const onNavigate = useCallback(
    (id: string) => {
      scrollTo(id);
      setOpen(false);
    },
    [scrollTo],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (sections.length === 0) return null;

  const activeTitle = sections.find((s) => s.id === activeId)?.title;

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 lg:hidden">
        <div
          className="pointer-events-none h-24 bg-gradient-to-t from-[var(--canvas)] via-[var(--canvas)]/90 to-transparent"
          aria-hidden
        />
        <div className="pointer-events-auto mx-auto flex max-w-7xl justify-center px-4 pb-4">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className={`${bento.btnPrimary} gap-2.5 shadow-[var(--shadow-hover)]`}
            aria-haspopup="dialog"
            aria-expanded={open}
          >
            <ListTree className="h-4 w-4" aria-hidden />
            <span className="max-w-[12rem] truncate sm:max-w-[16rem]">
              {activeTitle ?? "Содержание"}
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-50 bg-black/35 backdrop-blur-md lg:hidden"
              aria-label="Закрыть содержание"
              onClick={() => setOpen(false)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="toc-sheet-title"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.45, ease: RED_POLICY_EASE }}
              className={`fixed inset-x-0 bottom-0 z-50 flex max-h-[min(85vh,36rem)] flex-col overflow-hidden rounded-t-[2rem] ${bento.card} !rounded-b-none p-0 shadow-[var(--shadow-hover)] lg:hidden`}
            >
              <header className="flex shrink-0 items-center justify-between gap-4 border-b border-[var(--border-subtle)] px-4 py-4 sm:px-6">
                <h2
                  id="toc-sheet-title"
                  className={`text-lg font-extralight tracking-tight sm:text-xl ${bento.ink}`}
                >
                  Содержание
                </h2>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className={bento.iconBtn}
                  aria-label="Закрыть"
                >
                  <X className="h-4 w-4" />
                </button>
              </header>

              <TocSheetList
                sections={sections}
                activeId={activeId}
                onNavigate={onNavigate}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
