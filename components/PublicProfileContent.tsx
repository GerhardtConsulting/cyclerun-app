"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { t } from "@/lib/i18n";
import { useLocale } from "@/lib/useLocale";
import SubpageNav from "@/components/SubpageNav";
import SubpageFooter from "@/components/SubpageFooter";
import { getSupabase } from "@/lib/supabase";

interface PublicUser {
  id: string;
  display_name: string | null;
  first_name: string;
  nickname: string | null;
  avatar_url: string | null;
  total_energy: number;
  total_sessions: number;
  total_distance_km: number;
  total_duration_seconds: number;
  current_streak: number;
  longest_streak: number;
  level: number;
  is_public: boolean;
}

interface Badge {
  icon: string;
  name_en: string;
  name_de: string;
}

interface PublicProfileContentProps {
  slug: string;
}

const LEVEL_NAMES_EN = ["", "Beginner", "Rookie", "Regular", "Athlete", "Pro", "Elite", "Legend", "Immortal"];
const LEVEL_NAMES_DE = ["", "Anfänger", "Einsteiger", "Aktiv", "Sportler", "Profi", "Elite", "Legende", "Unsterblich"];

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export default function PublicProfileContent({ slug }: PublicProfileContentProps) {
  const locale = useLocale();
  const isDE = locale === "de";
  const [user, setUser] = useState<PublicUser | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [upvoteCount, setUpvoteCount] = useState(0);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [weekRank, setWeekRank] = useState<number | null>(null);

  const loadProfile = useCallback(async () => {
    const sb = getSupabase();
    if (!sb) { setLoading(false); return; }

    const { data: userData } = await sb
      .from("registrations")
      .select("id, display_name, first_name, nickname, avatar_url, total_energy, total_sessions, total_distance_km, total_duration_seconds, current_streak, longest_streak, level, is_public")
      .eq("slug", slug)
      .eq("is_public", true)
      .single();

    if (!userData) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    setUser(userData as PublicUser);

    // Fetch earned badges, upvotes, rank in parallel
    const [badgesRes, upvotesRes, rankRes] = await Promise.all([
      sb.from("user_badges")
        .select("badges(icon, name_en, name_de)")
        .eq("user_id", userData.id),
      sb.from("upvotes").select("id", { count: "exact" }).eq("target_user_id", userData.id),
      sb.from("leaderboard_weekly").select("rank").eq("user_id", userData.id).maybeSingle(),
    ]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const earnedBadges = (badgesRes.data || []).map((ub: any) => ({
      icon: ub.badges?.icon || "🏆",
      name_en: ub.badges?.name_en || "",
      name_de: ub.badges?.name_de || "",
    }));
    setBadges(earnedBadges);
    setUpvoteCount(upvotesRes.count || 0);
    setWeekRank((rankRes.data as { rank: number } | null)?.rank ?? null);

    // Check if current user has upvoted
    const myEmail = typeof window !== "undefined" ? localStorage.getItem("cyclerun_email") : null;
    if (myEmail) {
      const { data: myUser } = await sb.from("registrations").select("id").eq("email", myEmail).single();
      if (myUser) {
        const { data: vote } = await sb.from("upvotes").select("id").eq("voter_id", myUser.id).eq("target_user_id", userData.id).maybeSingle();
        setHasUpvoted(!!vote);
      }
    }

    setLoading(false);
  }, [slug]);

  useEffect(() => { loadProfile(); }, [loadProfile]);

  const handleUpvote = async () => {
    if (!user) return;
    const sb = getSupabase();
    if (!sb) return;

    const myEmail = typeof window !== "undefined" ? localStorage.getItem("cyclerun_email") : null;
    if (!myEmail) return;

    const { data: myUser } = await sb.from("registrations").select("id").eq("email", myEmail).single();
    if (!myUser || myUser.id === user.id) return;

    if (hasUpvoted) {
      await sb.from("upvotes").delete().eq("voter_id", myUser.id).eq("target_user_id", user.id);
      setUpvoteCount((c) => c - 1);
      setHasUpvoted(false);
    } else {
      await sb.from("upvotes").insert({ voter_id: myUser.id, target_user_id: user.id });
      setUpvoteCount((c) => c + 1);
      setHasUpvoted(true);
    }
  };

  const levelName = user ? (isDE ? LEVEL_NAMES_DE[user.level] : LEVEL_NAMES_EN[user.level]) || "" : "";
  const displayName = user?.nickname || user?.display_name || user?.first_name || "Rider";

  return (
    <div className="creator-page">
      <SubpageNav rightKey="sub.back_home" rightHref="/" />

      <section className="creator-hero" style={{ paddingBottom: "2rem" }}>
        <div className="creator-hero-inner" style={{ maxWidth: 600 }}>

          {loading ? (
            <div style={{ textAlign: "center", padding: "4rem 0" }}>
              <div className="loading-spinner" style={{ margin: "0 auto" }}></div>
            </div>
          ) : notFound ? (
            <div style={{ textAlign: "center", padding: "3rem 0" }}>
              <h1 className="creator-hero-h1" style={{ fontSize: "2rem" }}>404</h1>
              <p style={{ color: "var(--text-muted)", margin: "1rem 0 2rem" }}>
                {isDE ? "Profil nicht gefunden oder nicht öffentlich." : "Profile not found or not public."}
              </p>
              <Link href="/" className="btn-primary btn-lg">{t("sub.start_riding")}</Link>
            </div>
          ) : user && (
            <>
              {/* Profile Header */}
              <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={displayName} style={{
                    width: 80, height: 80, borderRadius: "50%", objectFit: "cover",
                    border: "3px solid var(--accent-1)", margin: "0 auto 0.75rem",
                    display: "block",
                  }} />
                ) : (
                  <div style={{
                    width: 80, height: 80, borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--accent-1), var(--accent-2))",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "2rem", fontWeight: 800, color: "#000",
                    margin: "0 auto 0.75rem",
                  }}>
                    {user.level}
                  </div>
                )}
                <h1 style={{ fontSize: "1.8rem", fontWeight: 800, margin: "0 0 0.25rem" }}>
                  {displayName}
                </h1>
                <span style={{ color: "var(--accent-1)", fontWeight: 600, fontSize: "0.9rem" }}>
                  {isDE ? `Level ${user.level}` : `Level ${user.level}`} — {levelName}
                </span>

                {/* Upvote Button */}
                <div style={{ marginTop: "1rem" }}>
                  <button onClick={handleUpvote} className={hasUpvoted ? "btn-primary" : "btn-ghost"} style={{
                    padding: "0.4rem 1.2rem", fontSize: "0.85rem", borderRadius: 20,
                  }}>
                    👍 {upvoteCount} {hasUpvoted ? (isDE ? "Geliked" : "Liked") : "Like"}
                  </button>
                </div>
              </div>

              {/* Stats Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem", marginBottom: "1.5rem" }}>
                <StatCard label={isDE ? "Fahrten" : "Rides"} value={String(user.total_sessions)} />
                <StatCard label={isDE ? "Distanz" : "Distance"} value={`${Number(user.total_distance_km).toFixed(1)} km`} />
                <StatCard label={isDE ? "Gesamtzeit" : "Time"} value={formatDuration(user.total_duration_seconds)} />
                <StatCard label="⚡ Energy" value={user.total_energy.toLocaleString()} accent />
                <StatCard label="🔥 Streak" value={`${user.current_streak} ${isDE ? "Tage" : "days"}`} />
                <StatCard label={isDE ? "Rang" : "Rank"} value={weekRank ? `#${weekRank}` : "—"} accent />
              </div>

              {/* Badges */}
              {badges.length > 0 && (
                <div style={{ marginBottom: "1.5rem" }}>
                  <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.75rem" }}>
                    {isDE ? "Abzeichen" : "Achievements"} ({badges.length})
                  </h2>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center" }}>
                    {badges.map((b, i) => (
                      <div key={i} className="info-card" style={{ padding: "0.5rem 0.75rem", textAlign: "center", minWidth: 70 }}>
                        <div style={{ fontSize: "1.5rem" }}>{b.icon}</div>
                        <div style={{ fontSize: "0.65rem", fontWeight: 600, lineHeight: 1.2, marginTop: 2 }}>
                          {isDE ? b.name_de : b.name_en}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Longest Streak */}
              {user.longest_streak > 0 && (
                <div className="info-card" style={{ padding: "1rem", textAlign: "center" }}>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    {isDE ? "Längster Streak" : "Longest Streak"}
                  </span>
                  <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#f97316" }}>
                    🔥 {user.longest_streak} {isDE ? "Tage" : "days"}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div style={{ textAlign: "center", margin: "2rem 0" }}>
                <Link href="/" className="btn-primary btn-lg">{t("sub.start_riding")}</Link>
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
