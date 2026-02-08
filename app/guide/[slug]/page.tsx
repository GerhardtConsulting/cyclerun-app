import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSeoPage, getAllSeoSlugs } from "@/lib/seo-pages-data";
import GuideDetailContent from "@/components/GuideDetailContent";
import { JsonLd, schemas, makeAlternates } from "@/app/seo-config";

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
    alternates: makeAlternates(`/guide/${page.slug}`),
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

  return (
    <>
      <JsonLd data={[
        schemas.faqPage(page.faqs),
        schemas.breadcrumbs([
          { name: "CycleRun", path: "/" },
          { name: "Guides", path: "/guide" },
          { name: page.h1, path: `/guide/${page.slug}` },
        ]),
        schemas.article({ title: page.h1, description: page.description, slug: page.slug }),
      ]} />
      <GuideDetailContent page={page} />
    </>
  );
}
