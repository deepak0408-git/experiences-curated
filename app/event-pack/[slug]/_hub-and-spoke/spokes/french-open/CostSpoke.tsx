import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import { formatMoneyRange } from "@/app/planner/_lib/mockEvents";
import SpokeShell from "../../_components/SpokeShell";

const SPOKE_ID = "cost";
const TRIP_NIGHTS = 4;

// Real seeded planner_ticket_tier_cost (4 tiers, seeded 26 Aug 2026),
// planner_hotel_tier_cost (4 tiers, seeded 26 Aug 2026), and
// planner_destination_bands (seeded 23 Jul 2026) rows drive this spoke —
// same pattern as Wimbledon's CostSpoke. Paris same-city origin excluded
// from the flight range per skill §2a-2 (seeded $0-$0, meaningless in an
// aggregate range).
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
    { label: "Budget", hotel: budgetHotel, ticket: tier1Ticket, hotelNote: "Boulogne-Billancourt short-let or budget hotel", ticketNote: "Grounds Pass" },
    { label: "Moderate", hotel: moderateHotel, ticket: tier2Ticket, hotelNote: "A mid-range hotel near the venue", ticketNote: "Court Simonne-Mathieu ticket" },
    { label: "Splurge", hotel: splurgeHotel, ticket: tier3Ticket, hotelNote: "A well-located 4-star hotel", ticketNote: "Court Philippe-Chatrier / Suzanne-Lenglen ticket" },
    { label: "Luxury", hotel: luxuryHotel, ticket: tier4Ticket, hotelNote: "Hôtel Molitor or equivalent", ticketNote: "Official hospitality — see the Luxury Guide" },
  ].filter((p) => p.hotel);

  // Paris same-city origin excluded per skill §2a-2 — seeded $0-$0 by
  // design, meaningless in an aggregate range. No further outlier exclusion
  // needed here (unlike Wimbledon's London-specific outlier list) — the
  // Europe band here is a naturally tight $135-$662 range.
  const europeFlights = flights.filter((f) => f.region === "Europe" && f.originMarket !== "Paris");
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
      eventName="French Open"
      status="teaser"
      h1="Real hotel, ticket, and daily-spend numbers — no estimates"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="Every number above is real and free — the pack doesn't unlock more prices, it unlocks the decision. Which court tier is actually worth it, whether to stay near the venue or in central Paris, and the exact ballot/resale timing that decides whether you get a ticket at all."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Roland-Garros runs the same two weeks every late May and early June, so there&apos;s no shoulder-season
        discount to chase here either. The real swing in cost comes from which court tier you buy into — Grounds
        Pass, Simonne-Mathieu, Chatrier/Lenglen, or official hospitality — and whether you stay in the 16th
        arrondissement near the venue or take the cheaper trade-off across the Seine in Boulogne-Billancourt.
      </p>

      {moderateTotal && (
        <div className="mb-8">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Typical {TRIP_NIGHTS}-night trip</p>
          <p className="text-3xl sm:text-4xl font-black text-white">
            {formatMoneyRange(moderateTotal.low, moderateTotal.high)}
          </p>
          <p className="text-xs text-[#6A6A6A] mt-1">
            A mid-range hotel, food, local transport, and a Court Simonne-Mathieu ticket for {TRIP_NIGHTS} nights.{" "}
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
      <p className="text-xs text-[#6A6A6A] mb-3">For the Moderate trip above — mid-range hotel, Simonne-Mathieu ticket.</p>
      <div className="flex flex-col gap-2 mb-8">
        {tier2Ticket && (
          <CategoryRow label="Ticket (Court Simonne-Mathieu)" low={Number(tier2Ticket.costLow)} high={Number(tier2Ticket.costHigh)} unit="one day" />
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
          Roland-Garros tickets run on a ballot, not a first-come sale — registration for the general public draw
          typically opens in early December for the following May&apos;s tournament, with selection notified in
          February and a second, first-come-first-served sales phase in late March for Opening Week and outside
          courts. Missing the December ballot window means relying on that narrower March phase or the FFT&apos;s own
          resale marketplace — plan around the ballot date, not the tournament date.
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
        for the real strategic choice between the 16th arrondissement and Boulogne-Billancourt, and the full{" "}
        <a href={`/event-pack/${eventSlug}/tickets`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
          Ticket Guide
        </a>{" "}
        for a real comparison of every court tier.
      </p>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which ticket route we&apos;d pick</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            A Grounds Pass for most of your trip plus one Chatrier or Lenglen day for a marquee match is the sharpest
            combination for a first Roland-Garros. The Grounds Pass gets you a full day of tennis across the outside
            courts and Simonne-Mathieu — often with top seeds warming up close enough to hear the ball off the
            strings — and one reserved-seat day buys the real show-court atmosphere without paying for it every day.
            Don&apos;t plan a first trip around winning the December ballot for a specific session; enter it, but
            build your real plan around the March first-come-first-served phase and the official resale marketplace.
            Full route-by-route detail lives in the{" "}
            <a href={`/event-pack/${eventSlug}/tickets`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Ticket Guide
            </a>
            .
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Where we&apos;d spend the hotel budget</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Put the money into a hotel genuinely near the venue — Porte d&apos;Auteuil or Michel-Ange–Molitor walking
            distance — if this is a dedicated tennis trip, since Roland-Garros has very few hotels this close and
            they sell out first. If the tournament is one day inside a longer Paris trip, Boulogne-Billancourt&apos;s
            short-let and Ibis options save real money for a short Métro ride, without giving up much. See the{" "}
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
