// Tennis Grand Slam Trip Intelligence — direct weighted scoring engine.
// Implements spec §5.4-§5.9 exactly. No shortlist cutoff, no affordability
// veto/blend-expansion, no street-circuit/glamour safeguard — all four
// candidates are always fully eligible (spec §5.3's explicit prohibition
// on F1-specific ranking adjustments). Full floating-point precision is
// carried through scoring; rounding happens only at render time.

import type {
  GrandSlamCandidate, Q2Answer, Q3Answer, Q4Answer, Q5Answer,
  QuestionScores, CandidateScore, ScoringQuestionKey, TripIntelligenceTennisAnswers,
} from "./types";
import { makeWeights } from "./weights";

export const ENGINE_VERSION = "tennis-v1-direct-weighted";

const positiveScore = (rating: number): number => rating * 20;

// Spec §5.6 — directional distance curve, shared by Q4's A1/A3 branches.
const DIRECTIONAL_DISTANCE_SCORE: Record<number, number> = { 0: 100, 1: 85, 2: 65, 3: 45, 4: 30 };
function directionalScore(rating: number, target: number): number {
  const distance = Math.abs(rating - target);
  return DIRECTIONAL_DISTANCE_SCORE[distance] ?? 0;
}

// Spec §5.4 — Q2 Tournament Identity.
function scoreQ2(answer: Q2Answer, c: GrandSlamCandidate["components"]): number {
  switch (answer) {
    case "heritage": return positiveScore(c.D01A);
    case "modern": return positiveScore(c.D01B);
    case "both": return 0.5 * positiveScore(c.D01A) + 0.5 * positiveScore(c.D01B);
    case "open": return 0; // inactive — never consulted since q2 weight is 0 when open
  }
}

// Spec §5.5 — Q3 Tennis Experience.
function scoreQ3(answer: Q3Answer, c: GrandSlamCandidate["components"]): number {
  switch (answer) {
    case "showcourts": return positiveScore(c.D03A);
    case "outside_courts": return 0.75 * positiveScore(c.D03B) + 0.25 * positiveScore(c.D03C);
    case "balanced": return 0.5 * positiveScore(c.D03A) + 0.3 * positiveScore(c.D03B) + 0.2 * positiveScore(c.D03C);
  }
}

// Spec §5.6 — Q4 Atmosphere.
function scoreQ4(answer: Q4Answer, c: GrandSlamCandidate["components"]): number {
  switch (answer) {
    case "high_energy":
      return 0.85 * directionalScore(c.D05A, 5) + 0.15 * positiveScore(c.D04A);
    case "lively_grounds":
      return positiveScore(c.D04A);
    case "calm":
      return 0.85 * directionalScore(c.D05A, 2) + 0.15 * positiveScore(c.D05B);
    case "balanced": {
      // Spec §5.6 A4 preference curve: ratings 3/4 -> 100, ratings 2/5 -> 85.
      const curve = c.D05A === 3 || c.D05A === 4 ? 100 : c.D05A === 2 || c.D05A === 5 ? 85 : 0;
      return 0.65 * curve + 0.35 * positiveScore(c.D04A);
    }
  }
}

// Spec §5.7 — Q5 Beyond Tennis.
function scoreQ5(answer: Q5Answer, c: GrandSlamCandidate["components"]): number {
  switch (answer) {
    case "city": return positiveScore(c.D06A);
    case "regional": return positiveScore(c.D06B);
    case "both": return 0.5 * positiveScore(c.D06A) + 0.5 * positiveScore(c.D06B);
    case "tennis_first": return 0; // inactive — never consulted since q5 weight is 0
  }
}

// Spec §5.8 — Q6 Convenience & Comfort. Raw score independent of answer;
// only activation (handled in weights.ts) varies by answer.
function scoreQ6(c: GrandSlamCandidate["components"]): number {
  return 0.60 * positiveScore(c.D07A) + 0.40 * positiveScore(c.D07B);
}

// Spec §5.9 — Q7 Affordability. Raw score independent of answer; only
// activation (handled in weights.ts) varies by answer.
function scoreQ7(c: GrandSlamCandidate["components"]): number {
  return 0.40 * positiveScore(c.D08A) + 0.60 * positiveScore(c.D08B);
}

function computeQuestionScores(answers: TripIntelligenceTennisAnswers, candidate: GrandSlamCandidate): QuestionScores {
  return {
    q2_tournament_identity: scoreQ2(answers.q2_tournament_identity, candidate.components),
    q3_tennis_experience: scoreQ3(answers.q3_tennis_experience, candidate.components),
    q4_atmosphere: scoreQ4(answers.q4_atmosphere, candidate.components),
    q5_beyond_tennis: scoreQ5(answers.q5_beyond_tennis, candidate.components),
    q6_convenience: scoreQ6(candidate.components),
    q7_affordability: scoreQ7(candidate.components),
  };
}

export interface ScoredCandidates {
  weights: Record<ScoringQuestionKey, number>;
  active: Record<ScoringQuestionKey, boolean>;
  scores: CandidateScore[]; // unordered — rankCandidates.ts handles sorting/tie-grouping
}

export function scoreGrandSlam(
  answers: TripIntelligenceTennisAnswers,
  candidates: GrandSlamCandidate[],
): ScoredCandidates {
  const { normalized, active } = makeWeights(answers);

  const scores: CandidateScore[] = candidates.map((candidate) => {
    const questionScores = computeQuestionScores(answers, candidate);
    const finalScore = (Object.keys(questionScores) as ScoringQuestionKey[]).reduce(
      (sum, q) => sum + normalized[q] * questionScores[q],
      0,
    );
    return {
      sportingEventId: candidate.sportingEventId,
      sourceSlug: candidate.sourceSlug,
      grandSlamName: candidate.grandSlamName,
      questionScores,
      finalScore,
    };
  });

  return { weights: normalized, active, scores };
}
