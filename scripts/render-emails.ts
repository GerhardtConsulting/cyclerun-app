/**
 * Renders all email templates to HTML files for visual inspection.
 * Run: npx tsx scripts/render-emails.ts
 */
import { newsletterConfirmEmail, newsletterWelcomeEmail, registrationWelcomeEmail, creatorApplicationEmail, adminNotificationEmail } from "../lib/email-templates";
import { writeFileSync, mkdirSync } from "fs";

mkdirSync("email-preview", { recursive: true });

const templates = [
  { name: "01-newsletter-confirm-de", ...newsletterConfirmEmail("de", "https://cyclerun.app/api/newsletter/confirm?token=PREVIEW_TOKEN") },
  { name: "02-newsletter-confirm-en", ...newsletterConfirmEmail("en", "https://cyclerun.app/api/newsletter/confirm?token=PREVIEW_TOKEN") },
  { name: "03-newsletter-welcome-de", ...newsletterWelcomeEmail("de", "https://cyclerun.app/api/newsletter/unsubscribe?email=test@example.com") },
  { name: "04-newsletter-welcome-en", ...newsletterWelcomeEmail("en", "https://cyclerun.app/api/newsletter/unsubscribe?email=test@example.com") },
  { name: "05-registration-de", ...registrationWelcomeEmail("de", "Maximilian", "https://cyclerun.app/api/newsletter/unsubscribe?email=test@example.com") },
  { name: "06-registration-en", ...registrationWelcomeEmail("en", "Max", "https://cyclerun.app/api/newsletter/unsubscribe?email=test@example.com") },
  { name: "07-creator-de", ...creatorApplicationEmail("de", "Maximilian") },
  { name: "08-creator-en", ...creatorApplicationEmail("en", "Max") },
  { name: "09-admin-registration", ...adminNotificationEmail("registration", { Name: "Max Gerhardt", Email: "max@test.com", Sport: "cycling", Locale: "de", Newsletter: "Ja" }) },
  { name: "10-admin-newsletter", ...adminNotificationEmail("newsletter_confirmed", { Email: "max@test.com", Locale: "de" }) },
  { name: "11-admin-creator", ...adminNotificationEmail("creator_application", { Name: "Max", Email: "max@test.com", Social: "@max", Routen: "Mallorca", Locale: "de" }) },
];

for (const t of templates) {
  const path = `email-preview/${t.name}.html`;
  writeFileSync(path, t.html, "utf-8");
  console.log(`✓ ${path} — Subject: ${t.subject}`);
}

console.log(`\nRendered ${templates.length} templates to email-preview/`);
