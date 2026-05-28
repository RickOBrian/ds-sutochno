import type { RedPolicyNavSection } from "./useRedPolicyScrollSpy";

export function isTocChapter(section: RedPolicyNavSection): boolean {
  return section.level === 1;
}

/** Отступ между главами в списке */
export function tocChapterSpacing(index: number, section: RedPolicyNavSection): string {
  if (index === 0 || !isTocChapter(section)) return "";
  return "mt-4 pt-1";
}

export function tocItemClassName(
  section: RedPolicyNavSection,
  active: boolean,
  variant: "sidebar" | "sheet",
): string {
  const chapter = isTocChapter(section);

  if (variant === "sidebar") {
    const base = "-ml-px block w-full border-l-2 text-left leading-snug transition";
    if (chapter) {
      return [
        base,
        "py-2 pl-3.5 text-sm font-normal tracking-tight",
        active
          ? "border-[var(--lime-deep)] text-[var(--ink)]"
          : "border-transparent text-[var(--ink)]/85 hover:border-[var(--border-strong)] hover:text-[var(--ink)]",
      ].join(" ");
    }
    return [
      base,
      "py-1.5 pl-6 text-xs font-light",
      active
        ? "border-[var(--lime-deep)]/70 text-[var(--ink)]"
        : "border-transparent text-[var(--ink-faint)] hover:border-[var(--border-subtle)] hover:text-[var(--ink-muted)]",
    ].join(" ");
  }

  const base = "w-full rounded-2xl text-left leading-snug transition";
  if (chapter) {
    return [
      base,
      "px-4 py-3 text-sm font-normal tracking-tight",
      active
        ? "bg-[var(--surface-muted)] text-[var(--ink)] ring-1 ring-[var(--border-subtle)]"
        : "text-[var(--ink)]/90 hover:bg-[var(--surface-muted)]/70",
    ].join(" ");
  }
  return [
    base,
    "ml-2 px-4 py-2.5 text-xs font-light",
    active
      ? "bg-[var(--surface-muted)]/80 text-[var(--ink)] ring-1 ring-[var(--border-subtle)]"
      : "text-[var(--ink-faint)] hover:bg-[var(--surface-muted)]/50 hover:text-[var(--ink-muted)]",
  ].join(" ");
}
