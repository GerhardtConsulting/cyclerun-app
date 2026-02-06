"use client";

import Link from "next/link";
import { t } from "@/lib/i18n";
import { useLocale } from "@/lib/useLocale";

interface SubpageNavProps {
  rightLabel?: string;
  rightHref?: string;
  rightKey?: string;
}

export default function SubpageNav({ rightLabel, rightHref = "/creator", rightKey }: SubpageNavProps) {
  useLocale();
  const label = rightKey ? t(rightKey) : rightLabel || t("sub.become_creator");
  return (
    <nav className="creator-nav">
      <Link href="/" className="creator-nav-logo">
        cyclerun<span className="creator-nav-app">.app</span>
      </Link>
      <Link href={rightHref} className="btn-ghost btn-sm">{label}</Link>
    </nav>
  );
}
