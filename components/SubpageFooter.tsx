"use client";

import Link from "next/link";
import { t } from "@/lib/i18n";
import { useLocale } from "@/lib/useLocale";

export default function SubpageFooter() {
  useLocale(); // re-render on locale change
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
              <Link href="/routes">{t("sub.footer.routes")}</Link>
              <Link href="/creator">{t("sub.footer.creator")}</Link>
              <Link href="/roadmap">{t("sub.footer.roadmap")}</Link>
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
              <strong>{t("sub.footer.company")}</strong>
              <Link href="/datenschutz">{t("sub.footer.privacy")}</Link>
              <Link href="/impressum">{t("sub.footer.legal")}</Link>
            </div>
          </div>
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
