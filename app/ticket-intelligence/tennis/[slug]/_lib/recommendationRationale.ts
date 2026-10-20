import type { QuizAnswers, ScoredOption, TicketOption } from "./types";

// Deterministic recommendation-rationale presentation layer — founder
// specification, 20 Oct 2026. Presentation-only: reads existing
// QuizAnswers/ScoredOption/contributions, writes no scoring/ranking
// values. Fully separate from scoreTennisOptions.ts, selectExplanation.ts,
// and reconstructedLanguageCatalogue.json — none of those files are
// imported or modified here. Every rule below was checked against the
// real 43-option data (scripts/_tennis-options-source.json) before being
// implemented — see completion report for the verification pass.

type SignalKey = "q2" | "q4" | "q3" | "q5" | "q1";
interface Signal {
  key: SignalKey;
  text: string;
}

function zoneKey(option: TicketOption): string {
  return option.arenaCode === "GP" ? "GP_GP" : `${option.arenaCode}_${option.seatingCode}`;
}

const CLOSE_TO_ACTION_ZONES = new Set(["RLA_LB", "RLA_LS", "MCA_LB", "MCA_LS"]);
const CLEAR_BALANCED_ZONES = new Set(["RLA_UB", "RLA_LB", "RLA_US", "RLA_LS", "MCA_U", "MCA_LB", "MCA_LS", "JCA_RS"]);

function q2Signal(answers: QuizAnswers, option: TicketOption): Signal | null {
  if (answers.q2 === "early" && option.stageCode === "Early") return { key: "q2", text: "opening-round tennis" };
  if (answers.q2 === "middle" && option.stageCode === "Middle")
    return { key: "q2", text: "fourth-round and quarterfinal tennis" };
  if (answers.q2 === "later" && option.stageCode === "Late") return { key: "q2", text: "the semifinals and finals" };
  return null;
}

function q4Signal(answers: QuizAnswers, option: TicketOption): Signal | null {
  if (answers.q4 === "day" && option.sessionCode === "Day") return { key: "q4", text: "daytime tennis" };
  if (answers.q4 === "night" && option.sessionCode === "Night") return { key: "q4", text: "an evening session" };
  return null;
}

function q3Signal(answers: QuizAnswers, option: TicketOption): Signal | null {
  const isGP = option.arenaCode === "GP";
  if (answers.q3 === "reserved" && !isGP) return { key: "q3", text: "a reserved arena seat" };
  if (answers.q3 === "exploring" && isGP) return { key: "q3", text: "the freedom to explore outside courts" };
  if (answers.q3 === "mix" && !isGP)
    return { key: "q3", text: "a reserved arena seat alongside opportunities to explore eligible areas of the grounds" };
  if (answers.q3 === "mix" && isGP) return { key: "q3", text: "the flexibility to explore eligible outside courts" };
  return null;
}

function q5Signal(answers: QuizAnswers, option: TicketOption): Signal | null {
  const zone = zoneKey(option);
  if (answers.q5 === "close_to_action" && CLOSE_TO_ACTION_ZONES.has(zone))
    return { key: "q5", text: "a closer court perspective" };
  if (answers.q5 === "clear_balanced_view" && CLEAR_BALANCED_ZONES.has(zone))
    return { key: "q5", text: "a court-viewing perspective suited to your preference for a clear, balanced view" };
  if (answers.q5 === "flexible" && option.arenaCode === "GP")
    return { key: "q5", text: "the flexibility to move between eligible courts" };
  // q5=no_preference deliberately produces no signal, per spec.
  return null;
}

function q1Signal(answers: QuizAnswers, option: TicketOption): Signal | null {
  if (answers.q1 === "big_stadium" && option.arenaCode === "RLA")
    return { key: "q1", text: "a flagship big-stadium atmosphere" };
  if (answers.q1 === "big_stadium" && option.arenaCode === "MCA")
    return { key: "q1", text: "a substantial show-court atmosphere" };
  if (answers.q1 === "close_up_courts" && option.arenaCode === "GP")
    return { key: "q1", text: "tennis across the outside courts" };
  if (answers.q1 === "close_up_courts" && option.arenaCode === "JCA")
    return { key: "q1", text: "a more intimate arena setting" };
  if (answers.q1 === "balance" && (option.arenaCode === "MCA" || option.arenaCode === "JCA"))
    return { key: "q1", text: "a balance of arena atmosphere and tennis" };
  if (answers.q1 === "lots_of_tennis" && option.stageCode === "Early")
    return { key: "q1", text: "the opportunity to experience the opening rounds" };
  return null;
}

function collectSignals(answers: QuizAnswers, option: TicketOption): Signal[] {
  const candidates = [q2Signal(answers, option), q4Signal(answers, option), q3Signal(answers, option), q5Signal(answers, option), q1Signal(answers, option)].filter(
    (s): s is Signal => s !== null
  );

  // Fixed priority order: Q2, Q4, Q3, Q5, Q1 — candidates array above is
  // already in that order. Exception: q1=big_stadium + arena=RLA moves to
  // first position.
  const rlaFlagshipIndex = candidates.findIndex((s) => s.key === "q1" && answers.q1 === "big_stadium" && option.arenaCode === "RLA");
  if (rlaFlagshipIndex > 0) {
    const [signal] = candidates.splice(rlaFlagshipIndex, 1);
    candidates.unshift(signal);
  }

  return candidates.slice(0, 2);
}

function sentenceOne(signals: Signal[]): string {
  if (signals.length === 2) return `A strong fit if you're looking for ${signals[0].text} and ${signals[1].text}.`;
  if (signals.length === 1) return `A strong fit if you're looking for ${signals[0].text}.`;
  return "This recommendation brings together the strongest overall fit across your selected preferences.";
}

const ARENA_CONTEXT_SENTENCE: Record<TicketOption["arenaCode"], string> = {
  RLA: "Rod Laver Arena provides the tournament's flagship stadium setting.",
  MCA: "Margaret Court Arena offers a substantial show-court experience.",
  JCA: "John Cain Arena offers a lively, more intimate arena setting.",
  GP: "A Ground Pass provides flexibility across eligible outside courts rather than a reserved arena seat.",
};

// Substring checks used to decide whether sentence 1 already carries
// substantially the same arena-specific phrase as sentence 2, per spec
// section 3 ("If Sentence 1 already contains substantially the same
// arena-specific phrase, omit Sentence 2"). Scoped to RLA only — the
// spec's own worked Example B is the sole case that demonstrates this
// omission (Q1=big_stadium's "a flagship big-stadium atmosphere" is
// near-verbatim RLA's own sentence-2 "flagship stadium setting"). Example
// C demonstrates the opposite for GP: Q3's "the freedom to explore
// outside courts" and GP's sentence-2 wording are topically related but
// NOT treated as overlapping — both sentences are kept. No worked example
// exists for MCA/JCA overlap, so neither is included here rather than
// guessed at; if a future case needs it, extend this list against a real
// verified example, not assumption.
const ARENA_PHRASE_OVERLAP: Partial<Record<TicketOption["arenaCode"], string[]>> = {
  RLA: ["flagship big-stadium atmosphere"],
};

export interface Rationale {
  text: string;
  evidence: { signalKeys: SignalKey[]; sentenceTwoOmitted: boolean; rule: string };
}

export function heroRationale(answers: QuizAnswers, hero: ScoredOption): Rationale {
  const signals = collectSignals(answers, hero.option);
  const s1 = sentenceOne(signals);

  const overlapPhrases = ARENA_PHRASE_OVERLAP[hero.option.arenaCode] ?? [];
  const omitSentenceTwo = overlapPhrases.some((p) => s1.includes(p));
  const s2 = ARENA_CONTEXT_SENTENCE[hero.option.arenaCode];

  return {
    text: omitSentenceTwo ? s1 : `${s1} ${s2}`,
    evidence: {
      signalKeys: signals.map((s) => s.key),
      sentenceTwoOmitted: omitSentenceTwo,
      rule: signals.length === 2 ? "two-signal" : signals.length === 1 ? "one-signal" : "zero-signal-fallback",
    },
  };
}

// ── Alternative rationale ─────────────────────────────────────────────

const STAGE_LABEL: Record<TicketOption["stageCode"], string> = {
  Early: "the opening rounds",
  Middle: "the fourth-round and quarterfinal period",
  Late: "the semifinals and finals",
};
// "middle rounds" used only in the Middle->Late sentence per spec's exact
// wording (section 5C lists "the middle rounds" there, not "the
// fourth-round and quarterfinal period" as elsewhere) — preserved exactly
// as specified rather than normalized, since the spec gives exact text.
const STAGE_PAIR_SENTENCE: Record<string, string> = {
  "Early->Middle":
    "You keep the same arena and session type, but move from the opening rounds to the fourth-round and quarterfinal period.",
  "Middle->Early":
    "You keep the same arena and session type, but move from the fourth-round and quarterfinal period to the opening rounds.",
  "Middle->Late": "You keep the same arena and session type, but move from the middle rounds to the semifinals and finals.",
  "Late->Middle": "You keep the same arena and session type, but move from the semifinals and finals to the middle rounds.",
  "Early->Late": "You keep the same arena and session type, but move from the opening rounds to the semifinals and finals.",
  "Late->Early": "You keep the same arena and session type, but move from the semifinals and finals to the opening rounds.",
};

const CROSS_ARENA_SENTENCE: Record<string, string> = {
  "JCA->MCA":
    "Margaret Court Arena offers a different show-court experience, with seating perspectives that vary by the selected ticket option.",
  "JCA->RLA": "Rod Laver offers the tournament's flagship big-stadium atmosphere, compared with John Cain's more intimate arena setting.",
  "RLA->MCA": "Margaret Court Arena offers a more contained show-court setting than Rod Laver.",
  "MCA->RLA": "Rod Laver offers the tournament's flagship big-stadium atmosphere, compared with Margaret Court's more contained setting.",
  "RLA->JCA": "John Cain offers a more intimate arena setting than Rod Laver's flagship stadium atmosphere.",
  "MCA->JCA": "John Cain offers a lively arena experience, with the precise seating perspective dependent on the ticket available.",
};

export function alternativeRationale(hero: ScoredOption, alt: ScoredOption): Rationale {
  const h = hero.option;
  const a = alt.option;
  const sameArena = h.arenaCode === a.arenaCode;
  const sameStage = h.stageCode === a.stageCode;
  const sameSession = h.sessionCode === a.sessionCode;

  // Section 6 — exact overrides for JCA(hero)->MCA(alt), same
  // Early/Night, specific seating codes. Checked first, before the
  // general cross-arena rule, per spec: "These two exact sentences
  // override the generic JCA->MCA comparison whenever the corresponding
  // seating attributes and stage/session matches are present."
  if (
    h.arenaCode === "JCA" &&
    a.arenaCode === "MCA" &&
    h.stageCode === "Early" &&
    a.stageCode === "Early" &&
    h.sessionCode === "Night" &&
    a.sessionCode === "Night"
  ) {
    if (a.seatingCode === "LS") {
      return {
        text: "You retain the opening-round night-session experience, with the added appeal of a closer, side-on view of the court.",
        evidence: { signalKeys: [], sentenceTwoOmitted: false, rule: "section6-override-LS" },
      };
    }
    if (a.seatingCode === "LB") {
      return {
        text: "You retain the opening-round night-session experience, but enjoy a closer perspective from behind the baseline.",
        evidence: { signalKeys: [], sentenceTwoOmitted: false, rule: "section6-override-LB" },
      };
    }
  }

  // D — Ground Pass vs reserved (checked before A/B/C/E since GP has no
  // seating/session comparability with a reserved arena).
  if (h.arenaCode === "GP" && a.arenaCode !== "GP") {
    return {
      text: "This alternative offers a reserved arena seat instead of the flexibility of a Ground Pass.",
      evidence: { signalKeys: [], sentenceTwoOmitted: false, rule: "D-reserved-vs-GP" },
    };
  }
  if (h.arenaCode !== "GP" && a.arenaCode === "GP") {
    return {
      text: "This alternative prioritizes movement between eligible outside courts rather than a reserved arena seat.",
      evidence: { signalKeys: [], sentenceTwoOmitted: false, rule: "D-GP-vs-reserved" },
    };
  }

  // A — same arena, stage, session; seating differs.
  if (sameArena && sameStage && sameSession && h.seatingCode !== a.seatingCode) {
    if (a.seatingCode === "LB" && h.seatingCode === "UB") {
      return {
        text: "This option moves you closer to the court while retaining a behind-the-baseline perspective.",
        evidence: { signalKeys: [], sentenceTwoOmitted: false, rule: "A-LB-from-UB" },
      };
    }
    if (a.seatingCode === "UB" && h.seatingCode === "LB") {
      return {
        text: "This option offers a more elevated view from behind the baseline.",
        evidence: { signalKeys: [], sentenceTwoOmitted: false, rule: "A-UB-from-LB" },
      };
    }
    const altIsBaseline = a.seatingCode.includes("B");
    const altIsSideline = a.seatingCode.includes("S") && !a.seatingCode.includes("B");
    const heroIsBaseline = h.seatingCode.includes("B");
    const heroIsSideline = h.seatingCode.includes("S") && !h.seatingCode.includes("B");
    if ((altIsBaseline && heroIsSideline) || (altIsSideline && heroIsBaseline)) {
      if (altIsBaseline) {
        return {
          text: "The main difference is your viewing angle: this option looks from behind the baseline rather than from the sideline.",
          evidence: { signalKeys: [], sentenceTwoOmitted: false, rule: "A-baseline-vs-sideline" },
        };
      }
      return {
        text: "The main difference is your viewing angle: this option offers a side-on perspective rather than a view from behind the baseline.",
        evidence: { signalKeys: [], sentenceTwoOmitted: false, rule: "A-sideline-vs-baseline" },
      };
    }
    // F — same arena/stage/session, no distinguishing seating rule
    // matched (e.g. MCA's "U" upper code has no baseline/sideline
    // counterpart in this spec's A-rules).
    return {
      text: "These options offer closely comparable experiences, with no major difference in the listed viewing characteristics.",
      evidence: { signalKeys: [], sentenceTwoOmitted: false, rule: "F-equivalent" },
    };
  }

  // B — same arena and stage, session differs.
  if (sameArena && sameStage && !sameSession) {
    if (a.sessionCode === "Day" && h.sessionCode === "Night") {
      return {
        text: "You keep the same arena and tournament stage, but switch from an evening session to daytime tennis.",
        evidence: { signalKeys: [], sentenceTwoOmitted: false, rule: "B-day-from-night" },
      };
    }
    if (a.sessionCode === "Night" && h.sessionCode === "Day") {
      return {
        text: "You keep the same arena and tournament stage, but switch from daytime tennis to an evening session.",
        evidence: { signalKeys: [], sentenceTwoOmitted: false, rule: "B-night-from-day" },
      };
    }
  }

  // C — same arena and session, stage differs.
  if (sameArena && sameSession && !sameStage) {
    const pairKey = `${h.stageCode}->${a.stageCode}`;
    const sentence = STAGE_PAIR_SENTENCE[pairKey];
    if (sentence) {
      return { text: sentence, evidence: { signalKeys: [], sentenceTwoOmitted: false, rule: `C-${pairKey}` } };
    }
  }

  // E — different arenas, explicit supported comparisons.
  if (!sameArena) {
    const pairKey = `${h.arenaCode}->${a.arenaCode}`;
    const sentence = CROSS_ARENA_SENTENCE[pairKey];
    if (sentence) {
      return { text: sentence, evidence: { signalKeys: [], sentenceTwoOmitted: false, rule: `E-${pairKey}` } };
    }
  }

  // No rule matched (e.g. same arena/session/stage AND same seating —
  // genuinely identical options, which the frozen tie-break can still
  // rank distinctly). Falls back to F's equivalence statement rather
  // than inventing a difference.
  return {
    text: "These options offer closely comparable experiences, with no major difference in the listed viewing characteristics.",
    evidence: { signalKeys: [], sentenceTwoOmitted: false, rule: "F-fallback-no-rule-matched" },
  };
}
