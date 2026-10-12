// Port of engine/fixed_budget_candidate.py's make_weights() — the
// "candidate v2" question-budget-allocation weighting scheme that the
// selected two_stage_experience_candidate.py engine builds on (README §5).
// 1:1 port, every literal value matches the Python source exactly.

import type { ScoringKey, ScoringWeights, TripIntelligenceAnswers } from "./types";

// C01 is NOT listed here — like C04-C09's flat aggregates, it's a
// computed/derived ScoringKey (see buildCandidates.ts: C01 = weightA*C01A +
// weightB*C01B), never an independent weighting target in its own right.
// Only C01A/C01B carry real weight budget, added 10 Oct 2026 for
// matching-rubric.patch.json's Q2.racing_circuit override — at the same
// 0.5/0.5 split C01's own RAW_BASE share of 1 previously represented, so
// total budget across C01A+C01B is unchanged from before the split and every
// other key's normalized BASE share is unaffected.
const K = [
  "C01A", "C01B", "C02", "C03",
  "C04A", "C04B",
  "C05A", "C05B",
  "C06A", "C06B",
  "C07A", "C07B",
  "C08A", "C08B",
  "C09A", "C09B",
  "C10",
] as const satisfies readonly ScoringKey[];

// K-scoped weight map — deliberately narrower than ScoringWeights since C01
// never carries its own independent weight budget (see K above).
type KWeights = Record<(typeof K)[number], number>;

// Original 10 equal characteristic budgets, broken into their existing
// primary subdimension shares — from calibrate.py's `base`, normalized to
// sum to 1 (fixed_budget_candidate.py's BASE = {k: v/sum(...)}). C01A/C01B
// split 0.5/0.5 from C01's original raw share of 1 (10 Oct 2026) — keeps
// RAW_BASE_SUM, and therefore every other key's normalized BASE share,
// identical to before the split.
const RAW_BASE: KWeights = {
  C01A: 0.5, C01B: 0.5, C02: 1, C03: 1,
  C04A: 0.5, C04B: 0.5,
  C05A: 0.6, C05B: 0.4,
  C06A: 0.5, C06B: 0.5,
  C07A: 0.4, C07B: 0.6,
  C08A: 0.6, C08B: 0.4,
  C09A: 0.5, C09B: 0.5,
  C10: 1,
};
const RAW_BASE_SUM = K.reduce((sum, k) => sum + RAW_BASE[k], 0);
const BASE_WITHOUT_C01: KWeights = Object.fromEntries(
  K.map((k) => [k, RAW_BASE[k] / RAW_BASE_SUM]),
) as KWeights;
// C01 added to BASE (as C01A's + C01B's combined share) purely so K.map/pref
// lookups that still reference plain "C01" (Q1.racing_first, Q2.legendary,
// Q2.street_spectacle, Q4.more_f1) don't hit `undefined` — BASE.C01 is never
// itself read as an independent baseline weight since C01 is absent from K;
// see makeWeights()'s pref/BASE loop, which only ever iterates K.
export const BASE: ScoringWeights = {
  ...BASE_WITHOUT_C01,
  C01: BASE_WITHOUT_C01.C01A + BASE_WITHOUT_C01.C01B,
} as ScoringWeights;

// Per-question budget share of the total weight — must sum to 1.
// Q3 (Atmosphere) removed 11 Oct 2026; its budget was redistributed across
// the remaining 7 questions. Final approved 75/25 model locked 12 Oct 2026
// (Final Algorithm Update) — Q1/Q2/Q4/Q5 (primary preference questions)
// collectively 75%, Q6/Q7/Q8 (supporting questions) collectively 25%.
const QB: Record<`Q${1 | 2 | 4 | 5 | 6 | 7 | 8}`, number> = {
  Q1: 0.20, Q2: 0.22, Q4: 0.16, Q5: 0.17,
  Q6: 0.09, Q7: 0.08, Q8: 0.08,
};

type SubWeights = Partial<Record<ScoringKey, number>>;

// Each option allocates its QUESTION'S budget across these keys (must sum
// to 1), or null for a neutral/indifferent answer that contributes no
// ranking pressure.
// Every MAP entry that used to allocate budget to plain "C01" instead
// splits that same share 0.5/0.5 across C01A/C01B (C01's own weight split)
// — e.g. racing_first's old `C01: 0.65` is now `C01A: 0.325, C01B: 0.325` —
// since "C01" carries no weight budget of its own in K/BASE any more (it's
// purely a downstream computed display/reasoning value, see
// buildCandidates.ts). Only Q2.racing_circuit uses an uneven C01A/C01B split
// (0.6/0.2) per the 10 Oct 2026 recalibration patch; every other mapping
// below is numerically identical in total C01-ish pressure to before the
// split, just expressed as two equal halves instead of one. Exception,
// 11 Oct 2026: Q4.more_f1 was revised to drop C01A/C01B entirely (0%) in
// favor of C02/C09A — see its own comment below.
const MAP: Record<string, Record<string, SubWeights | null>> = {
  Q1: {
    racing_first: { C01A: 0.325, C01B: 0.325, C03: 0.2, C05A: 0.15 },
    balanced: { C01A: 0.15, C01B: 0.15, C06A: 0.25, C06B: 0.25, C02: 0.2 },
    sports_holiday: { C06A: 0.45, C06B: 0.45, C07B: 0.1 },
  },
  Q2: {
    legendary: { C03: 0.8, C01A: 0.1, C01B: 0.1 },
    racing_circuit: { C01A: 0.6, C01B: 0.2, C05A: 0.2 },
    street_spectacle: { C04A: 0.8, C01A: 0.1, C01B: 0.1 },
    // Added 12 Oct 2026 (Final Algorithm Update) — maps directly to the
    // existing C04B glamour/spectacle subdimension, no new characteristic
    // or special-case bonus introduced.
    glamour_iconic: { C04B: 1 },
    open: null,
  },
  Q4: {
    city: { C06A: 1 },
    food_nightlife: { C06A: 0.7, C09B: 0.3 },
    day_trips: { C06B: 1 },
    // Revised 11 Oct 2026: "more_f1" now represents F1 Fan Culture &
    // Atmosphere specifically (passionate crowds, fan zones, race-weekend
    // buzz) rather than duplicating Racing Action/Circuit Character, which
    // are already captured by Q1/Q2. C02 (Fan Passion) added at 50%,
    // C01A/C01B dropped to 0%.
    more_f1: { C02: 0.5, C09A: 0.5 },
  },
  Q5: {
    views: { C05A: 1 },
    viewpoints: { C05B: 1 },
    facilities: { C08B: 0.8, C05A: 0.2 },
    open: null,
  },
  Q6: {
    very: { C07A: 0.2, C07B: 0.8 },
    quite: { C07A: 0.3, C07B: 0.7 },
    flexible: null,
    adventure: null,
  },
  Q7: {
    comfortable: { C08A: 0.75, C08B: 0.25 },
    any_weather: null,
  },
  Q8: {
    major: { C10: 1 },
    quite: { C10: 1 },
    flexible: null,
    not_deciding: null,
  },
};

// "quite" and "major" differ in effective budget by redistributing the
// balance; "quite" contributes half its nominal budget (for Q6) or ~55%
// (for Q8) of the question's QB share.
const STRENGTH: Record<string, Record<string, number>> = {
  Q6: { quite: 0.65 },
  Q8: { quite: 0.55 },
};

// Explicit answer-key -> Q-label pairing (Q3 removed 11 Oct 2026) — kept as
// an explicit map rather than deriving "Q${i+1}" from array position, since
// the question numbers are no longer contiguous with array indices once Q3
// is gone (Q4 is the 3rd remaining question, not literally "Q3").
const QUESTION_ORDER: [keyof TripIntelligenceAnswers, keyof typeof QB][] = [
  ["q1_trip_purpose", "Q1"], ["q2_gp_identity", "Q2"], ["q4_off_track", "Q4"],
  ["q5_spectator", "Q5"], ["q6_convenience", "Q6"], ["q7_weather", "Q7"],
  ["q8_affordability", "Q8"],
];

/**
 * Builds the final scoring weights from 7 questionnaire answers.
 * `prior` is the baseline/expressed-preference blend (15% baseline / 85%
 * expressed, per README §5 step 2) — defaults to 0.15 to match the
 * selected engine's own default call.
 */
export function makeWeights(answers: TripIntelligenceAnswers, prior = 0.15): ScoringWeights {
  const parts: Array<{ budget: number; map: SubWeights }> = [];

  QUESTION_ORDER.forEach(([questionKey, q]) => {
    const answer = answers[questionKey];
    const map = MAP[q][answer];
    if (map !== null && map !== undefined) {
      const sum = Object.values(map).reduce((s, v) => s + (v ?? 0), 0);
      if (Math.abs(sum - 1) > 1e-9) {
        throw new Error(`MAP[${q}][${answer}] weights must sum to 1, got ${sum}`);
      }
      const strength = STRENGTH[q]?.[answer] ?? 1;
      parts.push({ budget: QB[q] * strength, map });
    }
  });

  const total = parts.reduce((s, p) => s + p.budget, 0);
  if (total === 0) {
    return { ...BASE };
  }

  // Conditional normalization: truly indifferent questions contribute no
  // ranking pressure.
  const pref: ScoringWeights = Object.fromEntries(K.map((k) => [k, 0])) as ScoringWeights;
  for (const { budget, map } of parts) {
    for (const [k, v] of Object.entries(map)) {
      pref[k as ScoringKey] += (budget * (v ?? 0)) / total;
    }
  }

  const result: ScoringWeights = Object.fromEntries(
    K.map((k) => [k, prior * BASE[k] + (1 - prior) * pref[k]]),
  ) as ScoringWeights;
  // C01 carries no independent weight budget (see K/MAP above — every
  // former "C01" allocation now splits across C01A/C01B), but is still
  // populated here as their sum so ScoringWeights stays a complete
  // Record<ScoringKey, number> for any caller that looks it up directly.
  result.C01 = result.C01A + result.C01B;
  return result;
}

export { K as SCORING_KEYS };
