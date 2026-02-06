import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSeoPage, getAllSeoSlugs } from "@/lib/seo-pages-data";
import GuideDetailContent from "@/components/GuideDetailContent";

export async function generateStaticParams() {
  return getAllSeoSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = getSeoPage(slug);
  if (!page) return {};

  return {
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    alternates: {
      canonical: `/guide/${page.slug}`,
    },
    openGraph: {
      title: page.title,
      description: page.description,
      url: `https://cyclerun.app/guide/${page.slug}`,
      siteName: "CycleRun.app",
      type: "article",
    },
  };
}

export default async function SeoGuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getSeoPage(slug);
  if (!page) notFound();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://cyclerun.app" },
      { "@type": "ListItem", position: 2, name: "Guides", item: "https://cyclerun.app/guide" },
      { "@type": "ListItem", position: 3, name: page.h1, item: `https://cyclerun.app/guide/${page.slug}` },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.h1,
    description: page.description,
    url: `https://cyclerun.app/guide/${page.slug}`,
    publisher: {
      "@type": "Organization",
      name: "CycleRun.app",
      url: "https://cyclerun.app",
    },
    datePublished: "2026-01-15",
    dateModified: "2026-02-06",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <GuideDetailContent page={page} />
    </>
  );
}
