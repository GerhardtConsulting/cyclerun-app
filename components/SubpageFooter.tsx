"use client";

import Link from "next/link";
import { t } from "@/lib/i18n";
import { useLocale } from "@/lib/useLocale";

export default function SubpageFooter() {
  const locale = useLocale();
  const isDE = locale === "de";
  return (
    <footer className="subpage-footer">
      <div className="subpage-footer-inner">
        <div className="subpage-footer-top">
          <div className="subpage-footer-brand">
            <Link href="/" className="subpage-footer-logo">
              cyclerun<span className="header-logo-app">.app</span>
            </Link>
            <p className="subpage-footer-tagline">{t("sub.footer.tagline")}</p>
          </div>

          <div className="subpage-footer-grid">
            <div className="subpage-footer-col">
              <strong>{t("sub.footer.product")}</strong>
              <Link href="/">{t("sub.footer.start_riding")}</Link>
              <Link href="/store">{isDE ? "Strecken-Store" : "Route Store"}</Link>
              <Link href="/routes">{t("sub.footer.routes")}</Link>
              <Link href="/leaderboard">{isDE ? "Rangliste" : "Leaderboard"}</Link>
              <Link href="/profile">{isDE ? "Profil" : "Profile"}</Link>
            </div>
            <div className="subpage-footer-col">
              <strong>{t("sub.footer.guides")}</strong>
              <Link href="/guide/zwift-alternative-free">{t("sub.footer.zwift_alt")}</Link>
              <Link href="/guide/rouvy-alternative">{t("sub.footer.rouvy_alt")}</Link>
              <Link href="/guide/indoor-cycling-app">{t("sub.footer.cycling_app")}</Link>
              <Link href="/guide/heimtrainer-app">{t("sub.footer.heimtrainer")}</Link>
              <Link href="/guide">{t("sub.guide.guides")}</Link>
            </div>
            <div className="subpage-footer-col">
              <strong>{t("sub.footer.resources")}</strong>
              <Link href="/blog">{t("sub.footer.blog")}</Link>
              <Link href="/guide/virtual-cycling-videos">{t("sub.footer.cycling_videos")}</Link>
              <Link href="/guide/ergometer-training">{t("sub.footer.ergometer")}</Link>
              <Link href="/guide/spinning-bike-app">{t("sub.footer.spinning")}</Link>
            </div>
            <div className="subpage-footer-col">
              <strong>CycleRun</strong>
              <Link href="/creator">{isDE ? "Creator Hub" : "Creator Hub"}</Link>
              <Link href="/roadmap">Roadmap</Link>
              <Link href="/changelog">Changelog</Link>
              <Link href="/datenschutz">{t("sub.footer.privacy")}</Link>
              <Link href="/impressum">{t("sub.footer.legal")}</Link>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="subpage-footer-trust">
          <Link href={isDE ? "/transparenz" : "/transparency"} className="trust-badge">
            <span className="trust-badge-icon">🔐</span>
            <span className="trust-badge-text">SSL</span>
          </Link>
          <Link href={isDE ? "/transparenz" : "/transparency"} className="trust-badge">
            <span className="trust-badge-icon">🇪🇺</span>
            <span className="trust-badge-text">{isDE ? "DSGVO" : "GDPR"}</span>
          </Link>
          <Link href={isDE ? "/transparenz" : "/transparency"} className="trust-badge">
            <span className="trust-badge-icon">✓</span>
            <span className="trust-badge-text">{isDE ? "Opt-in Analytics" : "Opt-in Analytics"}</span>
          </Link>
          <Link href={isDE ? "/transparenz" : "/transparency"} className="trust-badge">
            <span className="trust-badge-icon">💻</span>
            <span className="trust-badge-text">{isDE ? "100% Lokal" : "100% Local"}</span>
          </Link>
        </div>

        <div className="subpage-footer-cta">
          <p>{t("sub.footer.ready")} <Link href="/" className="subpage-footer-cta-link">{t("sub.footer.ride_link")}</Link></p>
          <span className="subpage-footer-divider">&middot;</span>
          <p>{t("sub.footer.film")} <Link href="/creator" className="subpage-footer-cta-link">{t("sub.footer.creator_link")}</Link></p>
        </div>

        <div className="subpage-footer-bottom">
          <span>{t("sub.footer.copy")}</span>
        </div>
      </div>
    </footer>
  );
}
