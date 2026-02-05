"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function CycleRunApp() {
  useEffect(() => {
    // Import and initialize CyclingSimulator after mount
    import("@/lib/cycling-simulator").then(({ CyclingSimulator }) => {
      new CyclingSimulator();
    });

    // Cookie consent
    if (!localStorage.getItem("cyclerun_cookie_consent")) {
      document.getElementById("cookieConsent")?.classList.add("active");
    }
    document.getElementById("cookieAccept")?.addEventListener("click", () => {
      localStorage.setItem("cyclerun_cookie_consent", "true");
      document.getElementById("cookieConsent")?.classList.remove("active");
    });
  }, []);

  return (
    <>
      {/* Welcome Screen — "Instant Sweat" Splash */}
      <div id="welcomeScreen" className="screen active">
        <div className="splash">
          <div className="splash-glow"></div>

          <div className="splash-logo">
            <span className="splash-logo-text">CycleRun</span>
            <span className="splash-logo-dot"></span>
          </div>

          <p className="splash-tagline">No smart trainer. No subscription. Just your webcam.</p>

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
                <span className="sport-card-sub">Spinning · Ergometer · Indoor Bike</span>
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
                <span className="sport-card-sub">Treadmill · Coming Soon</span>
                <span className="sport-card-badge">Soon</span>
              </div>
            </button>
          </div>

          <div className="splash-trust">
            <span>60 FPS Tracking</span>
            <span className="splash-trust-dot"></span>
            <span>100% Local</span>
            <span className="splash-trust-dot"></span>
            <span>Free forever</span>
          </div>

          <button className="splash-scroll" id="scrollToFaq">
            <span>Learn more</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
          </button>
        </div>

        {/* Below-fold: FAQ + Info (SEO-rich content) */}
        <div className="splash-below" id="splashBelow">
          <div className="splash-below-inner">
            <section className="info-section">
              <h2>Your living room. <span className="gradient-text">Your route.</span></h2>
              <p>CycleRun transforms every home trainer workout into an immersive experience. Your webcam detects your movement — no smart trainer, no sensors, no subscription. Perfect for spinning bikes, ergometers, old home trainers and soon treadmills too.</p>

              <div className="info-grid">
                <div className="info-card">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2" /></svg>
                  <h3>Motion Tracking</h3>
                  <p>AI-powered motion detection measures your cadence in real-time — right in your browser.</p>
                </div>
                <div className="info-card">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                  <h3>Physics Engine</h3>
                  <p>Realistic acceleration, inertia and gear shifting. Feels like riding outdoors.</p>
                </div>
                <div className="info-card">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M10 9l5 3-5 3V9z" /></svg>
                  <h3>Any Video</h3>
                  <p>Use your own POV videos or browse featured routes. Your pace controls the speed.</p>
                </div>
              </div>
            </section>

            <section className="faq-section">
              <h2 className="faq-title">Frequently Asked Questions</h2>

              <details className="faq-item">
                <summary>Is CycleRun really free?</summary>
                <p>Yes, CycleRun is a community project and completely free. No subscription, no premium version, no hidden costs. You just need a webcam and a browser.</p>
              </details>

              <details className="faq-item">
                <summary>Which devices are compatible?</summary>
                <p>CycleRun works with any home trainer where legs move visibly: spinning bikes, ergometers, old home trainers, indoor bikes — even devices without Bluetooth or smart features. Running mode for treadmills is in development.</p>
              </details>

              <details className="faq-item">
                <summary>How does it work without sensors?</summary>
                <p>Your webcam detects your leg movement using AI-powered image analysis. You place detection zones over your knees or pedals — the software automatically recognizes your cadence. All processing runs locally in your browser.</p>
              </details>

              <details className="faq-item">
                <summary>How is this different from Zwift or Rouvy?</summary>
                <p>Zwift requires a smart trainer (from €300) and costs €17.99/month. Rouvy is similar. CycleRun is free and only uses your webcam — ideal if you want to upgrade your existing home trainer without investing in expensive hardware.</p>
              </details>

              <details className="faq-item">
                <summary>Are my webcam images stored?</summary>
                <p>No. All image processing happens exclusively locally in your browser. No images or videos are transmitted to our servers. Your privacy matters to us.</p>
              </details>

              <details className="faq-item">
                <summary>Can I use my old ergometer?</summary>
                <p>Yes! Whether your ergometer is 5 or 25 years old — as long as your legs move, CycleRun detects the motion. No smart trainer or sensors needed.</p>
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
        <div className="wizard-wrapper">
          <nav className="wizard-nav">
            <button className="nav-back" id="wizardBack">← Back</button>
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

            {/* Step 1: Camera & Profile */}
            <div className="wizard-step active" id="step1">
              <div className="step-header">
                <span className="step-label">Step 1</span>
                <h2>Let&apos;s get started</h2>
                <p>We need access to your camera and some info for the physics calculation.</p>
              </div>

              <div className="bento-form">
                <div className="form-card form-card-lg">
                  <div className="form-card-header">
                    <div className="form-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" /><circle cx="12" cy="13" r="4" /></svg>
                    </div>
                    <div>
                      <h4>Camera Access</h4>
                      <p>For motion detection</p>
                    </div>
                  </div>
                  <button id="requestCamera" className="btn-primary btn-full">
                    <span>Enable Camera</span>
                  </button>
                  <div id="cameraStatus" className="form-status"></div>
                  <div id="cameraPreview" className="camera-preview" style={{ display: "none" }}>
                    <video id="step1Video" autoPlay muted playsInline></video>
                  </div>
                </div>

                <div className="form-card">
                  <label className="form-label">Weight</label>
                  <div className="input-with-unit">
                    <input type="number" id="riderWeight" defaultValue={75} min={40} max={150} step={1} />
                    <span className="input-unit">kg</span>
                  </div>
                  <span className="form-hint">For inertia calculation</span>
                </div>

                <div className="form-card">
                  <label className="form-label">Height</label>
                  <div className="input-with-unit">
                    <input type="number" id="riderHeight" defaultValue={175} min={140} max={220} step={1} />
                    <span className="input-unit">cm</span>
                  </div>
                  <span className="form-hint">For air resistance</span>
                </div>

                <div className="form-card">
                  <label className="form-label">Bike</label>
                  <div className="input-with-unit">
                    <input type="number" id="bikeWeight" defaultValue={10} min={5} max={25} step={0.5} />
                    <span className="input-unit">kg</span>
                  </div>
                  <span className="form-hint">Total mass</span>
                </div>
              </div>

              <button id="step1Next" className="btn-primary btn-lg btn-full step-action" style={{ display: "none" }}>
                Next
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>
            </div>

            {/* Step 2: Camera Position */}
            <div className="wizard-step" id="step2">
              <div className="step-header">
                <span className="step-label">Step 2</span>
                <h2>Camera Position</h2>
                <p>Choose the perspective of your webcam.</p>
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
                    <span className="position-card-label">SIDE</span>
                    <span className="position-card-tag">Recommended</span>
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
                    <span className="position-card-label">FRONT</span>
                    <span className="position-card-tag">Both legs</span>
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
                    <span className="position-card-label">MANUAL</span>
                    <span className="position-card-tag">Flexible</span>
                  </div>
                </button>
              </div>

              <p className="step-hint">Side view recommended — knee movement is more clearly visible.</p>
            </div>

            {/* Step 3: Zone Setup */}
            <div className="wizard-step" id="step3">
              <div className="step-header">
                <span className="step-label">Step 3</span>
                <h2>Detection Zones</h2>
                <p>Position the zones over your knees or pedals. They flash when motion is detected.</p>
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
                    <h4>Zones</h4>
                    <div className="zone-actions">
                      <button id="addZone" className="btn-icon">
                        <span>+</span> Add pair
                      </button>
                      <button id="clearZones" className="btn-icon btn-ghost">
                        <span>×</span> Clear all
                      </button>
                    </div>
                    <div id="zoneCount" className="zone-counter">0 of 2 pairs</div>
                  </div>

                  <div className="sidebar-section">
                    <h4>Resistance</h4>
                    <div className="gear-selector">
                      <button className="gear-btn" data-gear="1">
                        <span className="gear-num">1</span>
                        <span>Light</span>
                      </button>
                      <button className="gear-btn active" data-gear="2">
                        <span className="gear-num">2</span>
                        <span>Medium</span>
                      </button>
                      <button className="gear-btn" data-gear="3">
                        <span className="gear-num">3</span>
                        <span>Heavy</span>
                      </button>
                    </div>
                    <span id="testGear" className="gear-hint">Higher resistance = more power needed for same speed</span>
                  </div>

                  <div className="sidebar-section">
                    <h4>Speed Calibration</h4>
                    <div className="calibration-slider">
                      <input type="range" id="speedScaleSlider" min={0.3} max={2.0} step={0.1} defaultValue={1.0} className="strength-slider" />
                      <div className="slider-labels">
                        <span>Slower</span>
                        <span id="speedScaleValue">1.0x</span>
                        <span>Faster</span>
                      </div>
                    </div>
                    <span className="gear-hint">Adjust if speed feels too high or too low</span>
                  </div>

                  <div className="sidebar-help">
                    <div className="help-title">How it works:</div>
                    <ul className="help-list">
                      <li>Drag zones with your mouse</li>
                      <li>Corner dot = resize</li>
                      <li>Pedal to test detection</li>
                    </ul>
                  </div>
                </div>
              </div>

              <button id="step3Next" className="btn-primary btn-lg btn-full step-action">
                Next
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>
            </div>

            {/* Step 4: Ready */}
            <div className="wizard-step" id="step4">
              <div className="step-header">
                <span className="step-label">Step 4</span>
                <h2>Ready to ride!</h2>
                <p>Test your setup with a few pedal strokes. The display should respond to your movement.</p>
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
                    <span>Zones placed</span>
                  </div>
                  <div className="check-item" id="check-motion">
                    <span className="check-icon">○</span>
                    <span>Motion detected</span>
                  </div>
                  <div className="check-item" id="check-speed">
                    <span className="check-icon">○</span>
                    <span>Speed &gt; 0</span>
                  </div>
                </div>
              </div>

              <div className="ready-actions">
                <button id="startRideBtn" className="btn-primary btn-lg btn-full">
                  <span>Start ride</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>
          </div>

          <div className="wizard-footer">
            <button id="prevStep" className="btn-ghost">← Back</button>
            <button id="nextStep" className="btn-primary" style={{ display: "none" }}>Next →</button>
          </div>
        </div>
      </div>

      {/* Main Ride Screen */}
      <div id="rideScreen" className="screen">
        <video id="rideVideo" loop muted></video>

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
                <div className="stat-label">Distance</div>
                <div className="stat-value" id="distanceValue">0.0</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Time</div>
                <div className="stat-value" id="timeValue">00:00</div>
              </div>
            </div>
          </div>

          <div className="hud-controls">
            <div className="strength-control">
              <label>Strength</label>
              <input type="range" id="strengthSlider" min={1} max={10} defaultValue={5} className="strength-slider" />
              <span id="strengthValue">5</span>
            </div>
            <div className="control-buttons">
              <button id="toggleWebcam" className="btn-control">📷</button>
              <button id="pauseRide" className="btn-control">⏸️</button>
              <button id="stopRide" className="btn-control">⏹️</button>
            </div>
          </div>
        </div>

        <div id="webcamMinimap" className="webcam-minimap hidden">
          <video id="webcamMinimapVideo" autoPlay muted></video>
          <canvas id="minimapCanvas"></canvas>
        </div>

        <div id="videoModal" className="modal">
          <div className="modal-content">
            <h3>Choose your route</h3>
            <div className="video-options">
              {/* Marketplace Routes — coming soon */}
              <div className="video-section">
                <div className="video-section-label">Featured Routes</div>
                <button id="useDefaultVideo" className="btn-primary btn-full">Demo Route (Sample Video)</button>
                <p className="video-hint">More routes coming soon — creators can submit POV videos.</p>
              </div>

              <div className="divider">or use your own video</div>

              {/* URL Input */}
              <div className="video-section">
                <div className="video-section-label">Paste Video URL</div>
                <div className="video-url-input">
                  <input type="url" id="videoUrlInput" placeholder="https://example.com/ride.mp4" className="input-url" />
                  <button id="loadVideoUrl" className="btn-secondary">Load</button>
                </div>
                <p className="video-hint">Direct link to MP4 or WebM file</p>
              </div>

              {/* Local Upload */}
              <div className="video-section">
                <div className="video-section-label">Upload from Device</div>
                <input type="file" id="videoUpload" accept="video/*" className="file-input" />
                <label htmlFor="videoUpload" className="btn-secondary btn-full">Choose local video file</label>
                <p className="video-privacy-notice">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                  Your video stays on your device. Nothing is uploaded to our servers.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Popup */}
        <div id="registerOverlay" className="register-overlay">
          <div className="register-card">
            <div className="register-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            </div>
            <h2>Keep riding for free</h2>
            <p className="register-subtitle">Register now to continue your training and save your stats.</p>

            <form id="registerForm" className="register-form">
              <div className="register-row">
                <div className="register-field">
                  <input type="text" id="regName" placeholder="First name" required />
                </div>
                <div className="register-field">
                  <input type="text" id="regLastName" placeholder="Last name (optional)" />
                </div>
              </div>
              <div className="register-field">
                <input type="email" id="regEmail" placeholder="Email address" required />
              </div>
              <label className="register-consent">
                <input type="checkbox" id="regConsent" required />
                <span>I agree to the <Link href="/datenschutz" target="_blank">Privacy Policy</Link>. My data will only be used to improve the product.</span>
              </label>
              <button type="submit" className="btn-primary btn-lg btn-full register-submit">
                Register for free &amp; continue riding
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>
            </form>

            <p className="register-hint">No password needed. No costs. Community project, non-profit.</p>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      <div id="loadingOverlay" className="loading-overlay hidden">
        <div className="loading-spinner"></div>
        <p id="loadingText">Loading...</p>
      </div>

      {/* Cookie Consent Banner */}
      <div id="cookieConsent" className="cookie-banner">
        <div className="cookie-content">
          <div className="cookie-text">
            <strong>Your privacy matters.</strong>
            <p>CycleRun only uses technically necessary cookies and localStorage. No tracking, no ads, no Google Analytics. <Link href="/datenschutz">Learn more</Link></p>
          </div>
          <div className="cookie-actions">
            <button id="cookieAccept" className="btn-primary btn-sm">Got it</button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="site-footer" id="siteFooter">
        <div className="footer-links">
          <Link href="/datenschutz">Privacy Policy</Link>
          <Link href="/impressum">Legal Notice</Link>
          <span className="footer-divider">·</span>
          <span className="footer-copy">© 2026 CycleRun.app — Community project, non-profit</span>
        </div>
      </footer>
    </>
  );
}
