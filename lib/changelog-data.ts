export interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  title_de: string;
  summary: string;
  summary_de: string;
  changes: {
    type: "feature" | "improvement" | "fix" | "system";
    text: string;
    text_de: string;
  }[];
}

export const changelog: ChangelogEntry[] = [
  {
    version: "0.10.0",
    date: "2026-02-07",
    title: "Public Profiles, Referrals, Credits & Upvotes",
    title_de: "\u00d6ffentliche Profile, Empfehlungen, Credits & Likes",
    summary: "Your CycleRun identity goes public. Set a nickname, upload a profile photo, share your profile via a personal link. Refer friends to earn Credits that unlock premium routes. Like other riders to show support.",
    summary_de: "Deine CycleRun-Identit\u00e4t wird \u00f6ffentlich. Setze einen Nickname, lade ein Profilbild hoch, teile dein Profil \u00fcber einen pers\u00f6nlichen Link. Wirb Freunde und verdiene Credits, die Premium-Strecken freischalten. Like andere Fahrer.",
    changes: [
      {
        type: "feature",
        text: "**Public Profiles** \u2014 Set a nickname, upload a profile photo, and toggle your profile to public. Accessible via `cyclerun.app/u/your-name`.",
        text_de: "**\u00d6ffentliche Profile** \u2014 Setze einen Nickname, lade ein Profilbild hoch und schalte dein Profil \u00f6ffentlich. Erreichbar \u00fcber `cyclerun.app/u/dein-name`.",
      },
      {
        type: "feature",
        text: "**Profile Editor** \u2014 Edit your nickname, upload an avatar, and toggle public/private directly on your profile page. Slug is auto-generated from your nickname.",
        text_de: "**Profil-Editor** \u2014 Bearbeite deinen Nickname, lade ein Avatar hoch und schalte \u00f6ffentlich/privat direkt auf deiner Profilseite um. Die URL wird automatisch aus deinem Nickname generiert.",
      },
      {
        type: "feature",
        text: "**Upvotes / Likes** \u2014 Like other riders\u2019 public profiles. Your like count is visible on your profile.",
        text_de: "**Likes** \u2014 Like die \u00f6ffentlichen Profile anderer Fahrer. Deine Like-Anzahl ist auf deinem Profil sichtbar.",
      },
      {
        type: "feature",
        text: "**Referral System** \u2014 Share your personal referral link. Your friend gets 25 Credits, you get 50. Referral count and earned Credits shown on profile.",
        text_de: "**Empfehlungssystem** \u2014 Teile deinen pers\u00f6nlichen Empfehlungslink. Dein Freund bekommt 25 Credits, du 50. Empfehlungsanzahl und verdiente Credits auf dem Profil sichtbar.",
      },
      {
        type: "feature",
        text: "**Credits System** \u2014 Earn Credits by referring friends. Spend Credits to unlock premium routes via the route unlock API.",
        text_de: "**Credits-System** \u2014 Verdiene Credits durch Empfehlungen. Gib Credits aus, um Premium-Strecken \u00fcber die Route-Unlock-API freizuschalten.",
      },
      {
        type: "feature",
        text: "**Changelog Page** \u2014 A public changelog at `/changelog` showing all CycleRun updates. Bilingual EN+DE. Linked in every footer.",
        text_de: "**Changelog-Seite** \u2014 Ein \u00f6ffentlicher Changelog unter `/changelog` mit allen CycleRun-Updates. Zweisprachig EN+DE. In jedem Footer verlinkt.",
      },
      {
        type: "system",
        text: "**Avatar Storage** \u2014 Supabase Storage bucket for profile photos with public read access.",
        text_de: "**Avatar-Speicher** \u2014 Supabase Storage Bucket f\u00fcr Profilbilder mit \u00f6ffentlichem Lesezugriff.",
      },
      {
        type: "system",
        text: "**Referral Processing** \u2014 Server-side RPC function validates referral codes, prevents self-referrals and duplicates, awards Credits atomically.",
        text_de: "**Empfehlungsverarbeitung** \u2014 Serverseitige RPC-Funktion validiert Codes, verhindert Selbst-Empfehlungen und Duplikate, vergibt Credits atomar.",
      },
    ],
  },
  {
    version: "0.9.0",
    date: "2026-02-07",
    title: "Gamification, Email Engagement & Smart Goal System",
    title_de: "Gamification, E-Mail-Engagement & Intelligentes Ziel-System",
    summary: "A massive update that transforms CycleRun from a riding tool into a full engagement platform. Earn Energy, unlock badges, climb the leaderboard — and let the app learn your goals over time, without ever asking too much at once.",
    summary_de: "Ein riesiges Update, das CycleRun von einem Fahr-Tool in eine vollst\u00e4ndige Engagement-Plattform verwandelt. Verdiene Energie, schalte Abzeichen frei, erklimme die Rangliste \u2014 und lass die App deine Ziele nach und nach verstehen, ohne je zu viel auf einmal zu fragen.",
    changes: [
      {
        type: "feature",
        text: "**Gamification System** \u2014 Earn Energy points for every ride (distance, duration, speed bonus + daily bonus \u00d7 streak multiplier). 8 levels from Beginner to Legend.",
        text_de: "**Gamification-System** \u2014 Verdiene Energie-Punkte f\u00fcr jede Fahrt (Distanz, Dauer, Speed-Bonus + Tagesbonus \u00d7 Streak-Multiplikator). 8 Level von Anf\u00e4nger bis Legende.",
      },
      {
        type: "feature",
        text: "**30 Achievements** \u2014 Badges across 6 categories: Distance, Duration, Speed, Streak, Sessions, and Special. Unlock them automatically by riding.",
        text_de: "**30 Abzeichen** \u2014 Badges in 6 Kategorien: Distanz, Dauer, Speed, Streak, Sessions und Spezial. Schalte sie automatisch durch Fahren frei.",
      },
      {
        type: "feature",
        text: "**Streak System** \u2014 Ride daily to build your streak. Streak Freeze every 7 days protects your progress. Streak multiplier (up to 1.5\u00d7) boosts your Energy.",
        text_de: "**Streak-System** \u2014 Fahre t\u00e4glich, um deinen Streak aufzubauen. Streak Freeze alle 7 Tage sch\u00fctzt deinen Fortschritt. Streak-Multiplikator (bis 1,5\u00d7) boosted deine Energie.",
      },
      {
        type: "feature",
        text: "**Leaderboard** \u2014 Weekly, monthly, and all-time rankings. See where you stand in the community.",
        text_de: "**Rangliste** \u2014 W\u00f6chentliche, monatliche und Gesamt-Rankings. Sieh, wo du in der Community stehst.",
      },
      {
        type: "feature",
        text: "**Profile Page** \u2014 Full stats dashboard with Energy, Level, Streak, Badges, and Leaderboard rank. Your cycling identity.",
        text_de: "**Profilseite** \u2014 Komplettes Stats-Dashboard mit Energie, Level, Streak, Abzeichen und Rang. Deine Cycling-Identit\u00e4t.",
      },
      {
        type: "feature",
        text: "**Ride Summary Gamification** \u2014 After every ride: Energy earned, streak update, new badges, and level-ups displayed directly in the summary.",
        text_de: "**Gamification in der Fahrt-Zusammenfassung** \u2014 Nach jeder Fahrt: verdiente Energie, Streak-Update, neue Abzeichen und Level-Ups direkt in der Zusammenfassung.",
      },
      {
        type: "feature",
        text: "**Progressive Goal Capture** \u2014 The app gradually learns your goals through 1-tap micro-interactions after rides. Phase 1: Why do you ride? Phase 2: How often? Phase 3: Specific target. Phase 4: Post-ride mood. Zero friction, zero typing.",
        text_de: "**Progressive Zielerfassung** \u2014 Die App lernt deine Ziele schrittweise durch 1-Tap-Mikro-Interaktionen nach Fahrten. Phase 1: Warum f\u00e4hrst du? Phase 2: Wie oft? Phase 3: Konkretes Ziel. Phase 4: Stimmung nach der Fahrt. Kein Stress, kein Tippen.",
      },
      {
        type: "feature",
        text: "**Goal Progress on Profile** \u2014 Visual progress bar toward your personal target (weight loss, fitness, distance, or stress relief).",
        text_de: "**Ziel-Fortschritt im Profil** \u2014 Visueller Fortschrittsbalken zu deinem pers\u00f6nlichen Ziel (Abnehmen, Fitness, Distanz oder Stressabbau).",
      },
      {
        type: "system",
        text: "**Email Engagement System** \u2014 Welcome drip series (Day 1, 3, 7), 5-part Weight Loss Guide, retention win-back emails (3/7/14/30 days inactive), weekly performance summaries. All bilingual EN+DE, DSGVO-compliant.",
        text_de: "**E-Mail-Engagement-System** \u2014 Welcome-Drip-Serie (Tag 1, 3, 7), 5-teiliger Abnehm-Guide, Retention-Win-Back-E-Mails (3/7/14/30 Tage inaktiv), w\u00f6chentliche Performance-Zusammenfassungen. Alles zweisprachig EN+DE, DSGVO-konform.",
      },
      {
        type: "system",
        text: "**Smart Email Personalization** \u2014 Emails adapt to your stated goals. Weight loss users get the guide series immediately, others after proving engagement.",
        text_de: "**Intelligente E-Mail-Personalisierung** \u2014 E-Mails passen sich deinen Zielen an. Abnehm-Nutzer erhalten die Guide-Serie sofort, andere nach bewiesener Aktivit\u00e4t.",
      },
      {
        type: "improvement",
        text: "**Database Trigger** \u2014 All stats (Energy, streak, badges, level) are calculated automatically server-side after each ride. No double counting, no race conditions.",
        text_de: "**Datenbank-Trigger** \u2014 Alle Statistiken (Energie, Streak, Abzeichen, Level) werden automatisch serverseitig nach jeder Fahrt berechnet. Kein doppeltes Z\u00e4hlen.",
      },
      {
        type: "improvement",
        text: "**Shared Supabase Client** \u2014 Centralized database connection for cleaner code and better performance.",
        text_de: "**Zentraler Supabase-Client** \u2014 Zentralisierte Datenbankverbindung f\u00fcr saubereren Code und bessere Performance.",
      },
    ],
  },
  {
    version: "0.8.0",
    date: "2026-02-04",
    title: "TV Mode, Phone Pairing & Creator Hub",
    title_de: "TV-Modus, Handy-Kopplung & Creator Hub",
    summary: "Cast your ride to a big screen using only your phone and a browser. Plus: A complete creator platform for filming and sharing cycling routes.",
    summary_de: "Zeige deine Fahrt auf einem gro\u00dfen Bildschirm \u2014 nur mit deinem Handy und einem Browser. Au\u00dferdem: Eine komplette Creator-Plattform zum Filmen und Teilen von Radstrecken.",
    changes: [
      {
        type: "feature",
        text: "**TV Mode** \u2014 Open `/tv` on your big screen, scan the QR code with your phone. Camera + state sync via WebRTC. No app install needed.",
        text_de: "**TV-Modus** \u2014 \u00d6ffne `/tv` auf deinem gro\u00dfen Bildschirm, scanne den QR-Code mit dem Handy. Kamera + State-Sync via WebRTC. Keine App-Installation n\u00f6tig.",
      },
      {
        type: "feature",
        text: "**Creator Hub** \u2014 Apply to become a CycleRun creator. Upload POV cycling videos, earn from plays.",
        text_de: "**Creator Hub** \u2014 Bewirb dich als CycleRun Creator. Lade POV-Cycling-Videos hoch, verdiene mit Plays.",
      },
      {
        type: "feature",
        text: "**Blog** \u2014 SEO-optimized articles on indoor cycling, routes, GoPro settings, and platform comparisons.",
        text_de: "**Blog** \u2014 SEO-optimierte Artikel zu Indoor Cycling, Strecken, GoPro-Einstellungen und Plattform-Vergleichen.",
      },
      {
        type: "feature",
        text: "**Featured Routes** \u2014 Curated virtual routes with real POV videos (Mallorca, Stelvio, Pacific Coast Highway, and more).",
        text_de: "**Featured Routes** \u2014 Kuratierte virtuelle Strecken mit echten POV-Videos (Mallorca, Stelvio, Pacific Coast Highway und mehr).",
      },
      {
        type: "feature",
        text: "**SEO Guide Pages** \u2014 Dedicated pages for key search terms (Zwift alternative, Rouvy alternative, indoor cycling app, etc.).",
        text_de: "**SEO-Guide-Seiten** \u2014 Dedizierte Seiten f\u00fcr wichtige Suchbegriffe (Zwift-Alternative, Rouvy-Alternative, Indoor-Cycling-App etc.).",
      },
    ],
  },
  {
    version: "0.7.0",
    date: "2026-01-20",
    title: "Core Riding Experience",
    title_de: "Kern-Fahrerlebnis",
    summary: "The foundation: webcam-based motion detection, realistic physics, gear shifting, and real-world video synchronization.",
    summary_de: "Das Fundament: Webcam-basierte Bewegungserkennung, realistische Physik, Gangschaltung und Echtzeit-Video-Synchronisation.",
    changes: [
      {
        type: "feature",
        text: "**Webcam Motion Detection** \u2014 AI-powered cadence tracking via browser camera. No sensors, no smart trainer.",
        text_de: "**Webcam-Bewegungserkennung** \u2014 KI-gest\u00fctzte Trittfrequenz-Erkennung per Browser-Kamera. Keine Sensoren, kein Smart Trainer.",
      },
      {
        type: "feature",
        text: "**Physics Engine** \u2014 Realistic acceleration, inertia, coasting, and 5-gear shifting system.",
        text_de: "**Physik-Engine** \u2014 Realistische Beschleunigung, Tr\u00e4gheit, Rollen und 5-Gang-Schaltung.",
      },
      {
        type: "feature",
        text: "**Video Sync** \u2014 Any YouTube or local video syncs to your pedaling speed in real-time.",
        text_de: "**Video-Sync** \u2014 Jedes YouTube- oder lokale Video synchronisiert sich in Echtzeit mit deiner Tretgeschwindigkeit.",
      },
      {
        type: "feature",
        text: "**Ride Summary + Share Card** \u2014 Beautiful downloadable ride card with all your stats.",
        text_de: "**Fahrt-Zusammenfassung + Share Card** \u2014 Sch\u00f6ne herunterladbare Karte mit allen deinen Statistiken.",
      },
      {
        type: "feature",
        text: "**Full i18n** \u2014 English + German, auto-detected from browser language.",
        text_de: "**Volle i18n** \u2014 Englisch + Deutsch, automatisch aus der Browser-Sprache erkannt.",
      },
    ],
  },
];
