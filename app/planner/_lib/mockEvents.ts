// Shared labels/types for the planner UI, plus a helper for summing cost
// line items. Real event/cost data comes from getPlannerEvents.ts (queries
// the planner_* tables) — this file no longer holds mock data.

export const SPORT_LABELS: Record<string, string> = {
  tennis: "Tennis",
  cricket: "Cricket",
  formula_one: "Formula 1",
  golf: "Golf",
};

export const TIME_WINDOW_LABELS: Record<string, string> = {
  next_3mo: "Next 3 months",
  next_6mo: "Next 6 months",
  next_9mo: "Next 9 months",
  flexible: "Flexible",
};

// qualifier — the assumption behind the number, shown alongside it on
// Screen 2 so a price means something (e.g. "Moderate tier", "Bronze",
// "round-trip economy") rather than reading as an opaque figure.
export type CostLineItem = { label: string; low: number; high: number; qualifier?: string };

export type MockEvent = {
  id: string;
  slug: string;
  sport: string;
  name: string;
  venue: string;
  city: string; // short city-only label, for compact layouts where the full venue string is too long
  dateRange: string;
  startDate: string; // ISO date, real Date field for time-window filtering — dateRange is display-only text, not safe to parse
  packStatus: "live" | "built_hidden" | "planned" | "building";
  lineItems: CostLineItem[];
  heroImageUrl: string | null;
};

export function sumLineItems(lineItems: CostLineItem[], key: "low" | "high") {
  return lineItems.reduce((sum, item) => sum + item[key], 0);
}

// Every planner cost figure passes through here before display — rounds to
// the nearest dollar (DB columns are numeric(10,2) and can carry cents) and
// collapses "$395–$395" into a single "$395" when low and high round to the
// same value, rather than showing a fake range.
export function formatMoneyRange(low: number, high: number): string {
  const roundedLow = Math.round(low);
  const roundedHigh = Math.round(high);
  if (roundedLow === roundedHigh) return `$${roundedLow.toLocaleString()}`;
  return `$${roundedLow.toLocaleString()}–$${roundedHigh.toLocaleString()}`;
}

export type RankedEvent = MockEvent & {
  totalLow: number;
  totalHigh: number;
  totalMid: number;
  fits: boolean;
  delta: number;
};

// Single source of truth for Screen 2/3 ordering — was previously duplicated
// inline in ShortlistResults.tsx and NOT applied at all in ComparisonView.tsx
// (Compare showed events in raw DB-fetch order, not the sorted order the user
// actually saw on Screen 2). Both screens now call this so the order can
// never drift out of sync between them.
//
// "Flexible" is encoded as budgetMax >= 100000 — its real midpoint (~$50,000)
// is nowhere near any real trip cost, so closest-to-midpoint sorting would
// silently rank the MOST expensive event first. Flexible sorts cheapest
// (by typical/mid cost) first instead. Real bounded budgets sort by
// closest-to-midpoint, which deliberately avoids always favoring
// structurally cheap events over ones that better match what the user
// actually said they could spend.
// Shared summary-line builder ("Tennis · $400–$1,000 · Next 6 months · 5
// days") — used on-screen (Screen 2/3 headers) and in every Planner email
// that references the user's search. Single source of truth so a future
// call site can't forget to include the filter context, same class of bug
// as the sort-order fix above.
export function buildSummaryLine(intake: {
  sports: string[];
  budgetMin: number;
  budgetMax: number;
  timeWindow: string;
  tripLengthDays: number;
}): string {
  const sportSummary = intake.sports.map((s) => SPORT_LABELS[s] ?? s).join(", ") || "Any sport";
  const budgetSummary = intake.budgetMax >= 100000 ? "Flexible" : formatMoneyRange(intake.budgetMin, intake.budgetMax);
  const windowSummary = TIME_WINDOW_LABELS[intake.timeWindow] ?? intake.timeWindow;
  const tripLength = intake.tripLengthDays ? ` · ${intake.tripLengthDays} day${intake.tripLengthDays === 1 ? "" : "s"}` : "";
  return `${sportSummary} · ${budgetSummary} · ${windowSummary}${tripLength}`;
}

export function rankEvents(
  events: MockEvent[],
  budgetMin: number,
  budgetMax: number
): RankedEvent[] {
  const budgetMid = (budgetMin + budgetMax) / 2;
  return events
    .map((e) => {
      const totalLow = sumLineItems(e.lineItems, "low");
      const totalHigh = sumLineItems(e.lineItems, "high");
      const totalMid = (totalLow + totalHigh) / 2;
      const fits = totalMid <= budgetMax;
      return { ...e, totalLow, totalHigh, totalMid, fits, delta: Math.abs(totalMid - budgetMid) };
    })
    .sort((a, b) => (budgetMax >= 100000 ? a.totalMid - b.totalMid : a.delta - b.delta));
}
