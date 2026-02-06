"use client";

import { useState, useEffect } from "react";
import { getLocale, initLocale, onLocaleChange, type Locale } from "./i18n";

/**
 * React hook that returns the current locale and re-renders on locale change.
 * Use in client components that need to react to language switches.
 */
export function useLocale(): Locale {
  const [locale, setL] = useState<Locale>("en");

  useEffect(() => {
    const initial = initLocale();
    setL(initial);
    const unsub = onLocaleChange(() => setL(getLocale()));
    return unsub;
  }, []);

  return locale;
}
