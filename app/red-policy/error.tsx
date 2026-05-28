"use client";

import { RedPolicyErrorView } from "@/components/red-policy/RedPolicyStates";

export default function RedPolicyError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <RedPolicyErrorView message={error.message} reset={reset} />;
}
