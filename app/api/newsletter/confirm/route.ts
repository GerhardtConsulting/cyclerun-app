import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { newsletterWelcomeEmail, BRAND } from "@/lib/email-templates";

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
 * GET /api/newsletter/confirm?token=... — Confirm double opt-in
 */
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return new NextResponse(errorPage("Invalid link."), {
      status: 400,
      headers: { "Content-Type": "text/html" },
    });
  }

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .update({ confirmed: true, confirmed_at: new Date().toISOString() })
    .eq("confirm_token", token)
    .eq("confirmed", false)
    .select("email, locale")
    .single();

  if (error || !data) {
    return new NextResponse(
      errorPage("Link expired or already confirmed."),
      { status: 400, headers: { "Content-Type": "text/html" } }
    );
  }

  // Send welcome email (non-blocking — don't fail confirmation if this errors)
  try {
    const unsubscribeUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://cyclerun.app"}/api/newsletter/unsubscribe?email=${encodeURIComponent(data.email)}`;
    const welcome = newsletterWelcomeEmail(data.locale || "en", unsubscribeUrl);
    const resend = getResend();
    await resend.emails.send({
      from: BRAND.from,
      to: data.email,
      subject: welcome.subject,
      html: welcome.html,
      headers: {
        "List-Unsubscribe": `<${unsubscribeUrl}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    });
  } catch (e) {
    console.error("Welcome email error:", e);
  }

  return new NextResponse(successPage(), {
    status: 200,
    headers: { "Content-Type": "text/html" },
  });
}

function successPage() {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Confirmed — CycleRun.app</title>
  <style>*{margin:0;padding:0;box-sizing:border-box}body{min-height:100vh;display:flex;align-items:center;justify-content:center;background:#000;color:#fafaf9;font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif}.card{text-align:center;padding:3rem 2rem;max-width:420px}.logo{font-size:1.5rem;font-weight:800;margin-bottom:1.5rem}.logo .app{background:linear-gradient(135deg,#fbbf24,#f97316,#dc2626);-webkit-background-clip:text;-webkit-text-fill-color:transparent}h1{font-size:1.75rem;margin-bottom:0.75rem}p{color:#a8a29e;line-height:1.6}.check{width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,rgba(34,197,94,0.15),rgba(34,197,94,0.05));display:flex;align-items:center;justify-content:center;margin:0 auto 1.5rem;font-size:2rem}</style></head>
  <body><div class="card"><div class="logo">cyclerun<span class="app">.app</span></div><div class="check">✓</div><h1>You're in!</h1><p>Your newsletter subscription is confirmed. We'll only send meaningful updates — no spam, ever.</p></div></body></html>`;
}

function errorPage(msg: string) {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Error — CycleRun.app</title>
  <style>*{margin:0;padding:0;box-sizing:border-box}body{min-height:100vh;display:flex;align-items:center;justify-content:center;background:#000;color:#fafaf9;font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif}.card{text-align:center;padding:3rem 2rem;max-width:420px}.logo{font-size:1.5rem;font-weight:800;margin-bottom:1.5rem}.logo .app{background:linear-gradient(135deg,#fbbf24,#f97316,#dc2626);-webkit-background-clip:text;-webkit-text-fill-color:transparent}h1{font-size:1.75rem;margin-bottom:0.75rem}p{color:#a8a29e;line-height:1.6}</style></head>
  <body><div class="card"><div class="logo">cyclerun<span class="app">.app</span></div><h1>Oops</h1><p>${msg}</p></div></body></html>`;
}
