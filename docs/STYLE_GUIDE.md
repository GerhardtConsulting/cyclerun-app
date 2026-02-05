# CycleRun — Style Guidelines

## Brand Identity

**Name:** CycleRun
**Domain:** cyclerun.app
**Tagline:** Dein Wohnzimmer. Deine Strecke.
**Character:** Premium, technisch, zugänglich — inspiriert von Canyon und Rose Bikes

## Farbpalette

Orientierung an Canyon (Schwarz/Weiß/Orange-Akzent) und Rose (Dunkel/Kupfer).

### Primary Colors
| Name | Hex | Verwendung |
|---|---|---|
| **Background** | `#0A0A0B` | Haupthintergrund |
| **Surface** | `#111113` | Cards, Panels |
| **Surface Elevated** | `#1A1A1E` | Hover-States, Sidebar |
| **Border** | `#2A2A2E` | Trennlinien, Card-Borders |

### Accent Colors
| Name | Hex | Verwendung |
|---|---|---|
| **Accent Primary** | `#E8531E` | CTAs, aktive States, Links — Canyon Orange |
| **Accent Secondary** | `#F97316` | Gradients, Highlights |
| **Accent Warm** | `#C2410C` | Hover auf Accent Primary |

### Text Colors
| Name | Hex | Verwendung |
|---|---|---|
| **Primary** | `#F5F5F7` | Headlines, wichtige Werte |
| **Secondary** | `#A1A1AA` | Body-Text, Beschreibungen |
| **Muted** | `#71717A` | Hints, Labels, Timestamps |

### Semantic Colors
| Name | Hex | Verwendung |
|---|---|---|
| **Success** | `#22C55E` | Bestätigungen, aktive Zonen |
| **Warning** | `#EAB308` | Warnungen |
| **Error** | `#EF4444` | Fehler, Motion-Erkennung |

## Typografie

**Font Family:** Inter (Google Fonts)
**Fallback:** -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif

| Element | Size | Weight | Tracking |
|---|---|---|---|
| H1 (Hero) | 3.5rem | 800 | -0.03em |
| H2 (Section) | 2rem | 700 | -0.02em |
| H3 (Card Title) | 1.25rem | 600 | -0.01em |
| Body | 1rem | 400 | 0 |
| Small | 0.85rem | 400 | 0 |
| Caption | 0.75rem | 500 | 0.05em |
| HUD Speed | 6rem | 800 | -0.04em |
| HUD Label | 0.7rem | 600 | 0.1em |

## Spacing

Basierend auf 4px Grid:
- `xs`: 0.25rem (4px)
- `sm`: 0.5rem (8px)
- `md`: 1rem (16px)
- `lg`: 1.5rem (24px)
- `xl`: 2rem (32px)
- `2xl`: 3rem (48px)
- `3xl`: 4rem (64px)

## Border Radius

| Token | Value | Verwendung |
|---|---|---|
| `--radius-sm` | 6px | Tags, Badges |
| `--radius-md` | 10px | Inputs, kleine Cards |
| `--radius-lg` | 14px | Cards, Panels |
| `--radius-xl` | 20px | Hero-Cards, Modals |

## Schatten

- **Subtle:** `0 1px 2px rgba(0,0,0,0.3)` — Inputs
- **Medium:** `0 8px 24px rgba(0,0,0,0.4)` — Cards hover
- **Large:** `0 25px 60px rgba(0,0,0,0.5)` — Modals

## Buttons

### Primary (CTA)
- Background: Gradient `Accent Primary → Accent Secondary`
- Text: White, 600 weight
- Padding: 0.875rem 2rem
- Border-Radius: `--radius-lg`
- Hover: Leichtes Aufhellen, translateY(-1px)

### Ghost (Secondary)
- Background: transparent
- Border: 1px solid `--border`
- Text: `--text-secondary`
- Hover: Background `--surface-elevated`

## Icons

- **Style:** Outline/Stroke (Lucide-Stil)
- **Stroke Width:** 1.5–2px
- **Size:** 20–24px (UI), 32–48px (Feature-Icons)
- **Keine Emojis** — ausschließlich SVG-Icons

## Selection Cards (Standard-Kacheln)

**Alle auswählbaren Kacheln** (Sport-Auswahl, Kamera-Position, etc.) nutzen das gleiche Design:

- **Skew:** `transform: skewX(-2deg)`, Content `skewX(2deg)` zum Ausgleich
- **Border:** `1px solid transparent` mit `background: linear-gradient(bg, bg) padding-box, subtle-border border-box`
- **Hover:** Gradient-Border (`--glow-border`) + `--glow-shadow` + `translateY(-4px)`
- **Selected/Active:** Gradient-Border permanent
- **Content:** Zentriert, großes SVG-Icon oben, Bold uppercase Label, kleiner Tag
- **Mobile (≤640px):** Kein Skew, single column, max-width 320px

**Accent-Farbe sparsam:** Orange/Gradient nur für Primary CTAs, aktive States, Logo-Dot und Zone-Canvas. Nicht für Labels, Icons, Hints oder dekorative Elemente.

## Layout-Prinzipien

1. **Dark-First:** Alles auf dunklem Hintergrund designed
2. **Bolt-Style Borders:** Gradient-Border auf Hover für alle interaktiven Elemente
3. **Progressive Disclosure:** Wizard-Steps zeigen nur relevante Infos
4. **Whitespace:** Großzügiger Abstand, nicht überladen
5. **Responsive:** Mobile-first, max-width 1200px für Content

## Animation

- **Transitions:** 200ms ease (schnelle UI), 400ms cubic-bezier (Page-Transitions)
- **Hover:** translateY(-2px bis -4px) + Shadow
- **Page Enter:** fadeIn + translateY(12px)
- **Modal Enter:** scale(0.96) → scale(1) + opacity

## Inspiration

- **Canyon Bikes:** [canyon.com](https://www.canyon.com) — Schwarz, minimalistisch, Orange-Akzent
- **Rose Bikes:** [rosebikes.com](https://www.rosebikes.com) — Dunkel, kupfern, technisch
- **Apple:** Typografie-Hierarchie, Whitespace
- **Zwift:** Feature-Referenz (nicht Design)
