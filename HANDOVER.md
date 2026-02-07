# CycleRun.app — Handover & Status Notes

> Last updated: Feb 7, 2026
> For use by future Cascade sessions and developers.

---

## 1. Project Overview

**Tech stack**: Next.js 16 (App Router, Turbopack), React 19, TypeScript, Supabase, Vercel  
**Domain**: https://cyclerun.app  
**Mail domain**: mail.cyclerun.app (Resend, verified — SPF + MX + DKIM)  
**Repo**: https://github.com/GerhardtConsulting/cyclerun-app.git (branch: `main`)  
**i18n**: Client-side, EN (default) + DE, via `lib/i18n.ts` + `useLocale()` hook  
**Admin email**: maximiliangerhardtofficial@gmail.com  
**Physical address**: Maximilian Gerhardt · c/o Impressumservice Dein-Impressum · Stettiner Str. 41 · 35410 Hungen · Deutschland

---

## 2. Email System — DSGVO/GDPR Compliant

### Status: ✅ Fully Operational

**Sender**: `CycleRun.app <noreply@mail.cyclerun.app>` (via Resend)  
**Domain**: `mail.cyclerun.app` — verified (SPF, MX, DKIM records on Namecheap)

### Templates (`lib/email-templates.ts`)

All 5 templates are bilingual (DE+EN), DSGVO compliant, dark bento-box style:

| Template | Function | Purpose | Trigger |
|----------|----------|---------|---------|
| Newsletter Confirm (DOIP) | `newsletterConfirmEmail()` | Double opt-in confirmation | `/api/newsletter` |
| Newsletter Welcome | `newsletterWelcomeEmail()` | Post-confirmation welcome | `/api/newsletter/confirm` |
| Registration Welcome | `registrationWelcomeEmail()` | Account created | `lib/cycling-simulator.ts` |
| Creator Application | `creatorApplicationEmail()` | Application received | `/api/creator/apply` |
| Admin Notification | `adminNotificationEmail()` | Internal event alerts | `/api/admin/notify` |

### DSGVO Compliance Checklist

| Requirement | Status |
|-------------|--------|
| Physical address in footer (§ 5 DDG) | ✅ All emails |
| Impressum link | ✅ All emails |
| Datenschutz link | ✅ All emails |
| Unsubscribe link (marketing emails) | ✅ Newsletter welcome, registration welcome |
| Reason for receiving (opt-in basis) | ✅ All emails — explicit reason text in footer |
| DOIP 48h auto-delete disclaimer | ✅ Newsletter confirm email |
| Data deletion info | ✅ Registration welcome (datenschutz@cyclerun.app) |
| `List-Unsubscribe` header | ✅ Newsletter welcome email |

### Design System

- **Layout**: Dark card (#111111) on #050505 background, gradient accent bar (gold→orange→red)
- **Font stack**: `-apple-system,BlinkMacSystemFont,Inter,Segoe UI,Roboto,sans-serif` (no quotes — critical for email clients)
- **All units in px** (not rem — email client compatibility)
- **Text colors**: #fafaf9 (headlines), #d6d3d1 (body), #a8a29e (labels), #78716c (muted/footer)
- **CTA**: Orange gradient (#f97316→#ea580c), white text, 12px border-radius
- **Zero emojis** — gradient step numbers, color-coded admin events instead
- **Shared styles**: `S` object + `F` font-stack constant (line ~94 in email-templates.ts)

### QA Script

```bash
npx tsx scripts/render-emails.ts    # Renders all 11 templates (DE+EN) to email-preview/
```

Outputs HTML files to `email-preview/` directory for visual inspection before sending.

### Known Email Pitfalls (for future devs)

1. **Never use double quotes in font-family names** inside template literals — breaks `style=""` HTML attributes
2. **Never use `rem`** — use `px` only (Outlook, older Gmail ignore rem)
3. **Always set explicit `color` on `<a>` tags** — email clients default to blue
4. **Test with `scripts/render-emails.ts`** before sending — inspect the HTML files

---

## 3. SEO Audit — Current Status

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

### Remaining Architecture Notes

| Item | Note |
|------|------|
| Server metadata on all pages | Titles/descriptions are EN-only in `export const metadata` — acceptable for SSG + client-side i18n |
| Sitemap (`app/sitemap.ts`) | No per-URL `hreflang` — acceptable since global `<link>` tags handle this |

---

## 4. Critical Gaps & TODOs

### 🔴 HIGH PRIORITY

1. **robots.txt / noindex** — Currently ALL crawling is blocked:
   - `app/robots.ts`: `disallow: ["/"]`
   - `app/layout.tsx:16`: `robots: "noindex, nofollow"`
   - **Action**: Re-enable once Google Search Console + Analytics are set up
   - Change robots.ts to `allow: ["/"]` and metadata to `"index, follow"`

2. **Remove `/api/test-email` endpoint** before production launch (security)

3. **Set Vercel environment variables** (if not already done):
   - `RESEND_API_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_EMAIL` (= maximiliangerhardtofficial@gmail.com)
   - `ADMIN_SECRET` (admin dashboard password)
   - `NEXT_PUBLIC_APP_URL` (= https://cyclerun.app)

4. **Email forwarding**: Set up `kontakt@cyclerun.app` → Gmail forwarding

### 🟡 MEDIUM PRIORITY

5. **Server-side metadata DE** — Page titles/descriptions in `export const metadata` are EN only
   - Since locale is client-side (localStorage), server can't know language at build time
   - Long-term: Consider Next.js middleware + cookie-based locale for server-aware i18n

6. **Update Datenschutz page** with full responsible address (matches Impressum)

### 🟢 LOW PRIORITY / FUTURE

7. **JSON-LD FAQ on home page** — Only in English, not locale-aware (`layout.tsx:60-72`)
8. **Pair page** — `/pair` has no metadata export and minimal SEO (internal tool page)

---

## 5. Architecture Reference

### i18n System

```
lib/i18n.ts          → Translation keys (EN + DE), t() function, locale management
lib/useLocale.ts     → React hook: useLocale() — re-renders on language switch
localStorage key     → "cyclerun_lang" (persisted choice)
Detection            → navigator.language → localStorage override
Switcher             → Flag buttons in app UI call setLocale()
```

### Email System

```
lib/email-templates.ts       → All 5 templates + wrapper + BRAND config
  ├─ BRAND                   → baseUrl, from address, physical address
  ├─ F                       → Font stack constant (no quotes)
  ├─ S                       → Shared inline styles object (all px)
  ├─ wrapper()               → HTML shell: gradient bar, logo, DSGVO footer
  ├─ newsletterConfirmEmail() → DOIP with 48h disclaimer
  ├─ newsletterWelcomeEmail() → Bento grid, unsubscribe
  ├─ registrationWelcomeEmail() → 3-col bento, data deletion notice
  ├─ creatorApplicationEmail() → Numbered steps, recording guide CTA
  └─ adminNotificationEmail() → Color-coded events (standalone HTML, no wrapper)

scripts/render-emails.ts     → QA: renders all 11 templates to email-preview/

API Routes:
  app/api/newsletter/route.ts          → Subscribe (sends confirm email)
  app/api/newsletter/confirm/route.ts  → Confirm (sends welcome email + admin notify)
  app/api/newsletter/unsubscribe/route.ts → Unsubscribe
  app/api/creator/apply/route.ts       → Creator application (sends confirmation + admin notify)
  app/api/admin/notify/route.ts        → Internal admin notification endpoint
  app/api/test-email/route.ts          → ⚠️ TEST ONLY — remove before launch
```

### Content Data Files

```
lib/blog-data.ts           → BlogPost[] — 3 posts, full EN+DE
lib/route-data.ts          → RouteData[] — 5 routes, full EN+DE
lib/seo-pages-content.ts   → SeoPage[] — 9 guides, full EN+DE
lib/seo-pages-data.ts      → Interface + helper functions
```

### Page Architecture Pattern

```
app/blog/[slug]/page.tsx          → Server: metadata + JSON-LD
  └─ BlogPostContent.tsx          → Client: "use client" + useLocale() + t()
       ├─ SubpageNav.tsx          → Client: locale-aware navigation
       └─ SubpageFooter.tsx       → Client: locale-aware footer
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

## 6. Windsurf Workflows

The following workflows are available in `.windsurf/workflows/`:

| Command | Description |
|---------|-------------|
| `/new-blog-post` | Step-by-step guide to add a bilingual blog post |
| `/new-route` | Step-by-step guide to add a bilingual cycling route |
| `/new-guide` | Step-by-step guide to add an SEO guide (includes DE gap warning) |
| `/i18n-checklist` | Checklist to verify i18n completeness for any new content |

---

## 7. Environment & Deployment

### Required Env Vars (Vercel / .env.local)

| Variable | Purpose | Server/Client |
|----------|---------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Client |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key | Client |
| `NEXT_PUBLIC_APP_URL` | Base URL (https://cyclerun.app) | Client |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role | Server only |
| `RESEND_API_KEY` | Resend email service | Server only |
| `ADMIN_EMAIL` | Admin notification recipient | Server only |
| `ADMIN_SECRET` | Admin dashboard password | Server only |

### Database (Supabase)

| Table | Purpose |
|-------|---------|
| `registrations` | User profiles + stats |
| `sessions` | Ride history |
| `newsletter_subscribers` | DSGVO double opt-in (confirm_token, confirmed_at) |
| `feature_requests` | Roadmap feature ideas |
| `feature_votes` | User votes on features |
| `creators` | Creator applications |
| `waitlist` | Waitlist signups |

### DNS (Namecheap)

| Record | Type | Host | Value |
|--------|------|------|-------|
| SPF | TXT | mail | `v=spf1 include:amazonses.com ~all` |
| MX | MX | mail | `feedback-smtp.us-east-1.amazonses.com` (priority 10) |
| DKIM | TXT | resend._domainkey.mail | Resend DKIM key |

### Build & Deploy

```bash
npx next build          # Build (Turbopack)
git push origin main    # Triggers Vercel auto-deploy
```

---

## 8. Session History

### Feb 7, 2026 — Email Template Redesign

**What was done:**
- Verified Resend domain (mail.cyclerun.app) — SPF, MX, DKIM all verified
- Rewrote all 5 email templates: premium dark bento-box design, DSGVO compliant
- Fixed critical rendering bug: double quotes in font-family broke `style=""` attributes
- Converted all `rem` → `px` for email client compatibility
- Created QA script (`scripts/render-emails.ts`) for template inspection
- Sent test emails to Gmail — all 5 delivered successfully
- Updated Impressum with physical address (§ 5 DDG)

**Bug found & fixed:**
- Font-family names like `"Inter"` used double quotes inside template literal strings
- When interpolated into `style="${S.h1}"`, the inner quotes broke the HTML attribute
- Result: all inline styles ignored → black text on dark background, blue links
- Fix: removed all quotes from font-family names, used `F` constant

### Previous Sessions
- SEO audit + full DE translations (all pages, guides, blog, routes)
- Schema.org structured data (WebApp, FAQ, Blog, Routes, Creator)
- hreflang + OpenGraph locale
- Supabase integration (registrations, sessions, newsletter, creators)
- Admin dashboard + notification system
