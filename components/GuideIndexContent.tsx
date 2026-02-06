"use client";

import Link from "next/link";
import { seoPages, type SeoPage } from "@/lib/seo-pages-data";
import { t } from "@/lib/i18n";
import { useLocale } from "@/lib/useLocale";
import SubpageNav from "@/components/SubpageNav";
import SubpageFooter from "@/components/SubpageFooter";

export default function GuideIndexContent() {
  useLocale();

  return (
    <div className="seo-page">
      <SubpageNav rightKey="sub.become_creator" rightHref="/creator" />

      <header className="seo-hero">
        <h1>{t("sub.guide.hero")}</h1>
        <p className="seo-hero-desc">{t("sub.guide.hero_desc")}</p>
      </header>

      <div className="seo-guide-grid">
        {seoPages.map((page: SeoPage) => (
          <Link key={page.slug} href={`/guide/${page.slug}`} className="seo-guide-card">
            <h2>{page.h1}</h2>
            <p>{page.description}</p>
            <span className="seo-guide-link">{t("sub.read_guide")}</span>
          </Link>
        ))}
      </div>

      <section className="seo-cta">
        <h2>{t("sub.ready_ride")}</h2>
        <p>{t("sub.no_download")}</p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" className="btn-primary btn-lg">{t("sub.start_riding")}</Link>
          <Link href="/creator" className="btn-ghost">{t("sub.earn_creator")}</Link>
        </div>
      </section>

      <SubpageFooter />
    </div>
  );
}
