# CycleRun — Feature-Liste & Roadmap

## Vergleich: CycleRun vs. Zwift vs. Rouvy vs. Kinomap

| Feature | CycleRun | Zwift (€17,99/Mo) | Rouvy (€12,99/Mo) | Kinomap (€11,99/Mo) |
|---|---|---|---|---|
| **Preis** | **Kostenlos** | €17,99/Monat | €12,99/Monat | €11,99/Monat |
| **Hardware** | **Nur Webcam** | Smart Trainer erforderlich | Smart Trainer erforderlich | Smart Trainer erforderlich |
| **Alte Heimtrainer** | **✓ Kompatibel** | ✗ | ✗ | ✗ |
| **Alte Ergometer** | **✓ Kompatibel** | ✗ | ✗ | ✗ |
| **Spinning-Bikes** | **✓ Ohne Sensor** | Nur mit Sensor | Nur mit Sensor | Nur mit Sensor |
| **Laufband** | In Entwicklung | ✓ | ✗ | ✓ |
| **Eigene Videos** | **✓** | ✗ | ✗ | ✗ |
| **Echtzeit-Video** | ✓ | ✓ (3D-Welten) | ✓ (Real-Video) | ✓ (Real-Video) |
| **Multiplayer** | Geplant | ✓ | ✓ | ✓ |
| **Datenschutz** | **Webcam lokal** | Cloud-basiert | Cloud-basiert | Cloud-basiert |
| **Installation** | **Keine (Browser)** | App-Download | App-Download | App-Download |

### Warum CycleRun?

> Du hast ein altes Ergometer im Keller stehen? Ein einfaches Spinning-Bike ohne Bluetooth?
> Ein Laufband ohne Smart-Funktionen? **CycleRun macht es nutzbar.**
>
> Kein teurer Smart Trainer. Kein Abo. Kein Sensor.
> Nur deine Webcam und dein Browser.

---

## MVP Features (v1.0 — aktuell)

### Onboarding
- [x] Schritt-für-Schritt Wizard
- [x] Kamera-Aktivierung mit Live-Preview
- [x] Kamera-Position wählen (Seite/Front/Custom)
- [x] Drag & Drop Erkennungszonen
- [x] Live-Feedback bei Bewegungserkennung

### Motion Detection
- [x] Pixel-Differenz-basierte Bewegungserkennung
- [x] Konfigurierbare Erkennungszonen
- [x] Pedalzyklus-Erkennung (Power Stroke)
- [x] Unterscheidung: Ein-Bein vs. Zwei-Bein-Tracking
- [x] Debounce-Mechanismus gegen False Positives

### Physik-Engine
- [x] RPM-Berechnung aus Pedalzyklen
- [x] 3-Gang-System (leicht/mittel/schwer)
- [x] Trägheits-Simulation (Masse-basiert)
- [x] Realistisches Abbremsen/Ausrollen
- [x] Geschwindigkeits-Kalibrierung (User-Slider)

### Ride Experience
- [x] Video-Playback synchron zur Geschwindigkeit
- [x] HUD: Speed, RPM, Distanz, Zeit
- [x] Webcam-Minimap mit Zone-Overlay
- [x] Pause/Resume
- [x] Eigenes Video hochladen oder Standard

### User Management
- [x] Registrierung (Vorname, Nachname, E-Mail)
- [x] Supabase-Backend
- [x] DSGVO-Consent bei Registrierung
- [x] Registration-Gate nach 60s aktiver Fahrt

### Legal & Compliance
- [x] Datenschutzerklärung (DSGVO Art. 13/14)
- [x] Impressum (§5 TMG)
- [x] Cookie-Consent-Banner
- [x] Transparenzerklärung
- [x] Webcam-Daten: nur lokal, kein Upload

### SEO
- [x] Schema.org: WebApplication, FAQPage, Organization
- [x] Open Graph Tags
- [x] Twitter Cards
- [x] Hreflang (DE/EN)
- [x] Rich Snippets / FAQ Markup

---

## Roadmap

### v1.1 — Running Mode
- [ ] Laufband-Erkennung per Kamera
- [ ] Schrittfrequenz (Cadence) statt RPM
- [ ] Pace (min/km) Anzeige
- [ ] Running-spezifische Physik

### v1.2 — Session Tracking
- [ ] Training-Sessions in Supabase speichern
- [ ] Session-Historie / Dashboard
- [ ] Persönliche Bestzeiten
- [ ] Kalorienberechnung
- [ ] Wöchentliche/monatliche Zusammenfassung

### v1.3 — Strecken-Bibliothek
- [ ] Kuratierte Video-Routen (YouTube, eigene)
- [ ] Strecken-Kategorien (Alpen, Strand, Stadt)
- [ ] Schwierigkeitsgrade
- [ ] Community-Uploads

### v1.4 — Social & Multiplayer
- [ ] Live-Sessions: Gemeinsam fahren/laufen
- [ ] Leaderboards
- [ ] Clubs / Gruppen
- [ ] Challenges & Achievements
- [ ] Streak-System

### v1.5 — Hardware-Integration (optional)
- [ ] Bluetooth HR-Sensor
- [ ] ANT+ Unterstützung (über Web Bluetooth)
- [ ] Smart Trainer Support (als Upgrade)

### v2.0 — AI Coach
- [ ] Automatische Trainingsempfehlungen
- [ ] Form-Analyse per Kamera
- [ ] Adaptive Schwierigkeit
- [ ] Sprachfeedback

### Langfristig
- [ ] Rudergerät-Erkennung
- [ ] Crosstrainer-Erkennung
- [ ] Stepper-Erkennung
- [ ] VR/AR-Integration
- [ ] Native Mobile Apps (iOS/Android)
- [ ] Offline-Modus (PWA)

---

## Kompatible Geräte

### Cycling
- Spinning-Bikes (alle Marken)
- Ergometer (auch ohne Display)
- Indoor Bikes
- Alte Heimtrainer (auch 20+ Jahre alt)
- Rollentrainer
- Liegeergometer

### Running (geplant)
- Laufbänder (alle Marken)
- Mechanische Laufbänder
- Curved Treadmills

### Weitere (geplant)
- Rudergeräte
- Crosstrainer / Ellipsentrainer
- Stepper
- Air Bikes
