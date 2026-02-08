import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { registrationConfirmEmail, adminNotificationEmail, BRAND } from "@/lib/email-templates";

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
 * POST /api/register
 * Body: { firstName, lastName?, email, sport?, locale?, consentPrivacy, newsletterOptIn? }
 * Creates registration, generates DOI token, sends confirmation email.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, sport, locale, consentPrivacy, newsletterOptIn, referralCode } = body;

    if (!firstName || !email || !consentPrivacy) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const supabase = getSupabase();
    const emailLower = email.trim().toLowerCase();

    // Check if already registered
    const { data: existing } = await supabase
      .from("registrations")
      .select("id, email_confirmed")
      .eq("email", emailLower)
      .single();

    if (existing?.email_confirmed) {
      return NextResponse.json({ status: "already_confirmed" });
    }

    // Generate confirmation token
    const confirmToken = crypto.randomUUID();

    if (existing) {
      // User exists but not confirmed — update token and resend
      await supabase
        .from("registrations")
        .update({ email_confirm_token: confirmToken })
        .eq("id", existing.id);
    } else {
      // New registration
      const { error: insertError } = await supabase.from("registrations").insert({
        first_name: firstName,
        last_name: lastName || null,
        email: emailLower,
        preferred_sport: sport || "cycling",
        locale: locale || "en",
        consent_privacy: consentPrivacy,
        consent_data_processing: consentPrivacy,
        newsletter_opt_in: newsletterOptIn || false,
        email_confirm_token: confirmToken,
        email_confirmed: false,
      });

      if (insertError && insertError.code === "23505") {
        // Race condition — duplicate, just update token
        await supabase
          .from("registrations")
          .update({ email_confirm_token: confirmToken })
          .eq("email", emailLower);
      } else if (insertError) {
        console.error("Registration insert error:", insertError);
        return NextResponse.json({ error: "Registration failed" }, { status: 500 });
      }

      // Subscribe to newsletter if opted in
      if (newsletterOptIn) {
        try {
          const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://cyclerun.app";
          await fetch(`${appUrl}/api/newsletter`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: emailLower, locale: locale || "en" }),
          });
        } catch { /* non-critical */ }
      }

      // Process referral code if present
      if (referralCode) {
        try {
          const { data: newUser } = await supabase
            .from("registrations")
            .select("id")
            .eq("email", emailLower)
            .single();
          if (newUser) {
            await supabase.rpc("process_referral", { p_referred_id: newUser.id, p_referral_code: referralCode });
          }
        } catch { /* non-critical */ }
      }

      // Notify admin (fire-and-forget)
      try {
        const adminTpl = adminNotificationEmail("registration", {
          Name: firstName + (lastName ? ` ${lastName}` : ""),
          Email: emailLower,
          Sport: sport || "cycling",
          Locale: locale || "en",
          Newsletter: newsletterOptIn ? "Ja" : "Nein",
        });
        const resend = getResend();
        await resend.emails.send({
          from: BRAND.from,
          to: process.env.ADMIN_EMAIL || "maximiliangerhardtofficial@gmail.com",
          subject: adminTpl.subject,
          html: adminTpl.html,
        });
      } catch { /* non-critical */ }
    }

    // Send DOI confirmation email
    const confirmUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://cyclerun.app"}/api/register/confirm?token=${confirmToken}`;
    const emailLocale = (locale || "en").startsWith("de") ? "de" : "en";
    const template = registrationConfirmEmail(emailLocale, firstName, confirmUrl);

    const resend = getResend();
    const { error: mailError } = await resend.emails.send({
      from: BRAND.from,
      to: emailLower,
      subject: template.subject,
      html: template.html,
    });

    if (mailError) {
      console.error("Confirmation email error:", mailError);
      // Registration still succeeds — user can request resend
    }

    return NextResponse.json({ status: "confirmation_sent" });
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
