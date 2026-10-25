import type { QuizAnswers, ScoredOption } from "./types";
import type { Rationale } from "./recommendationRationale";
import catalogue from "./wimbledonExplanationCatalogue.json" with { type: "json" };

// Wimbledon 2027 — deterministic, lookup-only explanation selector. Built
// 25 Oct 2026 directly from the founder-approved
// Wimbledon_2027_50112_Frozen_Explanation_Lookup.csv (50,112 rows across
// 16,704 questionnaire profiles) — NOT a construction/paraphrase engine
// like Australian Open's recommendationRationale.ts, same architectural
// choice as French Open's frenchOpenExplanation.ts (frozenExplanation.ts's
// own header explains why: the catalogue is a precomputed, founder-
// ratified full answer-space grid, and every sentence here is copied
// verbatim — this module never generates, rephrases, or invents wording).
//
// Key shape (verified against the approved package's own
// validation/check_package.py and this app's build script,
// scripts/_build-wimbledon-explanation-catalogue.mjs): a single CSV row
// covers one (mode, day, q1, q2, q3, q5, q6, rank) tuple, where rank is
// 1/2/3 for hero/alternative1/alternative2 and `option_number` + a
// `score`-independent `fan_facing_text` are the per-rank payload — NOT a
// (hero, alt1, alt2) triple-ID key like French Open's catalogue. Q4 is
// excluded from the key because the source data verified every row's q4
// as the literal constant "neutral_all" (confirmed: a single distinct
// value across all 50,112 rows) — i.e. Wimbledon's approved model treats
// Q4 as non-discriminating for explanation text, same exclusion principle
// as French Open's Q7 exclusion, different question. day's exact meaning
// (a specific date string vs. an empty value) comes directly from the
// approved CSV's own `day` column and is passed through unchanged — this
// module does not interpret or derive it.
//
// Lookup is per-rank rather than per-triple: callers look up hero,
// alternative1, and alternative2 independently via their own rank (1/2/3),
// each validated against the actual scored option number at that rank so
// a scoring/catalogue mismatch is caught rather than silently mismatched.

interface CatalogueShape {
  uniqueKeyCount: number;
  strings: string[];
  // entries[key] = [optionNumber, score, textIdx]
  entries: Record<string, [number, number, number]>;
}
const CATALOGUE = catalogue as unknown as CatalogueShape;

function lookupKey(
  answers: QuizAnswers,
  mode: string,
  day: string,
  rank: 1 | 2 | 3
): string {
  return [mode, day, answers.q1, answers.q2, answers.q3, answers.q5, answers.q6, String(rank)].join("|");
}

// Tournament start, for converting answers.fromDate (an ISO date string)
// into the catalogue's own "day" field — verified directly against the
// approved CSV: day is NOT a date string but an integer tournament-day
// number 1-14 (Wimbledon 2027 runs 2027-06-28 through 2027-07-11, 14
// days), empty only for mode="flexible". Matches the approved 25-option
// reference CSV's own day_from/day_to columns, which use the identical
// 1-14 day-number convention for the same tournament window.
const TOURNAMENT_START = "2027-06-28";

function dayNumberFor(fromDate: string): string {
  const start = new Date(TOURNAMENT_START + "T00:00:00Z");
  const from = new Date(fromDate + "T00:00:00Z");
  const diffDays = Math.round((from.getTime() - start.getTime()) / 86400000) + 1;
  if (diffDays < 1 || diffDays > 14) {
    throw new Error(
      `Wimbledon explanation lookup: fromDate "${fromDate}" resolves to tournament day ${diffDays}, outside the valid 1-14 range — stop and report, never guess a day value.`
    );
  }
  return String(diffDays);
}

// Resolves the approved catalogue's `mode`/`day` fields from QuizAnswers.
// mode mirrors answers.q7 directly (fixed/adjustable/flexible_tournament ->
// the catalogue's own fixed/adjustable/flexible, verified identical labels
// against the approved CSV). day is the tournament day number (1-14)
// derived from answers.fromDate for fixed/adjustable, and empty for
// flexible — matching the CSV's own observed "day" column pattern exactly
// (verified: every flexible row has day="", every fixed/adjustable row has
// day in 1-14).
function modeAndDayFor(answers: QuizAnswers): { mode: string; day: string } {
  const mode = answers.q7 === "flexible_tournament" ? "flexible" : answers.q7;
  if (mode === "flexible") return { mode, day: "" };
  if (!answers.fromDate) {
    throw new Error(`Wimbledon explanation lookup: mode "${mode}" requires fromDate, got none — stop and report.`);
  }
  return { mode, day: dayNumberFor(answers.fromDate) };
}

export interface WimbledonExplanationResult extends Rationale {}

function resolve(
  answers: QuizAnswers,
  rank: 1 | 2 | 3,
  expectedOptionNumber: number
): WimbledonExplanationResult {
  const { mode, day } = modeAndDayFor(answers);
  const key = lookupKey(answers, mode, day, rank);
  const entry = CATALOGUE.entries[key];
  if (!entry) {
    throw new Error(
      `No approved Wimbledon explanation for key "${key}" (mode/day/Q1/Q2/Q3/Q5/Q6/rank) — catalogue/scoring mismatch. Stop and report, never substitute invented text.`
    );
  }
  const [optionNumber, , textIdx] = entry;
  if (optionNumber !== expectedOptionNumber) {
    throw new Error(
      `Wimbledon explanation catalogue mismatch at key "${key}": catalogue expects option ${optionNumber}, scoring engine produced option ${expectedOptionNumber} at rank ${rank}. Stop and report, never substitute invented text.`
    );
  }
  const text = CATALOGUE.strings[textIdx];
  if (!text) {
    throw new Error(`Approved Wimbledon catalogue entry for key "${key}" has no fan-facing text — catalogue data gap, stop and report.`);
  }
  return {
    text,
    evidence: { signalKeys: [], sentenceTwoOmitted: false, rule: "wimbledon-approved-lookup" },
  };
}

// Looks up the approved explanation text for one scored result set.
// Throws — never falls back to invented text — if a profile's catalogue
// entry is missing, or if the scoring engine's chosen option doesn't match
// the catalogue's expectation for that exact key, per the same fail-closed
// discipline as frenchOpenExplanation.ts/presentationMappings.ts.
export function selectWimbledonExplanations(
  answers: QuizAnswers,
  hero: ScoredOption,
  alternative1: ScoredOption | null,
  alternative2: ScoredOption | null
): {
  hero: WimbledonExplanationResult;
  alternative1: WimbledonExplanationResult | null;
  alternative2: WimbledonExplanationResult | null;
} {
  return {
    hero: resolve(answers, 1, hero.option.optionNumber),
    alternative1: alternative1 ? resolve(answers, 2, alternative1.option.optionNumber) : null,
    alternative2: alternative2 ? resolve(answers, 3, alternative2.option.optionNumber) : null,
  };
}
