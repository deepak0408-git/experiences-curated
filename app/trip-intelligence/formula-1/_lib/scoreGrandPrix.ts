// Port of engine/two_stage_experience_candidate.py — the selected
// "experience-first-030" matching engine (README §5, config/
// experience-first-030-policy.json). EXPERIMENTAL, not production-approved
// per the handoff's own framing — see trip_intelligence_engine_configurations
// row "candidate-v3-experience-first-030", status "experimental".
//
// Pure, deterministic: same answers + same candidate data => identical
// results every time. No DB access here — callers fetch candidates via
// buildCandidates() and pass them in.

import { makeWeights, SCORING_KEYS } from "./weights";
import type { GrandPrixCandidate, MatchResponse, MatchResult, ScoringKey, TripIntelligenceAnswers } from "./types";

const ENGINE_VERSION = "candidate-v3-experience-first-030";
const EXPERIENCE_FIT_TOLERANCE = 0.3;
const MINIMUM_SHORTLIST_SIZE = 3;

// Street-circuit preference signal, added 10 Oct 2026 per
// matching-rubric.patch.json: when the fan answers Q2 "street_spectacle",
// genuine/hybrid street circuits get a flat experience-fit bonus before
// shortlisting — distinct from Q2's existing C04A/C01 weighting, which
// already favors them indirectly. Qualifying set is the patch's explicit,
// fixed list (Madrid included as an approved hybrid) — never inferred from
// any venue-type field, and never extended without separate review.
const STREET_CIRCUIT_EXPERIENCE_FIT_BONUS = 0.15;
const QUALIFYING_STREET_CIRCUIT_SLUGS = new Set([
  "monaco", "singapore", "las-vegas", "saudi-arabia", "azerbaijan", "spain-madrid",
]);

// Glamour & Iconic Experiences representation safeguard, added 12 Oct 2026
// (Q2 Representation Safeguards spec): qualification is a flat C04B >= 4
// threshold on the existing rating, not a bonus or new weight.
const GLAMOUR_C04B_QUALIFYING_THRESHOLD = 4;

// Q8 affordability blend caps, per config/experience-first-030-policy.json:
// major: 0.25, quite: 0.125 (half of major), flexible/not_deciding: 0.
const Q8_IMPORTANCE: Record<TripIntelligenceAnswers["q8_affordability"], number> = {
  major: 1,
  quite: 0.5,
  flexible: 0,
  not_deciding: 0,
};
const MAX_AFFORDABILITY_BLEND = 0.25;

/**
 * Port of experience_scores(ans) — Q8/C10 excluded and weights renormalized,
 * since affordability has zero effect on experience fit by design (README
 * §5 step 2: "Remove Q8/C10 from the experience-fit score and renormalize").
 */
function experienceScores(
  answers: TripIntelligenceAnswers,
  candidates: GrandPrixCandidate[],
): Map<string, number> {
  // Force Q8 to "not_deciding" so it contributes zero weight, matching the
  // Python reference's `a[7]='not_deciding'` before calling make_weights.
  const neutralAnswers: TripIntelligenceAnswers = { ...answers, q8_affordability: "not_deciding" };
  const fullWeights = makeWeights(neutralAnswers, 0.15);

  const experienceKeys = SCORING_KEYS.filter((k) => k !== "C10");
  const weightSum = experienceKeys.reduce((s, k) => s + fullWeights[k], 0);
  const normalizedWeights: Partial<Record<ScoringKey, number>> = {};
  for (const k of experienceKeys) {
    normalizedWeights[k] = fullWeights[k] / weightSum;
  }

  const applyStreetBonus = answers.q2_gp_identity === "street_spectacle";

  const scores = new Map<string, number>();
  for (const candidate of candidates) {
    let score = 0;
    for (const k of experienceKeys) {
      score += (normalizedWeights[k] ?? 0) * candidate.components[k];
    }
    if (applyStreetBonus && QUALIFYING_STREET_CIRCUIT_SLUGS.has(candidate.sourceSlug)) {
      score += STREET_CIRCUIT_EXPERIENCE_FIT_BONUS;
    }
    scores.set(candidate.sourceSlug, score);
  }
  return scores;
}

/**
 * Port of rank(ans, tolerance, cost_weight) — builds the experience-fit
 * shortlist (0.30-point tolerance with the documented minimum-three
 * exception), then reranks by affordability within that shortlist only.
 */
export function scoreGrandPrix(
  answers: TripIntelligenceAnswers,
  candidates: GrandPrixCandidate[],
): MatchResponse {
  if (candidates.length < MINIMUM_SHORTLIST_SIZE) {
    throw new Error(`Need at least ${MINIMUM_SHORTLIST_SIZE} candidates, got ${candidates.length}`);
  }

  const experienceFit = experienceScores(answers, candidates);
  const bestFit = Math.max(...experienceFit.values());

  const bySlug = new Map(candidates.map((c) => [c.sourceSlug, c]));

  // Stable ordering: experience fit descending, tie-break by sourceSlug
  // ascending (matches Python's `key=lambda e:(-exp[e],e)`).
  const orderedBySlug = [...experienceFit.keys()].sort((a, b) => {
    const diff = experienceFit.get(b)! - experienceFit.get(a)!;
    if (diff !== 0) return diff;
    return a.localeCompare(b);
  });

  // Within score-point tolerance of the best, OR in the top 3 regardless —
  // the documented minimum-three exception (README §5 step 5, config
  // minimum_three_exception: "not a hard bound", always flagged when used).
  const withinTolerance = new Set(
    orderedBySlug.filter((slug) => experienceFit.get(slug)! >= bestFit - EXPERIENCE_FIT_TOLERANCE - 1e-10),
  );
  const top3 = new Set(orderedBySlug.slice(0, MINIMUM_SHORTLIST_SIZE));
  const usedMinimumThreeException = [...top3].some((slug) => !withinTolerance.has(slug));
  const eligible = new Set([...withinTolerance, ...top3]);

  // Q8 affordability blend, applied only within the eligible shortlist —
  // it can never expand the shortlist itself (README acceptance criteria).
  const importance = Q8_IMPORTANCE[answers.q8_affordability];
  const alpha = MAX_AFFORDABILITY_BLEND * importance;

  const finalBlendedScore = (slug: string): number => {
    const candidate = bySlug.get(slug)!;
    return (1 - alpha) * experienceFit.get(slug)! + alpha * candidate.components.C10;
  };

  const rankedSlugs = [...eligible].sort((a, b) => {
    const diff = finalBlendedScore(b) - finalBlendedScore(a);
    if (diff !== 0) return diff;
    const fitDiff = experienceFit.get(b)! - experienceFit.get(a)!;
    if (fitDiff !== 0) return fitDiff;
    return a.localeCompare(b);
  });

  // Street-circuit alternative safeguard, added 10 Oct 2026 per
  // matching-rubric.patch.json: if Q2 is "street_spectacle" and none of the
  // natural top 3 is a qualifying street circuit, swap the 3rd slot only
  // for the best-scoring qualifying circuit already in the existing 0.30
  // shortlist (`eligible`) — never reaching outside it, never touching the
  // hero or 2nd place, and never blocked by Q8 affordability (no veto: a
  // qualifying circuit can out-rank a cheaper option here on purpose, per
  // the patch's explicit "no affordability override" instruction). A no-op
  // when no qualifying circuit is shortlisted at all — this never forces an
  // insertion outside the tolerance band.
  let finalTop3Slugs = rankedSlugs.slice(0, 3);
  if (answers.q2_gp_identity === "street_spectacle") {
    const top3HasQualifyingStreetCircuit = finalTop3Slugs.some((slug) => QUALIFYING_STREET_CIRCUIT_SLUGS.has(slug));
    if (!top3HasQualifyingStreetCircuit) {
      const qualifyingInShortlist = rankedSlugs.filter((slug) => QUALIFYING_STREET_CIRCUIT_SLUGS.has(slug));
      if (qualifyingInShortlist.length > 0) {
        const bestQualifying = qualifyingInShortlist[0];
        finalTop3Slugs = [finalTop3Slugs[0], finalTop3Slugs[1], bestQualifying];
      } else {
        // Street Spectacle fallback, added 12 Oct 2026 (Targeted Street
        // Spectacle Safeguard Correction spec): the shortlist-bounded
        // safeguard above is a no-op when no qualifying street circuit is
        // in the 0.30-tolerance shortlist at all (confirmed by the
        // 7,680-profile simulation: 56 such profiles). This is a separate,
        // narrowly scoped post-ranking exception — it only fires when that
        // safeguard already found nothing — and searches the FULL 24-GP
        // dataset (ordered by the same finalBlendedScore methodology used
        // everywhere else) rather than the shortlist. Still never touches
        // hero/2nd, still only ever replaces slot 3, still never expands
        // the shortlist itself (`eligible`/`rankedSlugs` are untouched).
        const qualifyingAnywhere = [...QUALIFYING_STREET_CIRCUIT_SLUGS].filter((slug) => bySlug.has(slug));
        if (qualifyingAnywhere.length > 0) {
          const bestQualifyingOverall = [...qualifyingAnywhere].sort((a, b) => {
            const diff = finalBlendedScore(b) - finalBlendedScore(a);
            if (diff !== 0) return diff;
            const fitDiff = experienceFit.get(b)! - experienceFit.get(a)!;
            if (fitDiff !== 0) return fitDiff;
            return a.localeCompare(b);
          })[0];
          finalTop3Slugs = [finalTop3Slugs[0], finalTop3Slugs[1], bestQualifyingOverall];
        }
      }
    }
  }

  // Glamour & Iconic Experiences representation safeguard, added 12 Oct
  // 2026 (Q2 Representation Safeguards spec): if Q2 is "glamour_iconic" and
  // none of the natural top 3 has C04B >= 4, swap the 3rd slot only for the
  // best-scoring (by the existing finalBlendedScore ranking) qualifying GP
  // already in the existing shortlist (`eligible`/`rankedSlugs`) — never
  // reaching outside it, never touching hero/2nd. Mirrors the street-circuit
  // safeguard's shape exactly, but with a rating-threshold qualification
  // (C04B >= 4) instead of a fixed slug set. A no-op when no qualifying GP
  // is shortlisted at all — never forces an insertion outside the shortlist.
  if (answers.q2_gp_identity === "glamour_iconic") {
    const isGlamourQualifying = (slug: string) =>
      bySlug.get(slug)!.components.C04B >= GLAMOUR_C04B_QUALIFYING_THRESHOLD;
    const top3HasQualifyingGlamour = finalTop3Slugs.some(isGlamourQualifying);
    if (!top3HasQualifyingGlamour) {
      const qualifyingInShortlist = rankedSlugs.filter(isGlamourQualifying);
      if (qualifyingInShortlist.length > 0) {
        const bestQualifying = qualifyingInShortlist[0];
        finalTop3Slugs = [finalTop3Slugs[0], finalTop3Slugs[1], bestQualifying];
      }
    }
  }

  const results: MatchResult[] = orderedBySlug.map((slug) => {
    const candidate = bySlug.get(slug)!;
    const fit = experienceFit.get(slug)!;
    const inShortlist = eligible.has(slug);
    const finalScore = inShortlist ? (1 - alpha) * fit + alpha * candidate.components.C10 : fit;
    return {
      sportingEventId: candidate.sportingEventId,
      sourceSlug: candidate.sourceSlug,
      grandPrixName: candidate.grandPrixName,
      experienceFit: fit,
      finalScore,
      shortlisted: inShortlist,
    };
  });

  const resultBySlug = new Map(results.map((r) => [r.sourceSlug, r]));
  const top3Ranked = finalTop3Slugs.map((slug) => resultBySlug.get(slug)!);

  return {
    results,
    hero: top3Ranked[0],
    alternatives: top3Ranked.slice(1),
    shortlistSize: eligible.size,
    usedMinimumThreeException,
    engineVersion: ENGINE_VERSION,
  };
}
