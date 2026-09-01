import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import { formatMoneyRange } from "@/app/planner/_lib/mockEvents";
import SpokeShell from "../../_components/SpokeShell";

const SPOKE_ID = "cost";
const TRIP_NIGHTS = 4;

// Hotel + local travel + food are real, seeded data (planner_hotel_tier_cost
// + planner_destination_bands for Abu Dhabi, seeded 22-23 Jul 2026, before
// this build). Ticket-tier pricing (planner_ticket_tier_cost) is real too —
// 4 tiers already seeded 20-26 Jul 2026, tier4 spanning Hero seats through
// Paddock Club/House 44 hospitality. Trip length set to 4 nights, matching
// the real 4-day Thu-Sun ticket structure this event actually sells.
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

  // Budget pairs with tier1 (Abu Dhabi Hill GA), Moderate with tier2 (the
  // 5 mid-tier grandstands), Splurge with tier3 (West/Main Grandstand),
  // Luxury with tier4 (Hero seats through Paddock Club/House 44) — same
  // spend-level pairing pattern as every other hub-and-spoke event's Cost
  // spoke.
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
    { label: "Budget", hotel: budgetHotel, ticket: tier1, note: "A well-reviewed budget stay, Yas Island or off-island", ticketNote: "Abu Dhabi Hill (GA)" },
    { label: "Moderate", hotel: moderateHotel, ticket: tier2, note: "A solid 3-4 star hotel on or near Yas Island", ticketNote: "Marina/North/South Grandstands" },
    { label: "Splurge", hotel: splurgeHotel, ticket: tier3, note: "An upscale hotel with real amenities and a better location", ticketNote: "West/Main Grandstand" },
    { label: "Luxury", hotel: luxuryHotel, ticket: tier4, note: "Ultra-luxury Yas Island or Dubai stays", ticketNote: "Hero Seats to Paddock Club" },
  ].filter((p) => p.hotel);

  // Scoped to Europe — Abu Dhabi's single largest real fan-travel market for
  // a December season finale, and the region with the most complete seeded
  // data (14 markets). A single blended global figure across all 5 regions
  // would span $278 to $4,602, which reads as misleading rather than useful
  // — same reasoning Bahrain GP's Cost spoke applies to its own APAC-heavy
  // fanbase.
  const europeFlights = flights.filter((f) => f.region === "Europe");
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
      eventName="Abu Dhabi Grand Prix"
      status="teaser"
      h1="What a real Abu Dhabi GP weekend costs, by budget"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="Every number above is real and free — the pack doesn't unlock more prices, it unlocks the decision. Given your budget, which grandstand and which hotel area we'd actually pick for the season finale, and the specific booking-window detail that matters most for the one weekend on the calendar with genuinely elevated demand."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Abu Dhabi is the calendar&apos;s season finale, and pricing reflects it — this isn&apos;t the cheapest race
        weekend on the F1 calendar. The numbers below cover a real full-trip estimate for the standard 4-day
        (Thursday-Sunday) ticket structure: hotel, food, local transport, and a grandstand ticket.
      </p>

      {moderateTotal && (
        <div className="mb-8">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Typical {TRIP_NIGHTS}-night trip</p>
          <p className="text-3xl sm:text-4xl font-black text-white">
            {formatMoneyRange(moderateTotal.low, moderateTotal.high)}
          </p>
          <p className="text-xs text-[#6A6A6A] mt-1">
            A 3-4 star hotel, food, local transport, and a mid-tier grandstand 4-day ticket, for {TRIP_NIGHTS} nights.{" "}
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
                  <p className="text-xs text-[#6A6A6A] mt-1">{p.note}</p>
                  <p className="text-xs text-[#6A6A6A]">Ticket: {p.ticketNote}</p>
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
          <CategoryRow label="Ticket (mid-tier grandstand)" low={Math.round(Number(tier2.costLow))} high={Math.round(Number(tier2.costHigh))} unit="4-day" />
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
            round-trip, economy, if you&apos;re traveling from Europe — this event&apos;s largest single fan-travel
            market for a December season finale.
          </p>
        )}
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          Flying in from further afield — the Americas, or a longer-haul Asia-Pacific route — costs meaningfully
          more, and remember AUH isn&apos;t your only real option: DXB often carries better fares and more direct
          routes for many origins, at the cost of a longer ground transfer (see the Getting There guide). Tell the
          Planner where you&apos;re starting from for a real number on your actual route.
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
            For a genuine season-finale weekend, the West or Main Grandstand tier ({tier3 && formatMoneyRange(Math.round(Number(tier3.costLow)), Math.round(Number(tier3.costHigh)))}) is the strongest all-round pick —
            real racing action or full ceremony, both covered. If the budget doesn&apos;t stretch that far, the
            mid-tier grandstands ({tier2 && formatMoneyRange(Math.round(Number(tier2.costLow)), Math.round(Number(tier2.costHigh)))}) still put you in a reserved, covered seat for meaningfully less. Abu Dhabi
            Hill ({tier1 && formatMoneyRange(Math.round(Number(tier1.costLow)), Math.round(Number(tier1.costHigh)))}) is the honest budget entry — genuinely no shame in it, especially for a first Abu Dhabi GP where
            the after-race concerts matter as much as the seat itself. The full grandstand-by-grandstand comparison
            lives in the{" "}
            <a href={`/event-pack/${eventSlug}/tickets`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Ticket Guide
            </a>
            .
          </p>

          <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-4 mb-8">
            <p className="text-sm font-bold text-white mb-1.5">Book early — this is the highest-demand weekend of the F1 season</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Buy only via the official F1 ticketing site or abudhabi.gp — avoid resellers, a real risk at the
              calendar&apos;s single highest-demand round. Paddock Club and other top-tier hospitality
              (from {tier4 && formatMoneyRange(Math.round(Number(tier4.costLow)), Math.round(Number(tier4.costHigh)))}) has historically sold its best packages out months ahead — book that tier first if it&apos;s
              on your list at all.
            </p>
            <a
              href="https://www.abudhabi.gp/en/tickets"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 text-xs text-[#AAFF00] hover:text-[#BBFF33] underline"
            >
              abudhabi.gp — official tickets →
            </a>
          </div>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Where we&apos;d spend the hotel budget</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            If Yas Island proximity matters to you, put the splurge into a genuine on-island stay (Crowne Plaza is
            the real mid-range answer, not the ultra-luxury W) rather than a marginal upgrade elsewhere — the
            walk-to-the-gates convenience across a 4-day weekend is worth more than most other single upgrades.
            If the trip is really about the wider UAE experience, a Dubai base (~90 minutes via the E11) opens up
            genuinely better value at every tier, especially at the budget end — see the Where to Stay guide for
            the full breakdown of both.
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
