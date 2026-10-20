// Tennis Ticket Intelligence — shared types for the quiz + scoring engine.
// Self-contained from F1 Ticket Intelligence (app/ticket-intelligence/[slug]) —
// no shared runtime imports. Pilot event: Australian Open 2027. See Stage 1/2
// spec (19-20 Oct 2026) for the frozen 43-option model and scoring contract.

export type ArenaCode = "RLA" | "MCA" | "JCA" | "GP";
export type StageCode = "Early" | "Middle" | "Late";
export type SessionCode = "Day" | "Night" | null;

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
