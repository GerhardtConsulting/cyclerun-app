"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useLocale } from "@/lib/useLocale";
import { t } from "@/lib/i18n";
import SubpageNav from "@/components/SubpageNav";
import SubpageFooter from "@/components/SubpageFooter";
import { getSupabase } from "@/lib/supabase";

interface RouteDetail {
  id: string;
  creator_id: string;
  title: string;
  title_de: string | null;
  description: string;
  description_de: string | null;
  highlights: string | null;
  highlights_de: string | null;
  video_url: string;
  thumbnail_url: string | null;
  gpx_url: string | null;
  distance_km: number | null;
  elevation_m: number | null;
  duration_minutes: number | null;
  difficulty: string | null;
  country: string | null;
  region: string | null;
  price_credits: number;
  total_purchases: number;
  total_plays: number;
  avg_rating: number | null;
  published_at: string;
}

interface CreatorInfo {
  id: string;
  nickname: string | null;
  display_name: string | null;
  first_name: string;
  avatar_url: string | null;
  slug: string | null;
  is_public: boolean;
}

const DIFF_LABELS: Record<string, { en: string; de: string; color: string }> = {
  easy: { en: "Easy", de: "Leicht", color: "#22c55e" },
  moderate: { en: "Moderate", de: "Mittel", color: "#f59e0b" },
  hard: { en: "Hard", de: "Schwer", color: "#ef4444" },
  extreme: { en: "Extreme", de: "Extrem", color: "#dc2626" },
};

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

export default function StoreRouteContent({ routeId }: { routeId: string }) {
  const locale = useLocale();
  const isDE = locale === "de";
  const [route, setRoute] = useState<RouteDetail | null>(null);
  const [creator, setCreator] = useState<CreatorInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [purchased, setPurchased] = useState(false);
  const [myCredits, setMyCredits] = useState<number | null>(null);
  const [myUserId, setMyUserId] = useState<string | null>(null);
  const [buying, setBuying] = useState(false);
  const [buyError, setBuyError] = useState<string | null>(null);
  const [myRating, setMyRating] = useState<number>(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  const loadRoute = useCallback(async () => {
    const sb = getSupabase();
    if (!sb) { setLoading(false); return; }

    const { data: routeData } = await sb
      .from("creator_routes")
      .select("*")
      .eq("id", routeId)
      .eq("status", "published")
      .single();

    if (!routeData) { setNotFound(true); setLoading(false); return; }
    setRoute(routeData as RouteDetail);

    // Fetch creator
    const { data: creatorData } = await sb
      .from("registrations")
      .select("id, nickname, display_name, first_name, avatar_url, slug, is_public")
      .eq("id", routeData.creator_id)
      .single();
    if (creatorData) setCreator(creatorData as CreatorInfo);

    // Check if current user purchased
    const email = typeof window !== "undefined" ? localStorage.getItem("cyclerun_email") : null;
    if (email) {
      const { data: userData } = await sb.from("registrations").select("id, credits").eq("email", email).single();
      if (userData) {
        setMyUserId(userData.id);
        setMyCredits(userData.credits);
        const { data: purchase } = await sb.from("route_purchases").select("id").eq("buyer_id", userData.id).eq("route_id", routeId).maybeSingle();
        setPurchased(!!purchase);

        // Check existing rating
        const { data: rating } = await sb.from("route_ratings").select("rating").eq("user_id", userData.id).eq("route_id", routeId).maybeSingle();
        if (rating) { setMyRating(rating.rating); setRatingSubmitted(true); }
      }
    }

    setLoading(false);
  }, [routeId]);

  useEffect(() => { loadRoute(); }, [loadRoute]);

  const handlePurchase = async () => {
    if (!route || !myUserId) return;
    setBuying(true);
    setBuyError(null);
    const sb = getSupabase();
    if (!sb) { setBuying(false); return; }

    const { data, error } = await sb.rpc("purchase_route", {
      p_buyer_id: myUserId,
      p_route_id: route.id,
    });

    if (error) {
      setBuyError(isDE ? "Fehler beim Kauf" : "Purchase failed");
    } else if (data && !data.success) {
      if (data.error === "Insufficient credits") {
        setBuyError(isDE ? `Nicht genug Credits (${data.have}/${data.needed})` : `Not enough Credits (${data.have}/${data.needed})`);
      } else if (data.error === "Already purchased") {
        setPurchased(true);
      } else {
        setBuyError(data.error);
      }
    } else {
      setPurchased(true);
      if (data?.credits_spent) setMyCredits((c) => (c !== null ? c - data.credits_spent : c));
    }
    setBuying(false);
  };

  const handleRate = async (rating: number) => {
    if (!myUserId || !route) return;
    const sb = getSupabase();
    if (!sb) return;

    await sb.from("route_ratings").upsert({
      user_id: myUserId,
      route_id: route.id,
      rating,
    }, { onConflict: "user_id,route_id" });

    setMyRating(rating);
    setRatingSubmitted(true);
  };

  const ytId = route ? getYouTubeId(route.video_url) : null;
  const creatorName = creator?.nickname || creator?.display_name || creator?.first_name || "Creator";
  const isOwn = myUserId === route?.creator_id;
  const canRide = purchased || (route?.price_credits === 0) || isOwn;

  return (
    <div className="creator-page">
      <SubpageNav rightLabel={isDE ? "Zurück zum Store" : "Back to Store"} rightHref="/store" />

      <section className="creator-hero" style={{ paddingBottom: "2rem" }}>
        <div className="creator-hero-inner" style={{ maxWidth: 800 }}>

          {loading ? (
            <div style={{ textAlign: "center", padding: "4rem 0" }}>
              <div className="loading-spinner" style={{ margin: "0 auto" }}></div>
            </div>
          ) : notFound ? (
            <div style={{ textAlign: "center", padding: "3rem 0" }}>
              <h1 className="creator-hero-h1" style={{ fontSize: "2rem" }}>404</h1>
              <p style={{ color: "var(--text-muted)", margin: "1rem 0 2rem" }}>
                {isDE ? "Strecke nicht gefunden." : "Route not found."}
              </p>
              <Link href="/store" className="btn-primary btn-lg">{isDE ? "Zum Store" : "Browse Store"}</Link>
            </div>
          ) : route && (
            <>
              {/* Video Preview */}
              {ytId ? (
                <div style={{ position: "relative", paddingBottom: "56.25%", marginBottom: "1rem", borderRadius: 12, overflow: "hidden" }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${ytId}?rel=0`}
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : route.thumbnail_url ? (
                <img src={route.thumbnail_url} alt="" style={{ width: "100%", borderRadius: 12, marginBottom: "1rem" }} />
              ) : null}

              {/* Title + Meta */}
              <h1 style={{ fontSize: "1.8rem", fontWeight: 800, margin: "0 0 0.5rem", lineHeight: 1.3 }}>
                {isDE ? (route.title_de || route.title) : route.title}
              </h1>

              {/* Route stats row */}
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
                {route.difficulty && (
                  <span style={{ color: DIFF_LABELS[route.difficulty]?.color, fontWeight: 600 }}>
                    {isDE ? DIFF_LABELS[route.difficulty]?.de : DIFF_LABELS[route.difficulty]?.en}
                  </span>
                )}
                {route.distance_km && <span>📏 {route.distance_km} km</span>}
                {route.elevation_m && <span>⛰️ {route.elevation_m} m</span>}
                {route.duration_minutes && <span>⏱️ {route.duration_minutes} min</span>}
                {route.country && <span>📍 {route.region ? `${route.region}, ` : ""}{route.country}</span>}
                <span>📦 {route.total_purchases} {isDE ? "Käufe" : "purchases"}</span>
                {route.avg_rating && <span>⭐ {route.avg_rating.toFixed(1)}</span>}
              </div>

              {/* Creator */}
              <div className="info-card" style={{ padding: "0.75rem", display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                {creator?.avatar_url ? (
                  <img src={creator.avatar_url} alt="" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }} />
                ) : (
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>🎬</div>
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: "0.85rem" }}>{creatorName}</div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Creator</div>
                </div>
                {creator?.slug && creator.is_public && (
                  <Link href={`/u/${creator.slug}`} className="btn-ghost" style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem" }}>
                    {isDE ? "Profil" : "Profile"} →
                  </Link>
                )}
              </div>

              {/* Description */}
              <div style={{ marginBottom: "1.5rem" }}>
                <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                  {isDE ? "Beschreibung" : "Description"}
                </h2>
                <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.7, whiteSpace: "pre-line" }}>
                  {isDE ? (route.description_de || route.description) : route.description}
                </p>
                {route.highlights && (
                  <div style={{ marginTop: "0.75rem", padding: "0.75rem", background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.1)", borderRadius: 8, fontSize: "0.85rem" }}>
                    ✨ {isDE ? (route.highlights_de || route.highlights) : route.highlights}
                  </div>
                )}
              </div>

              {/* GPX download */}
              {route.gpx_url && canRide && (
                <a href={route.gpx_url} download className="info-card" style={{ display: "block", padding: "0.75rem", textAlign: "center", marginBottom: "1rem", textDecoration: "none", color: "var(--text-primary)", fontSize: "0.85rem" }}>
                  📥 {isDE ? "GPX/Strava-Daten herunterladen" : "Download GPX/Strava Data"}
                </a>
              )}

              {/* Purchase / Ride CTA */}
              <div style={{ marginBottom: "1.5rem" }}>
                {canRide ? (
                  <div style={{ textAlign: "center" }}>
                    <Link href={`/?video=${encodeURIComponent(route.video_url)}`} className="btn-primary btn-lg" style={{ display: "inline-block" }}>
                      🚴 {isDE ? "Diese Strecke fahren" : "Ride This Route"}
                    </Link>
                    {purchased && (
                      <div style={{ fontSize: "0.75rem", color: "#22c55e", marginTop: 6 }}>
                        ✓ {isDE ? "Freigeschaltet" : "Unlocked"}
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--accent-1)", marginBottom: "0.5rem" }}>
                      🪙 {route.price_credits} Credits
                    </div>
                    {!myUserId ? (
                      <Link href="/" className="btn-primary btn-lg">
                        {isDE ? "Registrieren zum Kaufen" : "Register to Buy"}
                      </Link>
                    ) : (
                      <>
                        <button onClick={handlePurchase} disabled={buying} className="btn-primary btn-lg">
                          {buying ? "..." : (isDE ? "Strecke freischalten" : "Unlock Route")}
                        </button>
                        {myCredits !== null && (
                          <div style={{ fontSize: "0.75rem", color: myCredits >= route.price_credits ? "var(--text-muted)" : "#ef4444", marginTop: 6 }}>
                            {isDE ? `Dein Guthaben: ${myCredits} Credits` : `Your balance: ${myCredits} Credits`}
                            {myCredits < route.price_credits && (
                              <span> · <Link href="/profile" style={{ color: "var(--accent-1)" }}>{isDE ? "Mehr verdienen" : "Earn more"}</Link></span>
                            )}
                          </div>
                        )}
                        {buyError && (
                          <div style={{ fontSize: "0.8rem", color: "#ef4444", marginTop: 8 }}>{buyError}</div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Rating */}
              {canRide && myUserId && !isOwn && (
                <div className="info-card" style={{ padding: "1rem", textAlign: "center", marginBottom: "1rem" }}>
                  <div style={{ fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.5rem" }}>
                    {ratingSubmitted ? (isDE ? "Deine Bewertung:" : "Your rating:") : (isDE ? "Wie war die Strecke?" : "How was the route?")}
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRate(star)}
                        style={{
                          fontSize: "1.5rem", background: "none", border: "none", cursor: "pointer",
                          opacity: star <= myRating ? 1 : 0.3, transition: "opacity 0.2s",
                        }}
                      >
                        ⭐
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Legal Disclaimer */}
              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textAlign: "center", lineHeight: 1.5, marginTop: "1rem" }}>
                {isDE
                  ? "Dieses Streckenvideo ist nutzergenerierter Inhalt. CycleRun übernimmt keine Verantwortung für Richtigkeit, Qualität oder Rechtmäßigkeit. Urheberrechtsverletzung melden: support@cyclerun.app"
                  : "This route video is user-generated content. CycleRun assumes no responsibility for accuracy, quality, or legality. Report copyright issues: support@cyclerun.app"
                }
              </div>
            </>
          )}
        </div>
      </section>

      <SubpageFooter />
    </div>
  );
}
