"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { t } from "@/lib/i18n";
import { useLocale } from "@/lib/useLocale";
import SubpageNav from "@/components/SubpageNav";
import SubpageFooter from "@/components/SubpageFooter";
import { getSupabase } from "@/lib/supabase";

interface UserProfile {
  id: string;
  display_name: string | null;
  first_name: string;
  total_energy: number;
  total_sessions: number;
  total_distance_km: number;
  total_duration_seconds: number;
  current_streak: number;
  longest_streak: number;
  streak_freeze_available: boolean;
  level: number;
}

interface Badge {
  id: string;
  category: string;
  name_en: string;
  name_de: string;
  description_en: string;
  description_de: string;
  icon: string;
  sort_order: number;
  energy_reward: number;
}

interface UserBadge {
  badge_id: string;
  earned_at: string;
}

interface LeaderboardEntry {
  rank: number;
  user_id: string;
}

const LEVEL_THRESHOLDS = [0, 500, 2000, 5000, 15000, 35000, 75000, 150000];

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export default function ProfileContent() {
  const locale = useLocale();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [allBadges, setAllBadges] = useState<Badge[]>([]);
  const [earnedBadges, setEarnedBadges] = useState<UserBadge[]>([]);
  const [weekRank, setWeekRank] = useState<number | null>(null);
  const [allTimeRank, setAllTimeRank] = useState<number | null>(null);
  const [bestSpeed, setBestSpeed] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [notRegistered, setNotRegistered] = useState(false);

  const loadProfile = useCallback(async () => {
    const email = typeof window !== "undefined" ? localStorage.getItem("cyclerun_email") : null;
    if (!email) {
      setNotRegistered(true);
      setLoading(false);
      return;
    }

    const sb = getSupabase();
    if (!sb) { setLoading(false); return; }

    // Fetch user
    const { data: userData } = await sb
      .from("registrations")
      .select("id, display_name, first_name, total_energy, total_sessions, total_distance_km, total_duration_seconds, current_streak, longest_streak, streak_freeze_available, level")
      .eq("email", email)
      .single();

    if (!userData) {
      setNotRegistered(true);
      setLoading(false);
      return;
    }

    setUser(userData as UserProfile);

    // Fetch all badges + user badges + leaderboard rank + best speed in parallel
    const [badgesRes, userBadgesRes, weekRes, allTimeRes, speedRes] = await Promise.all([
      sb.from("badges").select("*").order("category").order("sort_order"),
      sb.from("user_badges").select("badge_id, earned_at").eq("user_id", userData.id),
      sb.from("leaderboard_weekly").select("rank, user_id").eq("user_id", userData.id).maybeSingle(),
      sb.from("leaderboard_alltime").select("rank, user_id").eq("user_id", userData.id).maybeSingle(),
      sb.from("sessions").select("avg_speed_kmh").eq("user_id", userData.id).eq("excluded", false).order("avg_speed_kmh", { ascending: false }).limit(1).maybeSingle(),
    ]);

    setAllBadges((badgesRes.data || []) as Badge[]);
    setEarnedBadges((userBadgesRes.data || []) as UserBadge[]);
    setWeekRank((weekRes.data as LeaderboardEntry | null)?.rank ?? null);
    setAllTimeRank((allTimeRes.data as LeaderboardEntry | null)?.rank ?? null);
    setBestSpeed(Number((speedRes.data as { avg_speed_kmh: number } | null)?.avg_speed_kmh ?? 0));
    setLoading(false);
  }, []);

  useEffect(() => { loadProfile(); }, [loadProfile]);

  const levelName = user ? t(`g.level.${user.level}`) : "";
  const currentThreshold = user ? LEVEL_THRESHOLDS[user.level - 1] || 0 : 0;
  const nextThreshold = user ? (LEVEL_THRESHOLDS[user.level] || null) : null;
  const levelProgress = user && nextThreshold
    ? Math.min(((user.total_energy - currentThreshold) / (nextThreshold - currentThreshold)) * 100, 100)
    : 100;
  const energyToNext = nextThreshold && user ? nextThreshold - user.total_energy : 0;

  const earnedIds = new Set(earnedBadges.map((b) => b.badge_id));
  const badgesByCategory = allBadges.reduce<Record<string, Badge[]>>((acc, b) => {
    (acc[b.category] = acc[b.category] || []).push(b);
    return acc;
  }, {});

  const categoryLabels: Record<string, string> = {
    distance: "🛣️ " + (locale === "de" ? "Distanz" : "Distance"),
    duration: "⏱️ " + (locale === "de" ? "Dauer" : "Duration"),
    speed: "💨 Speed",
    streak: "🔥 Streak",
    sessions: "📊 Sessions",
    special: "✨ " + (locale === "de" ? "Spezial" : "Special"),
  };

  return (
    <div className="creator-page">
      <SubpageNav rightLabel={t("g.leaderboard")} rightHref="/leaderboard" />

      <section className="creator-hero" style={{ paddingBottom: "2rem" }}>
        <div className="creator-hero-inner" style={{ maxWidth: 800 }}>
          <span className="creator-badge-label">⚡ {t("g.profile")}</span>

          {loading ? (
            <div style={{ textAlign: "center", padding: "4rem 0" }}>
              <div className="loading-spinner" style={{ margin: "0 auto" }}></div>
            </div>
          ) : notRegistered ? (
            <div style={{ textAlign: "center", padding: "3rem 0" }}>
              <h1 className="creator-hero-h1" style={{ fontSize: "2rem" }}>{t("g.profile")}</h1>
              <p style={{ color: "var(--text-muted)", maxWidth: 400, margin: "1rem auto 2rem" }}>
                {t("g.profile.not_registered")}
              </p>
              <Link href="/" className="btn-primary btn-lg">{t("g.profile.register_cta")}</Link>
            </div>
          ) : user && (
            <>
              {/* Level + Name Header */}
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
                <div style={{
                  width: 56, height: 56, borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--accent-1), var(--accent-2))",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.5rem", fontWeight: 800, color: "#000",
                }}>
                  {user.level}
                </div>
                <div>
                  <h1 style={{ fontSize: "1.8rem", fontWeight: 800, margin: 0, lineHeight: 1.2 }}>
                    {user.display_name || user.first_name}
                  </h1>
                  <span style={{ color: "var(--accent-1)", fontWeight: 600, fontSize: "0.9rem" }}>
                    {t("g.level", { n: user.level })} — {levelName}
                  </span>
                </div>
              </div>

              {/* Level Progress Bar */}
              <div style={{ margin: "1rem 0 0.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 4 }}>
                  <span>{t("g.profile.level_progress")}</span>
                  <span>{nextThreshold ? t("g.profile.next_level", { n: energyToNext }) : t("g.profile.max_level")}</span>
                </div>
                <div className="progress-bar" style={{ height: 8, borderRadius: 4 }}>
                  <div className="progress-fill" style={{ width: `${levelProgress}%`, borderRadius: 4 }}></div>
                </div>
              </div>

              {/* Energy + Streak Row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", margin: "1.5rem 0" }}>
                <div className="info-card" style={{ padding: "1rem", textAlign: "center" }}>
                  <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--accent-1)" }}>⚡ {user.total_energy.toLocaleString()}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{t("g.profile.total_energy")}</div>
                </div>
                <div className="info-card" style={{ padding: "1rem", textAlign: "center" }}>
                  <div style={{ fontSize: "2rem", fontWeight: 800, color: user.current_streak > 0 ? "#f97316" : "var(--text-muted)" }}>
                    🔥 {user.current_streak}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    {user.current_streak > 0 ? t("g.streak", { n: user.current_streak }) : t("g.streak.start")}
                  </div>
                  {user.streak_freeze_available && (
                    <div style={{ fontSize: "0.7rem", color: "#3b82f6", marginTop: 4 }}>❄️ {t("g.streak.freeze")}</div>
                  )}
                </div>
              </div>

              {/* Stats Grid */}
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700, margin: "1.5rem 0 0.75rem" }}>{t("g.profile.stats")}</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
                <StatCard label={t("g.profile.total_rides")} value={String(user.total_sessions)} />
                <StatCard label={t("g.profile.total_distance")} value={`${Number(user.total_distance_km).toFixed(1)} km`} />
                <StatCard label={t("g.profile.total_time")} value={formatDuration(user.total_duration_seconds)} />
                <StatCard label={t("g.profile.best_speed")} value={bestSpeed > 0 ? `${bestSpeed.toFixed(1)} km/h` : "—"} />
                <StatCard label={t("g.leaderboard.week")} value={weekRank ? `#${weekRank}` : "—"} accent />
                <StatCard label={t("g.leaderboard.alltime")} value={allTimeRank ? `#${allTimeRank}` : "—"} accent />
              </div>

              {/* Badges */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "2rem 0 0.75rem" }}>
                <h2 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0 }}>{t("g.badges")}</h2>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  {t("g.badges.earned", { n: earnedBadges.length, total: allBadges.length })}
                </span>
              </div>

              {Object.entries(badgesByCategory).map(([cat, badges]) => (
                <div key={cat} style={{ marginBottom: "1.5rem" }}>
                  <h3 style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-muted)", margin: "0 0 0.5rem" }}>
                    {categoryLabels[cat] || cat}
                  </h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "0.5rem" }}>
                    {badges.map((badge) => {
                      const earned = earnedIds.has(badge.id);
                      return (
                        <div
                          key={badge.id}
                          className="info-card"
                          style={{
                            padding: "0.75rem",
                            textAlign: "center",
                            opacity: earned ? 1 : 0.35,
                            position: "relative",
                          }}
                        >
                          <div style={{ fontSize: "1.8rem", marginBottom: "0.25rem" }}>{badge.icon}</div>
                          <div style={{ fontSize: "0.75rem", fontWeight: 700, lineHeight: 1.2 }}>
                            {locale === "de" ? badge.name_de : badge.name_en}
                          </div>
                          <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginTop: 2, lineHeight: 1.3 }}>
                            {locale === "de" ? badge.description_de : badge.description_en}
                          </div>
                          {earned && (
                            <div style={{ fontSize: "0.6rem", color: "var(--accent-1)", marginTop: 4, fontWeight: 600 }}>
                              +{badge.energy_reward} ⚡
                            </div>
                          )}
                          {!earned && (
                            <div style={{ fontSize: "0.6rem", color: "var(--text-muted)", marginTop: 4 }}>
                              🔒 {t("g.badges.locked")}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Longest Streak Record */}
              {user.longest_streak > 0 && (
                <div className="info-card" style={{ padding: "1rem", textAlign: "center", marginTop: "1rem" }}>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    {locale === "de" ? "Längster Streak" : "Longest Streak"}
                  </span>
                  <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#f97316" }}>
                    🔥 {user.longest_streak} {locale === "de" ? "Tage" : "days"}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div style={{ textAlign: "center", margin: "2rem 0" }}>
                <Link href="/" className="btn-primary btn-lg">{t("sub.start_riding")}</Link>
                <span style={{ margin: "0 0.75rem", color: "var(--text-muted)" }}>·</span>
                <Link href="/leaderboard" className="btn-ghost">{t("g.leaderboard")}</Link>
              </div>
            </>
          )}
        </div>
      </section>

      <SubpageFooter />
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="info-card" style={{ padding: "0.75rem", textAlign: "center" }}>
      <div style={{ fontSize: "1.3rem", fontWeight: 800, color: accent ? "var(--accent-1)" : "var(--text)" }}>{value}</div>
      <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{label}</div>
    </div>
  );
}
