"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { initLocale, type Locale } from "@/lib/i18n";

function ConfirmInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [locale, setLoc] = useState<Locale>("en");

  const status = searchParams.get("status") || "pending";
  const email = searchParams.get("email") || "";
  const name = searchParams.get("name") || "";
  const reason = searchParams.get("reason") || "";
  const isDE = locale === "de";

  useEffect(() => {
    setLoc(initLocale());
  }, []);

  // Auto-login on success and redirect to profile
  useEffect(() => {
    if (status === "success" && email) {
      localStorage.setItem("cyclerun_email", email.toLowerCase());
      localStorage.setItem("cyclerun_registered", "true");
      if (name) localStorage.setItem("cyclerun_name", name);
      // Redirect to profile after short delay
      const timer = setTimeout(() => router.push("/profile"), 3000);
      return () => clearTimeout(timer);
    }
  }, [status, email, name, router]);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#050505",
      color: "#fafaf9",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', sans-serif",
      padding: "1rem",
    }}>
      <div style={{ textAlign: "center", maxWidth: 480, padding: "2rem" }}>
        {/* Logo */}
        <div style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "2rem" }}>
          cyclerun<span style={{
            background: "linear-gradient(135deg, #fbbf24, #f97316, #dc2626)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>.app</span>
        </div>

        {status === "pending" && (
          <>
            {/* Mail icon */}
            <div style={{
              width: 80, height: 80, borderRadius: "50%",
              background: "linear-gradient(135deg, rgba(249,115,22,0.15), rgba(249,115,22,0.05))",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 1.5rem", fontSize: "2.5rem",
            }}>✉️</div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.75rem" }}>
              {isDE ? "Prüfe dein Postfach" : "Check your inbox"}
            </h1>
            <p style={{ color: "#a8a29e", lineHeight: 1.7, marginBottom: "1.5rem" }}>
              {isDE
                ? "Wir haben dir eine Bestätigungs-E-Mail geschickt. Klicke auf den Link in der E-Mail, um dein Profil zu aktivieren."
                : "We sent you a confirmation email. Click the link in the email to activate your profile."}
            </p>
            <div style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 12, padding: "1rem 1.5rem",
              fontSize: "0.85rem", color: "#78716c", lineHeight: 1.6,
            }}>
              {isDE
                ? "Tipp: Schau auch im Spam-Ordner nach. Der Link ist 48 Stunden gültig."
                : "Tip: Check your spam folder too. The link is valid for 48 hours."}
            </div>
          </>
        )}

        {status === "success" && (
          <>
            <div style={{
              width: 80, height: 80, borderRadius: "50%",
              background: "linear-gradient(135deg, rgba(34,197,94,0.15), rgba(34,197,94,0.05))",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 1.5rem", fontSize: "2.5rem",
            }}>✓</div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.75rem" }}>
              {isDE ? `Willkommen${name ? `, ${name}` : ""}!` : `Welcome${name ? `, ${name}` : ""}!`}
            </h1>
            <p style={{ color: "#a8a29e", lineHeight: 1.7, marginBottom: "1.5rem" }}>
              {isDE
                ? "Dein Profil ist aktiv. Ab jetzt werden alle deine Fahrten gespeichert."
                : "Your profile is active. From now on, all your rides will be saved."}
            </p>

            {/* What you unlocked — bento boxes */}
            <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap", justifyContent: "center" }}>
              {[
                { icon: "📊", label: isDE ? "Profil & Stats" : "Profile & Stats" },
                { icon: "🏆", label: isDE ? "Rangliste" : "Leaderboard" },
                { icon: "⚡", label: isDE ? "Energie & Level" : "Energy & Levels" },
              ].map((item, i) => (
                <div key={i} style={{
                  background: i === 0
                    ? "linear-gradient(135deg, rgba(249,115,22,0.08), rgba(249,115,22,0.02))"
                    : "rgba(255,255,255,0.03)",
                  border: `1px solid ${i === 0 ? "rgba(249,115,22,0.15)" : "rgba(255,255,255,0.06)"}`,
                  borderRadius: 12, padding: "0.75rem 1rem", flex: "1 1 120px", minWidth: 120,
                }}>
                  <div style={{ fontSize: "1.25rem", marginBottom: "0.25rem" }}>{item.icon}</div>
                  <div style={{ fontSize: "0.75rem", color: "#d6d3d1", fontWeight: 600 }}>{item.label}</div>
                </div>
              ))}
            </div>

            <p style={{ fontSize: "0.8rem", color: "#78716c", marginBottom: "1.5rem" }}>
              {isDE ? "Du wirst gleich weitergeleitet..." : "Redirecting you shortly..."}
            </p>

            <Link href="/profile" style={{
              display: "inline-block", padding: "0.75rem 2rem",
              background: "linear-gradient(135deg, #f97316, #ea580c)",
              color: "#fff", textDecoration: "none", borderRadius: 12,
              fontWeight: 700, fontSize: "0.95rem",
            }}>
              {isDE ? "Zum Profil →" : "Go to Profile →"}
            </Link>
          </>
        )}

        {status === "already" && (
          <>
            <div style={{
              width: 80, height: 80, borderRadius: "50%",
              background: "linear-gradient(135deg, rgba(34,197,94,0.15), rgba(34,197,94,0.05))",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 1.5rem", fontSize: "2.5rem",
            }}>✓</div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.75rem" }}>
              {isDE ? "Bereits bestätigt" : "Already confirmed"}
            </h1>
            <p style={{ color: "#a8a29e", lineHeight: 1.7, marginBottom: "1.5rem" }}>
              {isDE
                ? "Deine E-Mail wurde bereits bestätigt. Du kannst dich jederzeit einloggen."
                : "Your email has already been confirmed. You can log in anytime."}
            </p>
            <Link href="/" style={{
              display: "inline-block", padding: "0.75rem 2rem",
              background: "linear-gradient(135deg, #f97316, #ea580c)",
              color: "#fff", textDecoration: "none", borderRadius: 12,
              fontWeight: 700, fontSize: "0.95rem",
            }}>
              {isDE ? "Jetzt losfahren" : "Start riding"}
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.75rem" }}>
              {isDE ? "Link ungültig" : "Invalid link"}
            </h1>
            <p style={{ color: "#a8a29e", lineHeight: 1.7, marginBottom: "1.5rem" }}>
              {reason === "expired"
                ? (isDE ? "Der Bestätigungslink ist abgelaufen. Registriere dich erneut." : "The confirmation link has expired. Please register again.")
                : (isDE ? "Dieser Link ist ungültig." : "This link is invalid.")}
            </p>
            <Link href="/" style={{
              display: "inline-block", padding: "0.75rem 2rem",
              background: "linear-gradient(135deg, #f97316, #ea580c)",
              color: "#fff", textDecoration: "none", borderRadius: 12,
              fontWeight: 700, fontSize: "0.95rem",
            }}>
              {isDE ? "Zur Startseite" : "Go to homepage"}
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#050505" }} />}>
      <ConfirmInner />
    </Suspense>
  );
}
