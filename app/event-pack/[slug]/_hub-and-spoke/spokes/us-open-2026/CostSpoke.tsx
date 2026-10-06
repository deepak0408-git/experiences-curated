import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import { formatMoneyRange } from "@/app/planner/_lib/mockEvents";
import SpokeShell from "../../_components/SpokeShell";

const SPOKE_ID = "cost";
const TRIP_NIGHTS = 4;

// Real seeded planner_ticket_tier_cost (4 tiers), planner_hotel_tier_cost
// (4 tiers), and planner_destination_bands (1 row) rows drive this spoke —
// all confirmed present 5 Oct 2026. Same pattern as French Open's CostSpoke.
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
    { label: "Budget", hotel: budgetHotel, ticket: tier1Ticket, hotelNote: "A budget hotel in Queens", ticketNote: "Grounds Admission pass" },
    { label: "Moderate", hotel: moderateHotel, ticket: tier2Ticket, hotelNote: "A mid-range NYC hotel", ticketNote: "Grandstand ticket" },
    { label: "Splurge", hotel: splurgeHotel, ticket: tier3Ticket, hotelNote: "A well-located hotel near the 7 train", ticketNote: "Arthur Ashe / Louis Armstrong ticket" },
    { label: "Luxury", hotel: luxuryHotel, ticket: tier4Ticket, hotelNote: "A Manhattan luxury stay", ticketNote: "Official hospitality — see the Luxury Guide" },
  ].filter((p) => p.hotel);

  // New York City excluded — seeded $0-$0 same-city origin, meaningless in
  // an aggregate range (same pattern as French Open's Paris exclusion, skill
  // §2a-2). Scoped to real US domestic origin markets only — the rest of the
  // seeded rows are major international markets (Europe, Asia-Pacific, Latin
  // America, Canada), which belong on the Planner's own per-route lookup,
  // not blended into one misleading headline number.
  const US_ORIGIN_CITIES = ["Philadelphia", "Atlanta", "Boston", "Chicago", "Dallas", "Los Angeles", "Miami", "San Francisco", "Washington D.C."];
  const usFlights = flights.filter((f) => US_ORIGIN_CITIES.includes(f.originMarket));
  const flightRange = usFlights.length
    ? {
        low: Math.min(...usFlights.map((f) => Number(f.costLow))),
        high: Math.max(...usFlights.map((f) => Number(f.costHigh))),
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
      eventName="US Open"
      status="teaser"
      h1="Real hotel, ticket, and daily-spend numbers — no estimates"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="Every number above is real and free — the pack doesn't unlock more prices, it unlocks the decision. Which ticket route is actually worth it, how to time your purchase around the on-sale wave instead of the draw, whether a day or night session is the better buy, how to actually do a night session right, and where to spend the hotel budget."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        The US Open runs the same two weeks every late August and early September, so there&apos;s no shoulder-season
        discount to chase. The real swing in cost comes from which ticket tier you buy — Grounds Admission,
        Grandstand, Ashe/Armstrong, or hospitality — and whether you stay near the grounds in Queens or in Manhattan
        and commute in on the 7 train.
      </p>

      {moderateTotal && (
        <div className="mb-8">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Typical {TRIP_NIGHTS}-night trip</p>
          <p className="text-3xl sm:text-4xl font-black text-white">
            {formatMoneyRange(moderateTotal.low, moderateTotal.high)}
          </p>
          <p className="text-xs text-[#6A6A6A] mt-1">
            A mid-range hotel, food, local transport, and a Grandstand ticket for {TRIP_NIGHTS} nights.{" "}
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
      <p className="text-xs text-[#6A6A6A] mb-3">For the Moderate trip above — mid-range hotel, Grandstand ticket.</p>
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

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-4">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">The real booking-timing trap</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Unlike Wimbledon or Roland-Garros, the US Open sells tickets first-come-first-served, not by ballot — but
          that means the best sessions genuinely sell out, sometimes months ahead for marquee Ashe nights. Buy as
          soon as the schedule and your trip dates are confirmed rather than waiting for the draw, since by the time
          seeds are known the best remaining tickets are gone or resale-priced.
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
            round-trip, economy, if you&apos;re flying from within the US.
          </p>
        )}
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          Flying in from Europe, Asia-Pacific, Latin America, or further afield costs meaningfully more, so
          we&apos;re not folding every region into one misleading blended number here. Tell the Planner where
          you&apos;re starting from and it&apos;ll give you a real range for your actual route.
        </p>
        <a
          href={`/price-radar/${eventSlug}`}
          className="inline-flex items-center px-4 py-2 rounded-sm border border-[#AAFF00] text-[#AAFF00] text-xs font-black hover:bg-[#AAFF00] hover:text-black transition-colors"
        >
          Check full trip costs from your city →
        </a>
      </div>

      <p className="text-sm text-[#A3A3A3] leading-7 mt-8 mb-8">
        See the full{" "}
        <a href={`/event-pack/${eventSlug}/hotels`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
          Where to Stay guide
        </a>{" "}
        for the real strategic choice between Manhattan and Queens, and the full{" "}
        <a href={`/event-pack/${eventSlug}/tickets`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
          Ticket Guide
        </a>{" "}
        for a real comparison of every tier.
      </p>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which ticket route we&apos;d pick</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            A Grounds Admission pass for most of your trip plus one Ashe or Armstrong day for a marquee match is the
            sharpest combination for a first US Open. The Grounds Pass covers real tennis across the outer courts and
            the practice facility, and one reserved-seat day buys the real Grand Slam atmosphere without paying for
            it every day. Buy as soon as your trip dates are set — the best sessions sell out ahead of the draw, not
            after it. Full route-by-route detail lives in the{" "}
            <a href={`/event-pack/${eventSlug}/tickets`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Ticket Guide
            </a>
            .
          </p>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Time your trip to the on-sale wave, not the tournament</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Unlike Wimbledon or Roland-Garros, there&apos;s no ballot to work around here — the US Open sells
            first-come-first-served, in waves starting in spring. That changes what a budget trip actually looks
            like: the sessions available in the first on-sale wave are priced lower and sell at face value, while
            the same session bought later, closer to the tournament or after the draw is out, is both pricier and
            more likely to mean paying resale rates on the official marketplace. Buying the moment tickets open,
            before you know who&apos;s actually playing, is the single biggest lever on total cost here — not
            waiting to see the draw first.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Day sessions are the better buy early on</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            A Grounds Admission day covers multiple courts and rotates through several matches for one price — a
            night session commits the whole evening to two pre-selected matches in Ashe alone, at a higher price
            per match in the first week when the draw hasn&apos;t thinned yet. That relationship flips in the
            second week, once the field is down to the last 8 or 16 and a night session is reliably built around a
            genuinely high-stakes matchup. If budget is the priority and you&apos;re visiting early in the
            tournament, buy day sessions and save the one night session for later in your trip.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Getting a night session right</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            The first match starts at 7pm, but the second — often the one worth staying for — regularly doesn&apos;t
            start until 9:30pm or later, and runs past midnight if it goes five sets. Plan the day around that:
            don&apos;t book an early grounds session the same morning, and eat before you arrive rather than
            relying on concessions during the changeover crush. The 7 train runs late and Mets-Willets Point
            handles the post-match crowd well, so there&apos;s no need to leave early to beat traffic the way you
            might at a stadium with a parking lot to clear. If you can only afford one night session, the second
            week is worth the premium over an early-round night — it&apos;s where the tournament&apos;s real
            atmosphere lives.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Where we&apos;d spend the hotel budget</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Put the money into a Queens hotel near the 7 train if a night session is actually part of your trip —
            the short, predictable ride back matters most on a day you&apos;re not leaving the grounds until after
            midnight, and Queens has genuinely limited hotel stock that sells out well before the tournament
            starts, so book the moment your dates are set rather than waiting on ticket confirmation. If your trip
            is mostly day sessions, or the US Open is one stop inside a longer New York trip, Manhattan opens up far
            more rooms and price points for a commute that only costs you 40 minutes each way. See the{" "}
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
