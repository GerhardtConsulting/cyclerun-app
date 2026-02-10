/**
 * CycleRun — SEO Configuration & Schema Generators
 * Central source of truth for SEO defaults, structured data, and <JsonLd />.
 */

import type { Metadata } from "next";
import React from "react";

/* ------------------------------------------------------------------ */
/*  Constants                                                         */
/* ------------------------------------------------------------------ */

export const SITE = {
  name: "CycleRun",
  url: "https://cyclerun.app",
  locale: { default: "en", supported: ["en", "de"] as const },
  themeColor: "#0A0A0B",
  author: "CycleRun.app",
} as const;

/* ------------------------------------------------------------------ */
/*  Default Metadata (root layout)                                    */
/* ------------------------------------------------------------------ */

export const defaultMetadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "CycleRun — Free Indoor Training with Your Webcam | Cycling & Running Simulator",
    template: "%s | CycleRun",
  },
  description:
    "CycleRun is the free Zwift alternative for your home workout. Use your webcam instead of expensive sensors — for spinning bikes, ergometers, treadmills and old home trainers. No hardware, no subscription.",
  keywords: [
    "indoor cycling", "spinning simulator", "treadmill simulator", "zwift alternative free",
    "ergometer app", "home trainer webcam", "indoor training", "rouvy alternative",
    "cycling app free", "home trainer software",
  ],
  authors: [{ name: SITE.author, url: SITE.url }],
  creator: SITE.author,
  publisher: SITE.name,
  robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  alternates: {
    canonical: "/",
    languages: { en: "/", de: "/", "x-default": "/" },
  },
  openGraph: {
    title: "CycleRun — Free Indoor Training with Your Webcam",
    description: "The free Zwift alternative: Use your webcam instead of expensive sensors for spinning, ergometer & treadmill.",
    type: "website",
    url: SITE.url,
    locale: "en_US",
    alternateLocale: ["de_DE"],
    siteName: SITE.name,
  },
  twitter: {
    card: "summary_large_image",
    title: "CycleRun — Free Indoor Training with Your Webcam",
    description: "The free Zwift alternative: Use your webcam instead of expensive sensors.",
  },
  other: { "theme-color": SITE.themeColor },
};

/* ------------------------------------------------------------------ */
/*  <JsonLd /> — Reusable server component                           */
/* ------------------------------------------------------------------ */

export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Alternates helper                                                 */
/* ------------------------------------------------------------------ */

export function makeAlternates(path: string) {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return {
    canonical: clean,
    languages: { en: clean, de: clean, "x-default": clean },
  };
}

/* ------------------------------------------------------------------ */
/*  Schema.org Generators                                             */
/* ------------------------------------------------------------------ */

export const schemas = {
  webApplication(): Record<string, unknown> {
    return {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: SITE.name,
      url: SITE.url,
      description: "Free camera-based indoor training platform for cycling and running. Use your webcam instead of expensive sensors.",
      applicationCategory: "HealthApplication",
      applicationSubCategory: "SportsApplication",
      operatingSystem: "Web",
      browserRequirements: "Requires a modern browser with camera access",
      offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
      featureList: [
        "Webcam-based motion detection", "Spinning bike compatible", "Ergometer compatible",
        "Treadmill compatible", "Real-time video synchronization", "No additional hardware needed",
        "Gamification with badges & levels", "Leaderboards & streaks",
      ],
      softwareVersion: "0.10.0",
      inLanguage: ["en", "de"],
    };
  },

  organization(): Record<string, unknown> {
    return {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
      logo: `${SITE.url}/icon-192.png`,
      description: "Community project for free camera-based indoor training",
      foundingDate: "2026",
    };
  },

  faqPage(faqs: { q: string; a: string }[]): Record<string, unknown> {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: { "@type": "Answer", text: faq.a },
      })),
    };
  },

  breadcrumbs(items: { name: string; path: string }[]): Record<string, unknown> {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: item.name,
        item: `${SITE.url}${item.path}`,
      })),
    };
  },

  blogPosting(post: { title: string; description: string; slug: string; date: string; author: string }): Record<string, unknown> {
    return {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      dateModified: post.date,
      author: { "@type": "Organization", name: post.author },
      publisher: { "@type": "Organization", name: SITE.author, url: SITE.url, logo: { "@type": "ImageObject", url: `${SITE.url}/icon-192.png` } },
      url: `${SITE.url}/blog/${post.slug}`,
      mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE.url}/blog/${post.slug}` },
      inLanguage: ["en", "de"],
    };
  },

  sportsEvent(route: { name: string; description: string; slug: string; location: string; country: string }): Record<string, unknown> {
    return {
      "@context": "https://schema.org",
      "@type": "SportsEvent",
      name: `${route.name} Virtual Cycling Route`,
      description: route.description,
      sport: "Cycling",
      location: { "@type": "Place", name: route.location, address: { "@type": "PostalAddress", addressCountry: route.country } },
      url: `${SITE.url}/routes/${route.slug}`,
      organizer: { "@type": "Organization", name: SITE.author, url: SITE.url },
      eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      offers: { "@type": "Offer", price: "0", priceCurrency: "EUR", availability: "https://schema.org/InStock" },
    };
  },

  article(page: { title: string; description: string; slug: string; datePublished?: string; dateModified?: string }): Record<string, unknown> {
    return {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: page.title,
      description: page.description,
      url: `${SITE.url}/guide/${page.slug}`,
      publisher: { "@type": "Organization", name: SITE.author, url: SITE.url, logo: { "@type": "ImageObject", url: `${SITE.url}/icon-192.png` } },
      datePublished: page.datePublished ?? "2026-01-15",
      dateModified: page.dateModified ?? "2026-02-08",
      inLanguage: ["en", "de"],
    };
  },

  itemList(items: { name: string; url: string }[]): Record<string, unknown> {
    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((item, i) => ({
        "@type": "ListItem", position: i + 1, name: item.name, url: item.url,
      })),
    };
  },

  webPage(opts: { name: string; description: string; path: string }): Record<string, unknown> {
    return {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: opts.name,
      description: opts.description,
      url: `${SITE.url}${opts.path}`,
      isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.url },
      inLanguage: ["en", "de"],
    };
  },

  aboutPage(opts: { name: string; description: string; path: string; lastReviewed?: string }): Record<string, unknown> {
    return {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      name: opts.name,
      description: opts.description,
      url: `${SITE.url}${opts.path}`,
      isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.url },
      lastReviewed: opts.lastReviewed ?? new Date().toISOString().split("T")[0],
      inLanguage: ["en", "de"],
      mainEntity: {
        "@type": "Organization",
        name: SITE.name,
        url: SITE.url,
      },
    };
  },

  privacyPolicy(opts: { path: string; locale: "en" | "de" }): Record<string, unknown> {
    const isDE = opts.locale === "de";
    return {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: isDE ? "Transparenzbericht" : "Transparency Report",
      description: isDE
        ? "Wie CycleRun deine Daten verarbeitet und deine Privatsphäre schützt. DSGVO-konform."
        : "How CycleRun processes your data and protects your privacy. GDPR compliant.",
      url: `${SITE.url}${opts.path}`,
      isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.url },
      inLanguage: opts.locale,
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["h1", "h2", ".trust-badge-text"],
      },
      about: {
        "@type": "Thing",
        name: isDE ? "Datenschutz und Transparenz" : "Privacy and Transparency",
        description: isDE
          ? "DSGVO Art. 15-17: Auskunftsrecht, Recht auf Berichtigung, Recht auf Löschung"
          : "GDPR Art. 15-17: Right of Access, Right to Rectification, Right to Erasure",
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/*  Homepage FAQ data (EN — server-rendered for Rich Results)         */
/* ------------------------------------------------------------------ */

export const homepageFaqs = [
  { q: "Is CycleRun really free?", a: "Yes, CycleRun is a community project and completely free. No hidden costs, no subscription, no premium version. You just need a webcam and a browser." },
  { q: "Which devices are compatible with CycleRun?", a: "CycleRun works with any home trainer where pedals or legs move visibly: spinning bikes, ergometers, old home trainers, treadmills and indoor bikes. No smart trainer or Bluetooth sensors needed." },
  { q: "How does CycleRun work without sensors?", a: "CycleRun uses your webcam and AI-powered motion detection to measure your cadence (RPM). You place detection zones over your knees or pedals, and the software automatically detects your movement." },
  { q: "What is the difference between CycleRun and Zwift?", a: "Zwift requires a smart trainer (from €300) and a monthly subscription (€17.99/month). CycleRun is free and only uses your existing webcam." },
  { q: "Does CycleRun work with a treadmill?", a: "Running mode is currently in development. Camera detection will also support running movements." },
  { q: "Are my webcam images stored or transmitted?", a: "No, absolutely not. All image processing happens locally in your browser. No images or videos are transmitted to servers." },
  { q: "Can I use my old ergometer or home trainer?", a: "Yes! Whether your ergometer is 5 or 25 years old — as long as your legs move, CycleRun can detect the motion." },
];
