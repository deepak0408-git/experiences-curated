import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import { formatMoneyRange } from "@/app/planner/_lib/mockEvents";
import SpokeShell from "../../_components/SpokeShell";

const SPOKE_ID = "cost";
const TRIP_NIGHTS = 3;

// Real, seeded data only covers Melbourne (plannerHotelTierCost has zero
// rows for Perth/Adelaide/Sydney as of 16 Aug 2026, even though
// plannerDestinationBands exists for all 4 cities) — scoped to Melbourne's
// Boxing Day Test leg only, per explicit founder decision, rather than
// guessing at the other 3 cities' hotel costs or holding this spoke back
// entirely. Ticket tiers are real and event-wide (plannerTicketTierCost is
// keyed by sportingEventId, not per-city), so those apply to any leg of the
// series, not just Melbourne.
export default async function CostSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences, hotels, tickets, destinationBand, costDataVerifiedAt } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const budgetHotel = hotels.find((h) => h.tier === "budget" && h.seasonalBand === "dec");
  const moderateHotel = hotels.find((h) => h.tier === "moderate" && h.seasonalBand === "dec");
  const splurgeHotel = hotels.find((h) => h.tier === "splurge" && h.seasonalBand === "dec");

  const tier1 = tickets.find((t) => t.tier === "tier1");
  const tier2 = tickets.find((t) => t.tier === "tier2");
  const tier3 = tickets.find((t) => t.tier === "tier3");

  const stayTotal = (hotel: typeof moderateHotel) => {
    if (!hotel) return null;
    const low = Number(hotel.costLow) * TRIP_NIGHTS + (destinationBand ? (Number(destinationBand.localTravelLow) + Number(destinationBand.foodPerDayLow)) * TRIP_NIGHTS : 0);
    const high = Number(hotel.costHigh) * TRIP_NIGHTS + (destinationBand ? (Number(destinationBand.localTravelHigh) + Number(destinationBand.foodPerDayHigh)) * TRIP_NIGHTS : 0);
    return { low: Math.round(low), high: Math.round(high) };
  };

  // Hotel tier paired with a matched ticket tier, same pattern as Wimbledon's
  // CostSpoke — Budget and Moderate both pair with General Admission (tier1),
  // since GA is the realistic default regardless of hotel spend; Splurge
  // pairs with Outdoor Boxes/The Lounge (tier2), a genuine step up. Tier3
  // (Private Suites/The First XI) deliberately unused here — same tier
  // already gets full coverage in the Luxury spoke. Founder decision, 19 Aug
  // 2026 — fixes a real inconsistency where every hotel tier was previously
  // shown next to the same General Admission ticket regardless of spend.
  const tripTotal = (hotel: typeof moderateHotel, ticket: typeof tier1) => {
    const stay = stayTotal(hotel);
    if (!stay || !ticket) return null;
    return {
      low: stay.low + Math.round(Number(ticket.costLow)),
      high: stay.high + Math.round(Number(ticket.costHigh)),
    };
  };

  const moderateTotal = tripTotal(moderateHotel, tier1);

  const profiles = [
    { label: "Budget", hotel: budgetHotel, ticket: tier1, hotelNote: "A basic, well-reviewed Melbourne hotel", ticketNote: "General Admission" },
    { label: "Moderate", hotel: moderateHotel, ticket: tier1, hotelNote: "A solid 3–4 star hotel, good tram/train access to the MCG", ticketNote: "General Admission" },
    { label: "Splurge", hotel: splurgeHotel, ticket: tier2, hotelNote: "An upscale hotel with real amenities, walking distance to the CBD", ticketNote: "Outdoor Boxes, The Lounge" },
  ].filter((p) => p.hotel);

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="New Zealand in Australia"
      status="teaser"
      h1="A real Melbourne Boxing Day Test budget, plus what the other 3 legs cost in tickets alone"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="Every number above is real and free — the pack doesn't unlock more prices, it unlocks the decision. Which of the four legs is actually worth the trip if you can only pick one, how Boxing Day week's hotel demand changes what you should book and when, and the real tradeoff between a single-city trip and the full four-city series."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        This is a genuinely uneven trip to cost out — four cities, four different hotel markets, and one of them
        (Melbourne, Boxing Day week) is the single highest-demand hotel window of the whole series. We&apos;ve
        costed Melbourne in full below as a representative example of what a leg of this trip runs, plus the
        real ticket-tier costs that apply to any of the four Tests, so you can multiply out whichever legs
        you&apos;re actually planning to attend.
      </p>

      {moderateTotal && (
        <div className="mb-8">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">
            Typical {TRIP_NIGHTS}-night Melbourne trip (Boxing Day Test, General Admission)
          </p>
          <p className="text-3xl sm:text-4xl font-black text-white">{formatMoneyRange(moderateTotal.low, moderateTotal.high)}</p>
          <p className="text-xs text-[#6A6A6A] mt-1">
            A 3–4 star hotel, food, local transport, and a General Admission single-day Test ticket for {TRIP_NIGHTS}{" "}
            nights. <span className="text-[#AAFF00]">Excludes flights</span> — genuinely origin-dependent, see the
            Planner link below.
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
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">
            Three ways to do the Melbourne leg ({TRIP_NIGHTS} nights, hotel + food + transport + a single-day Test ticket)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            {profiles.map((p) => {
              const total = tripTotal(p.hotel, p.ticket);
              return (
                <div key={p.label} className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
                  <p className="text-xs font-black tracking-widest uppercase text-white mb-1">{p.label}</p>
                  <p className="text-lg font-black text-[#AAFF00]">{total ? formatMoneyRange(total.low, total.high) : "—"}</p>
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

      <div className="rounded-sm border border-amber-400/30 bg-amber-400/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-amber-400 mb-2">Perth, Adelaide, and Sydney — use Melbourne as your guide</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          We&apos;ve costed Melbourne in full above as a representative example of what a leg of this trip runs.
          If you&apos;re planning a Perth, Adelaide, or Sydney leg specifically, use those same hotel-tier ranges
          as a rough guide and adjust for each city&apos;s own market, plus the ticket-tier prices below (they
          apply to every venue) and the{" "}
          <a href="/planner" className="text-[#AAFF00] hover:text-[#BBFF33] underline">
            Planner
          </a>{" "}
          for a real flight-cost range from your city.
        </p>
      </div>

      {(tier1 || tier2 || tier3) && (
        <>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Ticket tiers — applies to any of the four Tests</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            {[tier1, tier2, tier3].filter(Boolean).map((t) => (
              <div key={t!.tier} className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
                <p className="text-xs font-black tracking-widest text-white mb-1">{t!.eventTierLabel}</p>
                <p className="text-lg font-black text-[#AAFF00]">
                  {formatMoneyRange(Math.round(Number(t!.costLow)), Math.round(Number(t!.costHigh)))}
                </p>
                <p className="text-xs text-[#6A6A6A] mt-1">Single-day Test match ticket</p>
              </div>
            ))}
          </div>
        </>
      )}

      {destinationBand?.localTravelNote && (
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-4">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Getting around Melbourne, cheaply</p>
          <p className="text-sm text-[#A3A3A3] leading-6">{destinationBand.localTravelNote}</p>
        </div>
      )}
      {destinationBand?.foodNote && (
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">A local money-saving trick</p>
          <p className="text-sm text-[#A3A3A3] leading-6">{destinationBand.foodNote}</p>
        </div>
      )}

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What about flights?</p>
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          Flight cost genuinely depends on your route — a one-city trip to Melbourne is a very different flight
          budget from a full four-city Perth-Adelaide-Melbourne-Sydney itinerary, and the domestic legs between the
          four host cities are a real, separate cost on top of your international flight in (see the Getting There
          guide). Tell the Planner where you&apos;re starting from and which cities you&apos;re actually visiting.
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
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">If you can only pick one leg</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Melbourne&apos;s Boxing Day Test is the real answer for most first-time travellers — it&apos;s the
            single biggest date on the Southern Hemisphere cricket calendar, the atmosphere at the &apos;G&apos; on
            day one alone justifies the trip, and it&apos;s the easiest leg to build a short, self-contained holiday
            around (a laneway-and-coffee city day, a Yarra Valley day trip, genuine December weather). Adelaide Oval
            is the pick if character matters more to you than scale — no other ground on this tour pairs a Test
            match with a cathedral spire in the same sightline. Sydney&apos;s Fourth Test in early January closes
            the series and tends to have the loosest, most end-of-summer atmosphere of the four; Perth as the
            opener is the pick only if you specifically want to be there for the very first ball of a brand-new
            era in this rivalry — the first-ever four-Test Trans-Tasman series.
          </p>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Booking timing that actually matters</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Melbourne hotel rates during Boxing Day week run measurably higher than the rest of December — this is
            the city&apos;s single busiest hotel window of the whole summer, not just a cricket-specific spike, since
            it overlaps with the post-Christmas domestic travel rush too. Book the Melbourne leg&apos;s
            accommodation earliest of all four cities, even if you&apos;re still deciding on the others. See the
            Where to Stay guide for the real Melbourne neighbourhood tradeoffs.
          </p>
        </div>
      )}
    </SpokeShell>
  );
}
