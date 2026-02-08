import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { registrationWelcomeEmail, BRAND } from "@/lib/email-templates";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

/**
 * GET /api/register/confirm?token=...
 * Verifies DOI token, sets email_confirmed=true, sends welcome email, redirects to /profile
 */
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/confirm?status=error&reason=invalid", req.url));
  }

  const supabase = getSupabase();

  // Find and confirm the user
  const { data, error } = await supabase
    .from("registrations")
    .update({
      email_confirmed: true,
      email_confirm_token: null,
    })
    .eq("email_confirm_token", token)
    .eq("email_confirmed", false)
    .select("id, email, first_name, locale")
    .single();

  if (error || !data) {
    // Check if already confirmed
    const { data: existing } = await supabase
      .from("registrations")
      .select("email_confirmed")
      .eq("email_confirm_token", token)
      .single();

    if (existing?.email_confirmed) {
      return NextResponse.redirect(new URL("/confirm?status=already", req.url));
    }

    // Check by null token (already confirmed and token cleared)
    return NextResponse.redirect(new URL("/confirm?status=error&reason=expired", req.url));
  }

  // Send welcome email (non-blocking)
  try {
    const emailLocale = (data.locale || "en").startsWith("de") ? "de" : "en";
    const welcome = registrationWelcomeEmail(emailLocale, data.first_name);
    const resend = getResend();
    await resend.emails.send({
      from: BRAND.from,
      to: data.email,
      subject: welcome.subject,
      html: welcome.html,
    });
  } catch (e) {
    console.error("Welcome email error:", e);
  }

  // Redirect to confirm page with success + email for auto-login
  const confirmUrl = new URL("/confirm", req.url);
  confirmUrl.searchParams.set("status", "success");
  confirmUrl.searchParams.set("email", data.email);
  confirmUrl.searchParams.set("name", data.first_name);
  return NextResponse.redirect(confirmUrl);
}
