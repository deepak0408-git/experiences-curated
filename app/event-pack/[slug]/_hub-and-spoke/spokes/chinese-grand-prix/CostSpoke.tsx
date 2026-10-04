import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import { formatMoneyRange } from "@/app/planner/_lib/mockEvents";
import SpokeShell from "../../_components/SpokeShell";

const SPOKE_ID = "cost";
const TRIP_NIGHTS = 3;

// Real cost data landed 23 Sep 2026 from the parallel cost-research session
// — planner_hotel_tier_cost and planner_flight_cost are genuine confirmed
// 2027/apr figures, but planner_ticket_tier_cost is 2026 on-sale pricing
// used as a proxy (Formula 1 hasn't published 2027 ticket pricing for any
// tier yet). The ticket-tier rows' editionYear was corrected to 2027 so
// getSpokeData() actually finds them (it filters on event.editionYear as
// a join key, not a provenance field — see project_planner_cost_edition_
// year_migration memory); the "this is 2026 pricing" fact lives in this
// spoke's own copy below, not in the DB label. Every mixed-tier total
// below (hotel = real 2027, ticket = proxy 2026) is flagged honestly.
//
// tier4 updated 2 Oct 2026 (fix-chinese-gp-ticket-tier4-hospitality-range.mjs):
// was a single flat Paddock Club figure, which wrongly implied Paddock Club
// is the only hospitality product at Shanghai. Now a real range — low end is
// F1 Experiences' genuine 2027 Starter price ($1,099, sourced live from
// f1experiences.com/2027-chinese-grand-prix), high end stays the existing
// 2026 Paddock Club proxy ($17,145, founder instruction) — see the "If
// you're considering hospitality" copy below for why that range isn't a
// smooth scale.
export default async function CostSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences, hotels, tickets, destinationBand, flights, costDataVerifiedAt } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const budgetHotel = hotels.find((h) => h.tier === "budget");
  const moderateHotel = hotels.find((h) => h.tier === "moderate");
  const splurgeHotel = hotels.find((h) => h.tier === "splurge");
  const luxuryHotel = hotels.find((h) => h.tier === "luxury");

  const tier1 = tickets.find((t) => t.tier === "tier1");
  const tier2 = tickets.find((t) => t.tier === "tier2");
  const tier3 = tickets.find((t) => t.tier === "tier3");
  const tier4 = tickets.find((t) => t.tier === "tier4");

  const stayTotal = (hotel: typeof moderateHotel) => {
    if (!hotel) return null;
    const low = Number(hotel.costLow) * TRIP_NIGHTS + (destinationBand ? (Number(destinationBand.localTravelLow) + Number(destinationBand.foodPerDayLow)) * TRIP_NIGHTS : 0);
    const high = Number(hotel.costHigh) * TRIP_NIGHTS + (destinationBand ? (Number(destinationBand.localTravelHigh) + Number(destinationBand.foodPerDayHigh)) * TRIP_NIGHTS : 0);
    return { low: Math.round(low), high: Math.round(high) };
  };

  const tripTotal = (hotel: typeof moderateHotel, ticket: typeof tier1) => {
    const stay = stayTotal(hotel);
    if (!stay || !ticket) return null;
    return {
      low: stay.low + Math.round(Number(ticket.costLow)),
      high: stay.high + Math.round(Number(ticket.costHigh)),
    };
  };

  const moderateTotal = tripTotal(moderateHotel, tier2);

  const profiles = [
    { label: "Budget", hotel: budgetHotel, ticket: tier1, note: "A well-reviewed budget stay in Jiading", ticketNote: "General Admission or Grandstand B" },
    { label: "Moderate", hotel: moderateHotel, ticket: tier2, note: "A solid 3-4 star hotel near the circuit", ticketNote: "Grandstand H or K" },
    { label: "Splurge", hotel: splurgeHotel, ticket: tier3, note: "An upscale hotel with real amenities", ticketNote: "Grandstand A (High Gold)" },
    { label: "Luxury", hotel: luxuryHotel, ticket: tier4, note: "Top downtown Shanghai stays", ticketNote: "F1 Experiences hospitality, Starter to Paddock Club" },
  ].filter((p) => p.hotel);

  const apacFlights = flights.filter(
    (f) => f.region === "Asia-Pacific" && f.originMarket !== "Shanghai"
  );
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
      eventSport={event.sport}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Chinese Grand Prix"
      status="teaser"
      h1="What a real Shanghai Grand Prix weekend costs, by budget"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="The real cost breakdown is free above. The pack adds which grandstand and which base (Jiading or downtown) we'd actually pick for a first Chinese Grand Prix, plus what to do the moment 2027 ticket pricing replaces this year's proxy figure."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        The numbers below cover a real full-trip estimate for the standard 3-day (Friday-Sunday) structure: hotel,
        food, local transport, and a ticket. Hotel and flight figures are genuine, confirmed 2027 pricing. Ticket
        prices are a different story — Formula 1 hasn&apos;t published 2027 ticket pricing for any tier yet, so the
        numbers below use the real 2026 on-sale price for each tier as a proxy. Treat every ticket figure as a
        realistic estimate, not a confirmed 2027 number — we&apos;ll update this the moment F1 publishes real 2027
        pricing.
      </p>

      {moderateTotal ? (
        <div className="mb-8">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Typical {TRIP_NIGHTS}-night trip</p>
          <p className="text-3xl sm:text-4xl font-black text-white">
            {formatMoneyRange(moderateTotal.low, moderateTotal.high)}
          </p>
          <p className="text-xs text-[#6A6A6A] mt-1">
            A 3-4 star hotel, food, local transport, and a mid-tier ticket, for {TRIP_NIGHTS} nights.{" "}
            <span className="text-[#AAFF00]">Excludes flights</span>,{" "}
            <a href="#flights" className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              see why ↓
            </a>
          </p>
          {costDataVerifiedAt && (
            <p className="text-xs text-[#6A6A6A] mt-1">
              Prices verified {costDataVerifiedAt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} — hotel/flight figures are real 2027 pricing, ticket figures are a 2026 proxy
            </p>
          )}
        </div>
      ) : (
        <div className="mb-8 rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Real pricing not live yet</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            We haven&apos;t finished sourcing verified hotel, ticket, and flight cost data for Shanghai yet. This
            section will show a real, sourced cost breakdown once that research is complete.
          </p>
        </div>
      )}

      {profiles.length > 0 && (
        <>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Four ways to do this trip</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {profiles.map((p) => {
              const total = tripTotal(p.hotel, p.ticket);
              return (
                <div key={p.label} className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
                  <p className="text-xs font-black tracking-widest uppercase text-white mb-1">{p.label}</p>
                  <p className="text-lg font-black text-[#AAFF00]">
                    {total ? formatMoneyRange(total.low, total.high) : "—"}
                  </p>
                  <ul className="mt-1 space-y-0.5">
                    <li className="text-xs text-[#6A6A6A] pl-3 -indent-3">• {p.note}</li>
                    <li className="text-xs text-[#6A6A6A] pl-3 -indent-3">• Ticket: {p.ticketNote}</li>
                  </ul>
                </div>
              );
            })}
          </div>
        </>
      )}

      {(tier2 || moderateHotel || destinationBand) && (
        <>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-1">Where the money goes</p>
          <p className="text-xs text-[#6A6A6A] mb-3">For the Moderate trip above — 3-4 star hotel, mid-tier ticket.</p>
          <div className="flex flex-col gap-2 mb-8">
            {tier2 && (
              <CategoryRow label="Ticket" low={Math.round(Number(tier2.costLow))} high={Math.round(Number(tier2.costHigh))} unit="3-day" />
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
        </>
      )}

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
        {flightRange ? (
          <p className="text-sm text-white font-bold mb-2">
            Roughly {formatMoneyRange(flightRange.low, flightRange.high)}{" "}
            round-trip, economy, if you&apos;re flying from within Asia-Pacific.
          </p>
        ) : (
          <p className="text-sm text-[#A3A3A3] leading-6 mb-2">
            Flight cost ranges for this destination haven&apos;t been sourced yet.
          </p>
        )}
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          Flying in from Europe, North America, or elsewhere costs meaningfully more — Shanghai Pudong International
          (PVG) is the main international gateway for this trip, with Hongqiao (SHA) a closer, more domestic-focused
          alternative. Tell the Planner where you&apos;re starting from for a real number on your actual route.
        </p>
        <a
          href={`/price-radar/${eventSlug}`}
          className="inline-flex items-center px-4 py-2 rounded-sm border border-[#AAFF00] text-[#AAFF00] text-xs font-black hover:bg-[#AAFF00] hover:text-black transition-colors"
        >
          Check full trip costs from your city →
        </a>
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which ticket we&apos;d pick</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            For a genuine first Shanghai weekend, Grandstand K is the sharpest pick — F1&apos;s own guide names it
            the best seat for overtaking, facing the exit of the circuit&apos;s signature hairpin, and at 2026&apos;s
            price it sat in the same US$224-238 tier as Grandstand H rather than the pricier A/B tier. Grandstand A
            on the main straight is the honest step-up if you want the fullest view of the whole race — start, pit
            strategy, and finish — rather than one specific corner, at roughly US$309-464 by 2026&apos;s pricing.
            Both figures are last year&apos;s real prices, used here as the best available estimate until Formula 1
            publishes 2027 numbers. The full grandstand-by-grandstand comparison lives in the{" "}
            <a href={`/event-pack/${eventSlug}/tickets`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Ticket Guide
            </a>
            .
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">If you&apos;re considering hospitality</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            &quot;Luxury&quot; ticket pricing above spans a real ladder, not one product. F1 Experiences&apos; own real,
            confirmed 2027 packages start at US$1,099 for Starter (Grandstand H/K plus a pit lane walk and track
            tour) and run to US$2,099 for Hero (Grandstand A, with added paddock-adjacent access) — both genuinely
            priced for 2027, not a proxy. The full F1 Paddock Club sits well above that, at roughly US$17,145 by
            2026&apos;s pricing (2027 Paddock Club pricing hasn&apos;t been published yet), and is a different kind
            of product entirely — a pit-side hospitality suite, not a grandstand-plus-extras package. Don&apos;t
            read the US$1,099&ndash;US$17,145 range as one smooth scale; it&apos;s three distinct tiers with a large
            gap between the F1 Experiences packages and full Paddock Club.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Where we&apos;d spend the hotel budget</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Jiading is the right default if the race is the priority — a short trip to the circuit instead of the
            real ~60-minute Metro Line 11 journey from downtown. Downtown Shanghai trades that convenience for a
            genuinely better city stay, worth it if this trip is a proper Shanghai visit with the race as one part
            of it. See the{" "}
            <a href={`/event-pack/${eventSlug}/hotels`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Where to Stay guide
            </a>{" "}
            for the full breakdown of both.
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
