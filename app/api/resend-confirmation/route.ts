import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { registrationConfirmEmail, BRAND } from "@/lib/email-templates";

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
 * POST /api/resend-confirmation
 * Body: { email }
 * Resends the DOI confirmation email for unconfirmed accounts.
 * DSGVO-compliant: Only works for existing, unconfirmed accounts.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const supabase = getSupabase();
    const emailLower = email.trim().toLowerCase();

    // Check if user exists and is not confirmed
    const { data: user } = await supabase
      .from("registrations")
      .select("id, first_name, email_confirmed, locale")
      .eq("email", emailLower)
      .single();

    if (!user) {
      // Don't reveal if email exists or not (DSGVO)
      return NextResponse.json({ status: "sent" });
    }

    if (user.email_confirmed) {
      return NextResponse.json({ status: "already_confirmed" });
    }

    // Generate new confirmation token
    const confirmToken = crypto.randomUUID();
    
    await supabase
      .from("registrations")
      .update({ email_confirm_token: confirmToken })
      .eq("id", user.id);

    // Send confirmation email
    const confirmUrl = `${BRAND.baseUrl}/confirm?token=${confirmToken}`;
    const locale = user.locale || "en";
    const emailContent = registrationConfirmEmail(locale, user.first_name, confirmUrl);

    const resend = getResend();
    await resend.emails.send({
      from: BRAND.from,
      to: emailLower,
      subject: emailContent.subject,
      html: emailContent.html,
    });

    return NextResponse.json({ status: "sent" });
  } catch (err) {
    console.error("Resend confirmation error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
