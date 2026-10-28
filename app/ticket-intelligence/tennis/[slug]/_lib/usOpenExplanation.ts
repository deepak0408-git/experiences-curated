import type { QuizAnswers, ScoredOption, TicketOption } from "./types";
import type { Rationale } from "./recommendationRationale";
import catalogue from "./usOpenExplanationCatalogue.json" with { type: "json" };

// US Open 2027 — explanation selector. Two paths, exactly mirroring the
// supplied Phase 4 v8 engine's own render() dispatch (reference_map()
// lookup first, generative fallback second):
//
//  1. EXACT REFERENCE (16 founder-approved profiles, 48 passages): a
//     verbatim lookup from usOpenExplanationCatalogue.json, built from the
//     handoff's own self-verified reference files (see
//     scripts/_build-us-open-explanation-catalogue.mjs). These 48 strings
//     ARE individually founder-approved — confirmed both by the original
//     handoff's Closure_48_Reference_Verification.csv (48/48 exact_match)
//     and, independently, by the "approved" column of the later-supplied
//     patch's FinalGate_48_Reference_Review.csv being byte-identical to
//     it (verified directly, 48/48, 28 Oct 2026) — the FinalGate file's
//     own "generated" column (0/48 exact match) is a historical pre-v8
//     renderer's output, not a second competing approved set; it exists in
//     that file purely as evidence of what an earlier draft got wrong.
//
//  2. GENERALIZED FALLBACK (every other Q1-Q7 combination): a faithful
//     line-for-line port of USO27_Phase4_Explanation_Engine_v6.py's
//     venue/name/occasion/stage/setting/view/cost/mismatch/hero/
//     alternative functions, supplied in
//     USO27_Phase5_Explanation_v8_Missing_Dependency_Patch.zip (28 Oct
//     2026) after the original handoff omitted this file entirely. Per
//     explicit founder direction, this path's output is NOT individually
//     founder-approved the way the 16 reference passages are — the
//     FinalGate QA file raised real phrasing concerns about this same
//     generative logic (e.g. "omitted_cost_advantage",
//     "awkward_grounds_occasion_comparison") that were never resolved to
//     REVIEW_REQUIRED/NOT_SIGNED_OFF rows reaching sign-off. It is ported
//     faithfully as the frozen implementation baseline, not rewritten or
//     improved — any editorial concern with its phrasing is a product
//     decision for a future pass, not something this port should
//     silently "fix" by deviating from the source.
//
// Every function below is a direct, non-reinterpreted translation of the
// Python source — same branching order, same string literals, same
// dict/lookup keys — translated only where Python/TypeScript syntax
// differs (e.g. dict literals -> Record, f-strings -> template literals).

interface CatalogueShape {
  uniqueKeyCount: number;
  strings: string[];
  // entries[key] = [heroId, alt1Id, alt2Id, heroTextIdx, alt1TextIdx, alt2TextIdx]
  entries: Record<string, [number, number, number, number, number, number]>;
}
const CATALOGUE = catalogue as unknown as CatalogueShape;

// ── Ported from v6: venue/name/occasion/stage/setting/view/cost/mismatch ──

function venue(o: TicketOption): string {
  return o.arenaName.replace(" Stadium", "");
}

function name(o: TicketOption): string {
  const v = venue(o);
  if (v === "Grounds Admission") return v;
  return v + " " + o.seatingLabel.replace(" Reserved", "");
}

// Python stage_code -> fan-facing stage phrase. Note: v6's `stage()` uses
// this exact 3-entry dict (Early/Middle/Late only) — any option with a
// different stage_code throws in Python via KeyError; ported the same way
// here (no silent fallback).
const STAGE_PHRASE: Record<string, string> = {
  Early: "early rounds",
  Middle: "middle rounds",
  Late: "later rounds",
};

function stage(o: TicketOption): string {
  const phrase = STAGE_PHRASE[o.stageCode];
  if (!phrase) throw new Error(`usOpenExplanation.stage(): unmapped stageCode "${o.stageCode}" (option ${o.optionNumber})`);
  return phrase;
}

// v6's stagecode(s) takes a raw Q2-style stage string (used only for the
// questionnaire answer "later", mapped by the caller to "Late" before this
// point — see Q2 code elsewhere) and returns the same phrase mapping as
// stage(). Ported as its own function (not merged with stage()) to mirror
// the source exactly, since the two have different call sites/inputs.
function stagecode(s: string): string {
  const phrase = STAGE_PHRASE[s];
  if (!phrase) throw new Error(`usOpenExplanation.stagecode(): unmapped stage "${s}"`);
  return phrase;
}

function occasion(o: TicketOption): string {
  const v = venue(o);
  if (v === "Grounds Admission") return "exploring tennis across the outside courts";
  if (v === "Arthur Ashe" && o.stageCode === "Late") {
    return o.roundsLabel.toLowerCase().includes("semifinal") ? "a Grand Slam semifinal" : "a championship final";
  }
  if (o.stageCode === "Middle") return "middle-round tennis";
  const byStage: Record<string, string> = { Early: "early-round tennis", Middle: "middle-round tennis", Late: "late-round tennis" };
  const result = byStage[o.stageCode];
  if (!result) throw new Error(`usOpenExplanation.occasion(): unmapped stageCode "${o.stageCode}" (option ${o.optionNumber})`);
  return result;
}

const SETTING_BY_VENUE: Record<string, string> = {
  "Arthur Ashe": "the US Open's iconic main stadium",
  "Louis Armstrong": "a major show court",
  Grandstand: "an intimate stadium setting",
  "Grounds Admission": "the outside courts",
};

function setting(o: TicketOption): string {
  const v = venue(o);
  const result = SETTING_BY_VENUE[v];
  if (result === undefined) throw new Error(`usOpenExplanation.setting(): unmapped venue "${v}" (option ${o.optionNumber})`);
  return result;
}

const VIEW_BY_SEATING_LABEL: Record<string, string> = {
  Promenade: "reserved upper-tier seating",
  Loge: "reserved seating with an elevated, balanced view",
  Courtside: "reserved seating close to the court",
  "Courtside Reserved": "reserved seating close to the court",
};

function view(o: TicketOption): string {
  if (venue(o) === "Grounds Admission") return "generally unreserved outside-court seating";
  return VIEW_BY_SEATING_LABEL[o.seatingLabel] ?? "reserved seating";
}

function cost(o: TicketOption, h: TicketOption): "less expensive" | "more expensive" | "similarly priced" {
  const d = o.costIndex - h.costIndex;
  if (d < -0.01) return "less expensive";
  if (d > 0.01) return "more expensive";
  return "similarly priced";
}

// mismatch(p,o): only infer a date-driven stage mismatch for a fixed
// travel date, or a session mismatch when the fan expressed a Day/Night
// preference (not "Either"). p.q2 here is the raw QuizAnswers.q2 value
// translated to its stage-code form by the caller before this function is
// invoked (see q2StageCodeFor below) — matching v6's own p['q2'] usage,
// which is already a stage_code-shaped value ("Early"/"Middle"/"Late"),
// not the questionnaire's own answer spelling ("early"/"middle"/"later").
function mismatch(p: NormalizedProfile, o: TicketOption): string {
  if (p.dateMode === "fixed" && p.q2StageCode !== o.stageCode) {
    return `Your travel window falls during the ${stage(o)} rather than your preferred ${stagecode(p.q2StageCode)}.`;
  }
  if (p.q4 !== "Either" && p.q4 !== o.sessionCode) {
    return `This is a ${(o.sessionCode ?? "").toLowerCase()} session rather than your preferred ${p.q4.toLowerCase()} session.`;
  }
  return "";
}

// ── Ported from v6: hero(p,o,alternatives) ──

function hero(p: NormalizedProfile, o: TicketOption, alternatives: TicketOption[]): string {
  const v = venue(o);
  const s = (o.sessionCode ?? "").toLowerCase();
  const occ = occasion(o);
  let first: string;
  let second: string;

  if (v === "Grounds Admission") {
    first = `${name(o)} is your strongest match for discovering tennis across the outside courts during the ${stage(o)}.`;
    second = "It offers the flexibility to explore different matches, with generally unreserved seating and a lively atmosphere around the smaller courts.";
  } else if (v === "Arthur Ashe") {
    first = `${name(o)} is your strongest match for experiencing ${occ} in ${setting(o)}` + (s === "night" ? " under the lights." : ".");
    const bySeating: Record<string, string> = {
      Promenade: "Its reserved upper-tier seat combines the stadium occasion with a lower cost than the closer seating tiers.",
      Loge: "Its reserved Loge seating provides a balanced, elevated perspective on the rallies.",
      Courtside: "Its reserved Courtside seating puts you close to the action in the tournament’s largest arena.",
    };
    const sec = bySeating[o.seatingLabel];
    if (sec === undefined) throw new Error(`usOpenExplanation.hero(): unmapped Arthur Ashe seatingLabel "${o.seatingLabel}" (option ${o.optionNumber})`);
    second = sec;
  } else if (v === "Louis Armstrong") {
    first = `${name(o)} is your strongest match for ${occ} in the lively atmosphere of Louis Armstrong` + (s === "night" ? " at night." : ".");
    second = o.seatingLabel.includes("Courtside")
      ? "Its reserved seating brings you close to the rallies in a major show-court setting."
      : "Its reserved Loge seating offers a balanced, elevated view of the court.";
    if (o.seatingLabel === "Loge" && alternatives.some((a) => venue(a) === "Grounds Admission")) {
      second = "Unlike Grounds Admission, it provides a reserved stadium seat and an elevated view of the court rather than generally unreserved outside-court seating.";
    }
  } else {
    first = `${name(o)} is your strongest match for ${occ} in Grandstand’s intimate stadium setting.`;
    second = "Its reserved Courtside seating puts the focus on watching tennis up close.";
  }

  const mm = mismatch(p, o);
  if (mm) return [first, second, mm].join(" ");

  let last: string;
  if (v === "Grounds Admission") {
    last = "An appealing choice if variety and the freedom to move between courts matter most.";
  } else if (p.q5 === "balanced_view" && o.seatingLabel === "Loge") {
    last = "An excellent choice if you enjoy following the patterns of play from a broader perspective.";
  } else if (p.q5 === "close_to_action" && o.seatingLabel.includes("Courtside")) {
    last = "A compelling choice if proximity to the action is your priority.";
  } else if (p.q4 === "Night" && o.sessionCode === "Night") {
    last = "An appealing choice if the atmosphere of an evening tennis session matters to you.";
  } else if (p.q1 === "big_stadium" && v === "Arthur Ashe") {
    last = "An appealing choice if the scale and atmosphere of the main stadium are central to your visit.";
  } else if (o.seatingLabel === "Promenade") {
    last = "A strong choice if the stadium occasion matters more than sitting close to the court.";
  } else {
    last = "A rewarding choice for enjoying the match from a dedicated stadium seat.";
  }
  return [first, second, last].join(" ");
}

// ── Ported from v8 itself (NOT v6): alternative(p,o,h) ──
//
// IMPORTANT: v8's import line is
//   `from USO27_Phase4_Explanation_Engine_v6 import ...,hero as base_hero,...`
// — it imports v6's `hero` (aliased), but NOT v6's `alternative`. v8
// defines and uses its OWN `alternative(p,o,h)` (lines 26-101 of
// USO27_Phase4_Explanation_Engine_v8.py), a different function from v6's
// same-named one. render()'s fallback calls `alternative(p,o,oo[0])` using
// v8's own module-local definition. An earlier pass of this port mistakenly
// used v6's `alternative()` instead — caught 28 Oct 2026 when the ported
// fallback scored 0/374 against the handoff's own 187-contrasting-profile
// audit (USO27_Phase4_Closure_187_Contrast_Audit.csv), which was generated
// from the real frozen renderer. This is the corrected port, from v8's own
// alternative(), verified to reproduce that audit file exactly (see
// scripts/_verify-us-open-187-contrast-audit.mjs).
function alternative(p: NormalizedProfile, o: TicketOption, h: TicketOption): string {
  const v = venue(o);
  const hv = venue(h);
  const d = cost(o, h);

  let first: string;
  if (v === "Grounds Admission") {
    first = `${name(o)} offers the freedom to explore tennis across the outside courts, with generally unreserved seating rather than a reserved stadium seat.`;
  } else if (hv === "Grounds Admission") {
    first = `${name(o)} offers ${view(o)} in ${setting(o)}, instead of generally unreserved outside-court exploration.`;
  } else if (v === hv) {
    first = `${name(o)} offers ${view(o)} in ${setting(o)}.`;
  } else {
    first = `${name(o)} offers ${view(o)} in ${setting(o)}, rather than ${setting(h)}.`;
  }

  const contrasts: string[] = [];
  if (v !== "Grounds Admission" && hv !== "Grounds Admission") {
    if (occasion(o) !== occasion(h)) {
      contrasts.push(`${occasion(o)} instead of ${occasion(h)}`);
    } else if (o.stageCode !== h.stageCode) {
      contrasts.push(`the ${stage(o)} rather than the ${stage(h)}`);
    }
    if (o.sessionCode !== h.sessionCode) {
      contrasts.push(`a ${(o.sessionCode ?? "").toLowerCase()} session instead of a ${(h.sessionCode ?? "").toLowerCase()} session`);
    }
    if (v === hv && o.seatingLabel !== h.seatingLabel && contrasts.length === 0) {
      contrasts.push(`${view(o)} rather than ${view(h)}`);
    }
  } else if (o.stageCode !== h.stageCode) {
    contrasts.push(`the ${stage(o)} rather than the ${stage(h)}`);
  }

  let second: string;
  if (contrasts.length > 0) {
    second = "The main distinction is " + contrasts.slice(0, 2).join(", with ") + ".";
  } else if (v === "Grounds Admission" || hv === "Grounds Admission") {
    second = "The trade-off is between exploring outside courts and following a session from a reserved stadium seat.";
  } else if (v !== hv) {
    second = "The stadium setting changes the balance between atmosphere and proximity to the court.";
  } else {
    second = "The seating choice changes how close you are to the action and how broadly you can follow the rallies.";
  }
  if (d !== "similarly priced") {
    second = second.slice(0, -1) + `; it is ${d} than the leading option.`;
  }

  let advice: string;
  if (p.q2StageCode === o.stageCode && p.q2StageCode !== h.stageCode) {
    advice = `Choose it if attending your preferred ${stage(o)} matters more than the leading option’s other advantages.`;
  } else if (p.q4 !== "Either" && p.q4 === o.sessionCode && o.sessionCode !== h.sessionCode) {
    advice = `Choose it if a ${(o.sessionCode ?? "").toLowerCase()} session is important to your visit.`;
  } else if (p.q4 !== "Either" && p.q4 === h.sessionCode && o.sessionCode !== h.sessionCode) {
    advice = `Consider it if the ${(o.sessionCode ?? "").toLowerCase()} session still appeals despite your preference for ${p.q4.toLowerCase()} tennis.`;
  } else if (v === "Grounds Admission" && (p.q3 === "exploring" || p.q3 === "mix")) {
    advice = "Choose it if the freedom to discover different matches matters more than a reserved stadium seat.";
  } else if (hv === "Grounds Admission" && p.q3 === "reserved") {
    advice = "Choose it if a reserved stadium seat is your priority.";
  } else if (p.q5 === "balanced_view" && o.seatingLabel === "Loge") {
    advice = "Choose it if an elevated, balanced perspective helps you follow the patterns of play.";
  } else if (p.q5 === "close_to_action" && o.seatingLabel.includes("Courtside")) {
    advice = "Choose it if being close to the court matters most to you.";
  } else if (p.q5 === "flexible_explore" && v === "Grounds Admission") {
    advice = "Choose it if exploring several courts is more appealing than staying in one stadium.";
  } else if (p.q1 === "big_stadium" && v === "Arthur Ashe" && hv !== "Arthur Ashe") {
    advice = "Choose it if the scale and atmosphere of Arthur Ashe are central to your visit.";
  } else if (p.q1 === "close_up_courts" && v === "Grandstand") {
    advice = `Choose it if Grandstand’s more intimate setting suits your preferred tennis experience.`;
  } else if (p.q6 === "value_focused" && d === "less expensive") {
    advice = `Consider it if the lower cost outweighs the leading option’s other advantages.`;
  } else if (p.q6 === "premium" && o.seatingLabel.includes("Courtside")) {
    advice = "Consider it if a premium close-to-court experience is your priority.";
  } else if (occasion(o).includes("championship final") && !occasion(h).includes("championship final")) {
    advice = "Choose it if experiencing a championship final matters most.";
  } else if (occasion(o).includes("semifinal") && !occasion(h).includes("semifinal")) {
    advice = "Choose it if a Grand Slam semifinal is the occasion you most want.";
  } else if (v === "Grounds Admission") {
    advice = "Consider it if variety across the outside courts matters more than a reserved stadium session.";
  } else if (o.seatingLabel === "Loge") {
    advice = "Consider it if an elevated view is more appealing than sitting close to the court.";
  } else if (o.seatingLabel.includes("Courtside")) {
    advice = "Consider it if watching tennis up close is your priority.";
  } else if (o.seatingLabel === "Promenade") {
    advice = "Consider it if the main-stadium occasion matters more than proximity to the court.";
  } else {
    advice = "Consider it if this stadium experience better suits your priorities.";
  }

  return [first, second, advice].join(" ");
}

// ── Profile normalization ──
//
// v6/v8's `p` dict uses stage_code-shaped values for q2 ("Early"/"Middle"/
// "Late", matching the engine's internal stage_code — the 16 reference
// profiles' own q2 column confirms this, e.g. "Late"), "Either"/"Day"/
// "Night" (capitalized) for q4, and the SOURCE CSV's own q5 spelling
// ("close_to_action"/"balanced_view"/"no_preference"/"flexible_explore") —
// NOT the app's QuizAnswers spelling for any of these three
// ("early"/"middle"/"later" for q2; "day"/"night"/"either" for q4;
// "clear_balanced_view"/"flexible" for q5, which differ from the source
// data's own column values for the same two answers). Caught 28 Oct 2026
// by diffing this port's fallback output against
// USO27_Phase4_FinalGate_48_Reference_Review.csv's historical `generated`
// column (3/32 alternative-role mismatches, all traced to q5 being passed
// through unmapped) — fixed by adding Q5_TO_SOURCE_SPELLING below, same
// pattern as the existing Q2/Q4 maps. This normalizes the app's
// QuizAnswers into the shape v6's ported functions expect, so the ported
// functions' string literals can stay byte-identical to the Python source
// instead of each needing its own re-spelled copy.
interface NormalizedProfile {
  q1: QuizAnswers["q1"];
  q2StageCode: TicketOption["stageCode"];
  q3: QuizAnswers["q3"];
  q4: "Day" | "Night" | "Either";
  q5: "close_to_action" | "balanced_view" | "no_preference" | "flexible_explore";
  q6: QuizAnswers["q6"];
  dateMode: "fixed" | "adjustable" | "flexible";
}

const Q2_TO_STAGE_CODE: Record<QuizAnswers["q2"], TicketOption["stageCode"]> = {
  early: "Early",
  middle: "Middle",
  later: "Late",
};
const Q4_TO_SESSION_LABEL: Record<QuizAnswers["q4"], "Day" | "Night" | "Either"> = {
  day: "Day",
  night: "Night",
  either: "Either",
};
const Q5_TO_SOURCE_SPELLING: Record<QuizAnswers["q5"], NormalizedProfile["q5"]> = {
  close_to_action: "close_to_action",
  clear_balanced_view: "balanced_view",
  no_preference: "no_preference",
  flexible: "flexible_explore",
};

function normalizeProfile(answers: QuizAnswers): NormalizedProfile {
  return {
    q1: answers.q1,
    q2StageCode: Q2_TO_STAGE_CODE[answers.q2],
    q3: answers.q3,
    q4: Q4_TO_SESSION_LABEL[answers.q4],
    q5: Q5_TO_SOURCE_SPELLING[answers.q5],
    q6: answers.q6,
    dateMode: answers.q7 === "flexible_tournament" ? "flexible" : answers.q7,
  };
}

// Test-only direct access to the ported v6 functions, bypassing the
// reference-catalogue lookup — used by
// scripts/_verify-us-open-explanation-port.mjs to verify the fallback
// path against USO27_Phase4_FinalGate_48_Reference_Review.csv's historical
// generated output even for profiles that ARE one of the 16 reference
// triplets (which selectUsOpenExplanations would otherwise always resolve
// via the catalogue, never reaching this code). Not used by any app route.
export const __testOnly = { hero, alternative, normalizeProfile };

// ── Exact-reference lookup (16 profiles, 48 passages) ──

function dateModeFor(q7: QuizAnswers["q7"]): string {
  return q7 === "flexible_tournament" ? "flexible" : q7;
}

// The catalogue's keys are built (by
// scripts/_build-us-open-explanation-catalogue.mjs) directly from the
// source CSV's own q2/q4/q5 spellings, which differ from QuizAnswers'
// spellings exactly like NormalizedProfile above (q2 as a stage code
// "Early"/"Middle"/"Late"; q4 capitalized "Day"/"Night"/"Either"; q5 as
// "close_to_action"/"balanced_view"/"no_preference"/"flexible_explore").
// Caught 28 Oct 2026 alongside the NormalizedProfile q5 bug (same root
// cause: an unmapped field silently never matching) — reuses the exact
// same Q2_TO_STAGE_CODE/Q4_TO_SESSION_LABEL/Q5_TO_SOURCE_SPELLING maps so
// there is only one source of truth for this translation, not two
// separately-maintained copies that could drift out of sync again.
function lookupKey(answers: QuizAnswers, heroId: number, alt1Id: number, alt2Id: number): string {
  const dateMode = dateModeFor(answers.q7);
  const date = dateMode === "flexible" ? "" : answers.fromDate ?? "";
  const q2 = Q2_TO_STAGE_CODE[answers.q2];
  const q4 = Q4_TO_SESSION_LABEL[answers.q4];
  const q5 = Q5_TO_SOURCE_SPELLING[answers.q5];
  return [answers.q1, q2, answers.q3, q4, q5, answers.q6, dateMode, date, heroId, alt1Id, alt2Id].join("|");
}

export interface UsOpenExplanationResult extends Rationale {
  // "reference" = one of the 16 individually founder-approved passages.
  // "generalized" = the ported v6 hero()/alternative() fallback — frozen
  // implementation baseline, not individually founder-approved (see
  // this file's header comment).
  source: "reference" | "generalized";
}

// render(): mirrors v8's own dispatch order exactly — reference_map()
// lookup first, generative hero()/alternative() fallback second. Unlike
// v8's Python render() (which raises ValueError for a reserved-only
// profile containing Grounds Admission), this never receives such a
// profile in practice: scoreTennisOptions.ts's passesHardFilters() already
// excludes Grounds Admission (arenaCode "GP") whenever q3 === "reserved"
// before results ever reach this module — so that guard is structural
// upstream, not re-implemented here.
export function selectUsOpenExplanations(
  answers: QuizAnswers,
  hero_: ScoredOption,
  alternative1: ScoredOption | null,
  alternative2: ScoredOption | null
): {
  hero: UsOpenExplanationResult;
  alternative1: UsOpenExplanationResult | null;
  alternative2: UsOpenExplanationResult | null;
} {
  const heroId = hero_.option.optionNumber;
  const alt1Id = alternative1?.option.optionNumber ?? null;
  const alt2Id = alternative2?.option.optionNumber ?? null;

  // Exact-reference path.
  if (alt1Id !== null && alt2Id !== null) {
    const key = lookupKey(answers, heroId, alt1Id, alt2Id);
    const entry = CATALOGUE.entries[key];
    if (entry) {
      const [, , , heroTextIdx, alt1TextIdx, alt2TextIdx] = entry;
      const mk = (idx: number): UsOpenExplanationResult => ({
        text: CATALOGUE.strings[idx],
        evidence: { signalKeys: [], sentenceTwoOmitted: false, rule: "us-open-approved-reference-lookup" },
        source: "reference",
      });
      return { hero: mk(heroTextIdx), alternative1: mk(alt1TextIdx), alternative2: mk(alt2TextIdx) };
    }
  }

  // Generalized fallback path (ported v6 hero()/alternative()).
  const p = normalizeProfile(answers);
  const alternatives = [alternative1, alternative2].filter((a): a is ScoredOption => a !== null).map((a) => a.option);

  const heroText = hero(p, hero_.option, alternatives);
  const mk = (text: string): UsOpenExplanationResult => ({
    text,
    evidence: { signalKeys: [], sentenceTwoOmitted: false, rule: "us-open-generalized-fallback-not-individually-approved" },
    source: "generalized",
  });

  return {
    hero: mk(heroText),
    alternative1: alternative1 ? mk(alternative(p, alternative1.option, hero_.option)) : null,
    alternative2: alternative2 ? mk(alternative(p, alternative2.option, hero_.option)) : null,
  };
}
