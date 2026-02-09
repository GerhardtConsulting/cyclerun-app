"use client";

import { useEffect, useRef, useState } from "react";
import { pollCastState, type CastState } from "@/lib/phone-pairing";
import { initLocale, t, type Locale } from "@/lib/i18n";

function CastInner() {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"input" | "connecting" | "playing" | "error">("input");
  const [errorMsg, setErrorMsg] = useState("");
  const [locale, setLocale] = useState<Locale>("en");
  const [castState, setCastState] = useState<CastState | null>(null);
  const [videoError, setVideoError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastSyncRef = useRef(0);
  const loadedUrlRef = useRef("");
  const startedRef = useRef(false);
  const videoTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const codeRef = useRef("");

  // Read URL code on client only (useEffect never runs on server)
  useEffect(() => {
    setLocale(initLocale());

    // Parse ?code= from URL — manual regex, no URLSearchParams (TV compat)
    let urlCode = "";
    try {
      const m = window.location.search.match(/[?&]code=(\d{4})/);
      if (m) urlCode = m[1];
    } catch {}

    if (urlCode) {
      codeRef.current = urlCode;
      setCode(urlCode);
      startedRef.current = true;
      doStartCast(urlCode);
    }

    // Listen for number key presses from TV remote directly
    function onKeyDown(e: KeyboardEvent) {
      if (startedRef.current) return;
      if (e.key >= "0" && e.key <= "9") {
        const cur = codeRef.current;
        if (cur.length < 4) {
          const next = cur + e.key;
          codeRef.current = next;
          setCode(next);
          if (next.length === 4) {
            startedRef.current = true;
            doStartCast(next);
          }
        }
      } else if (e.key === "Backspace") {
        const next = codeRef.current.slice(0, -1);
        codeRef.current = next;
        setCode(next);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function doStartCast(castCode: string) {
    setStatus("connecting");
    setErrorMsg("");

    // Retry up to 3 times (TV might load before PC starts casting)
    let initial: CastState | null = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      initial = await pollCastState(castCode);
      if (initial) break;
      await new Promise((r) => setTimeout(r, 1500));
    }

    if (!initial) {
      startedRef.current = false;
      setStatus("error");
      setErrorMsg(locale === "de" ? "Kein aktiver Cast gefunden. Starte erst einen Cast auf deinem Trainingsgerät." : "No active cast found. Start a cast on your training device first.");
      return;
    }

    setStatus("playing");
    setCastState(initial);

    // Start polling
    pollRef.current = setInterval(async () => {
      const state = await pollCastState(castCode);
      if (state) setCastState(state);
    }, 500);
  }

  // Sync video with cast state
  useEffect(() => {
    if (!castState || !videoRef.current) return;
    const video = videoRef.current;
    const url = castState.videoUrl || "";

    // Load new video only if URL actually changed (track with ref, not video.src)
    if (url && url !== loadedUrlRef.current && !url.startsWith("blob:")) {
      loadedUrlRef.current = url;
      setVideoLoaded(false);
      video.src = url;
      video.load();
      video.play().catch(() => {});
      // Timeout: if video doesn't load in 5s, show fallback HUD
      if (videoTimeoutRef.current) clearTimeout(videoTimeoutRef.current);
      videoTimeoutRef.current = setTimeout(() => {
        if (!video.videoWidth) setVideoError(true);
      }, 5000);
      video.onloadeddata = () => { setVideoLoaded(true); if (videoTimeoutRef.current) clearTimeout(videoTimeoutRef.current); };
      return; // let it load first before syncing playback
    }

    // Sync playback rate
    if (Math.abs(video.playbackRate - castState.playbackRate) > 0.01) {
      video.playbackRate = castState.playbackRate;
    }

    // Sync play/pause
    if (castState.isPlaying && video.paused && video.readyState >= 2) {
      video.play().catch(() => {});
    } else if (!castState.isPlaying && !video.paused) {
      video.pause();
    }

    // Correct time drift (only if > 2s off, to avoid constant seeking)
    const now = Date.now();
    if (now - lastSyncRef.current > 3000) {
      const drift = Math.abs(video.currentTime - castState.currentTime);
      if (drift > 2) {
        video.currentTime = castState.currentTime;
      }
      lastSyncRef.current = now;
    }
  }, [castState]);

  // Cleanup polling + video timeout on unmount
  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      if (videoTimeoutRef.current) clearTimeout(videoTimeoutRef.current);
    };
  }, []);

  const isDE = locale === "de";

  // Helper: handle button press (works for both click and Enter keydown)
  function pressDigit(n: number) {
    if (startedRef.current) return;
    const cur = codeRef.current;
    if (cur.length >= 4) return;
    const next = cur + n;
    codeRef.current = next;
    setCode(next);
    if (next.length === 4) {
      startedRef.current = true;
      doStartCast(next);
    }
  }

  function pressDelete() {
    const next = codeRef.current.slice(0, -1);
    codeRef.current = next;
    setCode(next);
  }

  function pressOK() {
    const cur = codeRef.current;
    if (cur.length === 4 && !startedRef.current) {
      startedRef.current = true;
      doStartCast(cur);
    }
  }

  function btnProps(action: () => void) {
    return {
      tabIndex: 0,
      onClick: (e: React.MouseEvent) => { e.preventDefault(); action(); },
      onKeyDown: (e: React.KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); action(); } },
      onMouseDown: (e: React.MouseEvent) => { e.preventDefault(); action(); },
    };
  }

  // ---- INPUT SCREEN ----
  if (status === "input" || status === "error") {
    return (
      <div className="cast-page">
        <div className="cast-card">
          <div className="cast-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 16.1A5 5 0 015.9 20M2 12.05A9 9 0 019.95 20M2 8V6a2 2 0 012-2h16a2 2 0 012 2v12a2 2 0 01-2 2h-6" />
              <circle cx="2" cy="20" r="0" fill="currentColor" />
            </svg>
          </div>
          <h1 className="cast-title">{isDE ? "Cast-Code eingeben" : "Enter Cast Code"}</h1>
          <p className="cast-subtitle">{isDE ? "4-stelliger Code von deinem Trainingsgerät" : "4-digit code from your training device"}</p>

          <div className="cast-code-display">
            {code.padEnd(4, "·").split("").map((ch, i) => (
              <span key={i} className={`cast-code-char${ch !== "·" ? " filled" : ""}`}>{ch}</span>
            ))}
          </div>

          <div className="cast-numpad">
            {[1,2,3,4,5,6,7,8,9].map((n) => (
              <button key={n} className="cast-numpad-btn" {...btnProps(() => pressDigit(n))}>{n}</button>
            ))}
            <button className="cast-numpad-btn cast-numpad-del" {...btnProps(pressDelete)}>←</button>
            <button className="cast-numpad-btn" {...btnProps(() => pressDigit(0))}>0</button>
            <button className="cast-numpad-btn cast-numpad-go" disabled={code.length !== 4} {...btnProps(pressOK)}>OK</button>
          </div>

          {status === "error" && <p className="cast-error">{errorMsg}</p>}
        </div>
      </div>
    );
  }

  // ---- CONNECTING ----
  if (status === "connecting") {
    return (
      <div className="cast-page">
        <div className="cast-card">
          <div className="cast-spinner"></div>
          <p className="cast-subtitle">{isDE ? "Verbinde..." : "Connecting..."}</p>
        </div>
      </div>
    );
  }

  // ---- PLAYING (fullscreen video + HUD) ----
  const videoUrl = castState?.videoUrl || "";
  const isBlob = videoUrl.startsWith("blob:");
  const hasVideo = !!videoUrl && !isBlob;
  const showFallback = !hasVideo || videoError;

  return (
    <div className="cast-fullscreen">
      {hasVideo && !videoError ? (
        <video
          ref={videoRef}
          className="cast-video"
          autoPlay
          muted
          loop
          playsInline
          onError={() => setVideoError(true)}
        />
      ) : (
        <div className="cast-video-fallback">
          <div className="cast-fallback-speed">{(castState?.speed ?? 0).toFixed(1)}</div>
          <div className="cast-fallback-unit">km/h</div>
          {isBlob && (
            <div className="cast-fallback-hint">
              {isDE
                ? "Lokale Videos können nicht gecastet werden — Metriken werden live synchronisiert"
                : "Local videos can't be cast — metrics are synced live"}
            </div>
          )}
          {videoError && (
            <div className="cast-fallback-hint">
              {isDE
                ? "Video konnte nicht geladen werden — Metriken werden live synchronisiert"
                : "Video failed to load — metrics are synced live"}
            </div>
          )}
        </div>
      )}
      {/* HUD overlay */}
      {castState && (
        <div className="cast-hud">
          {!showFallback && (
            <div className="cast-hud-item cast-hud-speed">
              <span className="cast-hud-value">{(castState.speed ?? 0).toFixed(1)}</span>
              <span className="cast-hud-label">km/h</span>
            </div>
          )}
          <div className="cast-hud-item">
            <span className="cast-hud-value">{castState.rpm ?? 0}</span>
            <span className="cast-hud-label">RPM</span>
          </div>
          <div className="cast-hud-item">
            <span className="cast-hud-value">{(castState.distance ?? 0).toFixed(2)}</span>
            <span className="cast-hud-label">km</span>
          </div>
          {castState.rideTime != null && (
            <div className="cast-hud-item">
              <span className="cast-hud-value">
                {Math.floor(castState.rideTime / 60).toString().padStart(2, "0")}:{(castState.rideTime % 60).toString().padStart(2, "0")}
              </span>
              <span className="cast-hud-label">{isDE ? "Zeit" : "Time"}</span>
            </div>
          )}
          {castState.gear != null && (
            <div className="cast-hud-item">
              <span className="cast-hud-value">{castState.gear}</span>
              <span className="cast-hud-label">{isDE ? "Gang" : "Gear"}</span>
            </div>
          )}
        </div>
      )}
      <div className="cast-logo">
        cyclerun<span className="header-logo-app">.app</span>
      </div>
    </div>
  );
}

export default function CastContent() {
  return <CastInner />;
}
