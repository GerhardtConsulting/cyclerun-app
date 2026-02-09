"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { initLocale, setLocale, getLocale, onLocaleChange, t, type Locale } from "@/lib/i18n";
import SubpageNav from "@/components/SubpageNav";
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

export default function CycleRunApp() {
  const [locale, setLocaleState] = useState<Locale>("en");

  const switchLang = useCallback((lang: Locale) => {
    setLocale(lang);
    setLocaleState(lang);
  }, []);

  useEffect(() => {
    const detected = initLocale();
    setLocaleState(detected);
    document.documentElement.lang = detected;

    // TV device auto-detection: redirect to /cast for confirmed Smart TV user agents
    const ua = navigator.userAgent.toLowerCase();
    const tvKeywords = ["smart-tv", "smarttv", "netcast", "webos", "tizen", "vidaa", "hbbtv", "viera", "bravia", "roku", "firetv", "fire tv", "appletv", "chromecast", "androidtv", "android tv"];
    const isTV = tvKeywords.some((kw) => ua.includes(kw));
    if (isTV && !window.location.search.includes("tv=")) {
      window.location.href = "/cast";
      return;
    }

    const unsub = onLocaleChange(() => {
      setLocaleState(getLocale());
    });

    // Import and initialize CyclingSimulator after mount
    import("@/lib/cycling-simulator").then(({ CyclingSimulator }) => {
      new CyclingSimulator();
    });

    // Splash idle registration prompt — show after 45s if not registered
    const isRegistered = localStorage.getItem("cyclerun_registered") === "true";
    let splashTimer: ReturnType<typeof setTimeout> | null = null;
    if (!isRegistered) {
      splashTimer = setTimeout(() => {
        const welcomeScreen = document.getElementById("welcomeScreen");
        if (welcomeScreen?.classList.contains("active")) {
          document.getElementById("registerOverlay")?.classList.add("active");
        }
      }, 45_000);
    }

    return () => {
      unsub();
      if (splashTimer) clearTimeout(splashTimer);
    };
  }, []);

  return (
    <>
      {/* Unified Site Header — visible on welcome + below-fold */}
      <SubpageNav />

      {/* Welcome Screen — "Instant Sweat" Splash */}
      <div id="welcomeScreen" className="screen active">
        <div className="splash">
          <div className="splash-glow"></div>

          <div className="splash-chip">
            <span className="splash-chip-dot"></span>
            {t('splash.chip')}
          </div>

          <h1 className="splash-headline">
            {t('splash.headline.1')}<span className="splash-headline-accent">{t('splash.headline.2')}</span>{t('splash.headline.3')}
          </h1>

          <p className="splash-sub">{t('splash.sub')}</p>

          <div className="sport-cards">
            <button className="sport-card" data-sport="cycling" id="startCycling">
              <div className="sport-card-bg"></div>
              <div className="sport-card-content">
                <svg className="sport-card-icon" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <circle cx="5" cy="18" r="3" /><circle cx="19" cy="18" r="3" />
                  <path d="M12 18V8l-3 4h6" />
                  <path d="M9 4h3l3 4" />
                </svg>
                <span className="sport-card-label">CYCLE</span>
                <span className="sport-card-sub">{t('splash.cycle.sub')}</span>
              </div>
            </button>

            <button className="sport-card" data-sport="running" id="startRunning">
              <div className="sport-card-bg"></div>
              <div className="sport-card-content">
                <svg className="sport-card-icon" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <circle cx="14" cy="4" r="2" />
                  <path d="M18 22l-4-8-4 2-3-3" />
                  <path d="M7 16l-3 4" />
                  <path d="M14 14l2-2 4 1" />
                </svg>
                <span className="sport-card-label">RUN</span>
                <span className="sport-card-sub">{t('splash.run.sub')}</span>
                <span className="sport-card-badge">{t('splash.run.badge')}</span>
              </div>
            </button>
          </div>

          <div className="splash-trust">
            <span>{t('splash.trust.fps')}</span>
            <span className="splash-trust-dot"></span>
            <span>{t('splash.trust.local')}</span>
            <span className="splash-trust-dot"></span>
            <span>{t('splash.trust.free')}</span>
          </div>

          <button className="splash-scroll" id="scrollToFaq">
            <span>{t('splash.learn')}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
          </button>
        </div>

        {/* Below-fold: FAQ + Info (SEO-rich content) */}
        <div className="splash-below" id="splashBelow">
          <div className="splash-below-inner">
            <section className="info-section">
              <h2>{t('info.title.1')} <span className="gradient-text">{t('info.title.2')}</span></h2>
              <p>{t('info.desc')}</p>

              <div className="info-grid">
                <div className="info-card">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2" /></svg>
                  <h3>{t('info.motion.title')}</h3>
                  <p>{t('info.motion.desc')}</p>
                </div>
                <div className="info-card">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                  <h3>{t('info.physics.title')}</h3>
                  <p>{t('info.physics.desc')}</p>
                </div>
                <div className="info-card">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M10 9l5 3-5 3V9z" /></svg>
                  <h3>{t('info.video.title')}</h3>
                  <p>{t('info.video.desc')}</p>
                </div>
              </div>
            </section>

            <section className="faq-section">
              <h2 className="faq-title">{t('faq.title')}</h2>

              <details className="faq-item">
                <summary>{t('faq.q1')}</summary>
                <p>{t('faq.a1')}</p>
              </details>

              <details className="faq-item">
                <summary>{t('faq.q2')}</summary>
                <p>{t('faq.a2')}</p>
              </details>

              <details className="faq-item">
                <summary>{t('faq.q3')}</summary>
                <p>{t('faq.a3')}</p>
              </details>

              <details className="faq-item">
                <summary>{t('faq.q4')}</summary>
                <p>{t('faq.a4')}</p>
              </details>

              <details className="faq-item">
                <summary>{t('faq.q5')}</summary>
                <p>{t('faq.a5')}</p>
              </details>

              <details className="faq-item">
                <summary>{t('faq.q6')}</summary>
                <p>{t('faq.a6')}</p>
              </details>
            </section>
          </div>
        </div>
      </div>

      {/* Countdown Overlay */}
      <div id="countdownOverlay" className="countdown-overlay">
        <div className="countdown-number" id="countdownNum">3</div>
      </div>

      {/* Setup Wizard */}
      <div id="setupScreen" className="screen">
        {/* Header with logo + lang switcher on wizard */}
        <header className="app-header">
          <div className="header-logo">cyclerun<span className="header-logo-app">.app</span></div>
          <div className="lang-switcher">
            <button className={`lang-btn${locale === 'en' ? ' active' : ''}`} onClick={() => switchLang('en')} title="English"><FlagEN /></button>
            <button className={`lang-btn${locale === 'de' ? ' active' : ''}`} onClick={() => switchLang('de')} title="Deutsch"><FlagDE /></button>
          </div>
        </header>
        <div className="wizard-wrapper">
          <nav className="wizard-nav">
            <button className="nav-back" id="wizardBack">{t('wizard.back')}</button>
            <div className="step-indicator">
              <div className="step-dot active" data-step="1"></div>
              <div className="step-dot" data-step="2"></div>
              <div className="step-dot" data-step="3"></div>
              <div className="step-dot" data-step="4"></div>
            </div>
            <div className="step-counter"><span id="currentStep">1</span>/4</div>
          </nav>

          <div className="wizard-content">
            <div className="progress-bar">
              <div className="progress-fill" id="progressFill"></div>
            </div>

            {/* Camera Permission Overlay (iPhone-style) */}
            <div id="cameraPermOverlay" className="cam-perm-overlay active">
              <div className="cam-perm-card">
                <div className="cam-perm-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" /><circle cx="12" cy="13" r="4" /></svg>
                </div>
                <h3>{t('cam.perm.title')}</h3>
                <p className="cam-perm-desc">{t('cam.perm.desc')}</p>

                <div id="camPermStatus" className="cam-perm-status"></div>

                <div id="camSelectWrapper" className="cam-select-wrapper" style={{ display: "none" }}>
                  <label className="cam-select-label">{t('cam.perm.select')}</label>
                  <select id="camSelect" className="cam-select"></select>
                </div>

                <div className="cam-perm-preview" id="camPermPreview" style={{ display: "none" }}>
                  <video id="step1Video" autoPlay muted playsInline></video>
                </div>

                <div className="cam-perm-actions">
                  <button id="requestCamera" className="btn-primary btn-lg btn-full">
                    {t('cam.perm.allow')}
                  </button>
                  <button id="startPhonePair" className="btn-secondary btn-full">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>
                    {t('pair.use.phone')}
                  </button>
                  <button id="camPermDeny" className="btn-ghost">{t('cam.perm.deny')}</button>
                </div>

                {/* Phone Pairing Panel (hidden by default) */}
                <div id="phonePairPanel" className="phone-pair-panel" style={{ display: "none" }}>
                  <div className="pair-divider"></div>
                  <h4>{t('pair.title')}</h4>
                  <p className="pair-desc">{t('pair.desc')}</p>
                  <div className="pair-qr" id="pairQrCode"></div>
                  <div className="pair-code-section">
                    <p className="pair-code-label">{t('pair.code.label')} <strong>cyclerun.app/pair</strong></p>
                    <div className="pair-code-display" id="pairCode">----</div>
                  </div>
                  <div id="pairStatus" className="pair-status">{t('pair.waiting')}</div>
                  <button id="cancelPair" className="btn-ghost btn-sm">{t('pair.skip')}</button>
                </div>

                <div className="cam-perm-tip">
                  <details>
                    <summary>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
                      {t('cam.perm.tip.title')}
                    </summary>
                    <p>{t('cam.perm.tip.tv')}</p>
                    <p>{t('cam.perm.tip.iphone')}</p>
                    <p>{t('cam.perm.tip.external')}</p>
                  </details>
                </div>
              </div>
            </div>

            {/* Step 1: Camera & Profile */}
            <div className="wizard-step" id="step1">
              <div className="step-header">
                <span className="step-label">{t('step1.label')}</span>
                <h2>{t('step1.title')}</h2>
                <p>{t('step1.desc')}</p>
              </div>

              <div className="bento-form">
                <div className="form-card form-card-lg">
                  <div className="form-card-header">
                    <div className="form-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" /><circle cx="12" cy="13" r="4" /></svg>
                    </div>
                    <div>
                      <h4>{t('step1.camera.title')}</h4>
                      <p>{t('step1.camera.desc')}</p>
                    </div>
                  </div>
                  <div id="cameraStatus" className="form-status"></div>
                  <div id="cameraPreview" className="camera-preview" style={{ display: "none" }}>
                    <video id="step1VideoMirror" autoPlay muted playsInline></video>
                    <div id="cameraLabel" className="camera-label">
                      <span className="camera-label-dot"></span>
                      <span id="cameraLabelText"></span>
                    </div>
                  </div>
                </div>

                <div className="form-card form-card-body-data">
                  <div className="body-data-header">
                    <h4>{t('step1.body.title')}</h4>
                    <span className="badge-optional">{t('step1.body.optional')}</span>
                  </div>
                  <p className="body-data-why">{t('step1.body.why')}</p>
                  <div className="body-data-grid">
                    <div className="body-input">
                      <label className="form-label">{t('step1.weight')}</label>
                      <div className="input-with-unit">
                        <input type="number" id="riderWeight" defaultValue={75} min={40} max={150} step={1} />
                        <span className="input-unit">kg</span>
                      </div>
                    </div>
                    <div className="body-input">
                      <label className="form-label">{t('step1.height')}</label>
                      <div className="input-with-unit">
                        <input type="number" id="riderHeight" defaultValue={175} min={140} max={220} step={1} />
                        <span className="input-unit">cm</span>
                      </div>
                    </div>
                    <div className="body-input">
                      <label className="form-label">{t('step1.bike')}</label>
                      <div className="input-with-unit">
                        <input type="number" id="bikeWeight" defaultValue={10} min={5} max={25} step={0.5} />
                        <span className="input-unit">kg</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button id="step1Next" className="btn-primary btn-lg btn-full step-action">
                {t('wizard.next')}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>
            </div>

            {/* Step 2: Camera Position */}
            <div className="wizard-step" id="step2">
              <div className="step-header">
                <span className="step-label">{t('step2.label')}</span>
                <h2>{t('step2.title')}</h2>
                <p>{t('step2.desc')}</p>
              </div>

              <div className="position-cards">
                <button className="position-card" data-setup="side">
                  <div className="sport-card-bg"></div>
                  <div className="position-card-content">
                    <div className="position-card-icon">
                      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                        <circle cx="16" cy="44" r="9" stroke="currentColor" strokeWidth="1.5" />
                        <circle cx="48" cy="44" r="9" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M16 44l10-18h12l10 18" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                        <path d="M26 26l6-8 6 8" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                        <circle cx="32" cy="16" r="4" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M58 30h-6" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M54 27l-3 3 3 3" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <rect x="58" y="26" width="5" height="8" rx="1" stroke="var(--text-muted)" strokeWidth="1" />
                      </svg>
                    </div>
                    <span className="position-card-label">{t('step2.side')}</span>
                    <span className="position-card-tag">{t('step2.side.tag')}</span>
                  </div>
                </button>

                <button className="position-card" data-setup="front">
                  <div className="sport-card-bg"></div>
                  <div className="position-card-content">
                    <div className="position-card-icon">
                      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                        <ellipse cx="32" cy="46" rx="12" ry="4" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M32 42V26" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M24 26h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M26 26l-2 6M38 26l2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <circle cx="32" cy="18" r="5" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M32 58v-5" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M29 55l3-3 3 3" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <rect x="28" y="58" width="8" height="5" rx="1" stroke="var(--text-muted)" strokeWidth="1" />
                      </svg>
                    </div>
                    <span className="position-card-label">{t('step2.front')}</span>
                    <span className="position-card-tag">{t('step2.front.tag')}</span>
                  </div>
                </button>

                <button className="position-card" data-setup="custom">
                  <div className="sport-card-bg"></div>
                  <div className="position-card-content">
                    <div className="position-card-icon">
                      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                        <rect x="12" y="12" width="40" height="40" rx="4" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" />
                        <path d="M32 18v28M18 32h28" stroke="currentColor" strokeWidth="1" opacity="0.4" />
                        <path d="M16 22V16h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M48 22V16h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M16 42v6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M48 42v6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="32" cy="32" r="3" fill="currentColor" opacity="0.3" />
                      </svg>
                    </div>
                    <span className="position-card-label">{t('step2.manual')}</span>
                    <span className="position-card-tag">{t('step2.manual.tag')}</span>
                  </div>
                </button>
              </div>

              <p className="step-hint">{t('step2.hint')}</p>
            </div>

            {/* Step 3: Zone Setup */}
            <div className="wizard-step" id="step3">
              <div className="step-header">
                <span className="step-label">{t('step3.label')}</span>
                <h2>{t('step3.title')}</h2>
                <p>{t('step3.desc')}</p>
              </div>

              <div className="zone-editor">
                <div className="zone-preview">
                  <video id="zoneSetupVideo" autoPlay muted playsInline></video>
                  <canvas id="zoneCanvas"></canvas>
                  <div className="zone-overlay-stats">
                    <div className="overlay-stat">
                      <span className="overlay-value" id="testRpm">0</span>
                      <span className="overlay-label">RPM</span>
                    </div>
                    <div className="overlay-stat">
                      <span className="overlay-value" id="testSpeed">0.0</span>
                      <span className="overlay-label">km/h</span>
                    </div>
                  </div>
                </div>

                <div className="zone-sidebar">
                  <div className="sidebar-section">
                    <h4>{t('step3.zones')}</h4>
                    <div className="zone-actions">
                      <button id="addZone" className="btn-icon">
                        <span>+</span> {t('step3.add')}
                      </button>
                      <button id="clearZones" className="btn-icon btn-ghost">
                        <span>×</span> {t('step3.clear')}
                      </button>
                    </div>
                    <div id="zoneCount" className="zone-counter">{t('sim.zones.count', { n: 0 })}</div>
                  </div>

                  <div className="sidebar-section">
                    <h4>{t('step3.resistance')}</h4>
                    <div className="gear-selector">
                      <button className="gear-btn" data-gear="1">
                        <span className="gear-num">1</span>
                        <span>{t('step3.light')}</span>
                      </button>
                      <button className="gear-btn active" data-gear="2">
                        <span className="gear-num">2</span>
                        <span>{t('step3.medium')}</span>
                      </button>
                      <button className="gear-btn" data-gear="3">
                        <span className="gear-num">3</span>
                        <span>{t('step3.heavy')}</span>
                      </button>
                    </div>
                    <span id="testGear" className="gear-hint">{t('step3.gear.hint')}</span>
                  </div>

                  <div className="sidebar-section">
                    <h4>{t('step3.speed.title')}</h4>
                    <div className="calibration-slider">
                      <input type="range" id="speedScaleSlider" min={0.3} max={2.0} step={0.1} defaultValue={1.0} className="strength-slider" />
                      <div className="slider-labels">
                        <span>{t('step3.slower')}</span>
                        <span id="speedScaleValue">1.0x</span>
                        <span>{t('step3.faster')}</span>
                      </div>
                    </div>
                    <span className="gear-hint">{t('step3.speed.hint')}</span>
                  </div>

                  <div className="sidebar-help">
                    <div className="help-title">{t('step3.help.title')}</div>
                    <ul className="help-list">
                      <li>{t('step3.help.1')}</li>
                      <li>{t('step3.help.2')}</li>
                      <li>{t('step3.help.3')}</li>
                    </ul>
                  </div>
                </div>
              </div>

              <button id="step3Next" className="btn-primary btn-lg btn-full step-action">
                {t('wizard.next')}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>
            </div>

            {/* Step 4: Ready */}
            <div className="wizard-step" id="step4">
              <div className="step-header">
                <span className="step-label">{t('step4.label')}</span>
                <h2>{t('step4.title')}</h2>
                <p>{t('step4.desc')}</p>
              </div>

              <div className="ready-preview">
                <div className="preview-video-container">
                  <video id="calibrationVideo" autoPlay muted playsInline></video>
                  <canvas id="calibrationCanvas"></canvas>
                </div>

                <div className="ready-stats">
                  <div className="ready-stat main-stat">
                    <span className="ready-value" id="calSpeedValue">0.0</span>
                    <span className="ready-label">km/h</span>
                  </div>
                  <div className="ready-stat">
                    <span className="ready-value" id="calRpmValue">0</span>
                    <span className="ready-label">RPM</span>
                  </div>
                </div>

                <div className="ready-checklist">
                  <div className="check-item" id="check-zones">
                    <span className="check-icon">○</span>
                    <span>{t('step4.zones')}</span>
                  </div>
                  <div className="check-item" id="check-motion">
                    <span className="check-icon">○</span>
                    <span>{t('step4.motion')}</span>
                  </div>
                  <div className="check-item" id="check-speed">
                    <span className="check-icon">○</span>
                    <span>{t('step4.speed')}</span>
                  </div>
                </div>
              </div>

              <div className="ready-actions">
                <button id="startRideBtn" className="btn-primary btn-lg btn-full">
                  <span>{t('step4.start')}</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>
          </div>

          <div className="wizard-footer">
            <button id="prevStep" className="btn-ghost">{t('wizard.back')}</button>
            <button id="nextStep" className="btn-primary" style={{ display: "none" }}>{t('wizard.next')} →</button>
          </div>
        </div>
      </div>

      {/* Main Ride Screen */}
      <div id="rideScreen" className="screen">
        {/* Logo overlay top-left */}
        <div className="ride-logo">
          cyclerun<span className="header-logo-app">.app</span>
        </div>

        <video id="rideVideo" loop muted></video>

        {/* Gear shift — right side */}
        <div className="gear-shift" id="gearShift">
          <button id="gearUp" className="gear-shift-btn" aria-label="Gear up">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6" /></svg>
          </button>
          <div className="gear-shift-display">
            <span className="gear-shift-num" id="rideGearNum">2</span>
            <span className="gear-shift-label" id="rideGearLabel">{t('hud.gear')}</span>
          </div>
          <button id="gearDown" className="gear-shift-btn" aria-label="Gear down">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
          </button>
        </div>

        {/* Control buttons — top right */}
        <div className="ride-controls">
          <button id="rideCastBtn" className="btn-control" title={t('cast.tooltip')} aria-label="Cast">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 16.1A5 5 0 015.9 20M2 12.05A9 9 0 019.95 20M2 8V6a2 2 0 012-2h16a2 2 0 012 2v12a2 2 0 01-2 2h-6" />
              <circle cx="2" cy="20" r="0" fill="currentColor" />
            </svg>
          </button>
          <button id="toggleWebcam" className="btn-control" aria-label="Toggle webcam">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" /><circle cx="12" cy="13" r="4" /></svg>
          </button>
          <button id="pauseRide" className="btn-control" aria-label="Pause ride">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
          </button>
          <button id="stopRide" className="btn-control" aria-label="Stop ride">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="4" y="4" width="16" height="16" rx="2" /></svg>
          </button>
        </div>

        {/* Cast overlay — appears when casting */}
        <div id="rideCastOverlay" className="ride-cast-overlay" style={{ display: "none" }}>
          <div id="rideCastQr" className="ride-cast-qr"></div>
          <div className="ride-cast-code" id="rideCastCode">----</div>
          <div className="ride-cast-url" id="rideCastUrl">cyclerun.app/cast</div>
          <div className="ride-cast-hint">{t('cast.hint')}</div>
          <div id="rideCastLocalWarn" className="ride-cast-local-warn" style={{ display: "none" }}>{t('cast.local_warn')}</div>
        </div>

        <div id="hud" className="hud">
          <div className="hud-top">
            <div className="speed-display">
              <div className="speed-value" id="speedValue">0.0</div>
              <div className="speed-unit">km/h</div>
            </div>
            <div className="stats-row">
              <div className="stat-item">
                <div className="stat-label">RPM</div>
                <div className="stat-value" id="rpmValue">0</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">{t('hud.distance')}</div>
                <div className="stat-value" id="distanceValue">0.0</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">{t('hud.time')}</div>
                <div className="stat-value" id="timeValue">00:00</div>
              </div>
            </div>
          </div>
        </div>

        <div id="webcamMinimap" className="webcam-minimap hidden">
          <video id="webcamMinimapVideo" autoPlay muted></video>
          <canvas id="minimapCanvas"></canvas>
        </div>

        <div id="videoModal" className="modal">
          <div className="modal-content">
            <h3>{t('video.title')}</h3>
            <div className="video-options">
              {/* Marketplace Routes — coming soon */}
              <div className="video-section">
                <div className="video-section-label">{t('video.featured')}</div>
                <button id="useDefaultVideo" className="btn-primary btn-full">{t('video.demo')}</button>
                <p className="video-hint">{t('video.coming')}</p>
              </div>

              <div className="divider">{t('video.or')}</div>

              {/* URL Input */}
              <div className="video-section">
                <div className="video-section-label">{t('video.url.label')}</div>
                <div className="video-url-input">
                  <input type="url" id="videoUrlInput" placeholder={t('video.url.placeholder')} className="input-url" />
                  <button id="loadVideoUrl" className="btn-secondary">{t('video.url.load')}</button>
                </div>
                <p className="video-hint">{t('video.url.hint')}</p>
              </div>

              {/* Local Upload */}
              <div className="video-section">
                <div className="video-section-label">{t('video.upload.label')}</div>
                <input type="file" id="videoUpload" accept="video/*" className="file-input" />
                <label htmlFor="videoUpload" className="btn-secondary btn-full">{t('video.upload.btn')}</label>
                <p className="video-privacy-notice">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                  {t('video.privacy')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Nudge (gamification badge — bottom left) */}
        <div id="regNudge" className="reg-nudge">
          <div className="reg-nudge-timer">
            <svg className="nudge-ring" viewBox="0 0 36 36">
              <circle className="nudge-ring-bg" cx="18" cy="18" r="16" />
              <circle className="nudge-ring-fg" id="nudgeRingFg" cx="18" cy="18" r="16" />
            </svg>
            <span className="nudge-countdown" id="nudgeCountdown">30</span>
          </div>
          <div className="reg-nudge-body">
            <strong>{t('nudge.title')}</strong>
            <span>{t('nudge.desc')}</span>
          </div>
          <button id="nudgeRegister" className="btn-primary btn-sm">{t('nudge.cta')}</button>
          <button id="nudgeDismiss" className="reg-nudge-close" aria-label="Dismiss">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Disconnect Badge (persistent when not registered) */}
        <button id="disconnectBadge" className="disconnect-badge" title={t('disconnect.tooltip')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M18.36 6.64a9 9 0 11-12.73 0" />
            <line x1="12" y1="2" x2="12" y2="12" />
          </svg>
        </button>

        {/* Registration Popup */}
        <div id="registerOverlay" className="register-overlay" onClick={(e) => { if (e.target === e.currentTarget) document.getElementById("registerOverlay")?.classList.remove("active"); }}>
          <div className="register-card">
            <button className="register-close" onClick={() => document.getElementById("registerOverlay")?.classList.remove("active")} aria-label="Close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
            <div className="register-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            </div>
            <h2>{t('reg.title')}</h2>
            <p className="register-subtitle">{t('reg.subtitle')}</p>

            <form id="registerForm" className="register-form">
              <div className="register-row">
                <div className="register-field">
                  <input type="text" id="regName" placeholder={t('reg.first')} required />
                </div>
                <div className="register-field">
                  <input type="text" id="regLastName" placeholder={t('reg.last')} />
                </div>
              </div>
              <div className="register-field">
                <input type="email" id="regEmail" placeholder={t('reg.email')} required />
              </div>
              <label className="register-consent">
                <input type="checkbox" id="regConsent" required />
                <span>{t('reg.consent')} <Link href="/datenschutz" target="_blank">{t('reg.privacy')}</Link>{t('reg.consent.2')}</span>
              </label>
              <label className="register-consent newsletter-opt">
                <input type="checkbox" id="regNewsletter" />
                <span>{t('newsletter.opt_in')}</span>
              </label>
              <button type="submit" className="btn-primary btn-lg btn-full register-submit">
                {t('reg.submit')}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>
            </form>

            <p className="register-hint">{t('reg.hint')}</p>
          </div>
        </div>

        {/* Post-Ride Summary */}
        <div id="rideSummary" className="ride-summary-overlay">
          <div className="ride-summary-card">
            <div className="summary-header">
              <div className="summary-logo">cyclerun<span className="header-logo-app">.app</span></div>
              <h2>{t('ride.summary.title')}</h2>
              <p className="summary-subtitle">{t('ride.summary.great')}</p>
            </div>

            <div className="summary-main-stat">
              <span className="summary-main-value" id="summaryDistance">0.00</span>
              <span className="summary-main-unit">km</span>
            </div>

            <div className="summary-stats-grid">
              <div className="summary-stat">
                <span className="summary-stat-label">{t('ride.summary.duration')}</span>
                <span className="summary-stat-value" id="summaryDuration">0:00</span>
              </div>
              <div className="summary-stat">
                <span className="summary-stat-label">{t('ride.summary.avg.speed')}</span>
                <span className="summary-stat-value"><span id="summaryAvgSpeed">0.0</span> km/h</span>
              </div>
              <div className="summary-stat">
                <span className="summary-stat-label">{t('ride.summary.max.speed')}</span>
                <span className="summary-stat-value"><span id="summaryMaxSpeed">0.0</span> km/h</span>
              </div>
              <div className="summary-stat">
                <span className="summary-stat-label">{t('ride.summary.avg.rpm')}</span>
                <span className="summary-stat-value" id="summaryAvgRpm">0</span>
              </div>
              <div className="summary-stat">
                <span className="summary-stat-label">{t('ride.summary.calories')}</span>
                <span className="summary-stat-value" id="summaryCalories">~0</span>
              </div>
            </div>

            {/* Gamification results (populated dynamically after ride) */}
            <div id="summaryGamification" className="summary-stats-grid" style={{ display: "none", borderTop: "1px solid var(--border)", paddingTop: "0.75rem", marginTop: "0.5rem" }}></div>

            <div className="summary-actions">
              <button id="downloadShareCard" className="btn-primary btn-full">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                {t('ride.summary.share')}
              </button>
              <p className="summary-share-hint">{t('ride.summary.share.hint')}</p>
            </div>

            {/* Inline claim form for unregistered users — no redirect */}
            <div id="summaryClaim" className="summary-claim">
              <div className="summary-claim-header">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                <strong>{t('claim.title')}</strong>
              </div>
              <p className="summary-claim-desc">{t('claim.desc')}</p>
              <form id="summaryClaimForm" className="summary-claim-form">
                <div className="summary-claim-row">
                  <input type="text" id="claimName" placeholder={t('reg.first')} required className="summary-claim-input" />
                  <input type="email" id="claimEmail" placeholder={t('reg.email')} required className="summary-claim-input" />
                </div>
                <label className="summary-claim-consent">
                  <input type="checkbox" id="claimConsent" required />
                  <span>{t('reg.consent')} <Link href="/datenschutz" target="_blank">{t('reg.privacy')}</Link>{t('reg.consent.2')}</span>
                </label>
                <button type="submit" className="btn-primary btn-full summary-claim-submit" id="claimSubmitBtn">
                  {t('claim.submit')}
                </button>
              </form>
              <div id="summaryClaimSuccess" className="summary-claim-success" style={{ display: "none" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                <span>{t('claim.success')}</span>
              </div>
            </div>

            <div className="summary-footer-actions">
              <button id="summaryRideAgain" className="btn-primary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 4v6h6" /><path d="M3.51 15a9 9 0 102.13-9.36L1 10" /></svg>
                {t('ride.summary.ride.again')}
              </button>
              <button id="summaryDone" className="btn-ghost">{t('ride.summary.done')}</button>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "0.5rem", fontSize: "0.8rem" }}>
              <Link href="/profile" style={{ color: "var(--accent-1)" }}>⚡ {t('g.profile')}</Link>
              <Link href="/leaderboard" style={{ color: "var(--text-muted)" }}>🏆 {t('g.leaderboard')}</Link>
            </div>
          </div>
        </div>

      </div>

      {/* Goal Capture Overlay — appears after ride, minimal friction */}
      <div id="goalCaptureOverlay" className="overlay" style={{ zIndex: 1100 }}>
        <div className="overlay-content" style={{ maxWidth: 380, textAlign: "center" }}>
          <h2 id="goalCaptureTitle" style={{ fontSize: "1.1rem", marginBottom: "0.75rem", color: "var(--text-primary)" }}></h2>
          <div id="goalCaptureOptions" style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center" }}></div>
          <button id="goalCaptureSkip" className="btn-ghost" style={{ marginTop: "0.75rem", fontSize: "0.8rem", opacity: 0.6 }}>{t('goal.skip')}</button>
        </div>
      </div>

      {/* Loading Overlay */}
      <div id="loadingOverlay" className="loading-overlay hidden">
        <div className="loading-spinner"></div>
        <p id="loadingText">{t('loading')}</p>
      </div>

      {/* Unified Footer — same as all subpages */}
      <SubpageFooter />
    </>
  );
}
