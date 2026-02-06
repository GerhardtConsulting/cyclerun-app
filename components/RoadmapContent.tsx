"use client";

import Link from "next/link";
import { t } from "@/lib/i18n";
import { useLocale } from "@/lib/useLocale";
import SubpageNav from "@/components/SubpageNav";
import SubpageFooter from "@/components/SubpageFooter";
import VoteButton from "@/components/VoteButton";

interface ChangelogEntry {
  date: string;
  tag: "launch" | "feature" | "improvement" | "content";
  title: string;
  title_de?: string;
  description: string;
  description_de?: string;
}

const changelog: ChangelogEntry[] = [
  {
    date: "Feb 6, 2026",
    tag: "content",
    title: "9 SEO Keyword Guides + Extended Footer",
    title_de: "9 SEO-Keyword-Guides + erweiterter Footer",
    description: "Published 9 in-depth guides (Zwift Alternative, Rouvy Alternative, Indoor Cycling App, Heimtrainer App, Spinning Bike App, Exercise Bike App, Virtual Cycling Videos, Cycling Without Smart Trainer, Ergometer Training). Each with FAQPage schema for Google Rich Snippets. New 5-column deep-link footer on all pages.",
    description_de: "9 ausführliche Guides veröffentlicht (Zwift-Alternative, Rouvy-Alternative, Indoor Cycling App, Heimtrainer App, Spinning Bike App, Exercise Bike App, Virtual Cycling Videos, Radfahren ohne Smart Trainer, Ergometer Training). Jeweils mit FAQPage-Schema für Google Rich Snippets. Neuer 5-Spalten-Deep-Link-Footer auf allen Seiten.",
  },
  {
    date: "Feb 5, 2026",
    tag: "feature",
    title: "Phone Camera Pairing via WebRTC",
    title_de: "Handy-Kamera-Kopplung via WebRTC",
    description: "Scan a QR code with your phone to use it as a wireless camera sensor. Real QR code generation, Supabase Realtime signaling, peer-to-peer WebRTC video streaming.",
    description_de: "Scanne einen QR-Code mit deinem Handy, um es als drahtlosen Kamerasensor zu nutzen. Echte QR-Code-Generierung, Supabase Realtime Signaling, Peer-to-Peer WebRTC Video-Streaming.",
  },
  {
    date: "Feb 5, 2026",
    tag: "feature",
    title: "Registration Nudge & Gamification",
    title_de: "Registrierungs-Nudge & Gamification",
    description: "Subtle slide-in badge after 60s of riding (non-registered users only). 30-second ring countdown timer. Auto-dismiss, non-blocking.",
    description_de: "Dezentes Slide-In-Badge nach 60s Fahrt (nur nicht-registrierte Nutzer). 30-Sekunden-Ring-Countdown. Automatisches Ausblenden, nicht-blockierend.",
  },
  {
    date: "Feb 4, 2026",
    tag: "content",
    title: "Blog, Routes & Creator Hub",
    title_de: "Blog, Strecken & Creator Hub",
    description: "3 blog articles (Best Routes 2026, GoPro Settings, CycleRun vs Zwift). 5 route detail pages with elevation profiles and Schema.org SportsEvent markup. Full Creator Program page with recording guide, GPX documentation, and application form.",
    description_de: "3 Blog-Artikel (Beste Strecken 2026, GoPro-Einstellungen, CycleRun vs Zwift). 5 Strecken-Detailseiten mit Höhenprofilen und Schema.org SportsEvent Markup. Vollständige Creator-Programm-Seite mit Aufnahme-Guide, GPX-Dokumentation und Bewerbungsformular.",
  },
  {
    date: "Feb 3, 2026",
    tag: "feature",
    title: "Full i18n: English + German",
    title_de: "Vollständige i18n: Englisch + Deutsch",
    description: "Complete bilingual support. Automatic browser language detection. Manual flag switcher. All UI text, wizard steps, ride screen, registration, and post-ride summary translated.",
    description_de: "Vollständige zweisprachige Unterstützung. Automatische Browser-Spracherkennung. Manueller Flaggen-Umschalter. Alle UI-Texte, Wizard-Schritte, Fahrt-Screen, Registrierung und Fahrt-Zusammenfassung übersetzt.",
  },
  {
    date: "Feb 2, 2026",
    tag: "feature",
    title: "Post-Ride Summary & Instagram Share Card",
    title_de: "Fahrt-Zusammenfassung & Instagram Share Card",
    description: "Detailed ride statistics after every session. One-click Instagram Story share card (1080×1920 PNG) with gradient branding, metrics, and route name.",
    description_de: "Detaillierte Fahrt-Statistiken nach jeder Session. Ein-Klick Instagram Story Share Card (1080×1920 PNG) mit Gradient-Branding, Metriken und Streckenname.",
  },
  {
    date: "Feb 1, 2026",
    tag: "feature",
    title: "Newsletter & Session Tracking",
    title_de: "Newsletter & Session-Tracking",
    description: "Double opt-in newsletter via Resend (DSGVO-compliant). Ride sessions saved to Supabase (distance, duration, avg speed, max speed, avg RPM, gear, sport type).",
    description_de: "Double-Opt-In-Newsletter via Resend (DSGVO-konform). Fahrt-Sessions in Supabase gespeichert (Distanz, Dauer, Durchschnittsgeschwindigkeit, Maximalgeschwindigkeit, Durchschnitts-RPM, Gang, Sportart).",
  },
  {
    date: "Jan 30, 2026",
    tag: "improvement",
    title: "Physics Engine v2 & 3-Gear System",
    title_de: "Physik-Engine v2 & 3-Gang-System",
    description: "Realistic cycling physics with air drag, rolling resistance, and drivetrain losses. Three gear levels (Light/Medium/Heavy) affecting speed calculation.",
    description_de: "Realistische Radfahrphysik mit Luftwiderstand, Rollwiderstand und Antriebsverlusten. Drei Gangstufen (Leicht/Mittel/Schwer) beeinflussen die Geschwindigkeitsberechnung.",
  },
  {
    date: "Jan 28, 2026",
    tag: "feature",
    title: "Featured Routes & Custom Video Input",
    title_de: "Featured Strecken & eigene Video-Eingabe",
    description: "5 curated POV cycling routes (Mallorca, Stelvio, PCH, Alpe d'Huez, Trollstigen). Direct video URL input. Local file upload with privacy notice.",
    description_de: "5 kuratierte POV-Radstrecken (Mallorca, Stelvio, PCH, Alpe d'Huez, Trollstigen). Direkte Video-URL-Eingabe. Lokaler Datei-Upload mit Datenschutzhinweis.",
  },
  {
    date: "Jan 25, 2026",
    tag: "launch",
    title: "CycleRun.app Launch",
    title_de: "CycleRun.app Launch",
    description: "Initial release: Webcam-based cadence detection using browser-native computer vision. Motion tracking with configurable detection zones. Real-time speed and RPM display.",
    description_de: "Erstveröffentlichung: Webcam-basierte Trittfrequenzerkennung mittels browsernativer Computer Vision. Motion-Tracking mit konfigurierbaren Erkennungszonen. Echtzeit-Geschwindigkeits- und RPM-Anzeige.",
  },
];

interface UpcomingFeature {
  id: string;
  status: "next" | "planned" | "exploring";
  title: string;
  title_de?: string;
  description: string;
  description_de?: string;
  category: string;
}

const upcomingFeatures: UpcomingFeature[] = [
  { id: "stats-dashboard", status: "next", title: "Personal Statistics & Analytics", title_de: "Persönliche Statistiken & Analytics", description: "Full ride history dashboard. Weekly/monthly distance, duration, and calorie charts. Personal records. Streak tracking.", description_de: "Vollständiges Fahrt-Verlauf-Dashboard. Wöchentliche/monatliche Distanz-, Dauer- und Kalorien-Diagramme. Persönliche Rekorde. Streak-Tracking.", category: "Analytics" },
  { id: "training-plans", status: "next", title: "Training Plans & Structured Workouts", title_de: "Trainingspläne & strukturierte Workouts", description: "Beginner, Intermediate, and Advanced training plans. Weekly structure with specific routes and intensity targets.", description_de: "Anfänger-, Fortgeschrittenen- und Profi-Trainingspläne. Wochenstruktur mit bestimmten Strecken und Intensitätszielen.", category: "Training" },
  { id: "gpx-resistance", status: "next", title: "GPX-Based Resistance Simulation", title_de: "GPX-basierte Widerstandssimulation", description: "Upload GPX files with routes. Real elevation data drives resistance recommendations. Feel the climb when the video shows a 10% gradient.", description_de: "GPX-Dateien mit Strecken hochladen. Echte Höhendaten steuern Widerstandsempfehlungen. Spüre den Anstieg, wenn das Video 10% Steigung zeigt.", category: "Core" },
  { id: "equipment-reviews", status: "planned", title: "Equipment Directory & Reviews", title_de: "Ausrüstungsverzeichnis & Bewertungen", description: "Ergometer, spin bike, and home trainer reviews. Bikefitter directory. Community ratings.", description_de: "Ergometer-, Spinning-Bike- und Heimtrainer-Bewertungen. Bikefitter-Verzeichnis. Community-Bewertungen.", category: "Content" },
  { id: "achievements", status: "planned", title: "Achievements & Badges", title_de: "Erfolge & Badges", description: "Unlock badges for milestones: first ride, 100km total, 10 routes completed, streak badges.", description_de: "Schalte Badges für Meilensteine frei: Erste Fahrt, 100 km gesamt, 10 Strecken abgeschlossen, Streak-Badges.", category: "Gamification" },
  { id: "heart-rate", status: "planned", title: "Heart Rate Monitor Integration", title_de: "Herzfrequenz-Monitor-Integration", description: "Connect Bluetooth HR monitors directly in the browser (Web Bluetooth API). Live heart rate display, zone training.", description_de: "Bluetooth-Herzfrequenzmesser direkt im Browser verbinden (Web Bluetooth API). Live-Herzfrequenzanzeige, Zonen-Training.", category: "Hardware" },
  { id: "multiplayer", status: "planned", title: "Ride Together — Multiplayer", title_de: "Gemeinsam fahren — Multiplayer", description: "Ride the same route with friends in real-time. See each other's speed and position. Voice chat.", description_de: "Fahre dieselbe Strecke mit Freunden in Echtzeit. Sieh Geschwindigkeit und Position der anderen. Voice Chat.", category: "Social" },
  { id: "running-mode", status: "planned", title: "Running & Treadmill Mode", title_de: "Lauf- & Laufband-Modus", description: "Full running support. Webcam detects running cadence on treadmills. POV running routes.", description_de: "Volle Lauf-Unterstützung. Webcam erkennt Laufkadenz auf Laufbändern. POV-Laufstrecken.", category: "Core" },
  { id: "creator-marketplace", status: "planned", title: "Creator Route Marketplace", title_de: "Creator Strecken-Marktplatz", description: "Creators set prices for premium routes. 70/30 revenue split. Route bundles and series.", description_de: "Creator setzen Preise für Premium-Strecken. 70/30 Umsatzaufteilung. Strecken-Bundles und Serien.", category: "Creator" },
  { id: "challenges", status: "planned", title: "Monthly Challenges & Competitions", title_de: "Monatliche Challenges & Wettbewerbe", description: "Community challenges: 'Ride 200km in February'. Sponsored prizes from cycling brands.", description_de: "Community-Challenges: ‚Fahre 200 km im Februar'. Gesponserte Preise von Cycling-Marken.", category: "Social" },
  { id: "vr-mode", status: "exploring", title: "VR Ride Experience", title_de: "VR-Fahrerlebnis", description: "360° video routes for VR headsets (Meta Quest, Apple Vision Pro). Immersive first-person riding.", description_de: "360°-Videostrecken für VR-Headsets (Meta Quest, Apple Vision Pro). Immersives First-Person-Fahren.", category: "Future" },
  { id: "ai-coaching", status: "exploring", title: "AI Training Coach", title_de: "KI-Trainingscoach", description: "AI-powered coaching that analyzes your rides and suggests improvements. Personalized recommendations.", description_de: "KI-gestütztes Coaching, das deine Fahrten analysiert und Verbesserungen vorschlägt. Personalisierte Empfehlungen.", category: "Future" },
  { id: "strava-sync", status: "exploring", title: "Strava & Garmin Connect Sync", title_de: "Strava & Garmin Connect Sync", description: "Automatic upload of CycleRun rides to Strava and Garmin Connect. Import FIT/TCX/GPX files.", description_de: "Automatischer Upload von CycleRun-Fahrten zu Strava und Garmin Connect. FIT/TCX/GPX-Dateien importieren.", category: "Integration" },
  { id: "mobile-app", status: "exploring", title: "Native iOS & Android App", title_de: "Native iOS & Android App", description: "Dedicated mobile apps with offline route support, push notifications for challenges.", description_de: "Dedizierte Mobile Apps mit Offline-Strecken-Support, Push-Benachrichtigungen für Challenges.", category: "Platform" },
];

interface FeatureRequest {
  id: string;
  title: string;
  title_de?: string;
  votes: number;
  category: string;
}

const featureRequests: FeatureRequest[] = [
  { id: "fr-1", title: "Interval Training Mode (HIIT)", title_de: "Intervall-Training-Modus (HIIT)", votes: 47, category: "Training" },
  { id: "fr-2", title: "Custom Resistance Curves per Route", title_de: "Eigene Widerstandskurven pro Strecke", votes: 38, category: "Core" },
  { id: "fr-3", title: "Social Feed — See Friends' Rides", title_de: "Social Feed — Fahrten von Freunden sehen", votes: 34, category: "Social" },
  { id: "fr-4", title: "Dark/Light Theme Toggle", title_de: "Dark/Light-Theme-Umschalter", votes: 29, category: "UI" },
  { id: "fr-5", title: "Apple Watch Cadence Detection", title_de: "Apple Watch Trittfrequenz-Erkennung", votes: 27, category: "Hardware" },
  { id: "fr-6", title: "Route Map Overlay During Ride", title_de: "Strecken-Karten-Overlay während der Fahrt", votes: 25, category: "Core" },
  { id: "fr-7", title: "Spotify / Apple Music Integration", title_de: "Spotify / Apple Music Integration", votes: 23, category: "Integration" },
  { id: "fr-8", title: "Power (Watts) Estimation Algorithm", title_de: "Leistungs-(Watt)-Schätzalgorithmus", votes: 21, category: "Analytics" },
  { id: "fr-9", title: "Multi-Language Route Descriptions", title_de: "Mehrsprachige Streckenbeschreibungen", votes: 18, category: "Content" },
  { id: "fr-10", title: "Zwift .fit File Import for Comparison", title_de: "Zwift .fit-Datei-Import zum Vergleich", votes: 15, category: "Integration" },
];

function tagClass(tag: string): string {
  switch (tag) {
    case "launch": return "roadmap-tag-launch";
    case "feature": return "roadmap-tag-feature";
    case "improvement": return "roadmap-tag-improvement";
    case "content": return "roadmap-tag-content";
    case "next": return "roadmap-status-next";
    case "planned": return "roadmap-status-planned";
    case "exploring": return "roadmap-status-exploring";
    default: return "";
  }
}

export default function RoadmapContent() {
  const locale = useLocale();
  const isDE = locale === "de";

  function statusLabel(s: string): string {
    switch (s) {
      case "next": return t("sub.roadmap.next");
      case "planned": return t("sub.roadmap.planned");
      case "exploring": return t("sub.roadmap.exploring");
      default: return s;
    }
  }

  return (
    <div className="roadmap-page">
      <SubpageNav rightKey="sub.become_creator" rightHref="/creator" />

      <header className="roadmap-hero">
        <span className="creator-badge">{t("sub.roadmap.badge")}</span>
        <h1>{t("sub.roadmap.hero_1")} <span className="gradient-text">{t("sub.roadmap.hero_2")}</span></h1>
        <p className="roadmap-hero-sub">{t("sub.roadmap.hero_sub")}</p>
        <div className="roadmap-hero-actions">
          <a href="#vote" className="btn-primary btn-lg">{t("sub.roadmap.vote_btn")}</a>
          <a href="#changelog" className="btn-ghost">{t("sub.roadmap.changelog_link")}</a>
        </div>
      </header>

      <section className="roadmap-section" id="changelog">
        <h2>{t("sub.roadmap.changelog")}</h2>
        <p className="section-subtitle">{t("sub.roadmap.changelog_sub")}</p>
        <div className="changelog-timeline">
          {changelog.map((entry, i) => (
            <div key={i} className="changelog-entry">
              <div className="changelog-date">{entry.date}</div>
              <div className="changelog-dot" />
              <div className="changelog-card">
                <span className={`roadmap-tag ${tagClass(entry.tag)}`}>{entry.tag}</span>
                <h3>{isDE ? (entry.title_de || entry.title) : entry.title}</h3>
                <p>{isDE ? (entry.description_de || entry.description) : entry.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="roadmap-section roadmap-section-dark" id="upcoming">
        <h2>{t("sub.roadmap.upcoming")}</h2>
        <p className="section-subtitle">{t("sub.roadmap.upcoming_sub")}</p>
        {(["next", "planned", "exploring"] as const).map((status) => {
          const items = upcomingFeatures.filter((f) => f.status === status);
          return (
            <div key={status} className="upcoming-group">
              <h3 className="upcoming-group-title">
                <span className={`roadmap-tag ${tagClass(status)}`}>{statusLabel(status)}</span>
                <span className="upcoming-count">{items.length} {t("sub.roadmap.features")}</span>
              </h3>
              <div className="upcoming-grid">
                {items.map((f) => (
                  <div key={f.id} className="upcoming-card">
                    <span className="upcoming-category">{f.category}</span>
                    <h4>{isDE ? (f.title_de || f.title) : f.title}</h4>
                    <p>{isDE ? (f.description_de || f.description) : f.description}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      <section className="roadmap-section" id="vote">
        <h2>{t("sub.roadmap.vote_title")}</h2>
        <p className="section-subtitle">
          {t("sub.roadmap.vote_sub")}
          <br />
          <strong style={{ color: "var(--accent-1)" }}>{t("sub.roadmap.vote_register")}</strong>
        </p>
        <div className="vote-list">
          {featureRequests
            .sort((a, b) => b.votes - a.votes)
            .map((fr) => (
              <div key={fr.id} className="vote-card">
                <VoteButton votes={fr.votes} />
                <div className="vote-info">
                  <h4>{isDE ? (fr.title_de || fr.title) : fr.title}</h4>
                  <span className="upcoming-category">{fr.category}</span>
                </div>
              </div>
            ))}
        </div>
        <div className="vote-register-cta">
          <p>{t("sub.roadmap.vote_cta")}</p>
          <Link href="/" className="btn-primary btn-sm">{t("sub.register_vote")}</Link>
        </div>
      </section>

      <section className="seo-cta" style={{ maxWidth: "640px", margin: "2rem auto 0" }}>
        <h2>{t("sub.roadmap.cta_title")}</h2>
        <p>{t("sub.roadmap.cta_desc")}</p>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/" className="btn-primary btn-lg">{t("sub.start_riding")}</Link>
          <Link href="/creator" className="btn-ghost">{t("sub.become_creator")} &rarr;</Link>
        </div>
      </section>

      <SubpageFooter />
    </div>
  );
}
