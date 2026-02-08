import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * POST /api/routes/unlock
 * Body: { email, route_slug, cost }
 *
 * Spend credits to unlock a premium route.
 */

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function POST(req: NextRequest) {
  try {
    const { email, route_slug, cost } = await req.json();

    if (!email || !route_slug || !cost || cost < 0) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const supabase = getSupabase();

    // Get user
    const { data: user } = await supabase
      .from("registrations")
      .select("id, credits")
      .eq("email", email)
      .single();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if already unlocked
    const { data: existing } = await supabase
      .from("route_unlocks")
      .select("id")
      .eq("user_id", user.id)
      .eq("route_slug", route_slug)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ status: "already_unlocked" });
    }

    // Check credits
    if (user.credits < cost) {
      return NextResponse.json({ error: "Insufficient credits", credits: user.credits, cost }, { status: 402 });
    }

    // Deduct credits + record unlock
    const { error: deductError } = await supabase
      .from("registrations")
      .update({ credits: user.credits - cost })
      .eq("id", user.id);

    if (deductError) {
      return NextResponse.json({ error: "Failed to deduct credits" }, { status: 500 });
    }

    await supabase.from("route_unlocks").insert({
      user_id: user.id,
      route_slug,
      credits_spent: cost,
    });

    return NextResponse.json({
      status: "unlocked",
      credits_remaining: user.credits - cost,
    });
  } catch (err) {
    console.error("Route unlock error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
