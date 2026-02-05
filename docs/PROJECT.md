# CycleRun.app — Projektdokumentation

## Vision

CycleRun ist eine kostenlose, kamerabasierte Indoor-Training-Plattform für Cycling und Running. Nutzer können mit ihrer vorhandenen Webcam und einem beliebigen Heimtrainer (Spinning-Bike, Ergometer, Laufband) immersive Trainings-Sessions erleben — ohne teure Sensoren oder Abonnements.

**Claim:** *Dein Wohnzimmer. Deine Strecke.*

## Problemstellung

Bestehende Indoor-Training-Plattformen wie Zwift, Rouvy oder Kinomap erfordern:
- Teure Smart Trainer (€300–€1.500+)
- Monatliche Abonnements (€12–€18/Monat)
- Spezielle Sensoren (ANT+, Bluetooth)

Millionen von Menschen besitzen bereits einfache Heimtrainer, Ergometer oder Spinning-Bikes — haben aber keinen Zugang zu immersiven Trainings-Erlebnissen.

## Lösung

CycleRun nutzt die **vorhandene Webcam** des Nutzers, um per **Motion Detection** die Trittfrequenz (RPM) zu erkennen. Ein frei wählbares Video wird in Echtzeit an die Geschwindigkeit angepasst.

### Kernfeatures (MVP)
- [x] Webcam-basierte Bewegungserkennung
- [x] Drag & Drop Erkennungszonen
- [x] Physik-Simulation (Masse, Trägheit, Luftwiderstand)
- [x] Video-Playback synchron zur Geschwindigkeit
- [x] HUD mit Speed, RPM, Distanz, Zeit
- [x] Gangsystem (3 Gänge)
- [x] Geschwindigkeits-Kalibrierung
- [x] Registrierung via Supabase
- [x] DSGVO-konforme Datenerhebung

### Geplante Features (Roadmap)
- [ ] **Running-Modus:** Laufband-Erkennung per Kamera
- [ ] **Session-History:** Trainingsverläufe speichern & vergleichen
- [ ] **Strecken-Bibliothek:** Kuratierte Video-Routen
- [ ] **Multiplayer:** Gemeinsam fahren/laufen in Echtzeit
- [ ] **Leaderboards:** Community-Ranglisten
- [ ] **Herzfrequenz-Integration:** Bluetooth HR-Sensoren
- [ ] **Virtuelle Welten:** 3D-generierte Strecken
- [ ] **Gamification:** Achievements, Challenges, Streaks
- [ ] **Social Features:** Clubs, Gruppenfahrten
- [ ] **AI Coach:** Trainingsempfehlungen basierend auf Daten
- [ ] **Kompatibilität:** Rudergerät, Crosstrainer, Stepper

## Tech-Stack

| Komponente | Technologie |
|---|---|
| Frontend | Vanilla JS, HTML5, CSS3 |
| Styling | Custom CSS mit CSS Variables |
| Font | Inter (Google Fonts) |
| Backend | Supabase (PostgreSQL + REST API) |
| Auth | Supabase (anon key, RLS) |
| Hosting | Vercel (Static) |
| Domain | cyclerun.app |
| Motion Detection | Canvas API + Pixel Differencing |
| Video | HTML5 Video API |

## Supabase

- **Organisation:** cyclerun.app
- **Projekt:** CycleRun App
- **Region:** eu-central-1
- **Project ID:** yuxkujcnsrrkwbvftkvq

### Datenbank-Schema

```sql
-- Registrierungen
registrations (id, first_name, last_name, email, preferred_sport, locale, consent_privacy, consent_data_processing, created_at, updated_at)

-- Training-Sessions (Zukunft)
sessions (id, user_id, sport_type, duration_seconds, distance_km, avg_speed_kmh, avg_rpm, max_speed_kmh, calories_estimated, created_at)

-- Warteliste für neue Features
waitlist (id, email, feature, created_at)
```

## Vergleich mit Wettbewerb

| Feature | CycleRun | Zwift | Rouvy | Kinomap |
|---|---|---|---|---|
| Preis | **Kostenlos** | €17,99/Monat | €12,99/Monat | €11,99/Monat |
| Hardware nötig | **Nur Webcam** | Smart Trainer | Smart Trainer | Smart Trainer |
| Cycling | ✓ | ✓ | ✓ | ✓ |
| Running | Geplant | ✓ | ✗ | ✗ |
| Eigene Videos | ✓ | ✗ | ✗ | ✗ |
| Alte Geräte | **✓** | ✗ | ✗ | ✗ |
| Open Source Spirit | ✓ | ✗ | ✗ | ✗ |

## Projektstatus

**Phase:** MVP / Beta
**Stand:** Februar 2026

### Erledigt
- Wizard-basiertes Onboarding (4 Schritte)
- Webcam-Integration mit Live-Preview
- Konfigurierbare Erkennungszonen (Drag & Drop)
- Pedalzyklus-Erkennung (Kraft-Phase / Power Stroke)
- Physik-Engine mit realistischer Trägheit
- HUD-Overlay während der Fahrt
- Registration-Gate nach 60 Sekunden
- Supabase-Anbindung für Registrierungen
- DSGVO-Consent bei Registrierung

### In Arbeit
- SEO-Optimierung (Schema.org, FAQ, Multilanguage)
- Legal Pages (Datenschutz, Impressum, Cookie-Policy)
- Design-Refresh (Canyon/Rose-inspiriert)
- Vercel Deployment

## Community

CycleRun ist ein **Community-Projekt ohne Gewinnabsicht**. Es dient als Showcase für die Möglichkeiten kamerabasierter Bewegungserkennung im Fitness-Bereich.

Die Erhebung von Nutzerdaten (E-Mail, Name) dient ausschließlich der Verbesserung der Nutzererfahrung und der Entwicklung weiterer Features.
