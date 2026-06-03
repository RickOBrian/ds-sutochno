"use client";

import type { RedPolicyDocument } from "@/types/red-policy";
import { RedPolicyAmbient } from "./RedPolicyAmbient";
import { RedPolicyContent } from "./RedPolicyContent";
import { RedPolicyHero } from "./RedPolicyHero";
import { RedPolicySidebar } from "./RedPolicySidebar";
import { RedPolicyTocFab } from "./RedPolicyTocFab";
import { RedPolicyTopBar } from "./RedPolicyTopBar";

interface RedPolicyPageViewProps {
  document: RedPolicyDocument;
}

export function RedPolicyPageView({ document }: RedPolicyPageViewProps) {
  return (
    <div className="red-policy relative min-h-full overflow-x-clip bg-[var(--canvas)]">
      <RedPolicyAmbient />

      <div className="relative mx-auto min-w-0 max-w-7xl p-3 sm:p-4 md:p-8">
        <RedPolicyTopBar />
        <RedPolicyHero hero={document.hero} />

        <div className="flex gap-10 xl:gap-14">
          <RedPolicySidebar sections={document.sections} />
          <RedPolicyContent blocks={document.blocks} />
        </div>

        <RedPolicyTocFab sections={document.sections} />

      </div>
    </div>
  );
}
