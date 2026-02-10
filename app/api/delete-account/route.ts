import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { BRAND } from "@/lib/email-templates";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * POST /api/delete-account
 * Body: { email, confirmPhrase }
 * 
 * DSGVO Art. 17 — Right to Erasure (Recht auf Löschung)
 * Permanently deletes all user data after confirmation.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, confirmPhrase } = body;

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    // Require explicit confirmation phrase
    if (confirmPhrase !== "DELETE" && confirmPhrase !== "LÖSCHEN") {
      return NextResponse.json({ error: "Confirmation required" }, { status: 400 });
    }

    const supabase = getSupabase();
    const emailLower = email.trim().toLowerCase();

    // Fetch user
    const { data: user } = await supabase
      .from("registrations")
      .select("id, first_name, locale")
      .eq("email", emailLower)
      .single();

    if (!user) {
      // Don't reveal if email exists (privacy)
      return NextResponse.json({ status: "deleted" });
    }

    const userId = user.id;
    const isDE = user.locale === "de";

    // Delete all related data in correct order (respecting foreign keys)
    await Promise.all([
      supabase.from("user_feedback").delete().eq("user_id", userId),
      supabase.from("user_goals").delete().eq("user_id", userId),
      supabase.from("user_badges").delete().eq("user_id", userId),
      supabase.from("sessions").delete().eq("user_id", userId),
      supabase.from("route_purchases").delete().eq("buyer_id", userId),
      supabase.from("upvotes").delete().eq("voter_id", userId),
      supabase.from("upvotes").delete().eq("target_user_id", userId),
      supabase.from("referrals").delete().eq("referrer_id", userId),
      supabase.from("referrals").delete().eq("referred_id", userId),
      supabase.from("email_log").delete().eq("user_id", userId),
    ]);

    // Delete creator routes if any (and related purchases)
    const { data: creatorRoutes } = await supabase
      .from("creator_routes")
      .select("id")
      .eq("creator_id", userId);

    if (creatorRoutes && creatorRoutes.length > 0) {
      const routeIds = creatorRoutes.map((r) => r.id);
      await supabase.from("route_purchases").delete().in("route_id", routeIds);
      await supabase.from("route_ratings").delete().in("route_id", routeIds);
      await supabase.from("creator_routes").delete().eq("creator_id", userId);
    }

    // Delete avatar from storage
    const { data: avatarFiles } = await supabase.storage.from("avatars").list("", {
      search: userId,
    });
    if (avatarFiles && avatarFiles.length > 0) {
      await supabase.storage.from("avatars").remove(avatarFiles.map((f) => f.name));
    }

    // Finally delete the user registration
    await supabase.from("registrations").delete().eq("id", userId);

    // Send confirmation email
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    await resend.emails.send({
      from: BRAND.from,
      to: emailLower,
      subject: isDE 
        ? "Dein Account wurde gelöscht — CycleRun.app"
        : "Your account has been deleted — CycleRun.app",
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0c0a09; color: #d6d3d1; padding: 32px;">
          <div style="max-width: 600px; margin: 0 auto;">
            <h1 style="color: #fafaf9; font-size: 24px;">${isDE ? "Account gelöscht" : "Account Deleted"}</h1>
            <p style="line-height: 1.6;">${isDE
              ? `Hallo ${user.first_name}, dein CycleRun-Account wurde gemäß DSGVO Art. 17 (Recht auf Löschung) vollständig und unwiderruflich gelöscht.`
              : `Hello ${user.first_name}, your CycleRun account has been completely and permanently deleted in accordance with GDPR Art. 17 (Right to Erasure).`
            }</p>
            <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 16px; margin: 24px 0;">
              <p style="margin: 0; font-size: 14px; color: #a8a29e;">${isDE ? "Gelöschte Daten:" : "Deleted data:"}</p>
              <ul style="margin: 8px 0 0; padding-left: 20px; font-size: 14px; color: #d6d3d1;">
                <li>${isDE ? "Profil und persönliche Daten" : "Profile and personal data"}</li>
                <li>${isDE ? "Alle Trainingseinheiten" : "All training sessions"}</li>
                <li>${isDE ? "Badges und Fortschritt" : "Badges and progress"}</li>
                <li>${isDE ? "Ziele und Feedback" : "Goals and feedback"}</li>
                <li>${isDE ? "Käufe und Credits" : "Purchases and credits"}</li>
                <li>${isDE ? "Hochgeladene Inhalte" : "Uploaded content"}</li>
              </ul>
            </div>
            <p style="line-height: 1.6;">${isDE
              ? "Diese Aktion kann nicht rückgängig gemacht werden. Du kannst dich jederzeit neu registrieren."
              : "This action cannot be undone. You can register again at any time."
            }</p>
            <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.06); margin: 24px 0;">
            <p style="font-size: 12px; color: #78716c;">${isDE
              ? "Bei Fragen wende dich an datenschutz@cyclerun.app"
              : "For questions, contact datenschutz@cyclerun.app"
            }</p>
          </div>
        </body>
        </html>
      `,
    });

    return NextResponse.json({ status: "deleted" });
  } catch (err) {
    console.error("Delete account error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
