import type { MetadataRoute } from "next";
import { getAllBlogSlugs } from "@/lib/blog-data";
import { getAllRouteSlugs } from "@/lib/route-data";
import { getAllSeoSlugs } from "@/lib/seo-pages-data";

const BASE = "https://cyclerun.app";

/**
 * Adds hreflang alternates for every URL.
 * Since the app uses client-side i18n on the same URL,
 * en/de/x-default all point to the same canonical URL.
 */
function withAlternates(
  url: string,
  opts: { lastModified: Date; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number },
): MetadataRoute.Sitemap[number] {
  return {
    url,
    lastModified: opts.lastModified,
    changeFrequency: opts.changeFrequency,
    priority: opts.priority,
    alternates: {
      languages: {
        en: url,
        de: url,
        "x-default": url,
      },
    },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date("2026-02-15");

  const staticPages: MetadataRoute.Sitemap = [
    withAlternates(BASE, { lastModified: now, changeFrequency: "weekly", priority: 1.0 }),
    withAlternates(`${BASE}/creator`, { lastModified: now, changeFrequency: "monthly", priority: 0.9 }),
    withAlternates(`${BASE}/blog`, { lastModified: now, changeFrequency: "weekly", priority: 0.8 }),
    withAlternates(`${BASE}/routes`, { lastModified: now, changeFrequency: "weekly", priority: 0.8 }),
    withAlternates(`${BASE}/guide`, { lastModified: now, changeFrequency: "weekly", priority: 0.9 }),
    withAlternates(`${BASE}/store`, { lastModified: now, changeFrequency: "daily", priority: 0.9 }),
    withAlternates(`${BASE}/leaderboard`, { lastModified: now, changeFrequency: "daily", priority: 0.8 }),
    withAlternates(`${BASE}/roadmap`, { lastModified: now, changeFrequency: "weekly", priority: 0.7 }),
    withAlternates(`${BASE}/changelog`, { lastModified: now, changeFrequency: "weekly", priority: 0.7 }),
    withAlternates(`${BASE}/datenschutz`, { lastModified: now, changeFrequency: "yearly", priority: 0.3 }),
    withAlternates(`${BASE}/impressum`, { lastModified: now, changeFrequency: "yearly", priority: 0.3 }),
    withAlternates(`${BASE}/transparenz`, { lastModified: now, changeFrequency: "yearly", priority: 0.4 }),
    withAlternates(`${BASE}/transparency`, { lastModified: now, changeFrequency: "yearly", priority: 0.4 }),
  ];

  const blogPages: MetadataRoute.Sitemap = getAllBlogSlugs().map((slug) =>
    withAlternates(`${BASE}/blog/${slug}`, { lastModified: now, changeFrequency: "monthly", priority: 0.7 }),
  );

  const routePages: MetadataRoute.Sitemap = getAllRouteSlugs().map((slug) =>
    withAlternates(`${BASE}/routes/${slug}`, { lastModified: now, changeFrequency: "monthly", priority: 0.7 }),
  );

  const guidePages: MetadataRoute.Sitemap = getAllSeoSlugs().map((slug) =>
    withAlternates(`${BASE}/guide/${slug}`, { lastModified: now, changeFrequency: "monthly", priority: 0.8 }),
  );

  return [...staticPages, ...blogPages, ...routePages, ...guidePages];
}
