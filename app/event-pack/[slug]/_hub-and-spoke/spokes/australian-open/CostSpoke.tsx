import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import { formatMoneyRange } from "@/app/planner/_lib/mockEvents";
import SpokeShell from "../../_components/SpokeShell";

const SPOKE_ID = "cost";
const TRIP_NIGHTS = 4;

// Real seeded planner rows for Melbourne (planner_hotel_tier_cost,
// planner_destination_bands) and the real AO2027 ticket tiers
// (planner_ticket_tier_cost, seeded 22 Jul 2026: Ground Pass, Grandstand,
// Show Court Reserved, Hospitality) — folded into the headline total, not
// left as a placeholder, since the research is already done. Melbourne's
// planner_hotel_tier_cost has no seeded "luxury" hotel row, so the 4th
// ("Luxury") card computed below reuses the splurge hotel's real seeded
// high end paired with real AO Reserve pricing (converted from AUD) rather
// than a seeded planner ticket tier — see the comment above luxuryTotal.
export default async function CostSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences, hotels, tickets, destinationBand, flights, costDataVerifiedAt } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;
  const stayGuide = linkedExperiences.find((e) => e.slug.includes("where-to-stay-melbourne-boxing-day"));

  const budgetHotel = hotels.find((h) => h.tier === "budget");
  const moderateHotel = hotels.find((h) => h.tier === "moderate");
  const splurgeHotel = hotels.find((h) => h.tier === "splurge");

  const tier1Ticket = tickets.find((t) => t.tier === "tier1");
  const tier2Ticket = tickets.find((t) => t.tier === "tier2");
  const tier3Ticket = tickets.find((t) => t.tier === "tier3");

  const tripTotal = (hotel: typeof moderateHotel, ticket: typeof tier2Ticket) => {
    if (!hotel) return null;
    const stayLow = Number(hotel.costLow) * TRIP_NIGHTS + (destinationBand ? (Number(destinationBand.localTravelLow) + Number(destinationBand.foodPerDayLow)) * TRIP_NIGHTS : 0);
    const stayHigh = Number(hotel.costHigh) * TRIP_NIGHTS + (destinationBand ? (Number(destinationBand.localTravelHigh) + Number(destinationBand.foodPerDayHigh)) * TRIP_NIGHTS : 0);
    const ticketLow = ticket ? Number(ticket.costLow) : 0;
    const ticketHigh = ticket ? Number(ticket.costHigh) : 0;
    return { low: Math.round(stayLow + ticketLow), high: Math.round(stayHigh + ticketHigh) };
  };

  const moderateTotal = tripTotal(moderateHotel, tier2Ticket);

  // AO Reserve's Week 2 "from" prices — AU$1,449pp (AO Glasshouse/The
  // Gallery) to AU$2,499pp (Champions Rooftop by Peter Gilmore), both once
  // availability shifts to Quarterfinals/Semifinals onward, see
  // LuxurySpoke's packages table — converted to US$1,017-US$1,753 at the
  // same AUD->USD 0.70152 rate already used to seed this event's real
  // ticket tiers (scripts/seed-australian-open-2027-ticket-tiers.mjs,
  // checked 21 Jul 2026). Melbourne's planner_hotel_tier_cost has no seeded
  // "luxury" hotel tier, so this profile reuses the splurge hotel's high
  // end only (not its full low-high range) for both ends of the range,
  // rather than inventing a luxury-hotel figure. Per founder direction 27
  // Aug 2026.
  const LUXURY_TICKET_LOW_USD = 1017;
  const LUXURY_TICKET_HIGH_USD = 1753;
  const luxuryTotal = splurgeHotel
    ? {
        low: Math.round(
          Number(splurgeHotel.costHigh) * TRIP_NIGHTS +
            (destinationBand ? (Number(destinationBand.localTravelHigh) + Number(destinationBand.foodPerDayHigh)) * TRIP_NIGHTS : 0) +
            LUXURY_TICKET_LOW_USD
        ),
        high: Math.round(
          Number(splurgeHotel.costHigh) * TRIP_NIGHTS +
            (destinationBand ? (Number(destinationBand.localTravelHigh) + Number(destinationBand.foodPerDayHigh)) * TRIP_NIGHTS : 0) +
            LUXURY_TICKET_HIGH_USD
        ),
      }
    : null;

  const profiles = [
    { label: "Budget", hotel: budgetHotel, ticket: tier1Ticket, hotelNote: "A basic central hotel", ticketNote: "Grounds Pass" },
    { label: "Moderate", hotel: moderateHotel, ticket: tier2Ticket, hotelNote: "A solid 4-star hotel", ticketNote: "Grandstand ticket" },
    { label: "Splurge", hotel: splurgeHotel, ticket: tier3Ticket, hotelNote: "An upper-tier hotel", ticketNote: "Show Court Reserved seat" },
  ].filter((p) => p.hotel);

  // Same-city origin (Melbourne) is seeded $0-$0 by design — real for the
  // Planner's per-origin lookup, meaningless in an aggregate range, so it
  // must be excluded here explicitly (per hub-and-spoke skill §2a-2).
  // Sydney (a same-country short-hop, ~US$106-224) and Doha/Dubai (Gulf
  // long-haul hubs, ~US$2,100-2,607) are both real seeded rows tagged
  // "Asia-Pacific", but blending either into this headline range makes it
  // misleadingly wide — one drags the low end to near-zero, the other
  // drags the high end past $2,600. Narrowed 26 Aug 2026 to the tight
  // East/South Asia cluster fans actually compare against each other.
  const EAST_SOUTH_ASIA_CORE = ["Tokyo", "Seoul", "Beijing", "Shanghai", "Hong Kong", "Singapore", "Manila", "Mumbai", "Bangalore", "New Delhi"];
  const apacFlights = flights.filter((f) => f.region === "Asia-Pacific" && EAST_SOUTH_ASIA_CORE.includes(f.originMarket));
  const flightRange = apacFlights.length
    ? {
        low: Math.min(...apacFlights.map((f) => Number(f.costLow))),
        high: Math.max(...apacFlights.map((f) => Number(f.costHigh))),
      }
    : null;

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Australian Open"
      status="teaser"
      h1="Real hotel, ticket, and daily-spend numbers — no estimates"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      heroImagePosition={spoke.heroImagePosition}
      isUnlocked={isUnlocked}
      ctaCopy="Every number above is real and free — the pack doesn't unlock more prices, it unlocks the decision. Which ticket tier is actually worth it, whether the finals week price jump is worth timing around, and where to spend the hotel budget."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Melbourne runs cheaper than Sydney on most day-to-day spend, and the Australian Open itself has one of the
        most accessible entry-level ticket prices of any Grand Slam — a grounds pass costs a fraction of a
        reserved seat. The real swing in this trip&apos;s cost comes from two places: which ticket tier you buy,
        and how far into the tournament&apos;s two weeks you&apos;re there for, since finals-week pricing climbs
        sharply as the draw narrows.
      </p>

      {moderateTotal && (
        <div className="mb-8">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Typical {TRIP_NIGHTS}-night trip</p>
          <p className="text-3xl sm:text-4xl font-black text-white">
            {formatMoneyRange(moderateTotal.low, moderateTotal.high)}
          </p>
          <p className="text-xs text-[#6A6A6A] mt-1">
            A 4-star hotel, food, local transport, and a Grandstand ticket for {TRIP_NIGHTS} nights.{" "}
            <span className="text-[#AAFF00]">Excludes flights</span> —{" "}
            <a href="#flights" className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              see why ↓
            </a>
          </p>
          {costDataVerifiedAt && (
            <p className="text-xs text-[#6A6A6A] mt-1">
              Prices verified {costDataVerifiedAt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} — not real-time
            </p>
          )}
        </div>
      )}

      {profiles.length > 0 && (
        <>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Four ways to do this trip</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {profiles.map((p) => {
              const total = tripTotal(p.hotel, p.ticket);
              return (
                <div key={p.label} className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
                  <p className="text-xs font-black tracking-widest uppercase text-white mb-1">{p.label}</p>
                  <p className="text-lg font-black text-[#AAFF00]">
                    {total ? formatMoneyRange(total.low, total.high) : "—"}
                  </p>
                  <ul className="mt-1 space-y-0.5">
                    <li className="text-xs text-[#6A6A6A] pl-3 -indent-3">• {p.hotelNote}</li>
                    <li className="text-xs text-[#6A6A6A] pl-3 -indent-3">• {p.ticketNote}</li>
                  </ul>
                </div>
              );
            })}
            {luxuryTotal && (
              <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
                <p className="text-xs font-black tracking-widest uppercase text-white mb-1">Luxury</p>
                <p className="text-lg font-black text-[#AAFF00]">{formatMoneyRange(luxuryTotal.low, luxuryTotal.high)}</p>
                <ul className="mt-1 space-y-0.5">
                  <li className="text-xs text-[#6A6A6A] pl-3 -indent-3">• A luxury hotel</li>
                  <li className="text-xs text-[#6A6A6A] pl-3 -indent-3">• AO Reserve, Week 2 (from)</li>
                </ul>
              </div>
            )}
          </div>
        </>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-1">Where the money goes</p>
      <p className="text-xs text-[#6A6A6A] mb-3">For the Moderate trip above — 4-star hotel, Grandstand ticket.</p>
      <div className="flex flex-col gap-2 mb-8">
        {tier2Ticket && (
          <CategoryRow label="Ticket (Grandstand)" low={Number(tier2Ticket.costLow)} high={Number(tier2Ticket.costHigh)} unit="one session" />
        )}
        {moderateHotel && (
          <CategoryRow label="Hotel" low={Number(moderateHotel.costLow) * TRIP_NIGHTS} high={Number(moderateHotel.costHigh) * TRIP_NIGHTS} unit={`for ${TRIP_NIGHTS} nights`} />
        )}
        {destinationBand && (
          <>
            <CategoryRow label="Local travel" low={Number(destinationBand.localTravelLow) * TRIP_NIGHTS} high={Number(destinationBand.localTravelHigh) * TRIP_NIGHTS} unit={`for ${TRIP_NIGHTS} days`} />
            <CategoryRow label="Food" low={Number(destinationBand.foodPerDayLow) * TRIP_NIGHTS} high={Number(destinationBand.foodPerDayHigh) * TRIP_NIGHTS} unit={`for ${TRIP_NIGHTS} days`} />
          </>
        )}
      </div>

      {destinationBand?.localTravelNote && (
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-4">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Getting around, cheaply</p>
          <p className="text-sm text-[#A3A3A3] leading-6">{destinationBand.localTravelNote}</p>
        </div>
      )}
      {destinationBand?.foodNote && (
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">A local money-saving trick</p>
          <p className="text-sm text-[#A3A3A3] leading-6">{destinationBand.foodNote}</p>
        </div>
      )}

      <div id="flights" className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 scroll-mt-20">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What about flights?</p>
        {flightRange && (
          <p className="text-sm text-white font-bold mb-2">
            Roughly {formatMoneyRange(flightRange.low, flightRange.high)}{" "}
            round-trip, economy, from East or South Asia (Tokyo, Seoul, Shanghai, Singapore, Mumbai, and similar).
          </p>
        )}
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          Sydney is a short domestic hop (well under US$250 round-trip), and Gulf hubs like Doha and Dubai run
          closer to US$2,100&ndash;2,600 — both real, just different enough that folding them into the number above
          would be misleading. Flying in from Europe, the Americas, or Africa costs meaningfully more too. Tell the
          Planner where you&apos;re starting from and it&apos;ll give you a real range for your actual route.
        </p>
        <a
          href="/planner"
          className="inline-flex items-center px-4 py-2 rounded-sm border border-[#AAFF00] text-[#AAFF00] text-xs font-black hover:bg-[#AAFF00] hover:text-black transition-colors"
        >
          Check flight costs from your city →
        </a>
      </div>

      {stayGuide && (
        <p className="text-sm text-[#A3A3A3] leading-7 mt-8 mb-8">
          See the full{" "}
          <a href={`/event-pack/${eventSlug}/hotels`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
            Where to Stay guide
          </a>{" "}
          for the real strategic choice between East Melbourne and the CBD.
        </p>
      )}

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which ticket tier we&apos;d pick</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            A Ground Pass for most of your trip, plus one Grandstand or Show Court Reserved seat for a specific
            match you actually want to see, is the sharpest combination for a first Australian Open — the grounds
            pass alone gets you a full day of outside-court tennis, often with top-20 players warming up close
            enough to hear, and a single reserved seat gets you the real arena atmosphere without paying for it
            every day. Prices climb hard as the draw narrows: a reserved seat is cheapest in the first week, and
            the Show Court tier especially is worth timing for a specific round rather than buying blind for
            &quot;whichever day.&quot; The full tier-by-tier breakdown lives in the{" "}
            <a href={`/event-pack/${eventSlug}/tickets`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Ticket Guide
            </a>
            .
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">The cheapest week most people skip</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Opening Week (11-16 Jan) runs a separate, dramatically cheaper Ground Pass — AU$10, against AU$49 for
            the main-draw early-bird rate — covering qualifying matches and open practice at the National Tennis
            Centre. If your trip has any flexibility at all, arriving during Opening Week and staying through the
            first few days of the main draw stretches your budget further than committing every day to main-draw
            pricing. See the{" "}
            <a href={`/event-pack/${eventSlug}/itinerary`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Trip Schedule
            </a>{" "}
            for how this fits into a full trip.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Day vs. night sessions — the cost actually flips</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Most first-timers assume night sessions cost more across the board. They don&apos;t. In the early
            rounds, a Rod Laver Arena or Margaret Court Arena night ticket is typically priced <em>below</em>{" "}
            the equivalent day session, since a marquee match isn&apos;t guaranteed that early. That relationship
            flips hard from the
            quarterfinals onward, when night sessions are reliably built around the tournament&apos;s biggest
            remaining names and carry a real premium over a day ticket for the same round. If budget is the
            priority, an early-week night session is often the better buy than the equivalent day session — see{" "}
            <a href={`/event-pack/${eventSlug}/itinerary`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Late Night at Melbourne Park
            </a>{" "}
            for the full pattern.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Where we&apos;d spend the hotel budget</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Put the money into proximity to Melbourne Park over anything else — East Melbourne puts you a genuine
            walk from the gates, which matters more here than in most host cities because Melbourne&apos;s January
            weather can swing 15-20°C in a single day (see the{" "}
            <a href={`/event-pack/${eventSlug}/weather`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Weather guide
            </a>
            ), and a short walk back to a hotel room beats a longer tram ride if a session gets interrupted or the
            heat spikes. See the{" "}
            <a href={`/event-pack/${eventSlug}/hotels`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Where to Stay guide
            </a>{" "}
            for named picks.
          </p>
        </div>
      )}

    </SpokeShell>
  );
}

function CategoryRow({ label, low, high, unit }: { label: string; low: number; high: number; unit: string }) {
  return (
    <div className="flex items-center justify-between rounded-sm border border-[#2A2A2A] bg-[#141414] px-4 py-3">
      <span className="text-sm font-bold text-white">{label}</span>
      <span className="text-sm text-[#A3A3A3] font-mono">
        {formatMoneyRange(low, high)} {unit}
      </span>
    </div>
  );
}
