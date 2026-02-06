import Link from "next/link";
import type { Metadata } from "next";
import SubpageFooter from "@/components/SubpageFooter";

export const metadata: Metadata = {
  title: "Become a Creator — Earn Money with Your Cycling Videos | CycleRun.app",
  description:
    "Share your POV cycling routes with 10,000+ riders. Earn passive income, grow your audience, and join the fastest-growing indoor cycling community. Free to join — apply in 2 minutes.",
  keywords:
    "cycling creator, POV cycling video, indoor cycling routes, cycling content creator, cycling video monetization, GoPro cycling, cycling influencer, route video creator, cycling community, fitness creator platform",
  alternates: {
    canonical: "/creator",
  },
  openGraph: {
    title: "Become a CycleRun Creator — Your Routes, Your Revenue",
    description:
      "Film your rides, upload POV routes, and earn from every play. Join the community-powered indoor cycling revolution.",
    type: "website",
    url: "https://cyclerun.app/creator",
  },
  twitter: {
    card: "summary_large_image",
    title: "Become a CycleRun Creator — Your Routes, Your Revenue",
    description:
      "Film your rides, upload POV routes, and earn from every play.",
  },
};

const jsonLdHowTo = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Record Perfect POV Cycling Videos for CycleRun",
  description:
    "Step-by-step guide to recording immersive first-person cycling videos that indoor riders love.",
  totalTime: "PT30M",
  supply: [
    { "@type": "HowToSupply", name: "Action camera (GoPro, DJI, Insta360)" },
    { "@type": "HowToSupply", name: "Chest or handlebar mount" },
    { "@type": "HowToSupply", name: "Bicycle" },
  ],
  tool: [
    { "@type": "HowToTool", name: "GPS-enabled camera or phone for GPX data" },
    { "@type": "HowToTool", name: "Video editing software (optional)" },
  ],
  step: [
    {
      "@type": "HowToStep",
      name: "Choose Your Route",
      text: "Select a scenic route with varied terrain. Coastal roads, mountain passes, and forest trails perform best. Routes between 20–60 minutes are ideal.",
    },
    {
      "@type": "HowToStep",
      name: "Set Up Your Camera",
      text: "Mount your action camera on your chest or handlebars. Use 1080p or 4K at 30fps. Enable electronic image stabilization (EIS). Keep the horizon level.",
    },
    {
      "@type": "HowToStep",
      name: "Record GPS/GPX Data",
      text: "Enable GPS on your camera or use a cycling computer (Garmin, Wahoo) to record a .gpx file. This data enables elevation-based resistance simulation.",
    },
    {
      "@type": "HowToStep",
      name: "Ride and Record",
      text: "Maintain a steady pace. Avoid sudden head movements. Signal turns smoothly. Ride defensively — your video will be watched by thousands.",
    },
    {
      "@type": "HowToStep",
      name: "Edit and Upload",
      text: "Trim start/end, stabilize if needed. Export as MP4 (H.264, 1080p). Upload to CycleRun with your GPX file, route description, and thumbnail.",
    },
  ],
};

const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How much can I earn as a CycleRun creator?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Earnings depend on route popularity. Creators earn a revenue share from premium route purchases. Popular routes with scenic locations can generate significant passive income as the community grows.",
      },
    },
    {
      "@type": "Question",
      name: "What equipment do I need?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "An action camera (GoPro Hero, DJI Osmo Action, Insta360) with a chest or handlebar mount. A GPS-enabled device for GPX data is recommended but optional. Any bicycle works.",
      },
    },
    {
      "@type": "Question",
      name: "What is a GPX file and why does it matter?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "GPX (GPS Exchange Format) is an XML-based file that records your route coordinates, elevation, and timestamps. When paired with your video, CycleRun can simulate realistic inclines and resistance changes, creating a much more immersive experience for riders.",
      },
    },
    {
      "@type": "Question",
      name: "How long should my route videos be?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "20–60 minutes is the sweet spot. Short routes (15–20 min) work great for quick sessions. Longer routes (45–60 min) are popular for endurance training. You can also create series of connected routes.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need to edit my videos?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Minimal editing is fine. Trim the start and end, apply stabilization if your camera doesn't have built-in EIS. Raw, authentic rides often perform better than over-produced content.",
      },
    },
    {
      "@type": "Question",
      name: "How does the approval process work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Apply with your name and email. We review applications within 48 hours. Once approved, you get access to the Creator Dashboard where you can upload routes, track views, and manage earnings.",
      },
    },
  ],
};

const jsonLdBreadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "CycleRun.app", item: "https://cyclerun.app" },
    { "@type": "ListItem", position: 2, name: "Become a Creator", item: "https://cyclerun.app/creator" },
  ],
};

const jsonLdWebPage = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Become a CycleRun Creator",
  description: "Join the CycleRun creator program. Film POV cycling routes, earn revenue, and reach thousands of indoor riders.",
  url: "https://cyclerun.app/creator",
  isPartOf: { "@type": "WebSite", name: "CycleRun.app", url: "https://cyclerun.app" },
  breadcrumb: jsonLdBreadcrumb,
};

export default function CreatorPage() {
  return (
    <>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebPage) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHowTo) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      </head>

      <div className="creator-page">
        {/* Navigation */}
        <nav className="creator-nav">
          <Link href="/" className="creator-nav-logo">
            cyclerun<span className="creator-nav-app">.app</span>
          </Link>
          <a href="#apply" className="btn-primary btn-sm">Apply Now</a>
        </nav>

        {/* Hero Section */}
        <section className="creator-hero">
          <div className="creator-hero-inner">
            <span className="creator-badge">Creator Program</span>
            <h1>
              Your rides.<br />
              <span className="gradient-text">Thousands of riders.</span>
            </h1>
            <p className="creator-hero-sub">
              Film your favourite routes. Upload them to CycleRun. Earn revenue from every play
              while thousands of indoor riders experience your roads from their living rooms.
            </p>
            <div className="creator-hero-stats">
              <div className="creator-stat">
                <span className="creator-stat-num">10,000+</span>
                <span className="creator-stat-label">Active Riders</span>
              </div>
              <div className="creator-stat">
                <span className="creator-stat-num">0€</span>
                <span className="creator-stat-label">To Join</span>
              </div>
              <div className="creator-stat">
                <span className="creator-stat-num">70%</span>
                <span className="creator-stat-label">Revenue Share</span>
              </div>
            </div>
            <div className="creator-hero-cta">
              <a href="#apply" className="btn-primary btn-lg">
                Apply as Creator
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </a>
              <a href="#how-it-works" className="btn-ghost">Learn more ↓</a>
            </div>
          </div>
        </section>

        {/* Why Creators Love CycleRun */}
        <section className="creator-section" id="why">
          <h2>Why creators choose <span className="gradient-text">CycleRun</span></h2>
          <p className="section-subtitle">
            You already ride the most beautiful routes. Now let others experience them too — and get rewarded for it.
          </p>
          <div className="creator-benefits-grid">
            <div className="creator-benefit">
              <div className="benefit-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>
              </div>
              <h3>Instant Audience</h3>
              <p>Skip the algorithm. Your routes are immediately visible to our entire active community. No need to build an audience from zero — we bring the riders to you.</p>
            </div>
            <div className="creator-benefit">
              <div className="benefit-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>
              </div>
              <h3>Passive Income</h3>
              <p>Upload once, earn continuously. Every time someone rides your route, you earn. Premium routes generate recurring revenue with zero additional effort.</p>
            </div>
            <div className="creator-benefit">
              <div className="benefit-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
              </div>
              <h3>Your Brand, Amplified</h3>
              <p>Every route shows your creator profile. Link your Instagram, YouTube, or Strava. Riders who love your routes become followers across all your platforms.</p>
            </div>
            <div className="creator-benefit">
              <div className="benefit-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              </div>
              <h3>Creator-First Terms</h3>
              <p>70% revenue share. You own your content. No exclusivity. Upload the same videos to YouTube, Rouvy, or anywhere else. We believe in creators, not lock-in.</p>
            </div>
            <div className="creator-benefit">
              <div className="benefit-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15 15 0 014 10 15 15 0 01-4 10 15 15 0 01-4-10 15 15 0 014-10" /></svg>
              </div>
              <h3>Global Reach</h3>
              <p>Riders from 50+ countries use CycleRun daily. Your local mountain pass becomes a global training destination. Your name, your route, worldwide.</p>
            </div>
            <div className="creator-benefit">
              <div className="benefit-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" /></svg>
              </div>
              <h3>Zero Overhead</h3>
              <p>No hosting costs, no video encoding, no CDN bills. We handle all the tech. You just ride and film. That&apos;s it.</p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="creator-section creator-section-dark" id="how-it-works">
          <h2>How it works</h2>
          <p className="section-subtitle">From application to first earnings in 3 simple steps.</p>
          <div className="creator-steps">
            <div className="creator-step">
              <div className="step-number">1</div>
              <h3>Apply</h3>
              <p>Fill out the form below. Tell us about your riding style and favourite routes. We review applications within 48 hours.</p>
            </div>
            <div className="step-connector">
              <svg width="40" height="2" viewBox="0 0 40 2"><line x1="0" y1="1" x2="40" y2="1" stroke="rgba(249,115,22,0.3)" strokeWidth="2" strokeDasharray="6 4" /></svg>
            </div>
            <div className="creator-step">
              <div className="step-number">2</div>
              <h3>Film &amp; Upload</h3>
              <p>Record your rides in first-person view. Upload the video plus optional GPX data via the Creator Dashboard.</p>
            </div>
            <div className="step-connector">
              <svg width="40" height="2" viewBox="0 0 40 2"><line x1="0" y1="1" x2="40" y2="1" stroke="rgba(249,115,22,0.3)" strokeWidth="2" strokeDasharray="6 4" /></svg>
            </div>
            <div className="creator-step">
              <div className="step-number">3</div>
              <h3>Earn</h3>
              <p>Riders discover and ride your routes. You earn from every premium play. Track stats in real-time via your dashboard.</p>
            </div>
          </div>
        </section>

        {/* Recording Guide */}
        <section className="creator-section" id="recording-guide">
          <h2>The Complete <span className="gradient-text">Recording Guide</span></h2>
          <p className="section-subtitle">
            Everything you need to know to create routes riders love. From camera settings to GPS data.
          </p>

          <div className="guide-grid">
            {/* Camera Setup */}
            <article className="guide-card guide-card-wide">
              <div className="guide-card-header">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" /><circle cx="12" cy="13" r="4" /></svg>
                <h3>Camera Setup</h3>
              </div>
              <div className="guide-card-body">
                <h4>Recommended Cameras</h4>
                <ul>
                  <li><strong>GoPro Hero 12/13</strong> — Best overall. HyperSmooth stabilization is exceptional. 1080p@30fps is the sweet spot for file size vs. quality.</li>
                  <li><strong>DJI Osmo Action 4/5</strong> — Excellent stabilization, great battery life. RockSteady mode is ideal for cycling.</li>
                  <li><strong>Insta360 X3/X4</strong> — 360° capture lets you reframe in post. Great for flexible angles, but larger file sizes.</li>
                  <li><strong>iPhone/Smartphone</strong> — Decent in a pinch with a good mount. Use cinematic mode or stabilized 1080p. Battery drain is a concern on longer rides.</li>
                </ul>

                <h4>Settings</h4>
                <ul>
                  <li><strong>Resolution:</strong> 1080p (1920×1080) — optimal for streaming. 4K is fine but results in very large files.</li>
                  <li><strong>Frame Rate:</strong> 30fps — smooth playback without excessive file size. Avoid 60fps unless you plan slow-motion edits.</li>
                  <li><strong>Stabilization:</strong> Always ON. Electronic (EIS) or optical — either works. This is the #1 factor for viewer comfort.</li>
                  <li><strong>FOV:</strong> Wide or SuperView. Gives riders a more immersive experience. Avoid fisheye distortion if possible.</li>
                  <li><strong>Color:</strong> Natural/Standard. Avoid heavy color grading — riders want to feel like they&apos;re actually there.</li>
                </ul>

                <h4>Mounting</h4>
                <ul>
                  <li><strong>Chest Mount (Recommended)</strong> — Most natural perspective. Shows the handlebars and road ahead. Minimal head-bob vibration.</li>
                  <li><strong>Handlebar Mount</strong> — Steadier image, but can feel disconnected. Good for mountain bikes with front suspension.</li>
                  <li><strong>Helmet Mount</strong> — Immersive but shaky. Only use with excellent stabilization. Head movements can be distracting.</li>
                </ul>
              </div>
            </article>

            {/* GPX & Location Data */}
            <article className="guide-card guide-card-wide">
              <div className="guide-card-header">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                <h3>GPX &amp; Location Data</h3>
              </div>
              <div className="guide-card-body">
                <h4>What is GPX?</h4>
                <p>
                  <strong>GPX (GPS Exchange Format)</strong> is an XML-based file format for storing GPS coordinates, elevation data, and timestamps.
                  When you pair a GPX file with your video, CycleRun can automatically adjust resistance based on real-world elevation changes —
                  making indoor rides feel dramatically more realistic.
                </p>

                <h4>Why GPX Matters</h4>
                <ul>
                  <li><strong>Elevation Simulation</strong> — Real incline data lets CycleRun suggest gear changes and resistance adjustments. Riders feel the climb.</li>
                  <li><strong>Difficulty Rating</strong> — Automatic calculation of route difficulty based on elevation gain, gradient percentages, and total distance.</li>
                  <li><strong>Route Mapping</strong> — Show riders exactly where they are on a map overlay during the ride. Beautiful visualization.</li>
                  <li><strong>Speed Calibration</strong> — Match video playback to real-world GPS speed for perfect synchronization.</li>
                </ul>

                <h4>How to Record GPX</h4>
                <ul>
                  <li><strong>Cycling Computer</strong> — Garmin Edge, Wahoo ELEMNT, Hammerhead Karoo all export .gpx files natively. Best accuracy.</li>
                  <li><strong>Smartphone Apps</strong> — Strava, Komoot, Ride with GPS, MapMyRide. Record simultaneously with your camera. Export as GPX from the app.</li>
                  <li><strong>GoPro GPS</strong> — GoPro Hero 9+ has built-in GPS. Extract GPX using GoPro Quik or <code>gopro2gpx</code> tools.</li>
                  <li><strong>Garmin VIRB Edit</strong> — Extract GPS telemetry from Garmin cameras directly.</li>
                </ul>

                <h4>GPX File Structure</h4>
                <p>A GPX file contains trackpoints with latitude, longitude, elevation, and time:</p>
                <pre className="code-block">{`<trkpt lat="47.3769" lon="8.5417">
  <ele>408.5</ele>
  <time>2026-01-15T10:30:00Z</time>
</trkpt>`}</pre>
                <p className="guide-hint">
                  CycleRun reads these elevation values to calculate gradient changes in real-time,
                  recommending riders to shift gears up on climbs and recover on descents.
                </p>

                <h4>Future: Automatic Resistance</h4>
                <p>
                  We&apos;re building automatic resistance integration that reads your GPX file and adjusts the difficulty curve of the entire ride —
                  so when your video shows a 10% mountain climb, riders <em>feel</em> it. This creates an unmatched level of immersion
                  that no other camera-based platform offers.
                </p>
              </div>
            </article>

            {/* Route Selection Tips */}
            <article className="guide-card">
              <div className="guide-card-header">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26" /></svg>
                <h3>Routes That Perform</h3>
              </div>
              <div className="guide-card-body">
                <h4>Top Categories</h4>
                <ul>
                  <li><strong>Coastal Roads</strong> — Ocean views, flat to rolling. Perfect for beginners. Consistently highest play counts.</li>
                  <li><strong>Mountain Passes</strong> — Epic climbs with dramatic views. Challenge-seekers love these. Include summit moments.</li>
                  <li><strong>City Tours</strong> — Famous cities (Paris, Barcelona, Tokyo). Unique appeal for tourists and urban cyclists.</li>
                  <li><strong>Forest &amp; Nature</strong> — Quiet woodland routes. Great for relaxed recovery rides. Calming atmosphere.</li>
                  <li><strong>Race Courses</strong> — Famous sportive routes (Alpe d&apos;Huez, Mont Ventoux, Stelvio). Bucket-list appeal.</li>
                </ul>

                <h4>Pro Tips</h4>
                <ul>
                  <li>Golden hour light (morning or evening) dramatically improves visual quality</li>
                  <li>Avoid heavy traffic — car noise and close passes are distracting</li>
                  <li>Include variety: flat sections, climbs, descents, curves</li>
                  <li>Clean your lens before every ride</li>
                  <li>Ride at a moderate pace — 20–25 km/h is ideal for most viewers</li>
                </ul>
              </div>
            </article>

            {/* Video Editing */}
            <article className="guide-card">
              <div className="guide-card-header">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="2.18" /><line x1="7" y1="2" x2="7" y2="22" /><line x1="17" y1="2" x2="17" y2="22" /><line x1="2" y1="12" x2="22" y2="12" /><line x1="2" y1="7" x2="7" y2="7" /><line x1="2" y1="17" x2="7" y2="17" /><line x1="17" y1="7" x2="22" y2="7" /><line x1="17" y1="17" x2="22" y2="17" /></svg>
                <h3>Editing &amp; Export</h3>
              </div>
              <div className="guide-card-body">
                <h4>Keep It Simple</h4>
                <p>Riders want authenticity, not a movie. Minimal editing is best:</p>
                <ul>
                  <li>Trim the first 10–15 seconds (mounting, starting GPS)</li>
                  <li>Trim the end (stopping, dismounting)</li>
                  <li>Apply stabilization if your camera lacks built-in EIS</li>
                  <li>No music — riders play their own. Ambient road sound is great.</li>
                  <li>No text overlays or intros — CycleRun adds its own HUD</li>
                </ul>

                <h4>Export Settings</h4>
                <ul>
                  <li><strong>Format:</strong> MP4 (H.264 codec)</li>
                  <li><strong>Resolution:</strong> 1920×1080 (1080p)</li>
                  <li><strong>Bitrate:</strong> 15–25 Mbps for excellent quality</li>
                  <li><strong>Audio:</strong> Keep ambient sound at low volume</li>
                  <li><strong>Max File Size:</strong> 10 GB per route</li>
                </ul>
              </div>
            </article>
          </div>
        </section>

        {/* FAQ */}
        <section className="creator-section creator-section-dark" id="faq">
          <h2>Frequently Asked Questions</h2>
          <div className="creator-faq">
            <details className="faq-item">
              <summary>How much can I earn as a CycleRun creator?</summary>
              <p>Earnings depend on route popularity. Creators earn a 70% revenue share from premium route purchases. Popular routes with scenic locations can generate significant passive income as the community grows. Free routes are also welcome and help build your audience.</p>
            </details>
            <details className="faq-item">
              <summary>What equipment do I need?</summary>
              <p>An action camera (GoPro, DJI Osmo Action, Insta360) with a chest or handlebar mount. A GPS device for GPX data is recommended but optional. Any bicycle works — road, gravel, MTB. Even a smartphone with a good mount can produce great results.</p>
            </details>
            <details className="faq-item">
              <summary>What is a GPX file and why does it matter?</summary>
              <p>GPX (GPS Exchange Format) records your route coordinates, elevation, and timestamps. When paired with your video, CycleRun can simulate realistic inclines and resistance changes. Record GPX with Strava, Garmin, Wahoo, or your GoPro&apos;s built-in GPS.</p>
            </details>
            <details className="faq-item">
              <summary>How long should my route videos be?</summary>
              <p>20–60 minutes is the sweet spot. Short routes (15–20 min) work for quick sessions. Longer routes (45–60 min) are popular for endurance training. You can create series of connected routes for multi-stage rides.</p>
            </details>
            <details className="faq-item">
              <summary>Do I keep ownership of my videos?</summary>
              <p>Absolutely. You retain full ownership of all content. No exclusivity — upload the same videos to YouTube, Rouvy, or any other platform. We grant CycleRun a non-exclusive license to stream your content to riders.</p>
            </details>
            <details className="faq-item">
              <summary>How does the approval process work?</summary>
              <p>Submit the application form below. We review within 48 hours. Once approved, you receive access to the Creator Dashboard for uploading, analytics, and earnings tracking. We look for authentic POV cycling content — no professional production required.</p>
            </details>
            <details className="faq-item">
              <summary>Can I upload routes from anywhere in the world?</summary>
              <p>Yes! We have riders from 50+ countries. Local routes, hidden gems, and iconic destinations all perform well. Diversity is what makes the CycleRun route library special.</p>
            </details>
          </div>
        </section>

        {/* Influencer Monetization */}
        <section className="creator-section" id="influencer">
          <h2>Earn Money as a <span className="gradient-text">Cycling Influencer</span></h2>
          <p className="section-subtitle">
            You don&apos;t need millions of followers. With CycleRun, even micro-creators with great routes can build a loyal audience and earn real income.
          </p>
          <div className="creator-benefits-grid">
            <div className="creator-benefit">
              <div className="benefit-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>
              </div>
              <h3>Sponsored Routes</h3>
              <p>Brands pay to sponsor popular routes. Your &quot;Sponsored by Canyon&quot; Mallorca ride could earn you hundreds per month. We connect you with cycling brands looking for authentic content.</p>
            </div>
            <div className="creator-benefit">
              <div className="benefit-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4-4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>
              </div>
              <h3>Build Your Fanbase</h3>
              <p>Every rider who loves your route sees your profile. Link your Instagram, YouTube, TikTok, and Strava. Convert riders into followers across all your platforms.</p>
            </div>
            <div className="creator-benefit">
              <div className="benefit-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 9l6 6 6-6" /><path d="M12 3v12" /><rect x="3" y="17" width="18" height="4" rx="1" /></svg>
              </div>
              <h3>Premium Route Sales</h3>
              <p>Set a price for your best routes. You keep 70% of every sale. One popular route can generate passive income for months — film once, earn forever.</p>
            </div>
            <div className="creator-benefit">
              <div className="benefit-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="7" /><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" /></svg>
              </div>
              <h3>Creator Badges &amp; Awards</h3>
              <p>&quot;Official CycleRun Creator&quot; badge for your social profiles. Monthly &quot;Route of the Month&quot; award with featured placement and social shoutout to thousands of riders.</p>
            </div>
            <div className="creator-benefit">
              <div className="benefit-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></svg>
              </div>
              <h3>Challenge Partnerships</h3>
              <p>Create branded challenges: &quot;Ride 5 of my Alpine routes this month&quot;. Sponsors provide prizes (bikes, gear, vouchers). You get visibility, riders get motivation.</p>
            </div>
            <div className="creator-benefit">
              <div className="benefit-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 20V10" /><path d="M18 20V4" /><path d="M6 20v-4" /></svg>
              </div>
              <h3>Analytics Dashboard</h3>
              <p>See exactly how many riders chose your routes, average ride time, completion rate, and revenue. Data-driven insights to optimize your content strategy.</p>
            </div>
          </div>
        </section>

        {/* Apply Section */}
        <section className="creator-section" id="apply">
          <h2>Ready to <span className="gradient-text">become a creator</span>?</h2>
          <p className="section-subtitle">
            Free to join. No commitment. Start earning from your rides.
          </p>
          <div className="creator-apply-card">
            <form id="creatorApplyForm" className="creator-form">
              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="creatorName">Name *</label>
                  <input type="text" id="creatorName" placeholder="Your name" required />
                </div>
                <div className="form-field">
                  <label htmlFor="creatorEmail">Email *</label>
                  <input type="email" id="creatorEmail" placeholder="your@email.com" required />
                </div>
              </div>
              <div className="form-field">
                <label htmlFor="creatorSocial">Social / Website (optional)</label>
                <input type="url" id="creatorSocial" placeholder="https://instagram.com/yourname or Strava profile" />
              </div>
              <div className="form-field">
                <label htmlFor="creatorRoutes">Tell us about your routes</label>
                <textarea id="creatorRoutes" rows={3} placeholder="Where do you ride? What makes your routes special? (e.g., 'I ride coastal roads in Mallorca and mountain passes in the Alps')"></textarea>
              </div>
              <label className="creator-consent">
                <input type="checkbox" id="creatorConsent" required />
                <span>I agree to the <Link href="/datenschutz">Privacy Policy</Link>. I understand my application will be reviewed.</span>
              </label>
              <button type="submit" className="btn-primary btn-lg btn-full">
                Submit Application
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>
            </form>
            <p className="creator-apply-hint">
              We review applications within 48 hours. No fees, no obligations.
            </p>
          </div>
        </section>

        <section style={{ maxWidth: '720px', margin: '0 auto 2rem', padding: '0 2rem', textAlign: 'center' as const }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Explore CycleRun</h3>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' as const, justifyContent: 'center' }}>
            <Link href="/" className="route-badge">Start Riding Free</Link>
            <Link href="/routes" className="route-badge">Browse Routes</Link>
            <Link href="/guide/virtual-cycling-videos" className="route-badge">Virtual Cycling Videos</Link>
            <Link href="/blog" className="route-badge">Blog</Link>
            <Link href="/guide" className="route-badge">All Guides</Link>
          </div>
        </section>

        <SubpageFooter />
      </div>
    </>
  );
}
