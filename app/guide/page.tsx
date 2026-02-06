import type { Metadata } from "next";
import Link from "next/link";
import { seoPages, type SeoPage } from "@/lib/seo-pages-data";
import SubpageFooter from "@/components/SubpageFooter";

export const metadata: Metadata = {
  title: "Indoor Cycling Guides & Resources — CycleRun.app",
  description: "Comprehensive guides on indoor cycling apps, virtual cycling videos, smart trainer alternatives, spinning bike apps, ergometer training, and more. Everything you need to know about indoor cycling.",
  keywords: "indoor cycling guide, virtual cycling guide, smart trainer alternative, indoor cycling tips, home trainer guide",
  alternates: { canonical: "https://cyclerun.app/guide" },
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
    <div className="seo-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <header className="seo-hero">
        <h1>Indoor Cycling Guides & Resources</h1>
        <p className="seo-hero-desc">
          Everything you need to know about indoor cycling — from free Zwift alternatives to ergometer training plans, virtual cycling videos, and phone camera pairing.
        </p>
      </header>

      <div className="seo-guide-grid">
        {seoPages.map((page: SeoPage) => (
          <Link key={page.slug} href={`/guide/${page.slug}`} className="seo-guide-card">
            <h2>{page.h1}</h2>
            <p>{page.description}</p>
            <span className="seo-guide-link">Read guide →</span>
          </Link>
        ))}
      </div>

      <section className="seo-cta">
        <h2>Ready to Ride?</h2>
        <p>Open CycleRun in your browser — free, no signup, no download.</p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" className="btn-primary btn-lg">Start Riding Free</Link>
          <Link href="/creator" className="btn-ghost">Earn as Creator →</Link>
        </div>
      </section>

      <SubpageFooter />
    </div>
  );
}
