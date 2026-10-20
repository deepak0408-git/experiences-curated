import type { QuizAnswers, ScoredOption, ScoreResult, TicketOption } from "./types";

// Tennis Ticket Intelligence scoring — FROZEN numerical model, Stage 1/2 spec
// (19-20 Oct 2026). Pure function, no DB/network access, re-run identically
// on the quiz-reveal page and the post-payment result page (same pattern as
// F1 Ticket Intelligence's scoreSeats.ts, which this is deliberately NOT a
// shared import from — see F1 isolation requirement).
//
// Every numeric value below is copied verbatim from 02_scoring_contract.json
// (the supplied frozen scoring contract). Do not recalibrate, round
// intermediate values, or add new scoring categories without an explicit,
// separately-approved change to that contract.

const WEIGHTS = { C1: 27, C2: 17, C3: 17, C4: 12, C5: 27 };

const Q1_ANSWER_INDEX: Record<QuizAnswers["q1"], number> = {
  lots_of_tennis: 0,
  big_stadium: 1,
  close_up_courts: 2,
  balance: 3,
};

// compatibility_by_arena[arena][answerIndex] — RLA/MCA/JCA only (reserved
// arenas). Ground Pass uses ground_pass_by_stage instead (below).
const Q1_ARENA_COMPATIBILITY: Record<"RLA" | "MCA" | "JCA", number[]> = {
  RLA: [0.65, 1, 0.2, 0.9],
  MCA: [0.6, 0.95, 0.754, 1],
  JCA: [0.65, 0.7, 0.75, 0.95],
};

// ground_pass_by_stage[stage][answerIndex].
const Q1_GROUND_PASS_BY_STAGE: Record<"Early" | "Middle" | "Late", number[]> = {
  Early: [0.75, 0.3, 0.75, 0.8],
  Middle: [0.7, 0.3, 0.7, 0.8],
  Late: [0.6, 0.4, 0.6, 0.7],
};

function c1Compatibility(option: TicketOption, q1: QuizAnswers["q1"]): number {
  const idx = Q1_ANSWER_INDEX[q1];
  if (option.arenaCode === "GP") {
    return Q1_GROUND_PASS_BY_STAGE[option.stageCode][idx];
  }
  return Q1_ARENA_COMPATIBILITY[option.arenaCode][idx];
}

// Q2 — "exact 1; adjacent .45; Early vs Later .10". Stage order: Early(0),
// Middle(1), Late(2). Q2 answer "later" maps to the engine's "Late" stage
// value — note the questionnaire label is "Later" (per approved Q2 answer
// 3, "High-stakes semifinals and finals") while the engine/options data use
// the stage code "Late"; same concept, different spelling, not a scoring
// difference.
const Q2_ANSWER_TO_STAGE_INDEX: Record<QuizAnswers["q2"], number> = {
  early: 0,
  middle: 1,
  later: 2,
};
const STAGE_CODE_TO_INDEX: Record<TicketOption["stageCode"], number> = {
  Early: 0,
  Middle: 1,
  Late: 2,
};

function c2Compatibility(option: TicketOption, q2: QuizAnswers["q2"]): number {
  const answerIdx = Q2_ANSWER_TO_STAGE_INDEX[q2];
  const optionIdx = STAGE_CODE_TO_INDEX[option.stageCode];
  const distance = Math.abs(answerIdx - optionIdx);
  if (distance === 0) return 1;
  if (distance === 1) return 0.45;
  return 0.1; // distance === 2 (Early vs Later)
}

// Q3 — reserved_arena_compatibility (same for all 4 answers = 1, i.e. Q3
// never penalizes a reserved-arena option) vs ground_pass_compatibility
// (index: reserved=null/ineligible, exploring=1, mix=0.65, no_preference=1).
const Q3_ANSWER_INDEX: Record<QuizAnswers["q3"], number> = {
  reserved: 0,
  exploring: 1,
  mix: 2,
  no_preference: 3,
};
const Q3_GROUND_PASS_COMPATIBILITY: (number | null)[] = [null, 1, 0.65, 1];

function c3Compatibility(option: TicketOption, q3: QuizAnswers["q3"]): number | null {
  const idx = Q3_ANSWER_INDEX[q3];
  if (option.arenaCode === "GP") {
    return Q3_GROUND_PASS_COMPATIBILITY[idx]; // null === hard-ineligible
  }
  return 1; // reserved_arena_compatibility is [1,1,1,1]
}

// Q4 — compatibility[answer][optionSessionBucket]. optionSessionBucket is
// "day" | "night" | "ground_pass" (Ground Pass has sessionCode = null).
const Q4_COMPATIBILITY: Record<QuizAnswers["q4"], { day: number; night: number; ground_pass: number }> = {
  day: { day: 1, night: 0.1, ground_pass: 1 },
  night: { day: 0.1, night: 1, ground_pass: 0.35 },
  either: { day: 1, night: 1, ground_pass: 1 },
};

function c4Compatibility(option: TicketOption, q4: QuizAnswers["q4"]): number {
  const bucket = option.arenaCode === "GP" ? "ground_pass" : option.sessionCode === "Day" ? "day" : "night";
  return Q4_COMPATIBILITY[q4][bucket];
}

// Q5 — compatibility_by_zone[zoneKey][answerIndex]. Zone key is
// `${arenaCode}_${seatingCode}` except Ground Pass (GP_GP) and MCA, whose
// "U" seating code maps to zone key "MCA_U" per the frozen contract.
// Answer 3 ("no_preference", approved Q5 answer "I don't have a strong
// preference...") is the frozen model's "Comfort" column — neutral 0.5
// across every zone. Per Stage 2 Authorization: never present this as a
// physical-comfort/hospitality claim; it is a neutral seating-location
// signal only.
const Q5_ANSWER_INDEX: Record<QuizAnswers["q5"], number> = {
  close_to_action: 0,
  clear_balanced_view: 1,
  no_preference: 2, // "Comfort" column in the frozen contract — neutral 0.5 for all zones
  flexible: 3,
};
const Q5_ZONE_COMPATIBILITY: Record<string, number[]> = {
  RLA_UB: [0.35, 0.9, 0.5, 0.65],
  RLA_LB: [0.95, 0.95, 0.5, 0.65],
  RLA_US: [0.45, 0.8, 0.5, 0.65],
  RLA_LS: [0.95, 0.85, 0.5, 0.65],
  MCA_U: [0.45, 0.8, 0.5, 0.65],
  MCA_LS: [0.95, 0.85, 0.5, 0.65],
  MCA_LB: [0.95, 0.95, 0.5, 0.65],
  JCA_RS: [0.9, 0.9, 0.5, 0.65],
  GP_GP: [0.8, 0.65, 0.5, 1],
};

function c5Compatibility(option: TicketOption, q5: QuizAnswers["q5"]): number {
  const zoneKey = option.arenaCode === "GP" ? "GP_GP" : `${option.arenaCode}_${option.seatingCode}`;
  const row = Q5_ZONE_COMPATIBILITY[zoneKey];
  return row[Q5_ANSWER_INDEX[q5]];
}

// Q6 — cost-sensitivity alpha exponent. Lower alpha = less cost-averse
// (Premium), higher alpha = more cost-averse (Value-focused).
const Q6_ALPHA: Record<QuizAnswers["q6"], number> = {
  value_focused: 0.2,
  balanced: 0.1,
  premium: 0.05,
};

// Q7 — date eligibility. Per Stage 2 Authorization:
//  - fixed: exact From/To window, no widening.
//  - adjustable: From/To +/- 2 days, constrained to the tournament schedule.
//  - flexible_tournament: no Q7 eligibility exclusions at all, whether or
//    not From/To dates are supplied (explicitly confirmed — dates are
//    optional and must never restrict eligibility under this answer).
// stage_dates_provisional below is the frozen contract's own provisional
// 2027 window per stage — used only to translate a stage into a date range
// for the fixed/adjustable eligibility check; it is NOT published match
// scheduling and must never be shown to a fan as a scheduling guarantee.
const STAGE_DATE_RANGE: Record<TicketOption["stageCode"], { start: string; end: string }> = {
  Early: { start: "2027-01-17", end: "2027-01-23" },
  Middle: { start: "2027-01-24", end: "2027-01-27" },
  Late: { start: "2027-01-28", end: "2027-01-31" },
};
const TOURNAMENT_START = "2027-01-17";
const TOURNAMENT_END = "2027-01-31";

function addDays(iso: string, days: number): string {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function rangesOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  return aStart <= bEnd && bStart <= aEnd;
}

function passesQ7Eligibility(option: TicketOption, answers: QuizAnswers): boolean {
  if (answers.q7 === "flexible_tournament") return true; // no exclusions, ever

  if (!answers.fromDate || !answers.toDate) {
    // fixed/adjustable require a date range per Stage 2 Authorization —
    // this function assumes the caller (quiz UI) already enforces that;
    // fail closed (exclude) rather than guess if it's somehow missing.
    return false;
  }

  const optionRange = STAGE_DATE_RANGE[option.stageCode];
  let windowStart = answers.fromDate;
  let windowEnd = answers.toDate;

  if (answers.q7 === "adjustable") {
    windowStart = addDays(answers.fromDate, -2);
    windowEnd = addDays(answers.toDate, 2);
    // "constrained to the tournament schedule"
    if (windowStart < TOURNAMENT_START) windowStart = TOURNAMENT_START;
    if (windowEnd > TOURNAMENT_END) windowEnd = TOURNAMENT_END;
  }

  return rangesOverlap(windowStart, windowEnd, optionRange.start, optionRange.end);
}

function passesHardFilters(option: TicketOption, answers: QuizAnswers): boolean {
  // Ground Pass ineligible if Reserved (Q3 rule).
  if (option.arenaCode === "GP" && answers.q3 === "reserved") return false;
  if (!passesQ7Eligibility(option, answers)) return false;
  return true;
}

// Diagnostic variant of passesHardFilters, exposing ALL applicable
// exclusion reasons (not just a boolean / first-match). Used by the
// regression harness for per-option eligibility reporting — never called
// by scoreTennisOptions itself, so it cannot affect scoring/ranking
// behavior. An option can fail zero, one, or both checks independently.
export function getEligibilityDiagnostics(
  option: TicketOption,
  answers: QuizAnswers
): { eligible: boolean; reasons: string[] } {
  const reasons: string[] = [];
  if (option.arenaCode === "GP" && answers.q3 === "reserved") {
    reasons.push("ground_pass_reserved_conflict");
  }
  if (!passesQ7Eligibility(option, answers)) {
    reasons.push("q7_date_ineligible");
  }
  return { eligible: reasons.length === 0, reasons };
}

function scoreOption(option: TicketOption, answers: QuizAnswers): ScoredOption {
  const c1 = c1Compatibility(option, answers.q1);
  const c2 = c2Compatibility(option, answers.q2);
  const c3raw = c3Compatibility(option, answers.q3);
  const c3 = c3raw ?? 0; // hard filter already excludes null-c3 (GP + reserved) upstream
  const c4 = c4Compatibility(option, answers.q4);
  const c5 = c5Compatibility(option, answers.q5);

  const rawScore =
    WEIGHTS.C1 * c1 + WEIGHTS.C2 * c2 + WEIGHTS.C3 * c3 + WEIGHTS.C4 * c4 + WEIGHTS.C5 * c5;

  const alpha = Q6_ALPHA[answers.q6];
  const adjustedScore = rawScore / Math.pow(option.costIndex / 100, alpha);

  return {
    option,
    rawScore,
    adjustedScore,
    contributions: {
      c1: WEIGHTS.C1 * c1,
      c2: WEIGHTS.C2 * c2,
      c3: WEIGHTS.C3 * c3,
      c4: WEIGHTS.C4 * c4,
      c5: WEIGHTS.C5 * c5,
    },
  };
}

// Exported for the portable regression harness (ChatGPT's independent
// 31,104-profile run) as well as the app's own quiz/result pages.
export function scoreTennisOptions(options: TicketOption[], answers: QuizAnswers): ScoreResult {
  const eligible = options.filter((o) => passesHardFilters(o, answers));
  const excludedCount = options.length - eligible.length;

  const scored = eligible
    .map((o) => scoreOption(o, answers))
    .sort((a, b) => {
      if (b.adjustedScore !== a.adjustedScore) return b.adjustedScore - a.adjustedScore;
      return a.option.optionNumber - b.option.optionNumber; // stable ascending-ID tie-break
    });

  return {
    hero: scored[0],
    alternative1: scored[1] ?? null,
    alternative2: scored[2] ?? null,
    excludedCount,
  };
}
