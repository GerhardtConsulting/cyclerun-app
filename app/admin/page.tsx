"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Overview {
  totalRegistrations: number;
  totalSessions: number;
  totalDistanceKm: number;
  totalDurationHours: number;
  avgSpeedKmh: number;
  newsletterConfirmed: number;
  newsletterPending: number;
  newsletterUnsubscribed: number;
  waitlistCount: number;
  creatorsTotal: number;
  creatorsVerified: number;
}

interface RecentRegistration {
  id: string;
  first_name: string;
  email: string;
  created_at: string;
  locale: string;
}

interface RecentSession {
  id: string;
  distance_km: number;
  duration_seconds: number;
  avg_speed_kmh: number;
  created_at: string;
  sport_type: string;
}

interface TopRider {
  id: string;
  first_name: string;
  display_name: string;
  email: string;
  total_distance_km: number;
  total_sessions: number;
  total_duration_seconds: number;
}

interface DashboardData {
  overview: Overview;
  charts: {
    dailyRegistrations: Record<string, number>;
    dailySessions: Record<string, number>;
    localeDistribution: Record<string, number>;
  };
  recentRegistrations: RecentRegistration[];
  recentSessions: RecentSession[];
  topRiders: TopRider[];
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function AdminDashboard() {
  const [key, setKey] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(false);

  const fetchStats = useCallback(async (adminKey: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/stats?key=${encodeURIComponent(adminKey)}`);
      if (!res.ok) {
        if (res.status === 401) throw new Error("Invalid admin key");
        throw new Error("Failed to fetch stats");
      }
      const json = await res.json();
      setData(json);
      setAuthenticated(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? sessionStorage.getItem("admin_key") : null;
    if (saved) {
      setKey(saved);
      fetchStats(saved);
    }
  }, [fetchStats]);

  useEffect(() => {
    if (!autoRefresh || !authenticated || !key) return;
    const interval = setInterval(() => fetchStats(key), 30000);
    return () => clearInterval(interval);
  }, [autoRefresh, authenticated, key, fetchStats]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem("admin_key", key);
    fetchStats(key);
  };

  if (!authenticated) {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0b", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" }}>
        <form onSubmit={handleLogin} style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "2.5rem", maxWidth: 380, width: "100%" }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <span style={{ color: "#fafaf9", fontWeight: 800, fontSize: "1.5rem" }}>cyclerun</span>
            <span style={{ color: "#f97316", fontWeight: 800, fontSize: "1.5rem" }}>.app</span>
            <span style={{ color: "#78716c", fontSize: "0.85rem", marginLeft: 8 }}>admin</span>
          </div>
          <label style={{ display: "block", color: "#a8a29e", fontSize: "0.85rem", marginBottom: 6 }}>Admin Key</label>
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Enter admin secret..."
            style={{ width: "100%", padding: "0.7rem 1rem", background: "#0a0a0b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fafaf9", fontSize: "0.95rem", outline: "none", marginBottom: "1rem" }}
          />
          {error && <p style={{ color: "#ef4444", fontSize: "0.82rem", marginBottom: "0.75rem" }}>{error}</p>}
          <button type="submit" disabled={loading} style={{ width: "100%", padding: "0.7rem", background: "linear-gradient(135deg, #f97316, #ea580c)", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: "0.92rem" }}>
            {loading ? "Loading..." : "Access Dashboard"}
          </button>
        </form>
      </div>
    );
  }

  if (!data) return null;

  const { overview: o, charts, recentRegistrations, recentSessions, topRiders } = data;
  const dailyRegDays = Object.keys(charts.dailyRegistrations);
  const maxDailyReg = Math.max(...Object.values(charts.dailyRegistrations), 1);
  const maxDailySes = Math.max(...Object.values(charts.dailySessions), 1);

  return (
    <div className="admin-page">
      <style>{`
        .admin-page { min-height: 100vh; background: #0a0a0b; color: #fafaf9; font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif; padding: 1.5rem; }
        .admin-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem; }
        .admin-logo span { font-weight: 800; font-size: 1.3rem; }
        .admin-logo .app { color: #f97316; }
        .admin-badge { font-size: 0.72rem; background: rgba(249,115,22,0.1); color: #f97316; padding: 0.2rem 0.6rem; border-radius: 6px; font-weight: 600; margin-left: 8px; }
        .admin-actions { display: flex; gap: 0.5rem; align-items: center; }
        .admin-btn { padding: 0.4rem 0.75rem; border-radius: 6px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); color: #a8a29e; font-size: 0.78rem; cursor: pointer; }
        .admin-btn:hover { border-color: #f97316; color: #f97316; }
        .admin-btn.active { border-color: #22c55e; color: #22c55e; }
        .stat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 0.75rem; margin-bottom: 2rem; }
        .stat-card { background: #141414; border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 1.25rem; }
        .stat-label { font-size: 0.72rem; color: #78716c; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; }
        .stat-value { font-size: 1.75rem; font-weight: 800; margin-top: 0.35rem; color: #fafaf9; }
        .stat-value.accent { color: #f97316; }
        .stat-value.green { color: #22c55e; }
        .section-title { font-size: 1rem; font-weight: 700; margin-bottom: 1rem; color: #fafaf9; }
        .chart-row { display: flex; align-items: flex-end; gap: 3px; height: 80px; margin-bottom: 0.5rem; }
        .chart-bar { flex: 1; background: linear-gradient(to top, #f97316, rgba(249,115,22,0.3)); border-radius: 3px 3px 0 0; min-width: 8px; transition: height 0.3s; position: relative; }
        .chart-bar.sessions { background: linear-gradient(to top, #3b82f6, rgba(59,130,246,0.3)); }
        .chart-labels { display: flex; gap: 3px; }
        .chart-labels span { flex: 1; font-size: 0.55rem; color: #57534e; text-align: center; min-width: 8px; }
        .table-wrapper { overflow-x: auto; margin-bottom: 2rem; }
        table { width: 100%; border-collapse: collapse; font-size: 0.82rem; }
        th { text-align: left; color: #78716c; font-weight: 600; padding: 0.5rem 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.04em; }
        td { padding: 0.5rem 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.03); color: #d6d3d1; }
        tr:hover td { background: rgba(255,255,255,0.02); }
        .locale-badge { font-size: 0.7rem; padding: 0.15rem 0.4rem; border-radius: 4px; font-weight: 600; }
        .locale-de { background: rgba(59,130,246,0.12); color: #60a5fa; }
        .locale-en { background: rgba(34,197,94,0.12); color: #4ade80; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 2rem; }
        @media (max-width: 768px) { .grid-2 { grid-template-columns: 1fr; } .stat-grid { grid-template-columns: repeat(2, 1fr); } }
      `}</style>

      <header className="admin-header">
        <div style={{ display: "flex", alignItems: "center" }}>
          <Link href="/" className="admin-logo" style={{ textDecoration: "none" }}>
            <span style={{ color: "#fafaf9" }}>cyclerun</span><span className="app">.app</span>
          </Link>
          <span className="admin-badge">Admin Dashboard</span>
        </div>
        <div className="admin-actions">
          <button className={`admin-btn ${autoRefresh ? "active" : ""}`} onClick={() => setAutoRefresh(!autoRefresh)}>
            {autoRefresh ? "● Live (30s)" : "○ Auto-refresh"}
          </button>
          <button className="admin-btn" onClick={() => fetchStats(key)}>↻ Refresh</button>
          <button className="admin-btn" onClick={() => { sessionStorage.removeItem("admin_key"); setAuthenticated(false); setData(null); }}>Logout</button>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Registrations</div>
          <div className="stat-value accent">{o.totalRegistrations}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Sessions</div>
          <div className="stat-value">{o.totalSessions}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Distance</div>
          <div className="stat-value">{o.totalDistanceKm} km</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Ride Time</div>
          <div className="stat-value">{o.totalDurationHours} h</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg Speed</div>
          <div className="stat-value">{o.avgSpeedKmh} km/h</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Newsletter (confirmed)</div>
          <div className="stat-value green">{o.newsletterConfirmed}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Newsletter (pending)</div>
          <div className="stat-value">{o.newsletterPending}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Unsubscribed</div>
          <div className="stat-value" style={{ color: "#ef4444" }}>{o.newsletterUnsubscribed}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Waitlist (Running)</div>
          <div className="stat-value">{o.waitlistCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Creators</div>
          <div className="stat-value">{o.creatorsTotal} <span style={{ fontSize: "0.85rem", color: "#22c55e" }}>({o.creatorsVerified} verified)</span></div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid-2">
        <div>
          <div className="section-title">Registrations (14 days)</div>
          <div className="chart-row">
            {dailyRegDays.map((day) => (
              <div key={day} className="chart-bar" style={{ height: `${(charts.dailyRegistrations[day] / maxDailyReg) * 100}%` }} title={`${day}: ${charts.dailyRegistrations[day]}`} />
            ))}
          </div>
          <div className="chart-labels">
            {dailyRegDays.map((day) => (
              <span key={day}>{day.slice(8)}</span>
            ))}
          </div>
        </div>
        <div>
          <div className="section-title">Sessions (14 days)</div>
          <div className="chart-row">
            {dailyRegDays.map((day) => (
              <div key={day} className="chart-bar sessions" style={{ height: `${(charts.dailySessions[day] / maxDailySes) * 100}%` }} title={`${day}: ${charts.dailySessions[day]}`} />
            ))}
          </div>
          <div className="chart-labels">
            {dailyRegDays.map((day) => (
              <span key={day}>{day.slice(8)}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Locale Distribution */}
      {Object.keys(charts.localeDistribution).length > 0 && (
        <div style={{ marginBottom: "2rem" }}>
          <div className="section-title">Language Distribution</div>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {Object.entries(charts.localeDistribution).map(([loc, count]) => (
              <span key={loc} className={`locale-badge ${loc === "de" ? "locale-de" : "locale-en"}`}>
                {loc.toUpperCase()}: {count}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recent Registrations */}
      <div className="section-title">Recent Registrations</div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr><th>Name</th><th>Email</th><th>Locale</th><th>When</th></tr>
          </thead>
          <tbody>
            {recentRegistrations.length === 0 ? (
              <tr><td colSpan={4} style={{ textAlign: "center", color: "#57534e" }}>No registrations yet</td></tr>
            ) : recentRegistrations.map((r) => (
              <tr key={r.id}>
                <td>{r.first_name || "—"}</td>
                <td style={{ color: "#78716c" }}>{r.email}</td>
                <td><span className={`locale-badge ${r.locale === "de" ? "locale-de" : "locale-en"}`}>{(r.locale || "en").toUpperCase()}</span></td>
                <td style={{ color: "#57534e" }}>{timeAgo(r.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recent Sessions */}
      <div className="section-title">Recent Sessions</div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr><th>Sport</th><th>Distance</th><th>Duration</th><th>Avg Speed</th><th>When</th></tr>
          </thead>
          <tbody>
            {recentSessions.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: "center", color: "#57534e" }}>No sessions yet</td></tr>
            ) : recentSessions.map((s) => (
              <tr key={s.id}>
                <td>{s.sport_type === "cycling" ? "🚴" : "🏃"} {s.sport_type}</td>
                <td>{Number(s.distance_km).toFixed(1)} km</td>
                <td>{formatDuration(s.duration_seconds)}</td>
                <td>{Number(s.avg_speed_kmh).toFixed(1)} km/h</td>
                <td style={{ color: "#57534e" }}>{timeAgo(s.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Top Riders */}
      <div className="section-title">Top Riders (by distance)</div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr><th>#</th><th>Name</th><th>Email</th><th>Distance</th><th>Sessions</th><th>Time</th></tr>
          </thead>
          <tbody>
            {topRiders.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: "center", color: "#57534e" }}>No riders yet</td></tr>
            ) : topRiders.map((r, i) => (
              <tr key={r.id}>
                <td style={{ color: i < 3 ? "#f97316" : "#57534e", fontWeight: i < 3 ? 700 : 400 }}>{i + 1}</td>
                <td>{r.display_name || r.first_name || "—"}</td>
                <td style={{ color: "#78716c" }}>{r.email}</td>
                <td style={{ fontWeight: 600 }}>{Number(r.total_distance_km).toFixed(1)} km</td>
                <td>{r.total_sessions}</td>
                <td>{formatDuration(r.total_duration_seconds || 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ textAlign: "center", padding: "2rem 0", color: "#57534e", fontSize: "0.75rem" }}>
        cyclerun.app admin · data from Supabase · {new Date().toLocaleString()}
      </div>
    </div>
  );
}
