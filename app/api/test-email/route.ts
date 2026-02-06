import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  newsletterConfirmEmail,
  newsletterWelcomeEmail,
  registrationWelcomeEmail,
  creatorApplicationEmail,
  BRAND,
} from "@/lib/email-templates";

/**
 * GET /api/test-email?to=...
 * Sends all 4 email templates as test emails.
 * ⚠️ Remove this endpoint before going to production.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const to = searchParams.get("to");

  if (!to) {
    return NextResponse.json({ error: "Missing ?to= parameter" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "RESEND_API_KEY not set" }, { status: 500 });
  }

  const resend = new Resend(apiKey);
  const results: { template: string; status: string; error?: string }[] = [];

  // 1. Newsletter Double Opt-In (DE)
  try {
    const tpl = newsletterConfirmEmail("de", "https://cyclerun.app/api/newsletter/confirm?token=TEST_TOKEN");
    await resend.emails.send({ from: BRAND.from, to, subject: `[TEST] ${tpl.subject}`, html: tpl.html });
    results.push({ template: "Newsletter Confirm (DE)", status: "sent" });
  } catch (e: unknown) {
    results.push({ template: "Newsletter Confirm (DE)", status: "error", error: String(e) });
  }

  // 2. Newsletter Welcome (EN)
  try {
    const tpl = newsletterWelcomeEmail("en", "https://cyclerun.app/api/newsletter/unsubscribe?email=test");
    await resend.emails.send({ from: BRAND.from, to, subject: `[TEST] ${tpl.subject}`, html: tpl.html });
    results.push({ template: "Newsletter Welcome (EN)", status: "sent" });
  } catch (e: unknown) {
    results.push({ template: "Newsletter Welcome (EN)", status: "error", error: String(e) });
  }

  // 3. Registration Welcome (DE)
  try {
    const tpl = registrationWelcomeEmail("de", "Maximilian", "https://cyclerun.app/api/newsletter/unsubscribe?email=test");
    await resend.emails.send({ from: BRAND.from, to, subject: `[TEST] ${tpl.subject}`, html: tpl.html });
    results.push({ template: "Registration Welcome (DE)", status: "sent" });
  } catch (e: unknown) {
    results.push({ template: "Registration Welcome (DE)", status: "error", error: String(e) });
  }

  // 4. Creator Application (DE)
  try {
    const tpl = creatorApplicationEmail("de", "Maximilian");
    await resend.emails.send({ from: BRAND.from, to, subject: `[TEST] ${tpl.subject}`, html: tpl.html });
    results.push({ template: "Creator Application (DE)", status: "sent" });
  } catch (e: unknown) {
    results.push({ template: "Creator Application (DE)", status: "error", error: String(e) });
  }

  const allOk = results.every((r) => r.status === "sent");

  return NextResponse.json({
    success: allOk,
    sent_to: to,
    results,
  });
}
