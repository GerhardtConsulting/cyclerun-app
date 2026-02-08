"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { pollCastState, type CastState } from "@/lib/phone-pairing";
import { initLocale, t, type Locale } from "@/lib/i18n";
import { Suspense } from "react";

function CastInner() {
  const searchParams = useSearchParams();
  const [code, setCode] = useState("");
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [status, setStatus] = useState<"input" | "connecting" | "playing" | "error">("input");
  const [errorMsg, setErrorMsg] = useState("");
  const [locale, setLocale] = useState<Locale>("en");
  const [castState, setCastState] = useState<CastState | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const lastSyncRef = useRef(0);
  const loadedUrlRef = useRef("");

  useEffect(() => {
    setLocale(initLocale());
    const urlCode = searchParams.get("code");
    if (urlCode && urlCode.length === 4) {
      setDigits(urlCode.split(""));
      setCode(urlCode);
    }
  }, [searchParams]);

  // Auto-connect when code is set from URL
  useEffect(() => {
    if (code.length === 4 && status === "input") {
      startCast(code);
    }
  }, [code]);

  const handleDigit = useCallback((index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    const fullCode = newDigits.join("");
    if (fullCode.length === 4 && newDigits.every((d) => d)) {
      setCode(fullCode);
    }
  }, [digits]);

  const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }, [digits]);

  const startCast = async (castCode: string) => {
    setStatus("connecting");
    setErrorMsg("");

    // Poll once to check if code exists
    const initial = await pollCastState(castCode);
    if (!initial) {
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
  };

  // Sync video with cast state
  useEffect(() => {
    if (!castState || !videoRef.current) return;
    const video = videoRef.current;
    const url = castState.videoUrl || "";

    // Load new video only if URL actually changed (track with ref, not video.src)
    if (url && url !== loadedUrlRef.current && !url.startsWith("blob:")) {
      loadedUrlRef.current = url;
      video.src = url;
      video.load();
      video.play().catch(() => {});
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

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const isDE = locale === "de";

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
          <p className="cast-subtitle">{isDE ? "Gib den 4-stelligen Code ein, der auf deinem Trainingsgerät angezeigt wird." : "Enter the 4-digit code shown on your training device."}</p>

          <div className="cast-digits">
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                className="cast-digit-input"
                type="tel"
                maxLength={1}
                value={d}
                onChange={(e) => handleDigit(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                autoFocus={i === 0}
              />
            ))}
          </div>

          {status === "error" && <p className="cast-error">{errorMsg}</p>}

          <button
            className="btn-primary btn-lg btn-full"
            onClick={() => { if (code.length === 4) startCast(code); }}
            disabled={code.length !== 4}
          >
            {isDE ? "Verbinden" : "Connect"}
          </button>
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
  const hasVideo = !!videoUrl && !videoUrl.startsWith("blob:");

  return (
    <div className="cast-fullscreen">
      {hasVideo ? (
        <video
          ref={videoRef}
          className="cast-video"
          autoPlay
          muted
          loop
          playsInline
        />
      ) : (
        <div className="cast-video-fallback">
          <div className="cast-fallback-speed">{(castState?.speed ?? 0).toFixed(1)}</div>
          <div className="cast-fallback-unit">km/h</div>
        </div>
      )}
      {/* HUD overlay */}
      {castState && (
        <div className="cast-hud">
          {hasVideo && (
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
  return (
    <Suspense fallback={<div className="cast-page"><div className="cast-spinner"></div></div>}>
      <CastInner />
    </Suspense>
  );
}
