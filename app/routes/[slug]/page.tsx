import type { Metadata } from "next";
import { routes, getRoute, getAllRouteSlugs } from "@/lib/route-data";
import { notFound } from "next/navigation";
import RouteDetailContent from "@/components/RouteDetailContent";

export function generateStaticParams() {
  return getAllRouteSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const route = getRoute(slug);
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

export default async function RouteDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const route = getRoute(slug);
  if (!route) notFound();

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

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdEvent) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      <RouteDetailContent route={route} />
    </>
  );
}
