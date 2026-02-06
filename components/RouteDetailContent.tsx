"use client";

import Link from "next/link";
import { routes, type RouteData } from "@/lib/route-data";
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

interface RouteDetailContentProps {
  route: RouteData;
}

export default function RouteDetailContent({ route }: RouteDetailContentProps) {
  const locale = useLocale();
  const isDE = locale === "de";

  const location = isDE ? (route.location_de || route.location) : route.location;
  const description = isDE ? (route.description_de || route.description) : route.description;
  const content = isDE ? (route.content_de || route.content) : route.content;
  const difficulty = t(diffKeys[route.difficulty] || route.difficulty);

  const maxElev = Math.max(...route.elevationProfile);
  const otherRoutes = routes.filter((r) => r.slug !== route.slug).slice(0, 3);

  return (
    <div className="route-page">
      <SubpageNav rightKey="sub.all_routes" rightHref="/routes" />

      <div className="route-detail">
        <header className="route-detail-header">
          <div className="route-detail-badges">
            <span className="route-badge">{location}</span>
            <span className="route-badge route-badge-diff">{difficulty}</span>
          </div>
          <h1>{route.name}</h1>
          <p>{description}</p>
        </header>

        <div className="route-stats-grid">
          <div className="route-stat-card">
            <span className="stat-value">{route.distanceKm}</span>
            <span className="stat-label">{t("sub.routes.km")}</span>
          </div>
          <div className="route-stat-card">
            <span className="stat-value">{route.elevationM}</span>
            <span className="stat-label">{t("sub.routes.m")}</span>
          </div>
          <div className="route-stat-card">
            <span className="stat-value">~{route.durationMin}</span>
            <span className="stat-label">{t("sub.routes.min")}</span>
          </div>
          <div className="route-stat-card">
            <span className="stat-value">{route.distanceKm > 0 ? ((route.elevationM / (route.distanceKm * 10))).toFixed(1) : "0"}%</span>
            <span className="stat-label">{t("sub.routes.gradient")}</span>
          </div>
        </div>

        <div className="route-elevation">
          <h3>{t("sub.routes.elevation")}</h3>
          <div className="elevation-bars">
            {route.elevationProfile.map((val, i) => (
              <div
                key={i}
                className="elevation-bar"
                style={{ height: `${Math.max(5, (val / maxElev) * 100)}%` }}
              />
            ))}
          </div>
        </div>

        <div className="route-body">
          {content.split("\n\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        <div className="route-cta">
          <h3>{t("sub.routes.ride_free")}</h3>
          <p>{t("sub.routes.ride_desc", { name: route.name })}</p>
          <Link href="/" className="btn-primary btn-lg">
            {t("sub.routes.open_btn")}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
        </div>
      </div>

      {otherRoutes.length > 0 && (
        <section className="blog-related">
          <h3>{t("sub.routes.more")}</h3>
          <div className="route-grid" style={{ maxWidth: "1080px", margin: "0 auto", paddingBottom: "3rem" }}>
            {otherRoutes.map((r) => (
              <Link href={`/routes/${r.slug}`} key={r.slug} className="route-card">
                <div className="route-card-body">
                  <h2>{r.name}</h2>
                  <p>{isDE ? (r.location_de || r.location) : r.location}</p>
                  <div className="route-card-stats">
                    <span><strong>{r.distanceKm}</strong> km</span>
                    <span><strong>{r.elevationM}</strong> m &uarr;</span>
                    <span className="route-badge-diff">{t(diffKeys[r.difficulty] || r.difficulty)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="seo-cta" style={{ maxWidth: '640px', margin: '0 auto 2rem' }}>
        <h3>{t("sub.routes.creator_title")}</h3>
        <p>{t("sub.routes.creator_desc")}</p>
        <Link href="/creator" className="btn-ghost">{t("sub.creator_link")}</Link>
      </section>

      <SubpageFooter />
    </div>
  );
}
