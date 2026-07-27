import type { TierOption } from "./getTradeoffOptions";

// RAG scoring — computed in real time from tier-step distance, never a
// static editorial field (confirmed 19 Jul 2026: "has to be inferred by
// the data since it will be real time. Not static."). Recalculates
// automatically if prices or tier structure change.
export type RagLevel = "green" | "amber" | "red";

export function ragForSteps(steps: number): RagLevel {
  if (steps <= 1) return "green";
  if (steps === 2) return "amber";
  return "red";
}

export type ScoredTierOption = TierOption & {
  rag: RagLevel;
  savingsLow: number;
  savingsHigh: number;
  // Value density, not a raw total — the explicit fix for the
  // "calculator, not advisor" risk: (saving / steps dropped), so a big
  // multi-tier cut doesn't automatically look "better" than a smaller,
  // more efficient single-step move.
  savingsPerStepLow: number;
  savingsPerStepHigh: number;
};

// Never excludes an option for being "too steep" (explicitly rejected
// 19 Jul 2026) — every real, named tier-drop is scored and returned. RAG
// color carries the honesty about how big a change it is; the user decides.
export function scoreTierOptions(current: TierOption | null, cheaperOptions: TierOption[]): ScoredTierOption[] {
  if (!current) return [];
  return cheaperOptions.map((option) => {
    const savingsLow = current.costLow - option.costHigh;
    const savingsHigh = current.costHigh - option.costLow;
    return {
      ...option,
      rag: ragForSteps(option.stepsFromCurrent),
      savingsLow,
      savingsHigh,
      savingsPerStepLow: savingsLow / option.stepsFromCurrent,
      savingsPerStepHigh: savingsHigh / option.stepsFromCurrent,
    };
  });
}
