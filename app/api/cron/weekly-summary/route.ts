import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import { BRAND } from "@/lib/email-templates";
import { weeklySummary } from "@/lib/email-engagement";

/**
 * GET /api/cron/weekly-summary
 *
 * Weekly summary cron — sends personalized weekly recap to active users.
 * Run every Sunday evening via Vercel Cron.
 * Protected by CRON_SECRET header.
 */

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

// Level thresholds matching gamification system
const LEVELS = [
  { name: "Beginner", threshold: 0 },
  { name: "Casual Rider", threshold: 500 },
  { name: "Regular", threshold: 2000 },
  { name: "Committed", threshold: 5000 },
  { name: "Dedicated", threshold: 12000 },
  { name: "Hardcore", threshold: 30000 },
  { name: "Elite", threshold: 75000 },
  { name: "Legend", threshold: 150000 },
];

function getLevelName(level: number): string {
  return LEVELS[Math.min(level, LEVELS.length - 1)]?.name || "Beginner";
}

export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get("authorization");
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabase();
  const resend = getResend();
  const now = new Date();
  let sent = 0;
  let skipped = 0;
  let errors = 0;

  // Get all users who had at least 1 session this week
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const { data: users, error: fetchError } = await supabase
    .from("registrations")
    .select("id, email, first_name, locale, total_energy, current_streak, level, consent_data_processing")
    .eq("consent_data_processing", true);

  if (fetchError || !users) {
    console.error("[weekly-summary] Failed to fetch users:", fetchError);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }

  for (const user of users) {
    // Get this week's sessions
    const { data: sessions } = await supabase
      .from("sessions")
      .select("distance_km, duration_seconds, energy_earned")
      .eq("user_id", user.id)
      .gte("created_at", weekAgo);

    if (!sessions || sessions.length === 0) {
      skipped++;
      continue;
    }

    // Aggregate weekly stats
    const weekStats = {
      sessions: sessions.length,
      distance: sessions.reduce((sum: number, s: { distance_km: number | null }) => sum + (s.distance_km || 0), 0),
      duration: sessions.reduce((sum: number, s: { duration_seconds: number | null }) => sum + (s.duration_seconds || 0), 0),
      energy: sessions.reduce((sum: number, s: { energy_earned: number | null }) => sum + (s.energy_earned || 0), 0),
    };

    // Get new badges earned this week
    const { data: newBadges } = await supabase
      .from("user_badges")
      .select("badges(icon, name_en, name_de)")
      .eq("user_id", user.id)
      .gte("earned_at", weekAgo);

    const locale = user.locale || "en";
    const isDE = locale === "de";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const badgeList = (newBadges || []).map((ub: any) => ({
      icon: ub.badges?.icon || "🏆",
      name: isDE ? (ub.badges?.name_de || "") : (ub.badges?.name_en || ""),
    }));

    // Get weekly rank
    const { data: rankData } = await supabase
      .from("leaderboard_weekly")
      .select("rank")
      .eq("user_id", user.id)
      .limit(1);
    const weekRank = rankData?.[0]?.rank || null;

    const template = weeklySummary(locale, user.first_name || "Rider", {
      sessions: weekStats.sessions,
      distance: weekStats.distance,
      duration: weekStats.duration,
      energy: weekStats.energy,
      streak: user.current_streak || 0,
      level: user.level || 0,
      levelName: getLevelName(user.level || 0),
      weekRank,
      newBadges: badgeList,
    });

    try {
      const { error: mailError } = await resend.emails.send({
        from: BRAND.from,
        to: user.email,
        subject: template.subject,
        html: template.html,
      });

      if (mailError) {
        console.error(`[weekly-summary] Failed to send to ${user.email}:`, mailError);
        errors++;
        continue;
      }

      // Log the sent email (weekly emails can repeat, unique index excludes weekly_*)
      await supabase.from("email_log").insert({
        user_id: user.id,
        email_address: user.email,
        template_key: template.key,
        subject: template.subject,
        metadata: { weekStats, weekRank },
      });

      sent++;
      console.log(`[weekly-summary] Sent to ${user.email}`);
    } catch (err) {
      console.error(`[weekly-summary] Error for ${user.email}:`, err);
      errors++;
    }
  }

  const summary = { totalUsers: users.length, sent, skipped, errors, timestamp: now.toISOString() };
  console.log("[weekly-summary] Cron complete:", summary);
  return NextResponse.json(summary);
}
