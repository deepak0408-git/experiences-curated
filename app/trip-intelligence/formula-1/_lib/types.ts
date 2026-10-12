// Trip Intelligence — shared types for the 7-question matching engine.
// See plan at C:\Users\HP\.claude\plans\go-ahead-in-plan-merry-bentley.md
// and memory project_trip_intelligence_build.md for full build context.
// Q3 (Atmosphere) removed 11 Oct 2026 — overlapped with other preferences
// and caused disproportionate recommendation swings; its budget was
// redistributed across the remaining 7 questions (see weights.ts QB).

export type Q1Answer = "racing_first" | "balanced" | "sports_holiday";
export type Q2Answer = "legendary" | "racing_circuit" | "street_spectacle" | "glamour_iconic" | "open";
export type Q4Answer = "city" | "food_nightlife" | "day_trips" | "more_f1";
export type Q5Answer = "views" | "viewpoints" | "facilities" | "open";
export type Q6Answer = "very" | "quite" | "flexible" | "adventure";
export type Q7Answer = "comfortable" | "any_weather";
export type Q8Answer = "major" | "quite" | "flexible" | "not_deciding";

export interface TripIntelligenceAnswers {
  q1_trip_purpose: Q1Answer;
  q2_gp_identity: Q2Answer;
  q4_off_track: Q4Answer;
  q5_spectator: Q5Answer;
  q6_convenience: Q6Answer;
  q7_weather: Q7Answer;
  q8_affordability: Q8Answer;
}

// The scoring keys the engine actually weighs: C02-C03 stay single
// aggregate values (no A/B split for these two), C01/C04-C09 each split into
// A/B subdimensions, C10 is the standalone affordability score. C01 itself
// (the weighted average of C01A/C01B) is kept as its own ScoringKey too —
// a computed, always-in-sync derived value, not a separately stored rating —
// so existing Q1/Q2.legendary/Q2.street_spectacle/Q4 mappings and all of
// matchReasons.ts keep reading a single "C01" exactly as before the
// recalibration patch (10 Oct 2026) introduced C01A/C01B for Q2.racing_circuit.
// Originally matched fixed_budget_candidate.py's K = list(base) with C01-C03
// flat; C01A/C01B added per matching-rubric.patch.json.
export type ScoringKey =
  | "C01" | "C01A" | "C01B" | "C02" | "C03"
  | "C04A" | "C04B"
  | "C05A" | "C05B"
  | "C06A" | "C06B"
  | "C07A" | "C07B"
  | "C08A" | "C08B"
  | "C09A" | "C09B"
  | "C10";

export type ScoringWeights = Record<ScoringKey, number>;
export type ScoringComponents = Record<ScoringKey, number>;

export interface GrandPrixCandidate {
  sportingEventId: string;
  sourceSlug: string;
  grandPrixName: string;
  components: ScoringComponents;
}

export interface MatchResult {
  sportingEventId: string;
  sourceSlug: string;
  grandPrixName: string;
  experienceFit: number;
  finalScore: number;
  shortlisted: boolean;
}

export interface MatchResponse {
  results: MatchResult[];
  hero: MatchResult;
  alternatives: MatchResult[];
  shortlistSize: number;
  usedMinimumThreeException: boolean;
  engineVersion: string;
}
