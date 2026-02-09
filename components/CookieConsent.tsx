"use client";

import { useState, useEffect } from "react";

const CONSENT_KEY = "cyclerun_cookie_consent";

type ConsentState = "pending" | "accepted" | "declined";

/* ── gtag helper ────────────────────────────────────── */
// gtag.js + consent defaults are loaded in layout.tsx <head>.
// This component only updates the consent state.
function gtag(...args: unknown[]) {
  const w = window as unknown as Record<string, unknown>;
  if (typeof w.gtag === "function") {
    (w.gtag as (...a: unknown[]) => void)(...args);
  }
}

function getConsent(): ConsentState {
  if (typeof window === "undefined") return "pending";
  return (localStorage.getItem(CONSENT_KEY) as ConsentState) || "pending";
}

function grantConsent() {
  gtag("consent", "update", { analytics_storage: "granted" });
}

function revokeConsent() {
  gtag("consent", "update", { analytics_storage: "denied" });
  // Clear any GA cookies that were set while consent was granted
  const cookies = document.cookie.split(";");
  for (const c of cookies) {
    const name = c.split("=")[0].trim();
    if (name.startsWith("_ga") || name.startsWith("_gid") || name.startsWith("_gat")) {
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    }
  }
}

/** Expose globally so Datenschutz page can trigger revoke */
if (typeof window !== "undefined") {
  (window as unknown as Record<string, (() => void) | undefined>).__cyclerunRevokeConsent = () => {
    localStorage.setItem(CONSENT_KEY, "declined");
    revokeConsent();
    window.dispatchEvent(new Event("consent-changed"));
  };
}

export default function CookieConsent() {
  const [consent, setConsent] = useState<ConsentState>("pending");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = getConsent();
    setConsent(stored);
    if (stored === "accepted") {
      grantConsent();
    }
    if (stored === "pending") {
      // Short delay so banner doesn't flash on initial load
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }

    const handler = () => {
      setConsent(getConsent());
    };
    window.addEventListener("consent-changed", handler);
    return () => window.removeEventListener("consent-changed", handler);
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setConsent("accepted");
    setVisible(false);
    grantConsent();
  };

  const handleDecline = () => {
    localStorage.setItem(CONSENT_KEY, "declined");
    setConsent("declined");
    setVisible(false);
    revokeConsent();
  };

  // Detect locale
  const isDE = typeof navigator !== "undefined" && navigator.language?.startsWith("de");

  if (consent !== "pending" || !visible) return null;

  return (
    <div
      role="dialog"
      aria-label={isDE ? "Cookie-Einstellungen" : "Cookie Settings"}
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 99999,
        padding: "0 1rem 1rem",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          maxWidth: 520,
          margin: "0 auto",
          background: "#141414",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 16,
          padding: "1.25rem 1.5rem",
          boxShadow: "0 -4px 40px rgba(0,0,0,0.5)",
          pointerEvents: "auto",
          animation: "cookieFadeIn 0.4s ease",
        }}
      >
        <div style={{ fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.5rem", color: "#fafaf9" }}>
          🍪 {isDE ? "Cookie-Einstellungen" : "Cookie Settings"}
        </div>
        <p style={{ fontSize: "0.78rem", color: "#a8a29e", lineHeight: 1.6, margin: "0 0 1rem" }}>
          {isDE
            ? "Wir nutzen Google Analytics, um die Nutzung unserer Seite zu verstehen und zu verbessern. Dabei werden anonymisierte Daten an Google übermittelt. Du kannst deine Einwilligung jederzeit in der Datenschutzerklärung widerrufen."
            : "We use Google Analytics to understand and improve our site usage. Anonymized data is sent to Google. You can revoke your consent anytime in our Privacy Policy."}
        </p>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <button
            onClick={handleAccept}
            style={{
              flex: 1,
              minWidth: 120,
              padding: "0.55rem 1rem",
              background: "linear-gradient(135deg, #f97316, #ea580c)",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontWeight: 700,
              fontSize: "0.8rem",
              cursor: "pointer",
            }}
          >
            {isDE ? "Akzeptieren" : "Accept"}
          </button>
          <button
            onClick={handleDecline}
            style={{
              flex: 1,
              minWidth: 120,
              padding: "0.55rem 1rem",
              background: "transparent",
              color: "#a8a29e",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8,
              fontWeight: 600,
              fontSize: "0.8rem",
              cursor: "pointer",
            }}
          >
            {isDE ? "Nur notwendige" : "Necessary only"}
          </button>
        </div>
        <div style={{ marginTop: "0.5rem", textAlign: "center" }}>
          <a
            href="/datenschutz"
            style={{ fontSize: "0.68rem", color: "#57534e", textDecoration: "underline" }}
          >
            {isDE ? "Datenschutzerklärung" : "Privacy Policy"}
          </a>
        </div>
      </div>

      <style>{`
        @keyframes cookieFadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
