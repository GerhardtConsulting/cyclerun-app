import type { Metadata } from "next";
import { getRoute, getAllRouteSlugs } from "@/lib/route-data";
import { notFound } from "next/navigation";
import RouteDetailContent from "@/components/RouteDetailContent";
import { JsonLd, schemas, makeAlternates } from "@/app/seo-config";

export function generateStaticParams() {
  return getAllRouteSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const route = getRoute(slug);
  if (!route) return {};
  return {
    title: `${route.name} — ${route.location} | Virtual Cycling Route`,
    description: route.description,
    keywords: route.keywords,
    alternates: makeAlternates(`/routes/${route.slug}`),
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

  return (
    <>
      <JsonLd data={[
        schemas.sportsEvent(route),
        schemas.breadcrumbs([
          { name: "CycleRun", path: "/" },
          { name: "Routes", path: "/routes" },
          { name: route.name, path: `/routes/${route.slug}` },
        ]),
      ]} />
      <RouteDetailContent route={route} />
    </>
  );
}
