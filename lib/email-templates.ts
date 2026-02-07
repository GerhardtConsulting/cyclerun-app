/**
 * CycleRun.app — Email Templates
 * DSGVO/GDPR & ePrivacy compliant
 * - Physical address (§ 5 DDG)
 * - Impressum + Datenschutz links
 * - Unsubscribe / Opt-Out in every marketing email
 * - DOIP 48h auto-delete disclaimer
 * Bilingual: EN + DE based on locale
 * Design: Premium dark bento-box style with gradient accents
 */

export const BRAND = {
  baseUrl: "https://cyclerun.app",
  from: "CycleRun.app <noreply@mail.cyclerun.app>",
  address: "Maximilian Gerhardt · c/o Impressumservice Dein-Impressum · Stettiner Str. 41 · 35410 Hungen · Deutschland",
};

/**
 * Premium email wrapper — dark bento-box layout with gradient accent bar,
 * DSGVO-compliant footer (address, Impressum, Datenschutz, Unsubscribe).
 */
function wrapper(
  content: string,
  locale: string,
  opts?: { unsubscribeUrl?: string; reason?: string }
): string {
  const isDE = locale === "de";
  const unsub = opts?.unsubscribeUrl;
  const reason = opts?.reason || (isDE
    ? "Du erhältst diese E-Mail, weil du eine Aktion auf CycleRun.app durchgeführt hast."
    : "You are receiving this email because of an action you took on CycleRun.app.");

  return `<!DOCTYPE html>
<html lang="${locale}" dir="ltr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
  <title>CycleRun.app</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
</head>
<body style="margin:0;padding:0;background:#050505;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#050505;">
    <tr><td align="center" style="padding:2rem 1rem;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:540px;">

        <!-- Gradient accent bar -->
        <tr><td style="height:4px;background:linear-gradient(90deg,#fbbf24,#f97316,#dc2626,#f97316,#fbbf24);border-radius:20px 20px 0 0;"></td></tr>

        <!-- Main card -->
        <tr><td style="background:#111111;border-left:1px solid rgba(255,255,255,0.05);border-right:1px solid rgba(255,255,255,0.05);padding:2.5rem 2rem 2rem;">

          <!-- Logo -->
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:2rem;">
            <tr>
              <td style="font-family:-apple-system,BlinkMacSystemFont,'Inter','Segoe UI',Roboto,sans-serif;font-size:1.4rem;font-weight:800;letter-spacing:-0.03em;color:#fafaf9;">cyclerun</td>
              <td style="font-family:-apple-system,BlinkMacSystemFont,'Inter','Segoe UI',Roboto,sans-serif;font-size:1.4rem;font-weight:800;letter-spacing:-0.03em;color:#f97316;">.</td>
              <td style="font-family:-apple-system,BlinkMacSystemFont,'Inter','Segoe UI',Roboto,sans-serif;font-size:1.4rem;font-weight:800;letter-spacing:-0.03em;color:#f97316;">app</td>
            </tr>
          </table>

          ${content}

        </td></tr>

        <!-- Bottom accent line -->
        <tr><td style="height:1px;background:linear-gradient(90deg,transparent,rgba(249,115,22,0.3),transparent);"></td></tr>

        <!-- DSGVO-compliant footer -->
        <tr><td style="background:#0a0a0a;border-left:1px solid rgba(255,255,255,0.03);border-right:1px solid rgba(255,255,255,0.03);border-radius:0 0 20px 20px;padding:1.5rem 2rem;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-family:-apple-system,BlinkMacSystemFont,'Inter','Segoe UI',Roboto,sans-serif;">
            <tr><td style="font-size:0.72rem;line-height:1.7;color:#57534e;">
              ${reason}<br><br>
              ${unsub ? `<a href="${unsub}" style="color:#78716c;text-decoration:underline;">${isDE ? "E-Mails abbestellen" : "Unsubscribe"}</a>&nbsp;&nbsp;·&nbsp;&nbsp;` : ""}
              <a href="${BRAND.baseUrl}/datenschutz" style="color:#78716c;text-decoration:none;">${isDE ? "Datenschutz" : "Privacy Policy"}</a>&nbsp;&nbsp;·&nbsp;&nbsp;
              <a href="${BRAND.baseUrl}/impressum" style="color:#78716c;text-decoration:none;">${isDE ? "Impressum" : "Legal Notice"}</a>
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

/* ── Shared inline styles (email-client safe) ── */

const S = {
  h1: 'font-family:-apple-system,BlinkMacSystemFont,"Inter","Segoe UI",Roboto,sans-serif;font-size:1.35rem;font-weight:800;color:#fafaf9;margin:0 0 0.75rem;letter-spacing:-0.02em;line-height:1.3;',
  p: 'font-family:-apple-system,BlinkMacSystemFont,"Inter","Segoe UI",Roboto,sans-serif;font-size:0.9rem;line-height:1.75;color:#a8a29e;margin:0 0 1rem;',
  accent: 'color:#f97316;',
  muted: 'font-family:-apple-system,BlinkMacSystemFont,"Inter","Segoe UI",Roboto,sans-serif;font-size:0.78rem;line-height:1.6;color:#57534e;',
  cta: 'display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#f97316,#ea580c);color:#ffffff;text-decoration:none;border-radius:12px;font-family:-apple-system,BlinkMacSystemFont,"Inter",sans-serif;font-weight:700;font-size:0.92rem;letter-spacing:0.01em;',
  ctaSecondary: 'display:inline-block;padding:12px 28px;border:1px solid rgba(249,115,22,0.25);color:#f97316;text-decoration:none;border-radius:12px;font-family:-apple-system,BlinkMacSystemFont,"Inter",sans-serif;font-weight:600;font-size:0.85rem;',
  bentoBox: 'background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:14px;padding:1.25rem 1.5rem;margin:1.25rem 0;',
  bentoBoxAccent: 'background:linear-gradient(135deg,rgba(249,115,22,0.06),rgba(234,88,12,0.02));border:1px solid rgba(249,115,22,0.1);border-radius:14px;padding:1.25rem 1.5rem;margin:1.25rem 0;',
  bentoLabel: 'font-family:-apple-system,BlinkMacSystemFont,"Inter",sans-serif;font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#78716c;margin:0 0 0.5rem;',
  bentoValue: 'font-family:-apple-system,BlinkMacSystemFont,"Inter",sans-serif;font-size:0.88rem;color:#d6d3d1;line-height:1.7;margin:0;',
  divider: 'height:1px;background:rgba(255,255,255,0.04);margin:1.75rem 0;',
  step: 'font-family:-apple-system,BlinkMacSystemFont,"Inter",sans-serif;font-size:0.85rem;color:#d6d3d1;line-height:2;margin:0;',
  stepNum: 'display:inline-block;width:22px;height:22px;background:linear-gradient(135deg,#f97316,#ea580c);color:#fff;border-radius:7px;text-align:center;line-height:22px;font-size:0.7rem;font-weight:700;margin-right:10px;vertical-align:middle;',
};

// ─── Newsletter Double Opt-In Confirmation (DOIP) ───

export function newsletterConfirmEmail(locale: string, confirmUrl: string): { subject: string; html: string } {
  const isDE = locale === "de";
  return {
    subject: isDE
      ? "Bitte bestätige deine Anmeldung — CycleRun.app"
      : "Please confirm your subscription — CycleRun.app",
    html: wrapper(`
      <h1 style="${S.h1}">${isDE ? "Nur noch ein Schritt." : "One step left."}</h1>
      <p style="${S.p}">${isDE
        ? "Du hast dich soeben für den CycleRun-Newsletter eingetragen. Damit wir sicherstellen können, dass diese Anmeldung tatsächlich von dir stammt, bestätige bitte mit einem Klick."
        : "You just signed up for the CycleRun newsletter. To verify that this request came from you, please confirm with a single click."
      }</p>

      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:1.75rem 0;">
        <tr><td align="center">
          <a href="${confirmUrl}" style="${S.cta}">${isDE ? "Anmeldung bestätigen" : "Confirm subscription"}</a>
        </td></tr>
      </table>

      <!-- Bento info box: what you'll get -->
      <div style="${S.bentoBoxAccent}">
        <p style="${S.bentoLabel}">${isDE ? "Das erwartet dich" : "What you will receive"}</p>
        <p style="${S.bentoValue}">${isDE
          ? "Neue Routen und Feature-Updates, Community-Events sowie Tipps rund ums Indoor-Cycling — maximal zweimal im Monat, weil Qualität vor Quantität geht."
          : "New routes and feature updates, community events, and indoor cycling tips — twice a month at most, because quality comes before quantity."
        }</p>
      </div>

      <div style="${S.divider}"></div>

      <!-- DOIP Disclaimer (DSGVO Art. 7 + ePrivacy) -->
      <p style="${S.muted}">${isDE
        ? "Hinweis: Falls du diese Anmeldung nicht selbst vorgenommen hast, musst du nichts weiter tun. Deine E-Mail-Adresse wird in diesem Fall nicht gespeichert. Der Bestätigungslink ist 48 Stunden gültig — wird er nicht angeklickt, löschen wir deine Daten automatisch und unwiderruflich."
        : "Note: If you did not initiate this sign-up, no action is required. Your email address will not be stored. The confirmation link is valid for 48 hours — if not clicked, your data will be automatically and permanently deleted."
      }</p>
      <p style="${S.muted}">${isDE
        ? "Du kannst dein Abo jederzeit mit einem Klick abbestellen. Wir geben deine Daten nicht an Dritte weiter."
        : "You can unsubscribe at any time with a single click. We never share your data with third parties."
      }</p>
    `, locale, {
      reason: isDE
        ? "Du erhältst diese E-Mail, weil sich jemand mit dieser Adresse für den CycleRun.app-Newsletter eingetragen hat."
        : "You are receiving this email because someone used this address to subscribe to the CycleRun.app newsletter.",
    }),
  };
}

// ─── Newsletter Welcome (after confirmation) ───

export function newsletterWelcomeEmail(locale: string, unsubscribeUrl: string): { subject: string; html: string } {
  const isDE = locale === "de";
  return {
    subject: isDE
      ? "Dein Newsletter ist aktiv — CycleRun.app"
      : "Your newsletter is active — CycleRun.app",
    html: wrapper(`
      <h1 style="${S.h1}">${isDE ? "Du bist dabei." : "You're in."}</h1>
      <p style="${S.p}">${isDE
        ? "Dein Newsletter-Abo ist ab sofort aktiv. Du gehörst damit zu einer wachsenden Community, die Indoor-Cycling neu definiert — ganz ohne teures Equipment."
        : "Your newsletter subscription is now active. You're part of a growing community that's redefining indoor cycling — without expensive equipment."
      }</p>

      <!-- Bento grid: 2 boxes side by side -->
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:1.25rem 0;">
        <tr>
          <td width="48%" valign="top" style="${S.bentoBox}">
            <p style="${S.bentoLabel}">${isDE ? "Inhalte" : "Content"}</p>
            <p style="${S.bentoValue}">${isDE
              ? "Feature-Releases, neue Strecken und Community-Highlights"
              : "Feature releases, new routes, and community highlights"
            }</p>
          </td>
          <td width="4%"></td>
          <td width="48%" valign="top" style="${S.bentoBox}">
            <p style="${S.bentoLabel}">${isDE ? "Frequenz" : "Frequency"}</p>
            <p style="${S.bentoValue}">${isDE
              ? "Maximal zweimal pro Monat — konzentriert und relevant"
              : "Twice a month at most — focused and relevant"
            }</p>
          </td>
        </tr>
      </table>

      <p style="${S.p}">${isDE
        ? "Denn letztlich zählt nur eins: dass du aufs Rad steigst."
        : "Because in the end, only one thing matters: that you get on the bike."
      }</p>

      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:1.75rem 0;">
        <tr><td align="center">
          <a href="${BRAND.baseUrl}" style="${S.cta}">${isDE ? "Jetzt losfahren" : "Start riding now"}</a>
        </td></tr>
      </table>
    `, locale, {
      unsubscribeUrl,
      reason: isDE
        ? "Du erhältst diese E-Mail, weil du deinen CycleRun.app-Newsletter soeben bestätigt hast."
        : "You are receiving this email because you just confirmed your CycleRun.app newsletter subscription.",
    }),
  };
}

// ─── Registration Welcome ───

export function registrationWelcomeEmail(locale: string, firstName: string, unsubscribeUrl?: string): { subject: string; html: string } {
  const isDE = locale === "de";
  const name = firstName || "Rider";
  return {
    subject: isDE
      ? `Dein Profil ist aktiv, ${name} — CycleRun.app`
      : `Your profile is live, ${name} — CycleRun.app`,
    html: wrapper(`
      <h1 style="${S.h1}">${isDE ? `${name}, dein Profil ist startklar.` : `${name}, your profile is ready.`}</h1>
      <p style="${S.p}">${isDE
        ? "Ab sofort werden deine Trainings-Sessions automatisch gespeichert — denn jede Fahrt zählt, und du solltest deinen Fortschritt sehen können."
        : "From now on, your training sessions are saved automatically — because every ride counts, and you should be able to see your progress."
      }</p>

      <!-- Bento grid: 3 feature boxes -->
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:1.5rem 0;">
        <tr>
          <td width="31%" valign="top" style="${S.bentoBoxAccent}">
            <p style="${S.bentoLabel}">${isDE ? "Tracking" : "Tracking"}</p>
            <p style="${S.bentoValue}">${isDE ? "Distanz, Dauer, Speed und RPM" : "Distance, duration, speed & RPM"}</p>
          </td>
          <td width="3.5%"></td>
          <td width="31%" valign="top" style="${S.bentoBox}">
            <p style="${S.bentoLabel}">${isDE ? "Share Cards" : "Share Cards"}</p>
            <p style="${S.bentoValue}">${isDE ? "Instagram-Story nach jeder Fahrt" : "Instagram story after every ride"}</p>
          </td>
          <td width="3.5%"></td>
          <td width="31%" valign="top" style="${S.bentoBox}">
            <p style="${S.bentoLabel}">${isDE ? "Roadmap" : "Roadmap"}</p>
            <p style="${S.bentoValue}">${isDE ? "Stimme über neue Features ab" : "Vote on upcoming features"}</p>
          </td>
        </tr>
      </table>

      <p style="${S.p}">${isDE
        ? "Starte jetzt deine nächste Session — alles was du brauchst, ist dein Browser und eine Webcam."
        : "Start your next session now — all you need is your browser and a webcam."
      }</p>

      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:1.75rem 0;">
        <tr><td align="center">
          <a href="${BRAND.baseUrl}" style="${S.cta}">${isDE ? "Nächste Fahrt starten" : "Start your next ride"}</a>
        </td></tr>
      </table>

      <div style="${S.divider}"></div>
      <p style="${S.muted}">${isDE
        ? "Deine Daten werden ausschließlich zur Verbesserung von CycleRun verwendet und niemals an Dritte weitergegeben. Du kannst jederzeit die vollständige Löschung beantragen — schreib dazu an datenschutz@cyclerun.app."
        : "Your data is used exclusively to improve CycleRun and is never shared with third parties. You can request complete deletion at any time by writing to datenschutz@cyclerun.app."
      }</p>
    `, locale, {
      unsubscribeUrl,
      reason: isDE
        ? "Du erhältst diese E-Mail, weil du dich soeben bei CycleRun.app registriert hast."
        : "You are receiving this email because you just registered at CycleRun.app.",
    }),
  };
}

// ─── Creator Application Confirmation ───

export function creatorApplicationEmail(locale: string, name: string): { subject: string; html: string } {
  const isDE = locale === "de";
  return {
    subject: isDE
      ? "Deine Creator-Bewerbung ist eingegangen — CycleRun.app"
      : "Your creator application has been received — CycleRun.app",
    html: wrapper(`
      <h1 style="${S.h1}">${isDE ? `${name}, wir haben deine Bewerbung.` : `${name}, we have your application.`}</h1>
      <p style="${S.p}">${isDE
        ? "Deine Creator-Bewerbung wird jetzt von unserem Team geprüft. Wir melden uns innerhalb von 48 Stunden bei dir — damit du so schnell wie möglich loslegen kannst."
        : "Your creator application is now being reviewed by our team. We'll get back to you within 48 hours — so you can get started as soon as possible."
      }</p>

      <!-- Steps as numbered bento boxes -->
      <div style="${S.bentoBoxAccent}">
        <p style="${S.bentoLabel}">${isDE ? "Nächste Schritte" : "Next steps"}</p>
        <p style="${S.step}">
          <span style="${S.stepNum}">1</span>${isDE ? "Prüfung deiner Bewerbung durch unser Team" : "Review of your application by our team"}<br>
          <span style="${S.stepNum}">2</span>${isDE ? "Ergebnis per E-Mail innerhalb von 48 Stunden" : "Result via email within 48 hours"}<br>
          <span style="${S.stepNum}">3</span>${isDE ? "Bei Zusage: Freischaltung deines Creator Dashboards" : "If approved: activation of your Creator Dashboard"}<br>
          <span style="${S.stepNum}">4</span>${isDE ? "Erste Route hochladen und live schalten" : "Upload your first route and go live"}
        </p>
      </div>

      <p style="${S.p}">${isDE
        ? "Nutze die Zwischenzeit, um dich mit unserem Recording-Guide vorzubereiten — denn gut vorbereitete Routen performen deutlich besser."
        : "Use the time to prepare with our recording guide — because well-prepared routes perform significantly better."
      }</p>

      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:1.5rem 0;">
        <tr><td align="center">
          <a href="${BRAND.baseUrl}/creator#recording-guide" style="${S.cta}">${isDE ? "Recording-Guide lesen" : "Read the Recording Guide"}</a>
        </td></tr>
      </table>

      <div style="${S.divider}"></div>
      <p style="${S.muted}">${isDE
        ? "Bei Fragen erreichst du uns direkt unter creator@cyclerun.app — wir antworten in der Regel innerhalb von 24 Stunden."
        : "For questions, reach us directly at creator@cyclerun.app — we typically respond within 24 hours."
      }</p>
    `, locale, {
      reason: isDE
        ? "Du erhältst diese E-Mail, weil du dich als Creator bei CycleRun.app beworben hast."
        : "You are receiving this email because you applied as a creator on CycleRun.app.",
    }),
  };
}

// ─── Admin Notification (internal — sent to admin on events) ───

export function adminNotificationEmail(
  event: "registration" | "newsletter_confirmed" | "newsletter_unsubscribed" | "creator_application",
  details: Record<string, string>
): { subject: string; html: string } {
  const labels: Record<string, string> = {
    registration: "Neue Registrierung",
    newsletter_confirmed: "Newsletter bestätigt",
    newsletter_unsubscribed: "Newsletter abgemeldet",
    creator_application: "Neue Creator-Bewerbung",
  };
  const label = labels[event] || event;

  const eventColors: Record<string, string> = {
    registration: "linear-gradient(135deg,#f97316,#ea580c)",
    newsletter_confirmed: "linear-gradient(135deg,#22c55e,#16a34a)",
    newsletter_unsubscribed: "linear-gradient(135deg,#78716c,#57534e)",
    creator_application: "linear-gradient(135deg,#8b5cf6,#7c3aed)",
  };

  const detailRows = Object.entries(details)
    .map(([k, v]) => `
      <tr>
        <td style="padding:6px 16px 6px 0;${S.muted}white-space:nowrap;border-bottom:1px solid rgba(255,255,255,0.03);">${k}</td>
        <td style="padding:6px 0;font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif;font-size:0.85rem;color:#e7e5e4;border-bottom:1px solid rgba(255,255,255,0.03);">${v}</td>
      </tr>`)
    .join("");

  return {
    subject: `[Admin] ${label} — CycleRun.app`,
    html: `<!DOCTYPE html>
<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="dark"></head>
<body style="margin:0;padding:0;background:#050505;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#050505;">
    <tr><td align="center" style="padding:2rem 1rem;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;">

        <tr><td style="height:3px;background:${eventColors[event] || eventColors.registration};border-radius:16px 16px 0 0;"></td></tr>

        <tr><td style="background:#111111;border-left:1px solid rgba(255,255,255,0.05);border-right:1px solid rgba(255,255,255,0.05);padding:2rem 1.75rem;">

          <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:1.5rem;">
            <tr>
              <td style="font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif;font-size:1.2rem;font-weight:800;color:#fafaf9;">cyclerun</td>
              <td style="font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif;font-size:1.2rem;font-weight:800;color:#f97316;">.</td>
              <td style="font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif;font-size:1.2rem;font-weight:800;color:#f97316;">app</td>
              <td style="padding-left:12px;">
                <span style="display:inline-block;padding:3px 10px;border-radius:6px;font-family:-apple-system,sans-serif;font-size:0.65rem;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;background:rgba(249,115,22,0.1);color:#f97316;">Admin</span>
              </td>
            </tr>
          </table>

          <h2 style="font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif;font-size:1.1rem;font-weight:700;color:#fafaf9;margin:0 0 1.25rem;">${label}</h2>

          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:1.25rem;">
            ${detailRows}
          </table>

          <div style="height:1px;background:rgba(255,255,255,0.04);margin:1.25rem 0;"></div>
          <p style="font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif;margin:0;font-size:0.75rem;color:#57534e;">
            ${new Date().toLocaleString("de-DE", { timeZone: "Europe/Berlin", dateStyle: "long", timeStyle: "short" })}
          </p>

        </td></tr>

        <tr><td style="background:#0a0a0a;border-radius:0 0 16px 16px;padding:1rem 1.75rem;text-align:center;">
          <a href="https://cyclerun.app/admin" style="font-family:-apple-system,sans-serif;font-size:0.78rem;color:#78716c;text-decoration:none;">Dashboard öffnen</a>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body></html>`,
  };
}
