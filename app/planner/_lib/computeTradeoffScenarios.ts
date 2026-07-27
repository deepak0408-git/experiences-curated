import type { ScoredTierOption, RagLevel } from "./scoreTradeoffOptions";

// Escalation algorithm — confirmed with user 19 Jul 2026. Never shows more
// than the minimum needed: try Green first, then Amber, then both levers
// together. Stop at the first level that's sufficient. If a level has one
// sufficient option, show only that one; if both levers are sufficient at
// the same level, show both and let the user choose; never show a level
// that's already been superseded by a working answer at an earlier level.
//
// Every scenario carries a full lineItemBreakdown so the user can see the
// arithmetic that produces the new total — never a bare final number with
// no visible math (caught 19 Jul 2026: showing a total with nothing to
// verify it against reads as untrustworthy).

export type ScenarioLineItem = { label: string; low: number; high: number; changed: boolean };

export type TradeoffScenario = {
  kind: "hotel" | "tickets" | "both";
  option: ScoredTierOption | { hotel: ScoredTierOption; tickets: ScoredTierOption };
  lineItemBreakdown: ScenarioLineItem[];
  newTotalLow: number;
  newTotalHigh: number;
  newTotalMid: number;
  fitsBudget: boolean;
};

export type TradeoffResult = {
  scenarios: TradeoffScenario[]; // 1 or 2 scenarios, or 1 final "both" scenario
  level: "green" | "amber" | "both";
};

// unchangedLineItems = Flights, Local travel, Food — each with its own
// label/low/high, so every scenario can show the real, complete breakdown.
export function computeTradeoffScenarios(
  hotelOptions: ScoredTierOption[],
  ticketOptions: ScoredTierOption[],
  currentHotel: { costLow: number; costHigh: number },
  currentTicket: { costLow: number; costHigh: number },
  unchangedLineItems: { label: string; low: number; high: number }[],
  budgetMax: number
): TradeoffResult {
  const restLow = unchangedLineItems.reduce((sum, li) => sum + li.low, 0);
  const restHigh = unchangedLineItems.reduce((sum, li) => sum + li.high, 0);

  const hotelAt = (rag: RagLevel) => hotelOptions.find((o) => o.rag === rag);
  const ticketAt = (rag: RagLevel) => ticketOptions.find((o) => o.rag === rag);

  // Updated items shown first (Hotel, Tickets), then unchanged items in
  // their original order (Flights, Local travel, Food) — confirmed
  // 19 Jul 2026, reversing the earlier "preserve Screen 2 order" call.
  const buildBreakdown = (hotelItem: { low: number; high: number; changed: boolean }, ticketItem: { low: number; high: number; changed: boolean }): ScenarioLineItem[] => [
    { label: "Hotel", low: hotelItem.low, high: hotelItem.high, changed: hotelItem.changed },
    { label: "Tickets", low: ticketItem.low, high: ticketItem.high, changed: ticketItem.changed },
    ...unchangedLineItems.map((li) => ({ label: li.label, low: li.low, high: li.high, changed: false })),
  ];

  const scenarioFor = (kind: "hotel" | "tickets", option: ScoredTierOption): TradeoffScenario => {
    const hotelItem = kind === "hotel"
      ? { low: option.costLow, high: option.costHigh, changed: true }
      : { low: currentHotel.costLow, high: currentHotel.costHigh, changed: false };
    const ticketItem = kind === "tickets"
      ? { low: option.costLow, high: option.costHigh, changed: true }
      : { low: currentTicket.costLow, high: currentTicket.costHigh, changed: false };

    const newTotalLow = restLow + hotelItem.low + ticketItem.low;
    const newTotalHigh = restHigh + hotelItem.high + ticketItem.high;
    const newTotalMid = (newTotalLow + newTotalHigh) / 2;

    return {
      kind,
      option,
      lineItemBreakdown: buildBreakdown(hotelItem, ticketItem),
      newTotalLow,
      newTotalHigh,
      newTotalMid,
      // Matches Screen 2's own "fits budget" definition (totalMid <=
      // budgetMax) — confirmed 19 Jul 2026. A scenario Screen 2 would call
      // fitting must never be told "still over" by the Tradeoff Engine.
      fitsBudget: newTotalMid <= budgetMax,
    };
  };

  for (const level of ["green", "amber"] as const) {
    const hotelOpt = hotelAt(level);
    const ticketOpt = ticketAt(level);
    const hotelScenario = hotelOpt ? scenarioFor("hotel", hotelOpt) : null;
    const ticketScenario = ticketOpt ? scenarioFor("tickets", ticketOpt) : null;

    const hotelWorks = hotelScenario?.fitsBudget ?? false;
    const ticketWorks = ticketScenario?.fitsBudget ?? false;

    if (hotelWorks && ticketWorks) {
      return { scenarios: [hotelScenario!, ticketScenario!], level };
    }
    if (hotelWorks) {
      return { scenarios: [hotelScenario!], level };
    }
    if (ticketWorks) {
      return { scenarios: [ticketScenario!], level };
    }
    // neither sufficient at this level — escalate
  }

  // Both levers together — deepest available combination (cheapest real
  // tier on each). Shown as the final scenario whether or not it closes
  // the gap; verdict (green/red) communicated via fitsBudget.
  //
  // Option B fix (26 Jul 2026): previously required BOTH a deepest hotel AND
  // a deepest ticket option to exist, or returned scenarios: [] — silently
  // discarding a perfectly real, useful single-lever downgrade whenever the
  // OTHER lever had zero cheaper tiers (e.g. Abu Dhabi GP: hotel has a
  // cheaper "budget" tier, tickets have none below the default). A one-sided
  // data gap is not the same fact as "no cheaper options exist anywhere" and
  // must never be reported as one. Now: use whichever lever(s) actually have
  // a deepest option; only return empty when NEITHER lever has any.
  const deepestHotel = hotelOptions[hotelOptions.length - 1];
  const deepestTicket = ticketOptions[ticketOptions.length - 1];

  if (!deepestHotel && !deepestTicket) {
    return { scenarios: [], level: "both" };
  }

  const hotelItem = deepestHotel
    ? { low: deepestHotel.costLow, high: deepestHotel.costHigh, changed: true }
    : { low: currentHotel.costLow, high: currentHotel.costHigh, changed: false };
  const ticketItem = deepestTicket
    ? { low: deepestTicket.costLow, high: deepestTicket.costHigh, changed: true }
    : { low: currentTicket.costLow, high: currentTicket.costHigh, changed: false };
  const newTotalLow = restLow + hotelItem.low + ticketItem.low;
  const newTotalHigh = restHigh + hotelItem.high + ticketItem.high;
  const newTotalMid = (newTotalLow + newTotalHigh) / 2;

  return {
    scenarios: [
      {
        kind: deepestHotel && deepestTicket ? "both" : deepestHotel ? "hotel" : "tickets",
        option: deepestHotel && deepestTicket
          ? { hotel: deepestHotel, tickets: deepestTicket }
          : (deepestHotel ?? deepestTicket)!,
        lineItemBreakdown: buildBreakdown(hotelItem, ticketItem),
        newTotalLow,
        newTotalHigh,
        newTotalMid,
        fitsBudget: newTotalMid <= budgetMax,
      },
    ],
    level: "both",
  };
}
