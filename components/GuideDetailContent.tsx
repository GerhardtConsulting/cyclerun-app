"use client";

import Link from "next/link";
import { seoPages, type SeoPage } from "@/lib/seo-pages-data";
import { t } from "@/lib/i18n";
import { useLocale } from "@/lib/useLocale";
import SubpageNav from "@/components/SubpageNav";
import SubpageFooter from "@/components/SubpageFooter";

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

interface GuideDetailContentProps {
  page: SeoPage;
}

export default function GuideDetailContent({ page }: GuideDetailContentProps) {
  useLocale();

  const relatedPages: SeoPage[] = seoPages.filter((p: SeoPage) => p.slug !== page.slug).slice(0, 3);

  return (
    <div className="seo-page">
      <SubpageNav rightKey="sub.browse_routes" rightHref="/routes" />

      <nav className="seo-breadcrumb">
        <Link href="/">{t("sub.guide.home")}</Link>
        <span>/</span>
        <Link href="/guide">{t("sub.guide.guides")}</Link>
        <span>/</span>
        <span>{page.h1.length > 50 ? page.h1.substring(0, 50) + '...' : page.h1}</span>
      </nav>

      <header className="seo-hero">
        <h1>{page.h1}</h1>
        <p className="seo-hero-desc">{page.description}</p>
      </header>

      <article className="seo-content" dangerouslySetInnerHTML={{ __html: markdownToHtml(page.content) }} />

      <section className="seo-faq">
        <h2>{t("sub.guide.faq")}</h2>
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
        <h2>{t("sub.ready_ride")}</h2>
        <p>{t("sub.no_download")}</p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" className="btn-primary btn-lg">{t("sub.start_riding")}</Link>
          <Link href="/creator" className="btn-ghost">{t("sub.earn_creator")}</Link>
        </div>
      </section>

      {relatedPages.length > 0 && (
        <section className="seo-related">
          <h2>{t("sub.guide.related")}</h2>
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
