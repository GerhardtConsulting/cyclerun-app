import Link from "next/link";
import type { Metadata } from "next";
import { routes, getRoute, getAllRouteSlugs } from "@/lib/route-data";
import { notFound } from "next/navigation";
import SubpageFooter from "@/components/SubpageFooter";

export function generateStaticParams() {
  return getAllRouteSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const route = getRoute(params.slug);
  if (!route) return {};
  return {
    title: `${route.name} — ${route.location} | Virtual Cycling Route | CycleRun`,
    description: route.description,
    keywords: route.keywords,
    alternates: { canonical: `/routes/${route.slug}` },
    openGraph: {
      title: `Ride ${route.name} Indoor — ${route.distanceKm}km, ${route.elevationM}m Elevation`,
      description: route.description,
      type: "article",
      url: `https://cyclerun.app/routes/${route.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${route.name} — Virtual Indoor Cycling Route`,
      description: route.description,
    },
  };
}

export default function RouteDetailPage({ params }: { params: { slug: string } }) {
  const route = getRoute(params.slug);
  if (!route) notFound();

  const maxElev = Math.max(...route.elevationProfile);

  const jsonLdEvent = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: `${route.name} Virtual Cycling Route`,
    description: route.description,
    location: {
      "@type": "Place",
      name: route.location,
      address: { "@type": "PostalAddress", addressCountry: route.country },
    },
    url: `https://cyclerun.app/routes/${route.slug}`,
    organizer: { "@type": "Organization", name: "CycleRun.app", url: "https://cyclerun.app" },
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR", availability: "https://schema.org/InStock" },
  };

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "CycleRun.app", item: "https://cyclerun.app" },
      { "@type": "ListItem", position: 2, name: "Routes", item: "https://cyclerun.app/routes" },
      { "@type": "ListItem", position: 3, name: route.name, item: `https://cyclerun.app/routes/${route.slug}` },
    ],
  };

  const otherRoutes = routes.filter((r) => r.slug !== route.slug).slice(0, 3);

  return (
    <>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdEvent) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      </head>
      <div className="route-page">
        <nav className="creator-nav">
          <Link href="/" className="creator-nav-logo">cyclerun<span className="creator-nav-app">.app</span></Link>
          <Link href="/routes" className="btn-ghost btn-sm">&larr; All Routes</Link>
        </nav>

        <div className="route-detail">
          <header className="route-detail-header">
            <div className="route-detail-badges">
              <span className="route-badge">{route.location}</span>
              <span className="route-badge route-badge-diff">{route.difficulty}</span>
            </div>
            <h1>{route.name}</h1>
            <p>{route.description}</p>
          </header>

          <div className="route-stats-grid">
            <div className="route-stat-card">
              <span className="stat-value">{route.distanceKm}</span>
              <span className="stat-label">km Distance</span>
            </div>
            <div className="route-stat-card">
              <span className="stat-value">{route.elevationM}</span>
              <span className="stat-label">m Elevation</span>
            </div>
            <div className="route-stat-card">
              <span className="stat-value">~{route.durationMin}</span>
              <span className="stat-label">min Duration</span>
            </div>
            <div className="route-stat-card">
              <span className="stat-value">{route.distanceKm > 0 ? ((route.elevationM / (route.distanceKm * 10))).toFixed(1) : "0"}%</span>
              <span className="stat-label">Avg Gradient</span>
            </div>
          </div>

          <div className="route-elevation">
            <h3>Elevation Profile</h3>
            <div className="elevation-bars">
              {route.elevationProfile.map((val, i) => (
                <div
                  key={i}
                  className="elevation-bar"
                  style={{ height: `${Math.max(5, (val / maxElev) * 100)}%` }}
                />
              ))}
            </div>
          </div>

          <div className="route-body">
            {route.content.split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          <div className="route-cta">
            <h3>Ride this route for free</h3>
            <p>Open CycleRun, set up your webcam, and experience {route.name} from your living room. No smart trainer needed.</p>
            <Link href="/" className="btn-primary btn-lg">
              Open CycleRun
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
          </div>
        </div>

        {otherRoutes.length > 0 && (
          <section className="blog-related">
            <h3>More routes</h3>
            <div className="route-grid" style={{ maxWidth: "1080px", margin: "0 auto", paddingBottom: "3rem" }}>
              {otherRoutes.map((r) => (
                <Link href={`/routes/${r.slug}`} key={r.slug} className="route-card">
                  <div className="route-card-body">
                    <h2>{r.name}</h2>
                    <p>{r.location}</p>
                    <div className="route-card-stats">
                      <span><strong>{r.distanceKm}</strong> km</span>
                      <span><strong>{r.elevationM}</strong> m &uarr;</span>
                      <span className="route-badge-diff">{r.difficulty}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="seo-cta" style={{ maxWidth: '640px', margin: '0 auto 2rem' }}>
          <h3>Film Your Own Routes &amp; Build an Audience</h3>
          <p>You&apos;re a cycling content creator? Film POV routes and reach thousands of indoor riders on CycleRun. Earn from sponsored routes.</p>
          <Link href="/creator" className="btn-ghost">Learn About the Creator Program →</Link>
        </section>

        <SubpageFooter />
      </div>
    </>
  );
}
