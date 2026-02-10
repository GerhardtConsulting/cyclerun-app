"use client";

import Link from "next/link";
import { useLocale } from "@/lib/useLocale";
import SubpageNav from "@/components/SubpageNav";
import SubpageFooter from "@/components/SubpageFooter";

export default function TransparencyContent() {
  const locale = useLocale();
  const isDE = locale === "de";

  return (
    <div className="subpage">
      <SubpageNav />
      <main className="subpage-main">
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem 1rem 4rem" }}>
          
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span style={{
              display: "inline-block", padding: "0.35rem 0.75rem", borderRadius: 8,
              background: "linear-gradient(135deg, rgba(34,197,94,0.1), rgba(22,163,74,0.05))",
              border: "1px solid rgba(34,197,94,0.2)", fontSize: "0.75rem", fontWeight: 600,
              color: "#22c55e", marginBottom: "1rem",
            }}>
              🔒 {isDE ? "DSGVO-konform" : "GDPR Compliant"}
            </span>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "0.5rem" }}>
              {isDE ? "Transparenzbericht" : "Transparency Report"}
            </h1>
            <p style={{ color: "var(--text-muted)", maxWidth: 500, margin: "0 auto" }}>
              {isDE
                ? "Wie CycleRun deine Daten verarbeitet und deine Privatsphäre schützt."
                : "How CycleRun processes your data and protects your privacy."
              }
            </p>
          </div>

          {/* Trust Badges */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "1rem", marginBottom: "2.5rem",
          }}>
            <TrustBadge icon="🔐" title="SSL/TLS" desc={isDE ? "256-bit verschlüsselt" : "256-bit encrypted"} />
            <TrustBadge icon="🇪🇺" title="DSGVO" desc={isDE ? "EU-Datenschutz" : "EU Privacy Law"} />
            <TrustBadge icon="🚫" title={isDE ? "Kein Tracking" : "No Tracking"} desc={isDE ? "Keine Analytics" : "No Analytics"} />
            <TrustBadge icon="💻" title={isDE ? "100% Lokal" : "100% Local"} desc={isDE ? "Kamera bleibt privat" : "Camera stays private"} />
          </div>

          {/* Data Processing */}
          <Section
            title={isDE ? "Was wir speichern" : "What We Store"}
            icon="📦"
          >
            <DataItem
              title={isDE ? "Profildaten" : "Profile Data"}
              desc={isDE
                ? "Name, E-Mail, Sprache, Avatar — für dein persönliches Konto"
                : "Name, email, language, avatar — for your personal account"
              }
              legal="Art. 6(1)(b) DSGVO"
            />
            <DataItem
              title={isDE ? "Trainingsstatistiken" : "Training Statistics"}
              desc={isDE
                ? "Distanz, Dauer, Geschwindigkeit, Kadenz, Kalorien — für deinen Fortschritt"
                : "Distance, duration, speed, cadence, calories — for your progress"
              }
              legal="Art. 6(1)(b) DSGVO"
            />
            <DataItem
              title={isDE ? "Gamification" : "Gamification"}
              desc={isDE
                ? "Level, Energy, Badges, Streaks — für Motivation und Leaderboard"
                : "Level, Energy, Badges, Streaks — for motivation and leaderboard"
              }
              legal="Art. 6(1)(b) DSGVO"
            />
          </Section>

          {/* What We DON'T Store */}
          <Section
            title={isDE ? "Was wir NICHT speichern" : "What We DON'T Store"}
            icon="🚫"
            accent
          >
            <NoDataItem text={isDE ? "Kamera-Bilder oder -Videos" : "Camera images or videos"} />
            <NoDataItem text={isDE ? "Werbedaten oder Werbe-IDs" : "Advertising data or ad IDs"} />
            <NoDataItem text={isDE ? "Standortdaten (GPS)" : "Location data (GPS)"} />
            <NoDataItem text={isDE ? "Daten an Dritte verkauft" : "Data sold to third parties"} />
          </Section>

          {/* Analytics Disclosure */}
          <Section
            title={isDE ? "Analytics & Cookies" : "Analytics & Cookies"}
            icon="📊"
          >
            <DataItem
              title="Google Analytics 4"
              desc={isDE
                ? "Anonymisierte Nutzungsstatistiken zur Verbesserung der App. Nur mit deiner Einwilligung aktiviert (Consent Mode v2)."
                : "Anonymous usage statistics to improve the app. Only activated with your consent (Consent Mode v2)."
              }
              legal="Art. 6(1)(a) DSGVO"
            />
            <DataItem
              title={isDE ? "Technisch notwendige Cookies" : "Technically necessary cookies"}
              desc={isDE
                ? "localStorage für Spracheinstellung und Login-Status. Keine Tracking-Cookies ohne Einwilligung."
                : "localStorage for language settings and login status. No tracking cookies without consent."
              }
              legal="Art. 6(1)(f) DSGVO"
            />
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.5rem", padding: "0.75rem", background: "rgba(255,255,255,0.02)", borderRadius: 8 }}>
              {isDE
                ? "💡 Du kannst deine Einwilligung jederzeit widerrufen — lösche einfach die Cookies in deinem Browser."
                : "💡 You can withdraw your consent at any time — just delete the cookies in your browser."
              }
            </div>
          </Section>

          {/* Technology Stack */}
          <Section
            title={isDE ? "Technologie & Hosting" : "Technology & Hosting"}
            icon="🛠️"
          >
            <TechItem
              name="Vercel"
              desc={isDE ? "Hosting (EU-Region, Frankfurt)" : "Hosting (EU Region, Frankfurt)"}
              url="https://vercel.com/legal/privacy-policy"
            />
            <TechItem
              name="Supabase"
              desc={isDE ? "Datenbank (EU-Region, Frankfurt)" : "Database (EU Region, Frankfurt)"}
              url="https://supabase.com/privacy"
            />
            <TechItem
              name="Resend"
              desc={isDE ? "E-Mail-Versand (DSGVO-konform)" : "Email delivery (GDPR compliant)"}
              url="https://resend.com/legal/privacy-policy"
            />
            <TechItem
              name="Cloudflare"
              desc={isDE ? "CDN & DDoS-Schutz" : "CDN & DDoS protection"}
              url="https://www.cloudflare.com/privacypolicy/"
            />
          </Section>

          {/* Your Rights */}
          <Section
            title={isDE ? "Deine Rechte" : "Your Rights"}
            icon="⚖️"
          >
            <RightItem
              article="Art. 15"
              title={isDE ? "Auskunftsrecht" : "Right of Access"}
              desc={isDE
                ? "Du kannst jederzeit eine vollständige Kopie aller deiner Daten anfordern."
                : "You can request a complete copy of all your data at any time."
              }
              action={isDE ? "Im Profil → Daten herunterladen" : "In Profile → Download Your Data"}
            />
            <RightItem
              article="Art. 16"
              title={isDE ? "Recht auf Berichtigung" : "Right to Rectification"}
              desc={isDE
                ? "Du kannst deine persönlichen Daten jederzeit in deinem Profil bearbeiten."
                : "You can edit your personal data at any time in your profile."
              }
              action={isDE ? "Im Profil bearbeiten" : "Edit in Profile"}
            />
            <RightItem
              article="Art. 17"
              title={isDE ? "Recht auf Löschung" : "Right to Erasure"}
              desc={isDE
                ? "Du kannst deinen Account und alle Daten dauerhaft löschen lassen."
                : "You can permanently delete your account and all data."
              }
              action={isDE ? "Im Profil → Account löschen" : "In Profile → Delete Account"}
            />
            <RightItem
              article="Art. 20"
              title={isDE ? "Recht auf Datenübertragbarkeit" : "Right to Data Portability"}
              desc={isDE
                ? "Der Datenexport erfolgt im maschinenlesbaren JSON-Format."
                : "Data export is provided in machine-readable JSON format."
              }
              action={isDE ? "JSON-Export per E-Mail" : "JSON export via email"}
            />
          </Section>

          {/* Contact */}
          <div style={{
            background: "var(--card-bg)", border: "1px solid var(--border)",
            borderRadius: 14, padding: "1.5rem", textAlign: "center", marginTop: "2rem",
          }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>
              {isDE ? "Fragen zum Datenschutz?" : "Privacy Questions?"}
            </h3>
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
              {isDE
                ? "Wir antworten in der Regel innerhalb von 24 Stunden."
                : "We typically respond within 24 hours."
              }
            </p>
            <a
              href="mailto:datenschutz@cyclerun.app"
              style={{
                display: "inline-block", padding: "0.6rem 1.25rem",
                background: "linear-gradient(135deg, #f97316, #ea580c)",
                color: "#fff", borderRadius: 10, fontWeight: 600, fontSize: "0.9rem",
                textDecoration: "none",
              }}
            >
              datenschutz@cyclerun.app
            </a>
          </div>

          {/* Legal Links */}
          <div style={{ textAlign: "center", marginTop: "2rem", fontSize: "0.85rem" }}>
            <Link href="/datenschutz" style={{ color: "var(--text-muted)", marginRight: "1.5rem" }}>
              {isDE ? "Datenschutzerklärung" : "Privacy Policy"}
            </Link>
            <Link href="/impressum" style={{ color: "var(--text-muted)" }}>
              {isDE ? "Impressum" : "Legal Notice"}
            </Link>
          </div>

        </div>
      </main>
      <SubpageFooter />
    </div>
  );
}

function TrustBadge({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div style={{
      background: "var(--card-bg)", border: "1px solid var(--border)",
      borderRadius: 12, padding: "1rem", textAlign: "center",
    }}>
      <div style={{ fontSize: "1.5rem", marginBottom: "0.35rem" }}>{icon}</div>
      <div style={{ fontWeight: 700, fontSize: "0.85rem" }}>{title}</div>
      <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{desc}</div>
    </div>
  );
}

function Section({ title, icon, accent, children }: { title: string; icon: string; accent?: boolean; children: React.ReactNode }) {
  return (
    <div style={{
      background: accent ? "linear-gradient(135deg, rgba(34,197,94,0.05), rgba(22,163,74,0.02))" : "var(--card-bg)",
      border: accent ? "1px solid rgba(34,197,94,0.15)" : "1px solid var(--border)",
      borderRadius: 14, padding: "1.5rem", marginBottom: "1.5rem",
    }}>
      <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
        {icon} {title}
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {children}
      </div>
    </div>
  );
}

function DataItem({ title, desc, legal }: { title: string; desc: string; legal: string }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)",
      borderRadius: 10, padding: "0.85rem",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: "0.15rem" }}>{title}</div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{desc}</div>
        </div>
        <span style={{
          fontSize: "0.65rem", padding: "0.2rem 0.5rem", borderRadius: 6,
          background: "rgba(249,115,22,0.1)", color: "#f97316", whiteSpace: "nowrap",
        }}>
          {legal}
        </span>
      </div>
    </div>
  );
}

function NoDataItem({ text }: { text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem" }}>
      <span style={{ color: "#22c55e" }}>✓</span>
      <span>{text}</span>
    </div>
  );
}

function TechItem({ name, desc, url }: { name: string; desc: string; url: string }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "0.75rem", background: "rgba(255,255,255,0.02)",
      border: "1px solid rgba(255,255,255,0.04)", borderRadius: 10,
    }}>
      <div>
        <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{name}</div>
        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{desc}</div>
      </div>
      <a href={url} target="_blank" rel="noopener noreferrer" style={{
        fontSize: "0.7rem", color: "var(--accent-1)", textDecoration: "none",
      }}>
        Privacy →
      </a>
    </div>
  );
}

function RightItem({ article, title, desc, action }: { article: string; title: string; desc: string; action: string }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)",
      borderRadius: 10, padding: "1rem",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
        <span style={{
          padding: "0.25rem 0.5rem", borderRadius: 6, fontSize: "0.7rem", fontWeight: 700,
          background: "linear-gradient(135deg, rgba(249,115,22,0.15), rgba(234,88,12,0.08))",
          color: "#f97316", whiteSpace: "nowrap",
        }}>
          {article}
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: "0.95rem", marginBottom: "0.25rem" }}>{title}</div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.35rem" }}>{desc}</div>
          <div style={{ fontSize: "0.75rem", color: "#22c55e" }}>→ {action}</div>
        </div>
      </div>
    </div>
  );
}
