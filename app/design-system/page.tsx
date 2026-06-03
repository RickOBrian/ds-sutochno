import type { Metadata } from "next";
import { DesignSystemPage } from "@/components/design-system/DesignSystemPage";

export const metadata: Metadata = {
  title: "Дизайн-система — Хаб-портал ДС Суточно",
  description: "Концепты, токены и принципы дизайн-системы Суточно.ру",
};

export default function DesignSystemRoutePage() {
  return <DesignSystemPage />;
}
