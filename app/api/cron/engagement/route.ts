import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import { BRAND } from "@/lib/email-templates";
import {
  welcomeDay1,
  welcomeDay3,
  welcomeDay7,
  retentionDay3,
  retentionDay7,
  retentionDay14,
  retentionDay30,
  weightLossGuide1,
  weightLossGuide2,
  weightLossGuide3,
  weightLossGuide4,
  weightLossGuide5,
  type EmailTemplate,
} from "@/lib/email-engagement";

/**
 * GET /api/cron/engagement
 *
 * Daily engagement cron job — triggered by Vercel Cron or external scheduler.
 * Protected by CRON_SECRET header.
 *
 * Checks all registered users and sends behavior-based emails:
 * 1. Welcome drip (day 1, 3, 7 after registration)
 * 2. Retention win-back (3d, 7d, 14d, 30d inactive)
 * 3. Weight loss guide series (triggered after first ride, 1 per day)
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

async function hasBeenSent(supabase: ReturnType<typeof getSupabase>, userId: string, templateKey: string): Promise<boolean> {
  const { data } = await supabase
    .from("email_log")
    .select("id")
    .eq("user_id", userId)
    .eq("template_key", templateKey)
    .limit(1);
  return (data?.length ?? 0) > 0;
}

async function sendAndLog(
  supabase: ReturnType<typeof getSupabase>,
  resend: Resend,
  userId: string,
  email: string,
  template: EmailTemplate,
  metadata: Record<string, unknown> = {}
): Promise<boolean> {
  try {
    const { error: mailError } = await resend.emails.send({
      from: BRAND.from,
      to: email,
      subject: template.subject,
      html: template.html,
    });

    if (mailError) {
      console.error(`[engagement] Failed to send ${template.key} to ${email}:`, mailError);
      return false;
    }

    await supabase.from("email_log").insert({
      user_id: userId,
      email_address: email,
      template_key: template.key,
      subject: template.subject,
      metadata,
    });

    console.log(`[engagement] Sent ${template.key} to ${email}`);
    return true;
  } catch (err) {
    console.error(`[engagement] Error sending ${template.key}:`, err);
    return false;
  }
}

export async function GET(req: NextRequest) {
  // Auth check
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

  // Fetch all registered users with consent
  const { data: users, error: fetchError } = await supabase
    .from("registrations")
    .select("id, email, first_name, locale, created_at, total_sessions, total_distance_km, total_energy, current_streak, last_ride_date, consent_data_processing")
    .eq("consent_data_processing", true);

  if (fetchError || !users) {
    console.error("[engagement] Failed to fetch users:", fetchError);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }

  for (const user of users) {
    const locale = user.locale || "en";
    const name = user.first_name || "Rider";
    const regDate = new Date(user.created_at);
    const daysSinceReg = Math.floor((now.getTime() - regDate.getTime()) / (1000 * 60 * 60 * 24));
    const lastRide = user.last_ride_date ? new Date(user.last_ride_date) : null;
    const daysSinceRide = lastRide ? Math.floor((now.getTime() - lastRide.getTime()) / (1000 * 60 * 60 * 24)) : null;

    // Max 1 email per user per day
    const { data: todayLogs } = await supabase
      .from("email_log")
      .select("id")
      .eq("user_id", user.id)
      .gte("sent_at", new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString())
      .limit(1);

    if (todayLogs && todayLogs.length > 0) {
      skipped++;
      continue;
    }

    let didSend = false;

    // ── 1. WELCOME DRIP ──
    if (!didSend && daysSinceReg >= 1 && daysSinceReg <= 2) {
      if (!(await hasBeenSent(supabase, user.id, "welcome_day1"))) {
        const tpl = welcomeDay1(locale, name);
        didSend = await sendAndLog(supabase, resend, user.id, user.email, tpl);
        if (didSend) sent++;
        else errors++;
      }
    }

    if (!didSend && daysSinceReg >= 3 && daysSinceReg <= 4) {
      if (!(await hasBeenSent(supabase, user.id, "welcome_day3"))) {
        const tpl = welcomeDay3(locale, name);
        didSend = await sendAndLog(supabase, resend, user.id, user.email, tpl);
        if (didSend) sent++;
        else errors++;
      }
    }

    if (!didSend && daysSinceReg >= 7 && daysSinceReg <= 8) {
      if (!(await hasBeenSent(supabase, user.id, "welcome_day7"))) {
        const tpl = welcomeDay7(locale, name, {
          sessions: user.total_sessions || 0,
          distance: user.total_distance_km || 0,
          energy: user.total_energy || 0,
          streak: user.current_streak || 0,
        });
        didSend = await sendAndLog(supabase, resend, user.id, user.email, tpl);
        if (didSend) sent++;
        else errors++;
      }
    }

    // ── 2. WEIGHT LOSS GUIDE SERIES ──
    // Goal-aware: immediate for weight_loss goal users, after 3+ rides for others
    const { data: goalData } = await supabase
      .from("user_goals")
      .select("primary_goal")
      .eq("user_id", user.id)
      .maybeSingle();
    const userGoal = goalData?.primary_goal || null;
    const wlMinSessions = userGoal === "weight_loss" ? 1 : 3;
    if (!didSend && (user.total_sessions || 0) >= wlMinSessions && daysSinceReg >= 2) {
      const guideTemplates = [
        { key: "weight_loss_1", fn: () => weightLossGuide1(locale, name) },
        { key: "weight_loss_2", fn: () => weightLossGuide2(locale, name) },
        { key: "weight_loss_3", fn: () => weightLossGuide3(locale, name) },
        { key: "weight_loss_4", fn: () => weightLossGuide4(locale, name) },
        { key: "weight_loss_5", fn: () => weightLossGuide5(locale, name) },
      ];

      for (const guide of guideTemplates) {
        if (didSend) break;
        if (!(await hasBeenSent(supabase, user.id, guide.key))) {
          const tpl = guide.fn();
          didSend = await sendAndLog(supabase, resend, user.id, user.email, tpl);
          if (didSend) sent++;
          else errors++;
          break; // Only send 1 guide per day
        }
      }
    }

    // ── 3. RETENTION / WIN-BACK ──
    // Only for users who have ridden at least once
    if (!didSend && daysSinceRide !== null && (user.total_sessions || 0) >= 1) {
      if (daysSinceRide >= 3 && daysSinceRide <= 4) {
        if (!(await hasBeenSent(supabase, user.id, "retention_day3"))) {
          const tpl = retentionDay3(locale, name, user.current_streak || 0);
          didSend = await sendAndLog(supabase, resend, user.id, user.email, tpl);
          if (didSend) sent++;
          else errors++;
        }
      }

      if (!didSend && daysSinceRide >= 7 && daysSinceRide <= 8) {
        if (!(await hasBeenSent(supabase, user.id, "retention_day7"))) {
          const tpl = retentionDay7(locale, name);
          didSend = await sendAndLog(supabase, resend, user.id, user.email, tpl);
          if (didSend) sent++;
          else errors++;
        }
      }

      if (!didSend && daysSinceRide >= 14 && daysSinceRide <= 15) {
        if (!(await hasBeenSent(supabase, user.id, "retention_day14"))) {
          const tpl = retentionDay14(locale, name);
          didSend = await sendAndLog(supabase, resend, user.id, user.email, tpl);
          if (didSend) sent++;
          else errors++;
        }
      }

      if (!didSend && daysSinceRide >= 30 && daysSinceRide <= 31) {
        if (!(await hasBeenSent(supabase, user.id, "retention_day30"))) {
          const tpl = retentionDay30(locale, name);
          didSend = await sendAndLog(supabase, resend, user.id, user.email, tpl);
          if (didSend) sent++;
          else errors++;
        }
      }
    }

    if (!didSend) skipped++;
  }

  const summary = {
    totalUsers: users.length,
    sent,
    skipped,
    errors,
    timestamp: now.toISOString(),
  };

  console.log("[engagement] Cron complete:", summary);
  return NextResponse.json(summary);
}
