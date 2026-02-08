"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useLocale } from "@/lib/useLocale";
import { t } from "@/lib/i18n";
import SubpageNav from "@/components/SubpageNav";
import SubpageFooter from "@/components/SubpageFooter";
import { getSupabase } from "@/lib/supabase";

interface StoreRoute {
  id: string;
  title: string;
  title_de: string | null;
  description: string;
  description_de: string | null;
  highlights: string | null;
  highlights_de: string | null;
  video_url: string;
  thumbnail_url: string | null;
  distance_km: number | null;
  elevation_m: number | null;
  duration_minutes: number | null;
  difficulty: string | null;
  country: string | null;
  region: string | null;
  price_credits: number;
  total_purchases: number;
  avg_rating: number | null;
  creator_id: string;
  published_at: string;
}

interface CreatorInfo {
  nickname: string | null;
  display_name: string | null;
  first_name: string;
  avatar_url: string | null;
  slug: string | null;
}

const DIFF_COLORS: Record<string, string> = {
  easy: "#22c55e",
  moderate: "#f59e0b",
  hard: "#ef4444",
  extreme: "#dc2626",
};

const DIFF_LABELS: Record<string, { en: string; de: string }> = {
  easy: { en: "Easy", de: "Leicht" },
  moderate: { en: "Moderate", de: "Mittel" },
  hard: { en: "Hard", de: "Schwer" },
  extreme: { en: "Extreme", de: "Extrem" },
};

export default function StoreContent() {
  const locale = useLocale();
  const isDE = locale === "de";
  const [routes, setRoutes] = useState<(StoreRoute & { creator?: CreatorInfo })[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [myPurchasedIds, setMyPurchasedIds] = useState<Set<string>>(new Set());
  const [myCredits, setMyCredits] = useState<number | null>(null);

  const loadStore = useCallback(async () => {
    const sb = getSupabase();
    if (!sb) { setLoading(false); return; }

    const { data: routesData } = await sb
      .from("creator_routes")
      .select("id, title, title_de, description, description_de, highlights, highlights_de, video_url, thumbnail_url, distance_km, elevation_m, duration_minutes, difficulty, country, region, price_credits, total_purchases, avg_rating, creator_id, published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false });

    const storeRoutes = (routesData || []) as StoreRoute[];

    // Fetch creator info for each unique creator
    const creatorIds = [...new Set(storeRoutes.map(r => r.creator_id))];
    const creatorMap: Record<string, CreatorInfo> = {};
    if (creatorIds.length > 0) {
      const { data: creators } = await sb
        .from("registrations")
        .select("id, nickname, display_name, first_name, avatar_url, slug")
        .in("id", creatorIds);
      for (const c of (creators || [])) {
        creatorMap[c.id] = c as CreatorInfo;
      }
    }

    setRoutes(storeRoutes.map(r => ({ ...r, creator: creatorMap[r.creator_id] })));

    // Check user's purchases + credits
    const email = typeof window !== "undefined" ? localStorage.getItem("cyclerun_email") : null;
    if (email) {
      const { data: userData } = await sb.from("registrations").select("id, credits").eq("email", email).single();
      if (userData) {
        setMyCredits(userData.credits);
        const { data: purchases } = await sb.from("route_purchases").select("route_id").eq("buyer_id", userData.id);
        setMyPurchasedIds(new Set((purchases || []).map((p: { route_id: string }) => p.route_id)));
      }
    }

    setLoading(false);
  }, []);

  useEffect(() => { loadStore(); }, [loadStore]);

  const difficulties = ["all", "easy", "moderate", "hard", "extreme"];
  const filtered = filter === "all" ? routes : routes.filter(r => r.difficulty === filter);

  return (
    <div className="creator-page">
      <SubpageNav rightLabel={isDE ? "Creator Dashboard" : "Creator Dashboard"} rightHref="/creator/dashboard" />

      <section className="creator-hero" style={{ paddingBottom: "2rem" }}>
        <div className="creator-hero-inner" style={{ maxWidth: 900 }}>
          <span className="creator-badge-label">🏪 {isDE ? "Strecken-Store" : "Route Store"}</span>
          <h1 className="creator-hero-h1" style={{ fontSize: "2.2rem", marginBottom: "0.25rem" }}>
            {isDE ? "Strecken-Store" : "Route Store"}
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1rem", maxWidth: 520, margin: "0 auto 1.5rem" }}>
            {isDE
              ? "Entdecke POV-Cycling-Strecken von der Community. Schalte Premium-Routen mit Credits frei."
              : "Discover POV cycling routes from the community. Unlock premium routes with Credits."
            }
          </p>

          {myCredits !== null && (
            <div style={{ textAlign: "center", marginBottom: "1rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>
              🪙 {myCredits} Credits {isDE ? "verfügbar" : "available"}
              {" · "}
              <Link href="/profile" style={{ color: "var(--accent-1)" }}>{isDE ? "Mehr verdienen" : "Earn more"}</Link>
            </div>
          )}

          {/* Difficulty Filter */}
          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "1.5rem" }}>
            {difficulties.map(d => (
              <button
                key={d}
                onClick={() => setFilter(d)}
                className={filter === d ? "btn-primary" : "btn-ghost"}
                style={{ padding: "0.3rem 0.8rem", fontSize: "0.8rem", borderRadius: 20 }}
              >
                {d === "all" ? (isDE ? "Alle" : "All") : (isDE ? DIFF_LABELS[d]?.de : DIFF_LABELS[d]?.en)}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "4rem 0" }}>
              <div className="loading-spinner" style={{ margin: "0 auto" }}></div>
            </div>
          ) : filtered.length === 0 ? (
            <>
              {/* Coming Soon section */}
              <div style={{ textAlign: "center", padding: "1.5rem 0 1rem" }}>
                <span style={{
                  display: "inline-block", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase",
                  letterSpacing: "0.08em", color: "var(--accent-1)",
                  background: "rgba(249,115,22,0.1)", padding: "0.25rem 0.75rem", borderRadius: 20,
                }}>
                  {isDE ? "Demnächst verfügbar" : "Coming Soon"}
                </span>
                <h2 style={{ fontSize: "1.3rem", fontWeight: 800, marginTop: "0.75rem", marginBottom: "0.25rem" }}>
                  {isDE ? "Die ersten Strecken kommen bald" : "First routes launching soon"}
                </h2>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", maxWidth: 440, margin: "0 auto" }}>
                  {isDE
                    ? "Wir kuratieren gerade die ersten POV-Cycling-Strecken. Sei unter den Ersten, die sie fahren."
                    : "We're curating the first POV cycling routes. Be among the first to ride them."}
                </p>
              </div>

              {/* Preview cards — upcoming routes (placeholder) */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem", marginTop: "1rem" }}>
                {[
                  { emoji: "🏔️", title: isDE ? "Alpen-Klassiker" : "Alpine Classic", region: isDE ? "Schweiz" : "Switzerland", diff: "hard", km: 42, elev: 1200 },
                  { emoji: "🌊", title: isDE ? "Küstenstraße" : "Coastal Highway", region: isDE ? "Mittelmeer" : "Mediterranean", diff: "moderate", km: 28, elev: 320 },
                  { emoji: "🌿", title: isDE ? "Weinberg-Tour" : "Vineyard Tour", region: isDE ? "Toskana" : "Tuscany", diff: "easy", km: 18, elev: 180 },
                ].map((preview, i) => (
                  <div key={i} className="info-card" style={{ padding: 0, overflow: "hidden", opacity: 0.6, position: "relative" }}>
                    <div style={{
                      paddingBottom: "56.25%", position: "relative",
                      background: `linear-gradient(135deg, rgba(249,115,22,${0.04 + i * 0.02}), rgba(0,0,0,0.3))`,
                    }}>
                      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem" }}>
                        {preview.emoji}
                      </div>
                      <span style={{
                        position: "absolute", top: 8, left: 8, fontSize: "0.6rem", fontWeight: 700,
                        textTransform: "uppercase", color: "#fff",
                        background: DIFF_COLORS[preview.diff] || "#666",
                        padding: "0.15rem 0.5rem", borderRadius: 4,
                      }}>
                        {isDE ? DIFF_LABELS[preview.diff]?.de : DIFF_LABELS[preview.diff]?.en}
                      </span>
                      <span style={{
                        position: "absolute", top: 8, right: 8, fontSize: "0.65rem", fontWeight: 700,
                        color: "var(--accent-1)", background: "rgba(0,0,0,0.7)", padding: "0.2rem 0.5rem", borderRadius: 4,
                      }}>
                        Coming Soon
                      </span>
                    </div>
                    <div style={{ padding: "0.75rem" }}>
                      <div style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: "0.25rem" }}>{preview.title}</div>
                      <div style={{ display: "flex", gap: "0.5rem", fontSize: "0.7rem", color: "var(--text-muted)" }}>
                        <span>📏 {preview.km} km</span>
                        <span>⛰️ {preview.elev} m</span>
                        <span>📍 {preview.region}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Notify me CTA */}
              <div className="info-card" style={{ padding: "1.25rem", marginTop: "1.5rem", textAlign: "center" }}>
                <p style={{ fontSize: "0.9rem", fontWeight: 600, marginBottom: "0.5rem" }}>
                  {isDE ? "Benachrichtigt werden, wenn's losgeht?" : "Want to know when routes go live?"}
                </p>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.75rem" }}>
                  {isDE
                    ? "Melde dich für den Newsletter an und erfahre als Erster von neuen Strecken."
                    : "Subscribe to the newsletter and be the first to know about new routes."}
                </p>
                <Link href="/#newsletter" className="btn-primary" style={{ fontSize: "0.85rem", padding: "0.5rem 1.25rem" }}>
                  {isDE ? "Newsletter abonnieren" : "Subscribe to newsletter"}
                </Link>
              </div>
            </>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
              {filtered.map((route) => {
                const purchased = myPurchasedIds.has(route.id);
                const creatorName = route.creator?.nickname || route.creator?.display_name || route.creator?.first_name || "Creator";
                return (
                  <Link
                    key={route.id}
                    href={`/store/${route.id}`}
                    className="info-card"
                    style={{ padding: 0, overflow: "hidden", textDecoration: "none", color: "inherit", display: "block", transition: "transform 0.2s" }}
                  >
                    {/* Thumbnail */}
                    <div style={{ position: "relative", paddingBottom: "56.25%", background: "var(--border)" }}>
                      {route.thumbnail_url ? (
                        <img src={route.thumbnail_url} alt={isDE ? (route.title_de || route.title) : route.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem" }}>🎬</div>
                      )}
                      {/* Difficulty badge */}
                      {route.difficulty && (
                        <span style={{
                          position: "absolute", top: 8, left: 8, fontSize: "0.6rem", fontWeight: 700,
                          textTransform: "uppercase", color: "#fff", background: DIFF_COLORS[route.difficulty] || "#666",
                          padding: "0.15rem 0.5rem", borderRadius: 4, letterSpacing: "0.03em",
                        }}>
                          {isDE ? DIFF_LABELS[route.difficulty]?.de : DIFF_LABELS[route.difficulty]?.en}
                        </span>
                      )}
                      {/* Price badge */}
                      <span style={{
                        position: "absolute", top: 8, right: 8, fontSize: "0.7rem", fontWeight: 700,
                        color: purchased ? "#22c55e" : route.price_credits === 0 ? "#22c55e" : "var(--accent-1)",
                        background: "rgba(0,0,0,0.7)", padding: "0.2rem 0.5rem", borderRadius: 4,
                      }}>
                        {purchased ? "✓ " + (isDE ? "Freigeschaltet" : "Unlocked") : route.price_credits === 0 ? (isDE ? "Kostenlos" : "Free") : `🪙 ${route.price_credits}`}
                      </span>
                    </div>

                    {/* Info */}
                    <div style={{ padding: "0.75rem" }}>
                      <div style={{ fontWeight: 700, fontSize: "0.9rem", lineHeight: 1.3, marginBottom: "0.25rem" }}>
                        {isDE ? (route.title_de || route.title) : route.title}
                      </div>
                      {/* Meta row */}
                      <div style={{ display: "flex", gap: "0.5rem", fontSize: "0.7rem", color: "var(--text-muted)", flexWrap: "wrap", marginBottom: "0.5rem" }}>
                        {route.distance_km && <span>📏 {route.distance_km} km</span>}
                        {route.elevation_m && <span>⛰️ {route.elevation_m} m</span>}
                        {route.duration_minutes && <span>⏱️ {route.duration_minutes} min</span>}
                        {route.country && <span>📍 {route.region ? `${route.region}, ` : ""}{route.country}</span>}
                      </div>
                      {/* Creator */}
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        {route.creator?.avatar_url ? (
                          <img src={route.creator.avatar_url} alt="" style={{ width: 18, height: 18, borderRadius: "50%", objectFit: "cover" }} />
                        ) : (
                          <span>🎬</span>
                        )}
                        <span>{creatorName}</span>
                        {route.total_purchases > 0 && <span style={{ marginLeft: "auto" }}>📦 {route.total_purchases}</span>}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Become Creator CTA */}
          <div className="info-card" style={{ padding: "1.25rem", marginTop: "2rem", textAlign: "center" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.25rem" }}>
              🎬 {isDE ? "Du filmst Cycling-Videos?" : "Do you film cycling videos?"}
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: "0 0 0.75rem" }}>
              {isDE ? "Lade deine Strecken hoch und verdiene 70% an jedem Verkauf." : "Upload your routes and earn 70% on every sale."}
            </p>
            <Link href="/creator/dashboard" className="btn-primary">{isDE ? "Creator werden" : "Become a Creator"}</Link>
          </div>

          {/* Legal */}
          <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textAlign: "center", marginTop: "1.5rem", lineHeight: 1.5 }}>
            {isDE
              ? "Alle Streckenvideos sind nutzergenerierte Inhalte. CycleRun ist eine Plattform und übernimmt keine Verantwortung für die Richtigkeit oder Qualität der Inhalte."
              : "All route videos are user-generated content. CycleRun is a platform and assumes no responsibility for the accuracy or quality of content."
            }
          </div>
        </div>
      </section>

      <SubpageFooter />
    </div>
  );
}
