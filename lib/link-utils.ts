const URL_REGEX = /https?:\/\/[^\s,)]+/gi;

export function unwrapGoogleRedirect(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "www.google.com" && parsed.pathname === "/url") {
      const target = parsed.searchParams.get("q");
      if (target) return decodeURIComponent(target);
    }
  } catch {
    // keep original url
  }
  return url;
}

export function normalizeHref(url: string | null | undefined): string | undefined {
  if (!url?.trim()) return undefined;
  return unwrapGoogleRedirect(url.trim());
}

export function extractUrl(value: string): string | null {
  const match = value.match(URL_REGEX);
  if (!match?.[0]) return null;
  return normalizeHref(match[0]) ?? null;
}

export function isLinkLike(value: string, href?: string): boolean {
  const trimmed = value.trim();
  if (href?.trim()) return true;
  if (!trimmed) return false;
  return /ссылка/i.test(trimmed) || extractUrl(trimmed) !== null;
}

export function linkLabel(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "Ссылка";
  if (/^ссылка$/i.test(trimmed)) return "Ссылка";
  const url = extractUrl(trimmed);
  if (url && trimmed === url) {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  }
  return trimmed;
}
