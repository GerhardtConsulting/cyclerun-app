---
description: How to add a new SEO guide page to CycleRun (bilingual EN+DE)
---

# Add a New SEO Guide

## Schema & File Locations
- **Data file**: `lib/seo-pages-content.ts` — all guide content lives here
- **Interface**: `SeoPage` in `lib/seo-pages-data.ts`
- **Client component**: `components/GuideDetailContent.tsx` — renders locale-aware content
- **Server page**: `app/guide/[slug]/page.tsx` — generates metadata + static params + Schema.org

## Current Interface (NO DE fields yet — see TODO below)
```typescript
interface SeoPage {
  slug: string;
  title: string;       // <title> tag
  h1: string;          // Main heading
  description: string; // Meta description
  keywords: string;    // Meta keywords
  faqs: SeoFaq[];      // { q: string; a: string }[]
  content: string;     // Markdown body
}
```

## Steps

1. **Open `lib/seo-pages-content.ts`** and add a new entry to the `seoPages` array:

```typescript
{
  slug: "your-guide-slug",
  title: "SEO Title — Keyword Phrase | CycleRun.app",
  h1: "Primary H1 with Target Keyword",
  description: "Meta description with target keyword, max 160 chars. Include CTA.",
  keywords: "primary keyword, secondary keyword, long-tail keyword, german keyword",
  faqs: [
    { q: "Question with target keyword?", a: "Detailed answer (2-4 sentences). Include relevant keywords naturally." },
    { q: "Second question?", a: "Answer." },
    // 5-8 FAQs recommended for rich snippets
  ],
  content: `## First Section Heading

Content in markdown format. Use **bold** for keywords.
Supports: ## h2, ### h3, **bold**, [links](url), - lists, | tables |

## Second Section

More content...

[Try CycleRun free →](https://cyclerun.app)`,
}
```

2. **Schema.org**: FAQ schema and Article schema are auto-generated in `app/guide/[slug]/page.tsx`.

3. **Build and test**:
// turbo
```bash
cd /Users/dev/CascadeProjects/cyclerun-next && npx next build
```

4. **Sitemap**: Automatically included via `getAllSeoSlugs()` in `app/sitemap.ts`.

5. **Commit and push**:
```bash
git add -A && git commit -m "content: add guide — your-guide-title" && git push
```

## ⚠️ KNOWN GAP: German Translations for Guides
The `SeoPage` interface does NOT yet have `_de` fields. This is one of the biggest remaining i18n gaps.

To fix this properly, you need to:
1. Extend `SeoPage` interface in `lib/seo-pages-data.ts` with optional DE fields:
   ```typescript
   h1_de?: string;
   description_de?: string;
   faqs_de?: SeoFaq[];
   content_de?: string;
   ```
2. Add DE content for all 9 existing guides in `lib/seo-pages-content.ts`
3. Update `components/GuideDetailContent.tsx` to use `isDE ? (page.h1_de || page.h1) : page.h1` pattern

This is a large content task (~5,000+ words of German guide content across 9 guides).

## SEO Checklist for New Guides
- [ ] Title contains primary keyword
- [ ] H1 is different from title but contains keyword
- [ ] Description is 120-160 chars with keyword and CTA
- [ ] 5-8 FAQ items (triggers Google rich snippets)
- [ ] Content has 800+ words with keyword density ~1-2%
- [ ] Internal links to related guides, routes, blog posts
- [ ] CTA link to cyclerun.app at the end
