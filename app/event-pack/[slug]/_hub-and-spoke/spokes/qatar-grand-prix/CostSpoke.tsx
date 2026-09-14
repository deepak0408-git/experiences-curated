import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import { formatMoneyRange } from "@/app/planner/_lib/mockEvents";
import SpokeShell from "../../_components/SpokeShell";

const SPOKE_ID = "cost";
const TRIP_NIGHTS = 3;

// planner_hotel_tier_cost/planner_ticket_tier_cost/planner_destination_bands/
// planner_flight_cost all seeded for Doha 13 Sep 2026 via
// planner-data-researcher's locked methodology — see project memory for
// sourcing detail. Lusail has no zone-split hotel market (Lusail and Doha
// overlap almost entirely on Booking.com), so hotels are tiered by real
// per-night price, not by area. Tier1 GA (Lusail Hill) sold out on the
// official platform by late Aug 2026 — its $219-265 range is founder-recalled,
// not confirmed live, flagged explicitly below rather than presented as
// fully verified.
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
    { label: "Budget", hotel: budgetHotel, ticket: tier1, note: "A well-reviewed budget stay in Doha or Lusail", ticketNote: "Lusail Hill GA (sold out)" },
    { label: "Moderate", hotel: moderateHotel, ticket: tier2, note: "A solid 3-4 star hotel in Doha or Lusail Marina", ticketNote: "T16 Grandstand" },
    { label: "Splurge", hotel: splurgeHotel, ticket: tier3, note: "An upscale hotel with real amenities and a better location", ticketNote: "North Grandstand or Main Grandstand" },
    { label: "Luxury", hotel: luxuryHotel, ticket: tier4, note: "Raffles/Four Seasons-tier Doha luxury stays", ticketNote: "Lusail Hill Lounge / Champions Club" },
  ].filter((p) => p.hotel);

  // No "Middle East" region exists in planner_origin_markets — Doha itself
  // sits under "Asia-Pacific" (correctly seeded as a $0 same-city row, which
  // must be excluded from any aggregate range per skill §2a-2). Africa plus
  // Dubai (Asia-Pacific-tagged but geographically Middle East) are the
  // closest real markets with seeded rows, so this folds Dubai in alongside
  // Africa rather than the much longer Asia-Pacific hauls (Sydney, Tokyo),
  // which would misleadingly widen the "nearby" range.
  const nearbyFlights = flights.filter(
    (f) => (f.region === "Africa" || f.originMarket === "Dubai") && f.originMarket !== "Doha"
  );
  const flightRange = nearbyFlights.length
    ? {
        low: Math.min(...nearbyFlights.map((f) => Number(f.costLow))),
        high: Math.max(...nearbyFlights.map((f) => Number(f.costHigh))),
      }
    : null;

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Qatar Grand Prix"
      status="teaser"
      h1="What a real Lusail weekend costs, by budget"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="Every number above is real and free — the pack doesn't unlock more prices, it unlocks the decision. For your budget, we'll tell you which grandstand and which Doha neighborhood we'd actually pick for a first Lusail weekend, plus which stand still has real availability now that GA is gone."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        The numbers below cover a real full-trip estimate for the standard 3-day (Friday-Sunday) ticket structure:
        hotel, food, local transport, and a race ticket. Qatar is a genuinely affordable race by F1 standards, though
        General Admission (Lusail Hill) reportedly sold out on the official platform by late Aug 2026 — the cheapest
        remaining ticket is now a grandstand seat, not a wristband.
      </p>

      {moderateTotal ? (
        <div className="mb-8">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Typical {TRIP_NIGHTS}-night trip</p>
          <p className="text-3xl sm:text-4xl font-black text-white">
            {formatMoneyRange(moderateTotal.low, moderateTotal.high)}
          </p>
          <p className="text-xs text-[#6A6A6A] mt-1">
            A 3-4 star hotel, food, local transport, and a T16 Grandstand 3-day ticket, for {TRIP_NIGHTS} nights.{" "}
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
      ) : (
        <div className="mb-8 rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Real pricing not live yet</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            We haven&apos;t finished sourcing verified 2026 hotel, ticket, and flight cost data for Doha yet. This
            section will show a real, sourced cost breakdown — not an estimate — once that research is complete.
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
          <p className="text-xs text-[#6A6A6A] mb-3">For the Moderate trip above — 3-4 star hotel, T16 Grandstand ticket.</p>
          <div className="flex flex-col gap-2 mb-8">
            {tier2 && (
              <CategoryRow label="Ticket (T16 Grandstand)" low={Math.round(Number(tier2.costLow))} high={Math.round(Number(tier2.costHigh))} unit="3-day" />
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
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Getting around, for free</p>
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
            round-trip, economy, if you&apos;re flying from within Middle East and Africa.
          </p>
        ) : (
          <p className="text-sm text-[#A3A3A3] leading-6 mb-2">
            Flight cost ranges for this destination haven&apos;t been sourced yet.
          </p>
        )}
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          Flying in from Europe, the Americas, or Asia-Pacific costs meaningfully more — Hamad International Airport
          (DOH) is the arrival airport for this trip, itself a well-reviewed stopover hub for several major airlines.
          Tell the Planner where you&apos;re starting from for a real number on your actual route.
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
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which grandstand we&apos;d pick</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            With GA gone, North Grandstand is the strongest value pick left — Turn 1&apos;s braking zone, no assigned
            seating so arriving early gets you a real choice of spot, and roughly $137 cheaper than Main Grandstand
            across the straight. If the podium and finish line matter more to you than the racing itself, Main
            Grandstand&apos;s assigned zone-and-row seating removes the scramble entirely, at a real premium. The
            full grandstand-by-grandstand comparison lives in the{" "}
            <a href={`/event-pack/${eventSlug}/tickets`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Ticket Guide
            </a>
            .
          </p>

          <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-4 mb-8">
            <p className="text-sm font-bold text-white mb-1.5">Buy official, and move fast — GA is proof this race sells out</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Buy only via the official F1 ticketing site — General Admission&apos;s sellout by late Aug 2026 shows
              this race no longer has a guaranteed late-buyer path, despite Qatar&apos;s reputation as an affordable
              stop on the calendar. Paddock Club and Champions Club are a separate hospitality product entirely — see
              the Luxury Guide for the real booking mechanics.
            </p>
            <a
              href="https://tickets.formula1.com/en/f1-56257-qatar"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 text-xs text-[#AAFF00] hover:text-[#BBFF33] underline"
            >
              tickets.formula1.com — official tickets →
            </a>
          </div>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Where we&apos;d spend the hotel budget</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Raffles Doha or Fairmont Doha in the Lusail Marina are the right default for a genuine first Lusail
            trip — walkable to the marina, short taxi to the circuit, and clear of West Bay&apos;s longer commute.
            Staybridge Suites Lusail trades some of that polish for real apartment-style value at the same proximity.
            See the{" "}
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
