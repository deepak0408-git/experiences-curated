// Tennis Grand Slam Trip Intelligence — question weighting, locked per
// spec §5.1-§5.3. Independent from F1's weights.ts (no shortlist/
// affordability-blend/safeguard mechanisms live here — see scoreGrandSlam.ts).

import type { Q6Answer, Q7Answer, ScoringQuestionKey, TripIntelligenceTennisAnswers } from "./types";

// Spec §5.1 — baseline weight per scoring question. Q1 is never a scoring
// key (0% always) and is intentionally absent from this map.
export const BASELINE_WEIGHTS: Record<ScoringQuestionKey, number> = {
  q2_tournament_identity: 0.198,
  q3_tennis_experience: 0.264,
  q4_atmosphere: 0.198,
  q5_beyond_tennis: 0.18,
  q6_convenience: 0.10,
  q7_affordability: 0.06,
};

// Spec §5.2 — activation factor per question+answer. Q2/Q3/Q4/Q5 activation
// depends only on which option was picked (1 or 0, with Q4 always active);
// Q6/Q7 use their own answer-keyed tables below.
const Q2_ACTIVATION: Record<string, number> = { heritage: 1, modern: 1, both: 1, open: 0 };
const Q3_ACTIVATION: Record<string, number> = { showcourts: 1, outside_courts: 1, balanced: 1 };
const Q4_ACTIVATION: Record<string, number> = { high_energy: 1, lively_grounds: 1, calm: 1, balanced: 1 };
const Q5_ACTIVATION: Record<string, number> = { city: 1, regional: 1, both: 1, tennis_first: 0 };
const Q6_ACTIVATION: Record<Q6Answer, number> = { flexible: 0, reasonable: 0.50, easy_access: 0.75, top_priority: 1 };
const Q7_ACTIVATION: Record<Q7Answer, number> = { top_priority: 1, sensible_budget: 0.75, some_flexibility: 0.40, not_a_concern: 0 };

function activationFor(answers: TripIntelligenceTennisAnswers, q: ScoringQuestionKey): number {
  switch (q) {
    case "q2_tournament_identity": return Q2_ACTIVATION[answers.q2_tournament_identity];
    case "q3_tennis_experience": return Q3_ACTIVATION[answers.q3_tennis_experience];
    case "q4_atmosphere": return Q4_ACTIVATION[answers.q4_atmosphere];
    case "q5_beyond_tennis": return Q5_ACTIVATION[answers.q5_beyond_tennis];
    case "q6_convenience": return Q6_ACTIVATION[answers.q6_convenience];
    case "q7_affordability": return Q7_ACTIVATION[answers.q7_affordability];
  }
}

const SCORING_QUESTIONS: ScoringQuestionKey[] = [
  "q2_tournament_identity", "q3_tennis_experience", "q4_atmosphere",
  "q5_beyond_tennis", "q6_convenience", "q7_affordability",
];

export interface WeightResult {
  normalized: Record<ScoringQuestionKey, number>;
  active: Record<ScoringQuestionKey, boolean>;
}

/**
 * Spec §5.3 — effectiveWeight(q) = baselineWeight(q) × activation(q);
 * normalizedWeight(q) = effectiveWeight(q) / sum(all effective weights).
 * Inactive weight is redistributed through this normalization, never
 * assigned a neutral numerical score (per spec's explicit instruction).
 */
export function makeWeights(answers: TripIntelligenceTennisAnswers): WeightResult {
  const effective: Record<ScoringQuestionKey, number> = {} as Record<ScoringQuestionKey, number>;
  const active: Record<ScoringQuestionKey, boolean> = {} as Record<ScoringQuestionKey, boolean>;

  for (const q of SCORING_QUESTIONS) {
    const activation = activationFor(answers, q);
    effective[q] = BASELINE_WEIGHTS[q] * activation;
    active[q] = activation > 0;
  }

  const total = SCORING_QUESTIONS.reduce((sum, q) => sum + effective[q], 0);
  const normalized: Record<ScoringQuestionKey, number> = {} as Record<ScoringQuestionKey, number>;
  for (const q of SCORING_QUESTIONS) {
    normalized[q] = total > 0 ? effective[q] / total : 0;
  }

  return { normalized, active };
}

export { SCORING_QUESTIONS };
