"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { t } from "@/lib/i18n";
import { useLocale } from "@/lib/useLocale";
import SubpageNav from "@/components/SubpageNav";
import SubpageFooter from "@/components/SubpageFooter";
import { getSupabase } from "@/lib/supabase";
import { fetchGoalState, calculateGoalProgress, type GoalState, type GoalProgress } from "@/lib/goal-capture";

interface UserProfile {
  id: string;
  display_name: string | null;
  first_name: string;
  email: string;
  email_confirmed: boolean;
  total_energy: number;
  total_sessions: number;
  total_distance_km: number;
  total_duration_seconds: number;
  current_streak: number;
  longest_streak: number;
  streak_freeze_available: boolean;
  level: number;
  avatar_url: string | null;
  nickname: string | null;
  slug: string | null;
  is_public: boolean;
  referral_code: string | null;
  credits: number;
  onboarding_completed: boolean;
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
  const [goalProgress, setGoalProgress] = useState<GoalProgress | null>(null);
  const [goalState, setGoalState] = useState<GoalState | null>(null);
  const [upvoteCount, setUpvoteCount] = useState(0);
  const [referralCount, setReferralCount] = useState(0);
  const [editing, setEditing] = useState(false);
  const [editNickname, setEditNickname] = useState("");
  const [editPublic, setEditPublic] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [referralCopied, setReferralCopied] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState("");

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
      .select("id, display_name, first_name, email, email_confirmed, total_energy, total_sessions, total_distance_km, total_duration_seconds, current_streak, longest_streak, streak_freeze_available, level, avatar_url, nickname, slug, is_public, referral_code, credits, onboarding_completed")
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

    // Fetch upvote count + referral count
    const [upvotesRes, referralsRes] = await Promise.all([
      sb.from("upvotes").select("id", { count: "exact" }).eq("target_user_id", userData.id),
      sb.from("referrals").select("id", { count: "exact" }).eq("referrer_id", userData.id),
    ]);
    setUpvoteCount(upvotesRes.count || 0);
    setReferralCount(referralsRes.count || 0);

    // Initialize edit state
    setEditNickname(userData.nickname || "");
    setEditPublic(userData.is_public || false);

    // Fetch goal state + calculate progress
    const gs = await fetchGoalState(userData.id);
    setGoalState(gs);
    if (gs) {
      const progress = calculateGoalProgress(gs, {
        totalDistanceKm: userData.total_distance_km || 0,
        totalSessions: userData.total_sessions || 0,
        totalDurationSeconds: userData.total_duration_seconds || 0,
        currentStreak: userData.current_streak || 0,
      }, locale);
      setGoalProgress(progress);
    }

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

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const sb = getSupabase();
    if (!sb) { setSaving(false); return; }

    const slug = editNickname.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") || null;

    const { error } = await sb.from("registrations").update({
      nickname: editNickname.trim() || null,
      slug,
      is_public: editPublic,
      display_name: editNickname.trim() || user.first_name,
    }).eq("id", user.id);

    if (!error) {
      setUser({ ...user, nickname: editNickname.trim() || null, slug, is_public: editPublic, display_name: editNickname.trim() || user.first_name });
      setEditing(false);
    }
    setSaving(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files?.[0]) return;
    setUploadingAvatar(true);
    const sb = getSupabase();
    if (!sb) { setUploadingAvatar(false); return; }

    const file = e.target.files[0];
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${user.id}.${ext}`;

    const { error: uploadError } = await sb.storage.from("avatars").upload(path, file, { upsert: true });
    if (uploadError) { console.error("Avatar upload error:", uploadError); setUploadingAvatar(false); return; }

    const { data: urlData } = sb.storage.from("avatars").getPublicUrl(path);
    const avatarUrl = urlData.publicUrl + "?t=" + Date.now();

    await sb.from("registrations").update({ avatar_url: avatarUrl }).eq("id", user.id);
    setUser({ ...user, avatar_url: avatarUrl });
    setUploadingAvatar(false);
  };

  const handleCopyReferral = () => {
    if (!user?.referral_code) return;
    const url = `https://cyclerun.app?ref=${user.referral_code}`;
    navigator.clipboard.writeText(url).then(() => {
      setReferralCopied(true);
      setTimeout(() => setReferralCopied(false), 2000);
    });
  };

  const isDE = locale === "de";

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
              {/* Onboarding Welcome Card */}
              {!user.onboarding_completed && (
                <div style={{
                  background: "linear-gradient(135deg, rgba(249,115,22,0.08), rgba(234,88,12,0.03))",
                  border: "1px solid rgba(249,115,22,0.15)",
                  borderRadius: 16, padding: "1.5rem", marginBottom: "1rem", textAlign: "center",
                }}>
                  <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🎉</div>
                  <h2 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "0.5rem" }}>
                    {isDE ? `Willkommen, ${user.first_name}!` : `Welcome, ${user.first_name}!`}
                  </h2>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.6, maxWidth: 400, margin: "0 auto 1rem" }}>
                    {isDE
                      ? "Dein Profil ist aktiv. Starte deine erste Fahrt, um Energie zu sammeln, Level aufzusteigen und Badges freizuschalten."
                      : "Your profile is active. Start your first ride to earn Energy, level up, and unlock badges."}
                  </p>
                  <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
                    <Link href="/" className="btn-primary" style={{ padding: "0.5rem 1.25rem", fontSize: "0.85rem" }}>
                      {isDE ? "Erste Fahrt starten" : "Start first ride"}
                    </Link>
                    <button
                      className="btn-ghost"
                      style={{ padding: "0.5rem 1.25rem", fontSize: "0.85rem" }}
                      onClick={async () => {
                        const sb = getSupabase();
                        if (sb && user) {
                          await sb.from("registrations").update({ onboarding_completed: true }).eq("id", user.id);
                          setUser({ ...user, onboarding_completed: true });
                        }
                      }}
                    >
                      {isDE ? "Verstanden" : "Got it"}
                    </button>
                  </div>
                </div>
              )}

              {/* DOIP Warning Banner — DSGVO-compliant email confirmation reminder */}
              {!user.email_confirmed && (
                <div style={{
                  background: "linear-gradient(135deg, rgba(251,191,36,0.1), rgba(245,158,11,0.05))",
                  border: "1px solid rgba(251,191,36,0.25)",
                  borderRadius: 14, padding: "1.25rem", marginBottom: "1rem",
                }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                    <span style={{ fontSize: "1.5rem" }}>⚠️</span>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.35rem", color: "#fbbf24" }}>
                        {t("doip.title")}
                      </h3>
                      <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5, marginBottom: "0.75rem" }}>
                        {t("doip.text")}
                      </p>
                      {resendSuccess ? (
                        <div style={{ fontSize: "0.85rem", color: "#22c55e" }}>
                          ✓ {t("doip.sent")} {t("doip.check")}
                        </div>
                      ) : resendError ? (
                        <div style={{ fontSize: "0.85rem", color: "#ef4444", marginBottom: "0.5rem" }}>
                          {t("doip.error")}
                        </div>
                      ) : null}
                      <button
                        className="btn-primary"
                        style={{ padding: "0.5rem 1rem", fontSize: "0.8rem", marginTop: resendSuccess ? 0 : "0.25rem" }}
                        disabled={resendingEmail || resendSuccess}
                        onClick={async () => {
                          if (!user.email) return;
                          setResendingEmail(true);
                          setResendError("");
                          try {
                            const res = await fetch("/api/resend-confirmation", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ email: user.email }),
                            });
                            if (res.ok) {
                              setResendSuccess(true);
                            } else {
                              setResendError(t("doip.error"));
                            }
                          } catch {
                            setResendError(t("doip.error"));
                          }
                          setResendingEmail(false);
                        }}
                      >
                        {resendingEmail ? "..." : t("doip.resend")}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Profile Card */}
              <div className="info-card" style={{ padding: "1.25rem", marginBottom: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  {/* Avatar */}
                  <label style={{ position: "relative", cursor: "pointer", flexShrink: 0 }}>
                    <input type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: "none" }} />
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt="" style={{
                        width: 64, height: 64, borderRadius: "50%", objectFit: "cover",
                        border: "3px solid var(--accent-1)",
                      }} />
                    ) : (
                      <div style={{
                        width: 64, height: 64, borderRadius: "50%",
                        background: "linear-gradient(135deg, var(--accent-1), var(--accent-2))",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "1.5rem", fontWeight: 800, color: "#000",
                      }}>
                        {user.level}
                      </div>
                    )}
                    <span style={{
                      position: "absolute", bottom: -2, right: -2, background: "var(--bg-card)",
                      borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center",
                      justifyContent: "center", fontSize: "0.7rem", border: "2px solid var(--border)",
                    }}>
                      {uploadingAvatar ? "..." : "📷"}
                    </span>
                  </label>
                  {/* Name + Level */}
                  <div style={{ flex: 1 }}>
                    <h1 style={{ fontSize: "1.6rem", fontWeight: 800, margin: 0, lineHeight: 1.2 }}>
                      {user.nickname || user.display_name || user.first_name}
                    </h1>
                    <span style={{ color: "var(--accent-1)", fontWeight: 600, fontSize: "0.85rem" }}>
                      {t("g.level", { n: user.level })} — {levelName}
                    </span>
                    {user.slug && user.is_public && (
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 2 }}>
                        <Link href={`/u/${user.slug}`} style={{ color: "var(--text-muted)" }}>cyclerun.app/u/{user.slug}</Link>
                      </div>
                    )}
                  </div>
                  {/* Edit Button */}
                  <button onClick={() => setEditing(!editing)} className="btn-ghost" style={{ padding: "0.4rem 0.6rem", fontSize: "0.8rem" }}>
                    {editing ? "✕" : "✏️"}
                  </button>
                </div>

                {/* Quick Stats Row */}
                <div style={{ display: "flex", gap: "1rem", marginTop: "0.75rem", justifyContent: "center", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  <span>👍 {upvoteCount} {isDE ? "Likes" : "Likes"}</span>
                  <span>🪙 {user.credits} Credits</span>
                  <span>👥 {referralCount} {isDE ? "geworben" : "referred"}</span>
                </div>

                {/* Edit Section */}
                {editing && (
                  <div style={{ marginTop: "1rem", borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
                    <div style={{ marginBottom: "0.75rem" }}>
                      <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: 4 }}>
                        {isDE ? "Nickname" : "Nickname"}
                      </label>
                      <input
                        type="text" value={editNickname} onChange={(e) => setEditNickname(e.target.value)}
                        placeholder={isDE ? "Dein Nickname..." : "Your nickname..."}
                        maxLength={30}
                        style={{
                          width: "100%", padding: "0.5rem 0.75rem", borderRadius: 8,
                          border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text-primary)",
                          fontSize: "0.9rem",
                        }}
                      />
                      {editNickname.trim() && (
                        <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 4 }}>
                          {isDE ? "Profil-URL:" : "Profile URL:"} cyclerun.app/u/{editNickname.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-")}
                        </div>
                      )}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                      <button
                        onClick={() => setEditPublic(!editPublic)}
                        style={{
                          width: 40, height: 22, borderRadius: 11, border: "none", cursor: "pointer",
                          background: editPublic ? "var(--accent-1)" : "var(--border)",
                          position: "relative", transition: "background 0.2s",
                        }}
                      >
                        <span style={{
                          position: "absolute", top: 2, left: editPublic ? 20 : 2,
                          width: 18, height: 18, borderRadius: "50%", background: "#fff",
                          transition: "left 0.2s",
                        }} />
                      </button>
                      <span style={{ fontSize: "0.85rem" }}>
                        {editPublic
                          ? (isDE ? "🌍 Profil öffentlich" : "🌍 Public profile")
                          : (isDE ? "🔒 Profil privat" : "🔒 Private profile")
                        }
                      </span>
                    </div>
                    <button onClick={handleSaveProfile} disabled={saving} className="btn-primary" style={{ width: "100%", fontSize: "0.85rem" }}>
                      {saving ? "..." : (isDE ? "Speichern" : "Save")}
                    </button>
                  </div>
                )}
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

              {/* Goal Progress */}
              {goalProgress ? (
                <div className="info-card" style={{ padding: "1rem", marginBottom: "1.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>🎯 {t("goal.progress")}</span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      {goalProgress.currentValue} {t("goal.progress.of")} {goalProgress.targetValue} {goalProgress.unit}
                    </span>
                  </div>
                  <div className="progress-bar" style={{ height: 10, borderRadius: 5 }}>
                    <div className="progress-fill" style={{
                      width: `${goalProgress.percentage}%`, borderRadius: 5,
                      background: goalProgress.percentage >= 100
                        ? "linear-gradient(90deg, #22c55e, #16a34a)"
                        : "linear-gradient(90deg, var(--accent-1), var(--accent-2))",
                    }}></div>
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 6, textAlign: "center" }}>
                    {goalProgress.percentage >= 100
                      ? (locale === "de" ? "🎉 Ziel erreicht!" : "🎉 Goal reached!")
                      : `${Math.round(goalProgress.percentage)}%`
                    }
                  </div>
                </div>
              ) : goalState === null && user.total_sessions >= 1 ? (
                <Link href="/" className="info-card" style={{ display: "block", padding: "1rem", textAlign: "center", marginBottom: "1.5rem", textDecoration: "none", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                  🎯 {t("goal.set_goal")} →
                </Link>
              ) : null}

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

              {/* Referral Card */}
              <div className="info-card" style={{ padding: "1rem", marginTop: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <h2 style={{ fontSize: "1rem", fontWeight: 700, margin: 0 }}>
                    🎁 {isDE ? "Freunde werben" : "Refer Friends"}
                  </h2>
                  <span style={{ fontSize: "0.75rem", color: "var(--accent-1)", fontWeight: 600 }}>
                    +50 Credits
                  </span>
                </div>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: "0 0 0.75rem", lineHeight: 1.5 }}>
                  {isDE
                    ? "Teile deinen Referral-Link. Dein Freund bekommt 25 Credits, du 50. Credits schalten Premium-Strecken frei."
                    : "Share your referral link. Your friend gets 25 Credits, you get 50. Credits unlock premium routes."
                  }
                </p>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <div style={{
                    flex: 1, padding: "0.5rem 0.75rem", borderRadius: 8,
                    background: "var(--bg)", border: "1px solid var(--border)",
                    fontSize: "0.8rem", color: "var(--text-muted)", overflow: "hidden",
                    textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    cyclerun.app?ref={user.referral_code}
                  </div>
                  <button onClick={handleCopyReferral} className="btn-primary" style={{ padding: "0.5rem 1rem", fontSize: "0.8rem", whiteSpace: "nowrap" }}>
                    {referralCopied ? "✓" : (isDE ? "Kopieren" : "Copy")}
                  </button>
                </div>
                {referralCount > 0 && (
                  <div style={{ fontSize: "0.75rem", color: "var(--accent-1)", marginTop: "0.5rem", textAlign: "center" }}>
                    {isDE ? `${referralCount} Freund${referralCount > 1 ? "e" : ""} geworben — ${referralCount * 50} Credits verdient` : `${referralCount} friend${referralCount > 1 ? "s" : ""} referred — ${referralCount * 50} Credits earned`}
                  </div>
                )}
              </div>

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
