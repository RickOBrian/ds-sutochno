import { isLinkLike, linkLabel } from "@/lib/link-utils";
import { FigmaIcon } from "./BrandIcons";
import { EmptyDash } from "./EmptyDash";

export type LinkBrand = "figma";

interface LinkCellProps {
  value: string;
  href?: string;
  variant?: "default" | "title";
  brand?: LinkBrand;
}

export function LinkCell({ value, href, variant = "default", brand }: LinkCellProps) {
  const trimmed = value.trim();
  const resolvedHref = href?.trim();
  const hasLink = isLinkLike(trimmed, resolvedHref);

  if (!trimmed && !resolvedHref) {
    return <EmptyDash />;
  }

  const linkClassName =
    "font-normal text-[var(--ink)] underline decoration-[var(--border-strong)] underline-offset-4 transition hover:decoration-[var(--ink)]";
  const titleClassName =
    "block max-w-full truncate text-sm font-medium text-[var(--ink)]";
  const plainClassName = "text-sm font-light text-[var(--ink-muted)]";

  const showBrand = brand === "figma" && Boolean(resolvedHref || hasLink);

  const content = !hasLink ? (
    <span className={variant === "title" ? titleClassName : plainClassName}>{trimmed}</span>
  ) : (
    (() => {
      const label = linkLabel(trimmed);
      const className = variant === "title" ? `text-sm ${linkClassName}` : `text-sm ${linkClassName}`;

      if (resolvedHref) {
        return (
          <a href={resolvedHref} target="_blank" rel="noopener noreferrer" className={className}>
            {label}
          </a>
        );
      }

      return <span className={className}>{label}</span>;
    })()
  );

  if (!showBrand) {
    return content;
  }

  return (
    <div className="flex min-w-0 items-center gap-2">
      <span className="shrink-0">
        <FigmaIcon />
      </span>
      <div className="min-w-0 flex-1 overflow-hidden">{content}</div>
    </div>
  );
}
