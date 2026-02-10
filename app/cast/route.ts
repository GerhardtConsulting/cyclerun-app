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

function parseYouTubeId(url: string): string | null {
  const m = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
  );
  return m ? m[1] : null;
}

// Shared CSS — fully inlined, no external dependencies
const CSS = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #000; color: #fff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }

  .page { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem; background: #0a0a0b; }
  .card { max-width: 400px; width: 100%; text-align: center; padding: 3rem 2rem; background: #141416; border-radius: 16px; border: 1px solid rgba(255,255,255,0.06); }
  .icon { display: inline-flex; align-items: center; justify-content: center; width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, rgba(249,115,22,0.15), rgba(234,88,12,0.08)); color: #f97316; margin-bottom: 1.5rem; }
  .title { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem; }
  .subtitle { font-size: 0.9rem; color: rgba(255,255,255,0.5); line-height: 1.5; margin-bottom: 1.5rem; }
  .code-input { width: 100%; max-width: 240px; height: 64px; text-align: center; font-size: 2rem; font-weight: 800; letter-spacing: 0.3em; color: #fff; background: #1a1a1e; border: 2px solid rgba(255,255,255,0.1); border-radius: 12px; outline: none; font-family: inherit; -moz-appearance: textfield; appearance: textfield; display: block; margin: 0 auto 1.5rem; }
  .code-input:focus { border-color: #f97316; }
  .code-input::placeholder { color: rgba(255,255,255,0.15); letter-spacing: 0.3em; }
  .submit-btn { width: 100%; max-width: 240px; height: 52px; font-size: 1.1rem; font-weight: 700; color: #000; background: #f97316; border: none; border-radius: 12px; cursor: pointer; font-family: inherit; }
  .submit-btn:focus { outline: 3px solid rgba(249,115,22,0.5); outline-offset: 2px; }
  .spinner { width: 40px; height: 40px; border: 3px solid rgba(255,255,255,0.1); border-top-color: #f97316; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 1rem; }
  @keyframes spin { to { transform: rotate(360deg); } }

  .fs { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: #000; overflow: hidden; }
  .video { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: 1; border: none; }
  .fallback { position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 1; background: radial-gradient(ellipse at 50% 40%, rgba(249,115,22,0.12) 0%, #0a0a0b 70%); }
  .big-speed { font-size: 12rem; font-weight: 800; line-height: 1; color: #fff; }
  .big-unit { font-size: 2rem; font-weight: 600; color: rgba(255,255,255,0.4); margin-top: 0.5rem; }
  .hint { font-size: 0.85rem; color: rgba(255,255,255,0.35); margin-top: 2rem; text-align: center; line-height: 1.5; }

  .video-wrap { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1; }
  .hud { position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%); display: flex; gap: 2.5rem; padding: 1rem 2rem; background: rgba(0,0,0,0.85); border-radius: 16px; border: 1px solid rgba(255,255,255,0.15); z-index: 100; }
  .hud-item { display: flex; flex-direction: column; align-items: center; gap: 2px; }
  .hud-val { font-size: 1.75rem; font-weight: 800; color: #fff; }
  .hud-lbl { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.08em; color: rgba(255,255,255,0.5); }
  .logo { position: absolute; top: 1.5rem; left: 1.5rem; z-index: 100; font-size: 1.1rem; font-weight: 800; color: rgba(255,255,255,0.4); letter-spacing: -0.03em; }
  .logo span { color: #f97316; }
  .debug { position: absolute; top: 1.5rem; right: 1.5rem; z-index: 100; padding: 1rem; background: rgba(0,0,0,0.9); border: 1px solid #f97316; border-radius: 8px; font-size: 0.75rem; font-family: monospace; color: #fff; max-width: 300px; word-break: break-all; }
`;

function htmlShell(body: string, title = "Cast | CycleRun", extra = "") {
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="robots" content="noindex,nofollow">
  <title>${title}</title>
  ${extra}
  <style>${CSS}</style>
</head>
<body>${body}</body>
</html>`;
}

const ICON_SVG = `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 16.1A5 5 0 015.9 20M2 12.05A9 9 0 019.95 20M2 8V6a2 2 0 012-2h16a2 2 0 012 2v12a2 2 0 01-2 2h-6"/></svg>`;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code") || "";

  // ---- HAS CODE ----
  if (/^\d{4}$/.test(code)) {
    const state = await fetchCastState(code);

    if (!state) {
      // Waiting for cast — auto-refresh every 3s
      const body = `
        <div class="page">
          <div class="card">
            <div class="icon">${ICON_SVG}</div>
            <h1 class="title">Warte auf Cast...</h1>
            <p class="subtitle">Code: <strong>${code}</strong> &mdash; Starte einen Cast auf deinem Trainingsger&auml;t.<br>Seite aktualisiert automatisch.</p>
            <div class="spinner"></div>
          </div>
        </div>`;
      return new Response(
        htmlShell(body, "Warte auf Cast... | CycleRun", `<meta http-equiv="refresh" content="3;url=/cast?code=${code}">`),
        { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } }
      );
    }

    // Active cast — render HUD
    const mins = Math.floor((state.rideTime ?? 0) / 60);
    const secs = (state.rideTime ?? 0) % 60;
    const videoUrl = state.videoUrl || "";
    const ytId = parseYouTubeId(videoUrl);
    const isBlob = videoUrl.startsWith("blob:");
    const isPlayable = !!videoUrl && !isBlob && !ytId;
    const hasVideo = !!ytId || isPlayable;
    const startSec = Math.floor(state.currentTime ?? 0);
    // Longer refresh = less black flashes, but less frequent updates
    const refreshSec = 10;

    let videoHtml = "";
    if (ytId) {
      // Wrap iframe in container to fix z-index issues
      videoHtml = `<div class="video-wrap"><iframe class="video" src="https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&controls=0&start=${startSec}&loop=1&playlist=${ytId}&modestbranding=1&rel=0&showinfo=0" allow="autoplay; encrypted-media" allowfullscreen></iframe></div>`;
    } else if (isPlayable) {
      videoHtml = `<video class="video" src="${videoUrl}#t=${startSec}" autoplay muted playsinline></video>`;
    } else {
      videoHtml = `
        <div class="fallback">
          <div class="big-speed">${(state.speed ?? 0).toFixed(1)}</div>
          <div class="big-unit">km/h</div>
          ${isBlob ? '<div class="hint">Lokale Videos k&ouml;nnen nicht auf den TV gecastet werden.<br>Verwende eine Video-URL f&uuml;r TV-Cast.</div>' : ""}
        </div>`;
    }

    // Debug panel to see what data we're receiving
    const debugHtml = `
      <div class="debug">
        <div><strong>DEBUG</strong></div>
        <div>speed: ${state.speed}</div>
        <div>rpm: ${state.rpm}</div>
        <div>distance: ${state.distance}</div>
        <div>rideTime: ${state.rideTime}</div>
        <div>gear: ${state.gear}</div>
        <div>currentTime: ${state.currentTime}</div>
        <div>videoUrl: ${videoUrl.substring(0, 50)}...</div>
        <div>ytId: ${ytId || "none"}</div>
        <div>isBlob: ${isBlob}</div>
      </div>`;

    const body = `
      <div class="fs">
        ${videoHtml}
        <div class="hud">
          <div class="hud-item"><span class="hud-val">${(state.speed ?? 0).toFixed(1)}</span><span class="hud-lbl">km/h</span></div>
          <div class="hud-item"><span class="hud-val">${state.rpm ?? 0}</span><span class="hud-lbl">RPM</span></div>
          <div class="hud-item"><span class="hud-val">${(state.distance ?? 0).toFixed(2)}</span><span class="hud-lbl">km</span></div>
          <div class="hud-item"><span class="hud-val">${pad2(mins)}:${pad2(secs)}</span><span class="hud-lbl">Zeit</span></div>
          <div class="hud-item"><span class="hud-val">${state.gear ?? "-"}</span><span class="hud-lbl">Gang</span></div>
        </div>
        <div class="logo">cyclerun<span>.app</span></div>
        ${debugHtml}
      </div>`;

    return new Response(
      htmlShell(body, "Cast | CycleRun", `<meta http-equiv="refresh" content="${refreshSec};url=/cast?code=${code}">`),
      { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } }
    );
  }

  // ---- NO CODE: input form ----
  const body = `
    <div class="page">
      <div class="card">
        <div class="icon">${ICON_SVG}</div>
        <h1 class="title">Cast-Code eingeben</h1>
        <p class="subtitle">4-stelliger Code von deinem Trainingsger&auml;t</p>
        <form method="GET" action="/cast" style="display:flex;flex-direction:column;align-items:center;gap:1rem">
          <input name="code" class="code-input" type="tel" inputmode="numeric" pattern="[0-9]*" maxlength="4" placeholder="0000" autocomplete="off">
          <input type="submit" value="Verbinden" class="submit-btn">
        </form>
      </div>
    </div>`;

  return new Response(
    htmlShell(body),
    { headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}
