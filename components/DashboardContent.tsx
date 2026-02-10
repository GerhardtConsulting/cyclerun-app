"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useLocale } from "@/lib/useLocale";
import { t } from "@/lib/i18n";
import SubpageNav from "@/components/SubpageNav";
import SubpageFooter from "@/components/SubpageFooter";
import { getSupabase } from "@/lib/supabase";

interface Session {
  id: string;
  created_at: string;
  sport_type: string;
  duration_seconds: number;
  distance_km: number;
  avg_speed_kmh: number;
  max_speed_kmh: number;
  avg_rpm: number;
  calories_estimated: number;
  gear: number;
  time_series?: { t: number; speed: number; rpm: number }[];
}

interface UserStats {
  total_sessions: number;
  total_distance_km: number;
  total_duration_seconds: number;
  total_energy: number;
  level: number;
  current_streak: number;
  longest_streak: number;
  first_name: string;
  email: string;
  email_confirmed: boolean;
}

interface WeeklyData {
  day: string;
  distance: number;
  duration: number;
  sessions: number;
}

const LEVEL_NAMES = ["Beginner", "Rookie", "Regular", "Enthusiast", "Athlete", "Pro", "Elite", "Legend"];

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function formatDate(dateStr: string, locale: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString(locale === "de" ? "de-DE" : "en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getWeekDays(locale: string): string[] {
  const days = locale === "de" 
    ? ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"]
    : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days;
}

export default function DashboardContent() {
  const locale = useLocale();
  const isDE = locale === "de";
  
  const [loading, setLoading] = useState(true);
  const [notRegistered, setNotRegistered] = useState(false);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState("");

  const loadDashboard = useCallback(async () => {
    const email = typeof window !== "undefined" ? localStorage.getItem("cyclerun_email") : null;
    if (!email) {
      setNotRegistered(true);
      setLoading(false);
      return;
    }

    const sb = getSupabase();
    if (!sb) { setLoading(false); return; }

    // Fetch user stats
    const { data: userData } = await sb
      .from("registrations")
      .select("id, first_name, email, email_confirmed, total_sessions, total_distance_km, total_duration_seconds, total_energy, level, current_streak, longest_streak")
      .eq("email", email)
      .single();

    if (!userData) {
      setNotRegistered(true);
      setLoading(false);
      return;
    }

    setStats(userData as UserStats);

    // Fetch recent sessions
    const { data: sessionsData } = await sb
      .from("sessions")
      .select("*")
      .eq("user_id", userData.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (sessionsData) {
      setSessions(sessionsData as Session[]);
    }

    // Calculate weekly data
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1));
    weekStart.setHours(0, 0, 0, 0);

    const weekly: WeeklyData[] = getWeekDays(locale).map((day) => ({
      day,
      distance: 0,
      duration: 0,
      sessions: 0,
    }));

    if (sessionsData) {
      sessionsData.forEach((session: Session) => {
        const sessionDate = new Date(session.created_at);
        if (sessionDate >= weekStart) {
          let dayIndex = sessionDate.getDay() - 1;
          if (dayIndex < 0) dayIndex = 6;
          weekly[dayIndex].distance += session.distance_km;
          weekly[dayIndex].duration += session.duration_seconds;
          weekly[dayIndex].sessions += 1;
        }
      });
    }

    setWeeklyData(weekly);
    setLoading(false);
  }, [locale]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  if (loading) {
    return (
      <div className="subpage">
        <SubpageNav />
        <main className="subpage-main" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
          <div className="loading-spinner" />
        </main>
        <SubpageFooter />
      </div>
    );
  }

  if (notRegistered) {
    return (
      <div className="subpage">
        <SubpageNav />
        <main className="subpage-main" style={{ textAlign: "center", padding: "4rem 1rem" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "1rem" }}>
            {isDE ? "Dashboard" : "Dashboard"}
          </h1>
          <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>
            {isDE ? "Melde dich an, um dein Dashboard zu sehen." : "Sign in to view your dashboard."}
          </p>
          <Link href="/" className="btn-primary btn-lg">
            {isDE ? "Jetzt starten" : "Get Started"}
          </Link>
        </main>
        <SubpageFooter />
      </div>
    );
  }

  const maxWeeklyDistance = Math.max(...weeklyData.map(d => d.distance), 1);

  return (
    <div className="subpage">
      <SubpageNav />
      <main className="subpage-main">
        <div className="dashboard-container">
          
          {/* Header */}
          <div className="dashboard-header">
            <div>
              <h1 className="dashboard-title">
                {isDE ? `Hallo, ${stats?.first_name}!` : `Hello, ${stats?.first_name}!`}
              </h1>
              <p className="dashboard-subtitle">
                {isDE ? "Dein persönliches Training-Dashboard" : "Your personal training dashboard"}
              </p>
            </div>
            <Link href="/" className="btn-primary">
              {isDE ? "Neue Fahrt" : "New Ride"}
            </Link>
          </div>

          {/* DOIP Warning Banner — DSGVO-compliant email confirmation reminder */}
          {stats && !stats.email_confirmed && (
            <div style={{
              background: "linear-gradient(135deg, rgba(251,191,36,0.1), rgba(245,158,11,0.05))",
              border: "1px solid rgba(251,191,36,0.25)",
              borderRadius: 14, padding: "1rem 1.25rem", marginBottom: "1.5rem",
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                <span style={{ fontSize: "1.25rem" }}>⚠️</span>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: "0.25rem", color: "#fbbf24" }}>
                    {t("doip.title")}
                  </h3>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.5, marginBottom: "0.5rem" }}>
                    {t("doip.text")}
                  </p>
                  {resendSuccess ? (
                    <div style={{ fontSize: "0.8rem", color: "#22c55e" }}>
                      ✓ {t("doip.sent")} {t("doip.check")}
                    </div>
                  ) : resendError ? (
                    <div style={{ fontSize: "0.8rem", color: "#ef4444", marginBottom: "0.35rem" }}>
                      {t("doip.error")}
                    </div>
                  ) : null}
                  <button
                    className="btn-primary"
                    style={{ padding: "0.4rem 0.85rem", fontSize: "0.75rem" }}
                    disabled={resendingEmail || resendSuccess}
                    onClick={async () => {
                      if (!stats.email) return;
                      setResendingEmail(true);
                      setResendError("");
                      try {
                        const res = await fetch("/api/resend-confirmation", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ email: stats.email }),
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

          {/* Stats Overview - Bento Grid */}
          <div className="dashboard-bento">
            <div className="bento-card bento-large">
              <div className="bento-icon">🔥</div>
              <div className="bento-value">{stats?.current_streak || 0}</div>
              <div className="bento-label">{isDE ? "Tage Streak" : "Day Streak"}</div>
              <div className="bento-sub">
                {isDE ? `Längste: ${stats?.longest_streak || 0} Tage` : `Longest: ${stats?.longest_streak || 0} days`}
              </div>
            </div>

            <div className="bento-card">
              <div className="bento-icon">⚡</div>
              <div className="bento-value">{(stats?.total_energy || 0).toLocaleString()}</div>
              <div className="bento-label">Energy</div>
            </div>

            <div className="bento-card">
              <div className="bento-icon">🚴</div>
              <div className="bento-value">{stats?.total_sessions || 0}</div>
              <div className="bento-label">{isDE ? "Fahrten" : "Rides"}</div>
            </div>

            <div className="bento-card">
              <div className="bento-icon">📏</div>
              <div className="bento-value">{(stats?.total_distance_km || 0).toFixed(1)}</div>
              <div className="bento-label">km</div>
            </div>

            <div className="bento-card">
              <div className="bento-icon">⏱️</div>
              <div className="bento-value">{Math.floor((stats?.total_duration_seconds || 0) / 3600)}</div>
              <div className="bento-label">{isDE ? "Stunden" : "Hours"}</div>
            </div>

            <div className="bento-card bento-accent">
              <div className="bento-level">Level {stats?.level || 1}</div>
              <div className="bento-level-name">{LEVEL_NAMES[(stats?.level || 1) - 1] || "Beginner"}</div>
            </div>
          </div>

          {/* Weekly Activity Chart */}
          <div className="dashboard-section">
            <h2 className="section-title">
              {isDE ? "Diese Woche" : "This Week"}
            </h2>
            <div className="weekly-chart">
              {weeklyData.map((day, i) => (
                <div key={i} className="weekly-bar-container">
                  <div 
                    className={`weekly-bar ${day.sessions > 0 ? "active" : ""}`}
                    style={{ height: `${Math.max((day.distance / maxWeeklyDistance) * 100, 4)}%` }}
                  >
                    {day.sessions > 0 && (
                      <span className="weekly-bar-value">{day.distance.toFixed(1)}</span>
                    )}
                  </div>
                  <span className="weekly-bar-label">{day.day}</span>
                </div>
              ))}
            </div>
            <div className="weekly-summary">
              <div className="weekly-stat">
                <span className="weekly-stat-value">
                  {weeklyData.reduce((sum, d) => sum + d.distance, 0).toFixed(1)} km
                </span>
                <span className="weekly-stat-label">{isDE ? "Diese Woche" : "This week"}</span>
              </div>
              <div className="weekly-stat">
                <span className="weekly-stat-value">
                  {weeklyData.reduce((sum, d) => sum + d.sessions, 0)}
                </span>
                <span className="weekly-stat-label">{isDE ? "Fahrten" : "Rides"}</span>
              </div>
            </div>
          </div>

          {/* Recent Rides */}
          <div className="dashboard-section">
            <h2 className="section-title">
              {isDE ? "Letzte Fahrten" : "Recent Rides"}
            </h2>
            
            {sessions.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🚴</div>
                <p>{isDE ? "Noch keine Fahrten aufgezeichnet" : "No rides recorded yet"}</p>
                <Link href="/" className="btn-primary" style={{ marginTop: "1rem" }}>
                  {isDE ? "Erste Fahrt starten" : "Start your first ride"}
                </Link>
              </div>
            ) : (
              <div className="rides-list">
                {sessions.map((session) => (
                  <div 
                    key={session.id} 
                    className={`ride-card ${selectedSession?.id === session.id ? "selected" : ""}`}
                    onClick={() => setSelectedSession(selectedSession?.id === session.id ? null : session)}
                  >
                    <div className="ride-card-header">
                      <div className="ride-sport-icon">
                        {session.sport_type === "running" ? "🏃" : "🚴"}
                      </div>
                      <div className="ride-info">
                        <div className="ride-title">
                          {session.sport_type === "running" 
                            ? (isDE ? "Lauf" : "Run") 
                            : (isDE ? "Radfahrt" : "Cycling")}
                        </div>
                        <div className="ride-date">{formatDate(session.created_at, locale)}</div>
                      </div>
                      <div className="ride-distance">
                        <span className="ride-distance-value">{session.distance_km.toFixed(2)}</span>
                        <span className="ride-distance-unit">km</span>
                      </div>
                    </div>

                    {selectedSession?.id === session.id && (
                      <div className="ride-details">
                        <div className="ride-stats-grid">
                          <div className="ride-stat">
                            <span className="ride-stat-label">{isDE ? "Dauer" : "Duration"}</span>
                            <span className="ride-stat-value">{formatDuration(session.duration_seconds)}</span>
                          </div>
                          <div className="ride-stat">
                            <span className="ride-stat-label">{isDE ? "Ø Tempo" : "Avg Speed"}</span>
                            <span className="ride-stat-value">{session.avg_speed_kmh.toFixed(1)} km/h</span>
                          </div>
                          <div className="ride-stat">
                            <span className="ride-stat-label">{isDE ? "Max Tempo" : "Max Speed"}</span>
                            <span className="ride-stat-value">{session.max_speed_kmh.toFixed(1)} km/h</span>
                          </div>
                          <div className="ride-stat">
                            <span className="ride-stat-label">{isDE ? "Ø Kadenz" : "Avg Cadence"}</span>
                            <span className="ride-stat-value">{session.avg_rpm} rpm</span>
                          </div>
                          <div className="ride-stat">
                            <span className="ride-stat-label">{isDE ? "Kalorien" : "Calories"}</span>
                            <span className="ride-stat-value">~{session.calories_estimated} kcal</span>
                          </div>
                          <div className="ride-stat">
                            <span className="ride-stat-label">{isDE ? "Gang" : "Gear"}</span>
                            <span className="ride-stat-value">{session.gear}</span>
                          </div>
                        </div>

                        {/* Mini Chart Placeholder */}
                        <div className="ride-chart">
                          <div className="ride-chart-placeholder">
                            <svg viewBox="0 0 200 60" className="mini-chart">
                              <polyline
                                fill="none"
                                stroke="url(#chartGradient)"
                                strokeWidth="2"
                                points={generateMiniChartPoints(session)}
                              />
                              <defs>
                                <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                  <stop offset="0%" stopColor="#f97316" />
                                  <stop offset="100%" stopColor="#ea580c" />
                                </linearGradient>
                              </defs>
                            </svg>
                            <span className="chart-label">{isDE ? "Geschwindigkeit" : "Speed"}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="dashboard-actions">
            <Link href="/profile" className="action-card">
              <span className="action-icon">👤</span>
              <span className="action-label">{isDE ? "Profil" : "Profile"}</span>
            </Link>
            <Link href="/leaderboard" className="action-card">
              <span className="action-icon">🏆</span>
              <span className="action-label">{isDE ? "Rangliste" : "Leaderboard"}</span>
            </Link>
            <Link href="/store" className="action-card">
              <span className="action-icon">🗺️</span>
              <span className="action-label">{isDE ? "Routen" : "Routes"}</span>
            </Link>
            <Link href="/routes" className="action-card">
              <span className="action-icon">🎬</span>
              <span className="action-label">{isDE ? "Videos" : "Videos"}</span>
            </Link>
          </div>

        </div>
      </main>
      <SubpageFooter />
    </div>
  );
}

function generateMiniChartPoints(session: Session): string {
  // Generate a simple speed curve based on avg/max speed
  const points: string[] = [];
  const avgSpeed = session.avg_speed_kmh;
  const maxSpeed = session.max_speed_kmh;
  const numPoints = 20;
  
  for (let i = 0; i < numPoints; i++) {
    const x = (i / (numPoints - 1)) * 200;
    // Create a natural-looking curve
    const progress = i / (numPoints - 1);
    const warmup = Math.min(progress * 3, 1);
    const cooldown = Math.min((1 - progress) * 3, 1);
    const variation = Math.sin(progress * Math.PI * 3) * 0.15;
    const normalized = warmup * cooldown * (0.7 + variation);
    const speed = avgSpeed + (maxSpeed - avgSpeed) * normalized * 0.5;
    const y = 55 - (speed / Math.max(maxSpeed, 1)) * 45;
    points.push(`${x},${y}`);
  }
  
  return points.join(" ");
}
