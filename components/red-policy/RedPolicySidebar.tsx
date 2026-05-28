"use client";

import type { RedPolicyNavSection } from "./useRedPolicyScrollSpy";
import { useRedPolicyScrollSpy } from "./useRedPolicyScrollSpy";
import { isTocChapter, tocChapterSpacing, tocItemClassName } from "./red-policy-toc-styles";
import { ScrollFadeContainer } from "./ScrollFadeContainer";

interface RedPolicySidebarProps {
  sections: RedPolicyNavSection[];
}

export function RedPolicySidebar({ sections }: RedPolicySidebarProps) {
  const { activeId, scrollTo } = useRedPolicyScrollSpy(sections);

  if (sections.length === 0) return null;

  return (
    <nav
      aria-label="Разделы редполитики"
      className="hidden shrink-0 lg:block lg:w-56 xl:w-64"
    >
      <ScrollFadeContainer className="sticky top-8 max-h-[calc(100vh-4rem)] overflow-y-auto pr-1">
        <p className="mb-4 text-xs font-normal tracking-wide text-[var(--ink-faint)]">
          Содержание
        </p>
        <ul className="border-l border-[var(--border-subtle)]">
          {sections.map((section, index) => (
            <li key={section.id} className={tocChapterSpacing(index, section)}>
              <button
                type="button"
                onClick={() => scrollTo(section.id)}
                className={tocItemClassName(section, activeId === section.id, "sidebar")}
                aria-current={activeId === section.id ? "location" : undefined}
              >
                {isTocChapter(section) ? (
                  <span className="block">{section.title}</span>
                ) : (
                  <span className="flex gap-2">
                    <span className="mt-[0.35rem] h-1 w-1 shrink-0 rounded-full bg-[var(--ink-faint)]" aria-hidden />
                    <span>{section.title}</span>
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </ScrollFadeContainer>
    </nav>
  );
}
