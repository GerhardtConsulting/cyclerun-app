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
 * POST /api/data-export
 * Body: { email }
 * 
 * DSGVO Art. 15 — Right of Access (Auskunftsrecht)
 * Generates a complete data export and sends it to the user's email.
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

    // Fetch user
    const { data: user } = await supabase
      .from("registrations")
      .select("*")
      .eq("email", emailLower)
      .single();

    if (!user) {
      // Don't reveal if email exists (privacy)
      return NextResponse.json({ status: "sent" });
    }

    // Fetch all related data
    const [
      sessionsRes,
      badgesRes,
      goalsRes,
      feedbackRes,
      purchasesRes,
      upvotesGivenRes,
      upvotesReceivedRes,
      referralsRes,
      emailLogRes,
    ] = await Promise.all([
      supabase.from("sessions").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("user_badges").select("*, badges(*)").eq("user_id", user.id),
      supabase.from("user_goals").select("*").eq("user_id", user.id).maybeSingle(),
      supabase.from("user_feedback").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("route_purchases").select("*, creator_routes(title_en, title_de)").eq("buyer_id", user.id),
      supabase.from("upvotes").select("*").eq("voter_id", user.id),
      supabase.from("upvotes").select("*").eq("target_user_id", user.id),
      supabase.from("referrals").select("*").or(`referrer_id.eq.${user.id},referred_id.eq.${user.id}`),
      supabase.from("email_log").select("*").eq("user_id", user.id).order("sent_at", { ascending: false }),
    ]);

    // Build data export object
    const dataExport = {
      exportDate: new Date().toISOString(),
      exportType: "DSGVO Art. 15 — Right of Access (Auskunftsrecht)",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        displayName: user.display_name,
        nickname: user.nickname,
        locale: user.locale,
        avatarUrl: user.avatar_url,
        preferredSport: user.preferred_sport,
        registeredAt: user.created_at,
        emailConfirmed: user.email_confirmed,
        newsletterOptIn: user.newsletter_opt_in,
        isPublic: user.is_public,
        isCreator: user.is_creator,
        referralCode: user.referral_code,
      },
      stats: {
        totalEnergy: user.total_energy,
        totalSessions: user.total_sessions,
        totalDistanceKm: user.total_distance_km,
        totalDurationSeconds: user.total_duration_seconds,
        currentStreak: user.current_streak,
        longestStreak: user.longest_streak,
        level: user.level,
        credits: user.credits,
      },
      sessions: (sessionsRes.data || []).map((s) => ({
        id: s.id,
        date: s.created_at,
        sportType: s.sport_type,
        durationSeconds: s.duration_seconds,
        distanceKm: s.distance_km,
        avgSpeedKmh: s.avg_speed_kmh,
        maxSpeedKmh: s.max_speed_kmh,
        avgRpm: s.avg_rpm,
        caloriesEstimated: s.calories_estimated,
        gear: s.gear,
      })),
      badges: (badgesRes.data || []).map((b) => ({
        badgeId: b.badge_id,
        earnedAt: b.earned_at,
        badgeName: b.badges?.name_en,
      })),
      goals: goalsRes.data ? {
        primaryGoal: goalsRes.data.primary_goal,
        frequencyTarget: goalsRes.data.frequency_target,
        specificTarget: goalsRes.data.specific_target,
        capturePhase: goalsRes.data.capture_phase,
      } : null,
      feedback: (feedbackRes.data || []).map((f) => ({
        date: f.created_at,
        mood: f.mood,
        energy: f.energy,
        difficulty: f.difficulty,
      })),
      purchases: (purchasesRes.data || []).map((p) => ({
        date: p.created_at,
        routeTitle: p.creator_routes?.title_en,
        creditsPaid: p.credits_paid,
      })),
      upvotesGiven: upvotesGivenRes.data?.length || 0,
      upvotesReceived: upvotesReceivedRes.data?.length || 0,
      referrals: {
        given: referralsRes.data?.filter((r) => r.referrer_id === user.id).length || 0,
        received: referralsRes.data?.filter((r) => r.referred_id === user.id).length || 0,
      },
      emailLog: (emailLogRes.data || []).map((e) => ({
        date: e.sent_at,
        templateKey: e.template_key,
      })),
    };

    // Generate JSON file content
    const jsonContent = JSON.stringify(dataExport, null, 2);
    const isDE = user.locale === "de";

    // Send email with data export
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    await resend.emails.send({
      from: BRAND.from,
      to: emailLower,
      subject: isDE 
        ? "Deine Datenauskunft — CycleRun.app"
        : "Your Data Export — CycleRun.app",
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0c0a09; color: #d6d3d1; padding: 32px;">
          <div style="max-width: 600px; margin: 0 auto;">
            <h1 style="color: #fafaf9; font-size: 24px;">${isDE ? "Deine Datenauskunft" : "Your Data Export"}</h1>
            <p style="line-height: 1.6;">${isDE
              ? "Gemäß DSGVO Art. 15 (Auskunftsrecht) findest du anbei alle bei CycleRun gespeicherten Daten zu deinem Account."
              : "In accordance with GDPR Art. 15 (Right of Access), please find attached all data stored by CycleRun for your account."
            }</p>
            <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 16px; margin: 24px 0;">
              <p style="margin: 0; font-size: 14px; color: #a8a29e;">${isDE ? "Exportiert am" : "Exported on"}: ${new Date().toLocaleString(isDE ? "de-DE" : "en-US")}</p>
              <p style="margin: 8px 0 0; font-size: 14px; color: #a8a29e;">${isDE ? "Datensätze" : "Records"}: ${dataExport.sessions.length} ${isDE ? "Fahrten" : "rides"}, ${dataExport.badges.length} Badges</p>
            </div>
            <p style="line-height: 1.6;">${isDE
              ? "Die Datei im Anhang (JSON-Format) enthält alle deine persönlichen Daten, Trainingshistorie, Badges und weitere Informationen."
              : "The attached file (JSON format) contains all your personal data, training history, badges, and other information."
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
      attachments: [
        {
          filename: `cyclerun-data-export-${new Date().toISOString().split("T")[0]}.json`,
          content: Buffer.from(jsonContent).toString("base64"),
        },
      ],
    });

    return NextResponse.json({ status: "sent" });
  } catch (err) {
    console.error("Data export error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
