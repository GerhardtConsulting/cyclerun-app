/**
 * CycleRun.app — Email Templates
 * DSGVO/GDPR compliant: All emails include unsubscribe link + legal footer
 * Bilingual: EN + DE based on locale
 */

export const BRAND = {
  logo: `<span style="color:#fafaf9;font-weight:800;font-size:1.5rem;letter-spacing:-0.03em;">cyclerun</span><span style="font-weight:800;font-size:1.5rem;letter-spacing:-0.03em;background:linear-gradient(135deg,#fbbf24,#f97316,#dc2626);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">.</span><span style="font-weight:800;font-size:1.5rem;letter-spacing:-0.03em;color:#f97316;">app</span>`,
  baseUrl: "https://cyclerun.app",
  from: "CycleRun.app <noreply@mail.cyclerun.app>",
};

function wrapper(content: string, locale: string, unsubscribeUrl?: string): string {
  const isDE = locale === "de";
  return `
<!DOCTYPE html>
<html lang="${locale}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  body { margin: 0; padding: 0; background: #0a0a0a; }
  .email-wrapper { max-width: 520px; margin: 0 auto; padding: 2rem; font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif; }
  .email-card { background: #141414; border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 2rem; }
  .email-logo { margin-bottom: 1.5rem; }
  .email-divider { height: 1px; background: rgba(255,255,255,0.06); margin: 1.5rem 0; }
  .btn-primary { display: inline-block; padding: 0.75rem 2rem; background: linear-gradient(135deg, #f97316, #ea580c); color: #ffffff !important; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 0.95rem; }
  .btn-primary:hover { opacity: 0.9; }
  p { color: #d6d3d1; font-size: 0.92rem; line-height: 1.7; margin: 0 0 1rem; }
  h1 { color: #fafaf9; font-size: 1.3rem; font-weight: 700; margin: 0 0 0.5rem; }
  .text-muted { color: #78716c; font-size: 0.78rem; line-height: 1.6; }
  .text-accent { color: #f97316; }
  a { color: #f97316; }
</style>
</head>
<body style="background:#0a0a0a;">
<div class="email-wrapper">
  <div class="email-card">
    <div class="email-logo">${BRAND.logo}</div>
    ${content}
  </div>

  <div style="text-align:center;padding:1.5rem 0 0;">
    <p class="text-muted" style="margin-bottom:0.5rem;">
      ${isDE ? "Du erhältst diese E-Mail, weil du dich bei CycleRun.app angemeldet hast." : "You're receiving this email because you signed up at CycleRun.app."}
    </p>
    ${unsubscribeUrl ? `
    <p class="text-muted" style="margin-bottom:0.5rem;">
      <a href="${unsubscribeUrl}" style="color:#78716c;text-decoration:underline;">
        ${isDE ? "Newsletter abbestellen" : "Unsubscribe from newsletter"}
      </a>
    </p>` : ""}
    <p class="text-muted" style="margin-bottom:0;">
      cyclerun.app · Maximilian Gerhardt · Stettiner Straße 41 · 35410 Hungen · ${isDE ? "Deutschland" : "Germany"}<br>
      <a href="${BRAND.baseUrl}/datenschutz" style="color:#78716c;">${isDE ? "Datenschutz" : "Privacy Policy"}</a>
       · 
      <a href="${BRAND.baseUrl}/impressum" style="color:#78716c;">${isDE ? "Impressum" : "Legal Notice"}</a>
    </p>
  </div>
</div>
</body>
</html>`;
}

// ─── Newsletter Double Opt-In Confirmation ───

export function newsletterConfirmEmail(locale: string, confirmUrl: string): { subject: string; html: string } {
  const isDE = locale === "de";
  return {
    subject: isDE
      ? "Bestätige dein CycleRun Newsletter-Abo"
      : "Confirm your CycleRun newsletter subscription",
    html: wrapper(`
      <h1>${isDE ? "Fast geschafft!" : "Almost there!"}</h1>
      <p>${isDE
        ? "Bitte bestätige dein Newsletter-Abo, damit wir dir Updates zu neuen Features, Routen und Community-Events schicken dürfen."
        : "Please confirm your newsletter subscription so we can send you updates about new features, routes, and community events."
      }</p>
      <p style="text-align:center;margin:1.5rem 0;">
        <a href="${confirmUrl}" class="btn-primary">${isDE ? "Abo bestätigen" : "Confirm subscription"}</a>
      </p>
      <div class="email-divider"></div>
      <p class="text-muted">
        ${isDE
          ? "Falls du diesen Newsletter nicht angefordert hast, ignoriere diese E-Mail einfach. Der Link verfällt automatisch."
          : "If you didn't request this newsletter, simply ignore this email. The link will expire automatically."
        }
      </p>
      <p class="text-muted">
        ${isDE
          ? "Wir versenden maximal 2 E-Mails pro Monat. Kein Spam, kein Tracking, jederzeit abbestellbar."
          : "We send a maximum of 2 emails per month. No spam, no tracking, unsubscribe anytime."
        }
      </p>
    `, locale),
  };
}

// ─── Newsletter Welcome (after confirmation) ───

export function newsletterWelcomeEmail(locale: string, unsubscribeUrl: string): { subject: string; html: string } {
  const isDE = locale === "de";
  return {
    subject: isDE
      ? "Willkommen bei CycleRun! 🚴"
      : "Welcome to CycleRun! 🚴",
    html: wrapper(`
      <h1>${isDE ? "Willkommen an Bord!" : "Welcome aboard!"}</h1>
      <p>${isDE
        ? "Dein Newsletter-Abo ist jetzt aktiv. Du bist Teil einer wachsenden Community von Indoor-Cycling-Enthusiasten."
        : "Your newsletter subscription is now active. You're part of a growing community of indoor cycling enthusiasts."
      }</p>

      <div style="background:rgba(249,115,22,0.06);border:1px solid rgba(249,115,22,0.12);border-radius:12px;padding:1.25rem;margin:1rem 0;">
        <p style="margin:0 0 0.75rem;font-weight:600;color:#fafaf9;">${isDE ? "Was dich erwartet:" : "What to expect:"}</p>
        <p style="margin:0;font-size:0.85rem;">
          ✅ ${isDE ? "Neue Routen & Feature-Releases" : "New routes & feature releases"}<br>
          ✅ ${isDE ? "Community Challenges & Events" : "Community challenges & events"}<br>
          ✅ ${isDE ? "Creator Spotlights & Tipps" : "Creator spotlights & tips"}<br>
          ✅ ${isDE ? "Maximal 2× pro Monat, kein Spam" : "Maximum 2× per month, no spam"}
        </p>
      </div>

      <p style="text-align:center;margin:1.5rem 0;">
        <a href="${BRAND.baseUrl}" class="btn-primary">${isDE ? "Jetzt losfahren" : "Start riding now"}</a>
      </p>
    `, locale, unsubscribeUrl),
  };
}

// ─── Registration Welcome ───

export function registrationWelcomeEmail(locale: string, firstName: string, unsubscribeUrl?: string): { subject: string; html: string } {
  const isDE = locale === "de";
  const name = firstName || (isDE ? "Rider" : "Rider");
  return {
    subject: isDE
      ? `Willkommen bei CycleRun, ${name}! 🚴`
      : `Welcome to CycleRun, ${name}! 🚴`,
    html: wrapper(`
      <h1>${isDE ? `Hey ${name}!` : `Hey ${name}!`}</h1>
      <p>${isDE
        ? "Deine Registrierung bei CycleRun.app war erfolgreich. Deine Trainings-Sessions werden jetzt automatisch gespeichert."
        : "Your registration at CycleRun.app was successful. Your training sessions will now be saved automatically."
      }</p>

      <div style="background:rgba(249,115,22,0.06);border:1px solid rgba(249,115,22,0.12);border-radius:12px;padding:1.25rem;margin:1rem 0;">
        <p style="margin:0 0 0.75rem;font-weight:600;color:#fafaf9;">${isDE ? "Was du jetzt tun kannst:" : "What you can do now:"}</p>
        <p style="margin:0;font-size:0.85rem;">
          🚴 ${isDE ? "Deine Fahrten werden mit deinem Profil gespeichert" : "Your rides are saved to your profile"}<br>
          📊 ${isDE ? "Statistiken: Distanz, Dauer, Geschwindigkeit" : "Statistics: distance, duration, speed"}<br>
          📸 ${isDE ? "Instagram Share Cards nach jeder Fahrt" : "Instagram share cards after every ride"}<br>
          🎯 ${isDE ? "Stimme auf der Roadmap über neue Features ab" : "Vote on new features on the roadmap"}
        </p>
      </div>

      <p style="text-align:center;margin:1.5rem 0;">
        <a href="${BRAND.baseUrl}" class="btn-primary">${isDE ? "Nächste Fahrt starten" : "Start your next ride"}</a>
      </p>

      <div class="email-divider"></div>
      <p class="text-muted">
        ${isDE
          ? "Deine Daten werden ausschließlich zur Verbesserung von CycleRun verwendet. Wir verkaufen keine Daten. Du kannst jederzeit die Löschung beantragen unter kontakt@cyclerun.app."
          : "Your data is used exclusively to improve CycleRun. We never sell data. You can request deletion anytime at kontakt@cyclerun.app."
        }
      </p>
    `, locale, unsubscribeUrl),
  };
}

// ─── Creator Application Confirmation ───

export function creatorApplicationEmail(locale: string, name: string): { subject: string; html: string } {
  const isDE = locale === "de";
  return {
    subject: isDE
      ? "Creator-Bewerbung eingegangen — CycleRun.app"
      : "Creator application received — CycleRun.app",
    html: wrapper(`
      <h1>${isDE ? `Danke, ${name}!` : `Thanks, ${name}!`}</h1>
      <p>${isDE
        ? "Wir haben deine Creator-Bewerbung erhalten und prüfen sie innerhalb von 48 Stunden."
        : "We've received your creator application and will review it within 48 hours."
      }</p>

      <div style="background:rgba(34,197,94,0.06);border:1px solid rgba(34,197,94,0.12);border-radius:12px;padding:1.25rem;margin:1rem 0;">
        <p style="margin:0 0 0.75rem;font-weight:600;color:#fafaf9;">${isDE ? "Was passiert als nächstes:" : "What happens next:"}</p>
        <p style="margin:0;font-size:0.85rem;">
          1️⃣ ${isDE ? "Wir prüfen deine Bewerbung (≤48h)" : "We review your application (≤48h)"}<br>
          2️⃣ ${isDE ? "Du erhältst eine E-Mail mit deinem Ergebnis" : "You'll receive an email with the result"}<br>
          3️⃣ ${isDE ? "Bei Zusage: Zugang zum Creator Dashboard" : "If approved: access to the Creator Dashboard"}<br>
          4️⃣ ${isDE ? "Lade deine erste Route hoch und verdiene" : "Upload your first route and start earning"}
        </p>
      </div>

      <p>${isDE
        ? "In der Zwischenzeit kannst du unseren Recording-Guide lesen:"
        : "In the meantime, check out our recording guide:"
      }</p>
      <p style="text-align:center;margin:1rem 0;">
        <a href="${BRAND.baseUrl}/creator#recording-guide" class="btn-primary">${isDE ? "Recording Guide lesen" : "Read the Recording Guide"}</a>
      </p>

      <div class="email-divider"></div>
      <p class="text-muted">
        ${isDE
          ? "Fragen? Schreib uns an creator@cyclerun.app — wir antworten innerhalb von 24 Stunden."
          : "Questions? Reach out to creator@cyclerun.app — we reply within 24 hours."
        }
      </p>
    `, locale),
  };
}

