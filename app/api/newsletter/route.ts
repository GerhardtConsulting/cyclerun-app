import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

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

    const isDE = locale === "de";
    const resend = getResend();
    const { error: mailError } = await resend.emails.send({
      from: "CycleRun.app <noreply@cyclerun.app>",
      to: email.toLowerCase(),
      subject: isDE
        ? "Bestätige dein CycleRun Newsletter-Abo"
        : "Confirm your CycleRun newsletter subscription",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif; max-width: 480px; margin: 0 auto; padding: 2rem; background: #0a0a0a; color: #fafaf9; border-radius: 16px;">
          <h2 style="margin: 0 0 0.5rem; font-size: 1.5rem;">
            <span style="color: #fafaf9;">cyclerun</span><span style="color: #f97316;">.app</span>
          </h2>
          <p style="color: #a8a29e; margin: 0 0 1.5rem; font-size: 0.9rem;">
            ${isDE ? "Nur Updates, kein Spam. Jederzeit abbestellbar." : "Only updates, no spam. Unsubscribe anytime."}
          </p>
          <p style="margin: 0 0 1.5rem;">
            ${isDE ? "Bitte bestätige dein Newsletter-Abo:" : "Please confirm your newsletter subscription:"}
          </p>
          <a href="${confirmUrl}" style="display: inline-block; padding: 0.75rem 2rem; background: linear-gradient(135deg, #fbbf24, #f97316, #dc2626); color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">
            ${isDE ? "Abo bestätigen" : "Confirm subscription"}
          </a>
          <p style="color: #57534e; font-size: 0.75rem; margin-top: 2rem;">
            ${isDE ? "Falls du diesen Newsletter nicht angefordert hast, ignoriere diese E-Mail einfach." : "If you didn't request this newsletter, simply ignore this email."}
          </p>
        </div>
      `,
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
