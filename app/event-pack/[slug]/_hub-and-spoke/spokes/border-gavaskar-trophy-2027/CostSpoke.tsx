import Link from "next/link";
import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import { formatMoneyRange } from "@/app/planner/_lib/mockEvents";
import SpokeShell from "../../_components/SpokeShell";

const SPOKE_ID = "cost";
const TRIP_NIGHTS = 7;

// Chennai hotel tiers + destination bands (local travel/food) seeded 9 Oct
// 2026 — see scripts/seed-border-gavaskar-trophy-chennai-hotels.mjs and
// scripts/seed-border-gavaskar-trophy-chennai-destination-bands.mjs.
// Standing scope decision (9 Oct 2026, founder-confirmed): Chennai is the
// SOLE researched hotel/food/local-travel baseline for this 3-city pack
// (Nagpur, Chennai, Ahmedabad) — Nagpur and Ahmedabad were deliberately NOT
// researched separately; their real costs are reasonably close to
// Chennai's but not independently verified. Same pattern as the NZ-in-
// Australia Cost spoke (Melbourne costed in full, other 3 cities told to
// use it as a guide) — adapted here.
//
// Ticket tiers (plannerTicketTierCost) seeded 9 Oct 2026 — see
// scripts/seed-border-gavaskar-trophy-ticket-tiers.mjs. Real stand names
// across all 3 grounds, sourced from the most recent comparable Tests at
// each venue (2023 Nagpur, 2024 Chennai), FX-converted and adjusted +20%
// for inflation to 2027 — 2027 BCCI pricing itself has not been
// announced. The old flat KNOWN_LOCAL_TICKET_PRICES rupee table (Nagpur/
// Chennai/Ahmedabad as 3 generic rows) was removed once this real,
// seeded, stand-named tier data replaced it — see the ticket tier cards
// below instead.

const VISA_ATTRACTIONS_DAYTRIP_PRICES = [
  { item: "Mahabalipuram day trip, combined monument ticket", price: "₹600 for foreign nationals (₹40 for Indians)", note: "Single ticket covers every monument on site" },
  { item: "Statue of Unity Viewing Gallery", price: "₹380 adults (₹150 for general entry and exhibition only)", note: "Book the timed slot online" },
  { item: "Ahmedabad official heritage walk", price: "₹300 for foreign visitors", note: "Non-refundable once booked" },
  { item: "Tadoba core-zone safari permit", price: "₹5,800–₹12,800 per vehicle, depending on weekday or weekend and how far ahead you book", note: "Entry, guide and gypsy included; car and driver to Tadoba are extra. Core zone closed Tuesdays" },
  { item: "Gir lion safari permit", price: "₹15,500–₹17,500 for foreign nationals, plus camera and guide fees", note: "Permit covers up to six people; opens exactly 90 days ahead" },
  { item: "India e-Tourist visa", price: "US$10–40 depending on duration", note: "Charged in USD regardless of nationality (government fee, not a conversion) — only for eligible nationalities; enter via one of 33 designated airports" },
];

export default async function CostSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences, hotels, tickets, destinationBand, flights, costDataVerifiedAt } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const tier1 = tickets.find((t) => t.tier === "tier1");
  const tier2 = tickets.find((t) => t.tier === "tier2");
  const tier3 = tickets.find((t) => t.tier === "tier3");
  const tier4 = tickets.find((t) => t.tier === "tier4");
  const hasTickets = Boolean(tier1 || tier2 || tier3 || tier4);

  const budgetHotel = hotels.find((h) => h.tier === "budget");
  const moderateHotel = hotels.find((h) => h.tier === "moderate");
  const splurgeHotel = hotels.find((h) => h.tier === "splurge");
  const luxuryHotel = hotels.find((h) => h.tier === "luxury");

  // 7-night stay total (hotel + food + local travel + a ticket for each of
  // the 5 playing days), matching the Chennai Test's own 7-night window
  // these figures were researched against. Ticket folded in now that
  // real tier data exists (seeded 9 Oct 2026) — TRIP_DAYS_WITH_TICKET
  // reflects a 5-day Test, not the full 7-night stay (arrival/departure
  // days have no ticket cost).
  const TRIP_DAYS_WITH_TICKET = 5;
  const stayTotal = (hotel: typeof moderateHotel, ticket: typeof tier1) => {
    if (!hotel) return null;
    const ticketLow = ticket ? Number(ticket.costLow) * TRIP_DAYS_WITH_TICKET : 0;
    const ticketHigh = ticket ? Number(ticket.costHigh) * TRIP_DAYS_WITH_TICKET : 0;
    const low = Number(hotel.costLow) * TRIP_NIGHTS + (destinationBand ? (Number(destinationBand.localTravelLow) + Number(destinationBand.foodPerDayLow)) * TRIP_NIGHTS : 0) + ticketLow;
    const high = Number(hotel.costHigh) * TRIP_NIGHTS + (destinationBand ? (Number(destinationBand.localTravelHigh) + Number(destinationBand.foodPerDayHigh)) * TRIP_NIGHTS : 0) + ticketHigh;
    return { low: Math.round(low), high: Math.round(high) };
  };

  // Hotel tier paired with a matched ticket tier — Budget/Moderate both
  // pair with tier1 (General Admission, the realistic default regardless
  // of hotel spend), Splurge with tier3 (Premium/AC Stand), Luxury with
  // tier4 (Corporate Hospitality) — corrected 9 Oct 2026 to a clean 1:1
  // mapping across all 4 hotel tiers and all 4 ticket tiers (was wrongly
  // pairing both Budget and Moderate with tier1, leaving tier2 unused).
  // Ticket label stripped of its "— 1-day" suffix here specifically — that
  // suffix is accurate on eventTierLabel itself (the raw per-day rate
  // shown in the tier1-4 cards below), but inside these profile tiles the
  // dollar figure next to it is already a 5-day total (stayTotal
  // multiplies the ticket by TRIP_DAYS_WITH_TICKET), so keeping "1-day"
  // here would wrongly suggest the tile's price is a single day's cost.
  const stripDayQualifier = (label: string | undefined) => label?.replace(/\s*—\s*1-day\s*$/, "");

  const profiles = [
    { label: "Budget", hotel: budgetHotel, ticket: tier1, hotelNote: "Hotel NKC Airport or similar 2★", ticketNote: stripDayQualifier(tier1?.eventTierLabel) },
    { label: "Moderate", hotel: moderateHotel, ticket: tier2, hotelNote: "Ginger Chennai OMR or similar 3★", ticketNote: stripDayQualifier(tier2?.eventTierLabel) },
    { label: "Splurge", hotel: splurgeHotel, ticket: tier3, hotelNote: "Accord Chrome or similar 4★", ticketNote: stripDayQualifier(tier3?.eventTierLabel) },
    { label: "Luxury", hotel: luxuryHotel, ticket: tier4, hotelNote: "The Leela Palace Chennai or similar 5★", ticketNote: stripDayQualifier(tier4?.eventTierLabel) },
  ].filter((p) => p.hotel);

  const moderateTotal = stayTotal(moderateHotel, tier2);

  // Initial flight number for the "What about flights?" box — same
  // pattern as Chinese GP's CostSpoke (apacFlights/flightRange), but
  // scoped to India-domestic origins specifically rather than one
  // region: BGT's "Asia-Pacific" planner_origin_markets region mixes
  // domestic India fares ($48-191) with long-haul international ones
  // (Singapore/Tokyo/Dubai, $300+), so a single regional filter wouldn't
  // give a clean number the way it does for Chinese GP. Founder decision,
  // 9 Oct 2026: show the India-domestic range as the headline figure,
  // since most of this pack's readers are flying domestically to reach
  // Chennai — international fans are pointed to the Planner instead.
  const INDIA_ORIGIN_MARKETS = ["Bangalore", "Mumbai", "New Delhi"];
  const indiaFlights = flights.filter((f) => INDIA_ORIGIN_MARKETS.includes(f.originMarket));
  const indiaFlightRange = indiaFlights.length
    ? {
        low: Math.min(...indiaFlights.map((f) => Number(f.costLow))),
        high: Math.max(...indiaFlights.map((f) => Number(f.costHigh))),
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
      eventName="Border-Gavaskar Trophy"
      status="teaser"
      h1="Real local prices for every leg, and the one cost decision — the four-week gap — that swings the whole trip"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="Every price above is real and free. What's locked is the decision the numbers can't make for you: which single Test is actually worth the trip, why a realistic plan covers two of the three Tests rather than all six weeks of them, and the exact dates two safari permit booking windows open — miss them and the same permit can cost more than double."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        India is one of the cheapest places in the world to watch elite Test cricket, and one of the easiest to
        overspend on by getting the logistics wrong. Three cities, three very different hotel markets, and a
        four-week gap between the second and last Test in this pack mean the honest budget depends far more on
        the shape of your trip than on any single ticket price. We&apos;ve costed Chennai in full below as a
        representative example of what a leg of this trip runs, plus the real local ticket prices for all three
        grounds, exactly as they&apos;re quoted on the ground.
      </p>

      {moderateTotal && (
        <div className="mb-8">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">
            Typical {TRIP_NIGHTS}-night Chennai trip
          </p>
          <p className="text-3xl sm:text-4xl font-black text-white">{formatMoneyRange(moderateTotal.low, moderateTotal.high)}</p>
          <p className="text-xs text-[#6A6A6A] mt-1">
            A 3★ hotel, food, and local transport for {TRIP_NIGHTS} nights, plus a Reserved Stand ticket for
            each of the 5 playing days.{" "}
            <span className="text-[#AAFF00]">Excludes flights</span> — genuinely origin-dependent, see the
            Planner link below. Ticket prices are a 2023/2024 baseline adjusted for inflation, not confirmed 2027
            pricing — see the ticket tiers below.
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
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-1">
            Four ways to do the Chennai leg
          </p>
          <p className="text-xs text-[#6A6A6A] mb-3">
            {TRIP_NIGHTS} nights, hotel + food + local transport + a 5-day ticket
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {profiles.map((p) => {
              const total = stayTotal(p.hotel, p.ticket);
              return (
                <div key={p.label} className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
                  <p className="text-xs font-black tracking-widest uppercase text-white mb-1">{p.label}</p>
                  <p className="text-lg font-black text-[#AAFF00] mb-2">{total ? formatMoneyRange(total.low, total.high) : "—"}</p>
                  <ul className="space-y-1">
                    <li className="text-xs text-[#6A6A6A] pl-3 -indent-3">• {p.hotelNote}</li>
                    {p.ticketNote && <li className="text-xs text-[#6A6A6A] pl-3 -indent-3">• {p.ticketNote}</li>}
                  </ul>
                </div>
              );
            })}
          </div>
        </>
      )}

      <div className="rounded-sm border border-amber-400/30 bg-amber-400/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-amber-400 mb-2">Nagpur and Ahmedabad — use Chennai as your cost guide</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          We&apos;ve costed Chennai in full above as a representative example of what a leg of this trip runs.
          If you&apos;re planning the Nagpur or Ahmedabad leg specifically, use those same hotel-tier ranges as a
          rough guide — Nagpur and Ahmedabad haven&apos;t been independently researched, but they&apos;re
          broadly comparable mid-size Indian markets, so the gap should be modest rather than dramatic. The{" "}
          <Link href={`/event-pack/${eventSlug}/hotels`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
            Where to Stay guide
          </Link>{" "}
          has the real named hotels for all three cities, and the{" "}
          <a href="/planner" className="text-[#AAFF00] hover:text-[#BBFF33] underline">
            Planner
          </a>{" "}
          gives a real flight-cost range from your city.
        </p>
      </div>

      {hasTickets && (
        <>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Test ticket tiers — real stand names across all three grounds</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            {[tier1, tier2, tier3, tier4].filter(Boolean).map((t) => (
              <div key={t!.tier} className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
                <p className="text-xs font-black tracking-widest text-white mb-1">{t!.eventTierLabel}</p>
                <p className="text-lg font-black text-[#AAFF00]">
                  {formatMoneyRange(Math.round(Number(t!.costLow)), Math.round(Number(t!.costHigh)))}
                </p>
              </div>
            ))}
          </div>
          <p className="text-xs text-[#6A6A6A] mb-8">
            2023/2024 baseline (last comparable Tests at these grounds), adjusted +20% for inflation to 2027 — 2027
            Test pricing has not been announced by the BCCI.
          </p>
        </>
      )}

      {destinationBand?.localTravelNote && (
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-4">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Getting around Chennai, cheaply</p>
          <p className="text-sm text-[#A3A3A3] leading-6">{destinationBand.localTravelNote}</p>
        </div>
      )}
      {destinationBand?.foodNote && (
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">A local money-saving trick</p>
          <p className="text-sm text-[#A3A3A3] leading-6">{destinationBand.foodNote}</p>
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Visa, local attractions and day-trips</p>
      <div className="hidden md:block overflow-x-auto rounded-sm border border-[#2A2A2A] mb-3">
        <table className="w-full text-sm border-collapse table-fixed">
          <thead>
            <tr className="bg-[#1A1A1A] text-left">
              <th className="px-4 py-3 text-xs font-black tracking-widest uppercase text-[#AAFF00] w-[30%]">What</th>
              <th className="px-4 py-3 text-xs font-black tracking-widest uppercase text-[#AAFF00] w-[30%]">Price</th>
              <th className="px-4 py-3 text-xs font-black tracking-widest uppercase text-[#AAFF00] w-[40%]">Note</th>
            </tr>
          </thead>
          <tbody>
            {VISA_ATTRACTIONS_DAYTRIP_PRICES.map((r, i) => (
              <tr key={r.item} className={i % 2 === 0 ? "bg-[#141414]" : "bg-[#0A0A0A]"}>
                <td className="px-4 py-3 text-white font-semibold align-top break-words">{r.item}</td>
                <td className="px-4 py-3 text-[#AAFF00] align-top break-words">{r.price}</td>
                <td className="px-4 py-3 text-[#A3A3A3] align-top break-words">{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="md:hidden flex flex-col gap-3 mb-3">
        {VISA_ATTRACTIONS_DAYTRIP_PRICES.map((r) => (
          <div key={r.item} className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
            <p className="text-sm font-black text-white mb-1">{r.item}</p>
            <p className="text-xs font-bold text-[#AAFF00] mb-1">{r.price}</p>
            <p className="text-xs text-[#6A6A6A]">{r.note}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-[#6A6A6A] mb-8">
        Rupee figures are local prices as quoted, not converted.
      </p>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What about flights?</p>
        {indiaFlightRange && (
          <p className="text-sm text-white font-bold mb-2">
            Roughly {formatMoneyRange(indiaFlightRange.low, indiaFlightRange.high)}{" "}
            round-trip, economy, if you&apos;re flying domestically from Bangalore, Mumbai, or Delhi.
          </p>
        )}
        <p className="text-sm text-[#A3A3A3] leading-6 mb-2">
          Flying internationally costs meaningfully more and depends entirely on where you start. Tell
          the Planner where you&apos;re starting from and it will show a real range from your city.
        </p>
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          On top of that, budget{" "}
          <span className="text-[#AAFF00] font-semibold">US$275–355</span> for the two domestic round-trip
          connector flights this trip actually needs: Chennai–Nagpur (no direct route — every real itinerary connects through
          Hyderabad, Mumbai, or Delhi, so build in a real travel day) and Chennai–Ahmedabad (direct, under two
          hours). Covering all three cities means paying for both legs, not just one.
        </p>
        <Link
          href={`/price-radar/${eventSlug}`}
          className="inline-flex items-center px-4 py-2 rounded-sm border border-[#AAFF00] text-[#AAFF00] text-xs font-black hover:bg-[#AAFF00] hover:text-black transition-colors"
        >
          Check full trip costs from your city →
        </Link>
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">If you can only do one Test</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Chennai is the best-value single leg. Chepauk is walkable from Triplicane and Marina Beach, so a
            hotel there removes most of your matchday transport cost and stress, and the ground carries a century
            of history including the only tied Test these two sides have ever played. Nagpur is the cheapest to
            watch but the most expensive in hassle, since the ground sits about 15km out with almost nothing worth
            staying next to. Ahmedabad is the pick only if the scale is the point: 132,000 seats, the last Test of
            the series, and the two Gujarat trips (Gir and the Statue of Unity) that make a Test week into a
            proper holiday.
          </p>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">The four-week gap is the real budget decision</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Chennai ends on 2 February and Ahmedabad starts on 27 February. Flying home and back is a genuine
            option, but most people covering both fill the gap inside India, and that is where the money goes:
            Gir is a 2-day trip with a foreign-national permit alone at ₹15,500–₹17,500, and Tadoba adds a core-zone
            permit of ₹5,800–₹12,800 per vehicle on top of a 2-2.5 hour drive each way. Decide before you book your first flight whether the gap is a
            side trip, a rest stretch, or a return flight home, because improvising it in India tends to mean an
            expensive last-minute domestic fare.
          </p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            The honest practical answer for most people: covering the full six-week span of this pack&apos;s three
            Tests is a luxury very few travellers can actually afford, in cost or in time off work. A two-week
            trip is the realistic unit to plan around, which usually means picking two of the three Tests rather
            than all three. If seeing the world&apos;s biggest cricket stadium and the series&apos; final day are
            on your list, Ahmedabad is the obvious anchor — and it pairs naturally with Ranchi (the 4th Test,
            19&ndash;23 Feb, not covered in this pack), since the two sit inside the same window without the
            four-week gap Chennai and Ahmedabad create on their own.
          </p>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Booking dates that quietly cost money</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Two windows matter most. Safari permits open at fixed lead times: Gir exactly 90 days ahead, and
            Tadoba 120 days ahead. At Tadoba the early window is the expensive one (₹8,800–₹12,800 per vehicle
            against ₹5,800–₹6,800 inside 59 days), so you pay a premium for the certainty of a slot on a popular
            date, and a flexible date booked late is the cheaper gamble. The e-Tourist visa typically clears in about 72 hours, but it only works through{" "}
            <a href="https://indianvisaonline.gov.in/evisa/tvoa.html" target="_blank" rel="noopener noreferrer" className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              33 designated airports
            </a>
            , so apply before you book any flight, not after.
          </p>
        </div>
      )}
    </SpokeShell>
  );
}
