import type { TicketOption } from "./types";

// Headline-only display override, added 25 Oct 2026 per founder direction.
// sporting_events.name for Wimbledon is the full official name ("The
// Championships, Wimbledon 2027") — correct and unchanged everywhere else
// on the site (event pack, homepage, nav, this page's own back-link and
// ResultCard identity line). Only the quiz title ("Which ... ticket fits
// you?") and the results-page headline ("Your ... match") use this
// shorter form instead, scoped to Tennis Ticket Intelligence's own two
// headline call sites — never a sporting_events.name rename.
export function ticketIntelligenceHeadlineEventName(eventSlug: string, eventName: string): string {
  if (eventSlug === "wimbledon") return "Wimbledon 2027";
  return eventName;
}

// Deterministic fan-facing presentation mappings — results-page design
// spec, 20 Oct 2026. Pure data transforms, no scoring/eligibility/
// explanation-selection logic here. Validated against every real
// arena_code/seating_code combination in the 43-option catalogue before
// writing this file (9 distinct combinations found, all covered below —
// see completion report).

export function stageExplanation(stageCode: TicketOption["stageCode"]): { value: string; explanation: string } {
  switch (stageCode) {
    case "Early":
      return {
        value: "Opening rounds",
        explanation: "Rounds 1–3, when more players remain in the draw and many matches are scheduled.",
      };
    case "Middle":
      return {
        value: "Middle rounds",
        explanation: "Fourth-round and quarterfinal tennis, as the tournament moves toward its concluding stages.",
      };
    case "Late":
      return {
        value: "Final rounds",
        explanation: "Semifinals and finals, when the tournament reaches its highest-stakes matches.",
      };
  }
}

export function sessionExplanation(sessionCode: TicketOption["sessionCode"]): { value: string; explanation: string } | null {
  if (sessionCode === "Night") {
    return { value: "Night session", explanation: "An evening ticketed session, with tennis played under the arena lights." };
  }
  if (sessionCode === "Day") {
    return { value: "Day session", explanation: "Daytime tennis during the tournament's scheduled day session." };
  }
  return null; // Ground Pass — no fixed session, handled separately in the card
}

// Wimbledon-only presentation override, added 25 Oct 2026 (P1 fix). All 22
// non-Ground-Pass Wimbledon options have sessionCode=null — correct for
// scoring (Wimbledon doesn't sell separate day/night session tickets, so
// Q4 stays neutral; see Q4-neutrality smoke tests), but sessionExplanation()
// returning null for that reason meant ResultCard.tsx's null-check wrongly
// inferred "this must be Ground Pass" and showed Ground Pass wording on
// every reserved Wimbledon court. Fixed by keying off arenaCode === "GP"
// directly everywhere else in this file. value label matches AO/French
// Open's real "Day session" wording exactly (sessionExplanation() above),
// per founder direction — but the explanation line is deliberately NOT
// copied verbatim from there: that sentence ("the tournament's scheduled
// day session") is true for AO/French Open because they sell day session
// as a distinct ticketed product; Wimbledon doesn't sell a session product
// at all, so asserting that would invent a guarantee Wimbledon's ticketing
// model doesn't make. Does not touch sessionCode, scoring, or Q4
// neutrality — presentation only.
export function wimbledonDaySessionExplanation(): { value: string; explanation: string } {
  return {
    value: "Day session",
    explanation: "Wimbledon schedules play during the day, with no separate ticketed night session.",
  };
}

// Keyed by `${arenaCode}_${seatingCode}` except Ground Pass. Every key here
// was verified present in scripts/_tennis-options-source.json — 9 distinct
// combinations, all 9 covered, zero unmapped values found.
//
// French Open entries (PC/SL/SM/C14) added 22 Oct 2026 — same purely
// structural, factual-only register as the existing AO entries above:
// court name + seating category + orientation only, no subjective claims
// (no "better view"/"premium"/"closer atmosphere" language), per founder
// approval. seatingCode scheme: `${CATEGORY}_${BL|SL}` where CATEGORY is
// GOLD/C1/C2/C3 (Philippe-Chatrier, Suzanne-Lenglen) or C1 only
// (Simonne-Mathieu, Court 14 — their one reserved category in the approved
// workbook). Every key below was verified against the approved parameter
// workbook's Court/Category/Orientation columns (20 distinct French Open
// seating combinations across 4 courts, all covered).
const SEATING_MAP: Record<string, { value: string; explanation: string }> = {
  JCA_RS: {
    value: "Reserved arena seat",
    explanation: "A designated seat in John Cain Arena. The precise seating area depends on the ticket available.",
  },
  MCA_U: {
    value: "Upper-level seating",
    explanation: "An elevated seating perspective overlooking the court.",
  },
  MCA_LS: {
    value: "Lower-level sideline seating",
    explanation: "A closer, side-on perspective of the court.",
  },
  MCA_LB: {
    value: "Lower-level baseline seating",
    explanation: "A closer view from behind the baseline.",
  },
  RLA_UB: {
    value: "Upper-level baseline seating",
    explanation: "An elevated view from behind the baseline.",
  },
  RLA_US: {
    value: "Upper-level sideline seating",
    explanation: "An elevated, side-on perspective of the court.",
  },
  RLA_LB: {
    value: "Lower-level baseline seating",
    explanation: "A closer view from behind the baseline.",
  },
  RLA_LS: {
    value: "Lower-level sideline seating",
    explanation: "A closer, side-on perspective of the court.",
  },
  PC_GOLD_BL: {
    value: "Gold category, baseline seat",
    explanation: "A reserved seat at Court Philippe-Chatrier, Gold category, in the baseline section.",
  },
  PC_GOLD_SL: {
    value: "Gold category, sideline seat",
    explanation: "A reserved seat at Court Philippe-Chatrier, Gold category, in the sideline section.",
  },
  PC_C1_BL: {
    value: "Category 1, baseline seat",
    explanation: "A reserved seat at Court Philippe-Chatrier, Category 1, in the baseline section.",
  },
  PC_C1_SL: {
    value: "Category 1, sideline seat",
    explanation: "A reserved seat at Court Philippe-Chatrier, Category 1, in the sideline section.",
  },
  PC_C2_BL: {
    value: "Category 2, baseline seat",
    explanation: "A reserved seat at Court Philippe-Chatrier, Category 2, in the baseline section.",
  },
  PC_C2_SL: {
    value: "Category 2, sideline seat",
    explanation: "A reserved seat at Court Philippe-Chatrier, Category 2, in the sideline section.",
  },
  PC_C3_BL: {
    value: "Category 3, baseline seat",
    explanation: "A reserved seat at Court Philippe-Chatrier, Category 3, in the baseline section.",
  },
  PC_C3_SL: {
    value: "Category 3, sideline seat",
    explanation: "A reserved seat at Court Philippe-Chatrier, Category 3, in the sideline section.",
  },
  SL_GOLD_BL: {
    value: "Gold category, baseline seat",
    explanation: "A reserved seat at Court Suzanne-Lenglen, Gold category, in the baseline section.",
  },
  SL_GOLD_SL: {
    value: "Gold category, sideline seat",
    explanation: "A reserved seat at Court Suzanne-Lenglen, Gold category, in the sideline section.",
  },
  SL_C1_BL: {
    value: "Category 1, baseline seat",
    explanation: "A reserved seat at Court Suzanne-Lenglen, Category 1, in the baseline section.",
  },
  SL_C1_SL: {
    value: "Category 1, sideline seat",
    explanation: "A reserved seat at Court Suzanne-Lenglen, Category 1, in the sideline section.",
  },
  SL_C2_BL: {
    value: "Category 2, baseline seat",
    explanation: "A reserved seat at Court Suzanne-Lenglen, Category 2, in the baseline section.",
  },
  SL_C2_SL: {
    value: "Category 2, sideline seat",
    explanation: "A reserved seat at Court Suzanne-Lenglen, Category 2, in the sideline section.",
  },
  SL_C3_BL: {
    value: "Category 3, baseline seat",
    explanation: "A reserved seat at Court Suzanne-Lenglen, Category 3, in the baseline section.",
  },
  SL_C3_SL: {
    value: "Category 3, sideline seat",
    explanation: "A reserved seat at Court Suzanne-Lenglen, Category 3, in the sideline section.",
  },
  SM_C1_BL: {
    value: "Category 1, baseline seat",
    explanation: "A reserved seat at Court Simonne-Mathieu, in the baseline section.",
  },
  SM_C1_SL: {
    value: "Category 1, sideline seat",
    explanation: "A reserved seat at Court Simonne-Mathieu, in the sideline section.",
  },
  C14_C1_BL: {
    value: "Category 1, baseline seat",
    explanation: "A reserved seat at Court 14, in the baseline section.",
  },
  C14_C1_SL: {
    value: "Category 1, sideline seat",
    explanation: "A reserved seat at Court 14, in the sideline section.",
  },
  // Wimbledon entries added 25 Oct 2026 — same purely structural,
  // factual-only register as the existing entries above. seatingCode
  // scheme: the approved parameter workbook's own "seating_tier" string
  // (e.g. "A-T"), sanitized to a key-safe form (hyphen kept, used
  // directly as the seating_code column value) for Centre Court/No.1
  // Court's lettered rows; "RESERVED" for No.2/No.3 Court's single
  // reserved-seating category (both courts have exactly one ticketed
  // category each, per the approved CSV). Every key below was verified
  // against the approved 25-option reference CSV's seating_tier column —
  // 7 distinct Wimbledon seating combinations, all covered.
  CC_A_T: {
    value: "Seating block A–T",
    explanation: "A reserved seat at Centre Court, in seating block A–T.",
  },
  CC_U_Z: {
    value: "Seating block U–Z",
    explanation: "A reserved seat at Centre Court, in seating block U–Z.",
  },
  CC_ZA_ZF: {
    value: "Seating block ZA–ZF",
    explanation: "A reserved seat at Centre Court, in seating block ZA–ZF.",
  },
  C1_A_Q: {
    value: "Seating block A–Q",
    explanation: "A reserved seat at No. 1 Court, in seating block A–Q.",
  },
  C1_R_W: {
    value: "Seating block R–W",
    explanation: "A reserved seat at No. 1 Court, in seating block R–W.",
  },
  C1_X_ZC: {
    value: "Seating block X–ZC",
    explanation: "A reserved seat at No. 1 Court, in seating block X–ZC.",
  },
  C2_RESERVED: {
    value: "Reserved seat",
    explanation: "A reserved seat at No. 2 Court.",
  },
  C3_RESERVED: {
    value: "Reserved seat",
    explanation: "A reserved seat at No. 3 Court.",
  },
};

export function seatingPresentation(option: TicketOption): { value: string; explanation: string } {
  if (option.arenaCode === "GP") {
    return {
      value: "Flexible outside-court access",
      explanation: "Explore eligible outside courts without a reserved show-court seat.",
    };
  }
  const key = `${option.arenaCode}_${option.seatingCode}`;
  const mapped = SEATING_MAP[key];
  if (!mapped) {
    // Per spec section 5.3: "If the catalogue contains any seating
    // classification not covered here, stop and report it rather than
    // inventing a description." Thrown, not silently defaulted — a
    // missing mapping must surface as a build/runtime error, not a
    // fabricated fan-facing string.
    throw new Error(
      `No presentation mapping for seating classification "${key}" — catalogue contains an unmapped seating code. Stop and report per spec section 5.3.`
    );
  }
  return mapped;
}

export function experiencePresentation(arenaCode: TicketOption["arenaCode"]): { value: string; explanation: string } {
  switch (arenaCode) {
    case "RLA":
      return {
        value: "Flagship arena tennis",
        explanation: "The Australian Open's flagship arena, offering a big-stadium atmosphere.",
      };
    case "MCA":
      return {
        value: "Show-court tennis",
        explanation: "A substantial arena experience in a more contained setting than Rod Laver.",
      };
    case "JCA":
      return {
        value: "Arena tennis",
        explanation: "A lively, more intimate arena setting for watching Australian Open tennis.",
      };
    case "GP":
      return {
        value: "Explore the outside courts",
        explanation: "Move between eligible outside courts and experience tennis across the grounds.",
      };
    // French Open entries added 22 Oct 2026 — purely factual (court name +
    // its documented role only, no subjective claims), per founder
    // approval. Court roles taken from the approved parameter workbook.
    case "PC":
      return {
        value: "Flagship court tennis",
        explanation: "Roland-Garros's main court, Court Philippe-Chatrier, including semifinal and final sessions.",
      };
    case "SL":
      return {
        value: "Show-court tennis",
        explanation: "Court Suzanne-Lenglen, Roland-Garros's second show court.",
      };
    case "SM":
      return {
        value: "Court tennis",
        explanation: "Court Simonne-Mathieu, a reserved-seating court at Roland-Garros.",
      };
    case "C14":
      return {
        value: "Court tennis",
        explanation: "Court 14, a reserved-seating court at Roland-Garros.",
      };
    // Wimbledon entries added 25 Oct 2026 — purely factual (court name +
    // its documented role only, no subjective claims), same register as
    // the AO/French Open entries above.
    case "CC":
      return {
        value: "Flagship court tennis",
        explanation: "Wimbledon's Centre Court, the tournament's main show court.",
      };
    case "C1":
      return {
        value: "Show-court tennis",
        explanation: "No. 1 Court, Wimbledon's second show court.",
      };
    case "C2":
      return {
        value: "Court tennis",
        explanation: "No. 2 Court, a reserved-seating court at Wimbledon.",
      };
    case "C3":
      return {
        value: "Court tennis",
        explanation: "No. 3 Court, a reserved-seating court at Wimbledon.",
      };
  }
}

export function arenaDisplayName(option: TicketOption): string {
  return option.arenaCode === "GP" ? "Ground Pass" : option.arenaName;
}
