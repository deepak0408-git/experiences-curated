import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import { formatMoneyRange } from "@/app/planner/_lib/mockEvents";
import SpokeShell from "../../_components/SpokeShell";

const SPOKE_ID = "cost";
const TRIP_NIGHTS = 3;

// Real, seeded data as of 6 Sep 2026: planner_hotel_tier_cost and
// planner_destination_bands for Mexico City, planner_ticket_tier_cost for
// Mexico City GP (4 tiers — tier1 GA sourced from GPDestinations.com since
// no GA product exists on tickets.formula1.com itself; tier2-4 sourced
// directly from tickets.formula1.com, EUR→USD — see
// scripts/seed-mexico-city-gp-ticket-tiers.mjs), and planner_flight_cost
// across all 49 origin markets. Trip length set to 3 nights, matching the
// real 3-day Fri-Sun ticket structure this event actually sells. Same
// structure as United States GP's CostSpoke.tsx (most recent F1 reference).
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

  // Budget pairs with tier1 (General Admission), Moderate with tier2 (lower
  // grandstands), Splurge with tier3 (Main Grandstand/premium), Luxury with
  // tier4 (Paddock Club/House 44) — same spend-level pairing pattern as
  // every other hub-and-spoke event's Cost spoke.
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
    { label: "Budget", hotel: budgetHotel, ticket: tier1, note: "A well-reviewed budget stay in Roma Norte or Condesa", ticketNote: "General Admission" },
    { label: "Moderate", hotel: moderateHotel, ticket: tier2, note: "A solid 3-4 star hotel in Roma Norte, Condesa, or Polanco", ticketNote: "Grandstand 15/14/5A" },
    { label: "Splurge", hotel: splurgeHotel, ticket: tier3, note: "An upscale hotel with real amenities and a better location", ticketNote: "Main Grandstand / 10 / 11" },
    { label: "Luxury", hotel: luxuryHotel, ticket: tier4, note: "Ultra-luxury Polanco or Roma Norte stays", ticketNote: "Paddock Club / House 44" },
  ].filter((p) => p.hotel);

  // North America is the real dominant fan-travel base for this event —
  // unlike US GP, Mexico City GP is a genuine international fly-in
  // destination, so no market exclusions applied here (contrast US GP's
  // Canadian-market exclusion, which was scoped to that event's specific
  // domestic-fan pattern, not a general rule).
  const naFlights = flights.filter((f) => f.region === "North America");
  const flightRange = naFlights.length
    ? {
        low: Math.min(...naFlights.map((f) => Number(f.costLow))),
        high: Math.max(...naFlights.map((f) => Number(f.costHigh))),
      }
    : null;

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Mexico City Grand Prix"
      status="teaser"
      h1="What a real Mexico City GP weekend costs, by budget"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="Every number above is real and free — the pack doesn't unlock more prices, it unlocks the decision. For your budget, we'll tell you which grandstand and which neighborhood we'd actually pick for a first Mexico City GP, plus the booking-window detail that matters most this year."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        The numbers below cover a real full-trip estimate for the standard 3-day (Friday-Sunday) ticket structure:
        hotel, food, local transport, and a grandstand ticket.
      </p>

      {moderateTotal && (
        <div className="mb-8">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Typical {TRIP_NIGHTS}-night trip</p>
          <p className="text-3xl sm:text-4xl font-black text-white">
            {formatMoneyRange(moderateTotal.low, moderateTotal.high)}
          </p>
          <p className="text-xs text-[#6A6A6A] mt-1">
            A 3-4 star hotel, food, local transport, and a mid-tier grandstand 3-day ticket, for {TRIP_NIGHTS} nights.{" "}
            <span className="text-[#AAFF00]">Excludes flights</span>,{" "}
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

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-1">Where the money goes</p>
      <p className="text-xs text-[#6A6A6A] mb-3">For the Moderate trip above — 3-4 star hotel, mid-tier grandstand ticket.</p>
      <div className="flex flex-col gap-2 mb-8">
        {tier2 && (
          <CategoryRow label="Ticket (grandstand)" low={Math.round(Number(tier2.costLow))} high={Math.round(Number(tier2.costHigh))} unit="3-day" />
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
            round-trip, economy, if you&apos;re flying from within North America.
          </p>
        )}
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          Flying in from Europe, Asia-Pacific, South America, or Africa costs meaningfully more — Mexico City
          International (MEX) is the arrival airport for this trip. Tell the Planner where you&apos;re starting
          from for a real number on your actual route.
        </p>
        <a
          href="/planner"
          className="inline-flex items-center px-4 py-2 rounded-sm border border-[#AAFF00] text-[#AAFF00] text-xs font-black hover:bg-[#AAFF00] hover:text-black transition-colors"
        >
          Check flight costs from your city →
        </a>
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which ticket tier we&apos;d pick</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            For a genuine first Mexico City GP, Main Grandstand or Grandstand 10/11 ({tier3 && formatMoneyRange(Math.round(Number(tier3.costLow)), Math.round(Number(tier3.costHigh)))}{" "}for the 3-day ticket) are the strongest all-round pick — closest to the main straight and pit lane, with
            the best sightlines on the circuit. Foro Sol (Grandstands 14/15, {tier2 && formatMoneyRange(Math.round(Number(tier2.costLow)), Math.round(Number(tier2.costHigh)))}{" "}for the 3-day ticket) trades sightline quality for the loudest, most stadium-like atmosphere on the calendar
            and the podium ceremony. General Admission ({tier1 && formatMoneyRange(Math.round(Number(tier1.costLow)), Math.round(Number(tier1.costHigh)))}{" "}for the 3-day ticket) is a real, legitimate way to do your first Mexico City GP weekend on a budget — you lose a
            reserved seat, not the atmosphere. The full grandstand-by-grandstand comparison lives in the{" "}
            <a href={`/event-pack/${eventSlug}/tickets`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Ticket Guide
            </a>
            .
          </p>

          <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-4 mb-8">
            <p className="text-sm font-bold text-white mb-1.5">Buy official, book early — this year specifically</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Buy only via the official F1 ticketing site first — this race has genuinely sold out within a single
              day of tickets going on sale in recent seasons. Paddock Club and House 44 at F1 Paddock Club™ (from{" "}
              {tier4 && formatMoneyRange(Math.round(Number(tier4.costLow)), Math.round(Number(tier4.costHigh)))}{" "}
              for the 3-day package) are a separate hospitality product entirely — see the Luxury Guide for the real
              booking mechanics.
            </p>
            <a
              href="https://tickets.formula1.com/en/f1-4861-mexico"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 text-xs text-[#AAFF00] hover:text-[#BBFF33] underline"
            >
              tickets.formula1.com — official tickets →
            </a>
          </div>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Where we&apos;d spend the hotel budget</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Roma Norte is the right default for a genuine first Mexico City GP — walkable, food-forward, and the
            neighborhood most first-timers end up recommending to the next first-timer. Condesa trades a little of
            that energy for a quieter, park-adjacent pace; Polanco is the polished, secure option, at the cost of
            being furthest from the circuit. Book earlier than usual this year specifically — race weekend lands
            directly on Día de Muertos, one of the busiest tourism weekends in the city&apos;s calendar. See the{" "}
            <a href={`/event-pack/${eventSlug}/hotels`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Where to Stay guide
            </a>{" "}
            for the full breakdown of all three.
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
