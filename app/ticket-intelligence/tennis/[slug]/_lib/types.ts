// Tennis Ticket Intelligence — shared types for the quiz + scoring engine.
// Self-contained from F1 Ticket Intelligence (app/ticket-intelligence/[slug]) —
// no shared runtime imports. Pilot event: Australian Open 2027. See Stage 1/2
// spec (19-20 Oct 2026) for the frozen 43-option model and scoring contract.

// PC/SL/SM/C14 added for French Open 2027 (Philippe-Chatrier, Suzanne-
// Lenglen, Simonne-Mathieu, Court 14) — additive, AO's RLA/MCA/JCA/GP
// untouched. CC/C1/C2/C3 added for Wimbledon 2027 (Centre Court, No.1
// Court, No.2 Court, No.3 Court) — additive, all prior values untouched.
// Matches the widened tennis_arena_code Postgres enum.
export type ArenaCode = "RLA" | "MCA" | "JCA" | "GP" | "PC" | "SL" | "SM" | "C14" | "CC" | "C1" | "C2" | "C3";
export type StageCode = "Early" | "Middle" | "Late";
export type SessionCode = "Day" | "Night" | null;

// Closed set of tournament slugs scoreTennisOptions.ts knows how to score
// — added 25 Oct 2026 as part of making tournament context a mandatory,
// explicit argument (never an optional/inferred one) to c4Compatibility's
// Q4-neutrality rule. A plain `string` can't express "exactly one of
// these three" at the type level (route params are always runtime
// strings), so this exists specifically so TypeScript rejects a typo'd
// or stale slug literal at every call site that passes one as a literal,
// while scoreTennisOptions.ts itself still runtime-validates any value
// actually received (including ones that arrive as plain strings from a
// URL route param) and throws on anything outside this set — belt AND
// suspenders, since a type can't stop a request's own query string.
export type TennisEventSlug = "australian-open" | "french-open" | "wimbledon";

// One row from tennis_ticket_intelligence_options.
export interface TicketOption {
  id: string;
  optionNumber: number;
  arenaCode: ArenaCode;
  arenaName: string;
  stageCode: StageCode;
  stageLabel: string;
  roundsLabel: string;
  sessionCode: SessionCode;
  sessionLabel: string;
  seatingCode: string;
  seatingLabel: string;
  costIndex: number;
  costStars: number;
  descriptionText: string;
  // Full public R2 URL of this option's approved illustrative hero image,
  // or null until one is wired in. Added 20 Oct 2026.
  heroImage: string | null;
  // Paired stand name (e.g. "Lacoste or Brugnon") — Philippe-Chatrier
  // French Open options only, null everywhere else. Added 22 Oct 2026.
  stand: string | null;
  // Per-option Q7 date-eligibility window (YYYY-MM-DD), both null or both
  // set. When present, scoreTennisOptions.ts uses these directly instead
  // of the stage-keyed STAGE_DATE_RANGE fallback. Added 22 Oct 2026 for
  // French Open, whose dates vary within one stageCode. Australian Open's
  // existing rows leave both null.
  eligibleFrom: string | null;
  eligibleTo: string | null;
  // Raw per-answer C1/C5 compatibility values — all 4 of a group present
  // or all null. When present, scoreTennisOptions.ts reads these directly
  // instead of its AO-only arena-keyed lookup tables. Added 22 Oct 2026
  // for French Open, whose approved workbook supplies these per-option.
  // Australian Open's existing rows leave all 8 null.
  c1LotsOfTennis: number | null;
  c1BigStadium: number | null;
  c1CloseUpCourts: number | null;
  c1BalancedExperience: number | null;
  c5CloseToAction: number | null;
  c5BalancedView: number | null;
  c5NoPreference: number | null;
  c5FlexibleExplore: number | null;
}

// ── Questionnaire answers ───────────────────────────────────────────────
// Approved final wording — see Stage 2 Authorization, 20 Oct 2026. Q2 has
// 3 answers (the original 4th, "open to any stage", was removed by founder
// decision to preserve exact compatibility with the 3-category engine).
export type Q1Priority = "lots_of_tennis" | "big_stadium" | "close_up_courts" | "balance";
export type Q2Stage = "early" | "middle" | "later";
export type Q3Viewing = "reserved" | "exploring" | "mix" | "no_preference";
export type Q4Session = "day" | "night" | "either";
export type Q5Seating = "close_to_action" | "clear_balanced_view" | "no_preference" | "flexible";
export type Q6Budget = "value_focused" | "balanced" | "premium";
export type Q7Flexibility = "fixed" | "adjustable" | "flexible_tournament";

export interface QuizAnswers {
  q1: Q1Priority;
  q2: Q2Stage;
  q3: Q3Viewing;
  q4: Q4Session;
  q5: Q5Seating;
  q6: Q6Budget;
  q7: Q7Flexibility;
  // Required for q7 = "fixed" | "adjustable"; optional (and ignored, per
  // Stage 2 Authorization §2) for q7 = "flexible_tournament".
  fromDate: string | null;
  toDate: string | null;
}

export interface ScoredOption {
  option: TicketOption;
  rawScore: number;
  adjustedScore: number;
  // Per-question weighted contribution (C1-C5 * weight), kept for
  // explanation-engine evidence/traceability — see 09_RECOVERED_SELECTION_SPEC.
  contributions: { c1: number; c2: number; c3: number; c4: number; c5: number };
}

export interface ScoreResult {
  hero: ScoredOption;
  alternative1: ScoredOption | null;
  alternative2: ScoredOption | null;
  excludedCount: number;
}
