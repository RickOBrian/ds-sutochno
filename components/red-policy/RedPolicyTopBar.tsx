"use client";

import { motion } from "framer-motion";
import { HubPortalBackLink } from "@/components/portal/HubPortalBackLink";
import { ThemeToggle } from "@/components/dashboard/ThemeToggle";

export function RedPolicyTopBar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="mb-6 flex items-center justify-between gap-4"
    >
      <HubPortalBackLink />
      <ThemeToggle />
    </motion.div>
  );
}
