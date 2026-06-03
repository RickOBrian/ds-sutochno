"use client";

import { motion } from "framer-motion";
import { bento } from "@/lib/bento-styles";
import type { RedPolicyHero as RedPolicyHeroData } from "@/types/red-policy";

interface RedPolicyHeroProps {
  hero: RedPolicyHeroData;
}

export function RedPolicyHero({ hero }: RedPolicyHeroProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className={`${bento.cardDark} mb-8 sm:mb-10`}
    >
      <p className="mb-3 text-xs font-normal tracking-wide text-[var(--hero-muted)]">
        Редакционная политика
      </p>
      <h1 className="text-3xl font-extralight tracking-tight text-[var(--hero-fg)] sm:text-4xl md:text-5xl">
        {hero.title}
      </h1>
      {hero.subtitle && (
        <p className="mt-5 max-w-3xl text-base font-normal leading-[1.7] text-[var(--hero-muted)] sm:text-lg">
          {hero.subtitle}
        </p>
      )}
      {hero.description && (
        <p className="mt-3 max-w-3xl text-sm font-normal leading-[1.7] text-[var(--hero-muted)]">
          {hero.description}
        </p>
      )}
    </motion.section>
  );
}
