import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import { formatMoneyRange } from "@/app/planner/_lib/mockEvents";
import SpokeShell from "../../_components/SpokeShell";

const SPOKE_ID = "cost";
const TRIP_NIGHTS = 3;

// Hotel + local travel + food are real, seeded data (planner_hotel_tier_cost
// + planner_destination_bands for Kuala Lumpur, researched and approved 29
// Jul–1 Aug 2026). Ticket-tier pricing is now real too — full 3-day
// grandstand and Paddock Club pricing confirmed by the founder 23 Aug 2026
// (MYR, converted to USD) and seeded into planner_ticket_tier_cost. All 4
// tiers, including tier4 (Paddock Club), are confirmed — none flagged as
// unconfirmed in copy.
export default async function CostSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences, hotels, tickets, destinationBand, flights, costDataVerifiedAt } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;
  const klGuide = linkedExperiences.find((e) => e.slug.includes("staying-in-kuala-lumpur"));
  const samaSama = linkedExperiences.find((e) => e.slug.includes("sama-sama-hotel"));
  const mainGrandstand = linkedExperiences.find((e) => e.slug.includes("main-grandstand-sepang-start-finish"));

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

  // Trip totals now fold in a real ticket tier, paired by spend level —
  // same pattern used elsewhere (e.g. NZ-Australia's Cost spoke): Budget
  // pairs with tier1 (Hill Stand), Moderate pairs with tier2 (K1/F
  // Grandstand), Splurge pairs with tier3 (Main Grandstand), Luxury pairs
  // with tier4 (Paddock Club) — confirmed pairing, 23 Aug 2026. All 4
  // tier prices are confirmed.
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
    { label: "Budget", hotel: budgetHotel, ticket: tier1, note: "A basic, well-reviewed hotel in Kuala Lumpur", ticketNote: "Hill Stand (B/C/G)" },
    { label: "Moderate", hotel: moderateHotel, ticket: tier2, note: "A solid 3–4 star hotel, good access to KLIA/Sepang transit", ticketNote: "K1 / F Grandstand" },
    { label: "Splurge", hotel: splurgeHotel, ticket: tier3, note: "An upscale hotel with real amenities and a better location", ticketNote: "Main Grandstand" },
    { label: "Luxury", hotel: luxuryHotel, ticket: tier4, note: "Top-tier Kuala Lumpur hotels — KLCC, Bukit Bintang", ticketNote: "Paddock Club" },
  ].filter((p) => p.hotel);

  // Scoped to Asia-Pacific origins only — the full 49-market range ($101 to
  // $3,575+) spans regional hops and long-haul intercontinental fares alike,
  // which reads as misleading rather than useful. Sepang's real fan base
  // skews heavily toward this region, so a tighter, more honest range here
  // is more useful than a technically-complete but uninformative global one.
  // Flagged and fixed per user instruction, 1 Aug 2026.
  const apacFlights = flights.filter((f) => f.region === "Asia-Pacific");
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
      eventName="Bahrain Grand Prix"
      status="teaser"
      h1="Hotel, ticket, and daily-spend numbers for race weekend"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      heroImagePosition="center 75%"
      isUnlocked={isUnlocked}
      ctaCopy="Every number above is real and free — the pack doesn't unlock more prices, it unlocks the decision. For your budget, we'll tell you which hotel area and which ticket tier we'd actually pick for a first Sepang trip and why, plus the booking-timing detail that matters most for a race weekend with unusually high pent-up demand."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Sepang&apos;s hotel stock and cost of living are genuinely cheap by international standards — Kuala Lumpur
        is one of the more affordable major host cities on the calendar. 3-day grandstand ticket pricing is now
        real too, so the numbers below cover a genuine full-trip estimate — hotel, food, local transport, and a
        ticket — not just the parts that were easy to price.
      </p>

      {moderateTotal && (
        <div className="mb-8">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Typical {TRIP_NIGHTS}-night trip</p>
          <p className="text-3xl sm:text-4xl font-black text-white">
            {formatMoneyRange(moderateTotal.low, moderateTotal.high)}
          </p>
          <p className="text-xs text-[#6A6A6A] mt-1">
            A 3–4 star hotel, food, local transport, and a K1/F Grandstand 3-day ticket, for {TRIP_NIGHTS} nights.{" "}
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
      <p className="text-xs text-[#6A6A6A] mb-3">For the Moderate trip above — 3–4 star hotel, K1/F Grandstand ticket.</p>
      <div className="flex flex-col gap-2 mb-8">
        {tier2 && (
          <CategoryRow label="Ticket (K1/F Grandstand)" low={Math.round(Number(tier2.costLow))} high={Math.round(Number(tier2.costHigh))} unit="3-day" />
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

      {/* Flights — real seeded range shown here (unlike the Italian GP
          pilot, which only linked out to the Planner) since all 49 origin
          markets are now researched for Kuala Lumpur. Still points to the
          Planner for a route-specific number — flight cost is genuinely
          origin-dependent, and a single global range understates how much
          it varies by where the reader is flying from. */}
      <div id="flights" className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 scroll-mt-20">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What about flights?</p>
        {flightRange && (
          <p className="text-sm text-white font-bold mb-2">
            Roughly {formatMoneyRange(flightRange.low, flightRange.high)}{" "}
            round-trip, economy, if you&apos;re traveling from Asia Pacific.
          </p>
        )}
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          Flying in from further afield — Europe, the Americas — costs meaningfully more, so we&apos;re not folding
          every region into one misleading blended number here. Tell the Planner where you&apos;re starting from and
          it&apos;ll give you a real range for your actual route.
        </p>
        <a
          href="/planner"
          className="inline-flex items-center px-4 py-2 rounded-sm border border-[#AAFF00] text-[#AAFF00] text-xs font-black hover:bg-[#AAFF00] hover:text-black transition-colors"
        >
          Check flight costs from your city →
        </a>
      </div>

      {/* Unlocked content — scoped to the money decisions this trip
          actually has: which ticket tier, and which hotel area. Both
          verdicts reuse the same real reasoning already established in
          TicketsSpoke/HotelsSpoke rather than inventing a second one. */}
      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which ticket tier we&apos;d pick</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            For a genuine first Malaysian GP, the Main Grandstand ({tier3 && formatMoneyRange(Math.round(Number(tier3.costLow)), Math.round(Number(tier3.costHigh)))}) is the right call: it teaches
            you the shape of a full race weekend in one seat, and the roof matters more here than at almost any
            other circuit given how fast Sepang&apos;s weather turns. If you already know you want to watch racing
            rather than ceremony, K1 ({tier2 && formatMoneyRange(Math.round(Number(tier2.costLow)), Math.round(Number(tier2.costHigh)))}) is the sharper pick — real, repeated overtaking at Turn 1, not a
            highlight-reel moment. Hill Stand ({tier1 && formatMoneyRange(Math.round(Number(tier1.costLow)), Math.round(Number(tier1.costHigh)))}) is the honest budget option — general admission, partial cover
            only, but a real seat at a fraction of the price. The full stand-by-stand comparison, including what
            each is actually like to sit in, lives in the{" "}
            <a href={`/event-pack/${eventSlug}/tickets`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Ticket Guide
            </a>
            .
          </p>

          <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-4 mb-8">
            <p className="text-sm font-bold text-white mb-1.5">Book your ticket early — demand here is genuinely unusual</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Buy only via the official F1 ticketing site — avoid resellers and social-media sellers, a real risk at
              a circuit returning after a 9-year gap. This is Sepang&apos;s first F1 weekend since 2017, so expect
              real, unusual demand across every tier — don&apos;t wait once tickets go on sale. Paddock Club
              hospitality starts at {tier4 && formatMoneyRange(Math.round(Number(tier4.costLow)), Math.round(Number(tier4.costHigh)))} if you want the full trackside experience.
            </p>
            <a
              href="https://tickets.formula1.com/en/f1-83069-bahrain-in-malaysia"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 text-xs text-[#AAFF00] hover:text-[#BBFF33] underline"
            >
              tickets.formula1.com — Bahrain in Malaysia →
            </a>
          </div>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Where we&apos;d spend the hotel budget</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            For a first Malaysian GP, put the money into Kuala Lumpur, not a marginally closer circuit-side room —
            Sepang&apos;s own hotel stock is thin and mostly airport-transit-oriented, so there isn&apos;t a real
            luxury-vs-budget choice to make near the track itself. Moderate-tier KL hotels near KLCC or Bukit
            Bintang are the sweet spot: a short, uncomplicated KLIA Ekspres hop on race morning, and real city living
            for the two-thirds of the trip you&apos;re not at the circuit. Splurge-tier only pays off if you actually
            use what you&apos;re paying for — a rooftop pool, a proper spa — not just a marginally nicer room.
          </p>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Booking windows &amp; contacts</p>
          <div className="flex flex-col gap-3">
            {klGuide?.practicalInfo?.bookingMethod && (
              <AreaBookingCard title="Kuala Lumpur hotels" detail={klGuide.practicalInfo.bookingMethod} websites={klGuide.practicalInfo.website} />
            )}
            {samaSama?.practicalInfo?.bookingMethod && (
              <AreaBookingCard title="Sama-Sama Hotel (airport)" detail={samaSama.practicalInfo.bookingMethod} websites={samaSama.practicalInfo.website} />
            )}
          </div>
        </div>
      )}
    </SpokeShell>
  );
}

function AreaBookingCard({ title, detail, websites }: { title: string; detail: string; websites?: string }) {
  const links = websites ? websites.split(",").map((w) => w.trim()).filter(Boolean) : [];
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
      <p className="text-sm font-bold text-white mb-1.5">{title}</p>
      <p className="text-sm text-[#A3A3A3] leading-6">{detail}</p>
      {links.length > 0 && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
          {links.map((url) => (
            <a
              key={url}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#AAFF00] hover:text-[#BBFF33] underline"
            >
              {new URL(url).hostname.replace("www.", "")} →
            </a>
          ))}
        </div>
      )}
    </div>
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
