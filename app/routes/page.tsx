import type { Metadata } from "next";
import { routes } from "@/lib/route-data";
import RoutesIndexContent from "@/components/RoutesIndexContent";

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <RoutesIndexContent />
    </>
  );
}
