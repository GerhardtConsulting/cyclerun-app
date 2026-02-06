import Link from "next/link";
import type { Metadata } from "next";
import { routes } from "@/lib/route-data";

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

        <footer className="creator-footer">
          <div className="creator-footer-inner">
            <div className="creator-footer-logo">cyclerun<span className="header-logo-app">.app</span></div>
            <div className="creator-footer-links">
              <Link href="/">Home</Link>
              <Link href="/creator">Creators</Link>
              <Link href="/blog">Blog</Link>
              <Link href="/datenschutz">Privacy</Link>
            </div>
            <p className="creator-footer-copy">© 2026 CycleRun.app — Community project</p>
          </div>
        </footer>
      </div>
    </>
  );
}
