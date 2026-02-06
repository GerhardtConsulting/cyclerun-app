---
description: How to add a new cycling route to CycleRun (bilingual EN+DE)
---

# Add a New Cycling Route

## Schema & File Locations
- **Data file**: `lib/route-data.ts` — all routes live here as a TypeScript array
- **Interface**: `RouteData` with required EN fields + optional `_de` fields
- **Client component**: `components/RouteDetailContent.tsx` — renders locale-aware content
- **Server page**: `app/routes/[slug]/page.tsx` — generates metadata + static params

## Steps

1. **Open `lib/route-data.ts`** and add a new entry to the `routes` array:

```typescript
{
  slug: "route-name-location",              // URL-safe, lowercase, hyphens
  name: "Route Name",                       // Keep name in original language (proper noun)
  location: "Region, Country",
  location_de: "Region, Land",              // German location name
  country: "XX",                            // ISO 3166-1 alpha-2 (ES, IT, US, FR, NO, DE, AT, CH...)
  distanceKm: 42,
  elevationM: 850,
  durationMin: 90,
  difficulty: "Moderate",                   // Easy | Moderate | Hard | Very Hard
  description: "English description for SEO (max 160 chars)",
  description_de: "German SEO description",
  keywords: "route name, cycling route location, indoor cycling route",
  elevationProfile: [100, 150, 200, 350, 500, 650, 800, 850, 820, 700, 500, 300, 150],
  // Array of elevation values — used to render the visual elevation chart
  // ~10-15 data points, representing altitude at intervals along the route
  content: "English paragraph 1\n\nEnglish paragraph 2\n\nEnglish paragraph 3",
  content_de: "German paragraph 1\n\nGerman paragraph 2\n\nGerman paragraph 3",
}
```

2. **Add country flag emoji** — if you use a new country code, add a flag mapping in `components/RoutesIndexContent.tsx`:
```typescript
{route.country === "DE" && "\u{1F1E9}\u{1F1EA}"}
```

3. **Difficulty translations** are handled automatically via `sub.diff.*` i18n keys.

4. **Build and test**:
// turbo
```bash
cd /Users/dev/CascadeProjects/cyclerun-next && npx next build
```

5. **Sitemap**: Automatically included via `getAllRouteSlugs()` in `app/sitemap.ts`.

6. **Commit and push**:
```bash
git add -A && git commit -m "content: add route — Route Name" && git push
```

## Important Notes
- `content` uses `\n\n` for paragraph breaks (NOT markdown — rendered as `<p>` tags)
- `elevationProfile` should have 10–15 values showing the altitude profile
- Route names (proper nouns like "Stelvio Pass") stay the same in both languages
- Only `location`, `description`, and `content` get `_de` translations
