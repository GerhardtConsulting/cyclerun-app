import type { Metadata } from "next";
import GuideIndexContent from "@/components/GuideIndexContent";

export const metadata: Metadata = {
  title: "Indoor Cycling Guides & Resources — CycleRun.app",
  description: "Comprehensive guides on indoor cycling apps, virtual cycling videos, smart trainer alternatives, spinning bike apps, ergometer training, and more. Everything you need to know about indoor cycling.",
  keywords: "indoor cycling guide, virtual cycling guide, smart trainer alternative, indoor cycling tips, home trainer guide",
  alternates: { canonical: "/guide" },
  openGraph: {
    title: "Indoor Cycling Guides & Resources — CycleRun.app",
    description: "Comprehensive guides on indoor cycling apps, virtual cycling videos, smart trainer alternatives, and more.",
    url: "https://cyclerun.app/guide",
    siteName: "CycleRun.app",
    type: "website",
  },
};

export default function GuidesIndexPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Indoor Cycling Guides",
    description: metadata.description,
    url: "https://cyclerun.app/guide",
    publisher: {
      "@type": "Organization",
      name: "CycleRun.app",
      url: "https://cyclerun.app",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <GuideIndexContent />
    </>
  );
}
