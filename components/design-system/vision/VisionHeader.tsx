"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { HubPortalBackLink } from "@/components/portal/HubPortalBackLink";
import { VISION_EASE } from "./vision-motion";

export function VisionHeader() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });
  const headerOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0.92]);

  return (
    <>
      <motion.div
        className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-gradient-to-r from-[var(--vision-red)] via-[var(--vision-lime)] to-transparent"
        style={{ scaleX }}
      />
      <motion.header
        style={{ opacity: headerOpacity }}
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: VISION_EASE }}
        className="mb-4 sm:mb-5"
      >
        <HubPortalBackLink variant="vision" />
      </motion.header>
    </>
  );
}
