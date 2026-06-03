import { FileText } from "lucide-react";
import { bento } from "@/lib/bento-styles";

interface ExampleBlockProps {
  title?: string;
  text: string;
}

export function ExampleBlock({ title, text }: ExampleBlockProps) {
  return (
    <figure
      className={`${bento.cardCompact} border border-[var(--border-subtle)] bg-[var(--surface-muted)]/60`}
    >
      <figcaption className="mb-3 flex items-center gap-2">
        <FileText className="h-4 w-4 text-[var(--rp-prose-meta)]" aria-hidden />
        <span className="text-xs font-medium tracking-wide text-[var(--rp-prose-meta)] uppercase">
          {title ?? "Пример"}
        </span>
      </figcaption>
      <blockquote className="border-l-2 border-[var(--lime-deep)] pl-4 text-sm font-normal leading-[1.7] text-[var(--rp-prose)] sm:text-[0.9375rem] whitespace-pre-line">
        {text}
      </blockquote>
    </figure>
  );
}
