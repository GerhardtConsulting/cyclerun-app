import Link from "next/link";
import type { Metadata } from "next";
import SubpageFooter from "@/components/SubpageFooter";
import VoteButton from "@/components/VoteButton";

export const metadata: Metadata = {
  title: "Roadmap & Changelog — What's New and What's Next | CycleRun.app",
  description:
    "See what we've shipped, what's coming next, and vote on features you want most. CycleRun is built by and for the community.",
  keywords:
    "CycleRun roadmap, indoor cycling features, CycleRun changelog, feature requests, cycling app updates",
  alternates: { canonical: "/roadmap" },
  openGraph: {
    title: "CycleRun Roadmap — Built by the Community",
    description: "See what we shipped, what's coming, and vote on what matters to you.",
    type: "website",
    url: "https://cyclerun.app/roadmap",
  },
};

// ── Changelog Data ──

interface ChangelogEntry {
  date: string;
  tag: "launch" | "feature" | "improvement" | "content";
  title: string;
  description: string;
}

const changelog: ChangelogEntry[] = [
  {
    date: "Feb 6, 2026",
    tag: "content",
    title: "9 SEO Keyword Guides + Extended Footer",
    description:
      "Published 9 in-depth guides (Zwift Alternative, Rouvy Alternative, Indoor Cycling App, Heimtrainer App, Spinning Bike App, Exercise Bike App, Virtual Cycling Videos, Cycling Without Smart Trainer, Ergometer Training). Each with FAQPage schema for Google Rich Snippets. New 5-column deep-link footer on all pages.",
  },
  {
    date: "Feb 5, 2026",
    tag: "feature",
    title: "Phone Camera Pairing via WebRTC",
    description:
      "Scan a QR code with your phone to use it as a wireless camera sensor. Real QR code generation, Supabase Realtime signaling, peer-to-peer WebRTC video streaming. Position your phone anywhere and see the live feed on your PC.",
  },
  {
    date: "Feb 5, 2026",
    tag: "feature",
    title: "Registration Nudge & Gamification",
    description:
      "Subtle slide-in badge after 60s of riding (non-registered users only). 30-second ring countdown timer. Auto-dismiss, non-blocking. Persistent disconnect badge after dismiss.",
  },
  {
    date: "Feb 4, 2026",
    tag: "content",
    title: "Blog, Routes & Creator Hub",
    description:
      "3 blog articles (Best Routes 2026, GoPro Settings, CycleRun vs Zwift). 5 route detail pages with elevation profiles and Schema.org SportsEvent markup. Full Creator Program page with recording guide, GPX documentation, and application form.",
  },
  {
    date: "Feb 3, 2026",
    tag: "feature",
    title: "Full i18n: English + German",
    description:
      "Complete bilingual support. Automatic browser language detection. Manual flag switcher (🇬🇧/🇩🇪). All UI text, wizard steps, ride screen, registration, and post-ride summary translated.",
  },
  {
    date: "Feb 2, 2026",
    tag: "feature",
    title: "Post-Ride Summary & Instagram Share Card",
    description:
      "Detailed ride statistics after every session. One-click Instagram Story share card (1080×1920 PNG) with gradient branding, metrics, and route name. Downloadable for any social platform.",
  },
  {
    date: "Feb 1, 2026",
    tag: "feature",
    title: "Newsletter & Session Tracking",
    description:
      "Double opt-in newsletter via Resend (DSGVO-compliant). Ride sessions saved to Supabase (distance, duration, avg speed, max speed, avg RPM, gear, sport type). Persistent user profile via email registration.",
  },
  {
    date: "Jan 30, 2026",
    tag: "improvement",
    title: "Physics Engine v2 & 3-Gear System",
    description:
      "Realistic cycling physics with air drag, rolling resistance, and drivetrain losses. Three gear levels (Light/Medium/Heavy) affecting speed calculation. Speed calibration controls.",
  },
  {
    date: "Jan 28, 2026",
    tag: "feature",
    title: "Featured Routes & Custom Video Input",
    description:
      "5 curated POV cycling routes (Mallorca, Stelvio, PCH, Alpe d'Huez, Trollstigen). Direct video URL input. Local file upload with privacy notice. Video playback speed synced to cadence.",
  },
  {
    date: "Jan 25, 2026",
    tag: "launch",
    title: "CycleRun.app Launch",
    description:
      "Initial release: Webcam-based cadence detection using browser-native computer vision. Motion tracking with configurable detection zones. Real-time speed and RPM display. Works with any stationary bike, ergometer, or spin bike.",
  },
];

// ── Upcoming Features ──

interface UpcomingFeature {
  id: string;
  status: "next" | "planned" | "exploring";
  title: string;
  description: string;
  category: string;
}

const upcomingFeatures: UpcomingFeature[] = [
  {
    id: "stats-dashboard",
    status: "next",
    title: "Personal Statistics & Analytics",
    description:
      "Full ride history dashboard. Weekly/monthly distance, duration, and calorie charts. Personal records. Streak tracking. Progress over time visualization.",
    category: "Analytics",
  },
  {
    id: "training-plans",
    status: "next",
    title: "Training Plans & Structured Workouts",
    description:
      "Beginner, Intermediate, and Advanced training plans. Weekly structure with specific routes and intensity targets. Recovery recommendations. Auto-adjusting difficulty.",
    category: "Training",
  },
  {
    id: "gpx-resistance",
    status: "next",
    title: "GPX-Based Resistance Simulation",
    description:
      "Upload GPX files with routes. Real elevation data drives resistance recommendations. Feel the climb when the video shows a 10% gradient. Automatic gear change suggestions.",
    category: "Core",
  },
  {
    id: "equipment-reviews",
    status: "planned",
    title: "Equipment Directory & Reviews",
    description:
      "Ergometer, spin bike, and home trainer reviews. Bikefitter directory. Expert profiles. Brand partnerships. Community ratings and recommendations.",
    category: "Content",
  },
  {
    id: "achievements",
    status: "planned",
    title: "Achievements & Badges",
    description:
      "Unlock badges for milestones: first ride, 100km total, 10 routes completed, streak badges. Shareable achievement cards. Leaderboard integration.",
    category: "Gamification",
  },
  {
    id: "heart-rate",
    status: "planned",
    title: "Heart Rate Monitor Integration",
    description:
      "Connect Bluetooth HR monitors directly in the browser (Web Bluetooth API). Live heart rate display, zone training, calorie accuracy improvement.",
    category: "Hardware",
  },
  {
    id: "multiplayer",
    status: "planned",
    title: "Ride Together — Multiplayer",
    description:
      "Ride the same route with friends in real-time. See each other's speed and position. Voice chat. Virtual riding groups. Scheduled group events.",
    category: "Social",
  },
  {
    id: "running-mode",
    status: "planned",
    title: "Running & Treadmill Mode",
    description:
      "Full running support. Webcam detects running cadence on treadmills. POV running routes through cities and trails. Running-specific physics and metrics.",
    category: "Core",
  },
  {
    id: "creator-marketplace",
    status: "planned",
    title: "Creator Route Marketplace",
    description:
      "Creators set prices for premium routes. 70/30 revenue split. Route bundles and series. Creator profiles with follower system. Revenue analytics dashboard.",
    category: "Creator",
  },
  {
    id: "challenges",
    status: "planned",
    title: "Monthly Challenges & Competitions",
    description:
      "Community challenges: 'Ride 200km in February'. Sponsored prizes from cycling brands. Leaderboards. Personal challenge creation for cycling clubs.",
    category: "Social",
  },
  {
    id: "vr-mode",
    status: "exploring",
    title: "VR Ride Experience",
    description:
      "360° video routes for VR headsets (Meta Quest, Apple Vision Pro). Immersive first-person riding with head tracking. VR multiplayer — ride beside your friends in virtual reality.",
    category: "Future",
  },
  {
    id: "ai-coaching",
    status: "exploring",
    title: "AI Training Coach",
    description:
      "AI-powered coaching that analyzes your rides and suggests improvements. Personalized training recommendations. Fatigue detection. Optimal training load calculation.",
    category: "Future",
  },
  {
    id: "strava-sync",
    status: "exploring",
    title: "Strava & Garmin Connect Sync",
    description:
      "Automatic upload of CycleRun rides to Strava and Garmin Connect. Import FIT/TCX/GPX files. Sync training history across platforms.",
    category: "Integration",
  },
  {
    id: "mobile-app",
    status: "exploring",
    title: "Native iOS & Android App",
    description:
      "Dedicated mobile apps with offline route support, push notifications for challenges, and Apple Watch / Wear OS heart rate integration.",
    category: "Platform",
  },
];

// ── Feature Request Ideas (vote-able) ──

interface FeatureRequest {
  id: string;
  title: string;
  votes: number;
  category: string;
}

const featureRequests: FeatureRequest[] = [
  { id: "fr-1", title: "Interval Training Mode (HIIT)", votes: 47, category: "Training" },
  { id: "fr-2", title: "Custom Resistance Curves per Route", votes: 38, category: "Core" },
  { id: "fr-3", title: "Social Feed — See Friends' Rides", votes: 34, category: "Social" },
  { id: "fr-4", title: "Dark/Light Theme Toggle", votes: 29, category: "UI" },
  { id: "fr-5", title: "Apple Watch Cadence Detection", votes: 27, category: "Hardware" },
  { id: "fr-6", title: "Route Map Overlay During Ride", votes: 25, category: "Core" },
  { id: "fr-7", title: "Spotify / Apple Music Integration", votes: 23, category: "Integration" },
  { id: "fr-8", title: "Power (Watts) Estimation Algorithm", votes: 21, category: "Analytics" },
  { id: "fr-9", title: "Multi-Language Route Descriptions", votes: 18, category: "Content" },
  { id: "fr-10", title: "Zwift .fit File Import for Comparison", votes: 15, category: "Integration" },
];

// ── Tag colors ──

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

function statusLabel(s: string): string {
  switch (s) {
    case "next": return "Up Next";
    case "planned": return "Planned";
    case "exploring": return "Exploring";
    default: return s;
  }
}

// ── Page ──

export default function RoadmapPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "CycleRun Roadmap & Changelog",
    description: metadata.description,
    url: "https://cyclerun.app/roadmap",
    isPartOf: { "@type": "WebSite", name: "CycleRun.app", url: "https://cyclerun.app" },
  };

  return (
    <>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <div className="roadmap-page">
        <nav className="creator-nav">
          <Link href="/" className="creator-nav-logo">cyclerun<span className="creator-nav-app">.app</span></Link>
          <Link href="/creator" className="btn-ghost btn-sm">Become a Creator</Link>
        </nav>

        {/* Hero */}
        <header className="roadmap-hero">
          <span className="creator-badge">Roadmap</span>
          <h1>Built in the Open. <span className="gradient-text">Shaped by You.</span></h1>
          <p className="roadmap-hero-sub">
            See what we shipped, what&apos;s coming next, and vote on the features that matter most to you. CycleRun is a community project — your voice drives development.
          </p>
          <div className="roadmap-hero-actions">
            <a href="#vote" className="btn-primary btn-lg">Vote on Features</a>
            <a href="#changelog" className="btn-ghost">View Changelog ↓</a>
          </div>
        </header>

        {/* ───── Changelog ───── */}
        <section className="roadmap-section" id="changelog">
          <h2>Changelog</h2>
          <p className="section-subtitle">14 days of shipping. Here&apos;s everything we&apos;ve built so far.</p>

          <div className="changelog-timeline">
            {changelog.map((entry, i) => (
              <div key={i} className="changelog-entry">
                <div className="changelog-date">{entry.date}</div>
                <div className="changelog-dot" />
                <div className="changelog-card">
                  <span className={`roadmap-tag ${tagClass(entry.tag)}`}>{entry.tag}</span>
                  <h3>{entry.title}</h3>
                  <p>{entry.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ───── Upcoming Features ───── */}
        <section className="roadmap-section roadmap-section-dark" id="upcoming">
          <h2>What&apos;s Coming</h2>
          <p className="section-subtitle">Features in our pipeline — from &quot;shipping soon&quot; to &quot;exploring ideas&quot;.</p>

          {(["next", "planned", "exploring"] as const).map((status) => {
            const items = upcomingFeatures.filter((f) => f.status === status);
            return (
              <div key={status} className="upcoming-group">
                <h3 className="upcoming-group-title">
                  <span className={`roadmap-tag ${tagClass(status)}`}>{statusLabel(status)}</span>
                  <span className="upcoming-count">{items.length} features</span>
                </h3>
                <div className="upcoming-grid">
                  {items.map((f) => (
                    <div key={f.id} className="upcoming-card">
                      <span className="upcoming-category">{f.category}</span>
                      <h4>{f.title}</h4>
                      <p>{f.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </section>

        {/* ───── Feature Voting ───── */}
        <section className="roadmap-section" id="vote">
          <h2>Vote on Features</h2>
          <p className="section-subtitle">
            What should we build next? Upvote the features you want most.
            <br />
            <strong style={{ color: "var(--accent-1)" }}>Register to vote</strong> — your voice shapes CycleRun&apos;s future.
          </p>

          <div className="vote-list">
            {featureRequests
              .sort((a, b) => b.votes - a.votes)
              .map((fr) => (
                <div key={fr.id} className="vote-card">
                  <VoteButton votes={fr.votes} />
                  <div className="vote-info">
                    <h4>{fr.title}</h4>
                    <span className="upcoming-category">{fr.category}</span>
                  </div>
                </div>
              ))}
          </div>

          <div className="vote-register-cta">
            <p>Want to vote? <strong>Register for free</strong> to unlock voting and shape CycleRun&apos;s future.</p>
            <Link href="/" className="btn-primary btn-sm">Register &amp; Vote</Link>
          </div>
        </section>

        {/* ───── CTA ───── */}
        <section className="seo-cta" style={{ maxWidth: "640px", margin: "2rem auto 0" }}>
          <h2>Start Riding Today</h2>
          <p>Don&apos;t wait for new features — CycleRun is already fully functional. Open it in your browser and ride.</p>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/" className="btn-primary btn-lg">Start Riding Free</Link>
            <Link href="/creator" className="btn-ghost">Become a Creator →</Link>
          </div>
        </section>

        <SubpageFooter />
      </div>
    </>
  );
}
