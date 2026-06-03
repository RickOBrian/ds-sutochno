"use client";

import { onTint } from "@/lib/on-surface-text";
import type { RedPolicyBlock } from "@/types/red-policy";
import { CalloutBlock } from "./CalloutBlock";
import { DoDontBlock } from "./DoDontBlock";
import { ExampleBlock } from "./ExampleBlock";
import { RedPolicyBlockReveal } from "./RedPolicyBlockReveal";
import { RedPolicySection } from "./RedPolicySection";

interface RedPolicyContentProps {
  blocks: RedPolicyBlock[];
}

function ProseParagraph({ text }: { text: string }) {
  return (
    <p className="text-pretty text-sm font-normal leading-[1.7] text-[var(--rp-prose)] sm:text-[0.9375rem] whitespace-pre-line">
      {text}
    </p>
  );
}

function ProseList({ items, ordered }: { items: string[]; ordered?: boolean }) {
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag
      className={`space-y-2 pl-5 text-pretty text-sm font-normal leading-[1.7] text-[var(--rp-prose)] sm:text-[0.9375rem] ${
        ordered ? "list-decimal" : "list-disc"
      } marker:text-[var(--rp-prose-meta)]`}
    >
      {items.map((item, i) => (
        <li key={i} className="whitespace-pre-line">
          {item}
        </li>
      ))}
    </Tag>
  );
}

function ProseQuote({ text }: { text: string }) {
  return (
    <blockquote
      className={`${onTint.surface} text-pretty rounded-2xl border-l-4 border-[var(--lime-deep)] bg-[var(--lime)]/12 py-1 pl-5 text-sm font-normal italic leading-[1.7] dark:bg-[var(--lime)]/8 ${onTint.fg}`}
    >
      {text}
    </blockquote>
  );
}

export function RedPolicyContent({ blocks }: RedPolicyContentProps) {
  return (
    <article className="min-w-0 flex-1 space-y-6 pb-28 sm:space-y-7 lg:pb-0">
      {blocks.map((block, i) => {
        const key = `${block.type}-${i}`;
        const levelClass =
          block.type === "section"
            ? block.level === 1
              ? "pt-4 first:pt-0"
              : "pt-2"
            : undefined;

        const inner = (() => {
          switch (block.type) {
            case "section":
              return (
                <RedPolicySection id={block.id} title={block.title} level={block.level} />
              );
            case "paragraph":
              return <ProseParagraph text={block.text} />;
            case "bulletList":
              return <ProseList items={block.items} />;
            case "numberedList":
              return <ProseList items={block.items} ordered />;
            case "quote":
              return <ProseQuote text={block.text} />;
            case "callout":
              return (
                <CalloutBlock variant={block.variant} title={block.title} text={block.text} />
              );
            case "doDont":
              return <DoDontBlock dont={block.dont} do={block.do} />;
            case "example":
              return <ExampleBlock title={block.title} text={block.text} />;
            default:
              return null;
          }
        })();

        if (!inner) return null;

        return (
          <RedPolicyBlockReveal key={key} className={levelClass}>
            {inner}
          </RedPolicyBlockReveal>
        );
      })}
    </article>
  );
}
