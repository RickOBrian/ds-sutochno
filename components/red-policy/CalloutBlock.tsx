import { AlertTriangle, Info, StickyNote } from "lucide-react";
import type { CalloutVariant } from "@/types/red-policy";

const variantStyles: Record<
  CalloutVariant,
  { border: string; bg: string; icon: typeof Info; label: string }
> = {
  note: {
    border: "border-sky-200/80 dark:border-sky-500/30",
    bg: "bg-sky-50/80 dark:bg-sky-950/25",
    icon: StickyNote,
    label: "Примечание",
  },
  warning: {
    border: "border-amber-200/90 dark:border-amber-500/35",
    bg: "bg-amber-50/90 dark:bg-amber-950/30",
    icon: AlertTriangle,
    label: "Важно",
  },
  info: {
    border: "border-[var(--lime)]/50 dark:border-[var(--lime)]/25",
    bg: "bg-[var(--lime)]/15 dark:bg-[var(--lime)]/8",
    icon: Info,
    label: "Инфо",
  },
};

interface CalloutBlockProps {
  variant: CalloutVariant;
  title?: string;
  text: string;
}

export function CalloutBlock({ variant, title, text }: CalloutBlockProps) {
  const style = variantStyles[variant];
  const Icon = style.icon;
  const heading = title ?? style.label;

  return (
    <aside
      className={`rounded-2xl border p-5 text-pretty shadow-[var(--shadow-float)] sm:p-6 ${style.border} ${style.bg}`}
      role="note"
    >
      <div className="mb-2 flex items-center gap-2">
        <Icon className="h-4 w-4 shrink-0 text-[var(--ink-muted)]" aria-hidden />
        <span className="text-xs font-medium tracking-wide text-[var(--ink-muted)] uppercase">
          {heading}
        </span>
      </div>
      <p className="text-sm font-light leading-relaxed text-[var(--ink)] sm:text-[0.9375rem] whitespace-pre-line">
        {text}
      </p>
    </aside>
  );
}
