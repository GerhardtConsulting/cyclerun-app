"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useLocale } from "@/lib/useLocale";
import { t } from "@/lib/i18n";
import SubpageNav from "@/components/SubpageNav";
import SubpageFooter from "@/components/SubpageFooter";
import { getSupabase } from "@/lib/supabase";

interface CreatorRoute {
  id: string;
  title: string;
  status: string;
  price_credits: number;
  total_purchases: number;
  total_plays: number;
  thumbnail_url: string | null;
  created_at: string;
}

interface UserInfo {
  id: string;
  first_name: string;
  nickname: string | null;
  is_creator: boolean;
  creator_earnings: number;
  credits: number;
}

const DIFFICULTIES = ["easy", "moderate", "hard", "extreme"] as const;
const DIFFICULTY_LABELS: Record<string, { en: string; de: string }> = {
  easy: { en: "Easy", de: "Leicht" },
  moderate: { en: "Moderate", de: "Mittel" },
  hard: { en: "Hard", de: "Schwer" },
  extreme: { en: "Extreme", de: "Extrem" },
};

export default function CreatorDashboardContent() {
  const locale = useLocale();
  const isDE = locale === "de";
  const [user, setUser] = useState<UserInfo | null>(null);
  const [routes, setRoutes] = useState<CreatorRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [notAuth, setNotAuth] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activatingCreator, setActivatingCreator] = useState(false);

  // Upload form state
  const [formTitle, setFormTitle] = useState("");
  const [formTitleDe, setFormTitleDe] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formDescDe, setFormDescDe] = useState("");
  const [formHighlights, setFormHighlights] = useState("");
  const [formVideoUrl, setFormVideoUrl] = useState("");
  const [formDistance, setFormDistance] = useState("");
  const [formElevation, setFormElevation] = useState("");
  const [formDuration, setFormDuration] = useState("");
  const [formDifficulty, setFormDifficulty] = useState<string>("moderate");
  const [formCountry, setFormCountry] = useState("");
  const [formRegion, setFormRegion] = useState("");
  const [formPrice, setFormPrice] = useState("0");
  const [formThumbnail, setFormThumbnail] = useState<File | null>(null);
  const [formGpx, setFormGpx] = useState<File | null>(null);
  const [legalOwnership, setLegalOwnership] = useState(false);
  const [legalOriginal, setLegalOriginal] = useState(false);
  const [legalTerms, setLegalTerms] = useState(false);

  const loadDashboard = useCallback(async () => {
    const email = typeof window !== "undefined" ? localStorage.getItem("cyclerun_email") : null;
    if (!email) { setNotAuth(true); setLoading(false); return; }

    const sb = getSupabase();
    if (!sb) { setLoading(false); return; }

    const { data: userData } = await sb.from("registrations")
      .select("id, first_name, nickname, is_creator, creator_earnings, credits")
      .eq("email", email).single();

    if (!userData) { setNotAuth(true); setLoading(false); return; }
    setUser(userData as UserInfo);

    // Load creator routes
    const { data: routesData } = await sb.from("creator_routes")
      .select("id, title, status, price_credits, total_purchases, total_plays, thumbnail_url, created_at")
      .eq("creator_id", userData.id)
      .order("created_at", { ascending: false });

    setRoutes((routesData || []) as CreatorRoute[]);
    setLoading(false);
  }, []);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  const handleActivateCreator = async () => {
    if (!user) return;
    setActivatingCreator(true);
    const sb = getSupabase();
    if (!sb) { setActivatingCreator(false); return; }
    await sb.from("registrations").update({ is_creator: true }).eq("id", user.id);
    setUser({ ...user, is_creator: true });
    setActivatingCreator(false);
  };

  const handleUploadRoute = async () => {
    if (!user || !formTitle || !formVideoUrl || !formDesc || !legalOwnership || !legalOriginal || !legalTerms) return;
    setUploading(true);
    const sb = getSupabase();
    if (!sb) { setUploading(false); return; }

    let thumbnailUrl = null;
    let gpxUrl = null;

    // Upload thumbnail
    if (formThumbnail) {
      const ext = formThumbnail.name.split(".").pop() || "jpg";
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { error } = await sb.storage.from("thumbnails").upload(path, formThumbnail);
      if (!error) {
        const { data } = sb.storage.from("thumbnails").getPublicUrl(path);
        thumbnailUrl = data.publicUrl;
      }
    }

    // Upload GPX
    if (formGpx) {
      const path = `${user.id}/${Date.now()}.gpx`;
      const { error } = await sb.storage.from("gpx").upload(path, formGpx);
      if (!error) {
        const { data } = sb.storage.from("gpx").getPublicUrl(path);
        gpxUrl = data.publicUrl;
      }
    }

    const { error } = await sb.from("creator_routes").insert({
      creator_id: user.id,
      title: formTitle.trim(),
      title_de: formTitleDe.trim() || null,
      description: formDesc.trim(),
      description_de: formDescDe.trim() || null,
      highlights: formHighlights.trim() || null,
      video_url: formVideoUrl.trim(),
      thumbnail_url: thumbnailUrl,
      gpx_url: gpxUrl,
      distance_km: parseFloat(formDistance) || null,
      elevation_m: parseInt(formElevation) || null,
      duration_minutes: parseInt(formDuration) || null,
      difficulty: formDifficulty,
      country: formCountry.trim() || null,
      region: formRegion.trim() || null,
      price_credits: parseInt(formPrice) || 0,
      status: "pending_review",
      ownership_confirmed: legalOwnership,
      content_original: legalOriginal,
      terms_accepted: legalTerms,
      terms_accepted_at: new Date().toISOString(),
    });

    if (!error) {
      // Reset form
      setFormTitle(""); setFormTitleDe(""); setFormDesc(""); setFormDescDe("");
      setFormHighlights(""); setFormVideoUrl(""); setFormDistance(""); setFormElevation("");
      setFormDuration(""); setFormDifficulty("moderate"); setFormCountry(""); setFormRegion("");
      setFormPrice("0"); setFormThumbnail(null); setFormGpx(null);
      setLegalOwnership(false); setLegalOriginal(false); setLegalTerms(false);
      setShowUpload(false);
      await loadDashboard();
    }
    setUploading(false);
  };

  const statusBadge = (s: string) => {
    const map: Record<string, { label: string; color: string; bg: string }> = {
      draft: { label: "Draft", color: "#6b7280", bg: "rgba(107,114,128,0.1)" },
      pending_review: { label: isDE ? "In Prüfung" : "Pending Review", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
      published: { label: isDE ? "Live" : "Published", color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
      rejected: { label: isDE ? "Abgelehnt" : "Rejected", color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
      suspended: { label: isDE ? "Gesperrt" : "Suspended", color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
    };
    const badge = map[s] || map.draft;
    return (
      <span style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", color: badge.color, background: badge.bg, padding: "0.15rem 0.5rem", borderRadius: 4, letterSpacing: "0.03em" }}>
        {badge.label}
      </span>
    );
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "0.5rem 0.75rem", borderRadius: 8,
    border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text-primary)",
    fontSize: "0.9rem",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: 4, fontWeight: 600,
  };

  return (
    <div className="creator-page">
      <SubpageNav rightLabel={isDE ? "Store" : "Store"} rightHref="/store" />

      <section className="creator-hero" style={{ paddingBottom: "2rem" }}>
        <div className="creator-hero-inner" style={{ maxWidth: 800 }}>
          <span className="creator-badge-label">🎬 {isDE ? "Creator Dashboard" : "Creator Dashboard"}</span>

          {loading ? (
            <div style={{ textAlign: "center", padding: "4rem 0" }}>
              <div className="loading-spinner" style={{ margin: "0 auto" }}></div>
            </div>
          ) : notAuth ? (
            <div style={{ textAlign: "center", padding: "3rem 0" }}>
              <h1 className="creator-hero-h1" style={{ fontSize: "2rem" }}>Creator Dashboard</h1>
              <p style={{ color: "var(--text-muted)", maxWidth: 400, margin: "1rem auto 2rem" }}>
                {isDE ? "Registriere dich zuerst, um Strecken hochzuladen." : "Register first to upload routes."}
              </p>
              <Link href="/" className="btn-primary btn-lg">{t("sub.start_riding")}</Link>
            </div>
          ) : user && !user.is_creator ? (
            /* Creator Activation */
            <div style={{ textAlign: "center", padding: "2rem 0" }}>
              <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "0.5rem" }}>
                {isDE ? "Werde CycleRun Creator" : "Become a CycleRun Creator"}
              </h1>
              <p style={{ color: "var(--text-muted)", maxWidth: 480, margin: "0.5rem auto 1.5rem", lineHeight: 1.6 }}>
                {isDE
                  ? "Filme POV-Cycling-Videos, lade sie hoch und verdiene Credits für jeden Kauf. 70% gehen direkt an dich."
                  : "Film POV cycling videos, upload them, and earn Credits for every purchase. 70% goes directly to you."
                }
              </p>
              <div className="info-card" style={{ padding: "1rem", maxWidth: 500, margin: "0 auto 1.5rem", textAlign: "left" }}>
                <div style={{ fontSize: "0.8rem", lineHeight: 1.8 }}>
                  <div>✅ {isDE ? "Lade unbegrenzt Strecken hoch" : "Upload unlimited routes"}</div>
                  <div>✅ {isDE ? "Setze deinen eigenen Preis (in Credits)" : "Set your own price (in Credits)"}</div>
                  <div>✅ {isDE ? "70% Umsatzbeteiligung" : "70% revenue share"}</div>
                  <div>✅ {isDE ? "Dashboard mit Statistiken" : "Dashboard with analytics"}</div>
                  <div>✅ {isDE ? "Kein Abo, keine Gebühren" : "No subscription, no fees"}</div>
                </div>
              </div>
              <button onClick={handleActivateCreator} disabled={activatingCreator} className="btn-primary btn-lg">
                {activatingCreator ? "..." : (isDE ? "Creator werden — kostenlos" : "Become a Creator — free")}
              </button>
            </div>
          ) : user && (
            <>
              {/* Earnings Overview */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem", marginBottom: "1.5rem" }}>
                <div className="info-card" style={{ padding: "1rem", textAlign: "center" }}>
                  <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--accent-1)" }}>🪙 {user.creator_earnings}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{isDE ? "Verdient" : "Earned"}</div>
                </div>
                <div className="info-card" style={{ padding: "1rem", textAlign: "center" }}>
                  <div style={{ fontSize: "1.8rem", fontWeight: 800 }}>{routes.length}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{isDE ? "Strecken" : "Routes"}</div>
                </div>
                <div className="info-card" style={{ padding: "1rem", textAlign: "center" }}>
                  <div style={{ fontSize: "1.8rem", fontWeight: 800 }}>{routes.reduce((s, r) => s + r.total_purchases, 0)}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{isDE ? "Verkäufe" : "Sales"}</div>
                </div>
              </div>

              {/* Upload Button */}
              <button onClick={() => setShowUpload(!showUpload)} className="btn-primary" style={{ width: "100%", marginBottom: "1.5rem", padding: "0.75rem" }}>
                {showUpload ? "✕" : "➕"} {showUpload ? (isDE ? "Abbrechen" : "Cancel") : (isDE ? "Neue Strecke hochladen" : "Upload New Route")}
              </button>

              {/* Upload Form */}
              {showUpload && (
                <div className="info-card" style={{ padding: "1.25rem", marginBottom: "2rem" }}>
                  <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem" }}>
                    {isDE ? "🎬 Neue Strecke" : "🎬 New Route"}
                  </h2>

                  {/* Title */}
                  <div style={{ marginBottom: "0.75rem" }}>
                    <label style={labelStyle}>Title (EN) *</label>
                    <input type="text" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="e.g. Mallorca — Cap de Formentor" style={inputStyle} maxLength={120} />
                  </div>
                  <div style={{ marginBottom: "0.75rem" }}>
                    <label style={labelStyle}>Titel (DE)</label>
                    <input type="text" value={formTitleDe} onChange={(e) => setFormTitleDe(e.target.value)} placeholder="z.B. Mallorca — Cap de Formentor" style={inputStyle} maxLength={120} />
                  </div>

                  {/* Video URL */}
                  <div style={{ marginBottom: "0.75rem" }}>
                    <label style={labelStyle}>{isDE ? "Video-URL (YouTube/Vimeo) *" : "Video URL (YouTube/Vimeo) *"}</label>
                    <input type="url" value={formVideoUrl} onChange={(e) => setFormVideoUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." style={inputStyle} />
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 4 }}>
                      {isDE ? "Lade dein Video auf YouTube hoch und füge den Link hier ein." : "Upload your video to YouTube and paste the link here."}
                    </div>
                  </div>

                  {/* Description */}
                  <div style={{ marginBottom: "0.75rem" }}>
                    <label style={labelStyle}>Description (EN) *</label>
                    <textarea value={formDesc} onChange={(e) => setFormDesc(e.target.value)} placeholder="Describe the route, scenery, and riding experience..." style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} maxLength={2000} />
                  </div>
                  <div style={{ marginBottom: "0.75rem" }}>
                    <label style={labelStyle}>Beschreibung (DE)</label>
                    <textarea value={formDescDe} onChange={(e) => setFormDescDe(e.target.value)} placeholder="Beschreibe die Strecke, Landschaft und das Fahrerlebnis..." style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} maxLength={2000} />
                  </div>

                  {/* Highlights */}
                  <div style={{ marginBottom: "0.75rem" }}>
                    <label style={labelStyle}>{isDE ? "Was macht die Strecke besonders?" : "What makes this route special?"}</label>
                    <input type="text" value={formHighlights} onChange={(e) => setFormHighlights(e.target.value)} placeholder={isDE ? "z.B. Atemberaubende Klippen, Leuchtturm am Ende" : "e.g. Stunning cliffs, lighthouse at the end"} style={inputStyle} maxLength={200} />
                  </div>

                  {/* Route metadata — 2 column grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
                    <div>
                      <label style={labelStyle}>{isDE ? "Distanz (km)" : "Distance (km)"}</label>
                      <input type="number" step="0.1" value={formDistance} onChange={(e) => setFormDistance(e.target.value)} placeholder="18.5" style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>{isDE ? "Höhenmeter (m)" : "Elevation (m)"}</label>
                      <input type="number" value={formElevation} onChange={(e) => setFormElevation(e.target.value)} placeholder="340" style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>{isDE ? "Dauer (Min.)" : "Duration (min)"}</label>
                      <input type="number" value={formDuration} onChange={(e) => setFormDuration(e.target.value)} placeholder="45" style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>{isDE ? "Schwierigkeit" : "Difficulty"}</label>
                      <select value={formDifficulty} onChange={(e) => setFormDifficulty(e.target.value)} style={inputStyle}>
                        {DIFFICULTIES.map((d) => <option key={d} value={d}>{isDE ? DIFFICULTY_LABELS[d].de : DIFFICULTY_LABELS[d].en}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>{isDE ? "Land" : "Country"}</label>
                      <input type="text" value={formCountry} onChange={(e) => setFormCountry(e.target.value)} placeholder="Spain" style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>{isDE ? "Region" : "Region"}</label>
                      <input type="text" value={formRegion} onChange={(e) => setFormRegion(e.target.value)} placeholder="Mallorca" style={inputStyle} />
                    </div>
                  </div>

                  {/* Price */}
                  <div style={{ marginBottom: "0.75rem" }}>
                    <label style={labelStyle}>{isDE ? "Preis (Credits) — 0 = kostenlos" : "Price (Credits) — 0 = free"}</label>
                    <input type="number" min="0" step="5" value={formPrice} onChange={(e) => setFormPrice(e.target.value)} style={inputStyle} />
                    {parseInt(formPrice) > 0 && (
                      <div style={{ fontSize: "0.7rem", color: "var(--accent-1)", marginTop: 4 }}>
                        {isDE ? `Du erhältst ${Math.floor(parseInt(formPrice) * 0.7)} Credits pro Verkauf (70%)` : `You receive ${Math.floor(parseInt(formPrice) * 0.7)} Credits per sale (70%)`}
                      </div>
                    )}
                  </div>

                  {/* Files */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1rem" }}>
                    <div>
                      <label style={labelStyle}>Thumbnail</label>
                      <input type="file" accept="image/*" onChange={(e) => setFormThumbnail(e.target.files?.[0] || null)} style={{ ...inputStyle, padding: "0.4rem" }} />
                    </div>
                    <div>
                      <label style={labelStyle}>GPX / Strava {isDE ? "Daten" : "Data"}</label>
                      <input type="file" accept=".gpx,.tcx,.fit" onChange={(e) => setFormGpx(e.target.files?.[0] || null)} style={{ ...inputStyle, padding: "0.4rem" }} />
                    </div>
                  </div>

                  {/* Legal Checkboxes */}
                  <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem", marginBottom: "1rem" }}>
                    <h3 style={{ fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.75rem" }}>
                      ⚖️ {isDE ? "Rechtliche Erklärungen" : "Legal Declarations"}
                    </h3>
                    <label style={{ display: "flex", gap: "0.5rem", fontSize: "0.8rem", marginBottom: "0.5rem", cursor: "pointer", lineHeight: 1.5 }}>
                      <input type="checkbox" checked={legalOwnership} onChange={(e) => setLegalOwnership(e.target.checked)} style={{ marginTop: 3 }} />
                      <span>
                        {isDE
                          ? "Ich bestätige, dass ich die vollständigen Rechte an diesem Video besitze oder die erforderliche Lizenz zur Verbreitung habe."
                          : "I confirm that I own the full rights to this video or have the required license for distribution."
                        }
                      </span>
                    </label>
                    <label style={{ display: "flex", gap: "0.5rem", fontSize: "0.8rem", marginBottom: "0.5rem", cursor: "pointer", lineHeight: 1.5 }}>
                      <input type="checkbox" checked={legalOriginal} onChange={(e) => setLegalOriginal(e.target.checked)} style={{ marginTop: 3 }} />
                      <span>
                        {isDE
                          ? "Dieses Video ist mein Originalinhalt und verletzt keine Urheberrechte, Markenrechte oder sonstigen Rechte Dritter."
                          : "This video is my original content and does not infringe any copyrights, trademarks, or other third-party rights."
                        }
                      </span>
                    </label>
                    <label style={{ display: "flex", gap: "0.5rem", fontSize: "0.8rem", marginBottom: "0.5rem", cursor: "pointer", lineHeight: 1.5 }}>
                      <input type="checkbox" checked={legalTerms} onChange={(e) => setLegalTerms(e.target.checked)} style={{ marginTop: 3 }} />
                      <span>
                        {isDE
                          ? "Ich akzeptiere die Creator-Bedingungen. CycleRun übernimmt keine Haftung für hochgeladene Inhalte. Die Plattform behält sich das Recht vor, Inhalte jederzeit zu entfernen."
                          : "I accept the Creator Terms. CycleRun assumes no liability for uploaded content. The platform reserves the right to remove content at any time."
                        }
                      </span>
                    </label>
                  </div>

                  {/* Platform Disclaimer */}
                  <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 8, padding: "0.75rem", marginBottom: "1rem", fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                    ⚠️ {isDE
                      ? "CycleRun ist eine Plattform und kein Inhalteanbieter. Alle hochgeladenen Streckenvideos sind nutzergenerierte Inhalte. CycleRun übernimmt keine Verantwortung für die Richtigkeit, Qualität oder Rechtmäßigkeit der Inhalte. Bei Urheberrechtsverletzungen wende dich an support@cyclerun.app."
                      : "CycleRun is a platform, not a content provider. All uploaded route videos are user-generated content. CycleRun assumes no responsibility for the accuracy, quality, or legality of content. For copyright concerns, contact support@cyclerun.app."
                    }
                  </div>

                  {/* Submit */}
                  <button
                    onClick={handleUploadRoute}
                    disabled={uploading || !formTitle || !formVideoUrl || !formDesc || !legalOwnership || !legalOriginal || !legalTerms}
                    className="btn-primary"
                    style={{ width: "100%", padding: "0.75rem", fontSize: "0.9rem" }}
                  >
                    {uploading ? "..." : (isDE ? "Strecke einreichen" : "Submit Route")}
                  </button>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textAlign: "center", marginTop: 6 }}>
                    {isDE ? "Die Strecke wird nach einer kurzen Prüfung veröffentlicht." : "Your route will be published after a brief review."}
                  </div>
                </div>
              )}

              {/* My Routes */}
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700, margin: "1rem 0 0.75rem" }}>
                {isDE ? "Meine Strecken" : "My Routes"}
              </h2>

              {routes.length === 0 ? (
                <div className="info-card" style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>
                  {isDE ? "Noch keine Strecken. Lade deine erste hoch!" : "No routes yet. Upload your first one!"}
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {routes.map((route) => (
                    <div key={route.id} className="info-card" style={{ padding: "0.75rem", display: "flex", gap: "0.75rem", alignItems: "center" }}>
                      {route.thumbnail_url ? (
                        <img src={route.thumbnail_url} alt="" style={{ width: 80, height: 50, objectFit: "cover", borderRadius: 6 }} />
                      ) : (
                        <div style={{ width: 80, height: 50, borderRadius: 6, background: "var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>🎬</div>
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: "0.85rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {route.title}
                        </div>
                        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginTop: 4 }}>
                          {statusBadge(route.status)}
                          <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                            {route.price_credits > 0 ? `🪙 ${route.price_credits}` : (isDE ? "Kostenlos" : "Free")}
                          </span>
                          <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                            📦 {route.total_purchases}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* CTA */}
              <div style={{ textAlign: "center", margin: "2rem 0" }}>
                <Link href="/store" className="btn-ghost">{isDE ? "Zum Store" : "Browse Store"} →</Link>
              </div>
            </>
          )}
        </div>
      </section>

      <SubpageFooter />
    </div>
  );
}
