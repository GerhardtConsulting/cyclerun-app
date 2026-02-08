"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useLocale } from "@/lib/useLocale";
import { getSupabase } from "@/lib/supabase";

interface UserInfo {
  id: string;
  first_name: string;
  nickname: string | null;
  avatar_url: string | null;
  is_creator: boolean;
  credits: number;
  level: number;
}

export default function UserMenu() {
  const locale = useLocale();
  const isDE = locale === "de";
  const [user, setUser] = useState<UserInfo | null>(null);
  const [open, setOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadUser = useCallback(async () => {
    const email = typeof window !== "undefined" ? localStorage.getItem("cyclerun_email") : null;
    if (!email) return;

    const sb = getSupabase();
    if (!sb) return;

    const { data } = await sb
      .from("registrations")
      .select("id, first_name, nickname, avatar_url, is_creator, credits, level")
      .eq("email", email)
      .single();

    if (data) setUser(data as UserInfo);
  }, []);

  useEffect(() => { loadUser(); }, [loadUser]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogin = async () => {
    if (!loginEmail.trim()) return;
    setLoginLoading(true);
    setLoginError("");

    const sb = getSupabase();
    if (!sb) { setLoginLoading(false); return; }

    const { data } = await sb
      .from("registrations")
      .select("id, first_name, nickname, avatar_url, is_creator, credits, level")
      .eq("email", loginEmail.trim().toLowerCase())
      .single();

    if (!data) {
      setLoginError(isDE ? "Kein Account mit dieser E-Mail gefunden." : "No account found with this email.");
      setLoginLoading(false);
      return;
    }

    // Store session
    localStorage.setItem("cyclerun_email", loginEmail.trim().toLowerCase());
    localStorage.setItem("cyclerun_registered", "true");
    localStorage.setItem("cyclerun_name", data.first_name);

    setUser(data as UserInfo);
    setShowLogin(false);
    setLoginEmail("");
    setLoginLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("cyclerun_email");
    localStorage.removeItem("cyclerun_registered");
    localStorage.removeItem("cyclerun_name");
    setUser(null);
    setOpen(false);
  };

  const displayName = user?.nickname || user?.first_name || "";
  const initials = displayName.charAt(0).toUpperCase();

  // --- Login Modal ---
  if (showLogin) {
    return (
      <>
        <button onClick={() => setShowLogin(true)} className="btn-ghost btn-sm" style={{ fontSize: "0.8rem" }}>
          Login
        </button>
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "1rem",
        }} onClick={(e) => { if (e.target === e.currentTarget) setShowLogin(false); }}>
          <div style={{
            background: "var(--bg-card, #1a1a2e)", border: "1px solid var(--border, #2a2a4a)",
            borderRadius: 16, padding: "2rem", maxWidth: 380, width: "100%",
          }}>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "0.25rem" }}>
              {isDE ? "Einloggen" : "Log In"}
            </h2>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
              {isDE ? "Mit deiner registrierten E-Mail-Adresse" : "With your registered email address"}
            </p>
            <input
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder={isDE ? "deine@email.de" : "your@email.com"}
              autoFocus
              style={{
                width: "100%", padding: "0.65rem 0.85rem", borderRadius: 8,
                border: "1px solid var(--border, #2a2a4a)", background: "var(--bg, #0d0d1a)",
                color: "var(--text-primary, #fff)", fontSize: "0.95rem", marginBottom: "0.75rem",
              }}
            />
            {loginError && (
              <div style={{ fontSize: "0.8rem", color: "#ef4444", marginBottom: "0.75rem" }}>{loginError}</div>
            )}
            <button onClick={handleLogin} disabled={loginLoading} className="btn-primary" style={{ width: "100%", padding: "0.65rem", fontSize: "0.9rem", marginBottom: "0.75rem" }}>
              {loginLoading ? "..." : (isDE ? "Einloggen" : "Log In")}
            </button>
            <div style={{ textAlign: "center", fontSize: "0.8rem", color: "var(--text-muted)" }}>
              {isDE ? "Noch kein Account? " : "No account yet? "}
              <Link href="/" onClick={() => setShowLogin(false)} style={{ color: "var(--accent-1)" }}>
                {isDE ? "Jetzt starten" : "Get started"}
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  // --- Not logged in ---
  if (!user) {
    return (
      <button onClick={() => setShowLogin(true)} className="btn-ghost btn-sm" style={{ fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4" /><path d="M20 21a8 8 0 10-16 0" /></svg>
        Login
      </button>
    );
  }

  // --- Logged in: avatar + dropdown ---
  return (
    <div ref={dropdownRef} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex", alignItems: "center", gap: "0.4rem",
          background: "none", border: "none", cursor: "pointer", padding: "0.25rem",
          color: "var(--text-primary, #fff)",
        }}
      >
        {user.avatar_url ? (
          <img src={user.avatar_url} alt="" style={{ width: 30, height: 30, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--accent-1)" }} />
        ) : (
          <div style={{
            width: 30, height: 30, borderRadius: "50%",
            background: "linear-gradient(135deg, var(--accent-1), var(--accent-2))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.75rem", fontWeight: 800, color: "#000",
          }}>
            {initials}
          </div>
        )}
        <span style={{ fontSize: "0.8rem", fontWeight: 600, maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {displayName}
        </span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ opacity: 0.5, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}><path d="M6 9l6 6 6-6" /></svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", right: 0,
          background: "var(--bg-card, #1a1a2e)", border: "1px solid var(--border, #2a2a4a)",
          borderRadius: 12, padding: "0.5rem 0", minWidth: 200, zIndex: 1000,
          boxShadow: "0 12px 32px rgba(0,0,0,0.4)",
        }}>
          {/* User info */}
          <div style={{ padding: "0.5rem 1rem 0.75rem", borderBottom: "1px solid var(--border, #2a2a4a)" }}>
            <div style={{ fontWeight: 700, fontSize: "0.85rem" }}>{displayName}</div>
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "flex", gap: "0.5rem", marginTop: 2 }}>
              <span>Lv.{user.level}</span>
              <span>🪙 {user.credits}</span>
            </div>
          </div>

          {/* Menu items */}
          <div style={{ padding: "0.25rem 0" }}>
            <MenuLink href="/profile" icon="👤" label={isDE ? "Profil" : "Profile"} onClick={() => setOpen(false)} />
            <MenuLink href="/store" icon="🏪" label={isDE ? "Route Store" : "Route Store"} onClick={() => setOpen(false)} />
            <MenuLink href="/leaderboard" icon="🏆" label={isDE ? "Rangliste" : "Leaderboard"} onClick={() => setOpen(false)} />

            {/* Creator section */}
            <div style={{ borderTop: "1px solid var(--border, #2a2a4a)", margin: "0.25rem 0" }} />
            {user.is_creator ? (
              <MenuLink href="/creator/dashboard" icon="🎬" label={isDE ? "Creator Dashboard" : "Creator Dashboard"} onClick={() => setOpen(false)} badge="Creator" />
            ) : (
              <MenuLink href="/creator/dashboard" icon="🎬" label={isDE ? "Creator werden" : "Become Creator"} onClick={() => setOpen(false)} />
            )}

            {/* Logout */}
            <div style={{ borderTop: "1px solid var(--border, #2a2a4a)", margin: "0.25rem 0" }} />
            <button
              onClick={handleLogout}
              style={{
                display: "flex", alignItems: "center", gap: "0.5rem", width: "100%",
                padding: "0.5rem 1rem", background: "none", border: "none",
                color: "var(--text-muted)", fontSize: "0.8rem", cursor: "pointer",
                textAlign: "left",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            >
              🚪 {isDE ? "Ausloggen" : "Log Out"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuLink({ href, icon, label, onClick, badge }: { href: string; icon: string; label: string; onClick: () => void; badge?: string }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: "0.5rem",
        padding: "0.5rem 1rem", color: "var(--text-primary, #fff)",
        fontSize: "0.8rem", textDecoration: "none",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
    >
      <span>{icon}</span>
      <span style={{ flex: 1 }}>{label}</span>
      {badge && (
        <span style={{
          fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase",
          color: "var(--accent-1)", background: "rgba(34,197,94,0.1)",
          padding: "0.1rem 0.4rem", borderRadius: 4, letterSpacing: "0.03em",
        }}>
          {badge}
        </span>
      )}
    </Link>
  );
}
