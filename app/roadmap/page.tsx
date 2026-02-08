import type { Metadata } from "next";
import RoadmapContent from "@/components/RoadmapContent";
import { JsonLd, makeAlternates } from "@/app/seo-config";

export const metadata: Metadata = {
  title: "Roadmap — What's New and What's Next",
  description:
    "See what we've shipped, what's coming next, and vote on features you want most. CycleRun is built by and for the community.",
  keywords:
    "CycleRun roadmap, indoor cycling features, CycleRun changelog, feature requests, cycling app updates",
  alternates: makeAlternates("/roadmap"),
  openGraph: {
    title: "CycleRun Roadmap — Built by the Community",
    description: "See what we shipped, what's coming, and vote on what matters to you.",
    type: "website",
    url: "https://cyclerun.app/roadmap",
  },
};

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
      <JsonLd data={jsonLd} />
      <RoadmapContent />
    </>
  );
}
