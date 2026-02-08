"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useLocale } from "@/lib/useLocale";
import { setLocale } from "@/lib/i18n";
import { getSupabase } from "@/lib/supabase";

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

interface SubpageNavProps {
  rightLabel?: string;
  rightHref?: string;
  rightKey?: string;
}

interface UserInfo {
  id: string;
  first_name: string;
  nickname: string | null;
  avatar_url: string | null;
  is_creator: boolean;
  credits: number;
  level: number;
}

export default function SubpageNav(props: SubpageNavProps) {
  const locale = useLocale();
  const isDE = locale === "de";
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, []);

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
    setMenuOpen(false);
  };

  const displayName = user?.nickname || user?.first_name || "";
  const initials = displayName ? displayName.charAt(0).toUpperCase() : "?";

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className="site-header">
        <Link href="/" className="site-header-logo">
          cyclerun<span className="site-header-app">.app</span>
        </Link>

        <div className="site-header-right">
          {/* Language switcher */}
          <div className="site-header-lang">
            <button className={`lang-btn${locale === 'en' ? ' active' : ''}`} onClick={() => setLocale('en')} title="English"><FlagEN /></button>
            <button className={`lang-btn${locale === 'de' ? ' active' : ''}`} onClick={() => setLocale('de')} title="Deutsch"><FlagDE /></button>
          </div>

          {/* User avatar / Login button */}
          {user ? (
            <button className="site-header-avatar" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
              {user.avatar_url ? (
                <img src={user.avatar_url} alt="" />
              ) : (
                <span className="site-header-initials">{initials}</span>
              )}
            </button>
          ) : (
            <button className="site-header-login" onClick={() => setShowLogin(true)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4" /><path d="M20 21a8 8 0 10-16 0" /></svg>
              <span>{isDE ? "Einloggen" : "Login"}</span>
            </button>
          )}

          {/* Optional CTA button from props */}
          {props.rightLabel && props.rightHref && (
            <a href={props.rightHref} className="btn-primary btn-sm" style={{ fontSize: "0.75rem", padding: "0.35rem 0.75rem", whiteSpace: "nowrap" }}>
              {props.rightLabel}
            </a>
          )}

          {/* Hamburger */}
          <button className="site-header-burger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            {menuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
            )}
          </button>
        </div>
      </nav>

      {/* ====== Slide-out Menu ====== */}
      {menuOpen && (
        <div className="site-menu-backdrop" onClick={closeMenu}>
          <div className="site-menu" ref={menuRef} onClick={(e) => e.stopPropagation()}>
            {/* User section at top */}
            {user ? (
              <div className="site-menu-user">
                <div className="site-menu-user-info">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt="" className="site-menu-user-avatar" />
                  ) : (
                    <div className="site-menu-user-avatar site-menu-user-initials">{initials}</div>
                  )}
                  <div>
                    <div className="site-menu-user-name">{displayName}</div>
                    <div className="site-menu-user-meta">
                      Lv.{user.level} · 🪙 {user.credits} Credits
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="site-menu-user">
                <button className="site-menu-login-btn" onClick={() => { closeMenu(); setShowLogin(true); }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4" /><path d="M20 21a8 8 0 10-16 0" /></svg>
                  {isDE ? "Einloggen" : "Log In"}
                </button>
              </div>
            )}

            {/* Navigation sections */}
            <div className="site-menu-section">
              <div className="site-menu-label">{isDE ? "Training" : "Training"}</div>
              <Link href="/" className="site-menu-link" onClick={closeMenu}>
                {isDE ? "Jetzt fahren" : "Start Riding"}
              </Link>
              <Link href="/store" className="site-menu-link" onClick={closeMenu}>
                {isDE ? "Strecken-Store" : "Route Store"}
              </Link>
              <Link href="/routes" className="site-menu-link" onClick={closeMenu}>
                {isDE ? "Strecken" : "Routes"}
              </Link>
              <Link href="/leaderboard" className="site-menu-link" onClick={closeMenu}>
                {isDE ? "Rangliste" : "Leaderboard"}
              </Link>
            </div>

            {user && (
              <div className="site-menu-section">
                <div className="site-menu-label">{isDE ? "Mein Bereich" : "My Account"}</div>
                <Link href="/profile" className="site-menu-link" onClick={closeMenu}>
                  {isDE ? "Profil" : "Profile"}
                </Link>
                {user.is_creator ? (
                  <Link href="/creator/dashboard" className="site-menu-link" onClick={closeMenu}>
                    {isDE ? "Creator Dashboard" : "Creator Dashboard"}
                    <span className="site-menu-badge">Creator</span>
                  </Link>
                ) : (
                  <Link href="/creator/dashboard" className="site-menu-link" onClick={closeMenu}>
                    {isDE ? "Creator werden" : "Become Creator"}
                  </Link>
                )}
              </div>
            )}

            <div className="site-menu-section">
              <div className="site-menu-label">{isDE ? "Entdecken" : "Discover"}</div>
              <Link href="/blog" className="site-menu-link" onClick={closeMenu}>
                Blog
              </Link>
              <Link href="/guide" className="site-menu-link" onClick={closeMenu}>
                {isDE ? "Guides" : "Guides"}
              </Link>
              <Link href="/creator" className="site-menu-link" onClick={closeMenu}>
                Creator Hub
              </Link>
              <Link href="/roadmap" className="site-menu-link" onClick={closeMenu}>
                Roadmap
              </Link>
              <Link href="/changelog" className="site-menu-link" onClick={closeMenu}>
                Changelog
              </Link>
            </div>

            <div className="site-menu-section">
              <div className="site-menu-label">{isDE ? "Rechtliches" : "Legal"}</div>
              <Link href="/datenschutz" className="site-menu-link" onClick={closeMenu}>
                {isDE ? "Datenschutz" : "Privacy Policy"}
              </Link>
              <Link href="/impressum" className="site-menu-link" onClick={closeMenu}>
                {isDE ? "Impressum" : "Legal Notice"}
              </Link>
            </div>

            {user && (
              <div className="site-menu-section site-menu-section-logout">
                <button className="site-menu-link site-menu-logout" onClick={handleLogout}>
                  {isDE ? "Ausloggen" : "Log Out"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ====== Login Modal ====== */}
      {showLogin && (
        <div className="site-login-backdrop" onClick={() => setShowLogin(false)}>
          <div className="site-login-card" onClick={(e) => e.stopPropagation()}>
            <button className="site-login-close" onClick={() => setShowLogin(false)}>✕</button>
            <h2 className="site-login-title">{isDE ? "Einloggen" : "Log In"}</h2>
            <p className="site-login-desc">
              {isDE ? "Mit deiner registrierten E-Mail-Adresse" : "With your registered email address"}
            </p>
            <input
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder={isDE ? "deine@email.de" : "your@email.com"}
              autoFocus
              className="site-login-input"
            />
            {loginError && <div className="site-login-error">{loginError}</div>}
            <button onClick={handleLogin} disabled={loginLoading} className="btn-primary site-login-submit">
              {loginLoading ? "..." : (isDE ? "Einloggen" : "Log In")}
            </button>
            <div className="site-login-footer">
              {isDE ? "Noch kein Account? " : "No account yet? "}
              <Link href="/" onClick={() => setShowLogin(false)}>{isDE ? "Jetzt starten" : "Get started"}</Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
