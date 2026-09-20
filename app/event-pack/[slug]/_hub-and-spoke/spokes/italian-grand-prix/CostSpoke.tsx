import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import { formatMoneyRange } from "@/app/planner/_lib/mockEvents";
import SpokeShell from "../../_components/SpokeShell";

const SPOKE_ID = "cost";
const TRIP_NIGHTS = 3;

// planner_flight_cost/planner_hotel_tier_cost/planner_ticket_tier_cost rows
// exist for Italian GP under edition_year: 2027 as of 19 Sep 2026 — but
// they are a direct COPY of real 2026 research (49 flight rows, 4 hotel
// rows, 4 ticket rows), not fresh 2027 pricing. Real 2027 F1 ticket prices
// aren't published yet, and Google Flights' ~10-month booking horizon
// blocks searching the real 2027 dates until roughly mid-to-late Nov 2026.
// The founder's explicit call (19 Sep 2026): go live now with 2026 numbers
// as an honest placeholder rather than wait, and re-research for real 2027
// once the horizon opens. See scripts/seed-italian-gp-2027-copy-2026-placeholder.mjs
// and memory project_italian_gp_2027_planner_placeholder. The calculated-
// total UI below now renders normally (real rows exist), but the ticket
// portion of that total is 2026 pricing carried forward — disclosed via the
// note under the headline figure, not silently presented as confirmed 2027
// pricing.
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
    { label: "Budget", hotel: budgetHotel, ticket: tier1, note: "A budget stay near Monza or a short train ride out from Milan", ticketNote: "General Admission (Prato)" },
    { label: "Moderate", hotel: moderateHotel, ticket: tier2, note: "A well-located Milan hotel, 9 minutes from Monza by train", ticketNote: "Grandstand 5 or 22" },
    { label: "Splurge", hotel: splurgeHotel, ticket: tier3, note: "Hotel de la Ville-tier Monza luxury, 2km from the circuit", ticketNote: "Grandstand 1 or 26" },
    { label: "Luxury", hotel: luxuryHotel, ticket: tier4, note: "A genuine luxury Milan base with a driver for race days", ticketNote: "Paddock Club / Champions Club" },
  ].filter((p) => p.hotel);

  // Milan excluded — it's the event's own destination city, seeded at
  // costLow/costHigh 0.00 per the same-city origin rule (no flight needed),
  // not a real fare; left in unfiltered, it drags the blended low to $0.
  // Moscow, Manchester, Rome, London excluded — founder call, 19 Sep 2026:
  // the extremes in the seeded set (Moscow $1,176-$1,653 high end,
  // Manchester $51 / London $72 low end, Rome $664 high end) skewed the
  // blended range wide enough to look implausible. All 4 stay seeded and
  // available via the Planner's own per-origin lookup — just excluded from
  // this blended range.
  const EUROPE_RANGE_EXCLUDED_ORIGINS = ["Milan", "Moscow", "Manchester", "Rome", "London"];
  const euFlights = flights.filter((f) => f.region === "Europe" && !EUROPE_RANGE_EXCLUDED_ORIGINS.includes(f.originMarket));
  const flightRange = euFlights.length
    ? {
        low: Math.min(...euFlights.map((f) => Number(f.costLow))),
        high: Math.max(...euFlights.map((f) => Number(f.costHigh))),
      }
    : null;

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Italian Grand Prix"
      status="teaser"
      h1="What a real Monza weekend costs, by budget"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="What's real and sourced is free above. The pack adds our direct verdict on which grandstand and which Milan neighborhood we'd actually pick for a first Monza weekend, plus the booking-window detail that matters most this year — several stands have a track record of selling out months ahead."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Monza is unusual among F1 circuits for genuinely offering both ends of the spectrum: a General Admission
        Prato ticket that gets you into the park for roughly €50-100 a day, and a Grandstand 1 seat that&apos;s
        historically the most expensive reserved seat on the calendar. Most visitors also base themselves in Milan
        rather than Monza itself, so a real cost estimate has to account for a short daily train commute, not just
        a hotel bill.
      </p>

      {moderateTotal ? (
        <div className="mb-8">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Typical {TRIP_NIGHTS}-night trip</p>
          <p className="text-3xl sm:text-4xl font-black text-white">
            {formatMoneyRange(moderateTotal.low, moderateTotal.high)}
          </p>
          <p className="text-xs text-[#6A6A6A] mt-1">
            A well-located Milan hotel, food, local transport, and a mid-tier grandstand 3-day ticket, for {TRIP_NIGHTS} nights.{" "}
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
          <p className="text-xs text-[#6A6A6A] mt-1">
            2027 F1 ticket prices aren&apos;t published yet — the ticket portion of this total uses 2026 pricing as
            the closest real reference point, carried forward until Monza confirms 2027 prices.
          </p>
        </div>
      ) : (
        <div className="mb-8 rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Real pricing not live yet</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            We haven&apos;t finished sourcing verified hotel, ticket, and flight cost data for Milan and Monza yet.
            This section will show a real, sourced cost breakdown once that research is complete.
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
          <p className="text-xs text-[#6A6A6A] mb-3">For the Moderate trip above — Milan hotel, mid-tier grandstand ticket.</p>
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
            round-trip, economy, if you&apos;re flying from within Europe.
          </p>
        ) : (
          <p className="text-sm text-[#A3A3A3] leading-6 mb-2">
            Flight cost ranges for this destination haven&apos;t been sourced yet.
          </p>
        )}
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          Milan is served by two airports — Malpensa (MXP) for most long-haul and international flights, and
          Linate (LIN) for many short-haul European routes, both with a straightforward transfer into the city.
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
            For a genuine first Monza weekend, Grandstand 26 on the pit-lane-and-podium side of the main straight is
            the strongest all-round pick — covered seating, a clear view of the grid, pit lane, and podium
            ceremony. If General Admission is more your budget, the Lesmo 2 bleachers are the sharper GA pick over
            the more obvious Curva Grande default — proper tiered seating, a screen, and a genuine sense of a
            driver working through a technical sequence rather than just a fast straight. The full
            grandstand-by-grandstand comparison lives in the{" "}
            <a href={`/event-pack/${eventSlug}/tickets`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Ticket Guide
            </a>
            .
          </p>

          <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-4 mb-8">
            <p className="text-sm font-bold text-white mb-1.5">Buy official, book early — Monza sells out fast</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Buy via monzanet.it, the circuit&apos;s own official ticketing site, first. Grandstand 1 in particular
              has historically been among the first to sell through given its start-line-and-pit-lane view, and
              this is Ferrari&apos;s home race — demand runs higher here than at almost any other round on the
              calendar. Paddock Club and Champions Club are a separate hospitality product entirely — see the
              Luxury Guide for the real booking mechanics.
            </p>
            <a
              href="https://www.monzanet.it/en/tickets/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 text-xs text-[#AAFF00] hover:text-[#BBFF33] underline"
            >
              monzanet.it — official tickets →
            </a>
          </div>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Where we&apos;d spend the hotel budget</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Basing yourself in Milan is the right default for a genuine first Monza trip — a 9-minute train ride
            each way, and a real city to come back to every evening of the weekend, rather than a small town with
            limited dining and nightlife once the circuit gates close. Hotel de la Ville in Monza itself is the
            honest exception — the only luxury hotel in Monza, 2km from the circuit, and where the F1 teams
            actually stay. See the{" "}
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
