"use client";

import { useEffect } from "react";
import { initLocale, onLocaleChange, getLocale } from "@/lib/i18n";

/**
 * Invisible client component that syncs <html lang="..."> with the active locale.
 * Place once in the root layout body.
 */
export default function LocaleSync() {
  useEffect(() => {
    const locale = initLocale();
    document.documentElement.lang = locale;
    const unsub = onLocaleChange(() => {
      document.documentElement.lang = getLocale();
    });
    return unsub;
  }, []);

  return null;
}
