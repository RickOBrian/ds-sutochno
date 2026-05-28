"use client";

import { useEffect, type RefObject } from "react";

const SCROLLING_CLASS = "is-scrolling";

/** Показывает тонкий скроллбар только во время прокрутки */
export function useScrollFade(
  ref: RefObject<HTMLElement | null>,
  idleMs = 750,
): void {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let timer: ReturnType<typeof setTimeout>;

    const onScroll = () => {
      el.classList.add(SCROLLING_CLASS);
      clearTimeout(timer);
      timer = setTimeout(() => el.classList.remove(SCROLLING_CLASS), idleMs);
    };

    el.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      el.removeEventListener("scroll", onScroll);
      clearTimeout(timer);
      el.classList.remove(SCROLLING_CLASS);
    };
  }, [ref, idleMs]);
}
