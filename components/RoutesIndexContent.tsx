"use client";

import Link from "next/link";
import { routes } from "@/lib/route-data";
import { t } from "@/lib/i18n";
import { useLocale } from "@/lib/useLocale";
import SubpageNav from "@/components/SubpageNav";
import SubpageFooter from "@/components/SubpageFooter";

const diffKeys: Record<string, string> = {
  Easy: "sub.diff.easy",
  Moderate: "sub.diff.moderate",
  Hard: "sub.diff.hard",
  "Very Hard": "sub.diff.very_hard",
};

export default function RoutesIndexContent() {
  const locale = useLocale();
  const isDE = locale === "de";

  return (
    <div className="route-page">
      <SubpageNav rightKey="sub.become_creator" rightHref="/creator" />

      <header className="route-hero">
        <span className="creator-badge">{t("sub.routes.badge")}</span>
        <h1>{t("sub.routes.hero_1")} <span className="gradient-text">{t("sub.routes.hero_2")}</span> {t("sub.routes.hero_3")}</h1>
        <p className="route-hero-sub">{t("sub.routes.hero_sub")}</p>
      </header>

      <section className="route-grid">
        {routes.map((route) => (
          <Link href={`/routes/${route.slug}`} key={route.slug} className="route-card">
            <div className="route-card-visual">
              {route.country === "ES" && "\u{1F1EA}\u{1F1F8}"}
              {route.country === "IT" && "\u{1F1EE}\u{1F1F9}"}
              {route.country === "US" && "\u{1F1FA}\u{1F1F8}"}
              {route.country === "FR" && "\u{1F1EB}\u{1F1F7}"}
              {route.country === "NO" && "\u{1F1F3}\u{1F1F4}"}
            </div>
            <div className="route-card-body">
              <h2>{route.name}</h2>
              <p>{isDE ? (route.location_de || route.location) : route.location}</p>
              <div className="route-card-stats">
                <span><strong>{route.distanceKm}</strong> km</span>
                <span><strong>{route.elevationM}</strong> m &uarr;</span>
                <span className="route-badge-diff">{t(diffKeys[route.difficulty] || route.difficulty)}</span>
                <span>~{route.durationMin} min</span>
              </div>
            </div>
          </Link>
        ))}
      </section>

      <section className="seo-cta" style={{ maxWidth: '720px', margin: '2rem auto 0' }}>
        <h2>{t("sub.routes.cta_title")}</h2>
        <p>{t("sub.routes.cta_desc")}</p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" className="btn-primary btn-lg">{t("sub.start_riding")}</Link>
          <Link href="/creator" className="btn-ghost">{t("sub.film_earn")}</Link>
        </div>
      </section>

      <section style={{ maxWidth: '720px', margin: '2rem auto', padding: '0 2rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', textAlign: 'center' }}>{t("sub.learn_more_h")}</h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/guide/virtual-cycling-videos" className="route-badge">{t("sub.footer.cycling_videos")}</Link>
          <Link href="/guide/indoor-cycling-without-smart-trainer" className="route-badge">{isDE ? "Kein Smart Trainer n\u00f6tig" : "No Smart Trainer Needed"}</Link>
          <Link href="/guide/zwift-alternative-free" className="route-badge">{t("sub.footer.zwift_alt")}</Link>
          <Link href="/blog" className="route-badge">{t("sub.footer.blog")}</Link>
        </div>
      </section>

      <SubpageFooter />
    </div>
  );
}
