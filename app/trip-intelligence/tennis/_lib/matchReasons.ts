// Tennis Grand Slam Trip Intelligence — explanation composer, per spec §7.
// Deterministic, grounded in actual weighted contribution deltas — never
// recalculates rankings using a different methodology. Reason-selection
// only inspects non-zero contributionDelta values, so an inactive or
// tied question can never surface as a reason by construction (spec §7.4's
// integrity constraints are enforced structurally, not by extra checks).
//
// Revision 3 (explanation refinement, see plan "concurrent-zooming-treehouse"):
// collapses the alternative card's mechanical margin/tradeOff/nextBestAlternative
// fragments into one natural, evidence-grounded explanation string; adds a
// dedicated joint-winner explanation for exact co-leader ties (with an
// 80-point editorial-only threshold for what counts as a genuine shared
// strength, and a neutral offsetting-difference path for ties that are not
// identical on every active question); adds a combined explanation for
// below-leader tied alternatives. Hero-card primary/secondary reason
// selection is unchanged from Revision 2 (still up to two distinct,
// materially-supported reasons). No scoring/ranking/threshold-for-ranking
// changes anywhere in this file.

import type {
  CandidateScore, ScoringQuestionKey, TripIntelligenceTennisAnswers,
} from "./types";
import {
  Q2_WORDING, Q3_WORDING, Q4_WORDING, Q5_WORDING, Q6_WORDING, Q7_WORDING,
  Q6_FLEXIBLE_PERSONALIZATION, Q7_NOT_A_CONCERN_PERSONALIZATION,
  getCombinedTravelGuidance, PROXIMITY_CONNECTOR, JOINT_WINNER_SHARED_PREFIX,
  JOINT_WINNER_NO_ADVANTAGE_CLOSE, JOINT_WINNER_NEUTRAL_FALLBACK, TIED_ALTERNATIVES_TEMPLATE,
  AFFORDABILITY_UNDISPLAYED_PREFIX, AFFORDABILITY_UNDISPLAYED_CLOSE,
} from "./wordingLibrary";

const PRIMARY_THRESHOLD = 1.0;
const SOFT_THRESHOLD = 0.25;

// Editorial-only threshold (refinement 2): a question only counts as a
// genuine shared STRENGTH for the joint-winner explanation if the tied
// score itself is at least this high. Being equally tied at a LOW score
// is still a tie (used elsewhere for margin/ranking purposes), just not
// something worth praising. Never read by scoreGrandSlam.ts/rankCandidates.ts.
const SHARED_STRENGTH_SCORE_THRESHOLD = 80;

const ALL_QUESTIONS: ScoringQuestionKey[] = [
  "q2_tournament_identity", "q3_tennis_experience", "q4_atmosphere",
  "q5_beyond_tennis", "q6_convenience", "q7_affordability",
];

export interface ContributionDelta {
  question: ScoringQuestionKey;
  delta: number; // normalizedWeight(q) * (scoreA(q) - scoreB(q))
}

/**
 * Spec §7 — contributionDelta(q) = normalizedWeight(q) × (scoreA(q) - scoreB(q)).
 * The sum of these across all questions reconciles to aFinalScore -
 * bFinalScore, subject to floating-point tolerance. Positive entries mean
 * candidate A is ahead of candidate B on that question.
 */
export function getContributionDeltas(
  weights: Record<ScoringQuestionKey, number>,
  a: CandidateScore,
  b: CandidateScore,
): ContributionDelta[] {
  return (Object.keys(weights) as ScoringQuestionKey[]).map((question) => ({
    question,
    delta: weights[question] * (a.questionScores[question] - b.questionScores[question]),
  }));
}

// Spec §7.2 — margin bands, applied to full-precision finalScore gaps.
export type MarginBand = "equal" | "virtually_tied" | "close" | "clearer" | "strong_advantage";

export function classifyMargin(margin: number): MarginBand {
  if (margin <= 1e-8) return "equal";
  if (margin < 1) return "virtually_tied";
  if (margin < 3) return "close";
  if (margin < 5) return "clearer";
  return "strong_advantage";
}

// Whether a candidate at this margin to the hero still clears the "worth
// comparing" bar — used by the results page to decide whether a 2nd
// alternative (or a below-leader tie group) earns a card at all. Reuses
// the same classifyMargin bands; no new threshold invented.
export function isStillCloseContender(heroScore: number, candidateScore: number): boolean {
  const band = classifyMargin(heroScore - candidateScore);
  return band === "equal" || band === "virtually_tied" || band === "close";
}

// Maps a scoring question to the wording-library "fit"/"advantage"/
// "tradeOff"/"alternative" fragment for the given answer, or null if that
// question has no fragment for this answer (e.g. Q2="open", Q5="tennis_first").
function fragmentsFor(
  question: ScoringQuestionKey,
  answers: TripIntelligenceTennisAnswers,
): { fit: string; advantage: string; tradeOff?: string; alternative: string } | null {
  switch (question) {
    case "q2_tournament_identity": {
      const a = answers.q2_tournament_identity;
      return a === "open" ? null : Q2_WORDING[a];
    }
    case "q3_tennis_experience":
      return Q3_WORDING[answers.q3_tennis_experience];
    case "q4_atmosphere":
      return Q4_WORDING[answers.q4_atmosphere];
    case "q5_beyond_tennis": {
      const a = answers.q5_beyond_tennis;
      return a === "tennis_first" ? null : Q5_WORDING[a];
    }
    case "q6_convenience": {
      const a = answers.q6_convenience;
      return a === "flexible" ? null : Q6_WORDING[a];
    }
    case "q7_affordability": {
      const a = answers.q7_affordability;
      return a === "not_a_concern" ? null : Q7_WORDING[a];
    }
  }
}

// Structured per-candidate Q7-claim registry — keyed by sourceSlug,
// recording which kind of Q7 statement (if any) has already been made
// about that specific candidate on this page render. A *different*
// candidate with its own distinct, unclaimed Q7 story is never suppressed
// — only a repeat of the same claim about the same candidate is.
export type Q7ClaimKind = "safeguard" | "tradeoff";
export type Q7ClaimRegistry = Map<string, Q7ClaimKind>;

export function createQ7ClaimRegistry(): Q7ClaimRegistry {
  return new Map();
}

// Shared dimension-claim registry (Fix 1) — tracks which non-Q7 question
// an earlier-rendered alternative card has already used as its comparative
// strength, so a later card in the same render falls through to its own
// next-best real strength instead of repeating the same claim. Q7 keeps
// using its own dedicated registry above; this one only ever governs the
// other five questions.
export function createClaimedDimensionsRegistry(): Set<ScoringQuestionKey> {
  return new Set();
}

export interface ComposedExplanation {
  marginBand: MarginBand;
  // Alternative card's single natural-language explanation (replaces the
  // old marginSentence/tradeOff/nextBestAlternative trio). Null only when
  // there's no alternative to compare against.
  explanation: string | null;
  // Hero card's own reasons — unchanged shape from Revision 2 (up to two
  // distinct, materially-supported reasons; refinement 1).
  primaryReason: string | null;
  secondaryReason: string | null;
  travelGuidance: string;
  convenienceGuidance: string | null;
  affordabilityGuidance: string | null;
}

function heroReasons(
  answers: TripIntelligenceTennisAnswers,
  weights: Record<ScoringQuestionKey, number>,
  hero: CandidateScore,
  alt: CandidateScore,
): { primaryReason: string | null; secondaryReason: string | null } {
  const heroDeltas = getContributionDeltas(weights, hero, alt)
    .filter((d) => fragmentsFor(d.question, answers) !== null);
  const heroPositive = heroDeltas.filter((d) => d.delta > 0).sort((a, b) => b.delta - a.delta);
  const topPositive = heroPositive[0];

  let primaryReason: string | null = null;
  if (topPositive && topPositive.delta >= PRIMARY_THRESHOLD) {
    const frag = fragmentsFor(topPositive.question, answers)!;
    primaryReason = `It ${frag.advantage}.`;
  } else if (topPositive && topPositive.delta >= SOFT_THRESHOLD) {
    const frag = fragmentsFor(topPositive.question, answers)!;
    primaryReason = `It has a modest edge: it ${frag.advantage.replace(/^offers a stronger/, "offers a slightly stronger").replace(/^better matches/, "somewhat better matches")}.`;
  } else {
    primaryReason = "It's your top overall match based on how your answers balance across the full questionnaire.";
  }

  let secondaryReason: string | null = null;
  const secondaryCandidate = heroPositive.find(
    (d) => d.question !== topPositive?.question && d.delta >= SOFT_THRESHOLD,
  );
  if (secondaryCandidate) {
    const frag = fragmentsFor(secondaryCandidate.question, answers)!;
    secondaryReason = `It also ${frag.advantage}.`;
  }

  return { primaryReason, secondaryReason };
}

/**
 * Alternative card's single-explanation composer (Revision 3). Chooses one
 * of four deterministic templates based on margin band and whether the
 * alternative has a genuine comparative strength, grounded in the same
 * contribution-delta math as before.
 *
 * `q7ClaimRegistry`, when provided, both reads prior Q7 claims (to avoid
 * restating an affordability story the safeguard already told) and records
 * a new one if this card ends up being the one to raise Q7.
 */
function composeAlternativeExplanation(
  answers: TripIntelligenceTennisAnswers,
  weights: Record<ScoringQuestionKey, number>,
  hero: CandidateScore,
  alt: CandidateScore,
  marginBand: MarginBand,
  q7ClaimRegistry?: Q7ClaimRegistry,
  claimedDimensions?: Set<ScoringQuestionKey>,
): string {
  const relevantQuestions = ALL_QUESTIONS.filter((q) => fragmentsFor(q, answers) !== null);

  // alt-minus-hero: positive means the ALTERNATIVE is genuinely ahead.
  const altDeltas = relevantQuestions.map((q) => ({
    question: q,
    delta: weights[q] * (alt.questionScores[q] - hero.questionScores[q]),
  }));
  // hero-minus-alt: positive means the HERO is genuinely ahead (used for
  // the hero's own distinguishing fit named on the alternative's card).
  const heroDeltas = relevantQuestions.map((q) => ({
    question: q,
    delta: weights[q] * (hero.questionScores[q] - alt.questionScores[q]),
  }));

  const alreadyClaimedQ7 = q7ClaimRegistry?.has(alt.sourceSlug) ?? false;

  // Alt's strongest genuine, unclaimed material strength (Fix 1): filters
  // out Q7 if already told via the safeguard/another card's trade-off, AND
  // any dimension a sibling alternative rendered earlier in this same page
  // has already used — so two alternatives never lead with the same
  // comparative claim. Only ever REMOVES an already-used option from
  // consideration; never blocks or invents anything for the dimension
  // that's genuinely still available.
  const altEligible = altDeltas
    .filter((d) => d.delta >= SOFT_THRESHOLD)
    .filter((d) => !(d.question === "q7_affordability" && alreadyClaimedQ7))
    .filter((d) => !claimedDimensions?.has(d.question))
    .sort((a, b) => b.delta - a.delta);
  const altStrength = altEligible[0] ?? null;

  // The alt's own best material delta BEFORE the claimed-dimensions filter
  // — used only to decide whether a "similarly-themed" fallback (below) is
  // grounded in a real, if already-claimed, strength rather than invented.
  const altBestUnfiltered = altDeltas
    .filter((d) => d.delta >= SOFT_THRESHOLD)
    .filter((d) => !(d.question === "q7_affordability" && alreadyClaimedQ7))
    .sort((a, b) => b.delta - a.delta)[0] ?? null;

  // Hero's strongest genuine distinguishing fit (for templates 1 and 3).
  const heroPositive = heroDeltas.filter((d) => d.delta >= SOFT_THRESHOLD).sort((a, b) => b.delta - a.delta);
  const heroStrength = heroPositive[0] ?? null;

  // A genuinely tied, high-scoring dimension both share (for template 3's
  // "both match equally well" clause) — same 80-point editorial bar as the
  // joint-winner composer, for consistency.
  const tiedStrength = relevantQuestions.find((q) => {
    const tied = Math.abs(hero.questionScores[q] - alt.questionScores[q]) < 1e-6;
    return tied && hero.questionScores[q] >= SHARED_STRENGTH_SCORE_THRESHOLD;
  });

  if (altStrength?.question === "q7_affordability") {
    q7ClaimRegistry?.set(alt.sourceSlug, "tradeoff");
  }
  if (altStrength && altStrength.question !== "q7_affordability") {
    claimedDimensions?.add(altStrength.question);
  }

  // Template 1 — alt has a genuine, unclaimed strength, margin is
  // close/virtually-tied.
  if (altStrength && (marginBand === "virtually_tied" || marginBand === "close" || marginBand === "equal")) {
    const altFrag = fragmentsFor(altStrength.question, answers)!;
    const proximity = marginBand === "equal" ? "is an equally strong match overall" : PROXIMITY_CONNECTOR[marginBand];
    // "offering {fit}" reads naturally since every fit string is already a
    // noun phrase ("the traditions...", "a contemporary...", "watching
    // marquee matches...") — no manipulation needed.
    const altClause = `${alt.grandSlamName} ${proximity}, offering ${altFrag.fit}.`;
    if (heroStrength) {
      // advantage strings are complete verb clauses ("offers a stronger
      // match for...", "better matches your preference for...") designed
      // to follow a subject directly — reused as-is rather than
      // reshaping the noun-phrase fit string into a verb clause.
      const heroFrag = fragmentsFor(heroStrength.question, answers)!;
      return `${altClause} ${hero.grandSlamName} ${heroFrag.advantage}.`;
    }
    return altClause;
  }

  // Template 3 — hero wins clearly, OR alt has no material positive
  // contribution left to claim (either none existed, or its real
  // strength(s) were already claimed by Q7 and/or a sibling alternative).
  if (!altStrength) {
    if (tiedStrength) {
      // "for {fit}" reads correctly whatever the fit string's own leading
      // article/form is ("for the traditions...", "for watching marquee
      // matches...", "for a contemporary Grand Slam experience...") — no
      // "its" prefix, which produced grammatically wrong doubles like
      // "for its the traditions..." / "for its watching...".
      const frag = fragmentsFor(tiedStrength, answers)!;
      return `${alt.grandSlamName} remains worth considering for ${frag.fit}, which both tournaments match equally well.`;
    }
    // Template 4a — the alt genuinely HAD a real material strength, but it
    // was claimed elsewhere (Q7 safeguard or an earlier-rendered sibling
    // alternative) — ground the proximity fallback in that real, if
    // already-told, theme ("a similarly lively tennis experience") rather
    // than a generic sentence with no thematic connection to the data.
    if (altBestUnfiltered && (marginBand === "virtually_tied" || marginBand === "close")) {
      const frag = fragmentsFor(altBestUnfiltered.question, answers)!;
      return `${alt.grandSlamName} is another very close overall match to ${hero.grandSlamName}, offering ${frag.fit}.`;
    }
    // Template 4b — no material contribution anywhere, margin still close.
    if (marginBand === "virtually_tied" || marginBand === "close") {
      return `${alt.grandSlamName} is also a close overall match for your preferences. While ${hero.grandSlamName} has a slight edge in the combined assessment, both remain worth considering.`;
    }
    return `${alt.grandSlamName} remains worth considering, even though ${hero.grandSlamName} is the clearer overall match for your preferences.`;
  }

  // Alt has a genuine, unclaimed strength but the margin is clearer/
  // strong_advantage — still name the alt's real strength plainly
  // (template 1's shape without the proximity framing, since the margin
  // doesn't support "almost tied").
  const altFrag = fragmentsFor(altStrength.question, answers)!;
  return `${alt.grandSlamName} ${altFrag.alternative}.`;
}

/**
 * Spec §7.1's seven-step composition sequence. `hero` and `alt` are full
 * CandidateScore objects — `alt` is whichever specific candidate this card
 * is describing relative to the hero (the runner-up or a 2nd alternative).
 * Hero-card reasons (primary/secondary) are grounded against `alt` same as
 * before; the alternative's own card gets the new single `explanation`.
 */
export function composeExplanation(
  answers: TripIntelligenceTennisAnswers,
  weights: Record<ScoringQuestionKey, number>,
  hero: CandidateScore,
  alt: CandidateScore | null,
  q7ClaimRegistry?: Q7ClaimRegistry,
  claimedDimensions?: Set<ScoringQuestionKey>,
): ComposedExplanation {
  const margin = alt ? hero.finalScore - alt.finalScore : 0;
  const marginBand = classifyMargin(margin);

  let primaryReason: string | null = null;
  let secondaryReason: string | null = null;
  let explanation: string | null = null;

  if (alt) {
    ({ primaryReason, secondaryReason } = heroReasons(answers, weights, hero, alt));
    explanation = composeAlternativeExplanation(answers, weights, hero, alt, marginBand, q7ClaimRegistry, claimedDimensions);
  }

  const travelGuidance = getCombinedTravelGuidance(answers.q1_travel_motivation, answers.q5_beyond_tennis);
  const convenienceGuidance = answers.q6_convenience === "flexible" ? Q6_FLEXIBLE_PERSONALIZATION : null;
  const affordabilityGuidance = answers.q7_affordability === "not_a_concern" ? Q7_NOT_A_CONCERN_PERSONALIZATION : null;

  return {
    marginBand,
    explanation,
    primaryReason,
    secondaryReason,
    travelGuidance,
    convenienceGuidance,
    affordabilityGuidance,
  };
}

/**
 * Spec §7.3 special Q7 top-priority safeguard — scans ALL remaining
 * candidates for the one with the genuinely strongest affordability match
 * that beats the hero's own Q7 score. Selection logic and eligibility
 * criteria are unchanged — never changes rankings, purely which name gets
 * cited. Records its claim in `q7ClaimRegistry` (if provided) so the named
 * candidate's own card doesn't separately re-raise Q7 as a comparative
 * strength.
 *
 * Fix 2: `displayedAlternativeSlugs`, when provided, lets the wording
 * distinguish a safeguard target that IS shown as a recommendation card
 * (original wording, unchanged) from one that is NOT (e.g. excluded by the
 * 3-card cap) — the latter switches to wording that explicitly flags it as
 * an additional consideration rather than implying it's among the
 * displayed matches. The underlying candidate-selection math (above) is
 * identical either way; only the sentence changes.
 */
export function getAffordabilitySafeguard(
  answers: TripIntelligenceTennisAnswers,
  hero: CandidateScore,
  remaining: CandidateScore[],
  q7ClaimRegistry?: Q7ClaimRegistry,
  displayedAlternativeSlugs?: Set<string>,
): string | null {
  if (answers.q7_affordability !== "top_priority") return null;

  const heroAfford = hero.questionScores.q7_affordability;
  const best = remaining
    .filter((c) => c.questionScores.q7_affordability > heroAfford)
    .sort((a, b) => b.questionScores.q7_affordability - a.questionScores.q7_affordability)[0];

  if (!best) return null;

  q7ClaimRegistry?.set(best.sourceSlug, "safeguard");

  const isDisplayed = displayedAlternativeSlugs?.has(best.sourceSlug) ?? true;
  if (!isDisplayed) {
    return `${AFFORDABILITY_UNDISPLAYED_PREFIX} ${best.grandSlamName} has a stronger affordability profile than ${hero.grandSlamName}. ${AFFORDABILITY_UNDISPLAYED_CLOSE}`;
  }
  return `${best.grandSlamName} ${Q7_WORDING.top_priority.alternative}, even though it isn't your overall top pick.`;
}

/**
 * Joint-winner explanation for an exact first-place tie (2-way or 3-way —
 * never called for a 4-way tie, which keeps the existing untouched
 * FOUR_WAY_TIE_EXPERIENCE editorial block).
 *
 * Refinement 2: a question counts as a genuine shared STRENGTH only if all
 * co-leaders' scores on it are tied AND that tied score is >= 80/100 —
 * being equally tied at a low score is still a tie, just not praiseworthy.
 *
 * Refinement 3: if co-leaders are tied overall but NOT identical on every
 * active question (i.e. they have real, offsetting per-question
 * differences that net out), name those specific differences neutrally by
 * tournament instead of claiming a blanket "both share everything" story
 * — never implies an overall winner. Falls back to the pure shared-
 * strength framing when the co-leaders really are tied on every active
 * dimension (as confirmed for every real tie in the current dataset).
 */
export function composeJointWinnerExplanation(
  answers: TripIntelligenceTennisAnswers,
  weights: Record<ScoringQuestionKey, number>,
  coLeaders: CandidateScore[],
): string {
  const names = coLeaders.map((c) => c.grandSlamName).join(" and ");
  const relevantQuestions = ALL_QUESTIONS.filter((q) => fragmentsFor(q, answers) !== null);

  // Pairwise deltas across all co-leader pairs, to detect any real
  // (non-zero, material) per-question difference anywhere in the group.
  const offsettingDifferences: { question: ScoringQuestionKey; leaderAhead: CandidateScore; leaderBehind: CandidateScore; delta: number }[] = [];
  for (let i = 0; i < coLeaders.length; i++) {
    for (let j = i + 1; j < coLeaders.length; j++) {
      const deltas = getContributionDeltas(weights, coLeaders[i], coLeaders[j]);
      for (const q of relevantQuestions) {
        const d = deltas.find((x) => x.question === q)!;
        if (Math.abs(d.delta) >= SOFT_THRESHOLD) {
          const [ahead, behind] = d.delta > 0 ? [coLeaders[i], coLeaders[j]] : [coLeaders[j], coLeaders[i]];
          // Avoid duplicate entries for the same question across pairs.
          if (!offsettingDifferences.some((o) => o.question === q)) {
            offsettingDifferences.push({ question: q, leaderAhead: ahead, leaderBehind: behind, delta: Math.abs(d.delta) });
          }
        }
      }
    }
  }

  if (offsettingDifferences.length > 0) {
    // Refinement 3 — name each real difference neutrally, never implying
    // an overall winner (the group is tied on finalScore by definition).
    // "advantage" strings are complete verb clauses ("offers a stronger
    // match for...") designed to follow a subject directly — avoids the
    // grammar issues of trying to turn a noun-phrase "fit" string into
    // "has the stronger {fit}" (which breaks for gerund/"the"-led fits).
    const clauses = offsettingDifferences.slice(0, 2).map((o) => {
      const frag = fragmentsFor(o.question, answers)!;
      return `${o.leaderAhead.grandSlamName} ${frag.advantage}`;
    });
    return `${names} are equally strong overall matches for your preferences. ${clauses.join("; ")} — together these balance out to an equally strong overall match.`;
  }

  // Pure shared-strength path — co-leaders tied on every active dimension.
  const sharedStrengths = relevantQuestions.filter((q) => {
    const scores = coLeaders.map((c) => c.questionScores[q]);
    const allTied = scores.every((s) => Math.abs(s - scores[0]) < 1e-6);
    return allTied && scores[0] >= SHARED_STRENGTH_SCORE_THRESHOLD;
  });

  if (sharedStrengths.length > 0) {
    // "Both align with your interest in {fit}" reads correctly for every
    // fit string's shape (leading "the"/"a"/"an"/gerund) since "interest
    // in" takes a direct object either way — no stripping needed.
    const fitPhrases = sharedStrengths.slice(0, 3).map((q) => fragmentsFor(q, answers)!.fit);
    const joined = fitPhrases.length === 1
      ? fitPhrases[0]
      : `${fitPhrases.slice(0, -1).join(", ")} and ${fitPhrases[fitPhrases.length - 1]}`;
    return `${names} are equally strong matches for your preferences. ${JOINT_WINNER_SHARED_PREFIX} ${joined}, ${JOINT_WINNER_NO_ADVANTAGE_CLOSE}.`;
  }

  return `${names} ${JOINT_WINNER_NEUTRAL_FALLBACK}`;
}

/**
 * Combined explanation for a below-leader tied alternative group (e.g. two
 * Grand Slams tied for 3rd place) — names both together, never framed as
 * an independent single runner-up, and never routed through the four-way
 * first-place tie template.
 */
export function composeTiedAlternativesExplanation(tiedGroup: CandidateScore[]): string {
  const names = tiedGroup.map((c) => c.grandSlamName).join(" and ");
  return `${names} ${TIED_ALTERNATIVES_TEMPLATE}`;
}
