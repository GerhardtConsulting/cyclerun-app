"use client";

import Link from "next/link";
import { changelog, type ChangelogEntry } from "@/lib/changelog-data";
import { t } from "@/lib/i18n";
import { useLocale } from "@/lib/useLocale";
import SubpageNav from "@/components/SubpageNav";
import SubpageFooter from "@/components/SubpageFooter";

function formatDate(dateStr: string, locale: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString(locale === "de" ? "de-DE" : "en-US", {
    year: "numeric", month: "long", day: "numeric"
  });
}

const typeBadge: Record<string, { label: string; label_de: string; color: string; bg: string }> = {
  feature: { label: "New", label_de: "Neu", color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
  improvement: { label: "Improved", label_de: "Verbessert", color: "#3b82f6", bg: "rgba(59,130,246,0.1)" },
  fix: { label: "Fixed", label_de: "Behoben", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
  system: { label: "System", label_de: "System", color: "#8b5cf6", bg: "rgba(139,92,246,0.1)" },
};

function ChangeEntry({ entry, locale }: { entry: ChangelogEntry; locale: string }) {
  const isDE = locale === "de";
  return (
    <div style={{ marginBottom: "3rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
        <span style={{
          background: "linear-gradient(135deg, var(--accent-1), var(--accent-2))",
          color: "#000", fontWeight: 800, fontSize: "0.8rem",
          padding: "0.2rem 0.6rem", borderRadius: 6,
        }}>
          v{entry.version}
        </span>
        <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
          {formatDate(entry.date, locale)}
        </span>
      </div>
      <h2 style={{ fontSize: "1.4rem", fontWeight: 800, margin: "0.25rem 0 0.5rem", lineHeight: 1.3 }}>
        {isDE ? entry.title_de : entry.title}
      </h2>
      <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "1rem" }}>
        {isDE ? entry.summary_de : entry.summary}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {entry.changes.map((change, i) => {
          const badge = typeBadge[change.type];
          return (
            <div key={i} className="info-card" style={{
              padding: "0.75rem 1rem", display: "flex", gap: "0.75rem", alignItems: "flex-start",
            }}>
              <span style={{
                fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase",
                color: badge.color, background: badge.bg,
                padding: "0.15rem 0.5rem", borderRadius: 4, whiteSpace: "nowrap", marginTop: 2,
                letterSpacing: "0.03em",
              }}>
                {isDE ? badge.label_de : badge.label}
              </span>
              <span
                style={{ fontSize: "0.88rem", lineHeight: 1.5, color: "var(--text-primary)" }}
                dangerouslySetInnerHTML={{
                  __html: (isDE ? change.text_de : change.text)
                    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ChangelogContent() {
  const locale = useLocale();
  const isDE = locale === "de";

  return (
    <div className="creator-page">
      <SubpageNav rightKey="sub.back_home" rightHref="/" />

      <section className="creator-hero" style={{ paddingBottom: "2rem" }}>
        <div className="creator-hero-inner" style={{ maxWidth: 720 }}>
          <span className="creator-badge-label">
            {isDE ? "Wir entwickeln. Jeden Tag." : "We ship. Every day."}
          </span>
          <h1 className="creator-hero-h1" style={{ fontSize: "2.2rem", marginBottom: "0.25rem" }}>
            Changelog
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1rem", maxWidth: 520, margin: "0 auto 2.5rem" }}>
            {isDE
              ? "Alles was sich bei CycleRun tut. Neue Features, Verbesserungen und Fixes \u2014 transparent und in Echtzeit."
              : "Everything happening at CycleRun. New features, improvements, and fixes \u2014 transparent and in real-time."
            }
          </p>

          {changelog.map((entry) => (
            <ChangeEntry key={entry.version} entry={entry} locale={locale} />
          ))}

          <div style={{ textAlign: "center", margin: "2rem 0" }}>
            <Link href="/" className="btn-primary btn-lg">{t("sub.start_riding")}</Link>
            <span style={{ margin: "0 0.75rem", color: "var(--text-muted)" }}>&middot;</span>
            <Link href="/roadmap" className="btn-ghost">Roadmap &rarr;</Link>
          </div>
        </div>
      </section>

      <SubpageFooter />
    </div>
  );
}
