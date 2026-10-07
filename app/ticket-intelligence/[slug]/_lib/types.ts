// Ticket Intelligence — shared types for the quiz + scoring engine.
// Built 25 Sep 2026, pilot event: Brazilian GP / Interlagos. See
// project_seven_revenue_models_review memory for the strategic origin
// ("sell the ticket decision, not the trip guide") and
// scripts/seed-brazilian-gp-circuit-seating.mjs for the seat data itself.

export type SeatType = "grandstand" | "festival_lawn" | "hospitality";

export type ActionTag =
  | "overtaking"
  | "start_grid"
  | "high_speed"
  | "technical_corner"
  | "pit_lane"
  | "podium_atmosphere";

// One row from circuit_seating_profile, joined with its
// planner_ticket_tier_cost price band (nullable — see the tier4 ordinal-
// only seats, e.g. Grand Prix Club, seeded without a display price).
export interface Seat {
  id: string;
  seatName: string;
  seatType: SeatType;
  zoneLabel: string;
  actionTags: ActionTag[];
  covered: boolean | null;
  minAge: number | null;
  singleDayAvailable: boolean | null;
  reservedSeating: boolean | null;
  tier: "tier1" | "tier2" | "tier3" | "tier4" | null;
  costLow: number | null;
  costHigh: number | null;
  // This seat's own dedicated experience write-up slug, when one exists
  // (e.g. "Main Grandstand", "Paddock Club" — most seats won't have one).
  // Falls back to the event's general "Ticket Guide" experience slug
  // (fallbackExperienceSlug on ScoreResult) when null, and no link at all
  // when neither exists. Added 27 Sep 2026.
  linkedExperienceSlug: string | null;
  // The linked experience's own hero image — only ever populated alongside
  // a real linkedExperienceSlug (never for the fallbackExperienceSlug path).
  // Used by FullResult's SeatCard to show a thumbnail of the actual stand;
  // never shown for hospitality seats or in TeaserResult regardless of this
  // being set. Added 7 Oct 2026.
  linkedExperienceImageUrl: string | null;
}

// ── Rubric answers ──────────────────────────────────────────────────────
// A "which days are you attending" question (formerly Q6) was tried and
// removed 26 Sep 2026 — founder judgment: single-day vs multi-day
// availability is almost always uniform ACROSS an entire event's seats
// (either the whole circuit sells single-day tickets or it doesn't), so it
// was never a real seat-DIFFERENTIATING signal the way every other
// question is. Confirmed live on US GP: every one of the 9 seeded seats
// had singleDayAvailable=true, so the question showed (isQ6Relevant
// correctly detected COTA sells single-day tickets) but changed nothing
// about the result — a dead-weight question that looked like it mattered
// but didn't. seat.singleDayAvailable is kept as real per-seat data (still
// useful, e.g. for a future "single-day ticket available" badge) — only
// the scored rubric question itself was removed, not the underlying field.

export type Q1TrackAction = "overtaking" | "start_grid" | "high_speed_or_technical" | "atmosphere";
export type Q2SeatStyle = "fixed" | "flexible";
export type Q3Weather = "essential" | "preferred" | "dont_care";
export type Q4Group = "solo_friends" | "family" | "accessibility";
export type Q5OffTrack = "fan_zones" | "lounge" | "concerts";
export type Q7Budget = "maximize" | "balanced" | "economy";

export interface QuizAnswers {
  q1: Q1TrackAction;
  q2: Q2SeatStyle;
  q3: Q3Weather;
  q4: Q4Group;
  q5: Q5OffTrack;
  q7: Q7Budget;
}

export interface ScoredSeat {
  seat: Seat;
  score: number;
  reasons: string[]; // human-readable "why this fits" fragments
}

export interface ScoreResult {
  top: ScoredSeat;
  runnerUp: ScoredSeat | null;
  thirdPlace: ScoredSeat | null; // added 27 Sep 2026 — same SeatCard treatment as runnerUp
  excludedCount: number; // seats filtered out by hard constraints (e.g. 18+)
}
