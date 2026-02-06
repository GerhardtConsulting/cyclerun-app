export interface SeoFaq {
  q: string;
  a: string;
}

export interface SeoPage {
  slug: string;
  title: string;
  title_de?: string;
  h1: string;
  h1_de?: string;
  description: string;
  description_de?: string;
  keywords: string;
  faqs: SeoFaq[];
  faqs_de?: SeoFaq[];
  content: string;
  content_de?: string;
}

import { seoPages } from "./seo-pages-content";
export { seoPages };

export function getSeoPage(slug: string): SeoPage | undefined {
  return seoPages.find((p: SeoPage) => p.slug === slug);
}

export function getAllSeoSlugs(): string[] {
  return seoPages.map((p: SeoPage) => p.slug);
}
