import Link from "next/link";
import type { Metadata } from "next";
import { routes } from "@/lib/route-data";
import SubpageFooter from "@/components/SubpageFooter";

export const metadata: Metadata = {
  title: "Virtual Cycling Routes — Ride the World from Home | CycleRun.app",
  description:
    "Browse the best virtual cycling routes for indoor training. Alpine passes, coastal roads, and city tours — all free to ride with your webcam on CycleRun.",
  keywords:
    "virtual cycling routes, indoor cycling routes, POV cycling videos, cycling route videos, home trainer routes, Zwift alternative routes",
  alternates: { canonical: "/routes" },
  openGraph: {
    title: "CycleRun Routes — Virtual Cycling Routes for Indoor Training",
    description: "Ride Mallorca, the Stelvio, Alpe d'Huez and more from your living room. Free.",
    type: "website",
    url: "https://cyclerun.app/routes",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "CycleRun Virtual Cycling Routes",
  description: "Collection of POV cycling route videos for indoor training",
  url: "https://cyclerun.app/routes",
  numberOfItems: routes.length,
  itemListElement: routes.map((r, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "SportsEvent",
      name: r.name,
      description: r.description,
      location: { "@type": "Place", name: r.location, address: { "@type": "PostalAddress", addressCountry: r.country } },
      url: `https://cyclerun.app/routes/${r.slug}`,
    },
  })),
};

export default function RoutesIndex() {
  return (
    <>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <div className="route-page">
        <nav className="creator-nav">
          <Link href="/" className="creator-nav-logo">cyclerun<span className="creator-nav-app">.app</span></Link>
          <Link href="/creator" className="btn-ghost btn-sm">Become a Creator</Link>
        </nav>

        <header className="route-hero">
          <span className="creator-badge">Routes</span>
          <h1>Ride the <span className="gradient-text">world</span> from home</h1>
          <p className="route-hero-sub">Iconic cycling routes filmed in first-person POV. Your webcam syncs the video to your pedaling speed. No smart trainer needed.</p>
        </header>

        <section className="route-grid">
          {routes.map((route) => (
            <Link href={`/routes/${route.slug}`} key={route.slug} className="route-card">
              <div className="route-card-visual">
                {route.country === "ES" && "🇪🇸"}
                {route.country === "IT" && "🇮🇹"}
                {route.country === "US" && "🇺🇸"}
                {route.country === "FR" && "🇫🇷"}
                {route.country === "NO" && "🇳🇴"}
              </div>
              <div className="route-card-body">
                <h2>{route.name}</h2>
                <p>{route.location}</p>
                <div className="route-card-stats">
                  <span><strong>{route.distanceKm}</strong> km</span>
                  <span><strong>{route.elevationM}</strong> m ↑</span>
                  <span className="route-badge-diff">{route.difficulty}</span>
                  <span>~{route.durationMin} min</span>
                </div>
              </div>
            </Link>
          ))}
        </section>

        <section className="seo-cta" style={{ maxWidth: '720px', margin: '2rem auto 0' }}>
          <h2>Ride Any Route — Free</h2>
          <p>Set up your webcam, pick a route, and start pedaling. No smart trainer, no subscription.</p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/" className="btn-primary btn-lg">Start Riding Free</Link>
            <Link href="/creator" className="btn-ghost">Film Routes &amp; Earn →</Link>
          </div>
        </section>

        <section style={{ maxWidth: '720px', margin: '2rem auto', padding: '0 2rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', textAlign: 'center' }}>Learn More</h3>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href="/guide/virtual-cycling-videos" className="route-badge">Virtual Cycling Videos</Link>
            <Link href="/guide/indoor-cycling-without-smart-trainer" className="route-badge">No Smart Trainer Needed</Link>
            <Link href="/guide/zwift-alternative-free" className="route-badge">Zwift Alternative</Link>
            <Link href="/blog" className="route-badge">Blog</Link>
          </div>
        </section>

        <SubpageFooter />
      </div>
    </>
  );
}
