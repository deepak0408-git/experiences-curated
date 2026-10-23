import type { QuizAnswers, ScoredOption } from "./types";
import type { Rationale } from "./recommendationRationale";
import catalogue from "./frenchOpenExplanationCatalogue.json" with { type: "json" };

// French Open 2027 — deterministic, lookup-only explanation selector.
// Built 22 Oct 2026 directly from the founder-approved
// Roland_Garros_2027_Post_C4_Q3_Explanation_Personalized_Candidate CSV (the
// final editorial candidate across 53,568 questionnaire profiles) — NOT a
// construction/paraphrase engine like Australian Open's
// recommendationRationale.ts. Every sentence returned here is copied
// verbatim from that CSV; this module never generates, rephrases, or
// invents wording. This is the actual fan-facing text source for French
// Open results (the "displayed" system, per the architecture discovery's
// §F finding that AO's selectExplanation.ts/catalogue is audit-only and
// NOT what AO users actually see) — recommendationRationale.ts (AO's own
// construction-based module) is untouched and still serves Australian
// Open exactly as before.
//
// Verified during catalogue construction: explanation text depends only on
// (Q1,Q2,Q3,Q4,Q5,Q6,heroId,alt1Id,alt2Id) — zero Q7-date dependence
// across all 53,568 source rows (confirmed: 0 of 10,434 unique keys had
// more than one distinct explanation triplet) — so Q7's specific date
// value is deliberately excluded from the lookup key below.
//
// Per founder direction, 22 Oct 2026: the catalogue retains EVERY
// combination from the approved CSV, including the ~9.5% (987 of 10,434)
// not yet marked PRESERVED_FROZEN_REFERENCE (editorialStatus "P" or "R") —
// their sentence text is real, non-fabricated CSV content, just not yet
// final-approved. This module surfaces editorialStatus on every lookup so
// callers/tests can audit which combinations are pending without blocking
// on them. Public availability of French Open as a whole is still gated
// separately and fail-closed by tennisTicketIntelligenceEditionStatus
// (catalogueRatified/activatedAt) — this module has no awareness of that
// gate and must not be treated as a publication approval itself, same
// disclaimer as AO's selectExplanation.ts.

interface CatalogueShape {
  uniqueKeyCount: number;
  strings: (string | null)[];
  // entries[key] = [heroId, alt1Id, alt2Id, heroTextIdx, alt1TextIdx, alt2TextIdx, groundPassNoteIdx, statusCode]
  entries: Record<string, [number, number | null, number | null, number, number | null, number | null, number | null, "F" | "P" | "R"]>;
}
const CATALOGUE = catalogue as unknown as CatalogueShape;

const EDITORIAL_STATUS_LABEL = {
  F: "PRESERVED_FROZEN_REFERENCE",
  P: "PERSONALIZED_FALLBACK_PENDING_FINAL_EDITORIAL_APPROVAL",
  R: "REVIEW_SCORE_EVIDENCE",
} as const;

function lookupKey(answers: QuizAnswers, heroId: number, alt1Id: number | null, alt2Id: number | null): string {
  return [answers.q1, answers.q2, answers.q3, answers.q4, answers.q5, answers.q6, heroId, alt1Id, alt2Id].join("|");
}

function stringAt(idx: number | null): string | null {
  if (idx === null) return null;
  return CATALOGUE.strings[idx] ?? null;
}

export interface FrenchOpenExplanationResult extends Rationale {
  editorialStatus: "PRESERVED_FROZEN_REFERENCE" | "PERSONALIZED_FALLBACK_PENDING_FINAL_EDITORIAL_APPROVAL" | "REVIEW_SCORE_EVIDENCE";
  groundPassAccessNote: string | null;
}

// Looks up the full approved triplet for one scored result set in a single
// call (hero + up to 2 alternatives share one CSV row's key), since the
// approved text is keyed on the full (answers, hero, alt1, alt2) tuple,
// not derivable per-card independently. Throws — never falls back to
// invented text — if the exact combination isn't in the approved
// catalogue; per spec §8.3/§11, a missing mapping must surface as a loud
// build/runtime error, same fail-closed discipline as
// presentationMappings.ts's seatingPresentation().
export function selectFrenchOpenExplanations(
  answers: QuizAnswers,
  hero: ScoredOption,
  alternative1: ScoredOption | null,
  alternative2: ScoredOption | null
): {
  hero: FrenchOpenExplanationResult;
  alternative1: FrenchOpenExplanationResult | null;
  alternative2: FrenchOpenExplanationResult | null;
} {
  const heroId = hero.option.optionNumber;
  const alt1Id = alternative1?.option.optionNumber ?? null;
  const alt2Id = alternative2?.option.optionNumber ?? null;
  const key = lookupKey(answers, heroId, alt1Id, alt2Id);
  const entry = CATALOGUE.entries[key];
  if (!entry) {
    throw new Error(
      `No approved French Open explanation for key "${key}" (Q1-Q6 + hero/alt1/alt2 IDs) — catalogue/scoring mismatch. Stop and report per spec §8.3/§11, never substitute invented text.`
    );
  }
  const [, , , heroTextIdx, alt1TextIdx, alt2TextIdx, groundPassNoteIdx, statusCode] = entry;
  const status = EDITORIAL_STATUS_LABEL[statusCode];
  const groundPassAccessNote = stringAt(groundPassNoteIdx);

  const heroText = stringAt(heroTextIdx);
  if (heroText === null) {
    throw new Error(`Approved French Open catalogue entry for key "${key}" has no hero_explanation text — catalogue data gap, stop and report.`);
  }

  return {
    hero: {
      text: heroText,
      editorialStatus: status,
      groundPassAccessNote,
      evidence: { signalKeys: [], sentenceTwoOmitted: false, rule: "french-open-approved-lookup" },
    },
    alternative1:
      alternative1 && alt1TextIdx !== null
        ? {
            text: stringAt(alt1TextIdx)!,
            editorialStatus: status,
            groundPassAccessNote,
            evidence: { signalKeys: [], sentenceTwoOmitted: false, rule: "french-open-approved-lookup" },
          }
        : null,
    alternative2:
      alternative2 && alt2TextIdx !== null
        ? {
            text: stringAt(alt2TextIdx)!,
            editorialStatus: status,
            groundPassAccessNote,
            evidence: { signalKeys: [], sentenceTwoOmitted: false, rule: "french-open-approved-lookup" },
          }
        : null,
  };
}
