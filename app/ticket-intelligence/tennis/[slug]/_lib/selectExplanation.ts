import type { QuizAnswers, ScoredOption } from "./types";
import catalogue from "./reconstructedLanguageCatalogue.json" with { type: "json" };

// Deterministic explanation selector — Stage 1/2 spec (S01-S14 selection
// rules, tie/contribution/cost-delta bands from 03_explanation_rules.md
// and 07_RECOVERED_APPROVED_CONTEXT.md). Pure function: same scored
// options + answers always produce the same statement IDs and text.
//
// catalogue.json is the RECONSTRUCTED candidate (approval_status:
// PENDING_OWNER_RATIFICATION) — this selector only ever composes from its
// statement IDs, never generates new wording. Whether this text is served
// publicly is gated separately by
// tennisTicketIntelligenceEditionStatus.catalogueRatified (see
// getTennisOptionsData.ts) — this module has no awareness of that gate and
// must not be treated as a publication approval itself.

interface OptionDescription {
  statement_id: string;
  option_id: string;
  text: string;
}
interface ComparisonTemplate {
  statement_id: string;
  text: string;
  condition: string;
}

const OPTION_DESCRIPTIONS = catalogue.option_descriptions as OptionDescription[];
const COMPARISON_TEMPLATES = catalogue.comparison_templates as ComparisonTemplate[];

function descriptionFor(optionNumber: number): OptionDescription {
  const id = String(optionNumber).padStart(3, "0");
  const found = OPTION_DESCRIPTIONS.find((d) => d.option_id === id);
  if (!found) throw new Error(`No reconstructed description for option ${id} — catalogue/options data mismatch`);
  return found;
}

function findTemplate(id: string): ComparisonTemplate {
  const found = COMPARISON_TEMPLATES.find((t) => t.statement_id === id);
  if (!found) throw new Error(`Comparison template ${id} not found in catalogue — statement-ID dependency gap`);
  return found;
}

// Near-tie classification — S0x band thresholds, verbatim from
// 03_explanation_rules.md: exact=0 no superiority; (0,0.5) virtually tied;
// [0.5,2) close; [2,5) distinct; >=5 clearer.
type TieClass = "exact" | "virtually_tied" | "close" | "distinct" | "clearer";
function classifyGap(gap: number): TieClass {
  if (gap === 0) return "exact";
  if (gap < 0.5) return "virtually_tied";
  if (gap < 2) return "close";
  if (gap < 5) return "distinct";
  return "clearer";
}

// Cost-delta banding — <3 generally omit; 3-<8 supporting; >=8 potentially
// material. Verbatim from 03_explanation_rules.md.
type CostBand = "omit" | "supporting" | "material";
function classifyCostGap(indexGap: number): CostBand {
  const abs = Math.abs(indexGap);
  if (abs < 3) return "omit";
  if (abs < 8) return "supporting";
  return "material";
}

export interface ExplanationResult {
  text: string;
  statementIds: string[];
  evidence: {
    tieClass: TieClass;
    costBand: CostBand | null;
    costIndexGap: number | null;
  };
}

// Hero explanation — base description only. Per S01-S14: ground in the
// option's own actual attributes, no comparison claim needed for the top
// recommendation itself.
export function selectHeroExplanation(hero: ScoredOption): ExplanationResult {
  const desc = descriptionFor(hero.option.optionNumber);
  return {
    text: desc.text,
    statementIds: [desc.statement_id],
    evidence: { tieClass: "exact", costBand: null, costIndexGap: null },
  };
}

// Alternative explanation — base description + at most one directional
// comparison statement against the hero, selected by matching the
// alternative's relationship to the hero against each template's
// `condition` (arena/stage/session/seating match, tie class, cost gap).
// This is a conservative, explicit rule match — never a free-text
// generation — so an alternative with no matching template condition gets
// its base description only, never a fabricated comparison.
export function selectAlternativeExplanation(
  alternative: ScoredOption,
  hero: ScoredOption
): ExplanationResult {
  const desc = descriptionFor(alternative.option.optionNumber);
  const statementIds = [desc.statement_id];
  let text = desc.text;

  const costIndexGap = alternative.option.costIndex - hero.option.costIndex;
  const costBand = classifyCostGap(costIndexGap);
  const scoreGap = Math.abs(hero.adjustedScore - alternative.adjustedScore);
  const tieClass = classifyGap(scoreGap);

  const sameArenaStageSession =
    alternative.option.arenaCode === hero.option.arenaCode &&
    alternative.option.stageCode === hero.option.stageCode &&
    alternative.option.sessionCode === hero.option.sessionCode;
  const sameArena = alternative.option.arenaCode === hero.option.arenaCode;
  const sameStage = alternative.option.stageCode === hero.option.stageCode;

  let comparisonId: string | null = null;

  if (sameArenaStageSession) {
    if (alternative.option.seatingCode === "LB" && hero.option.seatingCode === "UB") {
      comparisonId = "CMP_SAME_ARENA_BASELINE_LOWER";
    } else if (alternative.option.seatingCode === "UB" && hero.option.seatingCode === "LB") {
      comparisonId = "CMP_SAME_ARENA_BASELINE_UPPER";
    } else if (
      (alternative.option.seatingCode.includes("B") && hero.option.seatingCode.includes("S")) ||
      (alternative.option.seatingCode.includes("S") && hero.option.seatingCode.includes("B"))
    ) {
      comparisonId = "CMP_BASELINE_SIDELINE";
    }
  } else if (alternative.option.arenaCode === "GP" && hero.option.arenaCode !== "GP") {
    comparisonId = "CMP_GP_VS_RESERVED";
  } else if (hero.option.arenaCode === "GP" && alternative.option.arenaCode !== "GP") {
    comparisonId = "CMP_RESERVED_VS_GP";
  } else if (hero.option.arenaCode === "RLA" && alternative.option.arenaCode === "MCA") {
    // CMP_RLA_MCA's text ("Margaret Court offers another substantial arena
    // experience in a more contained setting than Rod Laver") restates a
    // fact every MCA base description already states verbatim ("The arena
    // offers a substantial but more contained setting than Rod Laver") —
    // appending it produced a duplicate claim in the rendered text.
    // Suppressed here rather than rewritten, per founder direction: prefer
    // the factual base description and adjust assembly, don't rewrite the
    // catalogue. comparisonId stays null — this alternative's base
    // description alone already carries the relevant distinction.
  } else if (hero.option.arenaCode === "MCA" && alternative.option.arenaCode === "RLA") {
    comparisonId = "CMP_MCA_RLA";
  } else if (alternative.option.arenaCode === "JCA") {
    comparisonId = "CMP_JCA_RESERVED";
  } else if (hero.option.arenaCode === "JCA" && alternative.option.arenaCode === "RLA") {
    // Closes the previously-reported JCA-as-hero gap (154 cases). Founder-
    // approved wording, 20 Oct 2026 — grounded in RLA's own base
    // description ("flagship arena... big-stadium atmosphere") contrasted
    // with JCA's own base description's implicit smaller/more intimate
    // framing (reserved seat, unspecified zone, no named-perspective
    // claim). No new attribute invented beyond what each side's existing
    // description already states.
    comparisonId = "CMP_JCA_VS_RLA";
  } else if (hero.option.arenaCode === "JCA" && alternative.option.arenaCode === "MCA") {
    // Closes the remaining JCA-as-hero gap (330 cases). Founder-approved
    // wording, 20 Oct 2026 — grounded directly in the seating_code data:
    // every MCA option has one of three named zones (U/LS/LB), every JCA
    // option shares a single unspecified zone (RS, "Reserved (zone
    // unspecified)") — verified against scripts/_tennis-options-source.json
    // before this wording was proposed for approval.
    comparisonId = "CMP_JCA_VS_MCA";
  } else if (sameArena && sameStage && alternative.option.sessionCode !== hero.option.sessionCode) {
    // Same arena and stage, session differs — a genuine, supported
    // attribute difference the prior branch structure never reached
    // (sameArenaStageSession requires ALL three to match, and the arena-
    // difference branches above only fire when the arena itself differs).
    // CMP_DAY_NIGHT's condition is direction-aware ("day to night; reverse
    // phrasing when night to day") — the template text itself is
    // symmetric/neutral (no day->night vs night->day variants exist in the
    // catalogue), so no directional text selection is needed here, only
    // the comparison itself.
    comparisonId = "CMP_DAY_NIGHT";
  } else if (sameArena && !sameStage && alternative.option.sessionCode === hero.option.sessionCode) {
    // Same arena and session, stage differs — same gap as above for stage
    // rather than session. Early<->Middle and Middle<->Late each have a
    // dedicated template; Early<->Late has no dedicated template in the
    // catalogue (Q2's own compatibility matrix already treats Early-vs-
    // Later as the maximally distant case) and is deliberately left
    // without a stage-specific comparison rather than reusing an adjacent
    // template that would misstate the actual stage relationship.
    const stages: Record<string, number> = { Early: 0, Middle: 1, Late: 2 };
    const heroIdx = stages[hero.option.stageCode];
    const altIdx = stages[alternative.option.stageCode];
    const distance = Math.abs(heroIdx - altIdx);
    if (distance === 1) {
      comparisonId =
        Math.min(heroIdx, altIdx) === 0 ? "CMP_STAGE_EARLY_MIDDLE" : "CMP_STAGE_MIDDLE_LATE";
    }
  }

  // Near-tie override takes priority over a directional comparison when
  // the gap is virtually zero — per S0x: "exact tie => no superiority
  // claim", must accompany a concrete factual difference, never assert
  // the tie itself as the only content.
  if (tieClass === "exact" || tieClass === "virtually_tied") {
    if (comparisonId === null) comparisonId = "CMP_NEAR_TIE";
  }

  // Cost language only ever appended when the gap clears the "omit" band
  // and a comparison template exists to carry it — never invented
  // standalone.
  if (costBand !== "omit" && comparisonId === null) {
    comparisonId = costIndexGap > 0 ? "CMP_COST_HIGHER" : "CMP_COST_LOWER";
  }

  if (comparisonId) {
    const template = findTemplate(comparisonId);
    text = `${desc.text} ${template.text}`;
    statementIds.push(template.statement_id);
  }

  return { text, statementIds, evidence: { tieClass, costBand, costIndexGap } };
}
