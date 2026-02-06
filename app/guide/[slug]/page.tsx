import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSeoPage, getAllSeoSlugs, seoPages, type SeoPage } from "@/lib/seo-pages-data";
import SubpageFooter from "@/components/SubpageFooter";

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

function markdownToHtml(md: string): string {
  return md
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
    .replace(/^\- (.+)$/gm, '<li>$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, (m) => {
      return m.includes('1.') ? `<ol>${m}</ol>` : `<ul>${m}</ul>`;
    })
    .replace(/\|(.+)\|/g, (match) => {
      const cells = match.split('|').filter(Boolean).map(c => c.trim());
      if (cells.every(c => /^[\-\s:]+$/.test(c))) return '';
      const tag = match.includes('---') ? 'th' : 'td';
      return `<tr>${cells.map(c => `<${tag}>${c}</${tag}>`).join('')}</tr>`;
    })
    .replace(/(<tr>.*<\/tr>\n?)+/g, (m) => `<table>${m}</table>`)
    .replace(/^(?!<[hultoa])((?!^\s*$).+)$/gm, '<p>$1</p>')
    .replace(/<p><\/p>/g, '')
    .replace(/✅/g, '<span class="check-icon">✅</span>')
    .replace(/❌/g, '<span class="cross-icon">❌</span>');
}

export default async function SeoGuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getSeoPage(slug);
  if (!page) notFound();

  const relatedPages: SeoPage[] = seoPages.filter((p: SeoPage) => p.slug !== slug).slice(0, 3);

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
    <div className="seo-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <nav className="seo-breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/guide">Guides</Link>
        <span>/</span>
        <span>{page.h1.length > 50 ? page.h1.substring(0, 50) + '...' : page.h1}</span>
      </nav>

      <header className="seo-hero">
        <h1>{page.h1}</h1>
        <p className="seo-hero-desc">{page.description}</p>
      </header>

      <article className="seo-content" dangerouslySetInnerHTML={{ __html: markdownToHtml(page.content) }} />

      <section className="seo-faq">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-list">
          {page.faqs.map((faq, i) => (
            <details key={i} className="faq-item" open={i === 0}>
              <summary>{faq.q}</summary>
              <p>{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="seo-cta">
        <h2>Ready to Ride?</h2>
        <p>Open CycleRun in your browser — free, no signup, no download.</p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" className="btn-primary btn-lg">Start Riding Free</Link>
          <Link href="/creator" className="btn-ghost">Earn as Creator →</Link>
        </div>
      </section>

      {relatedPages.length > 0 && (
        <section className="seo-related">
          <h2>Related Guides</h2>
          <div className="seo-related-grid">
            {relatedPages.map((rp) => (
              <Link key={rp.slug} href={`/guide/${rp.slug}`} className="seo-related-card">
                <h3>{rp.h1.length > 80 ? rp.h1.substring(0, 80) + '...' : rp.h1}</h3>
                <p>{rp.description.length > 120 ? rp.description.substring(0, 120) + '...' : rp.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <SubpageFooter />
    </div>
  );
}
