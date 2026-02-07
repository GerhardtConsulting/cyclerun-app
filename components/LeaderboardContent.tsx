"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { t } from "@/lib/i18n";
import { useLocale } from "@/lib/useLocale";
import SubpageNav from "@/components/SubpageNav";
import SubpageFooter from "@/components/SubpageFooter";
import { getSupabase } from "@/lib/supabase";

type Period = "week" | "month" | "alltime";

interface LeaderboardRow {
  user_id: string;
  display_name: string;
  level: number;
  current_streak: number;
  rank: number;
  // Period-specific fields
  week_distance?: number;
  week_duration?: number;
  week_sessions?: number;
  week_energy?: number;
  month_distance?: number;
  month_duration?: number;
  month_sessions?: number;
  month_energy?: number;
  total_distance?: number;
  total_duration?: number;
  total_sessions?: number;
  total_energy?: number;
}

const LEVEL_NAMES_EN = ["", "Beginner", "Rookie", "Regular", "Athlete", "Pro", "Elite", "Legend", "Immortal"];
const LEVEL_NAMES_DE = ["", "Anfänger", "Einsteiger", "Aktiv", "Sportler", "Profi", "Elite", "Legende", "Unsterblich"];

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export default function LeaderboardContent() {
  const locale = useLocale();
  const [period, setPeriod] = useState<Period>("week");
  const [rows, setRows] = useState<LeaderboardRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [myUserId, setMyUserId] = useState<string | null>(null);

  const loadLeaderboard = useCallback(async (p: Period) => {
    setLoading(true);
    const sb = getSupabase();
    if (!sb) { setLoading(false); return; }

    // Get current user ID
    const email = typeof window !== "undefined" ? localStorage.getItem("cyclerun_email") : null;
    if (email && !myUserId) {
      const { data } = await sb.from("registrations").select("id").eq("email", email).maybeSingle();
      if (data) setMyUserId(data.id);
    }

    const viewName = p === "week" ? "leaderboard_weekly" : p === "month" ? "leaderboard_monthly" : "leaderboard_alltime";
    const { data } = await sb.from(viewName).select("*").limit(50);
    setRows((data || []) as LeaderboardRow[]);
    setLoading(false);
  }, [myUserId]);

  useEffect(() => { loadLeaderboard(period); }, [period, loadLeaderboard]);

  const getEnergy = (row: LeaderboardRow): number => {
    return Number(row.week_energy ?? row.month_energy ?? row.total_energy ?? 0);
  };
  const getDistance = (row: LeaderboardRow): number => {
    return Number(row.week_distance ?? row.month_distance ?? row.total_distance ?? 0);
  };
  const getDuration = (row: LeaderboardRow): number => {
    return Number(row.week_duration ?? row.month_duration ?? row.total_duration ?? 0);
  };
  const getSessions = (row: LeaderboardRow): number => {
    return Number(row.week_sessions ?? row.month_sessions ?? row.total_sessions ?? 0);
  };

  const levelNames = locale === "de" ? LEVEL_NAMES_DE : LEVEL_NAMES_EN;

  const periodTabs: { key: Period; label: string }[] = [
    { key: "week", label: t("g.leaderboard.week") },
    { key: "month", label: t("g.leaderboard.month") },
    { key: "alltime", label: t("g.leaderboard.alltime") },
  ];

  return (
    <div className="creator-page">
      <SubpageNav rightLabel={t("g.profile")} rightHref="/profile" />

      <section className="creator-hero" style={{ paddingBottom: "2rem" }}>
        <div className="creator-hero-inner" style={{ maxWidth: 800 }}>
          <span className="creator-badge-label">🏆 {t("g.leaderboard")}</span>
          <h1 className="creator-hero-h1" style={{ fontSize: "2.2rem" }}>
            {t("g.leaderboard")}
          </h1>

          {/* Period Tabs */}
          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", margin: "1.5rem 0" }}>
            {periodTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setPeriod(tab.key)}
                className={period === tab.key ? "btn-primary btn-sm" : "btn-ghost btn-sm"}
                style={{ minWidth: 100 }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Leaderboard Table */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "3rem 0" }}>
              <div className="loading-spinner" style={{ margin: "0 auto" }}></div>
            </div>
          ) : rows.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem 0" }}>
              <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>{t("g.leaderboard.empty")}</p>
              <Link href="/" className="btn-primary btn-lg" style={{ marginTop: "1rem", display: "inline-block" }}>
                {t("sub.start_riding")}
              </Link>
            </div>
          ) : (
            <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid var(--border)" }}>
              {/* Header */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "50px 1fr 90px 90px 80px",
                padding: "0.75rem 1rem",
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                background: "var(--bg-elevated)",
                borderBottom: "1px solid var(--border)",
              }}>
                <span>#</span>
                <span>{t("g.leaderboard.rider")}</span>
                <span style={{ textAlign: "right" }}>⚡ {t("g.energy")}</span>
                <span style={{ textAlign: "right" }}>km</span>
                <span style={{ textAlign: "right" }}>🔥</span>
              </div>

              {/* Rows */}
              {rows.map((row) => {
                const isMe = row.user_id === myUserId;
                const rankDisplay = row.rank <= 3
                  ? ["🥇", "🥈", "🥉"][row.rank - 1]
                  : `${row.rank}`;

                return (
                  <div
                    key={row.user_id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "50px 1fr 90px 90px 80px",
                      padding: "0.75rem 1rem",
                      alignItems: "center",
                      borderBottom: "1px solid var(--border)",
                      background: isMe ? "rgba(245, 158, 11, 0.08)" : "transparent",
                      transition: "background 0.15s",
                    }}
                  >
                    <span style={{ fontSize: row.rank <= 3 ? "1.2rem" : "0.9rem", fontWeight: 700 }}>
                      {rankDisplay}
                    </span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>
                        {row.display_name || "Rider"}
                        {isMe && <span style={{ color: "var(--accent-1)", fontSize: "0.75rem", marginLeft: 6 }}>({t("g.leaderboard.you")})</span>}
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                        Lv.{row.level} {levelNames[row.level] || ""} · {getSessions(row)} {locale === "de" ? "Fahrten" : "rides"} · {formatDuration(getDuration(row))}
                      </div>
                    </div>
                    <span style={{ textAlign: "right", fontWeight: 700, color: "var(--accent-1)", fontSize: "0.9rem" }}>
                      {getEnergy(row).toLocaleString()}
                    </span>
                    <span style={{ textAlign: "right", fontSize: "0.85rem" }}>
                      {getDistance(row).toFixed(1)}
                    </span>
                    <span style={{ textAlign: "right", fontSize: "0.85rem" }}>
                      {row.current_streak > 0 ? `${row.current_streak}d` : "—"}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* CTAs */}
          <div style={{ textAlign: "center", margin: "2rem 0" }}>
            <Link href="/" className="btn-primary btn-lg">{t("sub.start_riding")}</Link>
            <span style={{ margin: "0 0.75rem", color: "var(--text-muted)" }}>·</span>
            <Link href="/profile" className="btn-ghost">{t("g.profile")}</Link>
          </div>
        </div>
      </section>

      <SubpageFooter />
    </div>
  );
}
