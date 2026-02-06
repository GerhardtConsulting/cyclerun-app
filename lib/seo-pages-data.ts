export interface SeoFaq {
  q: string;
  a: string;
}

export interface SeoPage {
  slug: string;
  title: string;
  h1: string;
  description: string;
  keywords: string;
  faqs: SeoFaq[];
  content: string;
}

import { seoPages } from "./seo-pages-content";
export { seoPages };

export function getSeoPage(slug: string): SeoPage | undefined {
  return seoPages.find((p: SeoPage) => p.slug === slug);
}

export function getAllSeoSlugs(): string[] {
  return seoPages.map((p: SeoPage) => p.slug);
}
