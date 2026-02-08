"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { PairingReceiver, pollState, type TVState } from "@/lib/phone-pairing";
import { initLocale, setLocale, getLocale, onLocaleChange, t, type Locale } from "@/lib/i18n";
import SubpageFooter from "@/components/SubpageFooter";

function FlagEN() {
  return (
    <svg width="20" height="14" viewBox="0 0 60 42" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="42" fill="#012169" />
      <path d="M0 0L60 42M60 0L0 42" stroke="#fff" strokeWidth="7" />
      <path d="M0 0L60 42M60 0L0 42" stroke="#C8102E" strokeWidth="4" />
      <path d="M30 0v42M0 21h60" stroke="#fff" strokeWidth="10" />
      <path d="M30 0v42M0 21h60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  );
}

function FlagDE() {
  return (
    <svg width="20" height="14" viewBox="0 0 60 42" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="14" fill="#000" />
      <rect y="14" width="60" height="14" fill="#D00" />
      <rect y="28" width="60" height="14" fill="#FFCE00" />
    </svg>
  );
}

const WIZARD_LABELS: Record<number, string> = {
  0: "Camera Setup",
  1: "Camera Preview",
  2: "Sport Selection",
  3: "Zone Setup",
  4: "Calibration",
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function TVPage() {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [pairCode, setPairCode] = useState("");
  const [phase, setPhase] = useState<"qr" | "connecting" | "wizard" | "riding" | "finished">("qr");
  const [tvState, setTvState] = useState<TVState | null>(null);
  const [streamActive, setStreamActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const receiverRef = useRef<PairingReceiver | null>(null);
  const statePollerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const switchLang = useCallback((lang: Locale) => {
    setLocale(lang);
    setLocaleState(lang);
  }, []);

  const startReceiver = useCallback(() => {
    const code = String(Math.floor(1000 + Math.random() * 9000));
    setPairCode(code);

    receiverRef.current?.destroy();
    const receiver = new PairingReceiver(code);
    receiverRef.current = receiver;

    receiver.onStatusChange = (s) => {
      if (s === "phone-joined" || s === "connecting") {
        setPhase("connecting");
      } else if (s === "connected") {
        setPhase("wizard");
        if (statePollerRef.current) clearInterval(statePollerRef.current);
        statePollerRef.current = setInterval(async () => {
          const st = await pollState(code);
          if (st) {
            setTvState(st);
            if (st.phase === "riding") setPhase("riding");
            else if (st.phase === "finished") setPhase("finished");
            else if (st.phase === "wizard") setPhase("wizard");
          }
        }, 500);
      }
    };

    receiver.onRemoteStream = (stream) => {
      streamRef.current = stream;
      setStreamActive(true);
    };

    receiver.start();
  }, []);

  useEffect(() => {
    const detected = initLocale();
    setLocaleState(detected);

    startReceiver();

    // Cookie consent
    if (!localStorage.getItem("cyclerun_cookie_consent")) {
      document.getElementById("cookieConsent")?.classList.add("active");
    }
    document.getElementById("cookieAccept")?.addEventListener("click", () => {
      localStorage.setItem("cyclerun_cookie_consent", "true");
      document.getElementById("cookieConsent")?.classList.remove("active");
    });

    const unsub = onLocaleChange(() => setLocaleState(getLocale()));
    return () => {
      unsub();
      receiverRef.current?.destroy();
      if (statePollerRef.current) clearInterval(statePollerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Generate QR code
  useEffect(() => {
    if (!pairCode) return;
    const pairUrl = `https://cyclerun.app?tv=${pairCode}`;
    import("qrcode").then((QRCode) => {
      const canvas = document.createElement("canvas");
      QRCode.toCanvas(canvas, pairUrl, {
        width: 280,
        margin: 2,
        color: { dark: "#ffffffee", light: "#00000000" },
      }).then(() => {
        const container = document.getElementById("tv-qr");
        if (container) {
          container.innerHTML = "";
          container.appendChild(canvas);
        }
      }).catch(() => {});
    });
  }, [pairCode]);

  return (
    <>
      {/* ============ QR / SPLASH SCREEN ============ */}
      {phase === "qr" && (
        <div className="screen active">
          <div className="splash">
            <div className="splash-glow"></div>

            <div className="lang-switcher splash-lang">
              <button className={`lang-btn${locale === 'en' ? ' active' : ''}`} onClick={() => switchLang('en')} title="English"><FlagEN /></button>
              <button className={`lang-btn${locale === 'de' ? ' active' : ''}`} onClick={() => switchLang('de')} title="Deutsch"><FlagDE /></button>
            </div>

            <div className="splash-logo">
              <span className="splash-logo-text">cyclerun<span className="splash-logo-app">.app</span></span>
            </div>

            <p className="splash-tagline">{t('tv.tagline')}</p>

            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", margin: "0.5rem 0 1rem", opacity: 0.8 }}>
              {t('tv.scan')}
            </p>

            <div className="pair-qr" id="tv-qr" style={{ margin: "1rem auto", minHeight: 280, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div className="loading-spinner" style={{ width: 40, height: 40 }}></div>
            </div>

            <div className="pair-code-display" style={{ fontSize: "2.5rem", letterSpacing: "0.5em", margin: "0.5rem 0 1rem" }}>
              {pairCode ? pairCode.split("").join(" ") : "----"}
            </div>

            <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", opacity: 0.5, marginBottom: "1.5rem" }}>
              {t('tv.code.hint')}
            </p>

            {/* UX Tips */}
            <div className="info-grid" style={{ maxWidth: 700, margin: "0 auto 1.5rem", gap: "0.75rem" }}>
              <div className="info-card" style={{ padding: "0.75rem 1rem", textAlign: "left" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-1)" strokeWidth="1.5"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>
                  <strong style={{ fontSize: "0.8rem" }}>{t('tv.tip.light')}</strong>
                </div>
              </div>
              <div className="info-card" style={{ padding: "0.75rem 1rem", textAlign: "left" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-1)" strokeWidth="1.5"><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>
                  <strong style={{ fontSize: "0.8rem" }}>{t('tv.tip.camera')}</strong>
                </div>
              </div>
              <div className="info-card" style={{ padding: "0.75rem 1rem", textAlign: "left" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-1)" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                  <strong style={{ fontSize: "0.8rem" }}>{t('tv.tip.distance')}</strong>
                </div>
              </div>
              <div className="info-card" style={{ padding: "0.75rem 1rem", textAlign: "left" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-1)" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                  <strong style={{ fontSize: "0.8rem" }}>{t('tv.tip.stable')}</strong>
                </div>
              </div>
            </div>

            <div className="splash-trust">
              <span>{t('splash.trust.local')}</span>
              <span className="splash-trust-dot"></span>
              <span>{t('splash.trust.free')}</span>
              <span className="splash-trust-dot"></span>
              <span>{t('tv.gdpr')}</span>
            </div>
          </div>
        </div>
      )}

      {/* ============ CONNECTING SCREEN ============ */}
      {phase === "connecting" && (
        <div className="screen active">
          <div className="splash">
            <div className="splash-glow"></div>
            <div className="splash-logo">
              <span className="splash-logo-text">cyclerun<span className="splash-logo-app">.app</span></span>
            </div>
            <p className="splash-tagline" style={{ color: "#22c55e" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: "middle", marginRight: 8 }}>
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" />
              </svg>
              {t('tv.connecting')}
            </p>
            <div className="loading-spinner" style={{ margin: "2rem auto" }}></div>
          </div>
        </div>
      )}

      {/* ============ WIZARD SCREEN ============ */}
      {phase === "wizard" && (
        <div className="screen active">
          <header className="app-header">
            <div className="header-logo">cyclerun<span className="header-logo-app">.app</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <span className="cam-perm-status success" style={{ margin: 0, padding: "0.25rem 0.75rem" }}>{t('tv.phone.connected')}</span>
              <div className="lang-switcher">
                <button className={`lang-btn${locale === 'en' ? ' active' : ''}`} onClick={() => switchLang('en')} title="English"><FlagEN /></button>
                <button className={`lang-btn${locale === 'de' ? ' active' : ''}`} onClick={() => switchLang('de')} title="Deutsch"><FlagDE /></button>
              </div>
            </div>
          </header>

          <div className="wizard-wrapper">
            <nav className="wizard-nav">
              <div className="step-indicator">
                {[1, 2, 3, 4].map((s) => (
                  <div key={s} className={`step-dot${(tvState?.wizardStep ?? 0) >= s ? " active" : ""}`} />
                ))}
              </div>
              <div className="step-counter">{WIZARD_LABELS[tvState?.wizardStep ?? 0] || "Setup"}</div>
            </nav>

            <div className="wizard-content">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${Math.max(tvState?.wizardStep ?? 0, 1) * 25}%` }}></div>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1, padding: "2rem" }}>
                {streamActive ? (
                  <div style={{ position: "relative", width: "100%", maxWidth: 800 }}>
                    <video
                      ref={(el) => {
                        videoRef.current = el;
                        if (el && streamRef.current && el.srcObject !== streamRef.current) {
                          el.srcObject = streamRef.current;
                          el.play().catch(() => {});
                        }
                      }}
                      autoPlay muted playsInline
                      style={{ width: "100%", borderRadius: 16, background: "#000", objectFit: "contain" }}
                    />
                  </div>
                ) : (
                  <div style={{ textAlign: "center" }}>
                    <p className="splash-tagline">Waiting for camera stream...</p>
                    <div className="loading-spinner" style={{ margin: "1rem auto" }}></div>
                  </div>
                )}
              </div>

              <p style={{ textAlign: "center", padding: "0.75rem", opacity: 0.5, fontSize: "0.85rem" }}>
                {t('tv.wizard.hint')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ============ RIDING SCREEN ============ */}
      {(phase === "riding" || phase === "finished") && (
        <div className="screen active">
          <div className="ride-logo">
            cyclerun<span className="header-logo-app">.app</span>
          </div>

          <div id="hud" className="hud" style={{ opacity: 1 }}>
            <div className="hud-top">
              <div className="speed-display">
                <div className="speed-value">{(tvState?.speed ?? 0).toFixed(1)}</div>
                <div className="speed-unit">km/h</div>
              </div>
              <div className="stats-row">
                <div className="stat-item">
                  <div className="stat-label">RPM</div>
                  <div className="stat-value">{(tvState?.rpm ?? 0).toFixed(0)}</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">{t('hud.distance')}</div>
                  <div className="stat-value">{(tvState?.distance ?? 0).toFixed(2)}</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">{t('hud.time')}</div>
                  <div className="stat-value">{formatTime(tvState?.rideTime ?? 0)}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="gear-shift" style={{ opacity: 1 }}>
            <div className="gear-shift-display">
              <span className="gear-shift-num">{tvState?.gear ?? 2}</span>
              <span className="gear-shift-label">{t('hud.gear')}</span>
            </div>
          </div>

          {streamActive && (
            <div className="webcam-minimap">
              <video
                ref={(el) => {
                  if (el && streamRef.current && el.srcObject !== streamRef.current) {
                    el.srcObject = streamRef.current;
                    el.play().catch(() => {});
                  }
                }}
                autoPlay muted playsInline
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
          )}

          {phase === "finished" && (
            <div className="ride-summary-overlay active">
              <div className="ride-summary-card">
                <div className="summary-header">
                  <div className="summary-logo">cyclerun<span className="header-logo-app">.app</span></div>
                  <h2>{t('ride.summary.title')}</h2>
                  <p className="summary-subtitle">{t('ride.summary.great')}</p>
                </div>
                <div className="summary-main-stat">
                  <span className="summary-main-value">{(tvState?.distance ?? 0).toFixed(2)}</span>
                  <span className="summary-main-unit">km</span>
                </div>
                <div className="summary-stats-grid">
                  <div className="summary-stat">
                    <span className="summary-stat-label">{t('ride.summary.duration')}</span>
                    <span className="summary-stat-value">{formatTime(tvState?.rideTime ?? 0)}</span>
                  </div>
                  <div className="summary-stat">
                    <span className="summary-stat-label">{t('ride.summary.max.speed')}</span>
                    <span className="summary-stat-value">{(tvState?.maxSpeed ?? 0).toFixed(1)} km/h</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============ COOKIE CONSENT (DSGVO) ============ */}
      <div id="cookieConsent" className="cookie-banner">
        <div className="cookie-content">
          <div className="cookie-text">
            <strong>{t('cookie.title')}</strong>
            <p>{t('cookie.text')} <Link href="/datenschutz">{t('cookie.learn')}</Link></p>
          </div>
          <div className="cookie-actions">
            <button id="cookieAccept" className="btn-primary btn-sm">{t('cookie.accept')}</button>
          </div>
        </div>
      </div>

      {/* ============ FOOTER ============ */}
      {phase === "qr" && <SubpageFooter />}
    </>
  );
}
