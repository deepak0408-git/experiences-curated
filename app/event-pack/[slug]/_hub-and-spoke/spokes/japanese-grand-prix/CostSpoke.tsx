import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import { formatMoneyRange } from "@/app/planner/_lib/mockEvents";
import SpokeShell from "../../_components/SpokeShell";

const SPOKE_ID = "cost";
const TRIP_NIGHTS = 3;

// planner_hotel_tier_cost, planner_ticket_tier_cost, planner_flight_cost,
// and planner_destination_bands are all seeded for Suzuka as of 22 Sep 2026
// (see scripts/seed-japanese-gp-nagoya-hotels.mjs for hotels' full sourcing/
// methodology; tickets/flights/destination bands seeded in a separate
// session same day) — real full totals render, not the placeholder.
//
// Bug found and fixed 29 Sep 2026: planner_hotel_tier_cost rows were
// seeded with seasonal_band "Apr" (capitalized) instead of the lowercase
// "apr" getSpokeData.ts's SEASONAL_BAND_BY_MONTH produces — a case-
// sensitive eq() mismatch silently zeroed out the hotels query, which made
// moderateTotal null and forced this whole spoke onto its "not live yet"
// fallback despite every other cost table having real data. Fixed via
// scripts/fix-japanese-gp-hotel-seasonal-band-casing.mjs (persisted, ran
// successfully). stayTotal() below's defensive $0-if-missing handling for
// destinationBand was never the actual problem — that data existed the
// whole time too.
//
// Example hotel names shown under each tile below are real, individually
// researched hotels from that same Booking.com sample (not from any DB
// table — planner_hotel_tier_cost only stores aggregated tier ranges, no
// per-hotel names) — picked as the top 2 by review score within each tier
// (top 1 for luxury, a single-hotel tier — see the seed script's header for
// why). Illustrative only; not a live booking link.
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
    {
      label: "Budget",
      hotel: budgetHotel,
      ticket: tier1,
      note: "A budget stay near Nagoya Station",
      ticketNote: "General Admission",
      exampleHotels: ["The Royal Park Canvas Nagoya", "APA Hotel Nagoya Marunouchi Ekimae"],
    },
    {
      label: "Moderate",
      hotel: moderateHotel,
      ticket: tier2,
      note: "A solid business hotel near Nagoya Station",
      ticketNote: "Grandstand G or Q2 (same grouped tier)",
      exampleHotels: ["Nagoya JR Gate Tower Hotel", "Mitsui Garden Hotel Nagoya Premier"],
    },
    {
      label: "Splurge",
      hotel: splurgeHotel,
      ticket: tier3,
      note: "An upscale hotel with real amenities near the station",
      ticketNote: "V1/V2 Grandstand",
      exampleHotels: ["Nikko Style Nagoya", "Nagoya Kanko Hotel"],
    },
    {
      label: "Luxury",
      hotel: luxuryHotel,
      ticket: tier4,
      note: "Nagoya's top-tier hotels",
      ticketNote: "Hospitality (Paddock/Champions Club)",
      exampleHotels: ["The Tower Hotel Nagoya"],
    },
  ].filter((p) => p.hotel);

  // "Tokyo" excluded alongside Nagoya/Suzuka — same-city-origin $0 rows
  // (feedback_same_city_origin_flight_range memory). planner-data-
  // researcher seeded Tokyo as the same-country/no-flight-needed origin for
  // this event rather than Nagoya/Suzuka directly (neither is a standard
  // 49-market origin city), so it carries the same costLow=costHigh=0.00
  // placeholder and must be excluded from the aggregate range the same way.
  //
  // Melbourne/Sydney/Dubai/Doha also excluded, per founder direction 29 Sep
  // 2026 — these 4 are seeded under the "Asia-Pacific" region facet but
  // aren't the Asia markets a "flying from within Asia-Pacific" claim
  // implies (Oceania / Middle East), and Dubai/Melbourne were the ones
  // stretching the displayed range out to $2,208.
  const apacFlights = flights.filter(
    (f) =>
      f.region === "Asia-Pacific" &&
      f.originMarket !== "Nagoya" &&
      f.originMarket !== "Suzuka" &&
      f.originMarket !== "Tokyo" &&
      f.originMarket !== "Melbourne" &&
      f.originMarket !== "Sydney" &&
      f.originMarket !== "Dubai" &&
      f.originMarket !== "Doha"
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
      eventName="Japanese Grand Prix"
      status="teaser"
      h1="What a real Suzuka weekend costs, by budget"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="Every number above is real and free — the pack doesn't unlock more prices, it unlocks the decision. For your budget, we'll tell you which grandstand and which Nagoya neighborhood we'd actually pick for a first Suzuka weekend."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        The numbers below will cover a real full-trip estimate for the standard 3-day (Friday–Sunday) ticket
        structure: hotel, food, local transport, and a Suzuka ticket. Suzuka sells a genuine General Admission
        tier — a roaming ticket with no fixed seat — alongside a full range of reserved grandstands, so the
        cheapest real option here is a wristband, not a fixed seat.
      </p>

      {moderateTotal ? (
        <div className="mb-8">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Typical {TRIP_NIGHTS}-night trip</p>
          <p className="text-3xl sm:text-4xl font-black text-white">
            {formatMoneyRange(moderateTotal.low, moderateTotal.high)}
          </p>
          <p className="text-xs text-[#6A6A6A] mt-1">
            A solid Nagoya business hotel, food, local transport, and a mid-tier grandstand 3-day ticket, for {TRIP_NIGHTS} nights.{" "}
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
            We haven&apos;t finished sourcing verified 2027 hotel, ticket, and flight cost data for Suzuka/Nagoya
            yet — this is a genuinely new event and pricing this far out isn&apos;t stable enough to publish. This
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
                  {p.exampleHotels.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-[#2A2A2A]">
                      <p className="text-[10px] font-black tracking-widest uppercase text-[#6A6A6A] mb-1">
                        {p.exampleHotels.length > 1 ? "Example hotels" : "Example hotel"}
                      </p>
                      <ul className="space-y-0.5">
                        {p.exampleHotels.map((name) => (
                          <li key={name} className="text-xs text-[#A3A3A3] pl-3 -indent-3">• {name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      <div id="flights" className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5">
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
          Flying in from Europe, North America, Africa, or Australia costs meaningfully more —
          Chubu Centrair (NGO) is the primary arrival airport for this trip, with Narita (NRT) plus a Shinkansen
          connection as the real, slower alternative. Tell the Planner where you&apos;re starting from for a real
          number on your actual route.
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
            For a genuine first Suzuka weekend, Grandstand G is the strongest all-round pick — a real 130R seat,
            the corner the whole back section of the circuit builds toward, without the premium of the Q2 or
            V1/V2 tiers. General Admission is a real, honest budget option here, not a compromise — the West Open
            Area still gets you a genuinely good view of several corners if you move early. The full
            grandstand-by-grandstand comparison lives in the{" "}
            <a href={`/event-pack/${eventSlug}/tickets`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Ticket Guide
            </a>
            .
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Where we&apos;d spend the hotel budget</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Nagoya Station is the right default for a first Suzuka trip — Suzuka&apos;s own hotel stock is limited
            and goes to F1 teams and media first, so basing yourself in Nagoya isn&apos;t a compromise, it&apos;s
            genuinely the standard approach. See the{" "}
            <a href={`/event-pack/${eventSlug}/hotels`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Where to Stay guide
            </a>{" "}
            for the full breakdown.
          </p>
        </div>
      )}
    </SpokeShell>
  );
}
