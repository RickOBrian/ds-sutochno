"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { bento } from "@/lib/bento-styles";

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

interface BentoCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: "light" | "dark" | "status" | "approved";
  compact?: boolean;
}

export function BentoCard({
  children,
  className = "",
  delay = 0,
  variant = "light",
  compact = false,
}: BentoCardProps) {
  const surface =
    variant === "dark"
      ? `${compact ? bento.cardDarkCompact : bento.cardDark} ${bento.cardHover}`
      : variant === "approved"
        ? `${bento.cardApproved} ${bento.cardHover}`
        : variant === "status"
          ? `${bento.statusCard} ${bento.cardHover}`
          : `${compact ? bento.cardCompact : bento.card} ${bento.cardHover}`;

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="show"
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`${surface} ${className}`}
    >
      {children}
    </motion.div>
  );
}
