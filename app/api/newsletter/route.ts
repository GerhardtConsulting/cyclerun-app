import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import { newsletterConfirmEmail, BRAND } from "@/lib/email-templates";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * POST /api/newsletter — Subscribe (DSGVO double opt-in)
 * Body: { email, locale? }
 */
export async function POST(req: NextRequest) {
  try {
    const { email, locale = "en" } = await req.json();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Check if already subscribed
    const supabase = getSupabase();
    const { data: existing } = await supabase
      .from("newsletter_subscribers")
      .select("id, confirmed, unsubscribed_at")
      .eq("email", email.toLowerCase())
      .single();

    if (existing?.confirmed && !existing?.unsubscribed_at) {
      return NextResponse.json({ status: "already_subscribed" });
    }

    // Upsert subscriber with new confirm token
    const confirmToken = crypto.randomUUID();
    const { error: dbError } = await supabase
      .from("newsletter_subscribers")
      .upsert(
        {
          email: email.toLowerCase(),
          locale,
          confirmed: false,
          confirm_token: confirmToken,
          unsubscribed_at: null,
        },
        { onConflict: "email" }
      );

    if (dbError) {
      console.error("DB error:", dbError);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    // Send confirmation email via Resend
    const confirmUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://cyclerun.app"}/api/newsletter/confirm?token=${confirmToken}`;
    const emailTemplate = newsletterConfirmEmail(locale, confirmUrl);

    const resend = getResend();
    const { error: mailError } = await resend.emails.send({
      from: BRAND.from,
      to: email.toLowerCase(),
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });

    if (mailError) {
      console.error("Resend error:", mailError);
      return NextResponse.json({ error: "Email send failed" }, { status: 500 });
    }

    return NextResponse.json({ status: "confirmation_sent" });
  } catch (err) {
    console.error("Newsletter error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
