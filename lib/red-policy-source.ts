import { parseGoogleDocHtml } from "@/lib/google-doc-parser";
import { applyTypographyToDocument } from "@/lib/red-policy-typography";
import type { RedPolicyDocument } from "@/types/red-policy";

export const RED_POLICY_DOC_URL =
  "https://docs.google.com/document/d/e/2PACX-1vRBxkjbaheP3IV7DmSXmobckr5R9tWOS-hR5eAoGGtU_VhhwvaTdbASjAY6pHokfdydpsp_3mYvmeHD/pub";

/** Обновление каждые 5 минут — как в опубликованном Google Doc */
export const RED_POLICY_REVALIDATE_SECONDS = 300;

export async function fetchRedPolicyDocument(): Promise<RedPolicyDocument> {
  const response = await fetch(RED_POLICY_DOC_URL, {
    next: { revalidate: RED_POLICY_REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new Error(`Не удалось загрузить редполитику (${response.status})`);
  }

  const html = await response.text();
  const parsed = parseGoogleDocHtml(html);
  return applyTypographyToDocument(parsed);
}
