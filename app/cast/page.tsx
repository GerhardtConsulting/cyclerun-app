import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cast to Screen",
  description: "Cast your CycleRun ride video to a second screen — TV, Mac, or any browser.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const SUPABASE_URL = "https://yuxkujcnsrrkwbvftkvq.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1eGt1amNuc3Jya3didmZ0a3ZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzMjAwNzgsImV4cCI6MjA4NTg5NjA3OH0.aQRnjS2lKDr0qQU9eKphynaHajdn5xWruAXnRx8zhZI";

interface CastState {
  mode: string;
  speed: number;
  rpm: number;
  distance: number;
  rideTime: number;
  gear: number;
  isPlaying: boolean;
  playbackRate: number;
  currentTime: number;
  videoUrl: string;
}

async function fetchCastState(code: string): Promise<CastState | null> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/pair_state?code=eq.${code}&select=state`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        cache: "no-store",
      }
    );
    if (!res.ok) return null;
    const rows = await res.json();
    const state = rows[0]?.state;
    if (state && state.mode === "cast") return state as CastState;
    return null;
  } catch {
    return null;
  }
}

function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

export default async function CastPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const params = await searchParams;
  const code = params.code;

  // ---- HAS CODE: fetch state + render HUD ----
  if (code && /^\d{4}$/.test(code)) {
    const state = await fetchCastState(code);

    if (!state) {
      return (
        <div className="cast-page">
          <meta httpEquiv="refresh" content={`3;url=/cast?code=${code}`} />
          <div className="cast-card">
            <div className="cast-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 16.1A5 5 0 015.9 20M2 12.05A9 9 0 019.95 20M2 8V6a2 2 0 012-2h16a2 2 0 012 2v12a2 2 0 01-2 2h-6" />
              </svg>
            </div>
            <h1 className="cast-title">Warte auf Cast...</h1>
            <p className="cast-subtitle">
              Code: <strong>{code}</strong> — Starte einen Cast auf deinem Trainingsgerät.
              <br />Seite aktualisiert automatisch.
            </p>
            <div className="cast-spinner"></div>
          </div>
        </div>
      );
    }

    // Active cast found — render HUD, auto-refresh every 2s
    const mins = Math.floor((state.rideTime ?? 0) / 60);
    const secs = (state.rideTime ?? 0) % 60;

    return (
      <div className="cast-fullscreen">
        <meta httpEquiv="refresh" content={`2;url=/cast?code=${code}`} />
        <div className="cast-video-fallback">
          <div className="cast-fallback-speed">{(state.speed ?? 0).toFixed(1)}</div>
          <div className="cast-fallback-unit">km/h</div>
        </div>
        <div className="cast-hud">
          <div className="cast-hud-item">
            <span className="cast-hud-value">{state.rpm ?? 0}</span>
            <span className="cast-hud-label">RPM</span>
          </div>
          <div className="cast-hud-item">
            <span className="cast-hud-value">{(state.distance ?? 0).toFixed(2)}</span>
            <span className="cast-hud-label">km</span>
          </div>
          {state.rideTime != null && (
            <div className="cast-hud-item">
              <span className="cast-hud-value">{pad2(mins)}:{pad2(secs)}</span>
              <span className="cast-hud-label">Zeit</span>
            </div>
          )}
          {state.gear != null && (
            <div className="cast-hud-item">
              <span className="cast-hud-value">{state.gear}</span>
              <span className="cast-hud-label">Gang</span>
            </div>
          )}
        </div>
        <div className="cast-logo">
          cyclerun<span className="header-logo-app">.app</span>
        </div>
      </div>
    );
  }

  // ---- NO CODE: show input form (plain HTML, no JS) ----
  return (
    <div className="cast-page">
      <div className="cast-card">
        <div className="cast-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M2 16.1A5 5 0 015.9 20M2 12.05A9 9 0 019.95 20M2 8V6a2 2 0 012-2h16a2 2 0 012 2v12a2 2 0 01-2 2h-6" />
          </svg>
        </div>
        <h1 className="cast-title">Cast-Code eingeben</h1>
        <p className="cast-subtitle">4-stelliger Code von deinem Trainingsgerät</p>

        <form method="GET" action="/cast" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
          <input
            name="code"
            className="cast-code-input"
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={4}
            placeholder="0000"
            autoComplete="off"
          />
          <input
            type="submit"
            value="Verbinden"
            className="cast-submit-btn"
          />
        </form>
      </div>
    </div>
  );
}
