# CycleRun.app — Handover & Status Notes

> Last updated: Feb 6, 2026
> For use by future Cascade sessions and developers.

---

## 1. Project Overview

**Tech stack**: Next.js 16 (App Router, Turbopack), React 19, TypeScript, Supabase, Vercel  
**Domain**: https://cyclerun.app  
**Repo**: https://github.com/GerhardtConsulting/cyclerun-app.git (branch: `main`)  
**i18n**: Client-side, EN (default) + DE, via `lib/i18n.ts` + `useLocale()` hook

---

## 2. SEO Audit — Current Status

### ✅ Fully Translated (EN + DE)

| Page | Server Metadata | Client Content | Schema.org | DE Data |
|------|:-:|:-:|:-:|:-:|
| `/` (Home/App) | ✅ | ✅ | ✅ WebApp, FAQ, Org | ✅ |
| `/blog` | ✅ | ✅ | ✅ Blog | ✅ |
| `/blog/[slug]` (3 posts) | ✅ | ✅ | ✅ BlogPosting, Breadcrumb | ✅ |
| `/routes` | ✅ | ✅ | ✅ ItemList | ✅ |
| `/routes/[slug]` (5 routes) | ✅ | ✅ | ✅ SportsEvent, Breadcrumb | ✅ |
| `/creator` | ✅ | ✅ | ✅ WebPage, HowTo, FAQ, Breadcrumb | ✅ |
| `/roadmap` | ✅ | ✅ | ✅ WebPage | ✅ |
| `/datenschutz` | ✅ (DE native) | ✅ | — | n/a (DE only) |
| `/impressum` | ✅ (DE native) | ✅ | — | n/a (DE only) |

### ⚠️ Partially Translated

*None — all pages now have full DE translations.*

### ✅ Fixed (Previously Not i18n-Aware)

| Item | Status |
|------|--------|
| `<html lang>` | ✅ **Dynamic** via `LocaleSync` component — syncs with active locale on client |
| `hreflang` alternates | ✅ Added `<link rel="alternate" hreflang="en/de/x-default">` in layout head |
| OpenGraph locale | ✅ Added `alternateLocale: "de_DE"` |
| Blog dates | ✅ Locale-aware formatting (`formatDate()` with `de-DE` / `en-US`) |
| Guide content (9 pages) | ✅ Full DE translations (h1, description, FAQs, body) |

### Remaining Architecture Notes

| Item | Note |
|------|------|
| Server metadata on all pages | Titles/descriptions are EN-only in `export const metadata` — acceptable for SSG + client-side i18n |
| Sitemap (`app/sitemap.ts`) | No per-URL `hreflang` — acceptable since global `<link>` tags handle this |

---

## 3. Critical Gaps & TODOs

### 🔴 HIGH PRIORITY

1. ~~**Guide content DE translations**~~ ✅ DONE — All 9 guides fully translated

2. ~~**`<html lang>` dynamic**~~ ✅ DONE — `LocaleSync` component sets it dynamically

3. **robots.txt / noindex** — Currently ALL crawling is blocked:
   - `app/robots.ts`: `disallow: ["/"]`
   - `app/layout.tsx:16`: `robots: "noindex, nofollow"`
   - **Action**: Re-enable once Google Search Console + Analytics are set up
   - Change robots.ts to `allow: ["/"]` and metadata to `"index, follow"`

4. **Impressum address** — Placeholder text ("Adresse folgt in den nächsten Tagen")
   - User bought a physical address but is waiting on delivery
   - Update `app/impressum/page.tsx` with full address once received

### 🟡 MEDIUM PRIORITY

5. ~~**Sitemap hreflang**~~ ✅ DONE — Added global `<link rel="alternate" hreflang>` tags in layout head

6. **Server-side metadata DE** — Page titles/descriptions in `export const metadata` are EN only
   - Since locale is client-side (localStorage), server can't know language at build time
   - This is architecturally correct for SSG — but limits DE-specific title tags in SERPs
   - Long-term: Consider Next.js middleware + cookie-based locale for server-aware i18n

7. ~~**Blog post dates**~~ ✅ DONE — `formatDate()` now uses `de-DE` / `en-US` locale formatting

### 🟢 LOW PRIORITY / FUTURE

8. ~~**OpenGraph locale**~~ ✅ DONE — Added `alternateLocale: "de_DE"`
   
9. **JSON-LD FAQ on home page** — Only in English, not locale-aware
   - `layout.tsx:60-72` has hardcoded English FAQ schema

10. **Pair page** — `/pair` has no metadata export and minimal SEO (internal tool page, low priority)

---

## 4. Architecture Reference

### i18n System

```
lib/i18n.ts          → Translation keys (EN + DE), t() function, locale management
lib/useLocale.ts     → React hook: useLocale() — re-renders on language switch
localStorage key     → "cyclerun_lang" (persisted choice)
Detection            → navigator.language → localStorage override
Switcher             → Flag buttons in app UI call setLocale()
```

### Content Data Files

```
lib/blog-data.ts           → BlogPost[] — 3 posts, full EN+DE
lib/route-data.ts          → RouteData[] — 5 routes, full EN+DE
lib/seo-pages-content.ts   → SeoPage[] — 9 guides, EN ONLY (DE gap!)
lib/seo-pages-data.ts      → Interface + helper functions
```

### Page Architecture Pattern

```
app/blog/[slug]/page.tsx          → Server: metadata + JSON-LD
  └─ BlogPostContent.tsx          → Client: "use client" + useLocale() + t()
       ├─ SubpageNav.tsx          → Client: locale-aware navigation
       └─ SubpageFooter.tsx       → Client: locale-aware footer
```

### Sitemap Generation

```
app/sitemap.ts → Imports getAllBlogSlugs(), getAllRouteSlugs(), getAllSeoSlugs()
                 Automatically includes all dynamic content
                 Add new slugs to data files → sitemap updates automatically
```

### Schema.org Usage

| Page | Schema Types |
|------|-------------|
| Layout (global) | WebApplication, FAQPage, Organization |
| `/blog` | Blog |
| `/blog/[slug]` | BlogPosting, BreadcrumbList |
| `/routes` | ItemList |
| `/routes/[slug]` | SportsEvent, BreadcrumbList |
| `/guide/[slug]` | FAQPage, BreadcrumbList, Article |
| `/creator` | WebPage, HowTo, FAQPage, BreadcrumbList |
| `/roadmap` | WebPage |

---

## 5. Windsurf Workflows

The following workflows are available in `.windsurf/workflows/`:

| Command | Description |
|---------|-------------|
| `/new-blog-post` | Step-by-step guide to add a bilingual blog post |
| `/new-route` | Step-by-step guide to add a bilingual cycling route |
| `/new-guide` | Step-by-step guide to add an SEO guide (includes DE gap warning) |
| `/i18n-checklist` | Checklist to verify i18n completeness for any new content |

---

## 6. Environment & Deployment

### Required Env Vars (Vercel / .env.local)
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon/public key
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role (server-only)
- `RESEND_API_KEY` — Resend email service (newsletter double opt-in)

### Database (Supabase)
- `registrations` — User profiles + stats
- `sessions` — Ride history
- `newsletter_subscribers` — DSGVO double opt-in
- `feature_requests` — Roadmap feature ideas
- `feature_votes` — User votes on features

### Build & Deploy
```bash
npx next build          # Build (Turbopack)
git push origin main    # Triggers Vercel auto-deploy
```

---

## 7. Immediate Next Steps (Priority Order)

1. **Set up Google Search Console + Analytics** → then re-enable crawling (robots.ts + metadata)
2. **Update Impressum** with physical address once received
3. ~~**Translate 9 guide pages** to German~~ ✅ DONE
4. ~~**Make `<html lang>` dynamic**~~ ✅ DONE
5. ~~**hreflang alternates**~~ ✅ DONE
