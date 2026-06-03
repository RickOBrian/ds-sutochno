import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { bento } from "@/lib/bento-styles";

type HubPortalBackLinkProps = {
  /** `vision` — тёмная страница /design-system */
  variant?: "default" | "vision";
  className?: string;
};

export function HubPortalBackLink({
  variant = "default",
  className = "",
}: HubPortalBackLinkProps) {
  const linkClass =
    variant === "vision" ? bento.portalBackLinkVision : bento.portalBackLink;

  return (
    <Link href="/" className={[linkClass, className].filter(Boolean).join(" ")}>
      <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
      Хаб-портал
    </Link>
  );
}
