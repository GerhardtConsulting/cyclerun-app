/**
 * CycleRun.app — Engagement & Retention Email Templates
 * 
 * Campaigns:
 * 1. Welcome Drip Series (Day 1, 3, 7 after registration)
 * 2. Achievement Emails (Badge, Level Up, Streak Milestone)
 * 3. Retention / Win-Back (3d, 7d, 14d, 30d inactive)
 * 4. Weight Loss Guide Series (5-part educational drip)
 * 5. Weekly Summary (personalized stats recap)
 * 
 * All templates bilingual EN+DE, DSGVO-compliant via shared wrapper.
 */

import { BRAND } from "./email-templates";

/* ── Shared inline styles (email-client safe) ── */
const F = '-apple-system,BlinkMacSystemFont,Inter,Segoe UI,Roboto,sans-serif';

const S = {
  h1: `font-family:${F};font-size:22px;font-weight:800;color:#fafaf9;margin:0 0 12px;letter-spacing:-0.02em;line-height:1.3;`,
  h2: `font-family:${F};font-size:17px;font-weight:700;color:#fafaf9;margin:24px 0 8px;line-height:1.3;`,
  p: `font-family:${F};font-size:15px;line-height:1.75;color:#d6d3d1;margin:0 0 16px;`,
  accent: 'color:#f97316;',
  muted: `font-family:${F};font-size:12px;line-height:1.6;color:#78716c;`,
  cta: `display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#f97316,#ea580c);color:#ffffff;text-decoration:none;border-radius:12px;font-family:${F};font-weight:700;font-size:15px;letter-spacing:0.01em;`,
  ctaSecondary: `display:inline-block;padding:12px 28px;border:1px solid rgba(249,115,22,0.25);color:#f97316;text-decoration:none;border-radius:12px;font-family:${F};font-weight:600;font-size:14px;`,
  bentoBox: 'background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:14px;padding:20px 24px;margin:20px 0;',
  bentoBoxAccent: 'background:linear-gradient(135deg,rgba(249,115,22,0.06),rgba(234,88,12,0.02));border:1px solid rgba(249,115,22,0.1);border-radius:14px;padding:20px 24px;margin:20px 0;',
  bentoLabel: `font-family:${F};font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#a8a29e;margin:0 0 8px;`,
  bentoValue: `font-family:${F};font-size:14px;color:#d6d3d1;line-height:1.7;margin:0;`,
  divider: 'height:1px;background:rgba(255,255,255,0.04);margin:28px 0;',
  bigNum: `font-family:${F};font-size:36px;font-weight:800;color:#f97316;line-height:1;`,
  statRow: `font-family:${F};font-size:14px;color:#d6d3d1;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.04);`,
  statLabel: `font-family:${F};font-size:12px;color:#a8a29e;`,
  statValue: `font-family:${F};font-size:15px;font-weight:700;color:#fafaf9;`,
};

function wrapper(content: string, locale: string, opts?: { unsubscribeUrl?: string; reason?: string }): string {
  const isDE = locale === "de";
  const unsub = opts?.unsubscribeUrl;
  const reason = opts?.reason || (isDE
    ? "Du erhältst diese E-Mail, weil du bei CycleRun.app registriert bist."
    : "You are receiving this email because you are registered at CycleRun.app.");

  return `<!DOCTYPE html>
<html lang="${locale}" dir="ltr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="dark">
  <title>CycleRun.app</title>
</head>
<body style="margin:0;padding:0;background:#050505;-webkit-text-size-adjust:100%;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#050505;">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:540px;">
        <tr><td style="height:4px;background:linear-gradient(90deg,#fbbf24,#f97316,#dc2626,#f97316,#fbbf24);border-radius:20px 20px 0 0;"></td></tr>
        <tr><td style="background:#111111;border-left:1px solid rgba(255,255,255,0.05);border-right:1px solid rgba(255,255,255,0.05);padding:40px 32px 32px;">
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
            <tr>
              <td style="font-family:${F};font-size:22px;font-weight:800;letter-spacing:-0.03em;color:#fafaf9;">cyclerun</td>
              <td style="font-family:${F};font-size:22px;font-weight:800;letter-spacing:-0.03em;color:#f97316;">.</td>
              <td style="font-family:${F};font-size:22px;font-weight:800;letter-spacing:-0.03em;color:#f97316;">app</td>
            </tr>
          </table>
          ${content}
        </td></tr>
        <tr><td style="height:1px;background:linear-gradient(90deg,transparent,rgba(249,115,22,0.3),transparent);"></td></tr>
        <tr><td style="background:#0a0a0a;border-left:1px solid rgba(255,255,255,0.03);border-right:1px solid rgba(255,255,255,0.03);border-radius:0 0 20px 20px;padding:24px 32px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-family:${F};">
            <tr><td style="font-size:11px;line-height:1.7;color:#78716c;">
              ${reason}<br><br>
              ${unsub ? `<a href="${unsub}" style="color:#78716c;text-decoration:underline;">${isDE ? "E-Mails abbestellen" : "Unsubscribe"}</a>&nbsp;&nbsp;·&nbsp;&nbsp;` : ""}
              <a href="${BRAND.baseUrl}/datenschutz" style="color:#78716c;text-decoration:none;">${isDE ? "Datenschutz" : "Privacy"}</a>&nbsp;&nbsp;·&nbsp;&nbsp;
              <a href="${BRAND.baseUrl}/impressum" style="color:#78716c;text-decoration:none;">${isDE ? "Impressum" : "Legal"}</a>
              <br><br>
              <span style="color:#44403c;">${BRAND.address}</span>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export interface EmailTemplate {
  subject: string;
  html: string;
  key: string;
}

// ═══════════════════════════════════════════════════
// 1. WELCOME DRIP SERIES
// ═══════════════════════════════════════════════════

export function welcomeDay1(locale: string, name: string): EmailTemplate {
  const isDE = locale === "de";
  const n = name || "Rider";
  return {
    key: "welcome_day1",
    subject: isDE
      ? `${n}, so holst du das Maximum aus CycleRun`
      : `${n}, here's how to get the most from CycleRun`,
    html: wrapper(`
      <h1 style="${S.h1}">${isDE ? `Hey ${n}, bereit für dein Setup?` : `Hey ${n}, ready for your setup?`}</h1>
      <p style="${S.p}">${isDE
        ? "Gestern hast du dein Profil erstellt — heute zeigen wir dir, wie du in 3 Minuten dein perfektes Setup einrichtest und die beste Tracking-Qualität erreichst."
        : "Yesterday you created your profile — today we'll show you how to set up the perfect tracking quality in 3 minutes."
      }</p>

      <div style="${S.bentoBoxAccent}">
        <p style="${S.bentoLabel}">${isDE ? "Dein 3-Minuten-Setup" : "Your 3-minute setup"}</p>
        <p style="${S.bentoValue}">
          <strong style="color:#fafaf9;">1.</strong> ${isDE ? "Kamera auf Kniehöhe, 1-2m Abstand" : "Camera at knee height, 1-2m distance"}<br>
          <strong style="color:#fafaf9;">2.</strong> ${isDE ? "Gutes Licht — Tageslicht oder helle Lampe" : "Good light — daylight or bright lamp"}<br>
          <strong style="color:#fafaf9;">3.</strong> ${isDE ? "Beine/Pedale müssen vollständig sichtbar sein" : "Legs/pedals must be fully visible"}<br>
          <strong style="color:#fafaf9;">4.</strong> ${isDE ? "Starte eine Testfahrt — die Erkennung sollte sofort greifen" : "Start a test ride — detection should kick in immediately"}
        </p>
      </div>

      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:20px 0;">
        <tr>
          <td width="48%" valign="top" style="${S.bentoBox}">
            <p style="${S.bentoLabel}">💡 ${isDE ? "Pro-Tipp" : "Pro Tip"}</p>
            <p style="${S.bentoValue}">${isDE
              ? "Nutze dein Handy als Kamera + TV als Display für das beste Erlebnis."
              : "Use your phone as camera + TV as display for the best experience."
            }</p>
          </td>
          <td width="4%"></td>
          <td width="48%" valign="top" style="${S.bentoBox}">
            <p style="${S.bentoLabel}">🎥 ${isDE ? "Routen" : "Routes"}</p>
            <p style="${S.bentoValue}">${isDE
              ? "Lade ein YouTube-POV-Video oder nutze unsere Featured Routes."
              : "Load a YouTube POV video or use our Featured Routes."
            }</p>
          </td>
        </tr>
      </table>

      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:28px 0;">
        <tr><td align="center">
          <a href="${BRAND.baseUrl}" style="${S.cta}">${isDE ? "Erste Fahrt starten" : "Start your first ride"}</a>
        </td></tr>
      </table>
    `, locale),
  };
}

export function welcomeDay3(locale: string, name: string): EmailTemplate {
  const isDE = locale === "de";
  const n = name || "Rider";
  return {
    key: "welcome_day3",
    subject: isDE
      ? `Wusstest du? 20 Minuten Radfahren verbrennen mehr als du denkst`
      : `Did you know? 20 minutes of cycling burns more than you think`,
    html: wrapper(`
      <h1 style="${S.h1}">${isDE ? "Das Geheimnis der 20-Minuten-Regel" : "The secret of the 20-minute rule"}</h1>
      <p style="${S.p}">${isDE
        ? `${n}, die meisten Menschen überschätzen, wie lang ein effektives Workout sein muss. Die Wahrheit:`
        : `${n}, most people overestimate how long an effective workout needs to be. The truth:`
      }</p>

      <div style="${S.bentoBoxAccent}">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td width="30%" align="center" style="padding:12px;">
              <div style="${S.bigNum}">20</div>
              <div style="${S.statLabel}">${isDE ? "Minuten" : "minutes"}</div>
            </td>
            <td width="5%"></td>
            <td width="30%" align="center" style="padding:12px;">
              <div style="${S.bigNum}">~250</div>
              <div style="${S.statLabel}">${isDE ? "Kalorien" : "calories"}</div>
            </td>
            <td width="5%"></td>
            <td width="30%" align="center" style="padding:12px;">
              <div style="${S.bigNum}">7×</div>
              <div style="${S.statLabel}">${isDE ? "pro Woche = Transformation" : "per week = transformation"}</div>
            </td>
          </tr>
        </table>
      </div>

      <p style="${S.p}">${isDE
        ? "20 Minuten moderates Indoor-Cycling verbrennt 200-300 Kalorien. Das sind über 1.500 Kalorien pro Woche — das Äquivalent eines halben Kilos Körperfett alle 2 Wochen. Ohne Fitnessstudio, ohne teure Geräte."
        : "20 minutes of moderate indoor cycling burns 200-300 calories. That's over 1,500 calories per week — the equivalent of half a kilo of body fat every 2 weeks. No gym, no expensive equipment."
      }</p>

      <h2 style="${S.h2}">${isDE ? "Warum Indoor-Cycling der Geheimtipp ist" : "Why indoor cycling is the secret weapon"}</h2>
      <div style="${S.bentoBox}">
        <p style="${S.bentoValue}">
          ✓ ${isDE ? "Gelenkschonend — kein Impact wie beim Laufen" : "Joint-friendly — no impact like running"}<br>
          ✓ ${isDE ? "Wetterunabhängig — 365 Tage im Jahr" : "Weather-proof — 365 days a year"}<br>
          ✓ ${isDE ? "Zeitsparend — kein Anfahrtsweg ins Studio" : "Time-saving — no commute to the gym"}<br>
          ✓ ${isDE ? "Nachbrenneffekt — erhöhter Kalorienverbrauch für Stunden" : "Afterburn effect — elevated calorie burn for hours"}<br>
          ✓ ${isDE ? "Stimmungsbooster — Endorphine nach 15 Minuten" : "Mood booster — endorphins after 15 minutes"}
        </p>
      </div>

      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:28px 0;">
        <tr><td align="center">
          <a href="${BRAND.baseUrl}" style="${S.cta}">${isDE ? "20-Minuten-Ride starten" : "Start a 20-minute ride"}</a>
        </td></tr>
      </table>

      <div style="${S.divider}"></div>
      <p style="${S.muted}">${isDE
        ? "Übrigens: Dein Streak zählt bereits. Jeder Tag auf dem Rad bringt dich näher an dein Ziel."
        : "By the way: Your streak is already counting. Every day on the bike brings you closer to your goal."
      }</p>
    `, locale),
  };
}

export function welcomeDay7(locale: string, name: string, stats: { sessions: number; distance: number; energy: number; streak: number }): EmailTemplate {
  const isDE = locale === "de";
  const n = name || "Rider";
  const hasRidden = stats.sessions > 0;
  return {
    key: "welcome_day7",
    subject: isDE
      ? `Deine erste Woche bei CycleRun${hasRidden ? ` — ${stats.sessions} Fahrten!` : ""}`
      : `Your first week at CycleRun${hasRidden ? ` — ${stats.sessions} rides!` : ""}`,
    html: wrapper(`
      <h1 style="${S.h1}">${isDE ? `${n}, eine Woche geschafft.` : `${n}, one week done.`}</h1>

      ${hasRidden ? `
        <p style="${S.p}">${isDE
          ? "Hier ist dein Rückblick auf deine erste Woche:"
          : "Here's your first week recap:"
        }</p>

        <div style="${S.bentoBoxAccent}">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td width="24%" align="center" style="padding:12px;">
                <div style="${S.bigNum}">${stats.sessions}</div>
                <div style="${S.statLabel}">${isDE ? "Fahrten" : "Rides"}</div>
              </td>
              <td width="1%"></td>
              <td width="24%" align="center" style="padding:12px;">
                <div style="${S.bigNum}">${stats.distance.toFixed(1)}</div>
                <div style="${S.statLabel}">km</div>
              </td>
              <td width="1%"></td>
              <td width="24%" align="center" style="padding:12px;">
                <div style="${S.bigNum}">⚡${stats.energy}</div>
                <div style="${S.statLabel}">Energy</div>
              </td>
              <td width="1%"></td>
              <td width="24%" align="center" style="padding:12px;">
                <div style="${S.bigNum}">🔥${stats.streak}</div>
                <div style="${S.statLabel}">Streak</div>
              </td>
            </tr>
          </table>
        </div>
      ` : `
        <p style="${S.p}">${isDE
          ? "Du hast noch keine Fahrt gemacht — und das ist völlig okay. Manchmal braucht der Anfang etwas Anlauf. Aber wir wissen: Es braucht nur <strong style='color:#fafaf9;'>eine einzige Fahrt</strong>, um den Funken zu zünden."
          : "You haven't taken a ride yet — and that's perfectly okay. Sometimes getting started takes a moment. But we know: it only takes <strong style='color:#fafaf9;'>one single ride</strong> to light the spark."
        }</p>
      `}

      <h2 style="${S.h2}">${isDE ? "Was jetzt kommt" : "What's next"}</h2>
      <div style="${S.bentoBox}">
        <p style="${S.bentoValue}">
          🏆 ${isDE ? "Rangliste — Vergleiche dich mit der Community" : "Leaderboard — Compare yourself with the community"}<br>
          🎯 ${isDE ? "30 Abzeichen zum Freischalten" : "30 achievements to unlock"}<br>
          🔥 ${isDE ? "Streak-System — Jeden Tag fahren, Multiplikator aufbauen" : "Streak system — Ride every day, build your multiplier"}<br>
          📊 ${isDE ? "Dein Profil zeigt deinen gesamten Fortschritt" : "Your profile shows your complete progress"}
        </p>
      </div>

      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:24px 0;">
        <tr>
          <td align="center" style="padding:0 8px;">
            <a href="${BRAND.baseUrl}/profile" style="${S.cta}">${isDE ? "Mein Profil" : "My Profile"}</a>
          </td>
          <td align="center" style="padding:0 8px;">
            <a href="${BRAND.baseUrl}/leaderboard" style="${S.ctaSecondary}">${isDE ? "Rangliste" : "Leaderboard"}</a>
          </td>
        </tr>
      </table>
    `, locale),
  };
}

// ═══════════════════════════════════════════════════
// 2. ACHIEVEMENT EMAILS
// ═══════════════════════════════════════════════════

export function badgeEarnedEmail(locale: string, name: string, badge: { icon: string; name_en: string; name_de: string; description_en: string; description_de: string; energy_reward: number }): EmailTemplate {
  const isDE = locale === "de";
  return {
    key: `badge_${badge.name_en.toLowerCase().replace(/\s+/g, "_")}`,
    subject: isDE
      ? `${badge.icon} Neues Abzeichen: ${badge.name_de}`
      : `${badge.icon} New Achievement: ${badge.name_en}`,
    html: wrapper(`
      <div style="text-align:center;padding:20px 0;">
        <div style="font-size:64px;line-height:1;">${badge.icon}</div>
        <h1 style="${S.h1};text-align:center;margin-top:16px;">${isDE ? badge.name_de : badge.name_en}</h1>
        <p style="${S.p};text-align:center;">${isDE ? badge.description_de : badge.description_en}</p>
        <div style="${S.bentoBoxAccent};display:inline-block;padding:12px 32px;">
          <span style="${S.bigNum}">+${badge.energy_reward}</span>
          <span style="font-family:${F};font-size:14px;color:#d6d3d1;margin-left:8px;">Energy ⚡</span>
        </div>
      </div>

      <p style="${S.p};text-align:center;">${isDE
        ? `Weiter so, ${name || "Rider"}! Jede Fahrt bringt dich näher an das nächste Abzeichen.`
        : `Keep going, ${name || "Rider"}! Every ride brings you closer to the next achievement.`
      }</p>

      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:24px 0;">
        <tr><td align="center">
          <a href="${BRAND.baseUrl}/profile" style="${S.cta}">${isDE ? "Alle Abzeichen ansehen" : "View all achievements"}</a>
        </td></tr>
      </table>
    `, locale),
  };
}

export function levelUpEmail(locale: string, name: string, newLevel: number, levelName: string, totalEnergy: number): EmailTemplate {
  const isDE = locale === "de";
  return {
    key: `level_up_${newLevel}`,
    subject: isDE
      ? `🎉 Level Up! Du bist jetzt Level ${newLevel} — ${levelName}`
      : `🎉 Level Up! You're now Level ${newLevel} — ${levelName}`,
    html: wrapper(`
      <div style="text-align:center;padding:20px 0;">
        <div style="font-size:48px;line-height:1;">🎉</div>
        <h1 style="${S.h1};text-align:center;margin-top:16px;">${isDE ? "Level Up!" : "Level Up!"}</h1>
        <div style="${S.bentoBoxAccent};text-align:center;">
          <div style="${S.bigNum}">Lv.${newLevel}</div>
          <div style="font-family:${F};font-size:16px;font-weight:700;color:#fafaf9;margin-top:4px;">${levelName}</div>
          <div style="${S.statLabel};margin-top:8px;">⚡ ${totalEnergy.toLocaleString()} Energy</div>
        </div>
      </div>

      <p style="${S.p};text-align:center;">${isDE
        ? `${name || "Rider"}, du hast ein neues Level erreicht. Deine Konstanz zahlt sich aus.`
        : `${name || "Rider"}, you've reached a new level. Your consistency is paying off.`
      }</p>

      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:24px 0;">
        <tr><td align="center">
          <a href="${BRAND.baseUrl}" style="${S.cta}">${isDE ? "Weiterfahren" : "Keep riding"}</a>
        </td></tr>
      </table>
    `, locale),
  };
}

export function streakMilestoneEmail(locale: string, name: string, streakDays: number): EmailTemplate {
  const isDE = locale === "de";
  return {
    key: `streak_milestone_${streakDays}`,
    subject: isDE
      ? `🔥 ${streakDays}-Tage-Streak! Unglaublich, ${name || "Rider"}.`
      : `🔥 ${streakDays}-day streak! Incredible, ${name || "Rider"}.`,
    html: wrapper(`
      <div style="text-align:center;padding:20px 0;">
        <div style="font-size:48px;line-height:1;">🔥</div>
        <h1 style="${S.h1};text-align:center;margin-top:16px;">
          ${isDE ? `${streakDays} Tage am Stück!` : `${streakDays} days straight!`}
        </h1>
        <p style="${S.p};text-align:center;">${isDE
          ? "Das schaffen die wenigsten. Du baust gerade eine Gewohnheit auf, die dein Leben verändert."
          : "Very few people achieve this. You're building a habit that will change your life."
        }</p>
      </div>

      <div style="${S.bentoBox};text-align:center;">
        <p style="${S.bentoLabel}">${isDE ? "Dein Streak-Bonus" : "Your streak bonus"}</p>
        <p style="${S.bentoValue}">
          ${isDE ? "Streak-Multiplikator" : "Streak multiplier"}: <strong style="color:#f97316;">×${Math.min(1.0 + streakDays * 0.02, 1.5).toFixed(2)}</strong><br>
          ${isDE ? "Jede Fahrt bringt dir jetzt mehr Energy" : "Every ride now earns you more Energy"}
        </p>
      </div>

      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:24px 0;">
        <tr><td align="center">
          <a href="${BRAND.baseUrl}" style="${S.cta}">${isDE ? "Streak fortsetzen" : "Continue streak"}</a>
        </td></tr>
      </table>
    `, locale),
  };
}

// ═══════════════════════════════════════════════════
// 3. RETENTION / WIN-BACK EMAILS
// ═══════════════════════════════════════════════════

export function retentionDay3(locale: string, name: string, streak: number): EmailTemplate {
  const isDE = locale === "de";
  const n = name || "Rider";
  return {
    key: "retention_day3",
    subject: isDE
      ? `${n}, dein Streak wartet auf dich 🔥`
      : `${n}, your streak is waiting 🔥`,
    html: wrapper(`
      <h1 style="${S.h1}">${isDE ? "3 Tage ohne Fahrt." : "3 days without a ride."}</h1>
      <p style="${S.p}">${isDE
        ? `Hey ${n}, das soll kein Vorwurf sein — Pausen gehören dazu. Aber dein Streak von ${streak} Tagen ist noch nicht verloren.`
        : `Hey ${n}, this isn't a guilt trip — breaks are part of the journey. But your ${streak}-day streak isn't lost yet.`
      }</p>

      <div style="${S.bentoBoxAccent};text-align:center;">
        <p style="${S.bentoLabel}">${isDE ? "Eine kurze Fahrt genügt" : "A short ride is enough"}</p>
        <p style="${S.bentoValue}">
          ${isDE
            ? "Selbst <strong style='color:#fafaf9;'>5 Minuten</strong> zählen für deinen Streak und dein Wohlbefinden."
            : "Even <strong style='color:#fafaf9;'>5 minutes</strong> count for your streak and your well-being."
          }
        </p>
      </div>

      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:28px 0;">
        <tr><td align="center">
          <a href="${BRAND.baseUrl}" style="${S.cta}">${isDE ? "Schnelle Fahrt starten" : "Start a quick ride"}</a>
        </td></tr>
      </table>
    `, locale),
  };
}

export function retentionDay7(locale: string, name: string): EmailTemplate {
  const isDE = locale === "de";
  const n = name || "Rider";
  return {
    key: "retention_day7",
    subject: isDE
      ? `Der einfachste Weg zum Abnehmen? Du hast ihn schon.`
      : `The easiest way to lose weight? You already have it.`,
    html: wrapper(`
      <h1 style="${S.h1}">${isDE ? "Dein Fahrrad steht bereit." : "Your bike is ready."}</h1>
      <p style="${S.p}">${isDE
        ? `${n}, eine Woche ohne Fahrt — das passiert. Aber wir möchten dir etwas zeigen, das dich vielleicht motiviert:`
        : `${n}, a week without a ride — it happens. But we'd like to show you something that might motivate you:`
      }</p>

      <h2 style="${S.h2}">${isDE ? "Indoor-Cycling: Der Geheimtipp fürs Abnehmen" : "Indoor Cycling: The Secret Weight Loss Tip"}</h2>

      <div style="${S.bentoBoxAccent}">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td width="48%" align="center" style="padding:16px;">
              <div style="${S.bigNum}">~300</div>
              <div style="${S.statLabel}">${isDE ? "kcal pro 30 Min." : "kcal per 30 min"}</div>
            </td>
            <td width="4%"></td>
            <td width="48%" align="center" style="padding:16px;">
              <div style="${S.bigNum}">2kg</div>
              <div style="${S.statLabel}">${isDE ? "pro Monat möglich" : "per month possible"}</div>
            </td>
          </tr>
        </table>
      </div>

      <p style="${S.p}">${isDE
        ? "Studien zeigen: Tägliches moderates Radfahren (20-30 Minuten) ist eine der effektivsten Methoden zur nachhaltigen Gewichtsreduktion. Kein Fitnessstudio, kein teures Equipment — nur du und dein Rad."
        : "Studies show: Daily moderate cycling (20-30 minutes) is one of the most effective methods for sustainable weight loss. No gym, no expensive equipment — just you and your bike."
      }</p>

      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:28px 0;">
        <tr>
          <td align="center" style="padding:0 8px;">
            <a href="${BRAND.baseUrl}" style="${S.cta}">${isDE ? "Jetzt wieder einsteigen" : "Get back on the bike"}</a>
          </td>
        </tr>
      </table>

      <div style="${S.divider}"></div>
      <p style="${S.muted}">${isDE
        ? "P.S. Wenn du einen Streak startest und 7 Tage durchhältst, schaltest du das 'Week Warrior'-Abzeichen frei + einen Streak-Freeze als Sicherheitsnetz."
        : "P.S. If you start a streak and keep it for 7 days, you'll unlock the 'Week Warrior' badge + a streak freeze as a safety net."
      }</p>
    `, locale),
  };
}

export function retentionDay14(locale: string, name: string): EmailTemplate {
  const isDE = locale === "de";
  const n = name || "Rider";
  return {
    key: "retention_day14",
    subject: isDE
      ? `${n}, wir haben neue Features für dich 🚀`
      : `${n}, we have new features for you 🚀`,
    html: wrapper(`
      <h1 style="${S.h1}">${isDE ? "Seit 2 Wochen nicht gefahren?" : "Haven't ridden in 2 weeks?"}</h1>
      <p style="${S.p}">${isDE
        ? `${n}, kein Stress — aber vielleicht lohnt sich ein kurzer Blick auf das, was sich getan hat:`
        : `${n}, no stress — but maybe take a quick look at what's new:`
      }</p>

      <div style="${S.bentoBox}">
        <p style="${S.bentoValue}">
          ⚡ ${isDE ? "Neues Energy-System — verdiene Punkte mit jeder Fahrt" : "New Energy system — earn points with every ride"}<br>
          🏆 ${isDE ? "Rangliste — klettere die Woche/Monats/Gesamt-Charts hoch" : "Leaderboard — climb the weekly/monthly/all-time charts"}<br>
          🔥 ${isDE ? "Streak-System mit Multiplikator und Freeze" : "Streak system with multiplier and freeze"}<br>
          🎯 ${isDE ? "30 Abzeichen in 6 Kategorien" : "30 badges across 6 categories"}<br>
          📊 ${isDE ? "Persönliches Profil mit deinen kompletten Stats" : "Personal profile with your complete stats"}
        </p>
      </div>

      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:28px 0;">
        <tr>
          <td align="center" style="padding:0 8px;">
            <a href="${BRAND.baseUrl}" style="${S.cta}">${isDE ? "Jetzt ausprobieren" : "Try it now"}</a>
          </td>
          <td align="center" style="padding:0 8px;">
            <a href="${BRAND.baseUrl}/profile" style="${S.ctaSecondary}">${isDE ? "Mein Profil" : "My Profile"}</a>
          </td>
        </tr>
      </table>
    `, locale),
  };
}

export function retentionDay30(locale: string, name: string): EmailTemplate {
  const isDE = locale === "de";
  const n = name || "Rider";
  return {
    key: "retention_day30",
    subject: isDE
      ? `Eine Fahrt. Mehr nicht.`
      : `One ride. That's all.`,
    html: wrapper(`
      <h1 style="${S.h1}">${isDE ? "Eine einzige Fahrt." : "One single ride."}</h1>
      <p style="${S.p}">${isDE
        ? `${n}, wir wissen, dass es Phasen gibt, in denen das Training in den Hintergrund rückt. Das ist menschlich. Aber der Wiedereinstieg ist einfacher als du denkst:`
        : `${n}, we know there are phases where training takes a backseat. That's human. But getting back is easier than you think:`
      }</p>

      <div style="${S.bentoBoxAccent};text-align:center;">
        <p style="font-family:${F};font-size:20px;font-weight:700;color:#fafaf9;margin:0;">
          ${isDE ? "Browser öffnen. Losfahren. Fertig." : "Open browser. Start riding. Done."}
        </p>
        <p style="${S.muted};margin-top:8px;">
          ${isDE ? "Kein Download. Kein Abo. Alles noch genau so, wie du es verlassen hast." : "No download. No subscription. Everything exactly as you left it."}
        </p>
      </div>

      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:28px 0;">
        <tr><td align="center">
          <a href="${BRAND.baseUrl}" style="${S.cta}">${isDE ? "Einfach losfahren" : "Just start riding"}</a>
        </td></tr>
      </table>

      <div style="${S.divider}"></div>
      <p style="${S.muted}">${isDE
        ? "Wenn du diese E-Mails nicht mehr erhalten möchtest, kannst du sie jederzeit unten abbestellen. Dein Account und alle deine Daten bleiben erhalten."
        : "If you no longer wish to receive these emails, you can unsubscribe below at any time. Your account and all your data will be preserved."
      }</p>
    `, locale),
  };
}

// ═══════════════════════════════════════════════════
// 4. WEIGHT LOSS GUIDE SERIES (5-Part Drip)
// ═══════════════════════════════════════════════════

export function weightLossGuide1(locale: string, name: string): EmailTemplate {
  const isDE = locale === "de";
  const n = name || "Rider";
  return {
    key: "weight_loss_1",
    subject: isDE
      ? `Warum 20 Min. Radfahren effektiver ist als 1 Stunde Gym`
      : `Why 20 min of cycling is more effective than 1 hour at the gym`,
    html: wrapper(`
      <p style="${S.bentoLabel};">${isDE ? "Abnehmen mit Indoor-Cycling · Teil 1 von 5" : "Weight Loss with Indoor Cycling · Part 1 of 5"}</p>
      <h1 style="${S.h1}">${isDE ? "Die 20-Minuten-Revolution" : "The 20-Minute Revolution"}</h1>

      <p style="${S.p}">${isDE
        ? `${n}, die Fitness-Industrie will dir weismachen, dass du teure Geräte, endlose Studio-Stunden und komplizierte Ernährungspläne brauchst. Die Realität? <strong style="color:#fafaf9">20 Minuten auf dem Rad pro Tag reichen aus.</strong>`
        : `${n}, the fitness industry wants you to believe you need expensive equipment, endless gym hours, and complex meal plans. The reality? <strong style="color:#fafaf9">20 minutes on the bike per day is enough.</strong>`
      }</p>

      <div style="${S.bentoBoxAccent}">
        <p style="${S.bentoLabel}">${isDE ? "Die Wissenschaft" : "The Science"}</p>
        <p style="${S.bentoValue}">
          ${isDE
            ? "Eine Studie im Journal of Obesity zeigt: Kurze, regelmäßige Cardio-Einheiten (15-30 Min.) führen zu <strong style='color:#fafaf9;'>mehr Gewichtsverlust</strong> als seltene, lange Workouts. Der Grund: Konsistenz schlägt Intensität."
            : "A study in the Journal of Obesity shows: Short, regular cardio sessions (15-30 min) lead to <strong style='color:#fafaf9;'>more weight loss</strong> than infrequent, long workouts. The reason: Consistency beats intensity."
          }
        </p>
      </div>

      <h2 style="${S.h2}">${isDE ? "Kalorienmathematik" : "Calorie Math"}</h2>
      <div style="${S.bentoBox}">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
          <tr><td style="${S.statRow}"><span style="${S.statLabel}">${isDE ? "20 Min. moderates Cycling" : "20 min moderate cycling"}</span></td><td align="right" style="${S.statRow}"><span style="${S.statValue}">~200-250 kcal</span></td></tr>
          <tr><td style="${S.statRow}"><span style="${S.statLabel}">× 7 ${isDE ? "Tage/Woche" : "days/week"}</span></td><td align="right" style="${S.statRow}"><span style="${S.statValue}">~1,500 kcal</span></td></tr>
          <tr><td style="${S.statRow}"><span style="${S.statLabel}">× 4 ${isDE ? "Wochen" : "weeks"}</span></td><td align="right" style="${S.statRow}"><span style="${S.statValue}">~6,000 kcal</span></td></tr>
          <tr><td style="${S.statRow};border:none;"><span style="${S.statLabel}">${isDE ? "≈ Gewichtsverlust/Monat" : "≈ Weight loss/month"}</span></td><td align="right" style="${S.statRow};border:none;"><span style="${S.statValue};color:#f97316;">~0.8 kg ${isDE ? "Fett" : "fat"}</span></td></tr>
        </table>
      </div>

      <p style="${S.p}">${isDE
        ? "0.8 kg reines Fett pro Monat — allein durch Radfahren, ohne Diät. Kombiniert mit bewusster Ernährung sind 2-3 kg pro Monat realistisch."
        : "0.8 kg of pure fat per month — just from cycling, without dieting. Combined with mindful eating, 2-3 kg per month is realistic."
      }</p>

      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:28px 0;">
        <tr><td align="center">
          <a href="${BRAND.baseUrl}" style="${S.cta}">${isDE ? "Heute starten" : "Start today"}</a>
        </td></tr>
      </table>

      <div style="${S.divider}"></div>
      <p style="${S.muted}">${isDE
        ? "Morgen Teil 2: Wie du den Nachbrenneffekt aktivierst und noch Stunden nach dem Training Kalorien verbrennst."
        : "Tomorrow Part 2: How to activate the afterburn effect and burn calories for hours after your workout."
      }</p>
    `, locale),
  };
}

export function weightLossGuide2(locale: string, name: string): EmailTemplate {
  const isDE = locale === "de";
  return {
    key: "weight_loss_2",
    subject: isDE
      ? `Der Nachbrenneffekt: Kalorien verbrennen im Schlaf`
      : `The Afterburn Effect: Burning calories in your sleep`,
    html: wrapper(`
      <p style="${S.bentoLabel}">${isDE ? "Abnehmen mit Indoor-Cycling · Teil 2 von 5" : "Weight Loss with Indoor Cycling · Part 2 of 5"}</p>
      <h1 style="${S.h1}">${isDE ? "Kalorien verbrennen — auch nach dem Training" : "Burn calories — even after your workout"}</h1>

      <p style="${S.p}">${isDE
        ? "Der sogenannte EPOC-Effekt (Excess Post-Exercise Oxygen Consumption) bedeutet: Nach intensivem Radfahren verbraucht dein Körper noch <strong style='color:#fafaf9;'>bis zu 14 Stunden</strong> lang mehr Kalorien als im Ruhezustand."
        : "The EPOC effect (Excess Post-Exercise Oxygen Consumption) means: After intense cycling, your body burns <strong style='color:#fafaf9;'>up to 14 hours</strong> of extra calories compared to rest."
      }</p>

      <div style="${S.bentoBoxAccent}">
        <p style="${S.bentoLabel}">${isDE ? "So aktivierst du EPOC" : "How to activate EPOC"}</p>
        <p style="${S.bentoValue}">
          <strong style="color:#fafaf9;">Intervall-Methode:</strong><br>
          ${isDE
            ? "2 Min. schnell treten → 1 Min. locker → 2 Min. schnell → wiederholen. 20 Minuten genügen."
            : "2 min fast pedaling → 1 min easy → 2 min fast → repeat. 20 minutes is enough."
          }<br><br>
          ${isDE
            ? "Bei CycleRun: Wechsle einfach zwischen Gangschaltung 'Leicht' und 'Schwer'."
            : "In CycleRun: Simply switch between 'Light' and 'Heavy' gear."
          }
        </p>
      </div>

      <div style="${S.bentoBox}">
        <p style="${S.bentoLabel}">${isDE ? "Bonus-Effekte" : "Bonus effects"}</p>
        <p style="${S.bentoValue}">
          ✓ ${isDE ? "Besserer Schlaf durch körperliche Erschöpfung" : "Better sleep through physical exhaustion"}<br>
          ✓ ${isDE ? "Erhöhter Grundumsatz über Wochen" : "Increased base metabolic rate over weeks"}<br>
          ✓ ${isDE ? "Muskelaufbau in den Beinen = mehr Kalorienverbrennung in Ruhe" : "Muscle building in legs = more calorie burn at rest"}
        </p>
      </div>

      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:28px 0;">
        <tr><td align="center">
          <a href="${BRAND.baseUrl}" style="${S.cta}">${isDE ? "Intervall-Fahrt starten" : "Start an interval ride"}</a>
        </td></tr>
      </table>

      <div style="${S.divider}"></div>
      <p style="${S.muted}">${isDE
        ? "Nächste Mail: Wie du in 30 Tagen eine unzerbrechliche Gewohnheit aufbaust."
        : "Next email: How to build an unbreakable habit in 30 days."
      }</p>
    `, locale),
  };
}

export function weightLossGuide3(locale: string, name: string): EmailTemplate {
  const isDE = locale === "de";
  return {
    key: "weight_loss_3",
    subject: isDE
      ? `30-Tage-Plan: So wird Radfahren zur Gewohnheit`
      : `30-Day Plan: How cycling becomes a habit`,
    html: wrapper(`
      <p style="${S.bentoLabel}">${isDE ? "Abnehmen mit Indoor-Cycling · Teil 3 von 5" : "Weight Loss with Indoor Cycling · Part 3 of 5"}</p>
      <h1 style="${S.h1}">${isDE ? "Der 30-Tage-Gewohnheits-Plan" : "The 30-Day Habit Plan"}</h1>

      <p style="${S.p}">${isDE
        ? "Forschung zeigt: Eine neue Gewohnheit braucht im Schnitt 21-66 Tage. Mit diesem Plan machst du Radfahren zu deinem täglichen Ritual — und CycleRun hilft dir dabei mit dem Streak-System."
        : "Research shows: A new habit takes on average 21-66 days. This plan makes cycling your daily ritual — and CycleRun helps you with the streak system."
      }</p>

      <div style="${S.bentoBoxAccent}">
        <p style="${S.bentoLabel}">${isDE ? "Woche 1-2: Ankommen" : "Week 1-2: Getting started"}</p>
        <p style="${S.bentoValue}">
          ${isDE
            ? "• Nur 10-15 Minuten pro Tag<br>• Kein Leistungsdruck — es geht ums Dranbleiben<br>• Ziel: 🔥 7-Tage-Streak = 'Week Warrior' Badge"
            : "• Just 10-15 minutes per day<br>• No pressure — it's about showing up<br>• Goal: 🔥 7-day streak = 'Week Warrior' badge"
          }
        </p>
      </div>

      <div style="${S.bentoBox}">
        <p style="${S.bentoLabel}">${isDE ? "Woche 3: Steigern" : "Week 3: Ramp up"}</p>
        <p style="${S.bentoValue}">
          ${isDE
            ? "• 20 Minuten pro Tag<br>• Intervalle einbauen (Gangwechsel)<br>• Ziel: 🔥 14-Tage-Streak = Unstoppable Badge"
            : "• 20 minutes per day<br>• Add intervals (gear switching)<br>• Goal: 🔥 14-day streak = 'Unstoppable' badge"
          }
        </p>
      </div>

      <div style="${S.bentoBox}">
        <p style="${S.bentoLabel}">${isDE ? "Woche 4: Automatik" : "Week 4: Autopilot"}</p>
        <p style="${S.bentoValue}">
          ${isDE
            ? "• 20-30 Minuten pro Tag<br>• Es fühlt sich komisch an, NICHT zu fahren<br>• Ziel: 🔥 30-Tage-Streak = Iron Will Badge + 750 Energy"
            : "• 20-30 minutes per day<br>• It feels weird NOT to ride<br>• Goal: 🔥 30-day streak = 'Iron Will' badge + 750 Energy"
          }
        </p>
      </div>

      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:28px 0;">
        <tr><td align="center">
          <a href="${BRAND.baseUrl}" style="${S.cta}">${isDE ? "Tag 1 starten" : "Start Day 1"}</a>
        </td></tr>
      </table>

      <div style="${S.divider}"></div>
      <p style="${S.muted}">${isDE
        ? "Nächste Mail: Dein Körper nach 30 Tagen täglichem Cycling — was sich wirklich verändert."
        : "Next email: Your body after 30 days of daily cycling — what actually changes."
      }</p>
    `, locale),
  };
}

export function weightLossGuide4(locale: string, name: string): EmailTemplate {
  const isDE = locale === "de";
  return {
    key: "weight_loss_4",
    subject: isDE
      ? `Dein Körper nach 30 Tagen täglichem Radfahren`
      : `Your body after 30 days of daily cycling`,
    html: wrapper(`
      <p style="${S.bentoLabel}">${isDE ? "Abnehmen mit Indoor-Cycling · Teil 4 von 5" : "Weight Loss with Indoor Cycling · Part 4 of 5"}</p>
      <h1 style="${S.h1}">${isDE ? "30 Tage. Das verändert sich." : "30 Days. Here's what changes."}</h1>

      <div style="${S.bentoBoxAccent}">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
          <tr><td style="${S.statRow}"><span style="${S.statLabel}">${isDE ? "Tag 1-7" : "Day 1-7"}</span></td><td style="${S.statRow}"><span style="${S.statValue}">${isDE ? "Mehr Energie, besserer Schlaf" : "More energy, better sleep"}</span></td></tr>
          <tr><td style="${S.statRow}"><span style="${S.statLabel}">${isDE ? "Tag 8-14" : "Day 8-14"}</span></td><td style="${S.statRow}"><span style="${S.statValue}">${isDE ? "Stimmung stabilisiert sich, Stress sinkt" : "Mood stabilizes, stress decreases"}</span></td></tr>
          <tr><td style="${S.statRow}"><span style="${S.statLabel}">${isDE ? "Tag 15-21" : "Day 15-21"}</span></td><td style="${S.statRow}"><span style="${S.statValue}">${isDE ? "Kleidung sitzt lockerer, Ausdauer steigt" : "Clothes fit looser, endurance increases"}</span></td></tr>
          <tr><td style="${S.statRow};border:none;"><span style="${S.statLabel}">${isDE ? "Tag 22-30" : "Day 22-30"}</span></td><td style="${S.statRow};border:none;"><span style="${S.statValue};color:#f97316;">${isDE ? "Sichtbare Veränderung. Gewohnheit etabliert." : "Visible change. Habit established."}</span></td></tr>
        </table>
      </div>

      <p style="${S.p}">${isDE
        ? "Das Beste daran: Diese Veränderungen passieren, selbst wenn du nur 20 Minuten pro Tag fährst. Keine extremen Diäten, kein Übertraining — einfach jeden Tag aufs Rad."
        : "The best part: These changes happen even if you 'only' ride 20 minutes per day. No extreme diets, no overtraining — just get on the bike every day."
      }</p>

      <div style="${S.bentoBox}">
        <p style="${S.bentoLabel}">${isDE ? "Zusätzliche Benefits" : "Additional Benefits"}</p>
        <p style="${S.bentoValue}">
          🧠 ${isDE ? "Kognitive Leistung steigt um bis zu 15%" : "Cognitive performance increases up to 15%"}<br>
          ❤️ ${isDE ? "Ruhefrequenz sinkt — Herz wird effizienter" : "Resting heart rate drops — heart becomes more efficient"}<br>
          💪 ${isDE ? "Beinmuskulatur definierter" : "Leg muscles more defined"}<br>
          😴 ${isDE ? "Schlafqualität messbar verbessert" : "Sleep quality measurably improved"}
        </p>
      </div>

      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:28px 0;">
        <tr><td align="center">
          <a href="${BRAND.baseUrl}" style="${S.cta}">${isDE ? "Weiterfahren" : "Keep riding"}</a>
        </td></tr>
      </table>

      <div style="${S.divider}"></div>
      <p style="${S.muted}">${isDE
        ? "Letzte Mail der Serie morgen: Was unsere Community erreicht hat — echte Ergebnisse."
        : "Final email tomorrow: What our community has achieved — real results."
      }</p>
    `, locale),
  };
}

export function weightLossGuide5(locale: string, name: string): EmailTemplate {
  const isDE = locale === "de";
  return {
    key: "weight_loss_5",
    subject: isDE
      ? `Die Community spricht: Echte Ergebnisse mit CycleRun`
      : `The community speaks: Real results with CycleRun`,
    html: wrapper(`
      <p style="${S.bentoLabel}">${isDE ? "Abnehmen mit Indoor-Cycling · Teil 5 von 5" : "Weight Loss with Indoor Cycling · Part 5 of 5"}</p>
      <h1 style="${S.h1}">${isDE ? "Was möglich ist." : "What's possible."}</h1>

      <p style="${S.p}">${isDE
        ? "Indoor-Cycling als tägliche Gewohnheit verändert nicht nur deinen Körper — es verändert dein Selbstbild. Hier ein Blick auf das, was regelmäßiges Fahren bewirken kann:"
        : "Indoor cycling as a daily habit doesn't just change your body — it changes your self-image. Here's what regular riding can achieve:"
      }</p>

      <div style="${S.bentoBoxAccent}">
        <p style="${S.bentoLabel}">${isDE ? "Durchschnittliche Ergebnisse nach 3 Monaten" : "Average results after 3 months"}</p>
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
          <tr><td style="${S.statRow}"><span style="${S.statLabel}">${isDE ? "Gewichtsverlust" : "Weight loss"}</span></td><td align="right" style="${S.statRow}"><span style="${S.statValue}">3-8 kg</span></td></tr>
          <tr><td style="${S.statRow}"><span style="${S.statLabel}">${isDE ? "Ausdauer" : "Endurance"}</span></td><td align="right" style="${S.statRow}"><span style="${S.statValue}">+40-60%</span></td></tr>
          <tr><td style="${S.statRow}"><span style="${S.statLabel}">${isDE ? "Ruhepuls" : "Resting HR"}</span></td><td align="right" style="${S.statRow}"><span style="${S.statValue}">-8-12 bpm</span></td></tr>
          <tr><td style="${S.statRow};border:none;"><span style="${S.statLabel}">${isDE ? "Stimmung/Energie" : "Mood/Energy"}</span></td><td align="right" style="${S.statRow};border:none;"><span style="${S.statValue};color:#f97316;">${isDE ? "Signifikant besser" : "Significantly better"}</span></td></tr>
        </table>
      </div>

      <h2 style="${S.h2}">${isDE ? "Dein nächster Schritt" : "Your next step"}</h2>
      <p style="${S.p}">${isDE
        ? "Du hast jetzt alles Wissen, das du brauchst. Die Wissenschaft ist klar. Die Methode ist einfach. Es fehlt nur noch eins: <strong style='color:#fafaf9;'>Deine nächste Fahrt.</strong>"
        : "You now have all the knowledge you need. The science is clear. The method is simple. Only one thing is missing: <strong style='color:#fafaf9;'>Your next ride.</strong>"
      }</p>

      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:28px 0;">
        <tr>
          <td align="center" style="padding:0 8px;">
            <a href="${BRAND.baseUrl}" style="${S.cta}">${isDE ? "Jetzt starten" : "Start now"}</a>
          </td>
          <td align="center" style="padding:0 8px;">
            <a href="${BRAND.baseUrl}/leaderboard" style="${S.ctaSecondary}">${isDE ? "Rangliste" : "Leaderboard"}</a>
          </td>
        </tr>
      </table>

      <div style="${S.divider}"></div>
      <p style="${S.muted}">${isDE
        ? "Das war die letzte Mail unserer Abnehm-Serie. Du wirst weiterhin deine normalen Activity-Updates erhalten. Ride on! 🚴"
        : "This was the last email of our weight loss series. You'll continue receiving your regular activity updates. Ride on! 🚴"
      }</p>
    `, locale),
  };
}

// ═══════════════════════════════════════════════════
// 5. WEEKLY SUMMARY
// ═══════════════════════════════════════════════════

export function weeklySummary(
  locale: string,
  name: string,
  stats: {
    sessions: number;
    distance: number;
    duration: number;
    energy: number;
    streak: number;
    level: number;
    levelName: string;
    weekRank: number | null;
    newBadges: { icon: string; name: string }[];
  }
): EmailTemplate {
  const isDE = locale === "de";
  const n = name || "Rider";
  const week = new Date().toLocaleDateString(isDE ? "de-DE" : "en-US", { month: "short", day: "numeric" });
  const durationMin = Math.round(stats.duration / 60);

  return {
    key: `weekly_${new Date().toISOString().slice(0, 10)}`,
    subject: isDE
      ? `📊 Deine Woche: ${stats.sessions} Fahrten, ${stats.distance.toFixed(1)} km, ⚡${stats.energy}`
      : `📊 Your week: ${stats.sessions} rides, ${stats.distance.toFixed(1)} km, ⚡${stats.energy}`,
    html: wrapper(`
      <h1 style="${S.h1}">${isDE ? `${n}, deine Woche.` : `${n}, your week.`}</h1>
      <p style="${S.muted}">${isDE ? `Woche bis ${week}` : `Week ending ${week}`}</p>

      <div style="${S.bentoBoxAccent}">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td width="24%" align="center" style="padding:12px 4px;">
              <div style="${S.bigNum}">${stats.sessions}</div>
              <div style="${S.statLabel}">${isDE ? "Fahrten" : "Rides"}</div>
            </td>
            <td width="1%"></td>
            <td width="24%" align="center" style="padding:12px 4px;">
              <div style="${S.bigNum}">${stats.distance.toFixed(1)}</div>
              <div style="${S.statLabel}">km</div>
            </td>
            <td width="1%"></td>
            <td width="24%" align="center" style="padding:12px 4px;">
              <div style="${S.bigNum}">⚡${stats.energy}</div>
              <div style="${S.statLabel}">Energy</div>
            </td>
            <td width="1%"></td>
            <td width="24%" align="center" style="padding:12px 4px;">
              <div style="${S.bigNum}">${durationMin}</div>
              <div style="${S.statLabel}">${isDE ? "Minuten" : "min"}</div>
            </td>
          </tr>
        </table>
      </div>

      ${stats.streak > 0 ? `
        <div style="${S.bentoBox};text-align:center;">
          <span style="font-size:24px;">🔥</span>
          <span style="font-family:${F};font-size:18px;font-weight:700;color:#fafaf9;margin-left:8px;">
            ${stats.streak}-${isDE ? "Tage-Streak" : "day streak"}
          </span>
        </div>
      ` : ""}

      ${stats.newBadges.length > 0 ? `
        <div style="${S.bentoBox}">
          <p style="${S.bentoLabel}">${isDE ? "Neue Abzeichen diese Woche" : "New badges this week"}</p>
          <p style="${S.bentoValue}">${stats.newBadges.map(b => `${b.icon} ${b.name}`).join("<br>")}</p>
        </div>
      ` : ""}

      ${stats.weekRank ? `
        <div style="${S.bentoBox};text-align:center;">
          <p style="${S.bentoLabel}">${isDE ? "Dein Rang diese Woche" : "Your rank this week"}</p>
          <div style="${S.bigNum}">#${stats.weekRank}</div>
        </div>
      ` : ""}

      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:24px 0;">
        <tr>
          <td align="center" style="padding:0 8px;">
            <a href="${BRAND.baseUrl}/profile" style="${S.cta}">${isDE ? "Mein Profil" : "My Profile"}</a>
          </td>
          <td align="center" style="padding:0 8px;">
            <a href="${BRAND.baseUrl}/leaderboard" style="${S.ctaSecondary}">${isDE ? "Rangliste" : "Leaderboard"}</a>
          </td>
        </tr>
      </table>
    `, locale),
  };
}
