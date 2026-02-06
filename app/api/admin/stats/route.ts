import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * GET /api/admin/stats?key=...
 * Protected admin endpoint — requires ADMIN_SECRET env var
 */
export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  const adminSecret = process.env.ADMIN_SECRET;

  if (!adminSecret || key !== adminSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabase();

  // Parallel queries for all stats
  const [
    registrationsRes,
    sessionsRes,
    newsletterRes,
    waitlistRes,
    creatorsRes,
    recentRegistrationsRes,
    recentSessionsRes,
    topRidersRes,
  ] = await Promise.all([
    // Total registrations
    supabase.from("registrations").select("id, created_at, locale, newsletter_opt_in, total_sessions, total_distance_km", { count: "exact" }),
    // Total sessions
    supabase.from("sessions").select("id, created_at, distance_km, duration_seconds, avg_speed_kmh, sport_type", { count: "exact" }),
    // Newsletter subscribers
    supabase.from("newsletter_subscribers").select("id, confirmed, unsubscribed_at, created_at, confirmed_at"),
    // Waitlist
    supabase.from("waitlist").select("id, feature, created_at", { count: "exact" }),
    // Creators
    supabase.from("creators").select("id, is_verified, is_active, created_at", { count: "exact" }),
    // Recent registrations (last 7 days)
    supabase.from("registrations").select("id, first_name, email, created_at, locale").order("created_at", { ascending: false }).limit(20),
    // Recent sessions (last 7 days)
    supabase.from("sessions").select("id, distance_km, duration_seconds, avg_speed_kmh, created_at, sport_type").order("created_at", { ascending: false }).limit(20),
    // Top riders by distance
    supabase.from("registrations").select("id, first_name, display_name, email, total_distance_km, total_sessions, total_duration_seconds").order("total_distance_km", { ascending: false }).limit(10),
  ]);

  const registrations = registrationsRes.data || [];
  const sessions = sessionsRes.data || [];
  const newsletter = newsletterRes.data || [];
  const waitlist = waitlistRes.data || [];
  const creators = creatorsRes.data || [];

  // Compute aggregates
  const totalDistance = sessions.reduce((sum, s) => sum + (Number(s.distance_km) || 0), 0);
  const totalDuration = sessions.reduce((sum, s) => sum + (Number(s.duration_seconds) || 0), 0);
  const avgSpeed = sessions.length > 0
    ? sessions.reduce((sum, s) => sum + (Number(s.avg_speed_kmh) || 0), 0) / sessions.length
    : 0;

  const newsletterConfirmed = newsletter.filter(n => n.confirmed && !n.unsubscribed_at).length;
  const newsletterPending = newsletter.filter(n => !n.confirmed).length;
  const newsletterUnsubscribed = newsletter.filter(n => n.unsubscribed_at).length;

  // Registrations per day (last 14 days)
  const now = new Date();
  const dailyRegistrations: Record<string, number> = {};
  const dailySessions: Record<string, number> = {};
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    dailyRegistrations[key] = 0;
    dailySessions[key] = 0;
  }
  registrations.forEach(r => {
    const day = r.created_at?.slice(0, 10);
    if (day && dailyRegistrations[day] !== undefined) dailyRegistrations[day]++;
  });
  sessions.forEach(s => {
    const day = s.created_at?.slice(0, 10);
    if (day && dailySessions[day] !== undefined) dailySessions[day]++;
  });

  // Locale distribution
  const localeCount: Record<string, number> = {};
  registrations.forEach(r => {
    const loc = r.locale || "unknown";
    localeCount[loc] = (localeCount[loc] || 0) + 1;
  });

  return NextResponse.json({
    overview: {
      totalRegistrations: registrations.length,
      totalSessions: sessions.length,
      totalDistanceKm: Math.round(totalDistance * 10) / 10,
      totalDurationHours: Math.round(totalDuration / 3600 * 10) / 10,
      avgSpeedKmh: Math.round(avgSpeed * 10) / 10,
      newsletterConfirmed,
      newsletterPending,
      newsletterUnsubscribed,
      waitlistCount: waitlist.length,
      creatorsTotal: creators.length,
      creatorsVerified: creators.filter(c => c.is_verified).length,
    },
    charts: {
      dailyRegistrations,
      dailySessions,
      localeDistribution: localeCount,
    },
    recentRegistrations: recentRegistrationsRes.data || [],
    recentSessions: recentSessionsRes.data || [],
    topRiders: topRidersRes.data || [],
  });
}
