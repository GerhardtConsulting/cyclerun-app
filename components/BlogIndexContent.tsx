"use client";

import Link from "next/link";
import { blogPosts } from "@/lib/blog-data";
import { t } from "@/lib/i18n";
import { useLocale } from "@/lib/useLocale";
import SubpageNav from "@/components/SubpageNav";
import SubpageFooter from "@/components/SubpageFooter";

function formatDate(dateStr: string, locale: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString(locale === "de" ? "de-DE" : "en-US", {
    year: "numeric", month: "short", day: "numeric"
  });
}

export default function BlogIndexContent() {
  const locale = useLocale();
  const isDE = locale === "de";

  return (
    <div className="blog-page">
      <SubpageNav rightKey="sub.become_creator" rightHref="/creator" />

      <header className="blog-hero">
        <span className="creator-badge">{t("sub.blog.badge")}</span>
        <h1>{t("sub.blog.hero_1")} <span className="gradient-text">{t("sub.blog.hero_2")}</span></h1>
        <p className="blog-hero-sub">{t("sub.blog.hero_sub")}</p>
      </header>

      <section className="blog-grid">
        {blogPosts.map((post) => (
          <Link href={`/blog/${post.slug}`} key={post.slug} className="blog-card">
            <div className="blog-card-category">{isDE ? (post.category_de || post.category) : post.category}</div>
            <h2>{isDE ? (post.title_de || post.title) : post.title}</h2>
            <p>{isDE ? (post.description_de || post.description) : post.description}</p>
            <div className="blog-card-meta">
              <span>{formatDate(post.date, locale)}</span>
              <span>&middot;</span>
              <span>{isDE ? (post.readTime_de || post.readTime) : post.readTime} {t("sub.blog.read")}</span>
            </div>
          </Link>
        ))}
      </section>

      <section className="seo-cta" style={{ maxWidth: '680px', margin: '2rem auto 0' }}>
        <h2>{t("sub.blog.cta_title")}</h2>
        <p>{t("sub.blog.cta_desc")}</p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" className="btn-primary btn-lg">{t("sub.start_riding")}</Link>
          <Link href="/creator" className="btn-ghost">{t("sub.become_creator")} &rarr;</Link>
        </div>
      </section>

      <section style={{ maxWidth: '680px', margin: '2rem auto', padding: '0 2rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', textAlign: 'center' }}>{t("sub.explore_guides")}</h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/guide/zwift-alternative-free" className="route-badge">{t("sub.footer.zwift_alt")}</Link>
          <Link href="/guide/rouvy-alternative" className="route-badge">{t("sub.footer.rouvy_alt")}</Link>
          <Link href="/guide/indoor-cycling-app" className="route-badge">{t("sub.footer.cycling_app")}</Link>
          <Link href="/guide/virtual-cycling-videos" className="route-badge">{t("sub.footer.cycling_videos")}</Link>
          <Link href="/routes" className="route-badge">{t("sub.browse_routes")}</Link>
        </div>
      </section>

      <SubpageFooter />
    </div>
  );
}
