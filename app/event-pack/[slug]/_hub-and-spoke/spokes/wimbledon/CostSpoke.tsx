import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import { formatMoneyRange } from "@/app/planner/_lib/mockEvents";
import SpokeShell from "../../_components/SpokeShell";

const SPOKE_ID = "cost";
const TRIP_NIGHTS = 4;

// Rebuilt 15 Aug 2026 once real cost data existed for all 4 inputs
// (planner_hotel_tier_cost seeded same day; planner_ticket_tier_cost and
// planner_destination_bands already seeded 14/23 Jul 2026; planner_flight_cost
// seeded 12 Aug 2026, 49 origin markets). Same pattern as Shanghai Masters'
// CostSpoke — folded into a headline total, not a placeholder.
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

  const tier1Ticket = tickets.find((t) => t.tier === "tier1");
  const tier2Ticket = tickets.find((t) => t.tier === "tier2");
  const tier3Ticket = tickets.find((t) => t.tier === "tier3");
  const tier4Ticket = tickets.find((t) => t.tier === "tier4");

  const tripTotal = (hotel: typeof moderateHotel, ticket: typeof tier2Ticket) => {
    if (!hotel) return null;
    const stayLow = Number(hotel.costLow) * TRIP_NIGHTS + (destinationBand ? (Number(destinationBand.localTravelLow) + Number(destinationBand.foodPerDayLow)) * TRIP_NIGHTS : 0);
    const stayHigh = Number(hotel.costHigh) * TRIP_NIGHTS + (destinationBand ? (Number(destinationBand.localTravelHigh) + Number(destinationBand.foodPerDayHigh)) * TRIP_NIGHTS : 0);
    const ticketLow = ticket ? Number(ticket.costLow) : 0;
    const ticketHigh = ticket ? Number(ticket.costHigh) : 0;
    return { low: Math.round(stayLow + ticketLow), high: Math.round(stayHigh + ticketHigh) };
  };

  const moderateTotal = tripTotal(moderateHotel, tier2Ticket);

  const profiles = [
    { label: "Budget", hotel: budgetHotel, ticket: tier1Ticket, hotelNote: "A budget London hotel or SW19 guesthouse", ticketNote: "Grounds Pass" },
    { label: "Moderate", hotel: moderateHotel, ticket: tier2Ticket, hotelNote: "A solid 3-star hotel", ticketNote: "Show Courts ticket" },
    { label: "Splurge", hotel: splurgeHotel, ticket: tier3Ticket, hotelNote: "A 4-star hotel", ticketNote: "Centre Court ticket" },
    { label: "Luxury", hotel: luxuryHotel, ticket: tier4Ticket, hotelNote: "London's top hotels", ticketNote: "The Lawn hospitality — see the Luxury Guide" },
  ].filter((p) => p.hotel);

  // Same-city origin (London) is seeded $0-$0 by design — real for the
  // Planner's per-origin lookup, meaningless in an aggregate range, so it's
  // excluded here explicitly (per hub-and-spoke skill §2a-2, same fix as
  // Shanghai Masters' CostSpoke). Sorted by high end, the real seeded data
  // has a natural break after Rome ($399) before jumping to Barcelona
  // ($509), Amsterdam ($624), Zurich ($742), and Moscow ($2,058) — those 4
  // are excluded from this headline range as outliers next to the rest of
  // Europe's tight $122-$399 band (Paris/Manchester/Madrid/Dublin/Milan/
  // Munich/Berlin/Stockholm/Rome). Moscow has a real routing reason (no
  // direct flights to London, airspace closures forcing expensive
  // connections); the other 3 have no routing explanation, just higher real
  // fares in the dataset. All 4 stay seeded and available via the Planner's
  // own per-origin lookup — just excluded from this blended range so it
  // reflects normal, representative European travel. Founder direction,
  // 15-16 Aug 2026.
  const EUROPE_RANGE_EXCLUDED_ORIGINS = ["London", "Barcelona", "Amsterdam", "Zurich", "Moscow"];
  const europeFlights = flights.filter(
    (f) => f.region === "Europe" && !EUROPE_RANGE_EXCLUDED_ORIGINS.includes(f.originMarket)
  );
  const flightRange = europeFlights.length
    ? {
        low: Math.min(...europeFlights.map((f) => Number(f.costLow))),
        high: Math.max(...europeFlights.map((f) => Number(f.costHigh))),
      }
    : null;

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Wimbledon"
      status="teaser"
      h1="Real hotel, ticket, and daily-spend numbers — no estimates"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="Every number above is real and free — the pack doesn't unlock more prices, it unlocks the decision. Which ticket route is actually worth the wait, whether to base yourself in the Village or central London, and exactly when to book each one before the Fortnight's short, fixed window closes it out."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Wimbledon is a genuinely fixed-cost trip in one sense — the Fortnight runs the same two weeks every year, so
        there&apos;s no shoulder-season discount to chase. The real swing in what you&apos;ll spend comes from two
        places: which of the three ticket routes you use (Queue, Ballot, or resale/hospitality), and whether you base
        yourself in SW19 or central London.
      </p>

      {moderateTotal && (
        <div className="mb-8">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Typical {TRIP_NIGHTS}-night trip</p>
          <p className="text-3xl sm:text-4xl font-black text-white">
            {formatMoneyRange(moderateTotal.low, moderateTotal.high)}
          </p>
          <p className="text-xs text-[#6A6A6A] mt-1">
            A 3-star hotel, food, local transport, and a Show Courts ticket for {TRIP_NIGHTS} nights.{" "}
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
                    <li className="text-xs text-[#6A6A6A] pl-3 -indent-3">• {p.hotelNote}</li>
                    <li className="text-xs text-[#6A6A6A] pl-3 -indent-3">• {p.ticketNote}</li>
                  </ul>
                </div>
              );
            })}
          </div>
        </>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-1">Where the money goes</p>
      <p className="text-xs text-[#6A6A6A] mb-3">For the Moderate trip above — 3-star hotel, Show Courts ticket.</p>
      <div className="flex flex-col gap-2 mb-8">
        {tier2Ticket && (
          <CategoryRow label="Ticket (Show Courts)" low={Number(tier2Ticket.costLow)} high={Number(tier2Ticket.costHigh)} unit="one day" />
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

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-4">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">The real booking-timing trap</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          The Fortnight is a fixed, short, high-demand window every year — unlike a destination with a shoulder
          season, there&apos;s no later date that gets cheaper. Book your hotel as soon as the following year&apos;s
          Championships dates are confirmed, not once you know which days you&apos;re going. SW19&apos;s own hotel
          stock is genuinely small, so it fills first; central London has more room to breathe but the
          Waterloo-adjacent properties this pack recommends still sell out for finals weekend.
        </p>
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
            round-trip, economy, if you&apos;re traveling from within Europe.
          </p>
        )}
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          Flying in from North America, Asia-Pacific, or further afield costs meaningfully more, so we&apos;re not
          folding every region into one misleading blended number here. Tell the Planner where you&apos;re starting
          from and it&apos;ll give you a real range for your actual route.
        </p>
        <a
          href="/planner"
          className="inline-flex items-center px-4 py-2 rounded-sm border border-[#AAFF00] text-[#AAFF00] text-xs font-black hover:bg-[#AAFF00] hover:text-black transition-colors"
        >
          Check flight costs from your city →
        </a>
      </div>

      <p className="text-sm text-[#A3A3A3] leading-7 mt-8 mb-8">
        See the full{" "}
        <a href={`/event-pack/${eventSlug}/hotels`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
          Where to Stay guide
        </a>{" "}
        for the real strategic choice between SW19 and central London, and the full{" "}
        <a href={`/event-pack/${eventSlug}/tickets`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
          Ticket Guide
        </a>{" "}
        for a real comparison of the Queue, the Ballot, and Debentures.
      </p>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which ticket route we&apos;d pick</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            The Grounds Pass alone — via the Queue — is a genuinely great first-timer day: it gets you onto the
            outer courts with no ballot luck required, and a resale ticket to a Show Court after 3pm is often the
            single best-value upgrade of the trip. The Ballot is worth entering every year regardless (it&apos;s
            free), but don&apos;t plan a first Wimbledon trip around winning it — the odds are long and you won&apos;t
            know until the previous September. Debentures and hospitality are the right call only if you want a
            guaranteed Centre Court seat on a specific day and can absorb the price without blinking. Full
            route-by-route detail lives in the{" "}
            <a href={`/event-pack/${eventSlug}/tickets`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Ticket Guide
            </a>
            .
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Where we&apos;d spend the hotel budget</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Put the money into the Village over central London if this is a genuine Wimbledon trip, not a one-day
            detour from a longer London stay — SW19 gives you the atmosphere and the 15-minute walk to the gates that
            central London can&apos;t. If Wimbledon really is one day inside a longer London trip, central London
            near Waterloo keeps the same fast 21-minute train without giving up a central base. See the{" "}
            <a href={`/event-pack/${eventSlug}/hotels`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Where to Stay guide
            </a>{" "}
            for named picks at every tier.
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
