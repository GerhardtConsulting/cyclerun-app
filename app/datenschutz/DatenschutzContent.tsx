"use client";

import { useState, useEffect } from "react";
import SubpageNav from "@/components/SubpageNav";
import SubpageFooter from "@/components/SubpageFooter";

const CONSENT_KEY = "cyclerun_cookie_consent";

export default function DatenschutzContent() {
  const [consentStatus, setConsentStatus] = useState<string>("pending");

  useEffect(() => {
    setConsentStatus(localStorage.getItem(CONSENT_KEY) || "pending");
    const handler = () => setConsentStatus(localStorage.getItem(CONSENT_KEY) || "pending");
    window.addEventListener("consent-changed", handler);
    return () => window.removeEventListener("consent-changed", handler);
  }, []);

  const handleRevoke = () => {
    const fn = (window as unknown as Record<string, (() => void) | undefined>).__cyclerunRevokeConsent;
    if (fn) fn();
    setConsentStatus("declined");
  };

  const handleReEnable = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setConsentStatus("accepted");
    window.dispatchEvent(new Event("consent-changed"));
    window.location.reload();
  };

  return (
    <>
      <SubpageNav />
      <div className="legal-page">

        <h1>Datenschutzerklärung</h1>
        <p className="legal-date">Stand: Februar 2026</p>

        <h2>1. Verantwortlicher</h2>
        <p>
          CycleRun.app — Free indoor cycling, built by cyclists.<br />
          Kontakt: datenschutz@cyclerun.app
        </p>

        <h2>2. Überblick</h2>
        <p>CycleRun.app nimmt den Schutz deiner persönlichen Daten sehr ernst. Wir behandeln deine personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften (DSGVO, BDSG, TTDSG) sowie dieser Datenschutzerklärung.</p>

        <h2>3. Welche Daten wir erheben</h2>

        <h3>3.1 Registrierungsdaten</h3>
        <p>Bei der Registrierung erheben wir:</p>
        <table>
          <thead>
            <tr><th>Datum</th><th>Zweck</th><th>Rechtsgrundlage</th></tr>
          </thead>
          <tbody>
            <tr><td>Vorname</td><td>Personalisierung der Nutzererfahrung</td><td>Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)</td></tr>
            <tr><td>Nachname (optional)</td><td>Personalisierung</td><td>Art. 6 Abs. 1 lit. a DSGVO</td></tr>
            <tr><td>E-Mail-Adresse</td><td>Account-Identifikation, Produkt-Updates</td><td>Art. 6 Abs. 1 lit. a DSGVO</td></tr>
            <tr><td>Bevorzugte Sportart</td><td>Produktverbesserung</td><td>Art. 6 Abs. 1 lit. a DSGVO</td></tr>
            <tr><td>Spracheinstellung</td><td>Lokalisierung</td><td>Art. 6 Abs. 1 lit. f DSGVO</td></tr>
          </tbody>
        </table>

        <h3>3.2 Webcam-Daten</h3>
        <p><strong>Wichtig: CycleRun speichert, überträgt oder verarbeitet KEINE Webcam-Bilder oder -Videos.</strong></p>
        <p>Die Webcam wird ausschließlich lokal in deinem Browser verwendet, um Bewegungen zu erkennen. Die Bildverarbeitung findet vollständig auf deinem Gerät statt (Client-Side). Es werden zu keinem Zeitpunkt Bild- oder Videodaten an unsere Server übertragen.</p>

        <h3>3.3 Trainingsdaten</h3>
        <p>Bei registrierten Nutzern werden Trainingsdaten (Dauer, Distanz, Geschwindigkeit, Trittfrequenz) gespeichert, um eine Trainingshistorie, Gamification und Leaderboards zu ermöglichen. Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung bei Registrierung).</p>

        <h3>3.4 Technische Daten</h3>
        <p>Beim Besuch unserer Website werden automatisch erhoben:</p>
        <ul>
          <li>IP-Adresse (anonymisiert)</li>
          <li>Browser-Typ und -Version</li>
          <li>Betriebssystem</li>
          <li>Zugriffszeitpunkt</li>
        </ul>
        <p>Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der technischen Bereitstellung).</p>

        <h2>4. Zweck der Datenverarbeitung</h2>
        <p>Wir verarbeiten deine Daten ausschließlich zu folgenden Zwecken:</p>
        <ul>
          <li><strong>Produktverbesserung:</strong> Nutzerdaten helfen uns, das perfekte Produkt und weitere Features zu entwickeln.</li>
          <li><strong>Personalisierung:</strong> Anpassung der Nutzererfahrung an deine Präferenzen.</li>
          <li><strong>Kommunikation:</strong> Informationen über neue Features und Updates (nur mit Einwilligung).</li>
          <li><strong>Analyse:</strong> Anonymisierte Nutzungsanalyse zur Verbesserung der Website (nur mit Einwilligung, siehe Abschnitt 7).</li>
        </ul>
        <p><strong>Es findet kein Verkauf von Daten an Dritte statt.</strong></p>

        <h2>5. Datenspeicherung &amp; Hosting</h2>
        <p>Unsere Daten werden bei folgenden Anbietern gehostet:</p>
        <ul>
          <li><strong>Supabase Inc.</strong> (Datenbank) — Server in Frankfurt/Main (eu-central-1), DSGVO-konform</li>
          <li><strong>Vercel Inc.</strong> (Website-Hosting) — Edge Network mit europäischen Nodes</li>
          <li><strong>Google LLC</strong> (Analyse, nur mit Einwilligung) — siehe Abschnitt 7</li>
          <li><strong>Resend Inc.</strong> (E-Mail-Versand) — transaktionale und Engagement-E-Mails, SCCs implementiert</li>
        </ul>
        <p>Alle Anbieter haben Standardvertragsklauseln (SCCs) gemäß Art. 46 DSGVO implementiert.</p>

        <h2>6. Deine Rechte (Art. 15–21 DSGVO)</h2>
        <p>Du hast jederzeit das Recht auf:</p>
        <ul>
          <li><strong>Auskunft</strong> über deine gespeicherten Daten (Art. 15)</li>
          <li><strong>Berichtigung</strong> unrichtiger Daten (Art. 16)</li>
          <li><strong>Löschung</strong> deiner Daten (Art. 17, &quot;Recht auf Vergessenwerden&quot;)</li>
          <li><strong>Einschränkung</strong> der Verarbeitung (Art. 18)</li>
          <li><strong>Datenübertragbarkeit</strong> (Art. 20)</li>
          <li><strong>Widerspruch</strong> gegen die Verarbeitung (Art. 21)</li>
          <li><strong>Widerruf</strong> erteilter Einwilligungen (Art. 7 Abs. 3) — mit Wirkung für die Zukunft</li>
        </ul>
        <p>Kontakt: <a href="mailto:datenschutz@cyclerun.app">datenschutz@cyclerun.app</a></p>
        <p>Du hast zudem das Recht, dich bei einer Aufsichtsbehörde zu beschweren.</p>

        <h2>7. Google Analytics</h2>
        <p>
          Diese Website nutzt Google Analytics 4 (GA4), einen Webanalysedienst der Google Ireland Limited
          (&quot;Google&quot;), Gordon House, Barrow Street, Dublin 4, Irland. Google Analytics verwendet Cookies,
          die eine Analyse deiner Benutzung der Website ermöglichen.
        </p>

        <h3>7.1 Umfang der Verarbeitung</h3>
        <p>Im Rahmen von Google Analytics werden folgende Daten erhoben:</p>
        <ul>
          <li>Anonymisierte IP-Adresse (IP-Anonymisierung ist aktiviert)</li>
          <li>Besuchte Seiten und Verweildauer</li>
          <li>Technische Informationen (Browser, Betriebssystem, Bildschirmauflösung)</li>
          <li>Herkunft des Besuchs (Referrer)</li>
          <li>Ungefährer Standort (auf Basis der anonymisierten IP)</li>
        </ul>
        <p><strong>Es werden keine personenbezogenen Daten wie Name oder E-Mail-Adresse an Google übermittelt.</strong></p>

        <h3>7.2 Rechtsgrundlage</h3>
        <p>
          Die Nutzung von Google Analytics erfolgt ausschließlich auf Grundlage deiner <strong>Einwilligung</strong> gemäß
          Art. 6 Abs. 1 lit. a DSGVO i.V.m. § 25 Abs. 1 TTDSG. Google Analytics wird <strong>erst nach deiner
          aktiven Zustimmung</strong> im Cookie-Banner geladen. Ohne deine Einwilligung findet kein Tracking statt.
          Wir verwenden zusätzlich den Google Consent Mode v2, der sicherstellt, dass ohne deine Einwilligung
          keine Analyse-Cookies gesetzt und keine Daten an Google übermittelt werden.
        </p>

        <h3>7.3 Empfänger / Datenübermittlung</h3>
        <p>
          Die erhobenen Daten werden an Google Ireland Limited und ggf. an Google LLC (USA) übermittelt.
          Die Übermittlung in die USA erfolgt auf Grundlage der EU-Standardvertragsklauseln (SCCs) gemäß Art. 46 Abs. 2 lit. c DSGVO
          sowie des EU-US Data Privacy Frameworks.
        </p>

        <h3>7.4 Speicherdauer</h3>
        <p>Die von Google Analytics gesetzten Cookies werden nach 14 Monaten automatisch gelöscht. Die Datenverarbeitung kann jederzeit widerrufen werden (siehe unten).</p>

        <h3>7.5 Widerruf der Einwilligung</h3>
        <p>
          Du kannst deine Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen.
          Beim Widerruf werden alle Google-Analytics-Cookies gelöscht und das Tracking sofort beendet.
        </p>

        {/* Consent Status + Revoke/Re-enable Button */}
        <div style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 12,
          padding: "1rem 1.25rem",
          margin: "1rem 0 1.5rem",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            <div style={{ flex: 1 }}>
              <strong style={{ fontSize: "0.85rem" }}>Aktueller Status:</strong>{" "}
              <span style={{
                fontSize: "0.8rem",
                padding: "0.15rem 0.5rem",
                borderRadius: 4,
                fontWeight: 600,
                background: consentStatus === "accepted"
                  ? "rgba(34,197,94,0.12)"
                  : consentStatus === "declined"
                    ? "rgba(239,68,68,0.12)"
                    : "rgba(251,191,36,0.12)",
                color: consentStatus === "accepted"
                  ? "#22c55e"
                  : consentStatus === "declined"
                    ? "#ef4444"
                    : "#fbbf24",
              }}>
                {consentStatus === "accepted" ? "✓ Analyse aktiv" : consentStatus === "declined" ? "✗ Analyse deaktiviert" : "⏳ Noch nicht entschieden"}
              </span>
            </div>
            {consentStatus === "accepted" ? (
              <button
                onClick={handleRevoke}
                style={{
                  padding: "0.45rem 1rem",
                  background: "transparent",
                  color: "#ef4444",
                  border: "1px solid rgba(239,68,68,0.3)",
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  cursor: "pointer",
                }}
              >
                Einwilligung widerrufen
              </button>
            ) : consentStatus === "declined" ? (
              <button
                onClick={handleReEnable}
                style={{
                  padding: "0.45rem 1rem",
                  background: "transparent",
                  color: "#22c55e",
                  border: "1px solid rgba(34,197,94,0.3)",
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  cursor: "pointer",
                }}
              >
                Analyse erneut aktivieren
              </button>
            ) : null}
          </div>
        </div>

        <p style={{ fontSize: "0.82rem", color: "#78716c" }}>
          Alternativ kannst du auch das Browser-Add-on zur Deaktivierung von Google Analytics verwenden:{" "}
          <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" style={{ color: "#f97316" }}>
            Google Analytics Opt-out
          </a>
        </p>

        <h2>8. Cookies &amp; Local Storage</h2>
        <p>CycleRun verwendet:</p>
        <table>
          <thead>
            <tr><th>Name</th><th>Typ</th><th>Zweck</th><th>Speicherdauer</th></tr>
          </thead>
          <tbody>
            <tr><td>cyclerun_cookie_consent</td><td>localStorage</td><td>Speichert deine Cookie-Einwilligung</td><td>Unbegrenzt (bis Widerruf)</td></tr>
            <tr><td>cyclerun_registered</td><td>localStorage</td><td>Registrierungsstatus</td><td>Unbegrenzt</td></tr>
            <tr><td>cyclerun_email</td><td>localStorage</td><td>Login-Session</td><td>Unbegrenzt</td></tr>
            <tr><td>cyclerun_name</td><td>localStorage</td><td>Anzeigename</td><td>Unbegrenzt</td></tr>
            <tr><td>_ga, _ga_*</td><td>Cookie</td><td>Google Analytics (nur mit Einwilligung)</td><td>14 Monate</td></tr>
          </tbody>
        </table>
        <p><strong>Technisch notwendige Daten</strong> (localStorage) werden ohne Einwilligung gespeichert, da sie für die Grundfunktion der App erforderlich sind (§ 25 Abs. 2 TTDSG).</p>
        <p><strong>Analyse-Cookies</strong> (Google Analytics) werden nur nach deiner aktiven Einwilligung gesetzt.</p>

        <h2>9. Datensicherheit</h2>
        <p>Wir setzen technische und organisatorische Maßnahmen ein:</p>
        <ul>
          <li>HTTPS-Verschlüsselung (TLS 1.3)</li>
          <li>Row Level Security (RLS) auf Datenbankebene</li>
          <li>Keine Speicherung von Passwörtern (passwortlose Registrierung)</li>
          <li>Regelmäßige Sicherheits-Audits</li>
        </ul>

        <h2>10. Aufbewahrungsfristen</h2>
        <p>Deine Daten werden gespeichert, solange dein Account besteht. Nach Löschungsanfrage werden alle personenbezogenen Daten innerhalb von 30 Tagen unwiderruflich gelöscht.</p>

        <h2>11. Änderungen</h2>
        <p>Wir behalten uns vor, diese Datenschutzerklärung anzupassen. Die aktuelle Version ist stets auf dieser Seite verfügbar.</p>
      </div>
      <SubpageFooter />
    </>
  );
}
