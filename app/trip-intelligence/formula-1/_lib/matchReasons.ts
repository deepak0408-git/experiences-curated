// Generates grounded match-reason text from the fan's actual answers and
// the candidate's real C01-C10 scores — no invented match percentages, per
// README §2 ("Do not invent match percentages or claim a precise
// probability of satisfaction") and the handoff's non-negotiable
// constraints. Reasons only surface for characteristics the fan's answers
// actually weighted (i.e. ones a real question touched), grounded in the
// candidate's score for that characteristic being genuinely high (>= 4.0)
// — this keeps reasons honest rather than listing every strength
// regardless of relevance to what was asked.

import type { GrandPrixCandidate, TripIntelligenceAnswers } from "./types";

const STRONG_THRESHOLD = 4.0;

interface ReasonRule {
  appliesWhen: (answers: TripIntelligenceAnswers) => boolean;
  scoreKey: keyof GrandPrixCandidate["components"];
  text: string;
}

const RULES: ReasonRule[] = [
  { appliesWhen: (a) => a.q1_trip_purpose === "racing_first" || a.q2_gp_identity === "racing_circuit", scoreKey: "C01", text: "Strong on-track racing action and circuit character" },
  { appliesWhen: (a) => a.q2_gp_identity === "legendary", scoreKey: "C03", text: "Deep F1 heritage and sporting prestige" },
  { appliesWhen: (a) => a.q2_gp_identity === "street_spectacle", scoreKey: "C04A", text: "A visually striking street-race setting" },
  { appliesWhen: (a) => a.q2_gp_identity === "glamour_iconic", scoreKey: "C04B", text: "A glamorous, high-profile event with exclusive iconic status" },
  { appliesWhen: (a) => a.q4_off_track === "city" || a.q4_off_track === "food_nightlife", scoreKey: "C06A", text: "Plenty to explore in the destination itself" },
  { appliesWhen: (a) => a.q4_off_track === "day_trips", scoreKey: "C06B", text: "Strong options for extending the trip beyond the city" },
  { appliesWhen: (a) => a.q4_off_track === "more_f1", scoreKey: "C02", text: "Passionate crowds and real race-day fan culture" },
  { appliesWhen: (a) => a.q4_off_track === "more_f1", scoreKey: "C09A", text: "Strong fan zones and interactive activities" },
  { appliesWhen: (a) => a.q5_spectator === "views", scoreKey: "C05A", text: "Strong trackside sightlines" },
  { appliesWhen: (a) => a.q5_spectator === "viewpoints", scoreKey: "C05B", text: "A good range of viewing positions around the circuit" },
  { appliesWhen: (a) => a.q6_convenience === "very" || a.q6_convenience === "quite", scoreKey: "C07B", text: "Convenient, low-hassle circuit logistics" },
  { appliesWhen: (a) => a.q7_weather === "comfortable", scoreKey: "C08A", text: "Generally comfortable race-weekend weather" },
];

// Each reason shows its real underlying score inline (e.g. "— 4.8/5") so
// near-tied candidates display genuinely different numbers even when the
// same rule text applies to both — the honest fix for the alternative
// being readable instead of implying a tie is actually a real win. Founder
// flagged 10 Oct 2026: three results sharing identical bullet text made it
// impossible to see why the hero actually won; fabricated percentages are
// off the table per README §2, so real per-characteristic scores are the
// correct grounded alternative.
export function getMatchReasons(answers: TripIntelligenceAnswers, candidate: GrandPrixCandidate): string[] {
  const reasons: string[] = [];
  for (const rule of RULES) {
    if (reasons.length >= 3) break;
    if (!rule.appliesWhen(answers)) continue;
    const score = candidate.components[rule.scoreKey];
    if (score >= STRONG_THRESHOLD) {
      reasons.push(`${rule.text} — ${score.toFixed(1)}/5`);
    }
  }
  if (reasons.length === 0) {
    const fallback = getFallbackMatchReason(answers, candidate);
    if (fallback) reasons.push(fallback);
  }
  return reasons;
}

// Fallback for answer combinations RULES doesn't cover (surfaced 10 Oct
// 2026 by a 5,000-profile live test run: 20 profiles / 60 recommendations,
// 32 with no reason at all — every one an answer set with no "legendary",
// "street_spectacle", "views", "viewpoints", "very"/"quite" convenience or
// "comfortable" weather answer, i.e. nothing RULES' entries cover).
// Deliberately generic — never a lookup of those 20 profiles/60 sentences —
// so it also covers any future profile that lands in the same gap.
//
// General-interest characteristic pool: C01 (racing), C02 (crowd
// atmosphere), C03 (heritage), C06 (destination appeal, averaged from
// C06A/C06B the same way buildCandidates.ts derives flat C01), C09 (fan
// activities, averaged from C09A/C09B) — deliberately excludes every
// scoreKey RULES already has dedicated wording for (C04A/C04B street/
// glamour, C05A/B viewing, C07B convenience, C08A weather), so the
// fallback never echoes language a real rule would have used had the fan
// answered differently, and never duplicates a reason already shown
// elsewhere on the card.
//
// For each pool key, further excluded if the fan's OWN answers already
// map to that key's RULES entry (even if that entry's score threshold
// wasn't met) — e.g. q4_off_track="more_f1" claims C02 whether or not the
// candidate's C02 score actually cleared 4.0, since the fan was already
// told about fan-culture atmosphere via that specific question and a
// second, differently worded crowd-atmosphere claim here would read as a
// near-duplicate.
interface FallbackCharacteristic {
  key: "C01" | "C02" | "C03" | "C06" | "C09";
  score: (c: GrandPrixCandidate) => number;
  label: string;
  claimedBy: (a: TripIntelligenceAnswers) => boolean;
}

const FALLBACK_POOL: FallbackCharacteristic[] = [
  { key: "C01", score: (c) => c.components.C01, label: "racing appeal", claimedBy: (a) => a.q1_trip_purpose === "racing_first" || a.q2_gp_identity === "racing_circuit" },
  { key: "C02", score: (c) => c.components.C02, label: "crowd atmosphere", claimedBy: (a) => a.q4_off_track === "more_f1" },
  { key: "C03", score: (c) => c.components.C03, label: "heritage and prestige", claimedBy: (a) => a.q2_gp_identity === "legendary" },
  { key: "C06", score: (c) => (c.components.C06A + c.components.C06B) / 2, label: "destination appeal", claimedBy: () => false },
  { key: "C09", score: (c) => (c.components.C09A + c.components.C09B) / 2, label: "fan activities", claimedBy: () => false },
];

// Opening clause varies with the fan's stated trip purpose (the one answer
// every profile always has), so the fallback still reads as responsive to
// what the fan asked for even when no specific rule fired.
const FALLBACK_OPENERS: Record<TripIntelligenceAnswers["q1_trip_purpose"], string> = {
  sports_holiday: "A well-rounded option for your sports holiday",
  racing_first: "A balanced option for a racing-focused trip",
  balanced: "A well-rounded option",
};

function getFallbackMatchReason(answers: TripIntelligenceAnswers, candidate: GrandPrixCandidate): string | null {
  const available = FALLBACK_POOL.filter((c) => !c.claimedBy(answers));
  const scored = available
    .map((c) => ({ ...c, value: c.score(candidate) }))
    .filter((c) => c.value >= STRONG_THRESHOLD)
    .sort((a, b) => b.value - a.value)
    .slice(0, 2);

  if (scored.length === 0) {
    // Nothing in the unclaimed pool clears the bar — a neutral, honest
    // statement of overall fit rather than an unsupported specific claim,
    // per the task's explicit fallback-of-last-resort instruction.
    return "A solid overall match based on your answers.";
  }

  const opener = FALLBACK_OPENERS[answers.q1_trip_purpose];
  const parts = scored.map((c) => `${c.label} (${c.value.toFixed(1)}/5)`);
  return `${opener}, with strong ${parts.join(" and ")}.`;
}

// Short, positive labels for "the hero pulled ahead here" — a separate set
// from TRADE_OFF_LABELS below (which frames a candidate's own weak point,
// not a comparison against another candidate).
const EDGE_LABELS: Partial<Record<keyof GrandPrixCandidate["components"], string>> = {
  C01: "on-track racing action and circuit character",
  C01A: "racing action",
  C01B: "circuit character",
  C02: "crowd atmosphere and fan passion",
  C03: "F1 heritage and sporting prestige",
  C04A: "the visual spectacle of the event",
  C04B: "glamour and exclusivity",
  C05A: "trackside viewing quality",
  C05B: "the range of viewing positions",
  C06A: "the destination's own attractions",
  C06B: "trip-extension options beyond the race",
  C07A: "international connectivity",
  C07B: "circuit access and local logistics",
  C08A: "typical race-weekend weather",
  C08B: "on-site physical comfort",
  C09A: "organised fan activities",
  C09B: "festival and entertainment programming",
  C10: "affordability",
};

// Finds the characteristic with the largest real gap in candidateA's favor
// over candidateB, across all 18 scoring keys — not just the ones the
// fan's answers touched, since the actual differentiator can be something
// the questionnaire never directly asked about. Returns null if nothing
// clears the 0.3 threshold (too small a gap to honestly call a real edge).
function findBiggestEdge(
  candidateA: GrandPrixCandidate,
  candidateB: GrandPrixCandidate,
): { key: keyof GrandPrixCandidate["components"]; label: string } | null {
  let biggestKey: keyof GrandPrixCandidate["components"] | null = null;
  let biggestSize = 0;
  for (const key of Object.keys(candidateA.components) as (keyof GrandPrixCandidate["components"])[]) {
    const diff = candidateA.components[key] - candidateB.components[key];
    if (diff > biggestSize) {
      biggestSize = diff;
      biggestKey = key;
    }
  }
  if (biggestKey && biggestSize >= 0.3) {
    const label = EDGE_LABELS[biggestKey];
    if (label) return { key: biggestKey, label };
  }
  return null;
}

// States how an alternative compares to the hero — never a raw point
// value (meaningless without scale context to a fan), always a plain-
// language band plus the real characteristic where the hero actually
// pulled ahead. Founder flagged 10 Oct 2026: a bare "0.01 points behind"
// explained nothing when both candidates scored identically on every shown
// reason — the real differentiator was happening on a characteristic not
// in the visible bullets at all, so this surfaces it explicitly instead.
export function getGapFromHero(
  alternative: GrandPrixCandidate,
  hero: GrandPrixCandidate,
  alternativeFinalScore: number,
  heroFinalScore: number,
): string {
  const gap = heroFinalScore - alternativeFinalScore;

  // Rank-neutral wording — the card itself already carries a "Runner-up" /
  // "3rd option" badge, so this only needs to describe how close the gap
  // is, never imply a rank ("a close second" reads wrong on a 3rd-option
  // card). Founder caught this 10 Oct 2026.
  let band: string;
  if (gap < 0.03) {
    band = "Essentially tied with your best match";
  } else if (gap < 0.15) {
    band = "Very close to your best match";
  } else if (gap < 0.4) {
    band = "A clear step behind your best match";
  } else {
    band = "Noticeably behind your best match";
  }

  const edge = findBiggestEdge(hero, alternative);
  if (edge) {
    return `${band} — your top pick edges ahead mainly on ${edge.label}.`;
  }
  return `${band}.`;
}

// Hero-card companion to getGapFromHero — one bullet per alternative,
// naming the real characteristic where the hero's lead over THAT specific
// alternative is largest (e.g. "Ahead of Italian Grand Prix mainly on
// on-site physical comfort"). Shown on the hero card as "Why this
// comparatively ranks higher" per founder request (10 Oct 2026) — makes
// the hero's real edges visible on its own card, not just inferred from
// reading every alternative's amber line.
export function getComparativeEdges(
  hero: GrandPrixCandidate,
  alternatives: GrandPrixCandidate[],
): string[] {
  const bullets: string[] = [];
  for (const alt of alternatives) {
    const edge = findBiggestEdge(hero, alt);
    if (edge) {
      bullets.push(`Ahead of ${alt.grandPrixName} mainly on ${edge.label}`);
    }
  }
  return bullets;
}

// Trade-off: surfaces the candidate's single weakest characteristic among
// the ones the fan's answers actually touched, worded plainly rather than
// hidden. Returns null if nothing scores notably low (< 3.0).
const TRADE_OFF_LABELS: Partial<Record<keyof GrandPrixCandidate["components"], string>> = {
  C01: "the on-track racing action can be less eventful than some circuits",
  C01A: "the racing action itself can be less eventful than some circuits",
  C01B: "the circuit's character is less distinctive than some venues",
  C02: "the crowd atmosphere is calmer than the most passionate venues",
  C03: "it has less motorsport heritage than the sport's longest-running races",
  C04A: "the visual spectacle is more understated than the glitziest races",
  C04B: "it doesn't carry the same glamour or celebrity draw as Monaco or Miami",
  C05A: "trackside sightlines are more limited than at the best-viewing circuits",
  C05B: "there's less variety in viewing positions than some venues offer",
  C06A: "the destination itself has fewer standout attractions beyond the race",
  C06B: "there's less to do if you want to extend the trip",
  C07A: "international connectivity takes more planning than some host cities",
  C07B: "circuit access and local logistics are more demanding than average",
  C08A: "weather can be less predictable or comfortable during the race weekend",
  C08B: "the physical demands on site (walking, exposure) are higher than average",
  C09A: "organised fan activities are more limited than the biggest events",
  C09B: "there's less entertainment programming beyond the racing itself",
  C10: "it tends to be one of the pricier Grands Prix to attend",
};

export function getTradeOff(answers: TripIntelligenceAnswers, candidate: GrandPrixCandidate): string | null {
  const touchedKeys = RULES.filter((r) => r.appliesWhen(answers)).map((r) => r.scoreKey);
  let weakest: { key: keyof GrandPrixCandidate["components"]; score: number } | null = null;
  for (const key of touchedKeys) {
    const score = candidate.components[key];
    if (score < 3.0 && (!weakest || score < weakest.score)) {
      weakest = { key, score };
    }
  }
  if (!weakest) return null;
  const label = TRADE_OFF_LABELS[weakest.key];
  return label ? `Worth knowing: ${label}.` : null;
}
