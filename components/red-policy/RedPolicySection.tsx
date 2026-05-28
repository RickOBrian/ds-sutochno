interface RedPolicySectionProps {
  id: string;
  title: string;
  level: 1 | 2 | 3;
}

export function RedPolicySection({ id, title, level }: RedPolicySectionProps) {
  const Tag = level === 1 ? "h2" : level === 2 ? "h3" : "h4";
  const className =
    level === 1
      ? "scroll-mt-28 text-pretty text-2xl font-extralight tracking-tight text-[var(--ink)] sm:text-3xl"
      : level === 2
        ? "scroll-mt-28 text-pretty text-xl font-extralight tracking-tight text-[var(--ink)] sm:text-2xl"
        : "scroll-mt-28 text-pretty text-lg font-light tracking-tight text-[var(--ink)]";

  return (
    <div id={id}>
      <Tag className={className}>{title}</Tag>
    </div>
  );
}
