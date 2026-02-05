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

          <p className="splash-tagline">Kein Smart Trainer. Kein Abo. Nur deine Webcam.</p>

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
                <span className="sport-card-sub">Laufband · Coming Soon</span>
                <span className="sport-card-badge">Bald</span>
              </div>
            </button>
          </div>

          <div className="splash-trust">
            <span>60 FPS Tracking</span>
            <span className="splash-trust-dot"></span>
            <span>100% Lokal</span>
            <span className="splash-trust-dot"></span>
            <span>Kostenlos für immer</span>
          </div>

          <button className="splash-scroll" id="scrollToFaq">
            <span>Mehr erfahren</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
          </button>
        </div>

        {/* Below-fold: FAQ + Info (SEO-rich content) */}
        <div className="splash-below" id="splashBelow">
          <div className="splash-below-inner">
            <section className="info-section">
              <h2>Dein Wohnzimmer. <span className="gradient-text">Deine Strecke.</span></h2>
              <p>CycleRun verwandelt jedes Heimtrainer-Workout in ein immersives Erlebnis. Deine Webcam erkennt deine Bewegung — kein Smart Trainer, keine Sensoren, kein Abo. Perfekt für Spinning-Bikes, Ergometer, alte Heimtrainer und bald auch Laufbänder.</p>

              <div className="info-grid">
                <div className="info-card">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2" /></svg>
                  <h3>Motion Tracking</h3>
                  <p>KI-gestützte Bewegungserkennung erkennt deine Trittfrequenz in Echtzeit — direkt im Browser.</p>
                </div>
                <div className="info-card">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                  <h3>Physik-Engine</h3>
                  <p>Realistische Beschleunigung, Trägheit und Gangschaltung. Fühlt sich an wie draußen.</p>
                </div>
                <div className="info-card">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M10 9l5 3-5 3V9z" /></svg>
                  <h3>Jedes Video</h3>
                  <p>Lade eigene POV-Videos oder nutze die Featured Routes. Dein Tempo bestimmt die Geschwindigkeit.</p>
                </div>
              </div>
            </section>

            <section className="faq-section">
              <h2 className="faq-title">Häufige Fragen</h2>

              <details className="faq-item">
                <summary>Ist CycleRun wirklich kostenlos?</summary>
                <p>Ja, CycleRun ist ein Community-Projekt und vollständig kostenlos. Kein Abo, keine Premium-Version, keine versteckten Kosten. Du brauchst nur eine Webcam und einen Browser.</p>
              </details>

              <details className="faq-item">
                <summary>Welche Geräte sind kompatibel?</summary>
                <p>CycleRun funktioniert mit jedem Heimtrainer, bei dem sich Beine sichtbar bewegen: Spinning-Bikes, Ergometer, alte Heimtrainer, Indoor Bikes — auch Geräte ohne Bluetooth oder Smart-Funktionen. Der Running-Modus für Laufbänder ist in Entwicklung.</p>
              </details>

              <details className="faq-item">
                <summary>Wie funktioniert das ohne Sensoren?</summary>
                <p>Deine Webcam erkennt die Bewegung deiner Beine per KI-gestützter Bildanalyse. Du platzierst Erkennungszonen über deinen Knien oder Pedalen — die Software erkennt automatisch deine Trittfrequenz. Die gesamte Verarbeitung läuft lokal in deinem Browser.</p>
              </details>

              <details className="faq-item">
                <summary>Was ist der Unterschied zu Zwift oder Rouvy?</summary>
                <p>Zwift erfordert einen Smart Trainer (ab €300) und kostet €17,99/Monat. Rouvy ähnlich. CycleRun ist kostenlos und nutzt nur deine Webcam — ideal, wenn du deinen vorhandenen Heimtrainer aufwerten möchtest, ohne in teure Hardware zu investieren.</p>
              </details>

              <details className="faq-item">
                <summary>Werden meine Webcam-Bilder gespeichert?</summary>
                <p>Nein. Die gesamte Bildverarbeitung findet ausschließlich lokal in deinem Browser statt. Es werden keine Bilder oder Videos an unsere Server übertragen. Deine Privatsphäre ist uns wichtig.</p>
              </details>

              <details className="faq-item">
                <summary>Kann ich mein altes Ergometer verwenden?</summary>
                <p>Ja! Egal ob dein Ergometer 5 oder 25 Jahre alt ist — solange sich deine Beine bewegen, erkennt CycleRun die Bewegung. Du brauchst keinen Smart Trainer und keine Sensoren.</p>
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
            <button className="nav-back" id="wizardBack">← Zurück</button>
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
                <span className="step-label">Schritt 1</span>
                <h2>Lass uns starten</h2>
                <p>Wir brauchen Zugriff auf deine Kamera und ein paar Infos für die Physik-Berechnung.</p>
              </div>

              <div className="bento-form">
                <div className="form-card form-card-lg">
                  <div className="form-card-header">
                    <div className="form-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" /><circle cx="12" cy="13" r="4" /></svg>
                    </div>
                    <div>
                      <h4>Kamera-Zugriff</h4>
                      <p>Für die Bewegungserkennung</p>
                    </div>
                  </div>
                  <button id="requestCamera" className="btn-primary btn-full">
                    <span>Kamera aktivieren</span>
                  </button>
                  <div id="cameraStatus" className="form-status"></div>
                  <div id="cameraPreview" className="camera-preview" style={{ display: "none" }}>
                    <video id="step1Video" autoPlay muted playsInline></video>
                  </div>
                </div>

                <div className="form-card">
                  <label className="form-label">Gewicht</label>
                  <div className="input-with-unit">
                    <input type="number" id="riderWeight" defaultValue={75} min={40} max={150} step={1} />
                    <span className="input-unit">kg</span>
                  </div>
                  <span className="form-hint">Für Trägheitsberechnung</span>
                </div>

                <div className="form-card">
                  <label className="form-label">Größe</label>
                  <div className="input-with-unit">
                    <input type="number" id="riderHeight" defaultValue={175} min={140} max={220} step={1} />
                    <span className="input-unit">cm</span>
                  </div>
                  <span className="form-hint">Für Luftwiderstand</span>
                </div>

                <div className="form-card">
                  <label className="form-label">Fahrrad</label>
                  <div className="input-with-unit">
                    <input type="number" id="bikeWeight" defaultValue={10} min={5} max={25} step={0.5} />
                    <span className="input-unit">kg</span>
                  </div>
                  <span className="form-hint">Gesamtmasse</span>
                </div>
              </div>

              <button id="step1Next" className="btn-primary btn-lg btn-full step-action" style={{ display: "none" }}>
                Weiter
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>
            </div>

            {/* Step 2: Camera Position */}
            <div className="wizard-step" id="step2">
              <div className="step-header">
                <span className="step-label">Schritt 2</span>
                <h2>Kamera-Position</h2>
                <p>Wähle die Perspektive deiner Webcam.</p>
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
                    <span className="position-card-label">SEITE</span>
                    <span className="position-card-tag">Empfohlen</span>
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
                    <span className="position-card-label">FRONTAL</span>
                    <span className="position-card-tag">Beide Beine</span>
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
                    <span className="position-card-label">MANUELL</span>
                    <span className="position-card-tag">Flexibel</span>
                  </div>
                </button>
              </div>

              <p className="step-hint">Seitenansicht empfohlen — Kniebewegung ist deutlicher sichtbar.</p>
            </div>

            {/* Step 3: Zone Setup */}
            <div className="wizard-step" id="step3">
              <div className="step-header">
                <span className="step-label">Schritt 3</span>
                <h2>Erkennungszonen</h2>
                <p>Positioniere die Zonen über deinen Knien oder Pedalen. Sie blinken rot, wenn Bewegung erkannt wird.</p>
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
                    <h4>Zonen</h4>
                    <div className="zone-actions">
                      <button id="addZone" className="btn-icon">
                        <span>+</span> Paar hinzufügen
                      </button>
                      <button id="clearZones" className="btn-icon btn-ghost">
                        <span>×</span> Alle löschen
                      </button>
                    </div>
                    <div id="zoneCount" className="zone-counter">0 von 2 Paaren</div>
                  </div>

                  <div className="sidebar-section">
                    <h4>Widerstand</h4>
                    <div className="gear-selector">
                      <button className="gear-btn" data-gear="1">
                        <span className="gear-num">1</span>
                        <span>Leicht</span>
                      </button>
                      <button className="gear-btn active" data-gear="2">
                        <span className="gear-num">2</span>
                        <span>Mittel</span>
                      </button>
                      <button className="gear-btn" data-gear="3">
                        <span className="gear-num">3</span>
                        <span>Schwer</span>
                      </button>
                    </div>
                    <span id="testGear" className="gear-hint">Höherer Widerstand = mehr Kraft für gleiche Geschwindigkeit</span>
                  </div>

                  <div className="sidebar-section">
                    <h4>Geschwindigkeits-Kalibrierung</h4>
                    <div className="calibration-slider">
                      <input type="range" id="speedScaleSlider" min={0.3} max={2.0} step={0.1} defaultValue={1.0} className="strength-slider" />
                      <div className="slider-labels">
                        <span>Langsamer</span>
                        <span id="speedScaleValue">1.0x</span>
                        <span>Schneller</span>
                      </div>
                    </div>
                    <span className="gear-hint">Passe an, falls die Geschwindigkeit zu hoch oder niedrig ist</span>
                  </div>

                  <div className="sidebar-help">
                    <div className="help-title">So funktioniert&apos;s:</div>
                    <ul className="help-list">
                      <li>Ziehe Zonen mit der Maus</li>
                      <li>Eck-Punkt = Größe ändern</li>
                      <li>Tritt in die Pedale zum Testen</li>
                    </ul>
                  </div>
                </div>
              </div>

              <button id="step3Next" className="btn-primary btn-lg btn-full step-action">
                Weiter
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>
            </div>

            {/* Step 4: Ready */}
            <div className="wizard-step" id="step4">
              <div className="step-header">
                <span className="step-label">Schritt 4</span>
                <h2>Bereit zum Fahren!</h2>
                <p>Teste dein Setup mit ein paar Tritten. Die Anzeige sollte auf deine Bewegung reagieren.</p>
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
                    <span>Zonen platziert</span>
                  </div>
                  <div className="check-item" id="check-motion">
                    <span className="check-icon">○</span>
                    <span>Bewegung erkannt</span>
                  </div>
                  <div className="check-item" id="check-speed">
                    <span className="check-icon">○</span>
                    <span>Geschwindigkeit &gt; 0</span>
                  </div>
                </div>
              </div>

              <div className="ready-actions">
                <button id="startRideBtn" className="btn-primary btn-lg btn-full">
                  <span>Fahrt starten</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>
          </div>

          <div className="wizard-footer">
            <button id="prevStep" className="btn-ghost">← Zurück</button>
            <button id="nextStep" className="btn-primary" style={{ display: "none" }}>Weiter →</button>
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
                <div className="stat-label">Distanz</div>
                <div className="stat-value" id="distanceValue">0.0</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Zeit</div>
                <div className="stat-value" id="timeValue">00:00</div>
              </div>
            </div>
          </div>

          <div className="hud-controls">
            <div className="strength-control">
              <label>Stärke</label>
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
            <h3>Video auswählen</h3>
            <div className="video-options">
              <button id="useDefaultVideo" className="btn-primary">Standard-Video verwenden</button>
              <div className="divider">oder</div>
              <input type="file" id="videoUpload" accept="video/*" className="file-input" />
              <label htmlFor="videoUpload" className="btn-secondary">Eigenes Video hochladen</label>
            </div>
          </div>
        </div>

        {/* Registration Popup */}
        <div id="registerOverlay" className="register-overlay">
          <div className="register-card">
            <div className="register-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            </div>
            <h2>Kostenlos weiterfahren</h2>
            <p className="register-subtitle">Registriere dich jetzt, um dein Training fortzusetzen und deine Statistiken zu speichern.</p>

            <form id="registerForm" className="register-form">
              <div className="register-row">
                <div className="register-field">
                  <input type="text" id="regName" placeholder="Vorname" required />
                </div>
                <div className="register-field">
                  <input type="text" id="regLastName" placeholder="Nachname (optional)" />
                </div>
              </div>
              <div className="register-field">
                <input type="email" id="regEmail" placeholder="E-Mail-Adresse" required />
              </div>
              <label className="register-consent">
                <input type="checkbox" id="regConsent" required />
                <span>Ich stimme der <Link href="/datenschutz" target="_blank">Datenschutzerklärung</Link> zu. Meine Daten werden nur zur Verbesserung des Produkts verwendet.</span>
              </label>
              <button type="submit" className="btn-primary btn-lg btn-full register-submit">
                Kostenfrei registrieren &amp; weiterfahren
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>
            </form>

            <p className="register-hint">Kein Passwort nötig. Keine Kosten. Community-Projekt ohne Gewinnabsicht.</p>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      <div id="loadingOverlay" className="loading-overlay hidden">
        <div className="loading-spinner"></div>
        <p id="loadingText">Lade...</p>
      </div>

      {/* Cookie Consent Banner */}
      <div id="cookieConsent" className="cookie-banner">
        <div className="cookie-content">
          <div className="cookie-text">
            <strong>Datenschutz ist uns wichtig.</strong>
            <p>CycleRun verwendet nur technisch notwendige Cookies und localStorage. Kein Tracking, keine Werbung, kein Google Analytics. <Link href="/datenschutz">Mehr erfahren</Link></p>
          </div>
          <div className="cookie-actions">
            <button id="cookieAccept" className="btn-primary btn-sm">Verstanden</button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="site-footer" id="siteFooter">
        <div className="footer-links">
          <Link href="/datenschutz">Datenschutz</Link>
          <Link href="/impressum">Impressum</Link>
          <span className="footer-divider">·</span>
          <span className="footer-copy">© 2026 CycleRun.app — Community-Projekt ohne Gewinnabsicht</span>
        </div>
      </footer>
    </>
  );
}
