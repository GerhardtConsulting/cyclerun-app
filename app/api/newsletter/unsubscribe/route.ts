import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * GET /api/newsletter/unsubscribe?email=...
 * DSGVO: One-click unsubscribe, no login required
 */
export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");

  if (!email) {
    return new NextResponse(page("Missing email.", false), {
      status: 400,
      headers: { "Content-Type": "text/html" },
    });
  }

  const supabase = getSupabase();
  const { error } = await supabase
    .from("newsletter_subscribers")
    .update({ unsubscribed_at: new Date().toISOString() })
    .eq("email", email.toLowerCase());

  if (error) {
    console.error("Unsubscribe error:", error);
    return new NextResponse(page("Something went wrong. Please try again or email kontakt@cyclerun.app.", false), {
      status: 500,
      headers: { "Content-Type": "text/html" },
    });
  }

  return new NextResponse(page("", true), {
    status: 200,
    headers: { "Content-Type": "text/html" },
  });
}

function page(errorMsg: string, success: boolean) {
  const title = success ? "Unsubscribed" : "Error";
  const content = success
    ? `<div class="check">✓</div><h1>You've been unsubscribed</h1><p>You won't receive any more newsletters from CycleRun. If this was a mistake, you can re-subscribe anytime at <a href="https://cyclerun.app" style="color:#f97316;">cyclerun.app</a>.</p><p style="margin-top:1.5rem;"><a href="https://cyclerun.app" style="display:inline-block;padding:0.6rem 1.5rem;background:linear-gradient(135deg,#f97316,#ea580c);color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">Back to CycleRun</a></p>`
    : `<h1>Oops</h1><p>${errorMsg}</p>`;

  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} — CycleRun.app</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0a0a0a;color:#fafaf9;font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif}.card{text-align:center;padding:3rem 2rem;max-width:440px}.logo{font-size:1.5rem;font-weight:800;margin-bottom:1.5rem}.logo .app{color:#f97316}h1{font-size:1.5rem;margin-bottom:0.75rem}p{color:#a8a29e;line-height:1.6;font-size:0.92rem}.check{width:64px;height:64px;border-radius:50%;background:rgba(34,197,94,0.1);display:flex;align-items:center;justify-content:center;margin:0 auto 1.5rem;font-size:2rem}a{color:#f97316}</style></head>
<body><div class="card"><div class="logo">cyclerun<span class="app">.app</span></div>${content}</div></body></html>`;
}
