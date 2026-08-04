import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import { formatMoneyRange } from "@/app/planner/_lib/mockEvents";
import SpokeShell from "../../_components/SpokeShell";

const SPOKE_ID = "cost";
const TRIP_NIGHTS = 3;

// Unlike Bahrain GP, Singapore GP has real, fully-seeded ticket-tier data
// (planner_ticket_tier_cost) alongside hotel/local-travel/food data, so
// ticket pricing is shown as a real range here, not an honest gap.
export default async function CostSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences, hotels, destinationBand, flights, tickets, costDataVerifiedAt } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;
  const stamford = linkedExperiences.find((e) => e.slug.includes("singapore-gp-stamford-grandstand"));
  const trackHotels = linkedExperiences.find((e) => e.slug.includes("singapore-gp-trackside-hotels"));
  const chinatown = linkedExperiences.find((e) => e.slug.includes("singapore-gp-chinatown-stay"));

  const budgetHotel = hotels.find((h) => h.tier === "budget");
  const moderateHotel = hotels.find((h) => h.tier === "moderate");
  const splurgeHotel = hotels.find((h) => h.tier === "splurge");
  const luxuryHotel = hotels.find((h) => h.tier === "luxury");

  const stayTotal = (hotel: typeof moderateHotel) => {
    if (!hotel) return null;
    const low = Number(hotel.costLow) * TRIP_NIGHTS + (destinationBand ? (Number(destinationBand.localTravelLow) + Number(destinationBand.foodPerDayLow)) * TRIP_NIGHTS : 0);
    const high = Number(hotel.costHigh) * TRIP_NIGHTS + (destinationBand ? (Number(destinationBand.localTravelHigh) + Number(destinationBand.foodPerDayHigh)) * TRIP_NIGHTS : 0);
    return { low: Math.round(low), high: Math.round(high) };
  };

  const moderateTicket = tickets.find((t) => t.tier === "tier2");

  const stayTotalWithTicket = (hotel: typeof moderateHotel, ticket: typeof moderateTicket) => {
    const stay = stayTotal(hotel);
    if (!stay || !ticket) return stay;
    return {
      low: stay.low + Number(ticket.costLow),
      high: stay.high + Number(ticket.costHigh),
    };
  };

  const moderateTotal = stayTotalWithTicket(moderateHotel, moderateTicket);

  const profiles = [
    { label: "Budget", hotel: budgetHotel, ticketTier: "tier1", hotelNote: "A basic, well-reviewed hotel near Chinatown", ticketNote: "Tier 1 Walkabout/grandstand ticket" },
    { label: "Moderate", hotel: moderateHotel, ticketTier: "tier2", hotelNote: "A solid 3–4 star hotel, walkable or one MRT stop from the circuit", ticketNote: "Tier 2 grandstand ticket" },
    { label: "Splurge", hotel: splurgeHotel, ticketTier: "tier3", hotelNote: "An upscale hotel with real amenities near Marina Bay", ticketNote: "Tier 3 grandstand ticket" },
    { label: "Luxury", hotel: luxuryHotel, ticketTier: "tier4", hotelNote: "Trackside hotels — Ritz-Carlton, Pan Pacific, Swissotel", ticketNote: "Tier 4 hospitality ticket" },
  ]
    .map((p) => ({ ...p, ticket: tickets.find((t) => t.tier === p.ticketTier) }))
    .filter((p) => p.hotel);

  const ticketLow = tickets.length ? Math.min(...tickets.map((t) => Number(t.costLow))) : null;
  const ticketHigh = tickets.length ? Math.max(...tickets.map((t) => Number(t.costHigh))) : null;

  // Excludes the same-city origin (Singapore, seeded at costLow/costHigh =
  // 0.00 for "no flight needed", per planner-data-researcher's same-city
  // rule) — a $0 same-city row isn't a real fare and shouldn't drag down
  // the displayed "roughly $X-$Y" range for fans actually flying in.
  const apacFlights = flights.filter((f) => f.region === "Asia-Pacific" && f.originMarket !== "Singapore");
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
      eventName="Singapore Grand Prix"
      status="teaser"
      h1="How much does a Singapore GP weekend cost?"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      heroImagePosition="center 25%"
      isUnlocked={isUnlocked}
      ctaCopy="Every number above is real and free — the pack doesn't unlock more prices, it unlocks the decision. Given your budget, which ticket tier and hotel area we'd actually pick for a first Singapore GP and why, plus the timing detail that matters most for a race weekend where premium tiers sell out early."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Singapore is one of the pricier stops on the F1 calendar, both for tickets and hotels, but it's also one of
        the most transparent: real per-tier ticket pricing is published, and the numbers below are built from that
        along with real hotel and local cost data, not estimates.
      </p>

      {moderateTotal && (
        <div className="mb-8">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Typical {TRIP_NIGHTS}-night trip</p>
          <p className="text-3xl sm:text-4xl font-black text-white">
            {formatMoneyRange(moderateTotal.low, moderateTotal.high)}
          </p>
          <p className="text-xs text-[#6A6A6A] mt-1">
            A Tier 2 grandstand ticket, 3–4 star hotel, food and local transport for {TRIP_NIGHTS} nights.{" "}
            <span className="text-[#AAFF00]">Excludes flights</span> —{" "}
            <a href="#tickets" className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              see the full ticket range ↓
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
              const total = stayTotalWithTicket(p.hotel, p.ticket);
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

      <div id="tickets" className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8 scroll-mt-20">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Ticket pricing — real 2026 tiers</p>
        {ticketLow != null && ticketHigh != null && (
          <p className="text-sm text-white font-bold mb-2">
            S${ticketLow.toLocaleString()}–S${ticketHigh.toLocaleString()} across walkabout, grandstand, and hospitality tiers.
          </p>
        )}
        <p className="text-sm text-[#A3A3A3] leading-6">
          Sixteen named grandstands and two Walkabout tiers span this full range — the{" "}
          <a href={`/event-pack/${eventSlug}/tickets`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
            Ticket Guide
          </a>{" "}
          breaks down exactly what each tier actually gets you.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-1">Where the money goes</p>
      <p className="text-xs text-[#6A6A6A] mb-3">For the Moderate trip above — Tier 2 ticket, 3–4 star hotel.</p>
      <div className="flex flex-col gap-2 mb-8">
        {moderateTicket && (
          <CategoryRow label="Ticket" low={Number(moderateTicket.costLow)} high={Number(moderateTicket.costHigh)} unit="Tier 2 grandstand" />
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

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
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

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which ticket tier we&apos;d pick</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            For a genuine first Singapore GP on a real budget, Stamford Grandstand is the sharpest buy — a third of
            the premium pit-straight stands, with real racing at a corner that&apos;s caught out world champions. If
            the concerts matter as much as the race, Zone 4 Walkabout gets you both for less. The full stand-by-stand
            comparison lives in the{" "}
            <a href={`/event-pack/${eventSlug}/tickets`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Ticket Guide
            </a>
            .
          </p>
          {stamford?.practicalInfo?.bookingMethod && (
            <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-4 mb-8">
              <p className="text-sm font-bold text-white mb-1.5">Stamford Grandstand</p>
              <p className="text-sm text-[#A3A3A3] leading-6">{stamford.practicalInfo.bookingMethod}</p>
            </div>
          )}

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Where we&apos;d spend the hotel budget</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            For a first Singapore GP, Chinatown is the honest value pick — two MRT stops from the circuit at roughly
            half Marina Bay&apos;s trackside rates, with real neighbourhood character instead of a generic budget
            strip. Splurge-tier only pays off if you actually want the circuit view from your room — otherwise the
            money is better spent on tickets or the concerts.
          </p>
          <div className="flex flex-col gap-3">
            {trackHotels?.practicalInfo?.bookingMethod && (
              <AreaBookingCard title="Trackside — Marina Bay" detail={trackHotels.practicalInfo.bookingMethod} websites={trackHotels.practicalInfo.website} />
            )}
            {chinatown?.practicalInfo?.bookingMethod && (
              <AreaBookingCard title="Chinatown — value base" detail={chinatown.practicalInfo.bookingMethod} websites={chinatown.practicalInfo.website} />
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
