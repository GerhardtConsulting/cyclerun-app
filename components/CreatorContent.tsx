"use client";

import Link from "next/link";
import { t } from "@/lib/i18n";
import { useLocale } from "@/lib/useLocale";
import SubpageNav from "@/components/SubpageNav";
import SubpageFooter from "@/components/SubpageFooter";

export default function CreatorContent() {
  const locale = useLocale();
  const isDE = locale === "de";

  // Recording guide content - bilingual
  const guide = {
    cameraTitle: isDE ? "Kamera-Setup" : "Camera Setup",
    cameraRec: isDE ? "Empfohlene Kameras" : "Recommended Cameras",
    cameraSettings: isDE ? "Einstellungen" : "Settings",
    cameraMounting: isDE ? "Montage" : "Mounting",
    gpxTitle: isDE ? "GPX & Standortdaten" : "GPX & Location Data",
    gpxWhat: isDE ? "Was ist GPX?" : "What is GPX?",
    gpxWhy: isDE ? "Warum GPX wichtig ist" : "Why GPX Matters",
    gpxHow: isDE ? "GPX aufnehmen" : "How to Record GPX",
    gpxStructure: isDE ? "GPX-Dateistruktur" : "GPX File Structure",
    gpxFuture: isDE ? "Zukunft: Automatischer Widerstand" : "Future: Automatic Resistance",
    routesTitle: isDE ? "Strecken die performen" : "Routes That Perform",
    routesTop: isDE ? "Top-Kategorien" : "Top Categories",
    routesTips: isDE ? "Profi-Tipps" : "Pro Tips",
    editTitle: isDE ? "Schnitt & Export" : "Editing & Export",
    editSimple: isDE ? "Halte es einfach" : "Keep It Simple",
    editExport: isDE ? "Export-Einstellungen" : "Export Settings",
    // FAQ
    faqTitle: t("sub.creator.badge") === "Creator-Programm" ? "Häufig gestellte Fragen" : "Frequently Asked Questions",
    faqItems: isDE ? [
      { q: "Wie viel kann ich als CycleRun Creator verdienen?", a: "Die Einnahmen hängen von der Beliebtheit der Strecke ab. Creator erhalten 70% Umsatzbeteiligung bei Premium-Streckenkäufen. Beliebte Strecken mit schönen Landschaften können signifikantes passives Einkommen generieren. Kostenlose Strecken sind ebenfalls willkommen und helfen beim Aufbau deines Publikums." },
      { q: "Welche Ausrüstung brauche ich?", a: "Eine Action-Kamera (GoPro, DJI Osmo Action, Insta360) mit Brust- oder Lenkermontage. Ein GPS-Gerät für GPX-Daten wird empfohlen, ist aber optional. Jedes Fahrrad funktioniert — Rennrad, Gravel, MTB. Sogar ein Smartphone mit guter Halterung kann großartige Ergebnisse liefern." },
      { q: "Was ist eine GPX-Datei und warum ist sie wichtig?", a: "GPX (GPS Exchange Format) zeichnet Routenkoordinaten, Höhendaten und Zeitstempel auf. In Kombination mit deinem Video kann CycleRun realistische Steigungen und Widerstandsänderungen simulieren. Nimm GPX mit Strava, Garmin, Wahoo oder dem integrierten GPS deiner GoPro auf." },
      { q: "Wie lang sollten meine Streckenvideos sein?", a: "20–60 Minuten ist der Sweet Spot. Kurze Strecken (15–20 Min.) für schnelle Sessions. Längere Strecken (45–60 Min.) sind beliebt für Ausdauertraining. Du kannst auch Serien verbundener Strecken erstellen." },
      { q: "Behalte ich das Eigentum an meinen Videos?", a: "Absolut. Du behältst das volle Eigentum an allen Inhalten. Keine Exklusivität — lade dieselben Videos auf YouTube, Rouvy oder jede andere Plattform hoch. Wir erhalten eine nicht-exklusive Lizenz zum Streamen deiner Inhalte." },
      { q: "Wie funktioniert der Bewerbungsprozess?", a: "Sende das Bewerbungsformular unten ab. Wir prüfen innerhalb von 48 Stunden. Nach Genehmigung erhältst du Zugang zum Creator Dashboard für Uploads, Analytics und Einnahmen-Tracking." },
      { q: "Kann ich Strecken von überall auf der Welt hochladen?", a: "Ja! Wir haben Fahrer aus 50+ Ländern. Lokale Strecken, versteckte Perlen und ikonische Ziele — alles performt gut. Vielfalt macht die CycleRun-Streckenbibliothek besonders." },
    ] : [
      { q: "How much can I earn as a CycleRun creator?", a: "Earnings depend on route popularity. Creators earn a 70% revenue share from premium route purchases. Popular routes with scenic locations can generate significant passive income as the community grows. Free routes are also welcome and help build your audience." },
      { q: "What equipment do I need?", a: "An action camera (GoPro, DJI Osmo Action, Insta360) with a chest or handlebar mount. A GPS device for GPX data is recommended but optional. Any bicycle works — road, gravel, MTB. Even a smartphone with a good mount can produce great results." },
      { q: "What is a GPX file and why does it matter?", a: "GPX (GPS Exchange Format) records your route coordinates, elevation, and timestamps. When paired with your video, CycleRun can simulate realistic inclines and resistance changes. Record GPX with Strava, Garmin, Wahoo, or your GoPro's built-in GPS." },
      { q: "How long should my route videos be?", a: "20–60 minutes is the sweet spot. Short routes (15–20 min) work for quick sessions. Longer routes (45–60 min) are popular for endurance training. You can create series of connected routes for multi-stage rides." },
      { q: "Do I keep ownership of my videos?", a: "Absolutely. You retain full ownership of all content. No exclusivity — upload the same videos to YouTube, Rouvy, or any other platform. We grant CycleRun a non-exclusive license to stream your content to riders." },
      { q: "How does the approval process work?", a: "Submit the application form below. We review within 48 hours. Once approved, you receive access to the Creator Dashboard for uploading, analytics, and earnings tracking. We look for authentic POV cycling content — no professional production required." },
      { q: "Can I upload routes from anywhere in the world?", a: "Yes! We have riders from 50+ countries. Local routes, hidden gems, and iconic destinations all perform well. Diversity is what makes the CycleRun route library special." },
    ],
    // Influencer section items
    infItems: isDE ? [
      { title: "Gesponserte Strecken", desc: "Marken sponsern beliebte Strecken. Deine \"Sponsored by Canyon\" Mallorca-Fahrt könnte dir hunderte Euro pro Monat einbringen. Wir verbinden dich mit Cycling-Marken." },
      { title: "Baue deine Fanbase auf", desc: "Jeder Fahrer, der deine Strecke liebt, sieht dein Profil. Verlinke Instagram, YouTube, TikTok und Strava. Verwandle Fahrer in Follower auf all deinen Plattformen." },
      { title: "Premium-Strecken-Verkäufe", desc: "Setze einen Preis für deine besten Strecken. Du behältst 70% jedes Verkaufs. Eine beliebte Strecke kann monatelang passives Einkommen generieren." },
      { title: "Creator Badges & Awards", desc: "\"Offizieller CycleRun Creator\" Badge für deine Social-Profile. Monatlicher \"Strecke des Monats\" Award mit Featured-Platzierung." },
      { title: "Challenge-Partnerschaften", desc: "Erstelle gebrandete Challenges: \"Fahr 5 meiner Alpen-Strecken diesen Monat\". Sponsoren stellen Preise bereit. Du bekommst Sichtbarkeit, Fahrer Motivation." },
      { title: "Analytics Dashboard", desc: "Sieh genau, wie viele Fahrer deine Strecken gewählt haben, durchschnittliche Fahrzeit, Abschlussrate und Einnahmen. Datengetriebene Insights für deine Content-Strategie." },
    ] : [
      { title: "Sponsored Routes", desc: "Brands pay to sponsor popular routes. Your \"Sponsored by Canyon\" Mallorca ride could earn you hundreds per month. We connect you with cycling brands looking for authentic content." },
      { title: "Build Your Fanbase", desc: "Every rider who loves your route sees your profile. Link your Instagram, YouTube, TikTok, and Strava. Convert riders into followers across all your platforms." },
      { title: "Premium Route Sales", desc: "Set a price for your best routes. You keep 70% of every sale. One popular route can generate passive income for months — film once, earn forever." },
      { title: "Creator Badges & Awards", desc: "\"Official CycleRun Creator\" badge for your social profiles. Monthly \"Route of the Month\" award with featured placement and social shoutout to thousands of riders." },
      { title: "Challenge Partnerships", desc: "Create branded challenges: \"Ride 5 of my Alpine routes this month\". Sponsors provide prizes (bikes, gear, vouchers). You get visibility, riders get motivation." },
      { title: "Analytics Dashboard", desc: "See exactly how many riders chose your routes, average ride time, completion rate, and revenue. Data-driven insights to optimize your content strategy." },
    ],
  };

  const infIcons = [
    <svg key="0" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>,
    <svg key="1" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4-4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>,
    <svg key="2" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 9l6 6 6-6" /><path d="M12 3v12" /><rect x="3" y="17" width="18" height="4" rx="1" /></svg>,
    <svg key="3" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="7" /><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" /></svg>,
    <svg key="4" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></svg>,
    <svg key="5" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 20V10" /><path d="M18 20V4" /><path d="M6 20v-4" /></svg>,
  ];

  // Recording guide camera/gpx items are technical and stay mostly English (model names, settings) but headings are translated
  const cameraItems = isDE ? [
    <><strong>GoPro Hero 12/13</strong> — Beste Allround-Kamera. HyperSmooth-Stabilisierung ist hervorragend. 1080p@30fps ist der Sweet Spot.</>,
    <><strong>DJI Osmo Action 4/5</strong> — Exzellente Stabilisierung, großartige Akkulaufzeit. RockSteady-Modus ideal für Radfahren.</>,
    <><strong>Insta360 X3/X4</strong> — 360°-Aufnahme ermöglicht nachträgliches Reframing. Größere Dateien.</>,
    <><strong>iPhone/Smartphone</strong> — Ordentlich mit guter Halterung. Kino-Modus oder stabilisiertes 1080p nutzen.</>,
  ] : [
    <><strong>GoPro Hero 12/13</strong> — Best overall. HyperSmooth stabilization is exceptional. 1080p@30fps is the sweet spot.</>,
    <><strong>DJI Osmo Action 4/5</strong> — Excellent stabilization, great battery life. RockSteady mode is ideal for cycling.</>,
    <><strong>Insta360 X3/X4</strong> — 360° capture lets you reframe in post. Great for flexible angles, but larger file sizes.</>,
    <><strong>iPhone/Smartphone</strong> — Decent in a pinch with a good mount. Use cinematic mode or stabilized 1080p.</>,
  ];

  return (
    <div className="creator-page">
      <SubpageNav rightLabel={t("sub.apply_now")} rightHref="#apply" />

      {/* Hero Section */}
      <section className="creator-hero">
        <div className="creator-hero-inner">
          <span className="creator-badge">{t("sub.creator.badge")}</span>
          <h1>
            {t("sub.creator.hero_1")}<br />
            <span className="gradient-text">{t("sub.creator.hero_2")}</span>
          </h1>
          <p className="creator-hero-sub">{t("sub.creator.hero_sub")}</p>
          <div className="creator-hero-stats">
            <div className="creator-stat">
              <span className="creator-stat-num">{isDE ? "Wachsend" : "Growing"}</span>
              <span className="creator-stat-label">{isDE ? "Aktive Community" : "Active Community"}</span>
            </div>
            <div className="creator-stat">
              <span className="creator-stat-num">0€</span>
              <span className="creator-stat-label">{t("sub.creator.to_join")}</span>
            </div>
            <div className="creator-stat">
              <span className="creator-stat-num">70%</span>
              <span className="creator-stat-label">{t("sub.creator.revenue_share")}</span>
            </div>
          </div>
          <div className="creator-hero-cta">
            <a href="#apply" className="btn-primary btn-lg">
              {t("sub.creator.apply_btn")}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
            <a href="#how-it-works" className="btn-ghost">{t("sub.learn_more")}</a>
          </div>
        </div>
      </section>

      {/* Why Creators Love CycleRun */}
      <section className="creator-section" id="why">
        <h2>{t("sub.creator.why_title")} <span className="gradient-text">CycleRun</span></h2>
        <p className="section-subtitle">{t("sub.creator.why_sub")}</p>
        <div className="creator-benefits-grid">
          {[
            { icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>, k: "b1" },
            { icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>, k: "b2" },
            { icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>, k: "b3" },
            { icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>, k: "b4" },
            { icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15 15 0 014 10 15 15 0 01-4 10 15 15 0 01-4-10 15 15 0 014-10" /></svg>, k: "b5" },
            { icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" /></svg>, k: "b6" },
          ].map((b, i) => (
            <div className="creator-benefit" key={i}>
              <div className="benefit-icon">{b.icon}</div>
              <h3>{t(`sub.creator.${b.k}_title`)}</h3>
              <p>{t(`sub.creator.${b.k}_desc`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="creator-section creator-section-dark" id="how-it-works">
        <h2>{t("sub.creator.how_title")}</h2>
        <p className="section-subtitle">{t("sub.creator.how_sub")}</p>
        <div className="creator-steps">
          <div className="creator-step">
            <div className="step-number">1</div>
            <h3>{t("sub.creator.step1")}</h3>
            <p>{t("sub.creator.step1_desc")}</p>
          </div>
          <div className="step-connector">
            <svg width="40" height="2" viewBox="0 0 40 2"><line x1="0" y1="1" x2="40" y2="1" stroke="rgba(249,115,22,0.3)" strokeWidth="2" strokeDasharray="6 4" /></svg>
          </div>
          <div className="creator-step">
            <div className="step-number">2</div>
            <h3>{t("sub.creator.step2")}</h3>
            <p>{t("sub.creator.step2_desc")}</p>
          </div>
          <div className="step-connector">
            <svg width="40" height="2" viewBox="0 0 40 2"><line x1="0" y1="1" x2="40" y2="1" stroke="rgba(249,115,22,0.3)" strokeWidth="2" strokeDasharray="6 4" /></svg>
          </div>
          <div className="creator-step">
            <div className="step-number">3</div>
            <h3>{t("sub.creator.step3")}</h3>
            <p>{t("sub.creator.step3_desc")}</p>
          </div>
        </div>
      </section>

      {/* Recording Guide - technical content with translated headings */}
      <section className="creator-section" id="recording-guide">
        <h2>{isDE ? "Der komplette" : "The Complete"} <span className="gradient-text">{isDE ? "Aufnahme-Guide" : "Recording Guide"}</span></h2>
        <p className="section-subtitle">
          {isDE ? "Alles was du wissen musst, um Strecken zu erstellen, die Fahrer lieben. Von Kameraeinstellungen bis GPS-Daten." : "Everything you need to know to create routes riders love. From camera settings to GPS data."}
        </p>
        <div className="guide-grid">
          <article className="guide-card guide-card-wide">
            <div className="guide-card-header">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" /><circle cx="12" cy="13" r="4" /></svg>
              <h3>{guide.cameraTitle}</h3>
            </div>
            <div className="guide-card-body">
              <h4>{guide.cameraRec}</h4>
              <ul>{cameraItems.map((item, i) => <li key={i}>{item}</li>)}</ul>
              <h4>{guide.cameraSettings}</h4>
              <ul>
                <li><strong>{isDE ? "Auflösung:" : "Resolution:"}</strong> 1080p (1920×1080)</li>
                <li><strong>{isDE ? "Bildrate:" : "Frame Rate:"}</strong> 30fps</li>
                <li><strong>{isDE ? "Stabilisierung:" : "Stabilization:"}</strong> {isDE ? "Immer EIN" : "Always ON"}</li>
                <li><strong>FOV:</strong> Wide / SuperView</li>
                <li><strong>{isDE ? "Farbe:" : "Color:"}</strong> Natural/Standard</li>
              </ul>
              <h4>{guide.cameraMounting}</h4>
              <ul>
                <li><strong>{isDE ? "Brustmontage (Empfohlen)" : "Chest Mount (Recommended)"}</strong> — {isDE ? "Natürlichste Perspektive" : "Most natural perspective"}</li>
                <li><strong>{isDE ? "Lenkermontage" : "Handlebar Mount"}</strong> — {isDE ? "Stabileres Bild auf glatten Straßen" : "Steadier image on smooth roads"}</li>
                <li><strong>{isDE ? "Helmmontage" : "Helmet Mount"}</strong> — {isDE ? "Nur mit maximaler Stabilisierung" : "Only use with excellent stabilization"}</li>
              </ul>
            </div>
          </article>
          <article className="guide-card guide-card-wide">
            <div className="guide-card-header">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
              <h3>{guide.gpxTitle}</h3>
            </div>
            <div className="guide-card-body">
              <h4>{guide.gpxWhat}</h4>
              <p>{isDE ? "GPX (GPS Exchange Format) ist ein XML-basiertes Dateiformat zum Speichern von GPS-Koordinaten, Höhendaten und Zeitstempeln. In Kombination mit deinem Video kann CycleRun automatisch den Widerstand basierend auf echten Höhenänderungen anpassen." : "GPX (GPS Exchange Format) is an XML-based file format for storing GPS coordinates, elevation data, and timestamps. When you pair a GPX file with your video, CycleRun can automatically adjust resistance based on real-world elevation changes."}</p>
              <h4>{guide.gpxHow}</h4>
              <ul>
                <li><strong>{isDE ? "Radcomputer" : "Cycling Computer"}</strong> — Garmin Edge, Wahoo ELEMNT, Hammerhead Karoo</li>
                <li><strong>{isDE ? "Smartphone Apps" : "Smartphone Apps"}</strong> — Strava, Komoot, Ride with GPS</li>
                <li><strong>GoPro GPS</strong> — GoPro Hero 9+ / GoPro Quik / <code>gopro2gpx</code></li>
              </ul>
            </div>
          </article>
          <article className="guide-card">
            <div className="guide-card-header">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26" /></svg>
              <h3>{guide.routesTitle}</h3>
            </div>
            <div className="guide-card-body">
              <h4>{guide.routesTop}</h4>
              <ul>
                <li><strong>{isDE ? "Küstenstraßen" : "Coastal Roads"}</strong> — {isDE ? "Meerblick, flach bis hügelig. Perfekt für Anfänger." : "Ocean views, flat to rolling. Perfect for beginners."}</li>
                <li><strong>{isDE ? "Bergpässe" : "Mountain Passes"}</strong> — {isDE ? "Epische Anstiege mit dramatischen Ausblicken." : "Epic climbs with dramatic views."}</li>
                <li><strong>{isDE ? "Stadttouren" : "City Tours"}</strong> — {isDE ? "Berühmte Städte. Einzigartiger Reiz." : "Famous cities. Unique appeal."}</li>
                <li><strong>{isDE ? "Wald & Natur" : "Forest & Nature"}</strong> — {isDE ? "Ruhige Waldrouten für Erholungsfahrten." : "Quiet woodland routes for recovery rides."}</li>
              </ul>
            </div>
          </article>
          <article className="guide-card">
            <div className="guide-card-header">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="2.18" /><line x1="7" y1="2" x2="7" y2="22" /><line x1="17" y1="2" x2="17" y2="22" /><line x1="2" y1="12" x2="22" y2="12" /></svg>
              <h3>{guide.editTitle}</h3>
            </div>
            <div className="guide-card-body">
              <h4>{guide.editSimple}</h4>
              <ul>
                <li>{isDE ? "Start und Ende trimmen" : "Trim start and end"}</li>
                <li>{isDE ? "Stabilisierung anwenden falls nötig" : "Apply stabilization if needed"}</li>
                <li>{isDE ? "Keine Musik — Fahrer spielen ihre eigene" : "No music — riders play their own"}</li>
                <li>{isDE ? "Keine Text-Overlays oder Intros" : "No text overlays or intros"}</li>
              </ul>
              <h4>{guide.editExport}</h4>
              <ul>
                <li><strong>Format:</strong> MP4 (H.264)</li>
                <li><strong>{isDE ? "Auflösung:" : "Resolution:"}</strong> 1920×1080</li>
                <li><strong>Bitrate:</strong> 15–25 Mbps</li>
                <li><strong>Max:</strong> 10 GB</li>
              </ul>
            </div>
          </article>
        </div>
      </section>

      {/* FAQ */}
      <section className="creator-section creator-section-dark" id="faq">
        <h2>{guide.faqTitle}</h2>
        <div className="creator-faq">
          {guide.faqItems.map((faq, i) => (
            <details key={i} className="faq-item">
              <summary>{faq.q}</summary>
              <p>{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Influencer Monetization */}
      <section className="creator-section" id="influencer">
        <h2>{t("sub.creator.influencer_title")} <span className="gradient-text">{t("sub.creator.influencer_highlight")}</span></h2>
        <p className="section-subtitle">{t("sub.creator.influencer_sub")}</p>
        <div className="creator-benefits-grid">
          {guide.infItems.map((item, i) => (
            <div className="creator-benefit" key={i}>
              <div className="benefit-icon">{infIcons[i]}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Apply Section */}
      <section className="creator-section" id="apply">
        <h2>{t("sub.creator.apply_1")}<span className="gradient-text">{t("sub.creator.apply_2")}</span>?</h2>
        <p className="section-subtitle">{t("sub.creator.apply_sub")}</p>
        <div className="creator-apply-card">
          <form id="creatorApplyForm" className="creator-form">
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="creatorName">{t("sub.creator.form_name")}</label>
                <input type="text" id="creatorName" placeholder={isDE ? "Dein Name" : "Your name"} required />
              </div>
              <div className="form-field">
                <label htmlFor="creatorEmail">{t("sub.creator.form_email")}</label>
                <input type="email" id="creatorEmail" placeholder="your@email.com" required />
              </div>
            </div>
            <div className="form-field">
              <label htmlFor="creatorSocial">{t("sub.creator.form_social")}</label>
              <input type="url" id="creatorSocial" placeholder="https://instagram.com/yourname" />
            </div>
            <div className="form-field">
              <label htmlFor="creatorRoutes">{t("sub.creator.form_routes")}</label>
              <textarea id="creatorRoutes" rows={3} placeholder={isDE ? "Wo fährst du? Was macht deine Strecken besonders?" : "Where do you ride? What makes your routes special?"}></textarea>
            </div>
            <label className="creator-consent">
              <input type="checkbox" id="creatorConsent" required />
              <span>{t("sub.creator.form_consent")} <Link href="/datenschutz">{t("sub.creator.form_consent_link")}</Link>{t("sub.creator.form_consent_2")}</span>
            </label>
            <button type="submit" className="btn-primary btn-lg btn-full">
              {t("sub.creator.form_submit")}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>
          </form>
          <p className="creator-apply-hint">{t("sub.creator.form_hint")}</p>
        </div>
      </section>

      <section style={{ maxWidth: '720px', margin: '0 auto 2rem', padding: '0 2rem', textAlign: 'center' as const }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>{t("sub.explore")}</h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' as const, justifyContent: 'center' }}>
          <Link href="/" className="route-badge">{t("sub.start_riding")}</Link>
          <Link href="/routes" className="route-badge">{t("sub.browse_routes")}</Link>
          <Link href="/guide/virtual-cycling-videos" className="route-badge">{t("sub.footer.cycling_videos")}</Link>
          <Link href="/blog" className="route-badge">{t("sub.footer.blog")}</Link>
          <Link href="/guide" className="route-badge">{t("sub.guide.guides")}</Link>
        </div>
      </section>

      <SubpageFooter />
    </div>
  );
}
