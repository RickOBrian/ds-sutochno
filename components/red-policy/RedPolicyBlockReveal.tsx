"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useRedPolicyRevealVariants } from "./red-policy-motion";

interface RedPolicyBlockRevealProps {
  children: ReactNode;
  className?: string;
}

/** Обёртка появления блока: blur + slide, с учётом prefers-reduced-motion */
export function RedPolicyBlockReveal({ children, className = "" }: RedPolicyBlockRevealProps) {
  const { inView } = useRedPolicyRevealVariants();

  return (
    <motion.div
      variants={inView}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-8% 0px -10% 0px", amount: 0.12 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
