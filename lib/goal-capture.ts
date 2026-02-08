/**
 * CycleRun.app — Progressive Goal Capture System
 *
 * Algorithm:
 * Phase 0: Registration (existing) — zero questions
 * Phase 1: After 1st ride — "Why do you ride?" (1 emoji tap)
 * Phase 2: After 3rd ride — "How often?" (1 tap)
 * Phase 3: After 5th ride — specific target based on goal (1 tap)
 * Phase 4: Ongoing — post-ride mood (optional emoji, non-blocking)
 *
 * Rules:
 * - Max 1 prompt per ride
 * - If dismissed 3x in a phase, skip that phase forever
 * - Prompts appear AFTER gamification summary (positive context)
 * - Each prompt is a single tap — zero typing
 */

import { getSupabase } from "./supabase";

export type PrimaryGoal = "weight_loss" | "fitness" | "challenge" | "stress_relief";
export type FrequencyTarget = "daily" | "3_5x_week" | "weekends" | "flexible";
export type FeedbackType = "mood" | "energy" | "difficulty";

export interface GoalState {
  userId: string;
  capturePhase: number;
  primaryGoal: PrimaryGoal | null;
  frequencyTarget: FrequencyTarget | null;
  specificTarget: number | null;
  specificTargetUnit: string | null;
  promptsDismissed: number;
  lastPromptAt: string | null;
}

export interface GoalPrompt {
  type: "primary_goal" | "frequency" | "specific_target" | "mood";
  options: { value: string; emoji: string; labelKey: string }[];
}

// ── Determine what to ask ──

export function getNextPrompt(
  goalState: GoalState | null,
  totalSessions: number
): GoalPrompt | null {
  // No goal record yet + at least 1 ride → ask primary goal
  if (!goalState || goalState.capturePhase === 0) {
    if (totalSessions >= 1) {
      return {
        type: "primary_goal",
        options: [
          { value: "weight_loss", emoji: "🏋️", labelKey: "goal.opt.weight_loss" },
          { value: "fitness", emoji: "💪", labelKey: "goal.opt.fitness" },
          { value: "challenge", emoji: "🎯", labelKey: "goal.opt.challenge" },
          { value: "stress_relief", emoji: "😌", labelKey: "goal.opt.stress_relief" },
        ],
      };
    }
    return null;
  }

  // Dismissed too many times in current phase → skip
  if (goalState.promptsDismissed >= 3) return null;

  // Phase 1 done, need phase 2 (frequency) after 3+ rides
  if (goalState.capturePhase === 1 && totalSessions >= 3 && !goalState.frequencyTarget) {
    return {
      type: "frequency",
      options: [
        { value: "daily", emoji: "🔥", labelKey: "goal.opt.daily" },
        { value: "3_5x_week", emoji: "📅", labelKey: "goal.opt.3_5x" },
        { value: "weekends", emoji: "🌅", labelKey: "goal.opt.weekends" },
        { value: "flexible", emoji: "🌊", labelKey: "goal.opt.flexible" },
      ],
    };
  }

  // Phase 2 done, need phase 3 (specific target) after 5+ rides
  if (goalState.capturePhase === 2 && totalSessions >= 5 && goalState.specificTarget === null) {
    return getSpecificTargetPrompt(goalState.primaryGoal);
  }

  // Phase 3+ → mood feedback (but only every other ride, non-blocking)
  if (goalState.capturePhase >= 3 && totalSessions >= 3) {
    // Show mood prompt max every 2nd ride
    if (goalState.lastPromptAt) {
      const hoursSince = (Date.now() - new Date(goalState.lastPromptAt).getTime()) / (1000 * 60 * 60);
      if (hoursSince < 12) return null;
    }
    return {
      type: "mood",
      options: [
        { value: "1", emoji: "😫", labelKey: "goal.mood.1" },
        { value: "2", emoji: "😐", labelKey: "goal.mood.2" },
        { value: "3", emoji: "😊", labelKey: "goal.mood.3" },
        { value: "4", emoji: "😄", labelKey: "goal.mood.4" },
        { value: "5", emoji: "🤩", labelKey: "goal.mood.5" },
      ],
    };
  }

  return null;
}

function getSpecificTargetPrompt(goal: PrimaryGoal | null): GoalPrompt | null {
  switch (goal) {
    case "weight_loss":
      return {
        type: "specific_target",
        options: [
          { value: "3", emoji: "🎯", labelKey: "goal.target.3kg" },
          { value: "5", emoji: "💪", labelKey: "goal.target.5kg" },
          { value: "10", emoji: "🔥", labelKey: "goal.target.10kg" },
          { value: "15", emoji: "🚀", labelKey: "goal.target.15kg" },
        ],
      };
    case "fitness":
      return {
        type: "specific_target",
        options: [
          { value: "60", emoji: "🎯", labelKey: "goal.target.60min" },
          { value: "120", emoji: "💪", labelKey: "goal.target.120min" },
          { value: "180", emoji: "🔥", labelKey: "goal.target.180min" },
          { value: "300", emoji: "🚀", labelKey: "goal.target.300min" },
        ],
      };
    case "challenge":
      return {
        type: "specific_target",
        options: [
          { value: "50", emoji: "🎯", labelKey: "goal.target.50km" },
          { value: "100", emoji: "💪", labelKey: "goal.target.100km" },
          { value: "200", emoji: "🔥", labelKey: "goal.target.200km" },
          { value: "500", emoji: "🚀", labelKey: "goal.target.500km" },
        ],
      };
    case "stress_relief":
      return {
        type: "specific_target",
        options: [
          { value: "3", emoji: "🎯", labelKey: "goal.target.3x" },
          { value: "5", emoji: "💪", labelKey: "goal.target.5x" },
          { value: "7", emoji: "🔥", labelKey: "goal.target.7x" },
        ],
      };
    default:
      return null;
  }
}

// ── Save responses ──

export async function saveGoalResponse(
  userId: string,
  promptType: GoalPrompt["type"],
  value: string
): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;

  const now = new Date().toISOString();

  if (promptType === "primary_goal") {
    await sb.from("user_goals").upsert({
      user_id: userId,
      primary_goal: value,
      primary_goal_set_at: now,
      capture_phase: 1,
      last_prompt_at: now,
      prompts_dismissed: 0,
    }, { onConflict: "user_id" });
  } else if (promptType === "frequency") {
    await sb.from("user_goals").update({
      frequency_target: value,
      frequency_target_set_at: now,
      capture_phase: 2,
      last_prompt_at: now,
      prompts_dismissed: 0,
    }).eq("user_id", userId);
  } else if (promptType === "specific_target") {
    const unitMap: Record<string, string> = {
      weight_loss: "kg",
      fitness: "min/week",
      challenge: "km/month",
      stress_relief: "sessions/week",
    };

    // Get current goal to determine unit
    const { data } = await sb.from("user_goals")
      .select("primary_goal")
      .eq("user_id", userId)
      .single();

    await sb.from("user_goals").update({
      specific_target: parseFloat(value),
      specific_target_unit: unitMap[data?.primary_goal || "fitness"] || "units",
      specific_target_set_at: now,
      capture_phase: 3,
      last_prompt_at: now,
      prompts_dismissed: 0,
    }).eq("user_id", userId);
  } else if (promptType === "mood") {
    // Mood feedback → separate table, update last_prompt_at
    await sb.from("user_feedback").insert({
      user_id: userId,
      feedback_type: "mood",
      value: parseInt(value, 10),
    });
    await sb.from("user_goals").update({
      last_prompt_at: now,
    }).eq("user_id", userId);
  }
}

export async function dismissGoalPrompt(userId: string): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;

  const now = new Date().toISOString();

  // Ensure record exists
  await sb.from("user_goals").upsert({
    user_id: userId,
    last_prompt_at: now,
    prompts_dismissed: 0,
    capture_phase: 0,
  }, { onConflict: "user_id", ignoreDuplicates: true });

  // Increment dismiss counter
  const { data } = await sb.from("user_goals")
    .select("prompts_dismissed")
    .eq("user_id", userId)
    .single();

  await sb.from("user_goals").update({
    prompts_dismissed: (data?.prompts_dismissed || 0) + 1,
    last_prompt_at: now,
  }).eq("user_id", userId);
}

export async function fetchGoalState(userId: string): Promise<GoalState | null> {
  const sb = getSupabase();
  if (!sb) return null;

  const { data } = await sb.from("user_goals")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (!data) return null;

  return {
    userId,
    capturePhase: data.capture_phase || 0,
    primaryGoal: data.primary_goal,
    frequencyTarget: data.frequency_target,
    specificTarget: data.specific_target,
    specificTargetUnit: data.specific_target_unit,
    promptsDismissed: data.prompts_dismissed || 0,
    lastPromptAt: data.last_prompt_at,
  };
}

// ── Goal progress calculation ──

export interface GoalProgress {
  goalLabel: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  percentage: number;
}

export function calculateGoalProgress(
  goalState: GoalState,
  stats: { totalDistanceKm: number; totalSessions: number; totalDurationSeconds: number; currentStreak: number },
  locale: string
): GoalProgress | null {
  if (!goalState.specificTarget || !goalState.primaryGoal) return null;
  const isDE = locale === "de";

  switch (goalState.primaryGoal) {
    case "weight_loss":
      // Approximate: 300 kcal/30min cycling, 7700 kcal = 1kg fat
      // Rough: total_duration_seconds / 1800 * 300 / 7700
      const estimatedKgLost = (stats.totalDurationSeconds / 1800) * 300 / 7700;
      return {
        goalLabel: isDE ? "Gewichtsziel" : "Weight Goal",
        targetValue: goalState.specificTarget,
        currentValue: Math.round(estimatedKgLost * 10) / 10,
        unit: "kg",
        percentage: Math.min(100, (estimatedKgLost / goalState.specificTarget) * 100),
      };
    case "fitness":
      // Weekly minutes target — use last 7 days average extrapolated
      const weeklyMinutes = (stats.totalDurationSeconds / 60) / Math.max(1, Math.ceil(stats.totalSessions / 7));
      return {
        goalLabel: isDE ? "Wochenziel" : "Weekly Goal",
        targetValue: goalState.specificTarget,
        currentValue: Math.round(weeklyMinutes),
        unit: isDE ? "Min./Woche" : "min/week",
        percentage: Math.min(100, (weeklyMinutes / goalState.specificTarget) * 100),
      };
    case "challenge":
      // Monthly km target
      return {
        goalLabel: isDE ? "Monatsziel" : "Monthly Goal",
        targetValue: goalState.specificTarget,
        currentValue: Math.round(stats.totalDistanceKm * 10) / 10,
        unit: "km",
        percentage: Math.min(100, (stats.totalDistanceKm / goalState.specificTarget) * 100),
      };
    case "stress_relief":
      // Sessions per week
      return {
        goalLabel: isDE ? "Wochenziel" : "Weekly Goal",
        targetValue: goalState.specificTarget,
        currentValue: stats.currentStreak > 0 ? Math.min(stats.currentStreak, 7) : 0,
        unit: isDE ? "Sessions/Woche" : "sessions/week",
        percentage: Math.min(100, (Math.min(stats.currentStreak, 7) / goalState.specificTarget) * 100),
      };
    default:
      return null;
  }
}
