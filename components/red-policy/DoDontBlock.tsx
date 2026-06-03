import { Check, X } from "lucide-react";
import { bento } from "@/lib/bento-styles";
import { onTint } from "@/lib/on-surface-text";

interface DoDontBlockProps {
  dont: string[];
  do: string[];
}

function ItemList({ items, kind }: { items: string[]; kind: "do" | "dont" }) {
  const isDo = kind === "do";
  const Icon = isDo ? Check : X;

  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-sm">
          <span
            className={`flex h-[1.7em] w-6 shrink-0 items-center justify-center rounded-full ${
              isDo
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
                : "bg-red-100 text-red-600 dark:bg-red-950/45 dark:text-red-400"
            }`}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden />
          </span>
          <span
            className={`min-w-0 flex-1 text-pretty font-normal leading-[1.7] whitespace-pre-line ${onTint.fg}`}
          >
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function DoDontBlock({ dont, do: doItems }: DoDontBlockProps) {
  if (dont.length === 0 && doItems.length === 0) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div
        className={`${onTint.surface} ${bento.cardCompact} border border-red-100/80 dark:border-red-500/20`}
        data-kind="dont"
      >
        <p className={`${bento.label} mb-4 text-red-600/80 dark:text-red-400/90`}>Неправильно</p>
        <ItemList items={dont} kind="dont" />
      </div>
      <div
        className={`${onTint.surface} ${bento.cardCompact} border border-emerald-100/90 dark:border-emerald-500/25`}
        data-kind="do"
      >
        <p className={`${bento.label} mb-4 text-emerald-700/80 dark:text-emerald-400/90`}>
          Правильно
        </p>
        <ItemList items={doItems} kind="do" />
      </div>
    </div>
  );
}
