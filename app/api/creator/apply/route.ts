import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { creatorApplicationEmail, BRAND } from "@/lib/email-templates";

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
 * POST /api/creator/apply
 * Body: { name, email, social?, routes?, locale? }
 */
export async function POST(req: NextRequest) {
  try {
    const { name, email, social, routes, locale = "en" } = await req.json();

    if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Name and valid email required" }, { status: 400 });
    }

    const supabase = getSupabase();

    // Check if already applied
    const { data: existing } = await supabase
      .from("creators")
      .select("id")
      .eq("email", email.toLowerCase())
      .single();

    if (existing) {
      return NextResponse.json({ status: "already_applied" });
    }

    // Insert creator application
    const { error: dbError } = await supabase.from("creators").insert({
      email: email.toLowerCase(),
      display_name: name,
      website: social || null,
      bio: routes || null,
      is_verified: false,
      is_active: false,
    });

    if (dbError) {
      console.error("Creator DB error:", dbError);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    // Send confirmation email
    try {
      const template = creatorApplicationEmail(locale, name);
      const resend = getResend();
      await resend.emails.send({
        from: BRAND.from,
        to: email.toLowerCase(),
        subject: template.subject,
        html: template.html,
      });
    } catch (mailErr) {
      console.error("Creator mail error:", mailErr);
    }

    // Notify admin
    try {
      const resend = getResend();
      await resend.emails.send({
        from: BRAND.from,
        to: "kontakt@cyclerun.app",
        subject: `New Creator Application: ${name}`,
        html: `<div style="font-family:sans-serif;padding:1rem;">
          <h2>New Creator Application</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Social:</strong> ${social || "—"}</p>
          <p><strong>Routes:</strong> ${routes || "—"}</p>
          <p><strong>Locale:</strong> ${locale}</p>
          <p><strong>Time:</strong> ${new Date().toISOString()}</p>
        </div>`,
      });
    } catch (notifyErr) {
      console.error("Admin notify error:", notifyErr);
    }

    return NextResponse.json({ status: "application_received" });
  } catch (err) {
    console.error("Creator apply error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
