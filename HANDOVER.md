# CycleRun.app — Projekt-Dokumentation

> **Version**: 0.10.0 · **Stand**: 8. Februar 2026  
> Vollständige Übersicht über Architektur, Features, SEO, Datenbank und Status.

---

## 1. Projekt-Übersicht

| | |
|-|-|
| **Tech Stack** | Next.js 16.1.6 (App Router, Turbopack), React 19.2.3, TypeScript 5, Supabase, Vercel |
| **Domain** | https://cyclerun.app |
| **Mail Domain** | mail.cyclerun.app (Resend — SPF + MX + DKIM verifiziert) |
| **Repository** | https://github.com/GerhardtConsulting/cyclerun-app.git (`main`) |
| **Supabase** | Projekt-ID: `yuxkujcnsrrkwbvftkvq` |
| **i18n** | Client-side, EN (default) + DE, via `lib/i18n.ts` + `useLocale()` Hook |
| **Admin** | maximiliangerhardtofficial@gmail.com |
| **Impressum** | Maximilian Gerhardt · c/o Impressumservice Dein-Impressum · Stettiner Str. 41 · 35410 Hungen |

### Dependencies

```
next 16.1.6, react 19.2.3, @supabase/supabase-js 2.95.2, @supabase/ssr 0.8.0
resend 6.9.1, qrcode 1.5.4, babel-plugin-react-compiler 1.0.0
```

---

## 2. Seiten-Übersicht & URL-Struktur

### Statische Seiten

| URL | Typ | Komponente | Metadata | Schema.org |
|-----|-----|-----------|----------|------------|
| `/` | ○ Static | `CycleRunApp.tsx` | ✅ WebApp, OG, Twitter | WebApplication, FAQPage, Organization |
| `/creator` | ○ Static | `CreatorContent.tsx` | ✅ | WebPage, HowTo, FAQPage, BreadcrumbList |
| `/creator/dashboard` | ○ Static | `CreatorDashboardContent.tsx` | ✅ | — |
| `/store` | ○ Static | `StoreContent.tsx` | ✅ OG | — |
| `/blog` | ○ Static | `BlogIndexContent.tsx` | ✅ | Blog |
| `/guide` | ○ Static | `GuideIndexContent.tsx` | ✅ | — |
| `/routes` | ○ Static | `RoutesIndexContent.tsx` | ✅ | ItemList |
| `/profile` | ○ Static | `ProfileContent.tsx` | ✅ | — |
| `/leaderboard` | ○ Static | `LeaderboardContent.tsx` | ✅ | — |
| `/roadmap` | ○ Static | `RoadmapContent.tsx` | ✅ | WebPage |
| `/changelog` | ○ Static | `ChangelogContent.tsx` | ✅ | — |
| `/pair` | ○ Static | `pair/page.tsx` | — | — |
| `/tv` | ○ Static | `tv/page.tsx` | — | — |
| `/datenschutz` | ○ Static | `DatenschutzContent.tsx` | ✅ (DE) | — |
| `/impressum` | ○ Static | inline | ✅ (DE) | — |

### Dynamische Seiten (SSG mit `generateStaticParams`)

| URL-Muster | Anzahl | Slugs | Schema.org |
|------------|--------|-------|------------|
| `/blog/[slug]` | 3 | `best-indoor-cycling-routes-2026`, `gopro-settings-pov-cycling-video`, `cyclerun-vs-zwift-comparison` | BlogPosting, BreadcrumbList |
| `/routes/[slug]` | 5 | `mallorca-cap-de-formentor`, `stelvio-pass-italy`, `pacific-coast-highway-california`, `alpe-d-huez-france`, `trollstigen-norway` | SportsEvent, BreadcrumbList |
| `/guide/[slug]` | 9 | `zwift-alternative-free`, `indoor-cycling-app`, `heimtrainer-app`, `exercise-bike-app`, `spinning-bike-app`, `virtual-cycling-videos`, `indoor-cycling-without-smart-trainer`, `ergometer-training`, `rouvy-alternative` | FAQPage, BreadcrumbList, Article |

### Dynamische Seiten (Server-Rendered)

| URL-Muster | Komponente | Beschreibung |
|------------|-----------|--------------|
| `/store/[id]` | `StoreRouteContent.tsx` | Einzelne Creator-Route (DB-basiert) |
| `/u/[slug]` | `PublicProfileContent.tsx` | Öffentliches Nutzerprofil (DB-basiert) |

### API Routes

| Route | Methode | Zweck |
|-------|---------|-------|
| `/api/newsletter` | POST | Newsletter-Anmeldung (DOIP) |
| `/api/newsletter/confirm` | GET | Double-Opt-In Bestätigung |
| `/api/newsletter/unsubscribe` | GET | Newsletter-Abmeldung |
| `/api/creator/apply` | POST | Creator-Bewerbung |
| `/api/admin/notify` | POST | Interne Admin-Benachrichtigungen |
| `/api/register` | POST | Nutzer-Registrierung (DOI-Flow) |
| `/api/admin/stats` | GET | Admin-Dashboard Statistiken |
| `/api/routes/unlock` | POST | Route mit Credits freischalten |
| `/api/cron/engagement` | GET | Tägliche Engagement-Emails (09:00 UTC) |
| `/api/cron/weekly-summary` | GET | Wöchentliche Zusammenfassung (So 18:00 UTC) |
| `/api/test-email` | GET | ⚠️ **NUR TEST — vor Launch entfernen** |

---

## 3. Sitemap

`app/sitemap.ts` generiert automatisch alle URLs:

**11 statische Seiten**: `/`, `/creator`, `/blog`, `/routes`, `/guide`, `/roadmap`, `/changelog`, `/store`, `/creator/dashboard`, `/datenschutz`, `/impressum`  
**3 Blog-Posts**: `/blog/[slug]`  
**5 Routen**: `/routes/[slug]`  
**9 Guides**: `/guide/[slug]`  
**= 28 URLs in der Sitemap**

Nicht in Sitemap (absichtlich): `/pair`, `/tv`, `/profile`, `/leaderboard`, `/u/[slug]`, `/store/[id]`, `/admin`

---

## 4. Feature-Übersicht

### 4.1 Core App — Indoor Training Simulator

**Datei**: `lib/cycling-simulator.ts` (1.785 Zeilen) + `components/CycleRunApp.tsx` (844 Zeilen)

- **Webcam-basierte Bewegungserkennung** — RPM-Erkennung über Zonen-Setup
- **4-Schritt Setup-Wizard**: Kamera → Position → Zonen → Kalibrierung
- **Echtzeit-HUD**: Geschwindigkeit, RPM, Distanz, Zeit, Gang
- **Video-Synchronisation**: YouTube POV-Videos synchron zur Trittfrequenz
- **Ride Summary**: Statistiken, Gamification, Share-Card
- **Gear System**: 6-Gang Schaltung mit Tastatur/Touch
- **Cookie Consent**: Siehe Abschnitt 4.10 (zentrale Komponente in Root Layout)

### 4.2 Gamification System

- **Energy System**: 1/min + 10/km + Speed-Bonus + Daily Bonus × Streak-Multiplier (max ×1.5)
- **30 Badges** in 6 Kategorien (Distance, Duration, Speed, Streak, Sessions, Special)
- **8 Level**: 0 → 150.000 Energy
- **Streaks**: Tägliche konsekutive Fahrten, Streak-Freeze alle 7 Tage
- **DB-Trigger**: `process_session_gamification()` — AFTER INSERT auf `sessions`
- **Leaderboards**: Weekly, Monthly, All-Time (SQL Views)

### 4.3 Progressive Goal Capture

- **Phase 1** (nach 1. Fahrt): "Warum fährst du?" (4 Optionen, 1 Tap)
- **Phase 2** (nach 3. Fahrt): "Wie oft?" (4 Optionen)
- **Phase 3** (nach 5. Fahrt): Spezifisches Ziel (kontextabhängig)
- **Phase 4** (fortlaufend): Post-Ride Stimmung (5 Emojis)
- **Regeln**: Max 1 Prompt/Fahrt, 3× dismissed = nie wieder fragen
- **Dateien**: `lib/goal-capture.ts`, `ProfileContent.tsx` (Fortschrittsbalken)

### 4.4 Profil-System

| Feature | Beschreibung |
|---------|-------------|
| `/profile` | Stats, Badges, Streak, Level, Ziel-Fortschritt, Referral-Link, Avatar-Upload |
| `/u/[slug]` | Öffentliches Profil mit Stats, Badges, Like-Button |
| **Avatar** | Upload via Supabase Storage (`avatars` Bucket) |
| **Nickname + Slug** | Auto-generierte URL-sichere Slugs |
| **Public/Private Toggle** | Custom Toggle Switch |
| **Upvotes/Likes** | Andere Nutzer liken |

### 4.5 Referral & Credits System

- **Referral-Code**: Auto-generiert (8 Zeichen) bei Registrierung
- **Belohnung**: Referrer 50 Credits, Referred 25 Credits
- **RPC**: `process_referral()` — validiert, verhindert Self-Referral + Duplikate
- **URL**: `cyclerun.app?ref=CODE`
- **Credits**: Verdient durch Referrals, ausgegeben für Route-Käufe

### 4.6 Creator Portal & Route Store

**Creator Dashboard** (`/creator/dashboard`):
- Ein-Klick Creator-Aktivierung (kein Approval nötig)
- Earnings-Übersicht (Gesamt, Route-Count, Sales)
- Upload-Formular: Titel EN+DE, Video-URL, Beschreibung, Highlights, GPX, Thumbnail, Preis
- 3 Pflicht-Checkboxen: Urheberrecht, Originalinhalt, AGB
- Route-Liste mit Status-Badges

**Route Store** (`/store`):
- Grid mit Thumbnail, Schwierigkeits-Badge, Preis, Creator-Avatar
- Filter: All / Easy / Moderate / Hard / Extreme
- Credit-Balance + gekaufte Routen markiert

**Route Detail** (`/store/[id]`):
- YouTube-Embed, Route-Stats, Creator-Card
- Kauf mit Credit-Validierung (Atomic RPC: 70% Creator / 30% Plattform)
- 5-Sterne Bewertung nach Kauf
- GPX-Download für freigeschaltete Routen

**Route Status Workflow**: `draft` → `pending_review` → `published` | `rejected` | `suspended`

### 4.7 Phone Pairing & TV Mode

**Phone Pairing** (`/pair`):
- QR-Code scannen → 4-stelliger Code → WebRTC P2P-Verbindung
- Signaling via Supabase REST (`pair_signals` Tabelle, 400ms Polling)
- Kamera-Vorschau auf Phone + Stream zum PC
- PC überspringt nach Pairing Step 1 → direkt zu Step 2

**TV Mode** (`/tv`):
- QR-Code generieren → Phone verbindet sich
- Wizard-Status-Sync via `pair_state` Tabelle (500ms Polling)
- Ride-HUD auf TV: Speed, RPM, Distanz, Zeit, Gang
- Webcam-Minimap während der Fahrt
- Smart-TV Auto-Detection via User-Agent

**Dateien**: `lib/phone-pairing.ts` — `PairingSender` (Phone) + `PairingReceiver` (PC/TV)

### 4.8 Cookie Consent & Google Analytics (GA4)

**⚠️ WICHTIG: Es gibt nur EINE Cookie-Consent-Implementierung — `components/CookieConsent.tsx` im Root Layout. KEINE weitere hinzufügen!**

**Komponente**: `components/CookieConsent.tsx` (eingebunden in `app/layout.tsx`)

- **Opt-In Only**: GA4 Script (G-WL522VY008) wird NUR nach aktivem Klick auf "Akzeptieren" geladen
- **Ohne Consent**: Kein Script, keine Cookies, kein Tracking
- **Banner**: Zwei Buttons — "Akzeptieren" / "Nur notwendige", DE/EN auto-detect
- **Consent-Storage**: `localStorage` → `cyclerun_cookie_consent` (Werte: `accepted` | `declined`)
- **IP-Anonymisierung**: `anonymize_ip: true`
- **Cookie Flags**: `SameSite=Lax;Secure`
- **Widerruf**: Globale Funktion `window.__cyclerunRevokeConsent()` + Button auf `/datenschutz`
- **Bei Widerruf**: GA-Script entfernt + alle `_ga`/`_gid`/`_gat` Cookies gelöscht

**Datenschutzseite** (`app/datenschutz/DatenschutzContent.tsx`):
- Abschnitt 7: Google Analytics (Umfang, Rechtsgrundlage, Empfänger, Speicherdauer, Widerruf)
- Live-Status-Anzeige + Widerruf-/Reaktivierungs-Button
- Cookie-Tabelle mit allen localStorage-Keys + GA-Cookies

**Rechtsgrundlagen**:
- Analyse-Cookies: Art. 6 Abs. 1 lit. a DSGVO + § 25 Abs. 1 TTDSG (Einwilligung)
- Technisch notwendig (localStorage): § 25 Abs. 2 TTDSG (kein Consent nötig)

### 4.9 Unified Navigation

**Site Header** (`SubpageNav.tsx`) — auf ALLEN Seiten:
- Logo (links) + Login-Button / User-Avatar + Hamburger ☰ (rechts)
- **Hamburger Slide-Out Menu**: Training, Mein Bereich, Entdecken, Rechtliches, Logout
- **Login Modal**: Email → Account-Lookup → localStorage Session
- **Creator Badge** im Menu wenn `is_creator = true`

**Site Footer** (`SubpageFooter.tsx`) — auf ALLEN Seiten identisch:
- 4 Spalten: Product, Guides, Resources, CycleRun
- CTA-Zeile + Copyright

### 4.10 Registration & Double-Opt-In (DOI)

**API**: `/api/register` (POST) — zentrale Registrierung für ALLE Einstiegspunkte

- **Einstiegspunkte** (alle nutzen `/api/register`):
  - `cycling-simulator.ts` → `handleRegistration()` (Registrierungs-Overlay)
  - `cycling-simulator.ts` → `handleSummaryClaim()` (Post-Ride Claim-Form)
- **Flow**: Registrierung → DOI-Email senden → Redirect zu `/confirm?status=pending`
- **DOI-Bestätigung**: `/api/newsletter/confirm` → `email_confirmed = true`
- **Login-Check**: `SubpageNav.tsx` + `UserMenu.tsx` prüfen `email_confirmed` vor Login

**⚠️ WICHTIG: Neue Registrierungs-Einstiegspunkte MÜSSEN `/api/register` nutzen — NIEMALS direkt in die DB schreiben!**

### 4.11 Email Engagement System

**Transaktionale Emails** (`lib/email-templates.ts` — 5 Templates):

| Template | Trigger |
|----------|---------|
| Newsletter Confirm (DOIP) | `/api/newsletter` |
| Newsletter Welcome | `/api/newsletter/confirm` |
| Registration Welcome | `cycling-simulator.ts` |
| Creator Application | `/api/creator/apply` |
| Admin Notification | `/api/admin/notify` |

**Engagement-Emails** (`lib/email-engagement.ts` — 15+ Templates):

| Typ | Templates |
|-----|-----------|
| Welcome Drip | Tag 1, 3, 7 nach Registrierung |
| Achievement | Badge earned, Level-Up, Streak-Milestone |
| Retention | 3d, 7d, 14d, 30d seit letzter Fahrt |
| Weight Loss Guide | 5-teilige Drip-Serie |
| Weekly Summary | Personalisierte Wochenstatistiken (Sonntags) |

**Cron Jobs** (Vercel):
- `/api/cron/engagement` — täglich 09:00 UTC
- `/api/cron/weekly-summary` — Sonntags 18:00 UTC
- Geschützt via `CRON_SECRET` Bearer Token
- Max 1 Email/User/Tag, Duplikat-Prävention via `email_log`

---

## 5. SEO-Status

### SEO-Architektur

**Zentrale Config**: `app/seo-config.tsx` — Single Source of Truth für:
- `SITE` Konstanten (Name, URL, Locales)
- `defaultMetadata` — Root-Metadata mit `title.template: "%s | CycleRun"`
- `<JsonLd />` — Wiederverwendbare Server-Komponente für Structured Data
- `makeAlternates(path)` — Generiert `canonical` + `languages` (en/de/x-default) pro Pfad
- `schemas.*` — Factory-Funktionen: `webApplication`, `organization`, `faqPage`, `breadcrumbs`, `blogPosting`, `sportsEvent`, `article`, `itemList`, `webPage`
- `homepageFaqs` — 7 FAQ-Einträge für Rich Results

### robots.ts

```
Allow: /
Disallow: /admin, /profile, /pair, /tv, /api/, /u/
Sitemap: https://cyclerun.app/sitemap.xml
```

### Schema.org Structured Data

| Seite | Schema-Typen |
|-------|-------------|
| Layout (global) | `WebApplication`, `FAQPage` (7 Fragen), `Organization` |
| `/blog` | `Blog` |
| `/blog/[slug]` | `BlogPosting`, `BreadcrumbList` |
| `/routes` | `ItemList` |
| `/routes/[slug]` | `SportsEvent`, `BreadcrumbList` |
| `/guide` | `CollectionPage` |
| `/guide/[slug]` | `FAQPage`, `BreadcrumbList`, `Article` |
| `/creator` | `WebPage`, `HowTo`, `FAQPage`, `BreadcrumbList` |
| `/roadmap` | `WebPage` |

### Metadata-Status

Alle Seiten nutzen `title.template: "%s | CycleRun"` — Brand-Suffix wird automatisch angefügt.

| Seite | `<title>` | `description` | `keywords` | `canonical` + hreflang | OG/Twitter |
|-------|:-:|:-:|:-:|:-:|:-:|
| `/` | ✅ | ✅ | ✅ | ✅ en/de/x-default | ✅ |
| `/blog` | ✅ | ✅ | ✅ | ✅ en/de/x-default | ✅ |
| `/blog/[slug]` | ✅ dynamisch | ✅ | ✅ | ✅ en/de/x-default | ✅ |
| `/routes` | ✅ | ✅ | ✅ | ✅ en/de/x-default | ✅ |
| `/routes/[slug]` | ✅ dynamisch | ✅ | ✅ | ✅ en/de/x-default | ✅ |
| `/guide` | ✅ | ✅ | ✅ | ✅ en/de/x-default | ✅ |
| `/guide/[slug]` | ✅ dynamisch | ✅ | ✅ | ✅ en/de/x-default | ✅ |
| `/creator` | ✅ | ✅ | ✅ | ✅ en/de/x-default | ✅ |
| `/store` | ✅ | ✅ | — | ✅ en/de/x-default | ✅ |
| `/store/[id]` | ✅ generisch | ✅ | — | ✅ | — |
| `/creator/dashboard` | ✅ | ✅ | — | ✅ | — |
| `/roadmap` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/changelog` | ✅ | ✅ | — | ✅ | ✅ |
| `/pair` | — | — | — | — | — |
| `/tv` | — | — | — | — | — |

### hreflang

Per-URL hreflang via `metadata.alternates.languages` (en/de/x-default) auf jeder Seite.
Zusätzlich: Sitemap enthält `<xhtml:link rel="alternate">` Tags für jede URL.

### OpenGraph Image

`app/opengraph-image.tsx` — dynamisch generiertes OG-Image für die gesamte Site.

---

## 6. Datenbank (Supabase)

### Tabellen

| Tabelle | Zweck | Wichtige Felder |
|---------|-------|----------------|
| `registrations` | Nutzerprofile + Stats | email, first_name, nickname, slug, avatar_url, is_public, is_creator, credits, level, total_energy, current_streak, longest_streak, last_ride_date, streak_freeze_available, referral_code, referred_by, creator_earnings |
| `sessions` | Fahrt-Historie | user_id, duration, distance, max_speed, avg_rpm, sport_type |
| `badges` | 30 Badge-Definitionen | name, category, condition (JSONB), icon |
| `user_badges` | Verdiente Badges | user_id, badge_id (unique) |
| `user_goals` | Progressive Ziele | user_id, primary_goal, frequency_target, specific_target, capture_phase, prompts_dismissed |
| `user_feedback` | Post-Ride Feedback | user_id, session_id, mood, energy, difficulty |
| `creator_routes` | Creator-hochgeladene Routen | title_en, title_de, description_en, description_de, video_url, thumbnail_url, gpx_url, distance, elevation, duration, difficulty, price_credits, status, stats |
| `route_purchases` | Kauf-Transaktionen | buyer_id, route_id, creator_id, credits_paid, creator_earnings (70%), platform_fee (30%) |
| `route_ratings` | Route-Bewertungen | user_id, route_id, rating (1-5) |
| `referrals` | Empfehlungen | referrer_id, referred_id, credits_awarded |
| `upvotes` | Profil-Likes | voter_id, target_user_id |
| `route_unlocks` | Freigeschaltete Routen | user_id, route_slug, credits_spent |
| `newsletter_subscribers` | DSGVO Double-Opt-In | email, confirm_token, confirmed_at |
| `feature_requests` | Roadmap Feature-Vorschläge | title, description, status |
| `feature_votes` | Feature-Votes | user_id, feature_id |
| `creators` | Creator-Bewerbungen | email, youtube_url, status |
| `email_log` | Gesendete Emails | user_id, template_key (unique für non-weekly) |
| `pair_signals` | WebRTC Signaling | code, type, payload |
| `pair_state` | TV-Mode State-Sync | code, state (JSONB) |
| `waitlist` | Warteliste | email |

### Leaderboard Views

| View | Zeitraum |
|------|----------|
| `leaderboard_weekly` | Aktuelle Woche |
| `leaderboard_monthly` | Aktueller Monat |
| `leaderboard_alltime` | Gesamt |

### DB Trigger

| Trigger | Event | Funktion |
|---------|-------|----------|
| `process_session_gamification()` | AFTER INSERT on `sessions` | Energy berechnen, Streak updaten, Badges prüfen, Level updaten |

### DB RPCs

| RPC | Zweck |
|-----|-------|
| `process_referral(code)` | Referral validieren + Credits vergeben |
| `purchase_route(buyer_id, route_id)` | Atomarer Kauf: Validierung, Credit-Abzug, 70/30 Split |

### Storage Buckets

| Bucket | Zugriff | Zweck |
|--------|---------|-------|
| `avatars` | Public Read | Nutzer-Profilbilder |
| `thumbnails` | Public Read | Creator Route-Thumbnails |
| `gpx` | Public Read | Creator Route-GPX-Dateien |

---

## 7. Architektur

### Datei-Struktur

```
app/
├─ layout.tsx                    → Root Layout, Metadata, JSON-LD, hreflang, CookieConsent
├─ page.tsx                      → Home (rendert CycleRunApp)
├─ globals.css                   → Alle Styles (111KB, Single-File)
├─ seo-config.tsx                → SEO Defaults, Schema-Generatoren, <JsonLd />
├─ sitemap.ts                    → Auto-generierte Sitemap (29 URLs, hreflang)
├─ robots.ts                     → ✅ allow all, disallow private routes
├─ opengraph-image.tsx           → Dynamisches OG-Image
├─ blog/[slug]/page.tsx          → SSG Blog-Posts (3)
├─ routes/[slug]/page.tsx        → SSG Cycling-Routes (5)
├─ guide/[slug]/page.tsx         → SSG SEO-Guides (9)
├─ store/[id]/page.tsx           → Dynamic Store-Route
├─ u/[slug]/page.tsx             → Dynamic Public Profile
├─ creator/dashboard/page.tsx    → Creator Dashboard
├─ pair/page.tsx                 → Phone Camera Pairing
├─ tv/page.tsx                   → TV Mode Display
├─ datenschutz/DatenschutzContent.tsx → Client: Consent-Status + Widerruf-Button
├─ api/                          → 11 API Routes (inkl. /api/register)
└─ ...weitere statische Seiten

components/
├─ CycleRunApp.tsx               → Haupt-App (Wizard, Ride, Summary, 42KB)
├─ SubpageNav.tsx                → Unified Header + Hamburger + Login (11KB)
├─ SubpageFooter.tsx             → Unified Footer (3KB)
├─ ProfileContent.tsx            → Profil-Seite (27KB)
├─ CreatorDashboardContent.tsx   → Creator Upload + Management (26KB)
├─ CreatorContent.tsx            → Creator Hub Landing (26KB)
├─ RoadmapContent.tsx            → Roadmap mit Voting (18KB)
├─ StoreRouteContent.tsx         → Store Einzelroute (15KB)
├─ CookieConsent.tsx             → DSGVO Cookie Consent + GA4 (6KB) ⚠️ EINZIGE Consent-Impl.
├─ StoreContent.tsx              → Store Übersicht (12KB)
├─ UserMenu.tsx                  → Legacy (ersetzt durch SubpageNav)
├─ PublicProfileContent.tsx      → Öffentliches Profil (10KB)
├─ LeaderboardContent.tsx        → Rangliste (8KB)
├─ ChangelogContent.tsx          → Changelog (4KB)
├─ ...weitere Content-Komponenten

lib/
├─ cycling-simulator.ts          → Core Simulator Engine (61KB, 1.785 Zeilen)
├─ i18n.ts                       → Übersetzungen EN+DE (51KB)
├─ email-engagement.ts           → 15+ Engagement-Email Templates (51KB)
├─ seo-pages-content.ts          → 9 SEO-Guides Inhalt (90KB)
├─ blog-data.ts                  → 3 Blog-Posts Inhalt (29KB)
├─ email-templates.ts            → 5 Transaktionale Email Templates (21KB)
├─ route-data.ts                 → 5 Cycling Routes Inhalt (13KB)
├─ changelog-data.ts             → Changelog Daten (13KB)
├─ phone-pairing.ts              → WebRTC Pairing Logic (13KB)
├─ goal-capture.ts               → Progressive Goal System (10KB)
├─ share-card.ts                 → Post-Ride Share-Card Generator (8KB)
├─ supabase.ts                   → Singleton Supabase Client
├─ seo-pages-data.ts             → SEO Page Interface + Helpers
└─ useLocale.ts                  → React Locale Hook
```

### Seiten-Architektur-Pattern

```
app/[route]/page.tsx             → Server: export metadata + JSON-LD Schema
  └─ [Route]Content.tsx          → Client: "use client" + useLocale() + t()
       ├─ <SubpageNav />         → Unified Header (Login + Hamburger)
       ├─ ...Seiteninhalt...
       └─ <SubpageFooter />      → Unified Footer (4 Spalten)
```

### i18n System

```
lib/i18n.ts          → ~1.200+ Übersetzungsschlüssel (EN + DE)
lib/useLocale.ts     → React Hook: useLocale() — Re-Render bei Sprachwechsel
localStorage         → "cyclerun_lang" (persistierte Wahl)
Detection            → navigator.language → localStorage Override
Switcher             → Flag-Buttons (EN/DE) in Splash + Wizard Header
```

### WebRTC Signaling (Phone Pairing)

```
Signaling: pair_signals Tabelle (Supabase REST, NICHT Realtime)
  ├─ Phone → "phone-joined" + "offer" (SDP)
  ├─ PC    → "answer" (SDP) + "ice-pc" (ICE Candidates)
  └─ Phone → "ice-phone" (ICE Candidates)
Polling: 400ms Intervall
State Sync: pair_state Tabelle, 500ms Polling (TV Mode)
STUN: Google STUN Server
```

**Wichtig**: Supabase Anon Key ist hardcoded in `phone-pairing.ts` (nicht via process.env), weil Vercel falsche Werte injiziert.

---

## 8. Email-System

### Transaktionale Emails (`lib/email-templates.ts`)

Alle 5 Templates: bilingual DE+EN, DSGVO-konform, Dark Bento-Box Design.

| Template | Funktion | Trigger |
|----------|----------|---------|
| Newsletter Confirm (DOIP) | `newsletterConfirmEmail()` | `/api/newsletter` |
| Newsletter Welcome | `newsletterWelcomeEmail()` | `/api/newsletter/confirm` |
| Registration Welcome | `registrationWelcomeEmail()` | `cycling-simulator.ts` |
| Creator Application | `creatorApplicationEmail()` | `/api/creator/apply` |
| Admin Notification | `adminNotificationEmail()` | `/api/admin/notify` |

### Design System (Emails)

- **Layout**: Dark Card (#111111) auf #050505, Gradient Accent Bar
- **Font Stack**: `-apple-system,BlinkMacSystemFont,Inter,Segoe UI,Roboto,sans-serif` (keine Anführungszeichen!)
- **Nur px-Einheiten** (kein rem — Email-Client-Kompatibilität)
- **CTA**: Orange Gradient (#f97316→#ea580c)

### DSGVO Compliance

| Anforderung | Status |
|-------------|--------|
| Physische Adresse im Footer (§ 5 DDG) | ✅ |
| Impressum-Link | ✅ |
| Datenschutz-Link | ✅ |
| Abmelde-Link (Marketing) | ✅ |
| Opt-In Grund | ✅ |
| DOIP 48h Auto-Delete Hinweis | ✅ |
| Datenlöschungs-Info | ✅ |
| `List-Unsubscribe` Header | ✅ |

### QA Script

```bash
npx tsx scripts/render-emails.ts    # Rendert alle 11 Templates (DE+EN) nach email-preview/
```

---

## 9. Security Headers & Deployment

### Vercel Config (`vercel.json`)

```json
Security Headers (alle Routen):
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(self), microphone=()

Cron Jobs:
  /api/cron/engagement     → 0 9 * * *    (täglich 09:00 UTC)
  /api/cron/weekly-summary → 0 18 * * 0   (Sonntags 18:00 UTC)
```

### Umgebungsvariablen

| Variable | Zweck | Typ |
|----------|-------|-----|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase URL | Client |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anon Key | Client |
| `NEXT_PUBLIC_APP_URL` | `https://cyclerun.app` | Client |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role | Server |
| `RESEND_API_KEY` | Resend Email | Server |
| `ADMIN_EMAIL` | Admin-Benachrichtigungen | Server |
| `ADMIN_SECRET` | Admin-Dashboard Passwort | Server |
| `CRON_SECRET` | Cron-Job Auth | Server |

### DNS (Namecheap)

| Typ | Host | Wert |
|-----|------|------|
| TXT | mail | `v=spf1 include:amazonses.com ~all` |
| MX | mail | `feedback-smtp.us-east-1.amazonses.com` (priority 10) |
| TXT | resend._domainkey.mail | Resend DKIM Key |

### Build & Deploy

```bash
npx next build          # Build (Turbopack)
git push origin main    # Vercel Auto-Deploy
```

---

## 10. Windsurf Workflows

| Befehl | Beschreibung |
|--------|-------------|
| `/new-blog-post` | Neuen bilingualen Blog-Post hinzufügen |
| `/new-route` | Neue Cycling-Route hinzufügen (EN+DE) |
| `/new-guide` | Neuen SEO-Guide hinzufügen (EN+DE) |
| `/i18n-checklist` | i18n-Vollständigkeit prüfen |

---

## 11. Duplikat-Vermeidung — Feature-Ownership

**⚠️ VOR jeder neuen Feature-Implementierung: Prüfe diese Liste!**

| Feature | Datei(en) | Hinweis |
|---------|-----------|--------|
| Cookie Consent | `components/CookieConsent.tsx` | Einzige Implementierung, eingebunden in `app/layout.tsx` |
| Google Analytics | `components/CookieConsent.tsx` | GA4 Script wird dort dynamisch geladen |
| Registrierung | `/api/register` Route | Alle Einstiegspunkte nutzen diese API |
| Login | `components/SubpageNav.tsx` | Login-Modal ist dort eingebaut |
| Navigation Header | `components/SubpageNav.tsx` | Einziger Header für ALLE Seiten |
| Navigation Footer | `components/SubpageFooter.tsx` | Einziger Footer für ALLE Seiten |
| User Menu | `components/SubpageNav.tsx` | Hamburger-Menu (UserMenu.tsx = Legacy, kann gelöscht werden) |
| Datenschutz | `app/datenschutz/DatenschutzContent.tsx` | Client-Component mit Consent-Widerruf |
| Email Templates | `lib/email-templates.ts` (transaktional) + `lib/email-engagement.ts` (engagement) | Zwei Dateien, nicht mischen |
| i18n Übersetzungen | `lib/i18n.ts` | Einzige Übersetzungsdatei |
| Supabase Client | `lib/supabase.ts` | Singleton — NICHT erneut erstellen |
| Gamification Trigger | DB: `process_session_gamification()` | AFTER INSERT auf `sessions` — kein separates RPC nötig |

---

## 12. Bekannte Probleme & TODOs

### 🔴 KRITISCH (vor Launch)

1. ~~**robots.txt / noindex blockiert alles**~~ ✅ Gelöst — `allow: ["/"]`, `robots: { index: true, follow: true }`

2. **`/api/test-email` entfernen** (Sicherheitsrisiko)

3. **CRON_SECRET setzen** (falls nicht geschehen) — Cron-Jobs sind sonst ungeschützt

### 🟡 MITTEL

4. **Server-Side Metadata nur EN** — Titles/Descriptions in `export const metadata` sind nur Englisch
   - Akzeptabel für SSG + Client-Side i18n, aber nicht optimal für DE-Google-Suche

5. **`/pair` + `/tv` ohne Metadata** — Interne Tools, aber `<title>` wäre nice-to-have

6. **TV-Mode Footer** — Hat noch einen eigenen kleinen Footer statt SubpageFooter

7. **UserMenu.tsx** — Legacy-Datei, kann gelöscht werden (ersetzt durch SubpageNav)

### 🟢 NIEDRIG / ZUKUNFT

8. ~~**JSON-LD FAQ auf Homepage** — Nur Englisch, nicht lokalisiert~~ Bleibt EN (für Google Rich Results)
9. ~~**hreflang per URL**~~ ✅ Gelöst — Per-URL hreflang via `makeAlternates()` + Sitemap `<xhtml:link>`
10. **Store-Routes in Sitemap** — Creator-Routen sind DB-dynamisch, noch nicht in Sitemap
11. **Email-Forwarding** — `kontakt@cyclerun.app` → Gmail einrichten

---

## 13. Kennzahlen (Stand Feb 8, 2026)

| Metrik | Wert |
|--------|------|
| **Gesamte Seiten** | 29+ URLs in Sitemap + dynamische |
| **Blog-Posts** | 3 (EN+DE) |
| **Cycling Routes** | 5 (EN+DE) |
| **SEO Guides** | 9 (EN+DE) |
| **API Routes** | 11 |
| **DB Tabellen** | 19 |
| **Storage Buckets** | 3 |
| **Email Templates** | 20+ (transaktional + engagement) |
| **i18n Schlüssel** | ~1.200+ |
| **Komponenten** | 22 (inkl. CookieConsent) |
| **CSS** | 1 Datei (112KB) |
| **Changelog Versionen** | bis v0.10.0 |
