import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import { formatMoneyRange } from "@/app/planner/_lib/mockEvents";
import SpokeShell from "../../_components/SpokeShell";

const SPOKE_ID = "cost";
const TRIP_NIGHTS = 4;

// Real seeded planner rows for Shanghai (researched 9 Aug 2026): flights
// (48/49 origin markets, Moscow excluded — genuine routing gap), hotels
// (4 tiers, 92% central Shanghai / 8% near-venue Minhang sample), tickets
// (4 real tiers from the official Rolex Shanghai Masters site plus ATP
// House Hospitality), and local travel/food daily bands. Same pattern as
// ATP Finals' CostSpoke — folded into the headline total, not left as a
// placeholder, since the research is now actually done.
export default async function CostSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences, hotels, tickets, destinationBand, flights, costDataVerifiedAt } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;
  const stayGuide = linkedExperiences.find((e) => e.slug.includes("where-to-stay-shanghai-masters"));

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

  // Each profile now pairs with its own real ticket tier — previously every
  // card silently used tier2Ticket regardless of label, so Splurge/Luxury
  // never actually reflected Center Court/hospitality pricing. Fixed 10 Aug
  // 2026 alongside the ticket-tier price sync.
  const profiles = [
    { label: "Budget", hotel: budgetHotel, ticket: tier1Ticket, hotelNote: "A basic central hotel", ticketNote: "Grounds Pass" },
    { label: "Moderate", hotel: moderateHotel, ticket: tier2Ticket, hotelNote: "A solid 4-star hotel", ticketNote: "Grandstand ticket" },
    { label: "Splurge", hotel: splurgeHotel, ticket: tier3Ticket, hotelNote: "An upper-tier 4-star hotel", ticketNote: "Center Court ticket" },
    { label: "Luxury", hotel: luxuryHotel, ticket: tier4Ticket, hotelNote: "Shanghai's top hotels", ticketNote: "ATP House Hospitality — see the Luxury Guide" },
  ].filter((p) => p.hotel);

  // Same-city origin (Shanghai) is seeded $0-$0 by design — real for the
  // Planner's per-origin lookup, meaningless in an aggregate range, so it
  // must be excluded here explicitly (per hub-and-spoke skill §2a-2).
  // Doha and Dubai are tagged "Asia-Pacific" in planner_origin_markets but
  // are geographically Middle East, with long-haul pricing closer to a
  // Europe route than genuine East/Southeast Asia short-haul fares —
  // excluded here to keep the displayed range representative (curator
  // decision, 10 Aug 2026). Label stays "Asia-Pacific" per that same
  // decision; only the price calculation changes.
  const apacFlights = flights.filter(
    (f) => f.region === "Asia-Pacific" && f.originMarket !== "Shanghai" && f.originMarket !== "Doha" && f.originMarket !== "Dubai"
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
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Shanghai Masters"
      status="teaser"
      h1="Real hotel, ticket, and daily-spend numbers — no estimates"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="Every number above is real and free — the pack doesn't unlock more prices, it unlocks the decision. Which ticket tier is actually worth it, whether to base yourself centrally or near the venue, and how the Golden Week pricing spike changes your booking window."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Shanghai is a genuinely mid-priced major Asian host city — cheaper than Tokyo or Singapore on daily spend,
        pricier than most of Southeast Asia. The real swing in this trip&apos;s cost comes from two places: your
        ticket tier, and whether you book before or after China&apos;s National Day Golden Week (1-7 October) drives
        a real, dated demand spike right before the tournament starts.
      </p>

      {moderateTotal && (
        <div className="mb-8">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Typical {TRIP_NIGHTS}-night trip</p>
          <p className="text-3xl sm:text-4xl font-black text-white">
            {formatMoneyRange(moderateTotal.low, moderateTotal.high)}
          </p>
          <p className="text-xs text-[#6A6A6A] mt-1">
            A 4-star hotel, food, local transport, and a Grandstand ticket for {TRIP_NIGHTS} nights.{" "}
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
      <p className="text-xs text-[#6A6A6A] mb-3">For the Moderate trip above — 4-star hotel, Grandstand ticket.</p>
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
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Golden Week pricing trap</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          China&apos;s National Day Golden Week runs 1-7 October — immediately before this tournament starts on 5
          October. Hotel prices across Shanghai spike and availability tightens in that exact window, then normalize
          once the holiday ends. Book your hotel before Golden Week demand kicks in, not after — the hotel numbers
          above reflect a normal week, not the Golden Week spike.
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
            round-trip, economy, if you&apos;re traveling from within Asia-Pacific.
          </p>
        )}
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          Flying in from Europe, the Americas, or Africa costs meaningfully more, so we&apos;re not folding every
          region into one misleading blended number here. Tell the Planner where you&apos;re starting from and
          it&apos;ll give you a real range for your actual route.
        </p>
        <a
          href="/planner"
          className="inline-flex items-center px-4 py-2 rounded-sm border border-[#AAFF00] text-[#AAFF00] text-xs font-black hover:bg-[#AAFF00] hover:text-black transition-colors"
        >
          Check flight costs from your city →
        </a>
      </div>

      {stayGuide && (
        <p className="text-sm text-[#A3A3A3] leading-7 mt-8 mb-8">
          See the full{" "}
          <a href={`/event-pack/${eventSlug}/hotels`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
            Where to Stay guide
          </a>{" "}
          for the real strategic choice between central Shanghai and near-venue Minhang.
        </p>
      )}

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which ticket tier we&apos;d pick</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            The Grounds Pass alone is a real way to spend a full day with top-20 players — it covers Court 17&apos;s
            practice sessions, which can put two or three ranked players within a few hours of each other. The jump
            to a Grandstand ticket is worth it for one marquee session, not every day of your trip; Center Court
            climbs steeply as the draw narrows, so it&apos;s the sharpest buy either early (including 16 October,
            the Federer exhibition date) or for one specific day you want the best seat for a top match, not for
            every session. The full tier-by-tier
            breakdown lives in the{" "}
            <a href={`/event-pack/${eventSlug}/tickets`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Ticket Guide
            </a>
            .
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Where we&apos;d spend the hotel budget</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Put the money into a central Shanghai base over anything closer to Qizhong — the venue sits 27-30km out
            in Minhang, so proximity buys you a shorter shuttle ride, not a walkable venue, and central Shanghai
            gives you the real city for the two-thirds of your trip you&apos;re not at a match. See the{" "}
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
