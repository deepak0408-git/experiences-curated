import type { TicketOption } from "./types";

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

// Keyed by `${arenaCode}_${seatingCode}` except Ground Pass. Every key here
// was verified present in scripts/_tennis-options-source.json — 9 distinct
// combinations, all 9 covered, zero unmapped values found.
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
  }
}

export function arenaDisplayName(option: TicketOption): string {
  return option.arenaCode === "GP" ? "Ground Pass" : option.arenaName;
}
