// Tennis Grand Slam Trip Intelligence — shared types for the independent
// 7-question matching engine. See Tennis Grand Slam Trip Intelligence
// Development Implementation Specification v1.0 and plan
// "concurrent-zooming-treehouse" (13 Oct 2026) for full build context.
// Independent from F1's Trip Intelligence engine (app/trip-intelligence/
// formula-1/_lib) per spec §2.4 — do not import from or export to it.

export type Q1Answer = "all_about_tennis" | "city" | "nearby" | "bigger_holiday";
export type Q2Answer = "heritage" | "modern" | "both" | "open";
export type Q3Answer = "showcourts" | "outside_courts" | "balanced";
export type Q4Answer = "high_energy" | "lively_grounds" | "calm" | "balanced";
export type Q5Answer = "city" | "regional" | "both" | "tennis_first";
export type Q6Answer = "flexible" | "reasonable" | "easy_access" | "top_priority";
export type Q7Answer = "top_priority" | "sensible_budget" | "some_flexibility" | "not_a_concern";

export interface TripIntelligenceTennisAnswers {
  q1_travel_motivation: Q1Answer;
  q2_tournament_identity: Q2Answer;
  q3_tennis_experience: Q3Answer;
  q4_atmosphere: Q4Answer;
  q5_beyond_tennis: Q5Answer;
  q6_convenience: Q6Answer;
  q7_affordability: Q7Answer;
}

// The 14 approved characteristics (spec §4) — IDs kept exactly as the spec
// names them (D0x, not F1's C0x) so the two engines' rating sets are never
// confused. No A/B split logic here (unlike F1) — these are flat columns,
// not jsonb-nested subdimensions.
export type CharacteristicKey =
  | "D01A" | "D01B"
  | "D03A" | "D03B" | "D03C"
  | "D04A"
  | "D05A" | "D05B"
  | "D06A" | "D06B"
  | "D07A" | "D07B"
  | "D08A" | "D08B";

export type CharacteristicComponents = Record<CharacteristicKey, number>;

export interface GrandSlamCandidate {
  sportingEventId: string;
  sourceSlug: "ao" | "rg" | "wim" | "uso";
  grandSlamName: string;
  components: CharacteristicComponents;
}

// Per-question effective (already activation-weighted) and normalized
// weights, keyed by the 6 scoring questions — Q1 is never a scoring key.
export type ScoringQuestionKey =
  | "q2_tournament_identity" | "q3_tennis_experience" | "q4_atmosphere"
  | "q5_beyond_tennis" | "q6_convenience" | "q7_affordability";

export type NormalizedWeights = Record<ScoringQuestionKey, number>;

// Per-candidate, per-question raw 0-100 score — needed by the explanation
// engine's contributionDelta computation (spec §7), kept alongside the
// final blended score rather than discarded after scoring.
export type QuestionScores = Record<ScoringQuestionKey, number>;

export interface CandidateScore {
  sportingEventId: string;
  sourceSlug: GrandSlamCandidate["sourceSlug"];
  grandSlamName: string;
  questionScores: QuestionScores;
  finalScore: number; // full floating-point precision, 0-100 scale
}

export interface TieGroup {
  rank: number; // 1 = first place, 2 = second place, etc. (group rank, not candidate count)
  candidates: CandidateScore[]; // 1-4 candidates tied at this rank
}

export interface MatchResponse {
  weights: NormalizedWeights;
  tieGroups: TieGroup[]; // ordered by rank; tieGroups[0] is always the leading group (1-4 co-leaders)
  engineVersion: string;
  rubricVersion: string;
}
