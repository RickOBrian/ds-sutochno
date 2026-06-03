import Link from "next/link";
import { bento } from "@/lib/bento-styles";
import { RedPolicyAmbient } from "./RedPolicyAmbient";
import { RedPolicyTopBar } from "./RedPolicyTopBar";

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="red-policy relative min-h-full overflow-x-clip bg-[var(--canvas)]">
      <RedPolicyAmbient />
      <div className="relative mx-auto min-w-0 max-w-3xl p-3 sm:p-4 md:p-8">
        <RedPolicyTopBar />
        {children}
      </div>
    </div>
  );
}

export function RedPolicyLoading() {
  return (
    <Shell>
      <div className={`${bento.cardDark} mb-8 animate-pulse`}>
        <div className="mb-4 h-3 w-32 rounded-full bg-[var(--hero-icon-bg)]" />
        <div className="h-10 w-3/4 max-w-md rounded-full bg-[var(--hero-icon-bg)]" />
        <div className="mt-6 h-4 w-full max-w-2xl rounded-full bg-[var(--hero-icon-bg)]" />
        <div className="mt-2 h-4 w-5/6 max-w-xl rounded-full bg-[var(--hero-icon-bg)]" />
      </div>
      <div className={`${bento.card} space-y-4`}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-6 w-1/3 rounded-full bg-[var(--surface-muted)]" />
            <div className="h-3 w-full rounded-full bg-[var(--surface-muted)]" />
            <div className="h-3 w-11/12 rounded-full bg-[var(--surface-muted)]" />
          </div>
        ))}
      </div>
    </Shell>
  );
}

export function RedPolicyEmpty() {
  return (
    <Shell>
      <div className={`${bento.card} p-8 text-center`}>
        <p className="text-lg font-extralight text-[var(--ink)]">Документ пуст</p>
        <p className="mt-2 text-sm font-light text-[var(--ink-muted)]">
          В опубликованной версии Google Doc пока нет контента для отображения.
        </p>
        <Link href="/" className={`mt-6 inline-flex ${bento.btnPrimary}`}>
          На главную
        </Link>
      </div>
    </Shell>
  );
}

interface RedPolicyErrorProps {
  message?: string;
  reset?: () => void;
}

export function RedPolicyErrorView({ message, reset }: RedPolicyErrorProps) {
  return (
    <Shell>
      <div className={`${bento.card} p-8`} role="alert">
        <p className="text-lg font-extralight text-[var(--ink)]">Не удалось загрузить редполитику</p>
        <p className="mt-2 text-sm font-light text-red-500/90 dark:text-red-400/90">
          {message ?? "Проверьте доступность документа и повторите попытку."}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {reset && (
            <button type="button" onClick={reset} className={bento.btnPrimary}>
              Повторить
            </button>
          )}
          <Link
            href="/"
            className="inline-flex h-10 items-center rounded-full border border-[var(--border-subtle)] px-5 text-sm font-normal text-[var(--ink-muted)] transition hover:text-[var(--ink)]"
          >
            На главную
          </Link>
        </div>
      </div>
    </Shell>
  );
}
