---
description: i18n checklist — ensure all new content has proper DE translations
---

# i18n Translation Checklist

Use this checklist whenever adding or modifying content to ensure bilingual completeness.

## For Every New Page or Content Addition

### 1. UI Text (t() keys)
- [ ] All visible UI text uses `t("key")` — no hardcoded English strings
- [ ] Both EN and DE translations added to `lib/i18n.ts`
- [ ] Component uses `useLocale()` hook to re-render on language switch
- [ ] Component has `"use client"` directive if using `t()` or `useLocale()`

### 2. Data Content (blog, routes, guides)
- [ ] EN fields filled: `title`, `description`, `content`
- [ ] DE fields filled: `title_de`, `description_de`, `content_de`
- [ ] DE content is a full translation, not a summary or abbreviation
- [ ] Category/readTime/location fields also have `_de` variants

### 3. SEO Metadata (server page)
- [ ] `<title>` tag set via `export const metadata`
- [ ] `description` meta tag (max 160 chars)
- [ ] `keywords` meta tag (include both EN and DE terms)
- [ ] `canonical` URL set via `alternates.canonical`
- [ ] OpenGraph title + description
- [ ] Twitter card title + description

### 4. Schema.org (structured data)
- [ ] Appropriate schema type (Article, FAQPage, SportsEvent, BlogPosting, etc.)
- [ ] BreadcrumbList for hierarchical pages
- [ ] FAQ schema for pages with FAQ sections (enables rich snippets)

### 5. Sitemap
- [ ] New page slug included via `getAll*Slugs()` in `app/sitemap.ts`
- [ ] If new page type: add dynamic generation to sitemap.ts

### 6. SubpageFooter + SubpageNav
- [ ] Page includes `<SubpageFooter />` at bottom
- [ ] Page includes `<SubpageNav />` at top with correct right-side link

## Architecture Pattern

Server page (app/*/page.tsx):
- `export const metadata` — SEO stays server-rendered
- Schema.org JSON-LD scripts
- Renders `<ClientContent />` component

Client content component (components/*Content.tsx):
- `"use client"` directive
- `useLocale()` hook for reactive updates
- `t("key")` for UI text
- `isDE ? (field_de || field) : field` for data content
- Imports SubpageNav + SubpageFooter

## File Reference
| File | Purpose |
|------|---------|
| `lib/i18n.ts` | All translation keys (EN + DE) |
| `lib/useLocale.ts` | React hook for locale changes |
| `lib/blog-data.ts` | Blog post data with DE fields |
| `lib/route-data.ts` | Route data with DE fields |
| `lib/seo-pages-data.ts` | Guide interface + helpers |
| `lib/seo-pages-content.ts` | Guide content (EN only — DE TODO) |
| `components/SubpageNav.tsx` | Shared nav with i18n |
| `components/SubpageFooter.tsx` | Shared footer with i18n |
