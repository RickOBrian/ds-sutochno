import { parseGoogleDocHtml } from "@/lib/google-doc-parser";
import { applyTypographyToDocument } from "@/lib/red-policy-typography";
import type { RedPolicyDocument } from "@/types/red-policy";

export const RED_POLICY_DOC_URL =
  "https://docs.google.com/document/d/e/2PACX-1vSQ6bX7TXwCfXFx0dudrruVZx2L0660adCXtr7vAC-dD2RX6BZxEJGrroDN2VqRBKybtQq3y729AaTJ/pub";

/** Обновление каждые 2 минуты — как в опубликованном Google Doc */
export const RED_POLICY_REVALIDATE_SECONDS = 120;

export const RED_POLICY_CACHE_TAG = "red-policy";

export async function fetchRedPolicyDocument(
  options?: { fresh?: boolean },
): Promise<RedPolicyDocument> {
  const response = await fetch(RED_POLICY_DOC_URL, {
    ...(options?.fresh
      ? { cache: "no-store" as const }
      : { next: { revalidate: RED_POLICY_REVALIDATE_SECONDS, tags: [RED_POLICY_CACHE_TAG] } }),
  });

  if (!response.ok) {
    throw new Error(`Не удалось загрузить редполитику (${response.status})`);
  }

  const html = await response.text();
  const parsed = parseGoogleDocHtml(html);
  return applyTypographyToDocument(parsed);
}
