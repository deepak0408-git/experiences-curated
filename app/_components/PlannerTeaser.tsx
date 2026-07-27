import Link from "next/link";
import { getPlannerEvents } from "../planner/_lib/getPlannerEvents";
import { sumLineItems, formatMoneyRange } from "../planner/_lib/mockEvents";

// Homepage teaser for the Trip Planner — the rest of the homepage assumes
// the visitor already knows their event (hero carousel, On the calendar,
// Browse by sport are all "pick from what we have"). This section serves
// the visitor who's sport-decided but event-undecided: "start with your
// budget instead." The preview below uses REAL live data (Formula 1, under
// $3,500, next 6 months, from Paris) rather than a mocked example — Italian
// GP genuinely fits this budget, Singapore GP genuinely doesn't, so the
// card demonstrates real filtering, not just a curated events list. Locked
// with the founder 26 Jul 2026 after verifying both results live.
const TEASER_BUDGET_MAX = 3500;
const TEASER_TRIP_LENGTH_DAYS = 4;
const TEASER_ORIGIN_MARKET = "Paris";

export default async function PlannerTeaser() {
  const events = await getPlannerEvents(TEASER_TRIP_LENGTH_DAYS, TEASER_ORIGIN_MARKET);

  const italianGp = events.find((e) => e.slug === "italian-gp-2026");
  const singaporeGp = events.find((e) => e.slug === "singapore-gp-2026");

  // If either event's data isn't available (e.g. not yet seeded, or a
  // future re-seed changes which routes exist), skip the live example
  // rather than show a broken/partial card — same defensive principle as
  // the Planner's own getPlannerEvents.
  if (!italianGp || !singaporeGp) return null;

  const italianTotalLow = sumLineItems(italianGp.lineItems, "low");
  const italianTotalHigh = sumLineItems(italianGp.lineItems, "high");
  const italianMid = Math.round((italianTotalLow + italianTotalHigh) / 2);
  const italianFits = italianMid <= TEASER_BUDGET_MAX;

  const singaporeTotalLow = sumLineItems(singaporeGp.lineItems, "low");
  const singaporeTotalHigh = sumLineItems(singaporeGp.lineItems, "high");
  const singaporeMid = Math.round((singaporeTotalLow + singaporeTotalHigh) / 2);
  const singaporeFits = singaporeMid <= TEASER_BUDGET_MAX;
  const singaporeOverage = Math.max(0, singaporeMid - TEASER_BUDGET_MAX);

  return (
    <div id="planner-teaser" className="bg-[#0A0A0A]">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-14 flex flex-col lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
        {/* Mobile order is: headline/copy -> example card -> CTA. Desktop
            stays a 2-column grid (copy+CTA on the left, card on the right).
            The CTA is pulled into its own ordered block so it can sit after
            the card on mobile without duplicating it for desktop — a
            shared button can't belong to two different DOM positions
            depending on breakpoint, so lg:hidden / hidden lg:inline-flex
            renders the right one per breakpoint instead. Fixed 26 Jul 2026. */}
        <div className="order-1 lg:order-none">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-4">
            Starting to plan your trip?
          </p>
          <h2 className="text-2xl font-black text-white leading-snug">
            Start with your budget instead.
          </h2>
          <p className="mt-4 text-sm text-[#A3A3A3] leading-7">
            Sport, budget, timing — tell us Formula 1, under $3,500, in the next 6 months, and
            we&apos;ll surface real matches like the Italian Grand Prix with researched cost
            breakdowns and ways to make them fit your budget, before you commit to anything.
          </p>
          <Link
            href="/planner"
            className="hidden lg:inline-flex mt-6 items-center px-6 py-3 rounded-sm bg-[#AAFF00] text-black text-sm font-black hover:bg-[#BBFF33] transition-colors"
          >
            Try the Trip Planner →
          </Link>
        </div>

        <div className="order-2 lg:order-none mt-10 mb-6 lg:mb-0 lg:mt-0">
          <div className="rounded-sm bg-[#1A1A1A] border border-[#2A2A2A] p-6">
            <p className="text-sm font-black text-white mb-4">
              Formula 1 · Under ${TEASER_BUDGET_MAX.toLocaleString()} · Next 6 months · {TEASER_TRIP_LENGTH_DAYS} days
            </p>

            <div className="border-t border-[#2A2A2A] pt-4 flex items-start gap-3">
              <div className="w-[50%]">
                <p className="text-sm font-black text-white">{italianGp.name}</p>
                <p className="mt-1 text-xs text-[#A3A3A3]">
                  Total cost: {formatMoneyRange(italianTotalLow, italianTotalHigh)} · typical ${italianMid.toLocaleString()}
                </p>
                <p className={`mt-1 text-xs font-black ${italianFits ? "text-[#AAFF00]" : "text-red-500"}`}>
                  {italianFits ? "✓ Fits your budget" : `$${(italianMid - TEASER_BUDGET_MAX).toLocaleString()} over your budget`}
                </p>
              </div>
              {/* The 5 cost categories the Planner researches for every
                  event — shown here so a homepage visitor sees the real
                  breakdown behind the total, not just a bare number.
                  60/40 split with smaller text on this side — the event
                  details were cramped at a roughly-even split. */}
              <div className="w-[50%] space-y-1">
                {italianGp.lineItems.map((li) => (
                  <div key={li.label} className="flex items-center justify-between gap-2 text-[10px] lg:text-xs text-[#6A6A6A]">
                    <span>{li.label}</span>
                    <span className="text-[#A3A3A3]">{formatMoneyRange(li.low, li.high)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-[#2A2A2A] mt-4 pt-4 flex items-start gap-3">
              <div className="w-[50%]">
                <p className="text-sm font-black text-white">{singaporeGp.name}</p>
                <p className="mt-1 text-xs text-[#A3A3A3]">
                  Total cost: {formatMoneyRange(singaporeTotalLow, singaporeTotalHigh)} · typical ${singaporeMid.toLocaleString()}
                </p>
                <p className={`mt-1 text-xs font-black ${singaporeFits ? "text-[#AAFF00]" : "text-red-500"}`}>
                  {singaporeFits ? "✓ Fits your budget" : `$${singaporeOverage.toLocaleString()} over your budget`}
                </p>
                {!singaporeFits && (
                  <p className="mt-1 text-xs text-[#A3A3A3]">We&apos;ll help you optimize.</p>
                )}
              </div>
              <div className="w-[50%] space-y-1">
                {singaporeGp.lineItems.map((li) => (
                  <div key={li.label} className="flex items-center justify-between gap-2 text-[10px] lg:text-xs text-[#6A6A6A]">
                    <span>{li.label}</span>
                    <span className="text-[#A3A3A3]">{formatMoneyRange(li.low, li.high)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Link
            href="/planner"
            className="lg:hidden mt-6 inline-flex items-center px-6 py-3 rounded-sm bg-[#AAFF00] text-black text-sm font-black hover:bg-[#BBFF33] transition-colors"
          >
            Try the Trip Planner →
          </Link>
        </div>
      </div>
    </div>
  );
}
