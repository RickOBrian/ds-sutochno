"use client";

import { useCallback, useEffect, useState } from "react";

export interface RedPolicyNavSection {
  id: string;
  title: string;
  level: 1 | 2;
}

export function useRedPolicyScrollSpy(sections: RedPolicyNavSection[]) {
  const [activeId, setActiveId] = useState<string | null>(sections[0]?.id ?? null);

  useEffect(() => {
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (a.boundingClientRect.top ?? 0) - (b.boundingClientRect.top ?? 0));

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-18% 0px -62% 0px", threshold: 0 },
    );

    for (const section of sections) {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [sections]);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(id);
    }
  }, []);

  return { activeId, scrollTo };
}
