import type { Metadata } from "next";
import { RedPolicyPageView } from "@/components/red-policy/RedPolicyPageView";
import { RedPolicyEmpty } from "@/components/red-policy/RedPolicyStates";
import { fetchRedPolicyDocument } from "@/lib/red-policy-source";

export const metadata: Metadata = {
  title: "Редполитика — Хаб-портал ДС Суточно",
  description: "Редакционная политика Суточно.ру — правила текстов и коммуникации",
};

export default async function RedPolicyPage() {
  const document = await fetchRedPolicyDocument();

  if (document.blocks.length === 0) {
    return <RedPolicyEmpty />;
  }

  return <RedPolicyPageView document={document} />;
}
